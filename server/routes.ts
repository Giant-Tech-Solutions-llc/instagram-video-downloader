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
      const url = req.body.url;
      if (!url || !url.includes('instagram.com')) {
        return res.status(400).json({ message: "URL inválida. Por favor, use um link do Instagram." });
      }

      console.log(`Processing download for URL: ${url}`);

      // Basic scraping logic
      // Note: Instagram is very aggressive with blocking scrapers. 
      // In a real production app, we would use a rotating proxy service or a dedicated API.
      // For this demo, we'll try a direct fetch with headers.
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        }
      });

      const $ = cheerio.load(response.data);
      
      // Try to find og:video
      let videoUrl = $('meta[property="og:video"]').attr('content');
      let imageUrl = $('meta[property="og:image"]').attr('content');
      let type = 'video';

      if (!videoUrl) {
         // Fallback logic or error if strictly video downloader
         // Sometimes it's just an image post
         if (imageUrl) {
             type = 'image';
             videoUrl = imageUrl; // Treat image as the "video" url for download purpose
         } else {
             // Deep search for JSON data in scripts
             const scriptContent = $('script').map((i, el) => $(el).html()).get().join(' ');
             const videoMatch = scriptContent.match(/"video_url":"([^"]+)"/);
             if (videoMatch && videoMatch[1]) {
                 videoUrl = videoMatch[1].replace(/\\u0026/g, '&');
             }
         }
      }

      if (!videoUrl) {
        await storage.logDownload({ url, status: 'failed', format: 'unknown' });
        return res.status(400).json({ message: "Não foi possível encontrar o vídeo. O perfil pode ser privado ou o link expirou." });
      }

      await storage.logDownload({ url, status: 'success', format: type === 'video' ? 'mp4' : 'jpg' });
      
      res.json({
        url: videoUrl,
        thumbnail: imageUrl,
        filename: `instagram-${type}-${Date.now()}.${type === 'video' ? 'mp4' : 'jpg'}`,
        type: type
      });

    } catch (error) {
      console.error('Download error:', error);
      await storage.logDownload({ url: req.body.url || 'unknown', status: 'failed', format: 'error' });
      res.status(500).json({ message: "Erro ao processar o vídeo. Tente novamente mais tarde." });
    }
  });

  app.get('/api/stats', async (req, res) => {
    const recent = await storage.getRecentDownloads();
    res.json({
      totalDownloads: recent.length, // approximation
      recentDownloads: recent
    });
  });

  return httpServer;
}
