# BlackBiz — South Africa's Black Business Intelligence Platform

> Phase 1 MVP: Directory + Profiles + Search + Auth
> Built with Next.js 14, Supabase, Tailwind CSS · Deployable on Vercel

---

## Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (dark theme, gold palette)
- **Database**: Supabase (PostgreSQL + RLS + Full-text search)
- **Auth**: Supabase Auth (email + Google OAuth)
- **Deployment**: Vercel

---

## Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Go to [supabase.com](https://supabase.com) → New Project
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → Run
3. Go to **Settings → API** → copy your URL and anon key

### 3. Configure environment
```bash
cp .env.local.example .env.local
```
Fill in your Supabase values:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### 4. Run locally
```bash
npm run dev
# → http://localhost:3000
```

---

## Deploy to Vercel

### Option A — CLI
```bash
npm run build         # verify build
npx vercel            # follow prompts
```

### Option B — GitHub + Vercel Dashboard
1. Push to GitHub: `git add . && git commit -m "BlackBiz MVP" && git push`
2. vercel.com → New Project → Import repo
3. Add environment variables (same as .env.local)
4. Deploy ✅

---

## App Structure
```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── directory/page.tsx    # Search + browse directory
│   ├── business/[slug]/      # Individual business profiles
│   ├── dashboard/            # Owner dashboard + new business form
│   ├── auth/login|register/  # Auth pages
│   └── api/                  # REST API routes
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── business/             # Cards, ReviewSection, CompletenessBar
│   └── search/               # DirectoryClient (filters + results)
├── lib/
│   ├── supabase/             # client.ts, server.ts, middleware.ts
│   └── utils.ts              # helpers, constants
└── types/index.ts            # Full TypeScript types
```

---

## Phase 2 Roadmap
- [ ] Logo/cover photo uploads (Supabase Storage)
- [ ] CIPC verification API integration  
- [ ] Business edit dashboard
- [ ] Admin verification panel
- [ ] Transaction tracking
- [ ] Stripe subscription tiers

---

Built by [Business Hustle](https://businesshustle.co.za)
