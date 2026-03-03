import { db } from "./db";
import { downloads, type InsertDownload, type Download } from "@shared/schema";

export interface IStorage {
  logDownload(download: InsertDownload): Promise<Download>;
  getRecentDownloads(): Promise<Download[]>;
}

export class DatabaseStorage implements IStorage {
  async logDownload(download: InsertDownload): Promise<Download> {
    const [newDownload] = await db
      .insert(downloads)
      .values(download)
      .returning();
    return newDownload;
  }

  async getRecentDownloads(): Promise<Download[]> {
    return await db.select().from(downloads).limit(10).orderBy(downloads.createdAt);
  }
}

export const storage = new DatabaseStorage();
