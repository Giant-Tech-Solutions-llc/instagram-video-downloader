import { pgTable, text, serial, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  status: text("status").notNull(),
  format: text("format"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDownloadSchema = createInsertSchema(downloads).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type Download = typeof downloads.$inferSelect;

export interface VideoInfo {
  url: string;
  thumbnail?: string;
  filename?: string;
  type: 'video' | 'image';
}

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Category = typeof categories.$inferSelect;

export const POST_STATUSES = ['draft', 'published', 'scheduled', 'trashed'] as const;
export type PostStatus = typeof POST_STATUSES[number];

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  content: text("content").notNull().default(''),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  categoryId: integer("category_id"),
  authorId: integer("author_id").notNull(),
  status: text("status").notNull().$type<PostStatus>().default('draft'),
  tags: text("tags").array(),
  faqs: jsonb("faqs").$type<{ question: string; answer: string }[]>(),
  canonicalUrl: text("canonical_url"),
  readTime: text("read_time"),
  internalLinks: text("internal_links"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
