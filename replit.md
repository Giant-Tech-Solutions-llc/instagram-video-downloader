# replit.md

## Overview

This is **Baixar Vídeo Downloader**, a web application that allows Brazilian users to download media from Instagram (videos, reels, photos, stories, highlights). The app is entirely in Portuguese (pt-BR), targeting the Brazilian market. Users paste a URL, click download, and receive the media file. The project is a full-stack TypeScript application with a React frontend and serverless backend, using PostgreSQL for data storage. Blog posts are stored in the database and served via a read-only public API.

## User Preferences

Preferred communication style: Simple, everyday language.

## Deployment Workflow

- **Replit** — Development only (local dev server, database provisioning)
- **GitHub** — Source code repository
- **Vercel** — Production hosting (frontend static files + serverless API functions)

### Vercel Configuration
- **`vercel.json`** — Configures builds (individual serverless functions + static client), routes mapping each `/api/*` path to its handler file
- **Serverless Functions:** Individual handler files under `api/` directory, each exporting `default async function handler(req, res)`
  - `api/download/process.ts` — POST handler for Instagram media extraction
  - `api/proxy-download.ts` — GET handler for proxied file downloads
  - `api/proxy-image.ts` — GET handler for proxied image serving
  - `api/stats.ts` — GET handler for download statistics
  - `api/blog/posts.ts` — GET handler for blog posts (list + single by slug)
  - `api/blog/categories.ts` — GET handler for blog categories
  - `api/sitemap.ts` — GET handler for dynamic sitemap XML
- **Frontend:** Static SPA served from `client/dist/` (built by Vite)
- **SPA Fallback:** Static assets (files with extensions) serve from `client/dist/`; all other non-API routes serve `client/dist/index.html` for client-side routing
- **Proxy Streaming:** `proxy-download` and `proxy-image` handlers stream responses via `pipe()` to avoid serverless memory limits

### Environment Variables (set on Vercel)
- `DATABASE_URL` — PostgreSQL connection string (required)
- `SESSION_SECRET` — Session secret (required)
- `IG_SESSION_ID` — Instagram session cookie (required for video downloads)
- `IG_CSRF_TOKEN` — Instagram CSRF token (recommended, improves stability)
- `IG_DS_USER_ID` — Instagram user ID (recommended, improves stability)
- **Note:** Instagram session cookies expire periodically. To renew: login to instagram.com → DevTools → Application → Cookies → copy `sessionid`, `csrftoken`, `ds_user_id` values.

## System Architecture

### Monorepo Structure
The project uses a single repository with the following directories:
- **`client/`** — React frontend (SPA)
- **`api/`** — Vercel serverless function handlers + shared backend logic (`api/lib/`)
- **`server/`** — Local development Express server (imports logic from `api/lib/`)
- **`shared/`** — Shared types, schemas, and route definitions used by both client and API
- **`_backup_server/`** — Backup of original monolithic server code (pre-serverless migration)

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

### Backend Architecture (Serverless)
- **Pattern:** Individual Vercel serverless functions in `api/` directory
- **Shared Logic:** Common modules in `api/lib/` used by all handlers:
  - `api/lib/instagram-http.ts` — Authenticated requests with browser fingerprint rotation (5 desktop + 3 mobile UAs), session cookie injection, randomized Accept-Language headers
  - `api/lib/instagram-extractor.ts` — All Instagram media extraction strategies as pure functions
  - `api/lib/db.ts` — Drizzle ORM + PostgreSQL connection
  - `api/lib/storage.ts` — Download logging interface
  - `api/lib/cms-storage.ts` — Blog post/category queries
  - `api/lib/seed.ts` — Database seeding
