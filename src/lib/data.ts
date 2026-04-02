export const companies = [
  { id: "1", name: "Acme Corp", logo: "AC", color: "bg-violet-600", plan: "Pro" },
  { id: "2", name: "TechFlow Inc", logo: "TF", color: "bg-blue-600", plan: "Growth" },
  { id: "3", name: "NovaStar Ltd", logo: "NS", color: "bg-emerald-600", plan: "Enterprise" },
];

export const currentCompany = companies[0];

export const kpiData = [
  { label: "Total Leads", value: "12,847", change: "+14.2%", positive: true, icon: "Users" },
  { label: "Active Campaigns", value: "34", change: "+3", positive: true, icon: "Zap" },
  { label: "Replies", value: "2,391", change: "+22.7%", positive: true, icon: "MessageSquare" },
  { label: "Conversions", value: "847", change: "+8.1%", positive: true, icon: "TrendingUp" },
];

export const campaignPerformance = [
  { month: "Jan", sent: 4200, opened: 1890, replied: 630, converted: 189 },
  { month: "Feb", sent: 5100, opened: 2295, replied: 765, converted: 230 },
  { month: "Mar", sent: 4800, opened: 2160, replied: 720, converted: 216 },
  { month: "Apr", sent: 6200, opened: 2790, replied: 930, converted: 279 },
  { month: "May", sent: 7100, opened: 3195, replied: 1065, converted: 320 },
  { month: "Jun", sent: 6800, opened: 3060, replied: 1020, converted: 306 },
  { month: "Jul", sent: 8200, opened: 3690, replied: 1230, converted: 369 },
];

export const hiringFunnel = [
  { stage: "Applied", count: 1240 },
  { stage: "Screened", count: 620 },
  { stage: "Interview", count: 310 },
  { stage: "Offer", count: 95 },
  { stage: "Hired", count: 62 },
];

export const recentActivity = [
  { id: 1, type: "reply", user: "Sarah Johnson", action: "replied to campaign", target: "SaaS Founders Q3", time: "2m ago", avatar: "SJ", color: "bg-emerald-500" },
  { id: 2, type: "lead", user: "Michael Chen", action: "added as new lead", target: "from LinkedIn", time: "8m ago", avatar: "MC", color: "bg-blue-500" },
  { id: 3, type: "campaign", user: "Growth Campaign", action: "reached 50% open rate", target: "", time: "15m ago", avatar: "GC", color: "bg-violet-500" },
  { id: 4, type: "hire", user: "Emma Davis", action: "moved to Interview stage", target: "Senior Dev role", time: "23m ago", avatar: "ED", color: "bg-orange-500" },
  { id: 5, type: "reply", user: "James Wilson", action: "replied to WhatsApp sequence", target: "", time: "41m ago", avatar: "JW", color: "bg-teal-500" },
  { id: 6, type: "lead", user: "Priya Patel", action: "converted to customer", target: "$2,400/yr", time: "1h ago", avatar: "PP", color: "bg-pink-500" },
];

export const leads = [
  { id: 1, name: "Alex Morgan", company: "Stripe", email: "alex@stripe.com", status: "qualified", tags: ["SaaS", "Enterprise"], score: 92, lastContact: "2h ago" },
  { id: 2, name: "Ryan Foster", company: "Notion", email: "ryan@notion.so", status: "contacted", tags: ["PLG", "Mid-market"], score: 78, lastContact: "1d ago" },
  { id: 3, name: "Aria Chen", company: "Figma", email: "aria@figma.com", status: "new", tags: ["Design", "SaaS"], score: 85, lastContact: "3h ago" },
  { id: 4, name: "Tom Blake", company: "Linear", email: "tom@linear.app", status: "replied", tags: ["Dev Tools"], score: 71, lastContact: "5h ago" },
  { id: 5, name: "Mia Santos", company: "Vercel", email: "mia@vercel.com", status: "qualified", tags: ["Infrastructure"], score: 88, lastContact: "30m ago" },
  { id: 6, name: "Jake Kim", company: "Supabase", email: "jake@supabase.io", status: "lost", tags: ["OSS", "Dev Tools"], score: 45, lastContact: "4d ago" },
  { id: 7, name: "Zara Ahmed", company: "Webflow", email: "zara@webflow.com", status: "new", tags: ["NoCode", "SaaS"], score: 67, lastContact: "2d ago" },
  { id: 8, name: "Luis Ortiz", company: "Loom", email: "luis@loom.com", status: "contacted", tags: ["Video", "B2B"], score: 73, lastContact: "6h ago" },
  { id: 9, name: "Nina Patel", company: "Airtable", email: "nina@airtable.com", status: "qualified", tags: ["Enterprise"], score: 91, lastContact: "1h ago" },
  { id: 10, name: "Chris Wu", company: "Retool", email: "chris@retool.com", status: "replied", tags: ["Dev Tools", "Enterprise"], score: 82, lastContact: "4h ago" },
];

