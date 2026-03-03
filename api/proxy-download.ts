import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
      return res.status(500).json({ message: "Erro ao processar o download. Tente novamente." });
    }
  }
}
