import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cmsStorage } from '../../../lib/cms-storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const slug = req.query.slug as string;

  if (!slug) {
    return res.status(400).json({ message: "Slug não fornecido." });
  }

  try {
    const post = await cmsStorage.getPostBySlug(slug);
    if (!post || post.status !== 'published') {
      return res.status(404).json({ message: "Post não encontrado." });
    }

    const cats = await cmsStorage.getCategories();
    const cat = cats.find(c => c.id === post.categoryId);

    return res.json({
      ...post,
      authorName: "Equipe Baixar Vídeo",
      categoryName: cat?.name || "",
      categorySlug: cat?.slug || "",
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao carregar post." });
  }
}
