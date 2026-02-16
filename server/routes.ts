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
  seed();

  app.post('/api/download/process', async (req, res) => {
    try {
      let url = req.body.url;
      if (!url || !url.includes('instagram.com')) {
        return res.status(400).json({ message: "URL inválida. Por favor, use um link do Instagram." });
      }

      url = url.split('?')[0];
      if (!url.endsWith('/')) url += '/';
      
      console.log(`Processing download for URL: ${url}`);

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
      
      let videoUrl = $('meta[property="og:video"]').attr('content') || 
                     $('meta[property="og:video:secure_url"]').attr('content');
      let imageUrl = $('meta[property="og:image"]').attr('content');
      let type: 'video' | 'image' = videoUrl ? 'video' : 'image';

      if (!videoUrl) {
        const scripts = $('script').map((i, el) => $(el).html()).get();
        for (const scriptContent of scripts) {
          if (!scriptContent) continue;
          
          const videoMatch = scriptContent.match(/"video_url":"([^"]+)"/);
          if (videoMatch && videoMatch[1]) {
            videoUrl = videoMatch[1].replace(/\\u0026/g, '&');
            type = 'video';
            break;
          }
          
          const imageMatch = scriptContent.match(/"display_url":"([^"]+)"/);
          if (imageMatch && imageMatch[1] && !imageUrl) {
            imageUrl = imageMatch[1].replace(/\\u0026/g, '&');
          }
        }
      }

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
