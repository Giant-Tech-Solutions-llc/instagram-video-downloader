import { db } from "./db";
import { eq, desc, asc, ilike, and, sql, count, inArray } from "drizzle-orm";
import {
  cmsUsers, type InsertCmsUser, type CmsUser,
  blogPosts, type InsertBlogPost, type BlogPost,
  categories, type InsertCategory, type Category,
  revisions, type InsertRevision, type Revision,
  auditLogs, type InsertAuditLog, type AuditLog,
  media, type InsertMedia, type Media,
} from "@shared/schema";

export class CmsStorage {
  async createUser(user: InsertCmsUser): Promise<CmsUser> {
    const [newUser] = await db.insert(cmsUsers).values(user as any).returning();
    return newUser;
  }

  async getUserById(id: number): Promise<CmsUser | undefined> {
    const [user] = await db.select().from(cmsUsers).where(eq(cmsUsers.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<CmsUser | undefined> {
    const [user] = await db.select().from(cmsUsers).where(eq(cmsUsers.email, email));
    return user;
  }

  async getUsers(): Promise<CmsUser[]> {
    return db.select().from(cmsUsers).orderBy(desc(cmsUsers.createdAt));
  }

  async updateUser(id: number, data: Partial<InsertCmsUser>): Promise<CmsUser | undefined> {
    const [user] = await db.update(cmsUsers).set({ ...data, updatedAt: new Date() } as any).where(eq(cmsUsers.id, id)).returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(cmsUsers).where(eq(cmsUsers.id, id));
  }

  async createPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post as any).returning();
    return newPost;
  }

  async getPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getPosts(opts: {
    status?: string;
    categoryId?: number;
    authorId?: number;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ posts: BlogPost[]; total: number }> {
    const page = opts.page || 1;
    const limit = opts.limit || 20;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (opts.status) conditions.push(eq(blogPosts.status, opts.status as any));
    if (opts.categoryId) conditions.push(eq(blogPosts.categoryId, opts.categoryId));
    if (opts.authorId) conditions.push(eq(blogPosts.authorId, opts.authorId));
    if (opts.search) conditions.push(ilike(blogPosts.title, `%${opts.search}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalResult] = await db.select({ count: count() }).from(blogPosts).where(where);
    const posts = await db.select().from(blogPosts).where(where).orderBy(desc(blogPosts.updatedAt)).limit(limit).offset(offset);

    return { posts, total: totalResult.count };
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

  async updatePost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db.update(blogPosts).set({ ...data, updatedAt: new Date() } as any).where(eq(blogPosts.id, id)).returning();
    return post;
  }

  async deletePost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async createCategory(cat: InsertCategory): Promise<Category> {
    const [newCat] = await db.insert(categories).values(cat).returning();
    return newCat;
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(asc(categories.name));
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [cat] = await db.select().from(categories).where(eq(categories.id, id));
    return cat;
  }

  async updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category | undefined> {
    const [cat] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
    return cat;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  async createRevision(rev: InsertRevision): Promise<Revision> {
    const [newRev] = await db.insert(revisions).values(rev).returning();
    return newRev;
  }

  async getRevisionsByPostId(postId: number): Promise<Revision[]> {
    return db.select().from(revisions).where(eq(revisions.postId, postId)).orderBy(desc(revisions.createdAt));
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [newLog] = await db.insert(auditLogs).values(log).returning();
    return newLog;
  }

  async getAuditLogs(opts: { page?: number; limit?: number } = {}): Promise<{ logs: AuditLog[]; total: number }> {
    const page = opts.page || 1;
    const limit = opts.limit || 50;
    const offset = (page - 1) * limit;

    const [totalResult] = await db.select({ count: count() }).from(auditLogs);
    const logs = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit).offset(offset);
    return { logs, total: totalResult.count };
  }

  async createMedia(m: InsertMedia): Promise<Media> {
    const [newMedia] = await db.insert(media).values(m).returning();
    return newMedia;
  }

  async getMedia(): Promise<Media[]> {
    return db.select().from(media).orderBy(desc(media.createdAt));
  }

  async deleteMedia(id: number): Promise<void> {
    await db.delete(media).where(eq(media.id, id));
  }

  async getDashboardStats(): Promise<{
    totalPosts: number;
    published: number;
    drafts: number;
    trashed: number;
    totalUsers: number;
    totalCategories: number;
  }> {
    const [totalPosts] = await db.select({ count: count() }).from(blogPosts).where(sql`${blogPosts.status} != 'trashed'`);
    const [published] = await db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.status, 'published'));
    const [drafts] = await db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.status, 'draft'));
    const [trashed] = await db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.status, 'trashed'));
    const [totalUsers] = await db.select({ count: count() }).from(cmsUsers);
    const [totalCategories] = await db.select({ count: count() }).from(categories);

    return {
      totalPosts: totalPosts.count,
      published: published.count,
      drafts: drafts.count,
      trashed: trashed.count,
      totalUsers: totalUsers.count,
      totalCategories: totalCategories.count,
    };
  }
}

export const cmsStorage = new CmsStorage();