export const companiesList = [
  { id: 1, name: "Stripe", industry: "Fintech", leads: 12, status: "active", revenue: "$4.2B", contacts: 8 },
  { id: 2, name: "Notion", industry: "Productivity", leads: 7, status: "active", revenue: "$1.1B", contacts: 5 },
  { id: 3, name: "Figma", industry: "Design Tools", leads: 9, status: "active", revenue: "$800M", contacts: 6 },
  { id: 4, name: "Linear", industry: "Dev Tools", leads: 4, status: "prospect", revenue: "$35M", contacts: 3 },
  { id: 5, name: "Vercel", industry: "Infrastructure", leads: 11, status: "active", revenue: "$250M", contacts: 7 },
  { id: 6, name: "Supabase", industry: "Database", leads: 3, status: "lost", revenue: "$80M", contacts: 2 },
];

export const campaigns = [
  { id: 1, name: "SaaS Founders Q3 Outreach", status: "active", leads: 842, sent: 3200, openRate: 42.3, replyRate: 18.7, channel: ["email", "linkedin"] },
  { id: 2, name: "DevTools Cold Outreach", status: "active", leads: 421, sent: 1800, openRate: 38.1, replyRate: 14.2, channel: ["email", "whatsapp"] },
  { id: 3, name: "Enterprise Q4 Push", status: "draft", leads: 156, sent: 0, openRate: 0, replyRate: 0, channel: ["email", "linkedin", "call"] },
  { id: 4, name: "Re-engagement Aug", status: "paused", leads: 1204, sent: 4800, openRate: 28.4, replyRate: 9.1, channel: ["email"] },
  { id: 5, name: "Startup Accelerator", status: "completed", leads: 320, sent: 1280, openRate: 51.2, replyRate: 22.5, channel: ["linkedin", "email"] },
];

export const conversations = [
  { id: 1, contact: "Alex Morgan", company: "Stripe", preview: "Thanks for reaching out! I'd love to...", time: "2m", unread: true, channel: "email", avatar: "AM", color: "bg-blue-500" },
  { id: 2, contact: "Priya Patel", company: "Airtable", preview: "Can we schedule a call next week?", time: "15m", unread: true, channel: "whatsapp", avatar: "PP", color: "bg-pink-500" },
  { id: 3, contact: "Ryan Foster", company: "Notion", preview: "Sounds interesting, send me more details", time: "1h", unread: false, channel: "linkedin", avatar: "RF", color: "bg-violet-500" },
  { id: 4, contact: "Zara Ahmed", company: "Webflow", preview: "I checked out your website and...", time: "3h", unread: false, channel: "email", avatar: "ZA", color: "bg-teal-500" },
  { id: 5, contact: "Tom Blake", company: "Linear", preview: "What's the pricing look like?", time: "5h", unread: false, channel: "sms", avatar: "TB", color: "bg-orange-500" },
  { id: 6, contact: "Nina Chen", company: "Figma", preview: "We're already using a competitor but...", time: "1d", unread: false, channel: "email", avatar: "NC", color: "bg-emerald-500" },
];

