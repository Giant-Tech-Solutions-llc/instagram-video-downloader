import { storage } from "./storage";
import { cmsStorage } from "./cms-storage";
import { hashPassword } from "./auth";

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

export async function seedAdmin() {
  try {
    const existing = await cmsStorage.getUserByEmail("admin@baixarvideo.com");
    let adminId: number;
    if (!existing) {
      const hashed = await hashPassword("admin123");
      const admin = await cmsStorage.createUser({
        email: "admin@baixarvideo.com",
        name: "Administrador",
        password: hashed,
        role: "super_admin",
        active: true,
      });
      adminId = admin.id;
      console.log("Seeded admin user: admin@baixarvideo.com / admin123");
    } else {
      adminId = existing.id;
    }

    const cats = await cmsStorage.getCategories();
    if (cats.length === 0) {
      await cmsStorage.createCategory({ name: "Tutoriais", slug: "tutoriais", description: "Guias e tutoriais sobre download de mídias" });
      await cmsStorage.createCategory({ name: "Dicas", slug: "dicas", description: "Dicas e truques para Instagram" });
      await cmsStorage.createCategory({ name: "Novidades", slug: "novidades", description: "Novidades e atualizações" });
      console.log("Seeded default categories");
    }

    const { posts } = await cmsStorage.getPosts({ limit: 1 });
    if (posts.length === 0) {
      console.log("No blog posts found. Create posts via the admin panel.");
    }
  } catch (error) {
    console.error("Error seeding admin data:", error);
  }
}
