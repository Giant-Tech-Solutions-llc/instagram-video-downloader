import path from "path";
import express from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: express.Express) {
  // 👇 your Vite build outputs here
  const distPath = path.resolve(__dirname, "../dist/public");

  app.use(express.static(distPath));

  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api")) return next();

    res.sendFile(path.join(distPath, "index.html"));
  });
}