export type LeadSource =
  | "linkedin" | "salesrobot" | "apollo" | "smartlead"
  | "instantly" | "whatsapp" | "calling" | "email" | "csv" | "manual";

export type LeadStage =
  | "new" | "contacted" | "qualified" | "replied" | "meeting_booked"
  | "proposal" | "negotiation" | "converted" | "lost";

export interface ImportedLead {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  headline: string;
  designation: string;
  department: string;
  seniority: string;
  company: string;
  companyId: string;
  industry: string;
  companySize: string;
  location: string;
  city: string;
  country: string;
  timezone: string;
  avatar: string;
  avatarColor: string;
  source: LeadSource;
  stage: LeadStage;
  score: number;
  intentScore: number;
  engagementScore: number;
  emails: { address: string; verified: boolean; primary: boolean }[];
  phones: { number: string; verified: boolean; type: string }[];
  whatsapp?: string;
  linkedinUrl?: string;
  website?: string;
  tags: string[];
  owner: string;
  ownerAvatar: string;
  syncedAt: string;
  lastActivity: string;
  createdAt: string;
  connectionStatus: "1st" | "2nd" | "3rd" | "none";
  emailAvailable: boolean;
  phoneAvailable: boolean;
  enriched: boolean;
  syncStatus: "synced" | "pending" | "failed" | "partial";
  campaignsCount: number;
  repliedAt?: string;
  skills: string[];
  experience: string;
  education: string;
  summary: string;
}

