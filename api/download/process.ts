// v2 - rebuilt 2026-03-03
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractMedia, getErrorMessage } from '../_lib/instagram-extractor';
import type { MediaItem } from '../_lib/instagram-extractor';

const ALLOWED_HOSTS = ['instagram.com', 'www.instagram.com', 'm.instagram.com'];
const INVALID_URL_MSG = "URL inválida. Por favor, use um link do Instagram.";
const SERVER_ERROR_MSG = "Erro temporário ao processar o link. O Instagram pode estar bloqueando conexões. Tente novamente em alguns minutos.";

function normalizeUrl(raw: string): string {
  let cleaned = raw.split('?')[0];
  if (!cleaned.endsWith('/')) cleaned += '/';
  return cleaned;
}

function buildFilename(item: MediaItem, index?: number): string {
  const ext = item.type === 'video' ? 'mp4' : 'jpg';
  const suffix = index !== undefined ? `-${index + 1}` : '';
  return `instagram-${item.type}-${Date.now()}${suffix}.${ext}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const rawUrl = req.body?.url;
    const toolType = req.body?.toolType || '';

    if (!rawUrl) {
      return res.status(400).json({ message: INVALID_URL_MSG });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      return res.status(400).json({ message: INVALID_URL_MSG });
    }

    if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
      return res.status(400).json({ message: INVALID_URL_MSG });
    }

    const url = normalizeUrl(rawUrl);
    const { items: allItems, warning } = await extractMedia(url, toolType);

    if (allItems.length === 0) {
      return res.status(400).json({ message: getErrorMessage(toolType) });
    }

    const uniqueItems = allItems.filter(
      (item: MediaItem, idx: number, arr: MediaItem[]) =>
        idx === arr.findIndex((t) => t.url === item.url)
    );

    const primary = uniqueItems[0];

    const result: Record<string, unknown> = {
      url: primary.url,
      thumbnail: primary.thumbnail || uniqueItems.find((i) => i.type === 'image')?.url,
      filename: buildFilename(primary),
      type: primary.type,
    };

    if (warning) {
      result.warning = warning;
    }

    if (uniqueItems.length > 1) {
      result.items = uniqueItems.map((item: MediaItem, i: number) => ({
        url: item.url,
        thumbnail: item.thumbnail,
        filename: buildFilename(item, i),
        type: item.type,
      }));
    }

    console.log(`OK: ${uniqueItems.length} media item(s) for ${url}`);
    return res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Download handler error:', msg);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}