- **API Endpoints:**
  - `POST /api/download/process` — Accepts Instagram URL, runs extraction strategies, returns media info
  - `GET /api/proxy-download` — Proxies file download with Content-Disposition attachment
  - `GET /api/proxy-image` — Proxies Instagram images to bypass CORS
  - `GET /api/stats` — Download statistics
  - `GET /api/blog/posts` — Published blog post list (paginated, filterable by category)
  - `GET /api/blog/posts/:slug` — Single blog post by slug
  - `GET /api/blog/categories` — Blog category list
  - `GET /sitemap.xml` — Dynamic XML sitemap
- **Extraction Strategies (ordered):** JSON API (`?__a=1`), Mobile Media Info API (`/api/v1/media/{id}/info/`), GraphQL (2 query hashes), Direct Page HTML, Embed page, Alternate Embed (Googlebot UA), Reel URL variant

### Data Storage
- **Database:** PostgreSQL via `DATABASE_URL` environment variable
- **ORM:** Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Tables:**
  - `downloads` — Tracks download activity (URL, status, format, timestamp)
  - `blog_posts` — Blog posts with full CMS fields (title, slug, content, SEO, FAQs, status, author, category)
  - `categories` — Post categories
- **Migrations:** Managed via `drizzle-kit push` (schema push approach, not migration files)

### Shared Layer
- **`shared/schema.ts`** — Drizzle table definitions, Zod insert schemas, and TypeScript types
- **`shared/routes.ts`** — API contract definitions with Zod schemas for request/response validation, used by both client and server for type safety

### Running the Project (Replit Development)
- **Workflow:** `Start application` runs `bash start.sh` which builds the frontend with Vite and starts the Express server in production mode (`NODE_ENV=production`)
- **Local dev server:** `server/index.ts` is a thin Express wrapper that imports all logic from `api/lib/` modules
- **`start.sh`:** Kills any existing process on port 5000, builds the frontend via `npm run build`, then runs the server with `tsx`
- **Signal handling:** `server/index.ts` intercepts SIGTERM and SIGHUP to keep the server alive

### Building for Vercel
- Vercel detects `vercel.json` and builds individual serverless functions from `api/*.ts` and `api/**/*.ts`
- Static frontend built from `client/package.json` using `@vercel/static-build`
- Set `DATABASE_URL`, `SESSION_SECRET`, `IG_SESSION_ID`, `IG_CSRF_TOKEN`, `IG_DS_USER_ID` as environment variables in Vercel project settings

### Key Design Decisions
1. **Serverless architecture:** Each API endpoint is its own Vercel serverless function for independent scaling and cold start optimization.
2. **Authenticated session approach:** Instagram content is fetched server-side using authenticated session cookies (`IG_SESSION_ID`) with browser fingerprint rotation. The `api/lib/instagram-http.ts` module handles all authentication and fingerprinting.
3. **Shared route contracts:** The `shared/routes.ts` file acts as a typed API contract with Zod schemas.
4. **Mobile-first design:** The UI is optimized for smartphone users (the primary Brazilian user base).
5. **Portuguese-only public site:** The public-facing site is entirely in Portuguese (pt-BR).
6. **Database-driven blog:** Blog posts are stored in PostgreSQL and served via read-only API.
7. **Thumbnail proxy:** Instagram CDN images are proxied through `/api/proxy-image` to avoid CORS/referrer blocking.
8. **Backup preserved:** Original monolithic server code is kept in `_backup_server/` for reference.

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
- **@vercel/node** — Vercel serverless function types

### Replit-Specific (development only)
- **@replit/vite-plugin-runtime-error-modal** — Runtime error overlay in development
- **@replit/vite-plugin-cartographer** — Dev tooling (development only)
- **@replit/vite-plugin-dev-banner** — Dev banner (development only)
- These plugins are conditionally loaded only when `REPL_ID` env var is present

### External Services
- **Instagram** — The app scrapes Instagram pages to extract media URLs. No official API is used; this relies on parsing HTML/Open Graph tags from public Instagram URLs.
- **Google Fonts** — Inter and Outfit fonts loaded via CDN
