import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { hashPassword, comparePassword, requireAuth, requireMinRole, requireRole } from "./auth";
import { cmsStorage } from "./cms-storage";
import type { UserRole } from "@shared/schema";

const router = Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo não permitido. Use JPEG, PNG, GIF ou WebP."));
    }
  },
});

router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }

    const user = await cmsStorage.getUserByEmail(email);
    if (!user || !user.active) {
      return res.status(401).json({ message: "E-mail ou senha incorretos." });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "E-mail ou senha incorretos." });
    }

    req.session.userId = user.id;
    req.session.userRole = user.role as UserRole;
    req.session.userName = user.name;
    req.session.userEmail = user.email;

    await cmsStorage.createAuditLog({
      userId: user.id,
      action: "login",
      targetType: "user",
      targetId: String(user.id),
    });

    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (error: any) {
    res.status(500).json({ message: "Erro ao fazer login." });
  }
});

router.post("/auth/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Erro ao sair." });
    res.clearCookie("connect.sid");
    res.json({ message: "Logout realizado com sucesso." });
  });
});

router.get("/auth/me", async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Não autenticado." });
  }
  const user = await cmsStorage.getUserById(req.session.userId);
  if (!user) {
    return res.status(401).json({ message: "Usuário não encontrado." });
  }
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

router.get("/dashboard/stats", requireAuth, async (_req: Request, res: Response) => {
  try {
    const stats = await cmsStorage.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar estatísticas." });
  }
});

router.get("/posts", requireAuth, async (req: Request, res: Response) => {
  try {
    const { status, categoryId, authorId, search, page, limit } = req.query;
    const result = await cmsStorage.getPosts({
      status: status as string,
      categoryId: categoryId ? Number(categoryId) : undefined,
      authorId: authorId ? Number(authorId) : undefined,
      search: search as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar posts." });
  }
});

router.get("/posts/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const post = await cmsStorage.getPostById(Number(req.params.id));
    if (!post) return res.status(404).json({ message: "Post não encontrado." });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar post." });
  }
});

router.post("/posts", requireAuth, requireMinRole('contributor'), async (req: Request, res: Response) => {
  try {
    const data = req.body;
    data.authorId = req.session.userId;

    const existing = await cmsStorage.getPostBySlug(data.slug);
    if (existing) {
      return res.status(400).json({ message: "Já existe um post com este slug." });
    }

    if (data.status === 'published') {
      const role = req.session.userRole!;
      if (role === 'contributor' || role === 'viewer') {
        data.status = 'draft';
      }
      if (data.status === 'published' && !data.publishedAt) {
        data.publishedAt = new Date();
      }
    }

    const post = await cmsStorage.createPost(data);

    await cmsStorage.createAuditLog({
      userId: req.session.userId!,
      action: "create_post",
      targetType: "post",
      targetId: String(post.id),
    });

    res.status(201).json(post);
  } catch (error: any) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Erro ao criar post." });
  }
});

router.put("/posts/:id", requireAuth, requireMinRole('contributor'), async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const post = await cmsStorage.getPostById(id);
    if (!post) return res.status(404).json({ message: "Post não encontrado." });

    const role = req.session.userRole!;
    if ((role === 'author' || role === 'contributor') && post.authorId !== req.session.userId) {
      return res.status(403).json({ message: "Você só pode editar seus próprios posts." });
    }

    await cmsStorage.createRevision({
      postId: id,
      contentSnapshot: { title: post.title, content: post.content, metaTitle: post.metaTitle, metaDescription: post.metaDescription },
      editedBy: req.session.userId!,
    });

    const data = req.body;

    if (data.status === 'published' && (role === 'contributor' || role === 'viewer')) {
      data.status = 'draft';
    }

    if (data.status === 'published' && post.status !== 'published' && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    if (data.slug && data.slug !== post.slug) {
      const existing = await cmsStorage.getPostBySlug(data.slug);
      if (existing) {
        return res.status(400).json({ message: "Já existe um post com este slug." });
      }
    }

    const updated = await cmsStorage.updatePost(id, data);

    await cmsStorage.createAuditLog({
      userId: req.session.userId!,
      action: "update_post",
      targetType: "post",
      targetId: String(id),
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: "Erro ao atualizar post." });
  }
});

router.delete("/posts/:id", requireAuth, requireMinRole('editor'), async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await cmsStorage.deletePost(id);
    await cmsStorage.createAuditLog({
      userId: req.session.userId!,
      action: "delete_post",
      targetType: "post",
      targetId: String(id),
    });
    res.json({ message: "Post excluído permanentemente." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir post." });
  }
});

