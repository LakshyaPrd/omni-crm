# NexCRM – AI-Powered Sales & Hiring Platform

A premium SaaS CRM frontend built with Next.js 14, Tailwind CSS, and Recharts.
Inspired by HubSpot and Apollo.io, tailored for **Outreach + Hiring + AI + Unified Inbox**.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# 1. Navigate to the project
cd nexcrm

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

---

## 📁 Project Structure

```
nexcrm/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx                # Dashboard
│   │   ├── leads/page.tsx          # Leads Management
│   │   ├── companies/page.tsx      # Companies
│   │   ├── campaigns/page.tsx      # Campaign Builder
│   │   ├── inbox/page.tsx          # Unified Inbox
│   │   ├── hiring/page.tsx         # Hiring & Candidates
│   │   ├── integrations/page.tsx   # Integrations
│   │   ├── reports/page.tsx        # Reports & Analytics
│   │   └── settings/page.tsx       # Settings
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx         # Collapsible sidebar navigation
│   │   │   ├── Navbar.tsx          # Top navbar with company switcher
│   │   │   └── MainLayout.tsx      # Main layout wrapper
│   │   ├── ui/
│   │   │   ├── Badge.tsx           # Badge + StatusBadge components
│   │   │   ├── Button.tsx          # Button variants (primary/secondary/ghost/danger)
│   │   │   ├── Card.tsx            # Card components
│   │   │   └── Avatar.tsx          # Avatar with initials
│   │   └── dashboard/
│   │       └── KpiCard.tsx         # KPI metric card
│   └── lib/
│       ├── data.ts                 # Dummy/mock data
│       └── utils.ts                # Utility functions (cn, color helpers)
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## 🎨 Design System

### Colors
- **Primary**: Indigo/Brand (`brand-*`) — `#6366f1`
- **Success**: Emerald
- **Warning**: Amber
- **Danger**: Red
- **Neutral**: Slate

### Components
| Component | Variants |
|-----------|----------|
| Button | `primary`, `secondary`, `ghost`, `danger` |
| Badge | `default`, `success`, `warning`, `danger`, `info`, `purple` |
| StatusBadge | Auto-maps status strings to badge variants |
| Avatar | Sizes: `xs`, `sm`, `md`, `lg` |
| Card | With/without padding, hover states |

### CSS Classes (Global)
```css
.card            /* White card with border + shadow */
.btn-primary     /* Brand blue button */
.btn-secondary   /* White bordered button */
.btn-ghost       /* Transparent hover button */
.input-field     /* Styled form input */
.badge           /* Small pill badge */
.sidebar-link    /* Sidebar nav item */
.table-header    /* Table column header */
.table-row       /* Table row with hover */
```

---

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with KPIs, charts, activity feed |
| `/leads` | Lead table with filters, search, AI score, drawer |
| `/companies` | Company grid/table view |
| `/campaigns` | Campaign list + visual sequence builder |
| `/inbox` | Full-screen unified inbox (email/WA/LinkedIn/SMS) |
| `/hiring` | Candidate table + kanban board |
| `/integrations` | Integration cards with connect/disconnect |
| `/reports` | Analytics charts (open rates, replies, conversions) |
| `/settings` | Company, Team, API Keys, Billing tabs |

---

## ✨ Key Features

- **Multi-tenant Company Switcher** in navbar
- **Collapsible Sidebar** navigation
- **Campaign Sequence Builder** with visual drag-and-drop-style steps
- **Unified Inbox** with 3-panel layout + AI Reply suggestions
- **Lead Detail Drawer** with AI score and activity timeline
- **Candidate Kanban Board** with AI matching scores
- **Recharts** for all data visualizations
- **Fully typed** with TypeScript
- **All dummy data** included for immediate preview

---

## 🔧 Backend Integration

All pages use dummy data from `src/lib/data.ts`. To connect to a backend:

1. Replace data imports with API calls (React Query / SWR recommended)
2. Add authentication (NextAuth.js or Clerk)
3. Add real-time updates (WebSockets or Pusher) for inbox

---

## 📦 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (charts)
- **Lucide React** (icons)
- **clsx + tailwind-merge** (class utilities)
