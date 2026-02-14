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

  app.get('/api/stats', async (req, res) => {
    const recent = await storage.getRecentDownloads();
    res.json({
      totalDownloads: recent.length,
      recentDownloads: recent
    });
  });

  return httpServer;
}
