import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
      return res.status(500).json({ message: "Erro ao carregar imagem." });
    }
  }
}
