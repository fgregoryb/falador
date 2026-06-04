# Falador — Personal Blog & CMS

A full-stack personal blog with a custom CMS, built from scratch with Nuxt 4, Supabase, and Tailwind CSS. Live at **[falador-seven.vercel.app](https://falador-seven.vercel.app)**.

> Built by **Gregory Rodrigues** · Junior Software Engineer · [LinkedIn](https://linkedin.com/in/fgregoryb) · [GitHub](https://github.com/fgregoryb)

---

## Why I built this

Instead of using a ready-made blogging platform, I built my own to demonstrate full-stack skills in a real, deployed project. Every feature — from the Markdown editor to the authentication flow — was designed and implemented by me.

---

## Features

### Public Area
- Server-side rendered article listing (SSR via Nuxt/Nitro)
- Individual post pages with Markdown rendering
- Cover images via [Picsum Photos](https://picsum.photos) (deterministic per post)
- Responsive design with light/dark mode
- SEO meta tags on all pages
- Share button with clipboard copy

### Admin CMS (protected route)
- Email/password authentication via Supabase Auth
- Dashboard with live post count stats
- Split-pane Markdown editor with live preview
- Word counter, autosave indicator
- Publish / unpublish toggle without leaving the list
- Delete with confirmation modal
- Post editing with pre-filled form

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com/) (Vue 3 + Nitro SSR) |
| Language | TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + custom design tokens |
| Database | [Supabase](https://supabase.com/) (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Security | Row Level Security (RLS) policies |
| Markdown | [Marked](https://marked.js.org/) |
| Deploy | [Vercel](https://vercel.com/) (auto-deploy on push to `main`) |

---

## Architecture Decisions

**Why Nuxt Server Routes instead of a separate API?**
Nuxt's built-in Nitro server allows defining API endpoints as files in `server/api/`. This eliminates the need for a separate backend service, reduces deployment complexity, and keeps TypeScript types shared across client and server.

**Why Supabase?**
PostgreSQL with Row Level Security gives fine-grained access control at the database level. The service role key is used exclusively in server-side routes — the browser never touches it. This follows the principle of least privilege.

**Why Server-Side Rendering?**
Blog posts need to be indexed by search engines. Nuxt's SSR ensures that content is fully rendered on the server before being sent to the client, making it immediately crawlable.

---

## Project Structure

```
falador/
├── app/
│   ├── components/       # AppHeader, AppFooter, PostForm, FIcon…
│   ├── composables/      # useTheme (dark/light mode)
│   ├── layouts/
│   │   ├── default.vue   # public layout
│   │   └── admin.vue     # CMS layout with sidebar
│   ├── middleware/
│   │   └── auth.ts       # protects /admin/* routes
│   ├── pages/
│   │   ├── index.vue          # article listing
│   │   ├── sobre.vue          # about page
│   │   ├── posts/[slug].vue   # individual post
│   │   └── admin/             # CMS pages
│   └── utils/
│       ├── coverImage.ts  # generates Picsum URLs from slug
│       ├── markdown.ts    # Marked wrapper
│       └── slug.ts        # slugify utility
└── server/
    ├── api/
    │   ├── posts/         # public endpoints (GET)
    │   └── admin/posts/   # protected endpoints (GET, POST, PUT, DELETE)
    └── utils/
        └── supabase.ts    # client vs service role helpers
```

---

## Running Locally

**Prerequisites:** Node.js 22+ and a Supabase project.

```bash
# Clone and install
git clone https://github.com/fgregoryb/falador.git
cd falador
nvm use          # uses Node 22 via .nvmrc
npm install

# Configure environment
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_KEY, SUPABASE_SERVICE_KEY

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**To seed sample posts:**
```bash
node scripts/seed.mjs
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Anon/public key (used client-side, respects RLS) |
| `SUPABASE_SERVICE_KEY` | Service role key (server-side only, bypasses RLS) |

---

## Database Schema

```sql
create table posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text,
  content      text,
  status       text not null default 'draft' check (status in ('draft','published')),
  author_id    uuid references auth.users(id),
  published_at timestamptz,
  created_at   timestamptz default now()
);

-- RLS: public can read published posts
alter table posts enable row level security;

create policy "published posts are public"
  on posts for select
  using (status = 'published');
```

---

## Deploy

Deployed on Vercel with automatic deploys on every push to `main`.

```bash
# Production build (what Vercel runs)
npm run build
```

---

## What I Learned Building This

- **Nuxt 4's `app/` directory** enforces a clean separation between client and server code, preventing accidental server imports in browser bundles.
- **Supabase RLS** is powerful but silent — a table with RLS enabled and no policies returns empty results without errors. Debugging this taught me to always test with the anon key in addition to the service role.
- **Server Routes over a separate API** significantly reduces complexity for solo projects or small teams.
- **Design systems pay off early** — building custom CSS tokens at the start made dark mode trivial to implement.

---

## Roadmap

- [ ] Full-text search across posts
- [ ] Reading time estimate per post
- [ ] Newsletter subscription (email via Resend)
- [ ] Open Graph image generation per post
- [ ] Post categories / tags

---

*This project is intentionally kept as a single-developer codebase to serve as a portfolio piece. All code was written by me.*
