import type { Express } from "express";
import { storage } from "./storage";
import { z } from "zod";
import axios from "axios";
import * as cheerio from "cheerio";
import { seed } from "./seed";
import { cmsStorage } from "./cms-storage";

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
  'Cache-Control': 'max-age=0',
};

function extractShortcode(url: string): string | null {
  const patterns = [
    /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/reels\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/tv\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/stories\/[^/]+\/(\d+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractUsername(url: string): string | null {
  const match = url.match(/instagram\.com\/([A-Za-z0-9_.]+)\/?(\?|$)/);
  return match ? match[1] : null;
}

interface MediaItem {
  url: string;
  thumbnail?: string;
  type: 'video' | 'image';
}

async function tryEmbedExtraction(url: string): Promise<MediaItem[]> {
  const shortcode = extractShortcode(url);
  if (!shortcode) return [];

  try {
    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
    const response = await axios.get(embedUrl, {
      headers: {
        ...BROWSER_HEADERS,
        'Referer': 'https://www.instagram.com/',
      },
      timeout: 15000,
      maxRedirects: 5,
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const items: MediaItem[] = [];

    const videoSrc = $('video source').attr('src') || $('video').attr('src');
    if (videoSrc) {
      const posterSrc = $('video').attr('poster') || $('img.EmbeddedMediaImage').attr('src');
      items.push({ url: videoSrc, thumbnail: posterSrc || undefined, type: 'video' });
    }

    if (items.length === 0) {
      const imgSrc = $('img.EmbeddedMediaImage').attr('src') ||
                     $('img[srcset]').first().attr('src') ||
                     $('img').filter((_, el) => {
                       const src = $(el).attr('src') || '';
                       return src.includes('cdninstagram') || src.includes('fbcdn');
                     }).first().attr('src');
      if (imgSrc) {
        items.push({ url: imgSrc, type: 'image' });
      }
    }

    if (items.length === 0 || !items.some(i => i.type === 'video')) {
      const videoUrlMatch = html.match(/video_url\\?":\\?"(https?:.*?)(?:\\?"|$)/);
      if (videoUrlMatch && videoUrlMatch[1]) {
        const videoUrl = videoUrlMatch[1]
          .replace(/\\\\\//g, '/')
          .replace(/\\\//g, '/')
          .replace(/\\u0026/g, '&')
          .replace(/\\u00253D/g, '%3D');
        items.length = 0;
        items.push({ url: videoUrl, type: 'video' });
      }

      if (items.length === 0) {
        const displayMatch = html.match(/display_url\\?":\\?"(https?:.*?)(?:\\?"|$)/);
        if (displayMatch && displayMatch[1]) {
          const imgUrl = displayMatch[1]
            .replace(/\\\\\//g, '/')
            .replace(/\\\//g, '/')
            .replace(/\\u0026/g, '&');
          items.push({ url: imgUrl, type: 'image' });
        }
      }
    }

    return items;
  } catch (e: any) {
    console.log('Embed extraction failed:', e.message);
    return [];
  }
}

async function tryDirectPageExtraction(url: string): Promise<MediaItem[]> {
  try {
    const response = await axios.get(url, {
      headers: BROWSER_HEADERS,
      timeout: 15000,
      maxRedirects: 5,
    });

    const $ = cheerio.load(response.data);
    const items: MediaItem[] = [];

    let videoUrl = $('meta[property="og:video"]').attr('content') ||
                   $('meta[property="og:video:secure_url"]').attr('content');
    const imageUrl = $('meta[property="og:image"]').attr('content');

    if (videoUrl) {
      items.push({ url: videoUrl, thumbnail: imageUrl || undefined, type: 'video' });
    } else if (imageUrl) {
      items.push({ url: imageUrl, type: 'image' });
    }

    if (items.length === 0) {
      const scripts = $('script').map((_, el) => $(el).html()).get();
      for (const scriptContent of scripts) {
        if (!scriptContent) continue;

        const videoMatch = scriptContent.match(/video_url\\?":\\?"(https?:.*?)(?:\\?"|$)/) ||
                            scriptContent.match(/"video_url"\s*:\s*"([^"]+)"/);
        if (videoMatch && videoMatch[1]) {
          videoUrl = videoMatch[1]
            .replace(/\\\\\//g, '/')
            .replace(/\\\//g, '/')
            .replace(/\\u0026/g, '&')
            .replace(/\\u00253D/g, '%3D');
          items.push({ url: videoUrl, thumbnail: imageUrl || undefined, type: 'video' });
          break;
        }

        const sidecarMatch = scriptContent.match(/"edge_sidecar_to_children"\s*:\s*(\{[^}]+\})/);
        if (sidecarMatch) {
          const displayUrls = scriptContent.match(/"display_url"\s*:\s*"([^"]+)"/g);
          if (displayUrls) {
            for (const m of displayUrls) {
              const u = m.match(/"display_url"\s*:\s*"([^"]+)"/);
              if (u) items.push({ url: u[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/'), type: 'image' });
            }
          }
        }

        if (items.length === 0) {
          const displayMatch = scriptContent.match(/"display_url"\s*:\s*"([^"]+)"/);
          if (displayMatch && displayMatch[1]) {
            items.push({ url: displayMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/'), type: 'image' });
          }
        }
      }
    }

    return items;
  } catch (e: any) {
    console.log('Direct page extraction failed:', e.message);
    return [];
  }
}

async function tryGraphQLExtraction(url: string): Promise<MediaItem[]> {
  const shortcode = extractShortcode(url);
  if (!shortcode) return [];

  try {
    const graphqlUrl = `https://www.instagram.com/graphql/query/?query_hash=b3055c01b4b222b8a47dc12b090e4e64&variables=${encodeURIComponent(JSON.stringify({ shortcode, child_comment_count: 0, fetch_comment_count: 0, parent_comment_count: 0, has_threaded_comments: false }))}`;
    const response = await axios.get(graphqlUrl, {
      headers: {
        ...BROWSER_HEADERS,
        'X-Requested-With': 'XMLHttpRequest',
        'X-IG-App-ID': '936619743392459',
      },
      timeout: 15000,
    });

    const data = response.data?.data?.shortcode_media;
    if (!data) return [];

    const items: MediaItem[] = [];

    if (data.__typename === 'GraphSidecar' && data.edge_sidecar_to_children?.edges) {
      for (const edge of data.edge_sidecar_to_children.edges) {
        const node = edge.node;
        if (node.is_video && node.video_url) {
          items.push({ url: node.video_url, thumbnail: node.display_url, type: 'video' });
        } else if (node.display_url) {
          items.push({ url: node.display_url, type: 'image' });
        }
      }
    } else if (data.is_video && data.video_url) {
      items.push({ url: data.video_url, thumbnail: data.display_url, type: 'video' });
    } else if (data.display_url) {
      items.push({ url: data.display_url, type: 'image' });
    }

    return items;
  } catch (e: any) {
    console.log('GraphQL extraction failed:', e.message);
    return [];
  }
}

async function tryJsonApiExtraction(url: string): Promise<MediaItem[]> {
  const shortcode = extractShortcode(url);
  if (!shortcode) return [];

  try {
    const apiUrl = `https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`;
    const response = await axios.get(apiUrl, {
      headers: {
        ...BROWSER_HEADERS,
        'X-IG-App-ID': '936619743392459',
        'X-Requested-With': 'XMLHttpRequest',
      },
      timeout: 15000,
    });

    const items = response.data?.items || [];
    const results: MediaItem[] = [];

    for (const item of items) {
      if (item.carousel_media) {
        for (const media of item.carousel_media) {
          if (media.video_versions && media.video_versions.length > 0) {
            const best = media.video_versions[0];
            results.push({
              url: best.url,
              thumbnail: media.image_versions2?.candidates?.[0]?.url,
              type: 'video',
            });
          } else if (media.image_versions2?.candidates?.length > 0) {
            results.push({
              url: media.image_versions2.candidates[0].url,
              type: 'image',
            });
          }
        }
      } else if (item.video_versions && item.video_versions.length > 0) {
        const best = item.video_versions[0];
        results.push({
          url: best.url,
          thumbnail: item.image_versions2?.candidates?.[0]?.url,
          type: 'video',
        });
      } else if (item.image_versions2?.candidates?.length > 0) {
        results.push({
          url: item.image_versions2.candidates[0].url,
          type: 'image',
        });
      }
    }

    return results;
  } catch (e: any) {
    console.log('JSON API extraction failed:', e.message);
    return [];
  }
}

async function tryProfilePictureExtraction(url: string): Promise<MediaItem[]> {
  const username = extractUsername(url);
  if (!username) return [];

  try {
    const response = await axios.get(`https://www.instagram.com/${username}/`, {
      headers: BROWSER_HEADERS,
      timeout: 15000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    let profilePicUrl = $('meta[property="og:image"]').attr('content');

    if (!profilePicUrl) {
      const hdMatch = html.match(/"profile_pic_url_hd"\s*:\s*"([^"]+)"/);
      if (hdMatch) {
        profilePicUrl = hdMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
      }
    }

    if (!profilePicUrl) {
      const picMatch = html.match(/"profile_pic_url"\s*:\s*"([^"]+)"/);
      if (picMatch) {
        profilePicUrl = picMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
      }
    }

    if (profilePicUrl) {
      const hdUrl = profilePicUrl
        .replace(/\/s150x150\//, '/s1080x1080/')
        .replace(/\/s320x320\//, '/s1080x1080/')
        .replace(/\/s640x640\//, '/s1080x1080/');
      return [{ url: hdUrl, thumbnail: profilePicUrl, type: 'image' }];
    }

    return [];
  } catch (e: any) {
    console.log('Profile picture extraction failed:', e.message);
    return [];
  }
}

async function tryAlternateEmbedExtraction(url: string): Promise<MediaItem[]> {
  const shortcode = extractShortcode(url);
  if (!shortcode) return [];

  try {
    const response = await axios.get(`https://www.instagram.com/p/${shortcode}/embed/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html',
      },
      timeout: 15000,
    });

    const html = response.data;
    const items: MediaItem[] = [];

    const videoUrlMatch = html.match(/video_url\\?":\\?"(https?:.*?)(?:\\?"|$)/);
    if (videoUrlMatch && videoUrlMatch[1]) {
      const cleanUrl = videoUrlMatch[1]
        .replace(/\\\\\//g, '/')
        .replace(/\\\//g, '/')
        .replace(/\\u0026/g, '&')
        .replace(/\\u00253D/g, '%3D');
      items.push({ url: cleanUrl, type: 'video' });
    }

    if (items.length === 0) {
      const displayMatch = html.match(/display_url\\?":\\?"(https?:.*?)(?:\\?"|$)/);
      if (displayMatch && displayMatch[1]) {
        const cleanUrl = displayMatch[1]
          .replace(/\\\\\//g, '/')
          .replace(/\\\//g, '/')
          .replace(/\\u0026/g, '&');
        items.push({ url: cleanUrl, type: 'image' });
      }
    }

    if (items.length === 0) {
      const $ = cheerio.load(html);
      const videoSrc = $('video').attr('src') || $('video source').attr('src');
      if (videoSrc) {
        items.push({ url: videoSrc, type: 'video' });
      } else {
        $('img').each((_, el) => {
          const src = $(el).attr('src') || '';
          if ((src.includes('cdninstagram') || src.includes('fbcdn')) && !src.includes('s150x150') && !src.includes('emoji')) {
            items.push({ url: src, type: 'image' });
          }
        });
      }
    }

    return items;
  } catch (e: any) {
    console.log('Alternate embed extraction failed:', e.message);
    return [];
  }
}

function getErrorMessage(toolType?: string): string {
  const messages: Record<string, string> = {
    'stories': 'Não foi possível acessar o Story. Verifique se o perfil é público e se o Story ainda está disponível (Stories expiram em 24h).',
    'private': 'Conteúdo privado não pôde ser acessado. Nossa ferramenta só consegue processar links de conteúdo público ou links diretos de mídia.',
    'profile-picture': 'Não foi possível encontrar a foto de perfil. Verifique se o nome de usuário está correto e se o perfil existe.',
  };
  return messages[toolType || ''] || 'Não foi possível encontrar a mídia. Verifique se o link está correto e se o perfil é público. O Instagram pode estar bloqueando temporariamente, tente novamente em alguns minutos.';
}

export async function registerRoutes(
  app: Express
): Promise<void> {
  seed();

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

      console.log(`Processing download for URL: ${url} (tool: ${toolType})`);

      let allItems: MediaItem[] = [];
      const isReelUrl = /\/reel(s)?\//.test(url);
      const expectsVideo = isReelUrl || toolType === 'video' || toolType === 'reels' || toolType === 'audio';

      if (toolType === 'profile-picture') {
        allItems = await tryProfilePictureExtraction(url);
        if (allItems.length === 0) {
          allItems = await tryDirectPageExtraction(url);
        }
      } else {
        const strategies: { name: string; fn: () => Promise<MediaItem[]> }[] = [
          { name: 'JSON API extraction', fn: () => tryJsonApiExtraction(url) },
          { name: 'GraphQL extraction', fn: () => tryGraphQLExtraction(url) },
          { name: 'Embed extraction', fn: () => tryEmbedExtraction(url) },
          { name: 'Alternate embed extraction', fn: () => tryAlternateEmbedExtraction(url) },
          { name: 'Direct page extraction', fn: () => tryDirectPageExtraction(url) },
        ];

        if (isReelUrl) {
          const reelUrl = url.replace('/reel/', '/p/').replace('/reels/', '/p/');
          strategies.push({ name: 'Reel URL variant', fn: () => tryEmbedExtraction(reelUrl) });
        }

        for (let i = 0; i < strategies.length; i++) {
          const strategy = strategies[i];
          console.log(`Strategy ${i + 1}: ${strategy.name}...`);
          allItems = await strategy.fn();

          if (allItems.length > 0) {
            const hasVideo = allItems.some(item => item.type === 'video');
            if (expectsVideo && !hasVideo) {
              console.log(`Strategy ${i + 1} returned only images for a video URL, trying next...`);
              continue;
            }
            break;
          }
        }

        if (allItems.length === 0 && expectsVideo) {
          console.log('All video strategies failed, retrying for any media...');
          for (const strategy of strategies) {
            allItems = await strategy.fn();
            if (allItems.length > 0) break;
          }
        }
      }

      if (allItems.length === 0) {
        await storage.logDownload({ url, status: 'failed', format: 'unknown' });
        return res.status(400).json({
          message: getErrorMessage(toolType),
        });
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
      try {
        urlObj = new URL(imageUrl);
      } catch {
        return res.status(400).json({ message: "URL inválida." });
      }

      if (urlObj.protocol !== 'https:') {
        return res.status(400).json({ message: "Protocolo não permitido." });
      }

      const isAllowed = allowedDomains.some(domain => urlObj.hostname.endsWith('.' + domain));
      if (!isAllowed) {
        return res.status(403).json({ message: "Domínio não permitido." });
      }

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
      if (!res.headersSent) {
        res.status(500).json({ message: "Erro ao carregar imagem." });
      }
    }
  });

  app.get('/api/proxy-download', async (req, res) => {
    try {
      const downloadUrl = req.query.url as string;
      const filename = (req.query.filename as string) || 'download.mp4';

      if (!downloadUrl) {
        return res.status(400).json({ message: "URL de download não fornecida." });
      }

      const allowedDomains = ['instagram.com', 'cdninstagram.com', 'fbcdn.net'];
      let urlObj: URL;
      try {
        urlObj = new URL(downloadUrl);
      } catch {
        return res.status(400).json({ message: "URL inválida." });
      }

      if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
        return res.status(400).json({ message: "Protocolo não permitido." });
      }
      const isAllowed = allowedDomains.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain));
      if (!isAllowed) {
        return res.status(403).json({ message: "Domínio não permitido." });
      }

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
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }
      res.setHeader('Cache-Control', 'no-cache');

      mediaResponse.data.pipe(res);

      mediaResponse.data.on('error', (err: Error) => {
        console.error('Stream error:', err.message);
        if (!res.headersSent) {
          res.status(500).json({ message: "Erro ao baixar o arquivo." });
        }
      });

    } catch (error: any) {
      console.error('Proxy download error:', error.message);
      if (!res.headersSent) {
        res.status(500).json({ message: "Erro ao processar o download. Tente novamente." });
      }
    }
  });

  app.get('/api/stats', async (req, res) => {
    const recent = await storage.getRecentDownloads();
    res.json({
      totalDownloads: recent.length,
      recentDownloads: recent
    });
  });

}