export const importedLeads: ImportedLead[] = [
  {
    id: "li-001", firstName: "Sarah", lastName: "Connor", fullName: "Sarah Connor",
    headline: "Head of Growth at TechVault | Ex-Stripe | YC Alumni",
    designation: "Head of Growth", department: "Marketing", seniority: "Director",
    company: "TechVault", companyId: "co-001", industry: "SaaS", companySize: "51-200",
    location: "San Francisco, CA", city: "San Francisco", country: "United States", timezone: "PST",
    avatar: "SC", avatarColor: "bg-violet-500",
    source: "linkedin", stage: "qualified", score: 92, intentScore: 88, engagementScore: 74,
    emails: [{ address: "sarah@techvault.io", verified: true, primary: true }, { address: "sarahc@gmail.com", verified: false, primary: false }],
    phones: [{ number: "+1 (415) 555-0192", verified: true, type: "mobile" }],
    whatsapp: "+14155550192", linkedinUrl: "linkedin.com/in/sarahconnor",
    website: "techvault.io", tags: ["SaaS", "Growth", "YC", "Hot Lead"],
    owner: "Emma R.", ownerAvatar: "ER", syncedAt: "2h ago", lastActivity: "1h ago",
    createdAt: "Jan 14, 2025", connectionStatus: "2nd", emailAvailable: true, phoneAvailable: true,
    enriched: true, syncStatus: "synced", campaignsCount: 2, repliedAt: "3h ago",
    skills: ["Growth Hacking", "Product Marketing", "SEO", "Paid Acquisition", "Analytics"],
    experience: "8 years", education: "Stanford MBA",
    summary: "Seasoned growth leader with deep expertise in B2B SaaS. Previously scaled Stripe's self-serve revenue from $50M to $200M ARR."
  },
  {
    id: "li-002", firstName: "Marcus", lastName: "Webb", fullName: "Marcus Webb",
    headline: "VP Engineering @ Synapse AI | Building scalable infra",
    designation: "VP Engineering", department: "Engineering", seniority: "VP",
    company: "Synapse AI", companyId: "co-002", industry: "Artificial Intelligence", companySize: "201-500",
    location: "New York, NY", city: "New York", country: "United States", timezone: "EST",
    avatar: "MW", avatarColor: "bg-blue-500",
    source: "apollo", stage: "contacted", score: 78, intentScore: 62, engagementScore: 45,
    emails: [{ address: "marcus@synapseai.com", verified: true, primary: true }],
    phones: [{ number: "+1 (212) 555-0847", verified: false, type: "office" }],
    whatsapp: undefined, linkedinUrl: "linkedin.com/in/marcuswebb",
    website: "synapseai.com", tags: ["AI", "Enterprise", "Engineering"],
    owner: "David P.", ownerAvatar: "DP", syncedAt: "5h ago", lastActivity: "2d ago",
    createdAt: "Jan 10, 2025", connectionStatus: "3rd", emailAvailable: true, phoneAvailable: false,
    enriched: true, syncStatus: "synced", campaignsCount: 1,
    skills: ["Distributed Systems", "Kubernetes", "Go", "Python", "Team Leadership"],
    experience: "12 years", education: "MIT CS",
    summary: "Engineering leader specializing in building large-scale AI infrastructure. Led 3 successful platform migrations at Fortune 500 companies."
  },
  {
    id: "li-003", firstName: "Priya", lastName: "Nair", fullName: "Priya Nair",
    headline: "Founder & CEO | Fintech disruptor | Forbes 30 Under 30",
    designation: "CEO & Founder", department: "Executive", seniority: "C-Suite",
    company: "PayEdge", companyId: "co-003", industry: "Fintech", companySize: "11-50",
    location: "London, UK", city: "London", country: "United Kingdom", timezone: "GMT",
    avatar: "PN", avatarColor: "bg-emerald-500",
    source: "salesrobot", stage: "replied", score: 97, intentScore: 95, engagementScore: 89,
    emails: [{ address: "priya@payedge.io", verified: true, primary: true }],
    phones: [{ number: "+44 20 7946 0958", verified: true, type: "mobile" }],
    whatsapp: "+442079460958", linkedinUrl: "linkedin.com/in/priyanair",
    website: "payedge.io", tags: ["Fintech", "C-Suite", "Founder", "Hot Lead", "Replied"],
    owner: "Emma R.", ownerAvatar: "ER", syncedAt: "30m ago", lastActivity: "30m ago",
    createdAt: "Jan 15, 2025", connectionStatus: "1st", emailAvailable: true, phoneAvailable: true,
    enriched: true, syncStatus: "synced", campaignsCount: 3, repliedAt: "30m ago",
    skills: ["Fundraising", "B2B Sales", "Fintech", "Payments", "Leadership"],
    experience: "7 years", education: "LSE Finance",
    summary: "Visionary fintech founder who raised $24M Series A. Building the next-gen B2B payments infrastructure for emerging markets."
  },
  {
    id: "li-004", firstName: "Jordan", lastName: "Kim", fullName: "Jordan Kim",
    headline: "Director of Sales | SaaS | Helping teams hit quota",
    designation: "Director of Sales", department: "Sales", seniority: "Director",
    company: "Cloudstep", companyId: "co-004", industry: "Cloud Computing", companySize: "51-200",
    location: "Austin, TX", city: "Austin", country: "United States", timezone: "CST",
    avatar: "JK", avatarColor: "bg-orange-500",
    source: "instantly", stage: "new", score: 71, intentScore: 55, engagementScore: 32,
    emails: [{ address: "jordan@cloudstep.com", verified: true, primary: true }],
    phones: [], whatsapp: undefined, linkedinUrl: "linkedin.com/in/jordankim",
    website: "cloudstep.com", tags: ["Sales", "Cloud", "Mid-Market"],
    owner: "Sarah M.", ownerAvatar: "SM", syncedAt: "1d ago", lastActivity: "1d ago",
    createdAt: "Jan 12, 2025", connectionStatus: "2nd", emailAvailable: true, phoneAvailable: false,
    enriched: false, syncStatus: "partial", campaignsCount: 0,
    skills: ["Sales Strategy", "CRM", "Salesforce", "Pipeline Management"],
    experience: "9 years", education: "UT Austin BBA",
    summary: "Results-driven sales leader with a track record of building and scaling high-performance B2B SaaS sales teams."
  },
  {
    id: "li-005", firstName: "Elena", lastName: "Vasquez", fullName: "Elena Vasquez",
    headline: "CMO at NovaBrand | Brand strategist | Speaker",
    designation: "Chief Marketing Officer", department: "Marketing", seniority: "C-Suite",
    company: "NovaBrand", companyId: "co-005", industry: "Marketing Technology", companySize: "201-500",
    location: "Miami, FL", city: "Miami", country: "United States", timezone: "EST",
    avatar: "EV", avatarColor: "bg-pink-500",
    source: "smartlead", stage: "meeting_booked", score: 85, intentScore: 79, engagementScore: 68,
    emails: [{ address: "elena@novabrand.com", verified: true, primary: true }],
    phones: [{ number: "+1 (305) 555-0223", verified: true, type: "mobile" }],
    whatsapp: "+13055550223", linkedinUrl: "linkedin.com/in/elenavasquez",
    website: "novabrand.com", tags: ["MarTech", "C-Suite", "Meeting Booked"],
    owner: "David P.", ownerAvatar: "DP", syncedAt: "3h ago", lastActivity: "3h ago",
    createdAt: "Jan 11, 2025", connectionStatus: "1st", emailAvailable: true, phoneAvailable: true,
    enriched: true, syncStatus: "synced", campaignsCount: 2, repliedAt: "1d ago",
    skills: ["Brand Strategy", "Digital Marketing", "Content", "PR", "Demand Gen"],
    experience: "14 years", education: "Northwestern MBA",
    summary: "Award-winning CMO with expertise in scaling B2B brands. Built marketing engine at NovaBrand that drove 3x pipeline growth YoY."
  },
  {
    id: "li-006", firstName: "Raj", lastName: "Patel", fullName: "Raj Patel",
    headline: "Product Lead @ Infrastack | Open-source enthusiast",
    designation: "Product Lead", department: "Product", seniority: "Senior",
    company: "Infrastack", companyId: "co-006", industry: "Developer Tools", companySize: "11-50",
    location: "Bangalore, India", city: "Bangalore", country: "India", timezone: "IST",
    avatar: "RP", avatarColor: "bg-teal-500",
    source: "csv", stage: "contacted", score: 64, intentScore: 48, engagementScore: 37,
    emails: [{ address: "raj@infrastack.dev", verified: true, primary: true }],
    phones: [{ number: "+91 98765 43210", verified: false, type: "mobile" }],
    whatsapp: "+919876543210", linkedinUrl: "linkedin.com/in/rajpatel",
    website: "infrastack.dev", tags: ["DevTools", "Product", "India"],
    owner: "Emma R.", ownerAvatar: "ER", syncedAt: "2d ago", lastActivity: "2d ago",
    createdAt: "Jan 8, 2025", connectionStatus: "3rd", emailAvailable: true, phoneAvailable: false,
    enriched: false, syncStatus: "pending", campaignsCount: 1,
    skills: ["Product Strategy", "Agile", "DevOps", "Kubernetes", "Go"],
    experience: "6 years", education: "IIT Bombay",
    summary: "Product leader passionate about developer experience. Shipped 4 major infrastructure products used by 10,000+ developers worldwide."
  },
  {
    id: "li-007", firstName: "Aisha", lastName: "Okonkwo", fullName: "Aisha Okonkwo",
    headline: "Head of Partnerships | Africa & MENA expansion",
    designation: "Head of Partnerships", department: "Partnerships", seniority: "Senior",
    company: "PanAfrica Ventures", companyId: "co-007", industry: "Venture Capital", companySize: "11-50",
    location: "Lagos, Nigeria", city: "Lagos", country: "Nigeria", timezone: "WAT",
    avatar: "AO", avatarColor: "bg-amber-500",
    source: "whatsapp", stage: "new", score: 58, intentScore: 41, engagementScore: 28,
    emails: [{ address: "aisha@panafrica.vc", verified: false, primary: true }],
    phones: [{ number: "+234 801 234 5678", verified: true, type: "mobile" }],
    whatsapp: "+2348012345678", linkedinUrl: "linkedin.com/in/aishaokonkwo",
    website: "panafrica.vc", tags: ["VC", "Africa", "Partnerships", "MENA"],
    owner: "Sarah M.", ownerAvatar: "SM", syncedAt: "4h ago", lastActivity: "4h ago",
    createdAt: "Jan 15, 2025", connectionStatus: "2nd", emailAvailable: false, phoneAvailable: true,
    enriched: false, syncStatus: "synced", campaignsCount: 0,
    skills: ["Business Development", "Fundraising", "Africa Markets", "VC"],
    experience: "10 years", education: "Oxford MBA",
    summary: "Partnership leader driving African startup ecosystem growth. Connected 200+ startups with investors across 15 African countries."
  },
  {
    id: "li-008", firstName: "Tom", lastName: "Becker", fullName: "Tom Becker",
    headline: "CTO | Deep tech | AI infrastructure @ Nexus Labs",
    designation: "Chief Technology Officer", department: "Engineering", seniority: "C-Suite",
    company: "Nexus Labs", companyId: "co-008", industry: "Deep Tech", companySize: "51-200",
    location: "Berlin, Germany", city: "Berlin", country: "Germany", timezone: "CET",
    avatar: "TB", avatarColor: "bg-indigo-500",
    source: "email", stage: "lost", score: 34, intentScore: 20, engagementScore: 15,
    emails: [{ address: "tom@nexuslabs.de", verified: true, primary: true }],
    phones: [], whatsapp: undefined, linkedinUrl: "linkedin.com/in/tombecker",
    website: "nexuslabs.de", tags: ["Deep Tech", "AI", "Lost"],
    owner: "David P.", ownerAvatar: "DP", syncedAt: "1w ago", lastActivity: "1w ago",
    createdAt: "Dec 20, 2024", connectionStatus: "3rd", emailAvailable: true, phoneAvailable: false,
    enriched: true, syncStatus: "synced", campaignsCount: 1,
    skills: ["AI/ML", "Rust", "Python", "Systems Architecture"],
    experience: "15 years", education: "TU Berlin PhD",
    summary: "Deep tech CTO specializing in AI hardware optimization. Published 12 peer-reviewed papers on neural network acceleration."
  },
];

