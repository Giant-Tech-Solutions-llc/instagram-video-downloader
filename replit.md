# replit.md

## Overview

This is **Baixar Vídeo Downloader**, a web application that allows Brazilian users to download media from Instagram (videos, reels, photos, stories, highlights). The app is entirely in Portuguese (pt-BR), targeting the Brazilian market. Users paste a URL, click download, and receive the media file. The project is a TypeScript application with a React frontend (Vite) and Vercel serverless backend, using PostgreSQL for data storage. Blog posts are stored in the database and served via a read-only public API.

## User Preferences

Preferred communication style: Simple, everyday language.

## Deployment Workflow

- **Replit** — Development only (Vite dev server, database provisioning)
- **GitHub** — Source code repository
- **Vercel** — Production hosting (frontend static files + serverless API functions)

### Vercel Configuration
- **`vercel.json`** — Minimal config: `buildCommand: "npm run build"`, `outputDirectory: "dist/public"`, plus sitemap rewrite
- **Serverless Functions:** Vercel auto-detects 8 handler files under `api/` (under Hobby plan 12-function limit). File paths match frontend API URLs for auto-routing:
  - `api/download/process.ts` → POST `/api/download/process`
  - `api/proxy-download.ts` → GET `/api/proxy-download`
  - `api/proxy-image.ts` → GET `/api/proxy-image`
  - `api/stats.ts` → GET `/api/stats`
  - `api/blog/posts.ts` → GET `/api/blog/posts` (list)
  - `api/blog/posts/[slug].ts` → GET `/api/blog/posts/:slug` (single post, dynamic route)
  - `api/blog/categories.ts` → GET `/api/blog/categories`
  - `api/sitemap.ts` → GET `/api/sitemap` (also serves `/sitemap.xml`)
- **Frontend:** Static SPA served from `dist/public/` (built by Vite)
- **Proxy Streaming:** `proxy-download` and `proxy-image` handlers stream responses via `pipe()` to avoid serverless memory limits
- **No Express server** — The project has no Express dependency. All backend logic runs as Vercel serverless functions.

### Environment Variables (set on Vercel)
- `DATABASE_URL` — PostgreSQL connection string (required)
- `SESSION_SECRET` — Session secret (required)
- `IG_SESSION_ID` — Instagram session cookie (required for video downloads)
- `IG_CSRF_TOKEN` — Instagram CSRF token (recommended, improves stability)
- `IG_DS_USER_ID` — Instagram user ID (recommended, improves stability)
- **Note:** Instagram session cookies expire periodically. To renew: login to instagram.com → DevTools → Application → Cookies → copy `sessionid`, `csrftoken`, `ds_user_id` values.

## System Architecture

### Project Structure
```
root/
├── api/                — Vercel serverless functions + shared modules
│   ├── download/process.ts       — 8 handler files (serverless functions)
│   ├── blog/posts.ts, blog/posts/[slug].ts, blog/categories.ts
│   ├── proxy-download.ts, proxy-image.ts, stats.ts, sitemap.ts
│   ├── _lib/           — Shared backend modules (underscore prefix = NOT counted as functions)
│   │   ├── db.ts, storage.ts, cms-storage.ts
│   │   ├── instagram-extractor.ts, instagram-http.ts, seed.ts
│   └── _shared/        — Shared types, schemas, route definitions
│       ├── schema.ts, routes.ts
├── client/             — React frontend SPA source
├── dist/public/        — Vite build output (generated)
├── package.json        — Single root package.json (no client/package.json)
├── vercel.json         — Minimal Vercel config
├── vite.config.ts      — Vite configuration
├── tsconfig.json       — TypeScript configuration
├── drizzle.config.ts   — Drizzle ORM config
└── tailwind.config.ts, postcss.config.js, components.json
```

### Frontend Architecture
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight client-side router)
- **State/Data Fetching:** TanStack React Query for server state management
- **UI Components:** Shadcn/ui (new-york style) built on Radix UI primitives
- **Styling:** Tailwind CSS with CSS custom properties for theming, PostCSS with autoprefixer
- **Animations:** Framer Motion for loading states and reveal animations
- **Fonts:** Inter (body) and Outfit (headings) from Google Fonts
- **Build Tool:** Vite with React plugin, path aliases (`@/` → `client/src/`, `@shared/` → `api/_shared/`)
- **Build Output:** `dist/public/` (Vite `outDir` in vite.config.ts)
- **Pages:** Home (main Instagram Video Downloader at `/`), plus 5 dedicated tool landing pages (Reels, Stories, Photos, Profile Picture, Audio/MP3), Terms of Use (`/termos`), Privacy Policy (`/privacidade`), Contact (`/contato`), How it Works (`/como-funciona`), 404 page
- **Tool Pages Architecture:** Reusable `ToolPageLayout` component renders all tool landing pages. Tool configuration centralized in `client/src/lib/tools-config.ts`.

