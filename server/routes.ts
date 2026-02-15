import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDownloadSchema } from "@shared/schema";
import { z } from "zod";
import axios from "axios";
import * as cheerio from "cheerio";
import { seed } from "./seed";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed database on startup
  seed();

  app.post('/api/download/process', async (req, res) => {
    try {
      let url = req.body.url;
      if (!url || !url.includes('instagram.com')) {
        return res.status(400).json({ message: "URL inválida. Por favor, use um link do Instagram." });
      }

      // Clean up URL
      url = url.split('?')[0];
      if (!url.endsWith('/')) url += '/';
      
      console.log(`Processing download for URL: ${url}`);

      // Instagram often blocks direct server-side scraping without high-quality proxies.
      // We will try a few different patterns to find the media.
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Pattern 1: Open Graph Tags
      let videoUrl = $('meta[property="og:video"]').attr('content') || 
                     $('meta[property="og:video:secure_url"]').attr('content');
      let imageUrl = $('meta[property="og:image"]').attr('content');
      let type: 'video' | 'image' = videoUrl ? 'video' : 'image';

      // Pattern 2: Script Data Parsing
      if (!videoUrl) {
        const scripts = $('script').map((i, el) => $(el).html()).get();
        for (const scriptContent of scripts) {
          if (!scriptContent) continue;
          
          // Try finding video_url in JSON-like structures
          const videoMatch = scriptContent.match(/"video_url":"([^"]+)"/);
          if (videoMatch && videoMatch[1]) {
            videoUrl = videoMatch[1].replace(/\\u0026/g, '&');
            type = 'video';
            break;
          }
          
          // Try finding display_url if no video
          const imageMatch = scriptContent.match(/"display_url":"([^"]+)"/);
          if (imageMatch && imageMatch[1] && !imageUrl) {
            imageUrl = imageMatch[1].replace(/\\u0026/g, '&');
          }
        }
      }

      // Pattern 3: Embed endpoint fallback
      if (!videoUrl && !imageUrl) {
        try {
          const embedUrl = `${url}embed/captioned/`;
          const embedResponse = await axios.get(embedUrl, {
             headers: { 'User-Agent': 'Mozilla/5.0' }
          });
          const $embed = cheerio.load(embedResponse.data);
          videoUrl = $embed('video').attr('src');
          imageUrl = $embed('img').attr('src');
          if (videoUrl) type = 'video';
          else if (imageUrl) type = 'image';
        } catch (e) {
          console.error('Embed fallback failed');
        }
      }

      const finalUrl = videoUrl || imageUrl;

      if (!finalUrl) {
        await storage.logDownload({ url, status: 'failed', format: 'unknown' });
        return res.status(400).json({ 
          message: "Não foi possível encontrar o vídeo. Isso acontece geralmente com perfis privados ou links protegidos. Tente um link de um perfil público." 
        });
      }

      await storage.logDownload({ url, status: 'success', format: type === 'video' ? 'mp4' : 'jpg' });
      
      res.json({
        url: finalUrl,
        thumbnail: imageUrl,
        filename: `instagram-${type}-${Date.now()}.${type === 'video' ? 'mp4' : 'jpg'}`,
        type: type
      });

    } catch (error: any) {
      console.error('Download error:', error.message);
      await storage.logDownload({ url: req.body.url || 'unknown', status: 'failed', format: 'error' });
      res.status(500).json({ message: "O Instagram bloqueou a conexão temporariamente. Tente novamente em alguns minutos." });
    }
  });

  app.post('/api/tiktok/process', async (req, res) => {
    try {
      const inputSchema = z.object({
        url: z.string().url({ message: "Por favor, insira uma URL válida do TikTok" })
      });
      const parsed = inputSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "URL inválida." });
      }
      let url = parsed.data.url;
      if (!url.includes('tiktok.com') && !url.includes('vm.tiktok.com')) {
        return res.status(400).json({ message: "URL inválida. Por favor, use um link do TikTok." });
      }

      url = url.split('?')[0];

      console.log(`Processing TikTok download for URL: ${url}`);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1',
          'Referer': 'https://www.tiktok.com/'
        },
        timeout: 15000,
        maxRedirects: 5
      });

      const $ = cheerio.load(response.data);

      let videoUrl: string | undefined;
      let imageUrl: string | undefined;
      let type: 'video' | 'image' = 'video';

      videoUrl = $('meta[property="og:video"]').attr('content') ||
                 $('meta[property="og:video:secure_url"]').attr('content');
      imageUrl = $('meta[property="og:image"]').attr('content');

      if (!videoUrl) {
        const scripts = $('script').map((i, el) => $(el).html()).get();
        for (const scriptContent of scripts) {
          if (!scriptContent) continue;

          const downloadMatch = scriptContent.match(/"downloadAddr":"([^"]+)"/);
          if (downloadMatch && downloadMatch[1]) {
            videoUrl = decodeURIComponent(downloadMatch[1].replace(/\\u002F/g, '/').replace(/\\u0026/g, '&'));
            break;
          }

          const playMatch = scriptContent.match(/"playAddr":"([^"]+)"/);
          if (playMatch && playMatch[1]) {
            videoUrl = decodeURIComponent(playMatch[1].replace(/\\u002F/g, '/').replace(/\\u0026/g, '&'));
            break;
          }

          const videoSrcMatch = scriptContent.match(/"video":\s*\{[^}]*"playAddr":\s*"([^"]+)"/);
          if (videoSrcMatch && videoSrcMatch[1]) {
            videoUrl = decodeURIComponent(videoSrcMatch[1].replace(/\\u002F/g, '/').replace(/\\u0026/g, '&'));
            break;
          }
        }
      }

      if (!videoUrl) {
        videoUrl = $('video source').attr('src') || $('video').attr('src');
      }

      const finalUrl = videoUrl || imageUrl;

      if (!finalUrl) {
        await storage.logDownload({ url, status: 'failed', format: 'unknown' });
        return res.status(400).json({
          message: "Não foi possível encontrar o vídeo do TikTok. Verifique se o link está correto e se o vídeo é público. Tente novamente em alguns minutos."
        });
      }

      if (videoUrl) type = 'video';
      else type = 'image';

      await storage.logDownload({ url, status: 'success', format: type === 'video' ? 'mp4' : 'jpg' });

      res.json({
        url: finalUrl,
        thumbnail: imageUrl,
        filename: `tiktok-${type}-${Date.now()}.${type === 'video' ? 'mp4' : 'jpg'}`,
        type: type
      });

    } catch (error: any) {
      console.error('TikTok download error:', error.message);
      await storage.logDownload({ url: req.body.url || 'unknown', status: 'failed', format: 'error' });
      res.status(500).json({ message: "O TikTok bloqueou a conexão temporariamente. Tente novamente em alguns minutos." });
    }
  });

  app.get('/api/tiktok/download', async (req, res) => {
    try {
      let tiktokUrl = req.query.url as string;
      if (!tiktokUrl || (!tiktokUrl.includes('tiktok.com') && !tiktokUrl.includes('vm.tiktok.com'))) {
        return res.status(400).json({ message: "URL inválida do TikTok." });
      }

      tiktokUrl = tiktokUrl.split('?')[0];
      console.log(`TikTok direct download for: ${tiktokUrl}`);

      const browserHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.tiktok.com/'
      };

      const pageResponse = await axios.get(tiktokUrl, {
        headers: browserHeaders,
        timeout: 15000,
        maxRedirects: 5,
      });

      const cookies = pageResponse.headers['set-cookie']?.map((c: string) => c.split(';')[0]).join('; ') || '';

      const $ = cheerio.load(pageResponse.data);
      let videoUrl: string | undefined;

      videoUrl = $('meta[property="og:video"]').attr('content') ||
                 $('meta[property="og:video:secure_url"]').attr('content');

      if (!videoUrl) {
        const scripts = $('script').map((i, el) => $(el).html()).get();
        for (const scriptContent of scripts) {
          if (!scriptContent) continue;
          const downloadMatch = scriptContent.match(/"downloadAddr":"([^"]+)"/);
          if (downloadMatch && downloadMatch[1]) {
            videoUrl = decodeURIComponent(downloadMatch[1].replace(/\\u002F/g, '/').replace(/\\u0026/g, '&'));
            break;
          }
          const playMatch = scriptContent.match(/"playAddr":"([^"]+)"/);
          if (playMatch && playMatch[1]) {
            videoUrl = decodeURIComponent(playMatch[1].replace(/\\u002F/g, '/').replace(/\\u0026/g, '&'));
            break;
          }
        }
      }

      if (!videoUrl) {
        videoUrl = $('video source').attr('src') || $('video').attr('src');
      }

      if (!videoUrl) {
        return res.status(400).json({ message: "Não foi possível encontrar o vídeo. Verifique se o link é público." });
      }

      console.log(`Streaming TikTok video from CDN...`);
      const mediaResponse = await axios.get(videoUrl, {
        responseType: 'stream',
        headers: {
          'User-Agent': browserHeaders['User-Agent'],
          'Referer': 'https://www.tiktok.com/',
          'Accept': '*/*',
          'Accept-Encoding': 'identity',
          'Cookie': cookies,
        },
        timeout: 30000,
        maxRedirects: 5,
      });

      const filename = `tiktok-video-${Date.now()}.mp4`;
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
        console.error('TikTok stream error:', err.message);
        if (!res.headersSent) {
          res.status(500).json({ message: "Erro ao baixar o vídeo." });
        }
      });

    } catch (error: any) {
      console.error('TikTok download error:', error.message);
      if (!res.headersSent) {
        res.status(500).json({ message: "Erro ao processar o download do TikTok. Tente novamente." });
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

  return httpServer;
}
