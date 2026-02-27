# replit.md

## Overview

This is **Baixar Vídeo Downloader**, a web application that allows Brazilian users to download media from Instagram (videos, reels, photos, stories, highlights). The app is entirely in Portuguese (pt-BR), targeting the Brazilian market. Users paste a URL, click download, and receive the media file. The project is a full-stack TypeScript application with a React frontend and Express backend, using PostgreSQL for data storage. Blog posts are stored in the database and served via a read-only public API.

## User Preferences

Preferred communication style: Simple, everyday language.

## Deployment Workflow

- **Replit** — Development only (local dev server, database provisioning)
- **GitHub** — Source code repository
- **Vercel** — Production hosting (frontend static files + serverless API functions)

### Vercel Configuration
- **`vercel.json`** — Configures build command, output directory, rewrites, and serverless function settings
- **`api/index.ts`** — Single serverless function that wraps the Express app for all `/api/*` routes
- **Frontend:** Static SPA served from `client/dist/` (built by Vite)
- **API:** All `/api/*` requests are routed to the serverless function in `api/index.ts`
- **SPA Fallback:** All non-API routes rewrite to `index.html` for client-side routing

### Environment Variables (set on Vercel)
- `DATABASE_URL` — PostgreSQL connection string (required)
- `SESSION_SECRET` — Session secret (required)

## System Architecture

### Monorepo Structure
The project uses a single repository with four main directories:
- **`client/`** — React frontend (SPA)
- **`server/`** — Express backend (API server, used by both local dev and Vercel serverless)
- **`shared/`** — Shared types, schemas, and route definitions used by both client and server
- **`api/`** — Vercel serverless function entry point (wraps Express app from `server/`)

### Frontend Architecture
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight client-side router)
- **State/Data Fetching:** TanStack React Query for server state management
- **UI Components:** Shadcn/ui (new-york style) built on Radix UI primitives
- **Styling:** Tailwind CSS with CSS custom properties for theming, PostCSS with autoprefixer
- **Animations:** Framer Motion for loading states and reveal animations
- **Fonts:** Inter (body) and Outfit (headings) from Google Fonts
- **Build Tool:** Vite with React plugin, path aliases (`@/` → `client/src/`, `@shared/` → `shared/`)
- **Build Output:** `client/dist/` (used by both Vercel and local production mode)
- **Pages:** Home (main Instagram Video Downloader at `/`), plus 5 dedicated tool landing pages (Reels, Stories, Photos, Profile Picture, Audio/MP3), Terms of Use (`/termos`), Privacy Policy (`/privacidade`), Contact (`/contato`), How it Works (`/como-funciona`), 404 page
- **Tool Pages Architecture:** Reusable `ToolPageLayout` component renders all tool landing pages. Tool configuration (slugs, titles, FAQs, SEO content) is centralized in `client/src/lib/tools-config.ts`. Individual page components in `client/src/pages/tools/` are thin wrappers around `ToolPageLayout`.

### Backend Architecture
- **Framework:** Express.js running on Node.js with TypeScript
- **API Pattern:** RESTful endpoints defined in `server/routes.ts`
- **Core Endpoint:** `POST /api/download/process` — accepts an Instagram URL, scrapes the page using axios + cheerio to extract video/image URLs from Open Graph meta tags and embedded JSON. Additional endpoints: `GET /api/proxy-download` for proxied file downloads and `GET /api/stats` for download statistics.
- **Public Blog API:** `GET /api/blog/posts`, `GET /api/blog/posts/:slug`, `GET /api/blog/categories`
- **Sitemap:** `GET /sitemap.xml` — dynamically generated from published posts + static pages
- **Web Scraping:** Uses axios for HTTP requests with browser-like headers and cheerio for HTML parsing
- **Local Development:** Vite dev server middleware is used in development mode for HMR; in production, static files are served from `client/dist/`
- **Vercel Production:** `api/index.ts` wraps the Express app as a serverless function. Static files are served by Vercel's CDN from `client/dist/`.

### Data Storage
- **Database:** PostgreSQL via `DATABASE_URL` environment variable
- **ORM:** Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Tables:**
  - `downloads` — Tracks download activity (URL, status, format, timestamp)
  - `blog_posts` — Blog posts with full CMS fields (title, slug, content, SEO, FAQs, status, author, category)
  - `categories` — Post categories
