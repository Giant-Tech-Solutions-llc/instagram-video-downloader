import express, { type Request, Response, NextFunction } from "express";
import { storage } from "../api/lib/storage";
import { seed } from "../api/lib/seed";
import { cmsStorage } from "../api/lib/cms-storage";
import { extractMedia, getErrorMessage, type MediaItem } from "../api/lib/instagram-extractor";
import { hasSessionAuth } from "../api/lib/instagram-http";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        const jsonStr = JSON.stringify(capturedJsonResponse);
        logLine += ` :: ${jsonStr.length > 200 ? jsonStr.slice(0, 200) + '...' : jsonStr}`;
      }
      const formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      console.log(`${formattedTime} [express] ${logLine}`);
    }
  });

  next();
});

async function registerRoutes() {
  await seed();

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const post = await cmsStorage.getPostBySlug(req.params.slug);
      if (!post || post.status !== 'published') {
        return res.status(404).json({ message: "Post não encontrado." });
      }
      const cats = await cmsStorage.getCategories();
      const cat = cats.find(c => c.id === post.categoryId);
      res.json({
        ...post,
        authorName: "Equipe Baixar Vídeo",
        categoryName: cat?.name || "",
        categorySlug: cat?.slug || "",
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao carregar post." });
    }
  });

  app.get("/api/blog/posts", async (req, res) => {
    try {
      const { page, limit, category } = req.query;
      const result = await cmsStorage.getPublishedPosts({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        categorySlug: category as string,
      });
      const cats = await cmsStorage.getCategories();
      const postsWithDetails = result.posts.map(post => {
        const cat = cats.find(c => c.id === post.categoryId);
        return {
          ...post,
          authorName: "Equipe Baixar Vídeo",
          categoryName: cat?.name || "",
          categorySlug: cat?.slug || "",
        };
      });
      res.json({ posts: postsWithDetails, total: result.total });
    } catch (error) {
      res.status(500).json({ message: "Erro ao carregar posts." });
    }
  });

  app.get("/api/blog/categories", async (_req, res) => {
    try {
      const cats = await cmsStorage.getCategories();
      res.json(cats);
    } catch (error) {
      res.status(500).json({ message: "Erro ao carregar categorias." });
    }
  });

  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const { posts } = await cmsStorage.getPublishedPosts({ limit: 1000 });
      const baseUrl = "https://baixarvideo.com";
      const staticPages = [
        { url: "/", priority: "1.0", changefreq: "daily" },
        { url: "/blog", priority: "0.8", changefreq: "daily" },
        { url: "/baixar-reels-instagram", priority: "0.9", changefreq: "weekly" },
        { url: "/baixar-stories-instagram", priority: "0.9", changefreq: "weekly" },
        { url: "/baixar-fotos-instagram", priority: "0.9", changefreq: "weekly" },
        { url: "/baixar-foto-perfil-instagram", priority: "0.8", changefreq: "weekly" },
        { url: "/extrair-audio-instagram", priority: "0.8", changefreq: "weekly" },
        { url: "/como-funciona", priority: "0.6", changefreq: "monthly" },
        { url: "/contato", priority: "0.5", changefreq: "monthly" },
        { url: "/termos", priority: "0.3", changefreq: "yearly" },
        { url: "/privacidade", priority: "0.3", changefreq: "yearly" },
      ];
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      for (const page of staticPages) {
        xml += `  <url>\n    <loc>${baseUrl}${page.url}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
      }
      for (const post of posts) {
        const lastmod = post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : '';
        xml += `  <url>\n    <loc>${baseUrl}/blog/${post.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      }
      xml += '</urlset>';
      res.set('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      res.status(500).send("Error generating sitemap");
    }
  });

  app.post('/api/download/process', async (req, res) => {
    try {
      let url = req.body.url;
      const toolType = req.body.toolType || '';

      if (!url) {
        return res.status(400).json({ message: "URL inválida. Por favor, use um link do Instagram." });
      }

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(url);
      } catch {
        return res.status(400).json({ message: "URL inválida. Por favor, use um link do Instagram." });
      }

      const allowedHosts = ['instagram.com', 'www.instagram.com', 'm.instagram.com'];
      if (!allowedHosts.includes(parsedUrl.hostname)) {
        return res.status(400).json({ message: "URL inválida. Por favor, use um link do Instagram." });
      }

      url = url.split('?')[0];
      if (!url.endsWith('/')) url += '/';

      const { items: allItems, warning } = await extractMedia(url, toolType);

      if (allItems.length === 0) {
        await storage.logDownload({ url, status: 'failed', format: 'unknown' });
        return res.status(400).json({ message: getErrorMessage(toolType) });
      }

      const uniqueItems = allItems.filter((item, index, self) =>
        index === self.findIndex(t => t.url === item.url)
      );

      const primary = uniqueItems[0];
      const format = primary.type === 'video' ? 'mp4' : 'jpg';
      await storage.logDownload({ url, status: 'success', format });

      const response: any = {
        url: primary.url,
        thumbnail: primary.thumbnail || (uniqueItems.find(i => i.type === 'image')?.url),
        filename: `instagram-${primary.type}-${Date.now()}.${format}`,
        type: primary.type,
        ...(warning && { warning }),
      };

      if (uniqueItems.length > 1) {
        response.items = uniqueItems.map((item, i) => ({
          url: item.url,
          thumbnail: item.thumbnail,
          filename: `instagram-${item.type}-${Date.now()}-${i + 1}.${item.type === 'video' ? 'mp4' : 'jpg'}`,
          type: item.type,
        }));
      }

      console.log(`Success: Found ${uniqueItems.length} media item(s) for ${url}`);
      res.json(response);
    } catch (error: any) {
      console.error('Download error:', error.message);
      await storage.logDownload({ url: req.body.url || 'unknown', status: 'failed', format: 'error' });
      res.status(500).json({ message: "Erro temporário ao processar o link. O Instagram pode estar bloqueando conexões. Tente novamente em alguns minutos." });
    }
  });

  app.get('/api/proxy-image', async (req, res) => {
    try {
      const imageUrl = req.query.url as string;
      if (!imageUrl || imageUrl.length > 2000) {
        return res.status(400).json({ message: "URL não fornecida ou inválida." });
      }
      const allowedDomains = ['cdninstagram.com', 'fbcdn.net'];
      let urlObj: URL;
      try { urlObj = new URL(imageUrl); } catch { return res.status(400).json({ message: "URL inválida." }); }
      if (urlObj.protocol !== 'https:') { return res.status(400).json({ message: "Protocolo não permitido." }); }
      const isAllowed = allowedDomains.some(domain => urlObj.hostname.endsWith('.' + domain));
      if (!isAllowed) { return res.status(403).json({ message: "Domínio não permitido." }); }

      const imageResponse = await axios.get(imageUrl, {
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.instagram.com/',
          'Accept': 'image/*',
        },
        timeout: 10000,
        maxContentLength: 10 * 1024 * 1024,
        maxBodyLength: 10 * 1024 * 1024,
      });

      const contentType = imageResponse.headers['content-type'] || 'image/jpeg';
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.some(t => contentType.startsWith(t))) {
        return res.status(400).json({ message: "Tipo de conteúdo não permitido." });
      }
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      imageResponse.data.pipe(res);
    } catch (error: any) {
      console.error('Proxy image error:', error.message);
      if (!res.headersSent) { res.status(500).json({ message: "Erro ao carregar imagem." }); }
    }
  });

  app.get('/api/proxy-download', async (req, res) => {
    try {
      const downloadUrl = req.query.url as string;
      const filename = (req.query.filename as string) || 'download.mp4';
      if (!downloadUrl) { return res.status(400).json({ message: "URL de download não fornecida." }); }

      const allowedDomains = ['instagram.com', 'cdninstagram.com', 'fbcdn.net'];
      let urlObj: URL;
      try { urlObj = new URL(downloadUrl); } catch { return res.status(400).json({ message: "URL inválida." }); }
      if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') { return res.status(400).json({ message: "Protocolo não permitido." }); }
      const isAllowed = allowedDomains.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain));
      if (!isAllowed) { return res.status(403).json({ message: "Domínio não permitido." }); }

      const mediaResponse = await axios.get(downloadUrl, {
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.instagram.com/',
          'Accept': '*/*',
          'Accept-Encoding': 'identity',
        },
        timeout: 30000,
        maxRedirects: 5,
      });

      const contentType = mediaResponse.headers['content-type'] || 'video/mp4';
      const contentLength = mediaResponse.headers['content-length'];
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      if (contentLength) { res.setHeader('Content-Length', contentLength); }
      res.setHeader('Cache-Control', 'no-cache');
      mediaResponse.data.pipe(res);
      mediaResponse.data.on('error', (err: Error) => {
        console.error('Stream error:', err.message);
        if (!res.headersSent) { res.status(500).json({ message: "Erro ao baixar o arquivo." }); }
      });
    } catch (error: any) {
      console.error('Proxy download error:', error.message);
      if (!res.headersSent) { res.status(500).json({ message: "Erro ao processar o download. Tente novamente." }); }
    }
  });

  app.get('/api/stats', async (req, res) => {
    const recent = await storage.getRecentDownloads();
    res.json({ totalDownloads: recent.length, recentDownloads: recent });
  });
}

async function main() {
  await registerRoutes();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) return;
    return res.status(status).json({ message });
  });

  const distPath = path.resolve(__dirname, "../client/dist");
  app.use(express.static(distPath));
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  const port = 5000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })} [express] serving on port ${port}`);
  });
}

process.on('SIGTERM', () => { });
process.on('SIGHUP', () => { });

main().catch(console.error);
