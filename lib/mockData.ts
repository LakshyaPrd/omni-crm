export type Channel = "email" | "whatsapp" | "linkedin" | "sms" | "outreach";
export type LeadStage = "new" | "contacted" | "qualified" | "proposal" | "closed_won" | "closed_lost";
export type MessageDirection = "inbound" | "outbound";

export interface Company {
  id: string;
  name: string;
  plan: "starter" | "growth" | "enterprise";
  leadCount: number;
  color: string;
  initials: string;
}

export interface Lead {
  id: string;
  companyId: string;
  name: string;
  email: string;
  title: string;
  company: string;
  stage: LeadStage;
  score: number;
  lastTouchedAt: string;
  channels: Channel[];
  avatar: string;
}

export interface ChannelIdentity {
  channel: Channel;
  handle: string;
}

export interface Message {
  id: string;
  leadId: string;
  channel: Channel;
  direction: MessageDirection;
  body: string;
  sentAt: string;
  agentName?: string;
}

export interface AIContextSnapshot {
  leadId: string;
  summary: string;
  keyFacts: string[];
  updatedAt: string;
  sentiment: "positive" | "neutral" | "negative";
  nextAction: string;
}

// ─── Mock Companies ─────────────────────────────────────────────────────────
export const companies: Company[] = [
  { id: "c1", name: "Nexova Labs", plan: "enterprise", leadCount: 142, color: "#818cf8", initials: "NL" },
  { id: "c2", name: "Meridian Group", plan: "growth", leadCount: 87, color: "#34d399", initials: "MG" },
  { id: "c3", name: "Skyvault SaaS", plan: "starter", leadCount: 34, color: "#fb923c", initials: "SS" },
];

// ─── Mock Leads ─────────────────────────────────────────────────────────────
export const leads: Lead[] = [
  {
    id: "l1", companyId: "c1", name: "Priya Mehta", email: "priya@techcorp.io",
    title: "VP of Engineering", company: "TechCorp", stage: "qualified", score: 87,
    lastTouchedAt: "2 min ago", channels: ["email", "whatsapp", "linkedin"], avatar: "PM",
  },
  {
    id: "l2", companyId: "c1", name: "James Okafor", email: "james@fintechblue.com",
    title: "Head of Partnerships", company: "FintechBlue", stage: "proposal", score: 92,
    lastTouchedAt: "15 min ago", channels: ["linkedin", "email"], avatar: "JO",
  },
  {
    id: "l3", companyId: "c1", name: "Sofia Ramirez", email: "sofia@cloudbase.dev",
    title: "CTO", company: "CloudBase", stage: "contacted", score: 64,
    lastTouchedAt: "1 hr ago", channels: ["email", "sms"], avatar: "SR",
  },
  {
    id: "l4", companyId: "c2", name: "Aiden Park", email: "aiden@scaleops.co",
    title: "Founder & CEO", company: "ScaleOps", stage: "new", score: 71,
    lastTouchedAt: "3 hrs ago", channels: ["outreach", "email"], avatar: "AP",
  },
  {
    id: "l5", companyId: "c2", name: "Lena Fischer", email: "lena@datawave.eu",
    title: "Director of Sales", company: "DataWave", stage: "closed_won", score: 98,
    lastTouchedAt: "Yesterday", channels: ["whatsapp", "linkedin", "email"], avatar: "LF",
  },
  {
    id: "l6", companyId: "c3", name: "Marcus Webb", email: "marcus@buildnow.io",
    title: "Product Manager", company: "BuildNow", stage: "contacted", score: 55,
    lastTouchedAt: "2 days ago", channels: ["email", "linkedin"], avatar: "MW",
  },
];

// ─── Channel Identities ──────────────────────────────────────────────────────
export const channelIdentities: Record<string, ChannelIdentity[]> = {
  l1: [
    { channel: "email", handle: "priya@techcorp.io" },
    { channel: "whatsapp", handle: "+91 98765 43210" },
    { channel: "linkedin", handle: "linkedin.com/in/priyamehta" },
  ],
  l2: [
    { channel: "linkedin", handle: "linkedin.com/in/jamesokafor" },
    { channel: "email", handle: "james@fintechblue.com" },
  ],
  l3: [
    { channel: "email", handle: "sofia@cloudbase.dev" },
    { channel: "sms", handle: "+1 555 012 3456" },
  ],
};

