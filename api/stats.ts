import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './_lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const recent = await storage.getRecentDownloads();
  return res.json({
    totalDownloads: recent.length,
    recentDownloads: recent
  });
}
