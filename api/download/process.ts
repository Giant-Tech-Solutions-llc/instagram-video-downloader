import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractMedia, getErrorMessage, type MediaItem } from '../_lib/instagram-extractor';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    let url = req.body?.url;
    const toolType = req.body?.toolType || '';

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
      return res.status(400).json({
        message: getErrorMessage(toolType),
      });
    }

    const uniqueItems = allItems.filter((item: MediaItem, index: number, self: MediaItem[]) =>
      index === self.findIndex(t => t.url === item.url)
    );

    const primary = uniqueItems[0];
    const format = primary.type === 'video' ? 'mp4' : 'jpg';

    const response: any = {
      url: primary.url,
      thumbnail: primary.thumbnail || (uniqueItems.find(i => i.type === 'image')?.url),
      filename: `instagram-${primary.type}-${Date.now()}.${format}`,
      type: primary.type,
      ...(warning && { warning }),
    };

    if (uniqueItems.length > 1) {
      response.items = uniqueItems.map((item: MediaItem, i: number) => ({
        url: item.url,
        thumbnail: item.thumbnail,
        filename: `instagram-${item.type}-${Date.now()}-${i + 1}.${item.type === 'video' ? 'mp4' : 'jpg'}`,
        type: item.type,
      }));
    }

    console.log(`Success: Found ${uniqueItems.length} media item(s) for ${url}`);
    return res.json(response);

  } catch (error: any) {
    console.error('Download error:', error.message);
    return res.status(500).json({ message: "Erro temporário ao processar o link. O Instagram pode estar bloqueando conexões. Tente novamente em alguns minutos." });
  }
}
