import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cmsStorage } from './lib/cms-storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { posts } = await cmsStorage.getPublishedPosts({ limit: 1000 });
    const baseUrl = "https://baixarvideo.com";

    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/blog", priority: "0.8", changefreq: "daily" },
      { url: "/baixar-reels-instagram", priority: "0.9", changefreq: "weekly" },
      { url: "/baixar-stories-instagram", priority: "0.9", changefreq: "weekly" },
      { url: "/baixar-fotos-instagram", priority: "0.9", changefreq: "weekly" },
      { url: "/baixar-foto-perfil-instagram", priority: "0.8", changefreq: "weekly" },
      { url: "/extrair-audio-instagram", priority: "0.8", changefreq: "weekly" },
      { url: "/como-funciona", priority: "0.6", changefreq: "monthly" },
      { url: "/contato", priority: "0.5", changefreq: "monthly" },
      { url: "/termos", priority: "0.3", changefreq: "yearly" },
      { url: "/privacidade", priority: "0.3", changefreq: "yearly" },
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const page of staticPages) {
      xml += `  <url>\n    <loc>${baseUrl}${page.url}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
    }

    for (const post of posts) {
      const lastmod = post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : '';
      xml += `  <url>\n    <loc>${baseUrl}/blog/${post.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    xml += '</urlset>';

    res.setHeader('Content-Type', 'application/xml');
    return res.send(xml);
  } catch (error) {
    return res.status(500).send("Error generating sitemap");
  }
}
