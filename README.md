# NexCRM — AI-Powered Sales, Hiring & Lead Intelligence Platform

Next.js 14 + TypeScript + Tailwind CSS + Recharts
Inspired by HubSpot + Apollo.io + LinkedIn Sales Navigator

## Quick Start

```bash
cd nexcrm
npm install
npm run dev
# Open http://localhost:3000
```

## All Pages

### Core CRM (9 pages)
- `/` — Dashboard (KPIs, charts, activity feed)
- `/leads` — Leads table + drawer
- `/companies` — Companies grid/table
- `/campaigns` — Campaign builder (visual sequence)
- `/inbox` — Unified inbox (email/WA/LinkedIn/SMS + AI)
- `/hiring` — Candidates table + Kanban
- `/integrations` — Integration cards
- `/reports` — Analytics charts
- `/settings` — Company/Team/API/Billing tabs

### Lead Intelligence (9 pages)
- `/lead-intelligence` — Hub overview
- `/lead-intelligence/imported` — Imported leads (list/grid/table)
- `/lead-intelligence/search` — Dedicated search with Boolean + AI
- `/lead-intelligence/people` — People profiles grid
- `/lead-intelligence/people/[id]` — Full 10-tab lead profile
- `/lead-intelligence/companies` — Company profiles list
- `/lead-intelligence/companies/[id]` — Company profile
- `/lead-intelligence/sources` — Source integrations
- `/lead-intelligence/sync-history` — Import logs

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (charts)
- Lucide React (icons)
