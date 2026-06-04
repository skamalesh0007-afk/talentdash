# TalentDash — India Salary & Career Intelligence

A compensation intelligence platform for India's tech industry. Structured, level-aware salary data served at CDN edge with near-zero infrastructure cost.

🔗 **Live URL**: https://your-project.vercel.app  
📦 **GitHub**: https://github.com/your-username/talentdash

---

## ⚡ Run Locally in Under 5 Minutes

### Prerequisites
- Node.js 18+
- A free [Neon](https://neon.tech) PostgreSQL database

### Steps

```bash
# 1. Clone and install
git clone https://github.com/your-username/talentdash
cd talentdash
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local and add your DATABASE_URL from Neon console

# 3. Push schema to database
npx prisma db push

# 4. Seed with 60+ records
npm run db:seed

# 5. Run dev server
npm run dev
```

Open http://localhost:3000 — you should see the homepage with real data.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Yes | Neon PostgreSQL connection string (include `?sslmode=require`) |
| `NEXT_PUBLIC_BASE_URL` | Optional | Your deployed URL, used for OpenGraph metadata |

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | RSC + generateStaticParams = static page engine |
| Styling | Tailwind CSS only | No component libraries — discipline + minimal bundle |
| Database | PostgreSQL via Neon | Serverless, free tier, relational |
| ORM | Prisma | Type-safe, migration history, schema-as-code |
| Deployment | Cloudflare Pages | Edge CDN, extremely cheap bandwidth, global delivery, ideal for SEO-heavy products |

---

## API Endpoints

### `POST /api/ingest-salary`
Ingest a new salary record. Server recomputes `total_compensation` regardless of input.

```json
{
  "company": "Google India",
  "role": "Software Engineer",
  "level": "L4",
  "location": "Bengaluru",
  "currency": "INR",
  "experience_years": 5,
  "base_salary": 3800000,
  "bonus": 600000,
  "stock": 1200000
}
```

Returns `201` with full stored record, or `400` with per-field errors, or `409` for duplicates.

### `GET /api/salaries`
Query params: `company`, `role`, `level`, `location`, `sort`, `page`, `limit` (max 100)

```
GET /api/salaries?company=amazon&level=SDE_II&sort=total_comp_desc&page=1
```

### `GET /api/companies/:slug`
Returns company metadata, all salaries, computed median TC, and level distribution.

### `GET /api/compare?s1={id}&s2={id}`
Returns both records and a delta object (record1 value minus record2 value).

---

## Architecture Decisions

### Core Philosophy
Every rendering decision follows one rule:

**`User → CDN → Static HTML → Done`**

Never: `User → Server → DB → SSR → Response`

This keeps infra cost near-zero at scale (₹2k–₹5k/month at 10k MAU), eliminates scaling risk, and makes every page fast globally by default. TalentDash is a discovery platform and structured data business — not a real-time app. Static-first is the only correct architecture for it.

### Why Static + ISR instead of SSR everywhere?

TalentDash's business model is SEO-driven traffic. A dynamically rendered salary page costs server time on every request. A statically generated page is served from CDN edge at ~0ms anywhere in the world. With ISR (revalidate: 300s for salaries), data stays fresh without full rebuilds.

Rule I followed:
- **Static** (`generateStaticParams`): Company pages, salary pages — change rarely, maximum SEO value
- **ISR** (revalidate): Homepage, salary index — change daily but not real-time
- **Dynamic** (force-dynamic): Admin endpoints, ingest — auth or write paths
- **Client component**: Compare page — URL-driven state, two-way interaction that can't be server-rendered

### Why page-based pagination instead of cursor-based?

Cursor-based pagination is better for infinite scroll but worse for URL-shareability. TalentDash's filters need to be shareable links (`/salaries?company=amazon&level=L4&page=3`). Page-based also allows "Showing 26–50 of 312 records" which is meaningful for users. The downside (inconsistency if new records are added mid-pagination) is acceptable for our use case.

### What I would build with another day

1. **ISR revalidation trigger** — after `POST /api/ingest-salary`, call `revalidatePath('/salaries')` and `revalidatePath('/companies/${slug}')` to immediately refresh affected pages
2. **Sitemap generation** — auto-generated XML sitemap from all company slugs and salary pages for Google indexing
3. **Salary submission form** — let users contribute their own salary data through a validated UI
4. **Search page** — full-text search across companies and roles using PostgreSQL `tsvector`

### What I deliberately cut (scope decisions under 72h)

- **Auth / contributor verification** — the task says no auth, kept it open
- **Community/Forum section** — out of scope for this trial
- **Workplace Index** — requires composite scoring algorithm, would need more data
- **Tools pages** (salary calculator, hike calculator) — pure client-side, could be added next sprint
- **AI normalization pipeline** — full-stack role focused on frontend + backend, not the scraper

### Cache-Control TTL reasoning

| Endpoint | TTL | Reasoning |
|---|---|---|
| GET /api/salaries | `s-maxage=300, stale-while-revalidate=3600` | Salary data updated frequently; 5min fresh, serve stale for 1hr while revalidating |
| GET /api/companies/:slug | `s-maxage=3600, stale-while-revalidate=86400` | Company data changes rarely; 1hr fresh, 24hr stale ok |

---

## Project Structure

```
talentdash/
├── app/
│   ├── api/
│   │   ├── ingest-salary/route.ts   # POST — validated salary ingestion
│   │   ├── salaries/route.ts        # GET — filtered, paginated salary list
│   │   ├── companies/[slug]/route.ts # GET — company + salary aggregates
│   │   └── compare/route.ts         # GET — two-record delta comparison
│   ├── salaries/page.tsx            # Static salary table (RSC)
│   ├── companies/[slug]/page.tsx    # Static company pages (generateStaticParams)
│   ├── compare/page.tsx             # Client component (URL state)
│   └── page.tsx                     # Homepage (ISR)
├── components/
│   ├── ui/                          # Primitive components (LevelBadge, Navbar)
│   └── features/                   # Product components (SalaryTable, LevelDistributionBar)
├── lib/
│   ├── db.ts                        # Prisma singleton
│   ├── currency.ts                  # Conversion + formatting
│   ├── levels.ts                    # Level badge colors + display
│   ├── normalize.ts                 # Company name normalization
│   └── aliases.json                 # Company alias lookup table
├── types/index.ts                   # TypeScript interfaces
└── prisma/
    ├── schema.prisma                # DB schema with enums + indexes
    └── seed.ts                      # 60+ records across 12 companies
```

---

## Hardest Decision

The hardest architectural decision was the **rendering strategy for the Salary Table page**. The filters (company, role, level, location) are user-driven and can't be pre-rendered. My options were: (1) pure SSR on every filter change, (2) static shell with client-side fetching, or (3) static initial load with client-side API calls on filter change.

I chose option 3. The initial page load is a React Server Component that fetches the first 25 records at build time — giving perfect LCP and SEO for the unfiltered state, which is the state Google indexes. When a user applies filters, the client calls `/api/salaries` and updates state. This means zero server cost for the initial load (CDN-served HTML), and the API handles filter queries. The filter state is URL-encoded so links are shareable and filters survive page refresh.

The trade-off: the filtered state isn't indexable by Google. But salary filter combinations (`?company=amazon&level=L4&location=bengaluru`) are already served by dedicated static pages like `/salaries/amazon/software-engineer/bengaluru` — which I'd build in the next sprint.
