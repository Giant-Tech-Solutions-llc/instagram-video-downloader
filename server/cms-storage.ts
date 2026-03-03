import { db } from "./db";
import { eq, desc, asc, and, count } from "drizzle-orm";
import {
  blogPosts, type BlogPost,
  categories, type Category,
} from "@shared/schema";

export class CmsStorage {
  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getPublishedPosts(opts: { page?: number; limit?: number; categorySlug?: string } = {}): Promise<{ posts: BlogPost[]; total: number }> {
    const page = opts.page || 1;
    const limit = opts.limit || 10;
    const offset = (page - 1) * limit;

    let catCondition;
    if (opts.categorySlug) {
      const [cat] = await db.select().from(categories).where(eq(categories.slug, opts.categorySlug));
      if (cat) catCondition = eq(blogPosts.categoryId, cat.id);
    }

    const where = catCondition ? and(eq(blogPosts.status, 'published'), catCondition) : eq(blogPosts.status, 'published');

    const [totalResult] = await db.select({ count: count() }).from(blogPosts).where(where);
    const posts = await db.select().from(blogPosts).where(where).orderBy(desc(blogPosts.publishedAt)).limit(limit).offset(offset);

    return { posts, total: totalResult.count };
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(asc(categories.name));
  }
}

export const cmsStorage = new CmsStorage();
