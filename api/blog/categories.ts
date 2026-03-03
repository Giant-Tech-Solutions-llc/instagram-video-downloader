import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cmsStorage } from '../lib/cms-storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const cats = await cmsStorage.getCategories();
    return res.json(cats);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao carregar categorias." });
  }
}
