# BlackBiz — South Africa's Black Business Intelligence Platform

> **THE place to find verified Black-owned businesses in South Africa.**  
> CIPC verified. B-BBEE rated. Community powered. Free to list.  
> Live at **[blackbiz.co.za](https://www.blackbiz.co.za)**

---

## What is BlackBiz?

BlackBiz is South Africa's first Black Business Intelligence Platform — built in 8 days as a response to a tweet, and now live at scale.

It's not just a directory. It's infrastructure for economic visibility.

- **Verified profiles** — CIPC registration checks, B-BBEE certificates, document vaults
- **Live performance data** — financial bands, growth metrics, health scores
- **Hustle Feed** — a Reddit-style community feed for tenders, milestones, RFQs and opinions. Every post is indexed by Google
- **Powerful search** — full-text search across 9 provinces and 15+ industries
- **Free to list** — always

Built by **[Business Hustle](https://businesshustle.co.za)** · Cape Town, South Africa

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS (dark theme, gold palette) |
| Database | Supabase (PostgreSQL + RLS + Full-text search) |
| Auth | Supabase Auth (Email + Google OAuth) |
| Deployment | Vercel |
| Domain | blackbiz.co.za |

---

## Features

### Directory
- Search 21+ verified Black-owned businesses
- Filter by province, industry, size, BBBEE level
- Sort by rating, newest, A–Z, most viewed
- Full-text search with semantic understanding

### Business Profiles
- CIPC verification badge
- B-BBEE level display
- Services, products, contact info
- Profile completeness scoring
- Client reviews with star ratings
- LocalBusiness JSON-LD for Google rich results
- Share to X and WhatsApp

### Hustle Feed
- Post updates, tenders, RFQs, milestones, opinions
- Every post gets its own indexable URL (`/feed/[id]`)
- Like and comment system
- Deadline and budget tracking for tenders/RFQs
- Google indexes each post like a Reddit thread

### Owner Dashboard
- Profile builder (4-step form)
- Edit business details
- View count analytics
- Profile health checklist

### Auth
- Email + password registration
- Google OAuth
- Forgot/reset password flow
- Welcome modal on first login

### Pages
- `/` — Homepage with SEO-optimised hero, FAQ schema, province links
- `/directory` — Full search directory
- `/business/[slug]` — Individual business profiles
- `/feed` — Hustle Feed
- `/feed/[id]` — Individual post pages (indexed by Google)
- `/dashboard` — Owner dashboard
- `/dashboard/new` — List a business
- `/dashboard/edit/[id]` — Edit a business
- `/about`, `/pricing`, `/contact`, `/blog`, `/privacy`, `/terms`, `/popia`

---

## SEO Architecture

BlackBiz is built to rank. Key implementation:

- **Dynamic sitemap** at `/sitemap.xml` — includes all business profiles, feed posts, category and province pages
- **robots.txt** — allows all crawlers
- **JSON-LD structured data** on every page:
  - `Organization` + `WebSite` + `SearchAction` on all pages
  - `LocalBusiness` with star ratings on business profiles
  - `Article` / `SocialMediaPosting` on feed posts
  - `FAQPage` on homepage — captures Google "People Also Ask" boxes
- **Per-page metadata** — unique title, description and keywords for every business profile and feed post
- **Province and category pages** — `/directory?province=Gauteng` etc. for local SEO
- **Canonical URLs** — `www.blackbiz.co.za` is canonical, non-www redirects

Target keywords: *"find black-owned businesses South Africa"*, *"BBBEE verified suppliers"*, *"black business directory South Africa"*, *"black owned companies [province]"*

---

## Local Setup

### 1. Clone

```bash
git clone https://github.com/JacobSeatlholo/blackbiz.git
cd blackbiz
```

### 2. Install

```bash
npm install
```

### 3. Supabase setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. SQL Editor → run `supabase/schema.sql`
3. SQL Editor → run `supabase/seed.sql` (20 seed businesses)
4. SQL Editor → run `supabase/hustle_feed_schema.sql` (Hustle Feed)

### 4. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=https://www.blackbiz.co.za
```

### 5. Run locally

```bash
npm run dev
# → http://localhost:3000
```

---

## Deploy to Vercel

```bash
npm run build        # verify build passes
git add . && git commit -m "deploy" && git push
```

Vercel auto-deploys on push to `main`.

Add environment variables in **Vercel → Settings → Environment Variables**.

---

## Supabase Auth Setup

In **Supabase → Authentication → URL Configuration**:

- **Site URL:** `https://www.blackbiz.co.za`
- **Redirect URLs:**
  ```
  https://www.blackbiz.co.za/**
  https://blackbiz.co.za/**
  http://localhost:3000/**
  ```

---

## Roadmap

- [ ] Logo / cover photo uploads (Supabase Storage)
- [ ] Yoco payment integration for Verified + Intelligence plans
- [ ] CIPC API verification (automated)
- [ ] Stitch Open Banking integration (transaction tracking)
- [ ] Admin verification panel
- [ ] Email notifications for new reviews and enquiries
- [ ] MySQL migration for transaction intelligence layer
- [ ] Mobile app (React Native)

---

## App Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout + SEO metadata
│   ├── sitemap.ts                  # Dynamic XML sitemap
│   ├── robots.ts                   # robots.txt
│   ├── directory/page.tsx          # Search directory
│   ├── business/[slug]/page.tsx    # Business profiles
│   ├── feed/page.tsx               # Hustle Feed
│   ├── feed/[id]/page.tsx          # Individual feed posts
│   ├── dashboard/page.tsx          # Owner dashboard
│   ├── dashboard/new/page.tsx      # New business form
│   ├── dashboard/edit/[id]/page.tsx # Edit business
│   ├── auth/login|register/        # Auth pages
│   ├── auth/forgot-password/       # Password reset
│   ├── auth/callback/route.ts      # OAuth callback
│   ├── about|pricing|contact|blog/ # Marketing pages
│   └── privacy|terms|popia/        # Legal pages
├── components/
│   ├── layout/                     # Navbar, Footer
│   ├── business/                   # Cards, ReviewSection, CompletenessBar
│   ├── feed/                       # FeedClient, HustleFeedPreview
│   ├── search/                     # DirectoryClient
│   └── ui/                         # WelcomeModal
└── lib/
    ├── supabase/                    # client.ts, server.ts, middleware.ts
    └── utils.ts                    # helpers, constants
```

---

## Built by Business Hustle

> *"This isn't just a directory. It's infrastructure for economic visibility."*

[businesshustle.co.za](https://businesshustle.co.za) · [@TeeJaySeatlholo](https://twitter.com/TeeJaySeatlholo)

---

© 2026 BlackBiz · Simple Eternity Holdings Pty Ltd · Cape Town, South Africa