// ─── Mock Messages ───────────────────────────────────────────────────────────
export const messages: Message[] = [
  {
    id: "m1", leadId: "l1", channel: "linkedin", direction: "inbound",
    body: "Hi, I came across your platform from a colleague. We're scaling our outreach team and looking for something smarter than our current setup. Would love to learn more.",
    sentAt: "3 days ago",
  },
  {
    id: "m2", leadId: "l1", channel: "linkedin", direction: "outbound",
    body: "Hi Priya! Great to connect. We help teams unify all their lead communication across channels in one place — with AI context so you never lose the thread. Happy to set up a 20-min demo?",
    sentAt: "3 days ago", agentName: "You",
  },
  {
    id: "m3", leadId: "l1", channel: "email", direction: "inbound",
    body: "Sure, sounds interesting. We have about 15 reps doing multi-channel outreach and the context switching is killing us. Can you send me pricing details first?",
    sentAt: "2 days ago",
  },
  {
    id: "m4", leadId: "l1", channel: "email", direction: "outbound",
    body: "Absolutely Priya — attaching our pricing deck. Enterprise plan starts at $499/mo for unlimited channels, up to 50 seats, and full AI context across all touchpoints. Let me know your thoughts!",
    sentAt: "2 days ago", agentName: "You",
  },
  {
    id: "m5", leadId: "l1", channel: "whatsapp", direction: "inbound",
    body: "Hey, checked the deck — looks solid. Quick question: does the LinkedIn integration work for both InMail and connection requests? And what's the onboarding timeline look like?",
    sentAt: "2 min ago",
  },
];

// ─── AI Context Snapshots ────────────────────────────────────────────────────
export const aiSnapshots: Record<string, AIContextSnapshot> = {
  l1: {
    leadId: "l1",
    summary: "Priya is VP of Engineering at TechCorp, actively evaluating outreach tools for a 15-rep team. She's shown high intent — moved from LinkedIn → Email → WhatsApp in 3 days. Main concerns: LinkedIn integration depth and onboarding timeline. Has seen pricing deck and responded positively.",
    keyFacts: [
      "Team size: ~15 reps doing multi-channel outreach",
      "Pain point: context switching across channels",
      "Reviewed pricing deck — positive signal",
      "Current blocker: LinkedIn InMail + connection request support",
      "Asking about onboarding timeline → close-readiness signal",
    ],
    updatedAt: "2 min ago",
    sentiment: "positive",
    nextAction: "Confirm LinkedIn InMail support & share onboarding guide. Push for demo booking.",
  },
  l2: {
    leadId: "l2",
    summary: "James is Head of Partnerships at FintechBlue, reached via LinkedIn. Interested in enterprise plan for partnership workflow automation. Currently reviewing proposal doc sent yesterday.",
    keyFacts: [
      "Partnership-focused use case, not typical sales",
      "Proposal sent — awaiting feedback",
      "Decision timeline: end of quarter",
    ],
    updatedAt: "15 min ago",
    sentiment: "positive",
    nextAction: "Follow up on proposal. Ask if he has questions before their team review.",
  },
};

// ─── Stats ───────────────────────────────────────────────────────────────────
export const dashboardStats = {
  totalLeads: 263,
  activeToday: 47,
  aiDraftsAccepted: 89,
  avgResponseTime: "4.2 min",
  channelBreakdown: [
    { channel: "Email" as const, count: 112, pct: 43 },
    { channel: "WhatsApp" as const, count: 74, pct: 28 },
    { channel: "LinkedIn" as const, count: 51, pct: 19 },
    { channel: "SMS" as const, count: 26, pct: 10 },
  ],
  recentActivity: [
    { id: 1, lead: "Priya Mehta", action: "Replied via WhatsApp", time: "2 min ago", channel: "whatsapp" as Channel },
    { id: 2, lead: "James Okafor", action: "Opened proposal email", time: "14 min ago", channel: "email" as Channel },
    { id: 3, lead: "Sofia Ramirez", action: "New inbound SMS", time: "1 hr ago", channel: "sms" as Channel },
    { id: 4, lead: "Aiden Park", action: "Outreach form submitted", time: "3 hrs ago", channel: "outreach" as Channel },
    { id: 5, lead: "Lena Fischer", action: "Deal marked closed won", time: "Yesterday", channel: "email" as Channel },
  ],
};
