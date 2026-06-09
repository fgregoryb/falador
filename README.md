# Verbose — Personal Blog & CMS

A full-stack personal blog with a custom-built CMS, deployed to production. Built from scratch with Nuxt 4, Supabase, and Tailwind CSS.

**Live:** [falador-seven.vercel.app](https://falador-seven.vercel.app) &nbsp;·&nbsp; **Author:** [Gregory Rodrigues](https://github.com/fgregoryb)

---

## Why I built this

Rather than using an existing blogging platform, I built my own to practice full-stack development end-to-end — from database schema and Row Level Security policies to SSR, authentication, file uploads, and deployment. Every feature was designed and implemented by me.

---

## Features

### Public site
- Server-side rendered article listing (SSR via Nuxt/Nitro)
- Individual post pages with Markdown rendering and cover images
- Dynamic author profile (avatar, bio, social links) sourced from the CMS
- Light/dark mode with persistent preference
- Responsive design across all breakpoints
- SEO meta tags on all pages
- Share button with clipboard copy

### Admin CMS (`/admin`)
- Email/password authentication via Supabase Auth
- Protected routes via Nuxt middleware
- **Dashboard** with live post count stats (published, drafts, total, last post date)
- **Post editor** — split-pane Markdown editor with live preview, word counter, autosave indicator
- Post metadata: title, excerpt (160 char), internal note (not public), cover image toggle
- **Cover image upload** — upload JPG/PNG/WebP directly from the editor; falls back to auto-generated image if none uploaded
- Publish / unpublish toggle without leaving the list
- Delete with confirmation modal
- Full post editing

### Settings (`/admin/configuracoes`)
- **Profile:** name, bio, avatar upload with circular cropper (drag to reposition, scroll to zoom, canvas crop)
- **Site:** site name, description, contact email
- **Appearance:** light/dark theme toggle
- **Location & Locale:** free-text location field (shown on About page), language select, timezone select
- **Social networks:** GitHub, LinkedIn, Instagram, Facebook, X/Twitter — extensible array structure

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com/) — Vue 3 + Nitro SSR |
| Language | TypeScript (strict, end-to-end) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + custom CSS design tokens |
| Database | [Supabase](https://supabase.com/) (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Security | Row Level Security (RLS) policies |
| Markdown | [Marked](https://marked.js.org/) |
| Icons | [Lucide Vue Next](https://lucide.dev/) |
| Deploy | [Vercel](https://vercel.com/) — auto-deploy on push to `main` |

---

## Architecture decisions

**Nuxt Server Routes instead of a separate API**
Nuxt's built-in Nitro server lets me define API endpoints as files in `server/api/`. One codebase, one deploy, full TypeScript sharing between client and server.

**Service Role for admin routes, anon key for public**
All admin server routes use the Supabase service role (bypasses RLS) exclusively server-side — the browser never sees that key. Public routes use the anon key with explicit `status = 'published'` filters, making the RLS policies a safety net rather than the sole gate.

**Canvas API for avatar cropping**
Instead of adding a heavy dependency, the avatar cropper is built with vanilla Canvas API — drag, zoom, circular clip, and JPEG export all happen client-side before uploading the result.

**CSS design tokens over Tailwind utilities**
All colors, spacing scales, and typography are defined as CSS custom properties in `main.css`. This makes the dark mode implementation trivial: just redefine the tokens under `[data-theme="dark"]`.

---

## Project structure

```
verbose/
├── app/
│   ├── assets/css/       # Design tokens, global styles, prose overrides
│   ├── components/       # AppHeader, AppFooter, PostForm, FIcon, FWordmark…
│   ├── composables/      # useTheme (dark/light mode singleton)
│   ├── layouts/
│   │   ├── default.vue   # Public layout with sticky header
│   │   └── admin.vue     # CMS sidebar layout with theme toggle
│   ├── middleware/
│   │   └── auth.ts       # Protects all /admin/* routes client-side
│   ├── pages/
│   │   ├── index.vue          # Article listing (featured + list)
│   │   ├── sobre.vue          # About page — data from CMS
│   │   ├── posts/[slug].vue   # Individual post + author card
│   │   └── admin/
│   │       ├── index.vue          # Dashboard with stats
│   │       ├── new.vue            # Create post
│   │       ├── edit/[id].vue      # Edit post
│   │       ├── login.vue          # Auth
│   │       └── configuracoes.vue  # Settings
│   └── utils/
│       ├── coverImage.ts   # Generates consistent Picsum URLs from slug
│       ├── markdown.ts     # Marked wrapper
│       ├── slug.ts         # Slugify utility
│       └── timezone.ts     # Timezone → human-readable location map
└── server/
    ├── api/
    │   ├── posts/           # Public endpoints (GET list, GET by slug)
    │   ├── profile.get.ts   # Public profile (name, bio, avatar)
    │   ├── settings.get.ts  # Public site settings (social links, location)
    │   └── admin/           # Protected endpoints (posts CRUD, profile, settings, upload)
    └── utils/
        └── supabase.ts      # Client vs service role helpers
```

---

## Database schema

```sql
-- Posts
create table posts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  excerpt         text,
  content         text,
  note            text,                          -- internal, never public
  status          text not null default 'draft'
                    check (status in ('draft','published')),
  show_cover      boolean not null default true,
  cover_image_url text,                          -- uploaded image (optional)
  author_id       uuid references auth.users(id),
  published_at    timestamptz,
  created_at      timestamptz default now()
);

-- Profiles
create table profiles (
  id         uuid primary key,
  name       text,
  bio        text,
  avatar_url text
);

-- Settings (single row)
create table settings (
  id               uuid primary key default gen_random_uuid(),
  site_name        text not null default 'Verbose',
  site_description text default '',
  contact_email    text default '',
  location         text default '',
  timezone         text default 'America/Sao_Paulo',
  language         text default 'pt-BR',
  logo_url         text default '',
  github_url       text default '',
  linkedin_url     text default '',
  facebook_url     text default '',
  instagram_url    text default '',
  twitter_url      text default '',
  updated_at       timestamptz default now()
);

-- RLS: public can only read published posts
alter table posts enable row level security;
create policy "published posts are public"
  on posts for select using (status = 'published');
```

---

## Running locally

**Prerequisites:** Node.js 22+ and a Supabase project.

```bash
git clone https://github.com/fgregoryb/verbose.git
cd verbose
nvm use          # Node 22 via .nvmrc
npm install

# Configure environment
cp .env.example .env
# Fill SUPABASE_URL, SUPABASE_KEY, SUPABASE_SERVICE_KEY

npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin at [/admin/login](http://localhost:3000/admin/login).

**Seed sample posts:**
```bash
node scripts/seed.mjs
```

---

## Environment variables

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Anon/public key — used client-side, subject to RLS |
| `SUPABASE_SERVICE_KEY` | Service role key — server-side only, bypasses RLS |

---

## Deploy

Deployed on Vercel with automatic deploys on every push to `main`. Each commit triggers a new build; rollback is one click via Vercel's Instant Rollback.

```bash
npm run build   # what Vercel runs — outputs a Node.js server
```

---

## What I learned building this

- **Nuxt 4's `app/` directory** enforces a clear boundary between browser and server code, preventing accidental cross-context imports.
- **Supabase RLS** is silent by design — a table with RLS enabled and no policies returns empty results without errors. Debugging this taught me to always test with both the anon key and service role.
- **Service Routes eliminate a separate backend** for solo and small-team projects. One deploy, one codebase, shared types.
- **Canvas API** is powerful enough for real image processing (crop, zoom, circular mask, JPEG export) without any library.
- **CSS design tokens pay off immediately** — dark mode, theming, and consistent spacing all flow from a single source of truth.

---

## Roadmap

- [ ] Full-text search across posts
- [ ] Reading time estimate per post
- [ ] Newsletter subscription via Resend
- [ ] Open Graph image generation per post
- [ ] Post tags and filtering
