import { storage } from "./storage";
import { pool } from "./db";

async function cleanupLegacyTables() {
  const legacyTables = ['audit_logs', 'cms_users', 'cms_sessions', 'media', 'revisions'];
  try {
    const result = await pool.query(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = ANY($1)`,
      [legacyTables]
    );
    if (result.rows.length > 0) {
      const tablesToDrop = result.rows.map(r => r.tablename).join(', ');
      await pool.query(`DROP TABLE IF EXISTS ${tablesToDrop} CASCADE`);
      console.log(`Cleaned up legacy tables: ${tablesToDrop}`);
    }
  } catch (err) {
    console.log("Legacy table cleanup skipped:", (err as Error).message);
  }
}

export async function seed() {
  await cleanupLegacyTables();

  const recent = await storage.getRecentDownloads();
  if (recent.length === 0) {
    await storage.logDownload({ 
      url: "https://www.instagram.com/reel/C-xyz123", 
      status: "success", 
      format: "mp4" 
    });
    console.log("Seeded database with sample download log");
  }
}
