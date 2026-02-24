import { storage } from "./storage";

export async function seed() {
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
