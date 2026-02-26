import path from "path";
import express from "express";

export function serveStatic(app: express.Express) {
  const distPath = path.resolve(process.cwd(), "dist/public");

  app.use(express.static(distPath));

  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api")) return next();

    res.sendFile(path.join(distPath, "index.html"));
  });
}