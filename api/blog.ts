import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cmsStorage } from '../lib/cms-storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const urlPath = (req.url || '').split('?')[0];

  if (urlPath.match(/\/api\/blog\/categories/)) {
    try {
      const cats = await cmsStorage.getCategories();
      return res.json(cats);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao carregar categorias." });
    }
  }

  const slugSegments = urlPath.replace(/^\/api\/blog\/posts\/?/, '').split('/').filter(Boolean);
  const slug = slugSegments?.[0];

  if (slug) {
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