export const leadCompanies = [
  {
    id: "co-001", name: "TechVault", website: "techvault.io", industry: "SaaS",
    size: "51-200", headquarters: "San Francisco, CA", revenue: "$12M ARR",
    logo: "TV", logoColor: "bg-violet-600", contacts: 5, activeCampaigns: 2,
    source: ["linkedin", "apollo"], linkedinUrl: "linkedin.com/company/techvault",
    phone: "+1 (415) 555-0100", founded: "2019", description: "Enterprise SaaS platform for workflow automation, trusted by 800+ companies worldwide.",
    techStack: ["Salesforce", "HubSpot", "Slack", "AWS", "React"], hiringStatus: "Actively Hiring",
  },
  {
    id: "co-002", name: "Synapse AI", website: "synapseai.com", industry: "Artificial Intelligence",
    size: "201-500", headquarters: "New York, NY", revenue: "$45M ARR",
    logo: "SA", logoColor: "bg-blue-600", contacts: 8, activeCampaigns: 1,
    source: ["apollo"], linkedinUrl: "linkedin.com/company/synapseai",
    phone: "+1 (212) 555-0200", founded: "2017", description: "AI-first company building intelligent automation for enterprise knowledge management.",
    techStack: ["Azure", "Python", "TensorFlow", "Kubernetes", "MongoDB"], hiringStatus: "Hiring",
  },
  {
    id: "co-003", name: "PayEdge", website: "payedge.io", industry: "Fintech",
    size: "11-50", headquarters: "London, UK", revenue: "$8M ARR",
    logo: "PE", logoColor: "bg-emerald-600", contacts: 3, activeCampaigns: 3,
    source: ["salesrobot", "linkedin"], linkedinUrl: "linkedin.com/company/payedge",
    phone: "+44 20 7946 0900", founded: "2021", description: "Next-gen B2B payments infrastructure for emerging market businesses.",
    techStack: ["Stripe", "AWS", "Node.js", "React", "PostgreSQL"], hiringStatus: "Actively Hiring",
  },
  {
    id: "co-004", name: "Cloudstep", website: "cloudstep.com", industry: "Cloud Computing",
    size: "51-200", headquarters: "Austin, TX", revenue: "$22M ARR",
    logo: "CS", logoColor: "bg-orange-600", contacts: 4, activeCampaigns: 0,
    source: ["instantly"], linkedinUrl: "linkedin.com/company/cloudstep",
    phone: "+1 (512) 555-0300", founded: "2018", description: "Cloud migration and managed infrastructure services for mid-market enterprises.",
    techStack: ["AWS", "GCP", "Terraform", "Kubernetes", "Datadog"], hiringStatus: "Not Hiring",
  },
  {
    id: "co-005", name: "NovaBrand", website: "novabrand.com", industry: "Marketing Technology",
    size: "201-500", headquarters: "Miami, FL", revenue: "$38M ARR",
    logo: "NB", logoColor: "bg-pink-600", contacts: 6, activeCampaigns: 2,
    source: ["smartlead", "email"], linkedinUrl: "linkedin.com/company/novabrand",
    phone: "+1 (305) 555-0400", founded: "2016", description: "AI-powered brand intelligence platform helping CMOs measure and optimize brand equity.",
    techStack: ["HubSpot", "Marketo", "Salesforce", "React", "Python"], hiringStatus: "Hiring",
  },
];

