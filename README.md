# MrRed — Deal Signal Intelligence

MrRed analyzes deals across company background, financials, licenses, legal factors, and more — then outputs **Red (Stop)**, **Amber (Check)**, or **Green (Go)** signals.

## Features

- **Deal Analysis** — Background research on company, business, numbers, licenses, and operational factors
- **Rule Register** — Configurable scoring and gate rules
- **Scoring Matrix** — Point allocation mapping factors to signals
- **Hard Gate Engine** — Non-negotiable pass/fail checks that override scoring
- **Leaderboard** — Analyst rankings by deal volume and accuracy
- **Audit Trail** — Full history of all system actions
- **Outcome Ledger** — Track predicted vs actual deal outcomes

## Tech Stack

- **Next.js 16** (App Router)
- **Better Auth** — Email/password authentication
- **Neon** — Serverless PostgreSQL
- **Drizzle ORM** — Type-safe database access
- **Tailwind CSS 4** — Responsive styling
- **Atomic Design** — Atoms → Molecules → Organisms → Templates

## Getting Started

### 1. Set up Neon Database

1. Create a free database at [neon.tech](https://neon.tech)
2. Copy your connection string

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
BETTER_AUTH_SECRET="your-32-char-secret"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a secret: `openssl rand -base64 32`

### 3. Push Database Schema

```bash
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

### Presentation demo data

Load realistic sample data for demos and pitches:

```env
DEMO_DATA=true
NEXT_PUBLIC_DEMO_DATA=true
```

This fills the app with 7 sample deals (red/amber/green), rules, hard gates, scoring matrix, audit trail, outcomes, and leaderboard entries.

**Turn off** by setting both to `false` and restarting the dev server.

Open [http://localhost:3000](http://localhost:3000), sign up, then:

1. Go to **Rule Register** → **Load Default Rules**
2. Create a new deal under **Deals**
3. Fill in research factors and **Run Analysis**

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & signup
│   ├── (dashboard)/     # Protected app pages
│   └── api/             # REST API routes
├── components/
│   ├── atoms/           # Button, Input, SignalIcon, Badge...
│   ├── molecules/       # SignalBadge, DealCard, StatCard...
│   ├── organisms/       # Sidebar, AnalysisPanel, TrafficLight...
│   └── templates/       # Container, AppLayout, PageHeader
├── db/
│   └── schema/          # Drizzle schema (auth, deals, rules...)
├── lib/
│   ├── engine/          # Analysis engine (scoring, gates)
│   └── auth.ts          # Better Auth config
└── types/               # Shared TypeScript types
```

## Signal Logic

| Signal | Meaning | Action |
|--------|---------|--------|
| 🔴 Red | Stop | Do not proceed — critical issues or low score |
| 🟡 Amber | Check | Review flagged factors before deciding |
| 🟢 Green | Go | Strong profile — proceed with due diligence |

Hard gates (invalid license, active litigation, sanctions) automatically force a **Red** signal regardless of score.