- **Migrations:** Managed via `drizzle-kit push` (schema push approach, not migration files)
- **Storage Layer:** `server/storage.ts` for downloads, `server/cms-storage.ts` for read-only blog queries

### Shared Layer
- **`shared/schema.ts`** — Drizzle table definitions, Zod insert schemas, and TypeScript types
- **`shared/routes.ts`** — API contract definitions with Zod schemas for request/response validation, used by both client and server for type safety

### Running the Project (Replit Development)
- **Workflow:** `Start application` runs `bash start.sh` which builds the frontend with Vite and starts the Express server in production mode (`NODE_ENV=production`)
- **Why production mode:** The Replit environment sends SIGHUP signals that kill Vite's esbuild child process, causing `process.exit(1)` in the Vite error handler. Production mode serves pre-built static files and avoids this issue entirely.
- **`start.sh`:** Kills any existing process on port 5000, builds the frontend via `npm run build`, then runs the server with `tsx`
- **Signal handling:** `server/index.ts` intercepts SIGTERM, SIGHUP, and `process.exit(1)` to keep the server alive under hostile signal conditions

### Building for Vercel
- Run `npm run build` — builds frontend to `client/dist/`
- Vercel automatically detects `vercel.json` and uses `api/index.ts` for serverless functions
- Set `DATABASE_URL` and `SESSION_SECRET` as environment variables in Vercel project settings

### Key Design Decisions
1. **Server-side scraping approach:** Instagram content is fetched server-side using axios + cheerio rather than client-side, to handle CORS restrictions. Instagram frequently blocks server-side scraping without proxies, which is a known limitation.
2. **Shared route contracts:** The `shared/routes.ts` file acts as a typed API contract, with Zod schemas for both inputs and outputs, ensuring client and server stay in sync.
3. **Mobile-first design:** The UI is optimized for smartphone users (the primary Brazilian user base), with responsive layouts and touch-friendly interactions.
4. **Portuguese-only public site:** The public-facing site is entirely in Portuguese (pt-BR).
5. **Database-driven blog:** Blog posts are stored in PostgreSQL and served via read-only API. Public pages fetch from `/api/blog/posts` and `/api/blog/posts/:slug`. Content stored as Markdown, rendered to HTML via `marked` + `DOMPurify`.
6. **Thumbnail proxy:** Instagram CDN images are proxied through `/api/proxy-image` to avoid CORS/referrer blocking in browsers.

## External Dependencies

### Database
- **PostgreSQL** — Required. Connection via `DATABASE_URL` environment variable. Used with Drizzle ORM.

### Key NPM Packages
- **axios** — HTTP client for server-side Instagram page fetching
- **cheerio** — HTML parser for extracting media URLs from Instagram pages
- **drizzle-orm** + **drizzle-kit** — Database ORM and schema management
- **@tanstack/react-query** — Client-side data fetching and caching
- **framer-motion** — Animation library for UI transitions
- **zod** + **drizzle-zod** — Runtime validation and schema generation
- **wouter** — Lightweight client-side routing
- **Radix UI** — Full suite of accessible UI primitives (dialog, dropdown, tabs, toast, etc.)
- **tailwindcss** + **class-variance-authority** + **clsx** + **tailwind-merge** — Styling utilities
- **sanitize-html** — HTML content sanitization for blog posts
- **marked** — Markdown-to-HTML conversion for public blog rendering
- **dompurify** — HTML sanitization for XSS protection on rendered content

### Replit-Specific (development only)
- **@replit/vite-plugin-runtime-error-modal** — Runtime error overlay in development
- **@replit/vite-plugin-cartographer** — Dev tooling (development only)
- **@replit/vite-plugin-dev-banner** — Dev banner (development only)
- These plugins are conditionally loaded only when `REPL_ID` env var is present

### External Services
- **Instagram** — The app scrapes Instagram pages to extract media URLs. No official API is used; this relies on parsing HTML/Open Graph tags from public Instagram URLs.
- **Google Fonts** — Inter and Outfit fonts loaded via CDN