export const leadSources = [
  {
    id: "linkedin", name: "LinkedIn Sales Navigator", category: "Social Prospecting",
    connected: true, lastSync: "2h ago", recordsSynced: 2847, syncHealth: 98,
    icon: "Linkedin", color: "bg-sky-700", fieldsMapped: 24, errors: 0,
    description: "Premium LinkedIn lead sourcing with Sales Navigator integration",
    apiStatus: "active",
  },
  {
    id: "salesrobot", name: "SalesRobot", category: "LinkedIn Automation",
    connected: true, lastSync: "3h ago", recordsSynced: 1204, syncHealth: 92,
    icon: "Bot", color: "bg-violet-600", fieldsMapped: 18, errors: 3,
    description: "Automated LinkedIn outreach sequences and lead capture",
    apiStatus: "active",
  },
  {
    id: "apollo", name: "Apollo.io", category: "Data Enrichment",
    connected: true, lastSync: "30m ago", recordsSynced: 4521, syncHealth: 99,
    icon: "Search", color: "bg-indigo-600", fieldsMapped: 31, errors: 0,
    description: "B2B contact data enrichment and prospecting database",
    apiStatus: "active",
  },
  {
    id: "smartlead", name: "Smartlead", category: "Email Outreach",
    connected: true, lastSync: "1h ago", recordsSynced: 892, syncHealth: 95,
    icon: "Mail", color: "bg-blue-600", fieldsMapped: 15, errors: 1,
    description: "Cold email outreach platform with automated sequencing",
    apiStatus: "active",
  },
  {
    id: "instantly", name: "Instantly.ai", category: "Email Outreach",
    connected: false, lastSync: "3d ago", recordsSynced: 340, syncHealth: 0,
    icon: "Zap", color: "bg-amber-600", fieldsMapped: 12, errors: 8,
    description: "Scale cold email outreach with automated follow-ups",
    apiStatus: "disconnected",
  },
  {
    id: "whatsapp", name: "WhatsApp Business API", category: "Messaging",
    connected: true, lastSync: "15m ago", recordsSynced: 678, syncHealth: 100,
    icon: "MessageCircle", color: "bg-emerald-600", fieldsMapped: 8, errors: 0,
    description: "WhatsApp Business messaging and lead capture integration",
    apiStatus: "active",
  },
  {
    id: "aircall", name: "Aircall", category: "Calling Platform",
    connected: true, lastSync: "4h ago", recordsSynced: 421, syncHealth: 87,
    icon: "Phone", color: "bg-rose-600", fieldsMapped: 11, errors: 5,
    description: "Cloud phone system with call recording and CRM sync",
    apiStatus: "active",
  },
  {
    id: "hunter", name: "Hunter.io", category: "Email Finder",
    connected: false, lastSync: "Never", recordsSynced: 0, syncHealth: 0,
    icon: "AtSign", color: "bg-orange-600", fieldsMapped: 6, errors: 0,
    description: "Find and verify professional email addresses",
    apiStatus: "not_connected",
  },
];

