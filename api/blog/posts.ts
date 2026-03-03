import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cmsStorage } from '../_lib/cms-storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { page, limit, category } = req.query;
    const result = await cmsStorage.getPublishedPosts({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      categorySlug: category as string,
    });

    const cats = await cmsStorage.getCategories();

    const postsWithDetails = result.posts.map(post => {
      const cat = cats.find(c => c.id === post.categoryId);
      return {
        ...post,
        authorName: "Equipe Baixar Vídeo",
        categoryName: cat?.name || "",
        categorySlug: cat?.slug || "",
      };
    });

    return res.json({ posts: postsWithDetails, total: result.total });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao carregar posts." });
  }
}