export const candidates = [
  { id: 1, name: "Jordan Lee", role: "Senior Frontend Dev", status: "interview", aiScore: 94, experience: "7 years", location: "San Francisco", applied: "2d ago" },
  { id: 2, name: "Taylor Singh", role: "Product Manager", status: "screening", aiScore: 81, experience: "5 years", location: "New York", applied: "3d ago" },
  { id: 3, name: "Cameron Park", role: "ML Engineer", status: "offer", aiScore: 97, experience: "9 years", location: "Seattle", applied: "1w ago" },
  { id: 4, name: "Morgan Davis", role: "Sales Engineer", status: "applied", aiScore: 72, experience: "3 years", location: "Austin", applied: "1d ago" },
  { id: 5, name: "Riley Johnson", role: "Backend Engineer", status: "rejected", aiScore: 56, experience: "2 years", location: "Chicago", applied: "2w ago" },
  { id: 6, name: "Avery Thompson", role: "UX Designer", status: "interview", aiScore: 88, experience: "6 years", location: "Remote", applied: "4d ago" },
];

export const integrations = [
  { id: "gmail", name: "Gmail", category: "Email", description: "Send and receive emails directly from CRM", connected: true, icon: "Mail" },
  { id: "outlook", name: "Outlook", category: "Email", description: "Microsoft Outlook integration for email campaigns", connected: false, icon: "Mail" },
  { id: "whatsapp", name: "WhatsApp Business", category: "Messaging", description: "Send WhatsApp messages at scale", connected: true, icon: "MessageCircle" },
  { id: "linkedin", name: "LinkedIn Sales Nav", category: "Social", description: "Import leads and send LinkedIn messages", connected: true, icon: "Linkedin" },
  { id: "twilio", name: "Twilio SMS", category: "SMS", description: "Send SMS messages via Twilio", connected: false, icon: "Phone" },
  { id: "zoom", name: "Zoom", category: "Meetings", description: "Schedule and join meetings from CRM", connected: true, icon: "Video" },
  { id: "calendly", name: "Calendly", category: "Meetings", description: "Share booking links and sync meetings", connected: false, icon: "Calendar" },
  { id: "hubspot", name: "HubSpot", category: "CRM", description: "Sync contacts and deals with HubSpot", connected: false, icon: "Database" },
  { id: "salesforce", name: "Salesforce", category: "CRM", description: "Bi-directional sync with Salesforce", connected: false, icon: "Cloud" },
  { id: "slack", name: "Slack", category: "Notifications", description: "Get CRM alerts in Slack channels", connected: true, icon: "Hash" },
  { id: "openai", name: "OpenAI", category: "AI", description: "Power AI suggestions and content generation", connected: true, icon: "Cpu" },
  { id: "apollo", name: "Apollo.io", category: "Data", description: "Enrich leads with Apollo data", connected: false, icon: "Search" },
];

export const analyticsData = {
  openRates: [
    { week: "W1", rate: 38.2 }, { week: "W2", rate: 41.5 }, { week: "W3", rate: 39.8 },
    { week: "W4", rate: 44.2 }, { week: "W5", rate: 42.7 }, { week: "W6", rate: 47.1 },
    { week: "W7", rate: 45.3 }, { week: "W8", rate: 49.8 },
  ],
  replyRates: [
    { week: "W1", rate: 12.4 }, { week: "W2", rate: 15.1 }, { week: "W3", rate: 13.8 },
    { week: "W4", rate: 17.2 }, { week: "W5", rate: 16.5 }, { week: "W6", rate: 19.3 },
    { week: "W7", rate: 18.7 }, { week: "W8", rate: 21.4 },
  ],
  conversions: [
    { month: "Jan", value: 189 }, { month: "Feb", value: 230 }, { month: "Mar", value: 216 },
    { month: "Apr", value: 279 }, { month: "May", value: 320 }, { month: "Jun", value: 306 },
    { month: "Jul", value: 369 },
  ],
};

export const teamMembers = [
  { id: 1, name: "Emma Richardson", email: "emma@acmecorp.com", role: "Admin", status: "active", lastLogin: "1h ago" },
  { id: 2, name: "David Park", email: "david@acmecorp.com", role: "Manager", status: "active", lastLogin: "3h ago" },
  { id: 3, name: "Sarah Miller", email: "sarah@acmecorp.com", role: "User", status: "active", lastLogin: "1d ago" },
  { id: 4, name: "Raj Gupta", email: "raj@acmecorp.com", role: "User", status: "inactive", lastLogin: "7d ago" },
];
