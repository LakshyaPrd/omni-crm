# OmniReach CRM — AI-Powered Omnichannel Lead Management

A production-ready frontend for an omnichannel CRM system that unifies leads across Email, WhatsApp, LinkedIn, SMS, and Outreach — with AI context memory per lead and multi-company workspace isolation.

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## Pages & Features

### `/dashboard`
- KPI stat cards: total leads, active today, AI draft acceptance rate, avg response time
- Recent leads table with stage badges and channel icons
- Channel breakdown bar chart
- Live activity feed (real-time-ready)

### `/inbox`
- Unified inbox showing all leads' last message across all channels
- Filter by channel (All / Email / WhatsApp / LinkedIn / SMS)
- Search across leads
- Full conversation thread view with channel-labeled bubbles
- Quick reply bar with AI Draft button

### `/leads`
- Full leads table with search + stage filter tabs
- Lead score, channels, last touch time
- Click any lead to open their profile

### `/leads/[id]` — Lead Detail
- Full profile header with channel identities (phone, email, LinkedIn handle, etc.)
- **Unified conversation timeline** — all messages from all channels merged chronologically, labeled by channel
- **AI Context Snapshot** — AI-generated summary of the lead, key facts, sentiment, and recommended next action
- **AI Reply Composer** — context-aware draft with channel selector, regenerate button, and send
- Lead score breakdown (engagement, intent, channel activity, response speed)
- Notes section

### `/companies`
- Multi-company workspace management
- Per-company stats: total leads, active leads, closed won, avg score
- Lead avatar preview per company
- Plan badge (Starter / Growth / Enterprise)

### `/settings`
- **Integrations**: Toggle Email, WhatsApp, LinkedIn, SMS, Outreach connections
- **Notifications**: Toggle per-event alerts
- **Security**: Role-based access control (Admin / Manager / Agent) + RLS status
- **AI & API Keys**: Model selector (Sonnet / Opus / Haiku), API key input, context window config

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| Fonts | Syne (display) + DM Sans (body) + DM Mono |
| Language | TypeScript |

---

## How to Connect a Real Backend

1. **Replace mock data** — swap `lib/mockData.ts` imports with real API calls (fetch/SWR/React Query)
2. **Database** — PostgreSQL with Supabase (row-level security per `company_id`)
3. **Channel webhooks** — set up inbound parsers for each channel, POST to `/api/messages/inbound`
4. **AI context** — on each inbound message, call Claude API with the lead's `AI_CONTEXT_SNAPSHOT` + new message, update snapshot, return AI draft
5. **Auth** — add NextAuth.js or Supabase Auth, pass `company_id` via JWT claims for RLS

---

## Project Structure

```
omnichannel-crm/
├── app/
│   ├── dashboard/page.tsx       # Main dashboard
│   ├── inbox/page.tsx           # Unified inbox
│   ├── leads/page.tsx           # Leads table
│   ├── leads/[id]/page.tsx      # Lead detail + AI composer
│   ├── companies/page.tsx       # Multi-company management
│   ├── settings/page.tsx        # Settings & integrations
│   ├── layout.tsx
│   ├── page.tsx                 # Redirects to /dashboard
│   └── globals.css
├── components/
│   ├── Sidebar.tsx              # Navigation + company switcher
│   ├── ChannelBadge.tsx         # Colored channel pill
│   ├── StageBadge.tsx           # Lead stage pill
│   ├── ConversationTimeline.tsx # Cross-channel message thread
│   └── AIComposer.tsx           # AI draft + send UI
├── lib/
│   └── mockData.ts              # All mock data + TypeScript types
├── tailwind.config.ts
├── next.config.mjs
└── tsconfig.json
```