### Backend Architecture (Serverless)
- **Pattern:** Individual Vercel serverless functions in `api/` directory
- **No Express server** — removed entirely; no `server/` directory
- **Shared Logic:** Common modules in `api/_lib/` (underscore prefix means Vercel does NOT count them as serverless functions):
  - `api/_lib/instagram-http.ts` — Authenticated requests with browser fingerprint rotation
  - `api/_lib/instagram-extractor.ts` — All Instagram media extraction strategies as pure functions
  - `api/_lib/db.ts` — Drizzle ORM + PostgreSQL connection
  - `api/_lib/storage.ts` — Download logging interface
  - `api/_lib/cms-storage.ts` — Blog post/category queries
  - `api/_lib/seed.ts` — Database seeding
- **API Endpoints:**
  - `POST /api/download/process` → `api/download/process.ts`
  - `GET /api/proxy-download` → `api/proxy-download.ts`
  - `GET /api/proxy-image` → `api/proxy-image.ts`
  - `GET /api/stats` → `api/stats.ts`
  - `GET /api/blog/posts` → `api/blog/posts.ts`
  - `GET /api/blog/posts/:slug` → `api/blog/posts/[slug].ts`
  - `GET /api/blog/categories` → `api/blog/categories.ts`
  - `GET /api/sitemap` → `api/sitemap.ts`

### Data Storage
- **Database:** PostgreSQL via `DATABASE_URL` environment variable
- **ORM:** Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Tables:**
  - `downloads` — Tracks download activity (URL, status, format, timestamp)
  - `blog_posts` — Blog posts with full CMS fields
  - `categories` — Post categories
- **Migrations:** Managed via `drizzle-kit push`

### Shared Layer
- **`api/_shared/schema.ts`** — Drizzle table definitions, Zod insert schemas, and TypeScript types
- **`api/_shared/routes.ts`** — API contract definitions with Zod schemas

### Running the Project (Replit Development)
- **Workflow:** `Start application` runs `npx vite --host 0.0.0.0 --port 5000` (Vite dev server)
- **Note:** In local dev, only the frontend is served. API calls require Vercel deployment. The Vite dev server does not proxy API routes.
- **Build:** `npm run build` runs `vite build`, output goes to `dist/public/`

### Building for Vercel
- Vercel reads `vercel.json` for `buildCommand` and `outputDirectory`
- Vercel auto-detects `api/*.ts` as serverless functions
- Set `DATABASE_URL`, `SESSION_SECRET`, `IG_SESSION_ID`, `IG_CSRF_TOKEN`, `IG_DS_USER_ID` as environment variables in Vercel project settings

### Key Design Decisions
1. **Pure serverless — no Express:** All backend logic runs as Vercel serverless functions. No Express dependency.
2. **Authenticated session approach:** Instagram content is fetched server-side using session cookies (`IG_SESSION_ID`) with browser fingerprint rotation.
3. **Shared route contracts:** `shared/routes.ts` acts as a typed API contract with Zod schemas.
4. **Mobile-first design:** UI optimized for smartphone users (primary Brazilian user base).
5. **Portuguese-only public site:** Entirely in pt-BR.
6. **Database-driven blog:** Blog posts stored in PostgreSQL, served via read-only API.
7. **Thumbnail proxy:** Instagram CDN images proxied through `/api/proxy-image` to avoid CORS blocking.
8. **Utility modules inside api/ with underscore prefix:** `api/_lib/` and `api/_shared/` directories use the Vercel convention where underscore-prefixed folders inside `api/` are bundled into functions but NOT treated as separate serverless endpoints.

## External Dependencies

### Database
- **PostgreSQL** — Required. Connection via `DATABASE_URL` environment variable. Used with Drizzle ORM.

### Key NPM Packages
- **axios** — HTTP client for Instagram page fetching
- **cheerio** — HTML parser for extracting media URLs
- **drizzle-orm** + **drizzle-kit** — Database ORM and schema management
- **@tanstack/react-query** — Client-side data fetching and caching
- **framer-motion** — Animation library for UI transitions
- **zod** + **drizzle-zod** — Runtime validation and schema generation
- **wouter** — Lightweight client-side routing
- **Radix UI** — Accessible UI primitives
- **tailwindcss** + **class-variance-authority** + **clsx** + **tailwind-merge** — Styling utilities
- **sanitize-html** — HTML content sanitization for blog posts
- **marked** — Markdown-to-HTML conversion
- **dompurify** — HTML sanitization for XSS protection
- **@vercel/node** — Vercel serverless function types
- **pg** — PostgreSQL client

### Replit-Specific (development only)
- **@replit/vite-plugin-runtime-error-modal** — Runtime error overlay
- **@replit/vite-plugin-cartographer** — Dev tooling
- **@replit/vite-plugin-dev-banner** — Dev banner
- These plugins are conditionally loaded only when `REPL_ID` env var is present

### External Services
- **Instagram** — Server-side scraping of Instagram pages to extract media URLs
- **Google Fonts** — Inter and Outfit fonts loaded via CDN