router.post("/posts/:id/trash", requireAuth, requireMinRole('contributor'), async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const post = await cmsStorage.getPostById(id);
    if (!post) return res.status(404).json({ message: "Post não encontrado." });

    const role = req.session.userRole!;
    if ((role === 'author' || role === 'contributor') && post.authorId !== req.session.userId) {
      return res.status(403).json({ message: "Permissão insuficiente." });
    }

    await cmsStorage.updatePost(id, { status: 'trashed' } as any);
    await cmsStorage.createAuditLog({
      userId: req.session.userId!,
      action: "trash_post",
      targetType: "post",
      targetId: String(id),
    });
    res.json({ message: "Post movido para a lixeira." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao mover post para lixeira." });
  }
});

router.post("/posts/:id/restore", requireAuth, requireMinRole('contributor'), async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await cmsStorage.updatePost(id, { status: 'draft' } as any);
    await cmsStorage.createAuditLog({
      userId: req.session.userId!,
      action: "restore_post",
      targetType: "post",
      targetId: String(id),
    });
    res.json({ message: "Post restaurado como rascunho." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao restaurar post." });
  }
});

router.get("/posts/:id/revisions", requireAuth, async (req: Request, res: Response) => {
  try {
    const revisions = await cmsStorage.getRevisionsByPostId(Number(req.params.id));
    res.json(revisions);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar revisões." });
  }
});

router.get("/categories", requireAuth, async (_req: Request, res: Response) => {
  try {
    const cats = await cmsStorage.getCategories();
    res.json(cats);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar categorias." });
  }
});

router.post("/categories", requireAuth, requireMinRole('editor'), async (req: Request, res: Response) => {
  try {
    const cat = await cmsStorage.createCategory(req.body);
    await cmsStorage.createAuditLog({
      userId: req.session.userId!,
      action: "create_category",
      targetType: "category",
      targetId: String(cat.id),
    });
    res.status(201).json(cat);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ message: "Já existe uma categoria com este slug." });
    }
    res.status(500).json({ message: "Erro ao criar categoria." });
  }
});

router.put("/categories/:id", requireAuth, requireMinRole('editor'), async (req: Request, res: Response) => {
  try {
    const cat = await cmsStorage.updateCategory(Number(req.params.id), req.body);
    if (!cat) return res.status(404).json({ message: "Categoria não encontrada." });
    res.json(cat);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar categoria." });
  }
});

router.delete("/categories/:id", requireAuth, requireMinRole('editor'), async (req: Request, res: Response) => {
  try {
    await cmsStorage.deleteCategory(Number(req.params.id));
    res.json({ message: "Categoria excluída." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir categoria." });
  }
});

router.get("/users", requireAuth, requireMinRole('super_admin'), async (_req: Request, res: Response) => {
  try {
    const users = await cmsStorage.getUsers();
    const safeUsers = users.map(({ password, ...u }) => u);
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar usuários." });
  }
});

router.post("/users", requireAuth, requireMinRole('super_admin'), async (req: Request, res: Response) => {
  try {
    const { email, name, password, role } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ message: "E-mail, nome e senha são obrigatórios." });
    }

    const existing = await cmsStorage.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Já existe um usuário com este e-mail." });
    }

    const hashed = await hashPassword(password);
    const user = await cmsStorage.createUser({ email, name, password: hashed, role: role || 'contributor' });

    await cmsStorage.createAuditLog({
      userId: req.session.userId!,
      action: "create_user",
      targetType: "user",
      targetId: String(user.id),
    });

    const { password: _, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário." });
  }
});

router.put("/users/:id", requireAuth, requireMinRole('super_admin'), async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data: any = { ...req.body };
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    const user = await cmsStorage.updateUser(id, data);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário." });
  }
});

router.delete("/users/:id", requireAuth, requireMinRole('super_admin'), async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (id === req.session.userId) {
      return res.status(400).json({ message: "Você não pode excluir sua própria conta." });
    }
    await cmsStorage.deleteUser(id);
    res.json({ message: "Usuário excluído." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir usuário." });
  }
});

router.put("/profile", requireAuth, async (req: Request, res: Response) => {
  try {
    const data: any = { name: req.body.name };
    if (req.body.password) {
      data.password = await hashPassword(req.body.password);
    }
    const user = await cmsStorage.updateUser(req.session.userId!, data);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    req.session.userName = user.name;
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar perfil." });
  }
});

router.post("/upload", requireAuth, requireMinRole('contributor'), upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado." });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const mediaRecord = await cmsStorage.createMedia({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
      uploadedBy: req.session.userId!,
    });

    res.status(201).json(mediaRecord);
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer upload." });
  }
});

router.get("/media", requireAuth, async (_req: Request, res: Response) => {
  try {
    const mediaList = await cmsStorage.getMedia();
    res.json(mediaList);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar mídia." });
  }
});

router.delete("/media/:id", requireAuth, requireMinRole('editor'), async (req: Request, res: Response) => {
  try {
    await cmsStorage.deleteMedia(Number(req.params.id));
    res.json({ message: "Mídia excluída." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir mídia." });
  }
});

router.get("/audit-logs", requireAuth, requireMinRole('super_admin'), async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const result = await cmsStorage.getAuditLogs({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar logs." });
  }
});

export default router;