export const syncHistory = [
  { id: "sync-001", source: "Apollo.io", type: "Auto Sync", timestamp: "Today 10:42 AM", records: 847, success: 844, failed: 3, status: "completed", initiatedBy: "System", duration: "2m 14s" },
  { id: "sync-002", source: "LinkedIn Sales Nav", type: "Manual Import", timestamp: "Today 09:15 AM", records: 120, success: 120, failed: 0, status: "completed", initiatedBy: "Emma R.", duration: "45s" },
  { id: "sync-003", source: "Smartlead", type: "Webhook", timestamp: "Today 08:30 AM", records: 34, success: 33, failed: 1, status: "partial", initiatedBy: "System", duration: "8s" },
  { id: "sync-004", source: "SalesRobot", type: "Auto Sync", timestamp: "Yesterday 11:00 PM", records: 215, success: 212, failed: 3, status: "completed", initiatedBy: "System", duration: "1m 30s" },
  { id: "sync-005", source: "Instantly.ai", type: "Auto Sync", timestamp: "3 days ago", records: 0, success: 0, failed: 0, status: "failed", initiatedBy: "System", duration: "0s" },
  { id: "sync-006", source: "WhatsApp API", type: "Real-time", timestamp: "Today 10:55 AM", records: 12, success: 12, failed: 0, status: "completed", initiatedBy: "System", duration: "1s" },
  { id: "sync-007", source: "Aircall", type: "Auto Sync", timestamp: "Today 06:00 AM", records: 45, success: 40, failed: 5, status: "partial", initiatedBy: "System", duration: "22s" },
  { id: "sync-008", source: "Apollo.io", type: "CSV Import", timestamp: "Yesterday 03:20 PM", records: 1200, success: 1200, failed: 0, status: "completed", initiatedBy: "David P.", duration: "4m 12s" },
];

