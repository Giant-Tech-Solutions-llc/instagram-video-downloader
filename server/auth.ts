import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import type { UserRole } from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    userId: number;
    userRole: UserRole;
    userName: string;
    userEmail: string;
  }
}

const PgStore = connectPgSimple(session);

export function setupSession() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is required.");
  }
  const isProduction = process.env.NODE_ENV === "production";
  return session({
    store: new PgStore({
      pool: pool as any,
      createTableIfMissing: true,
      tableName: "cms_sessions",
    }),
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    },
  });
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Não autenticado." });
  }
  next();
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
  viewer: 0,
  contributor: 1,
  author: 2,
  editor: 3,
  super_admin: 4,
};

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId || !req.session.userRole) {
      return res.status(401).json({ message: "Não autenticado." });
    }
    if (!roles.includes(req.session.userRole)) {
      return res.status(403).json({ message: "Permissão insuficiente." });
    }
    next();
  };
}

export function requireMinRole(minRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId || !req.session.userRole) {
      return res.status(401).json({ message: "Não autenticado." });
    }
    if (ROLE_HIERARCHY[req.session.userRole] < ROLE_HIERARCHY[minRole]) {
      return res.status(403).json({ message: "Permissão insuficiente." });
    }
    next();
  };
}