export const leadActivities = [
  { id: 1, type: "created", icon: "✨", label: "Lead created", detail: "Imported from LinkedIn Sales Navigator", time: "Jan 14, 2025 · 2:30 PM", user: "System", channel: "linkedin" },
  { id: 2, type: "enriched", icon: "🔍", label: "Profile enriched", detail: "Apollo.io enriched 24 fields — email, phone, company data", time: "Jan 14, 2025 · 2:31 PM", user: "System", channel: "apollo" },
  { id: 3, type: "email_sent", icon: "📧", label: "Email sent", detail: "Campaign: SaaS Founders Q3 — Step 1: Intro email", time: "Jan 14, 2025 · 3:00 PM", user: "Emma R.", channel: "email" },
  { id: 4, type: "email_opened", icon: "👁", label: "Email opened", detail: "Opened 3 times · Last open: iPhone, San Francisco", time: "Jan 14, 2025 · 3:45 PM", user: "Sarah Connor", channel: "email" },
  { id: 5, type: "linkedin_sent", icon: "💼", label: "LinkedIn message sent", detail: "Connection request with personalized note", time: "Jan 15, 2025 · 9:00 AM", user: "Emma R.", channel: "linkedin" },
  { id: 6, type: "linkedin_replied", icon: "💬", label: "LinkedIn replied", detail: "Accepted connection and replied: 'Thanks for reaching out!'", time: "Jan 15, 2025 · 11:22 AM", user: "Sarah Connor", channel: "linkedin" },
  { id: 7, type: "email_replied", icon: "↩️", label: "Email replied", detail: "Replied to follow-up: 'Would love to learn more, can we connect?'", time: "Jan 15, 2025 · 2:15 PM", user: "Sarah Connor", channel: "email" },
  { id: 8, type: "meeting_booked", icon: "📅", label: "Meeting booked", detail: "Discovery call — Jan 20, 2025 at 3 PM PST via Calendly", time: "Jan 15, 2025 · 2:45 PM", user: "Emma R.", channel: "calendly" },
  { id: 9, type: "note_added", icon: "📝", label: "Note added", detail: "Very interested, mentioned budget approval next Q. Follow up after meeting.", time: "Jan 15, 2025 · 3:00 PM", user: "Emma R.", channel: "internal" },
  { id: 10, type: "whatsapp_sent", icon: "💚", label: "WhatsApp sent", detail: "Sent meeting confirmation with Zoom link", time: "Jan 15, 2025 · 3:05 PM", user: "Emma R.", channel: "whatsapp" },
];

export const leadConversations = {
  email: [
    { id: 1, from: "me", sender: "Emma R.", text: "Hi Sarah, I noticed you're leading growth at TechVault. We've been helping similar SaaS companies automate their outreach with measurable results. Would love to share how we helped Notion achieve 3x reply rates. Worth a 15-min chat?", time: "Jan 14 · 3:00 PM", read: true },
    { id: 2, from: "them", sender: "Sarah Connor", text: "Hi Emma! Thanks for the personalized note. The Notion case study sounds interesting. We've been struggling with our outbound motion. Would love to hear more. What does your tool actually do?", time: "Jan 15 · 2:15 PM", read: true },
    { id: 3, from: "me", sender: "Emma R.", text: "Great to hear Sarah! NexCRM is an AI-powered outreach + hiring + unified inbox platform. It syncs all your lead data and automates multi-channel sequences (email, LinkedIn, WhatsApp). Happy to do a quick demo — does Jan 20 at 3 PM PST work?", time: "Jan 15 · 2:30 PM", read: true },
    { id: 4, from: "them", sender: "Sarah Connor", text: "Jan 20 at 3 PM works perfectly! Just sent a calendar invite. Looking forward to it 🙂", time: "Jan 15 · 2:45 PM", read: true },
  ],
  linkedin: [
    { id: 1, from: "me", sender: "Emma R.", text: "Hi Sarah, I came across your profile and was impressed by your work at TechVault. I'd love to connect and share some insights on outreach automation.", time: "Jan 15 · 9:00 AM", read: true },
    { id: 2, from: "them", sender: "Sarah Connor", text: "Thanks for reaching out! Always happy to connect with people in the SaaS space. Accepted!", time: "Jan 15 · 11:22 AM", read: true },
  ],
  whatsapp: [
    { id: 1, from: "me", sender: "Emma R.", text: "Hi Sarah! Just confirming our discovery call on Jan 20 at 3 PM PST. Here's the Zoom link: zoom.us/j/123456789. Looking forward to it! 🚀", time: "Jan 15 · 3:05 PM", read: true },
    { id: 2, from: "them", sender: "Sarah Connor", text: "Perfect, thanks! Added it to my calendar ✅", time: "Jan 15 · 3:12 PM", read: true },
  ],
};
