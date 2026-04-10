import { NextRequest, NextResponse } from "next/server";

// ─── Normalised job shape ───────────────────────────────────────────────────
interface NormalizedJob {
  id: string;
  title: string;
  company: string;
  companyDomain: string;
  companySize: string;
  industry: string;
  location: string;
  salary: string;
  jobType: string;
  platform: string;
  postedAt: string;
  applyUrl: string;
  description: string;
  tags: string[];
  isNew: boolean;
  isHot: boolean;
  source: string;
}

function extractDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; }
}

function relativeDate(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3_600_000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d} day${d > 1 ? "s" : ""} ago`;
    return `${Math.floor(d / 7)} week${Math.floor(d / 7) > 1 ? "s" : ""} ago`;
  } catch { return "Recently"; }
}

// ─── JSearch (RapidAPI) – most comprehensive: LinkedIn + Indeed + Glassdoor ──
async function fetchJSearch(role: string, location: string): Promise<NormalizedJob[]> {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return [];
  const query = location ? `${role} in ${location}` : role;
  try {
    const res = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=2&date_posted=month`,
      { headers: { "X-RapidAPI-Key": key, "X-RapidAPI-Host": "jsearch.p.rapidapi.com" }, signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    return (data.data ?? []).map((j: any, i: number): NormalizedJob => ({
      id: `jsearch-${j.job_id ?? i}`,
      title: j.job_title ?? role,
      company: j.employer_name ?? "Unknown",
      companyDomain: extractDomain(j.employer_website ?? "") || `${(j.employer_name ?? "").toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      companySize: "N/A",
      industry: j.job_category ?? "Technology",
      location: [j.job_city, j.job_state, j.job_country].filter(Boolean).join(", ") || "Remote",
      salary: j.job_min_salary
        ? `$${Math.round((j.job_min_salary as number) / 1000)}K – $${Math.round((j.job_max_salary as number) / 1000)}K`
        : "Not disclosed",
      jobType: j.job_employment_type === "FULLTIME" ? "Full-time" : j.job_employment_type === "PARTTIME" ? "Part-time" : j.job_employment_type ?? "Full-time",
      platform: j.job_publisher ?? "LinkedIn",
      postedAt: j.job_posted_at_datetime_utc ? relativeDate(j.job_posted_at_datetime_utc) : "Recently",
      applyUrl: j.job_apply_link ?? "#",
      description: ((j.job_description as string) ?? "").replace(/\n+/g, " ").slice(0, 500) + "…",
      tags: [j.job_category, j.job_employment_type, j.job_is_remote ? "Remote" : null].filter(Boolean) as string[],
      isNew: i < 5,
      isHot: i < 2,
      source: "jsearch",
    }));
  } catch { return []; }
}

// ─── Adzuna – free registration, global job board ────────────────────────────
async function fetchAdzuna(role: string, location: string): Promise<NormalizedJob[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) return [];

  // Detect country from location hint
  const countryMap: Record<string, string> = {
    india: "in", uk: "gb", "united kingdom": "gb", us: "us", usa: "us",
    "united states": "us", australia: "au", canada: "ca", germany: "de",
    france: "fr", singapore: "sg", uae: "ae",
  };
  const loc = location.toLowerCase();
  const country = Object.keys(countryMap).find((k) => loc.includes(k)) ? countryMap[Object.keys(countryMap).find((k) => loc.includes(k))!] : "us";

  try {
    const params = new URLSearchParams({
      app_id: appId, app_key: appKey,
      what: role, results_per_page: "20",
      ...(location ? { where: location } : {}),
    });
    const res = await fetch(
      `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    return (data.results ?? []).map((j: any, i: number): NormalizedJob => ({
      id: `adzuna-${j.id ?? i}`,
      title: j.title ?? role,
      company: j.company?.display_name ?? "Unknown",
      companyDomain: `${(j.company?.display_name ?? "").toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      companySize: "N/A",
      industry: j.category?.label ?? "Technology",
      location: (j.location?.display_name ?? location) || "Remote",
      salary: j.salary_min ? `$${Math.round(j.salary_min / 1000)}K – $${Math.round(j.salary_max / 1000)}K` : "Not disclosed",
      jobType: j.contract_time === "full_time" ? "Full-time" : j.contract_time === "part_time" ? "Part-time" : "Full-time",
      platform: "Adzuna",
      postedAt: j.created ? relativeDate(j.created) : "Recently",
      applyUrl: j.redirect_url ?? "#",
      description: (j.description ?? "").replace(/<[^>]+>/g, "").slice(0, 500) + "…",
      tags: [j.category?.label, j.contract_time].filter(Boolean) as string[],
      isNew: i < 5,
      isHot: i < 2,
      source: "adzuna",
    }));
  } catch { return []; }
}

// ─── Remotive – completely free, no key, remote jobs ─────────────────────────
async function fetchRemotive(role: string): Promise<NormalizedJob[]> {
  try {
    const res = await fetch(
      `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(role)}&limit=15`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    return (data.jobs ?? []).map((j: any, i: number): NormalizedJob => ({
      id: `rm-${j.id ?? i}`,
      title: j.title ?? role,
      company: j.company_name ?? "Unknown",
      companyDomain: extractDomain(j.url ?? "") || `${(j.company_name ?? "").toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      companySize: "Remote Company",
      industry: j.category ?? "Technology",
      location: j.candidate_required_location || "Remote (Worldwide)",
      salary: j.salary || "Not disclosed",
      jobType: "Remote",
      platform: "Remotive",
      postedAt: j.publication_date ? relativeDate(j.publication_date) : "Recently",
      applyUrl: j.url ?? "#",
      description: (j.description ?? "").replace(/<[^>]+>/g, "").slice(0, 500) + "…",
      tags: [j.category, "Remote"].filter(Boolean) as string[],
      isNew: i < 4,
      isHot: i < 1,
      source: "remotive",
    }));
  } catch { return []; }
}

// ─── Mock fallback ────────────────────────────────────────────────────────────
const MOCK_COMPANIES: Record<string, { domain: string; size: string; industry: string }> = {
  "Google": { domain: "google.com", size: "100,000+", industry: "Technology" },
  "Microsoft": { domain: "microsoft.com", size: "200,000+", industry: "Technology" },
  "Amazon": { domain: "amazon.com", size: "1,000,000+", industry: "E-Commerce / Cloud" },
  "Meta": { domain: "meta.com", size: "80,000+", industry: "Social Media" },
  "Stripe": { domain: "stripe.com", size: "7,000+", industry: "Fintech" },
  "Notion": { domain: "notion.so", size: "500+", industry: "Productivity" },
  "Figma": { domain: "figma.com", size: "1,000+", industry: "Design Tools" },
  "Vercel": { domain: "vercel.com", size: "300+", industry: "Infrastructure" },
  "Atlassian": { domain: "atlassian.com", size: "10,000+", industry: "Dev Tools" },
  "HubSpot": { domain: "hubspot.com", size: "7,000+", industry: "CRM / Marketing" },
  "Salesforce": { domain: "salesforce.com", size: "70,000+", industry: "CRM / SaaS" },
  "Shopify": { domain: "shopify.com", size: "10,000+", industry: "E-Commerce" },
  "Datadog": { domain: "datadoghq.com", size: "5,000+", industry: "Observability" },
  "MongoDB": { domain: "mongodb.com", size: "5,000+", industry: "Database" },
  "Cloudflare": { domain: "cloudflare.com", size: "4,000+", industry: "Security / CDN" },
};
const MOCK_PLATFORMS = ["LinkedIn", "Indeed", "Glassdoor", "Naukri", "Wellfound"];
const MOCK_SALARY = ["$80K–$120K", "$100K–$150K", "$120K–$180K", "Not disclosed", "₹15L–₹30L", "₹30L–₹50L"];
const MOCK_POSTED = ["2 hours ago", "1 day ago", "2 days ago", "3 days ago", "1 week ago"];
const MOCK_TYPES = ["Full-time", "Remote", "Hybrid", "Contract"];

function generateMock(role: string, location: string): NormalizedJob[] {
  return Object.entries(MOCK_COMPANIES).map(([name, co], i) => ({
    id: `mock-${i}-${Date.now()}`,
    title: role || "Software Engineer",
    company: name,
    companyDomain: co.domain,
    companySize: co.size,
    industry: co.industry,
    location: location.toLowerCase().includes("remote") ? "Remote" : location || "Multiple Locations",
    salary: MOCK_SALARY[i % MOCK_SALARY.length],
    jobType: MOCK_TYPES[i % MOCK_TYPES.length],
    platform: MOCK_PLATFORMS[i % MOCK_PLATFORMS.length],
    postedAt: MOCK_POSTED[i % MOCK_POSTED.length],
    applyUrl: `https://${co.domain}/careers`,
    description: `${name} is looking for a ${role || "talented engineer"} to join our growing team. You will work on exciting challenges in ${co.industry}.`,
    tags: [co.industry, MOCK_TYPES[i % MOCK_TYPES.length]],
    isNew: i < 4,
    isHot: i < 2,
    source: "mock",
  }));
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || "";
  const location = searchParams.get("location") || "";
  const platform = searchParams.get("platform") || "all";

  // Try real sources in parallel
  const [jsearchJobs, adzunaJobs, remotiveJobs] = await Promise.all([
    fetchJSearch(role, location),
    fetchAdzuna(role, location),
    fetchRemotive(role),
  ]);

  let jobs: NormalizedJob[] = [];
  let dataSource = "mock";

  if (jsearchJobs.length > 0) {
    jobs = jsearchJobs;
    dataSource = "jsearch";
  } else if (adzunaJobs.length > 0) {
    jobs = adzunaJobs;
    dataSource = "adzuna";
  } else if (remotiveJobs.length > 0) {
    // Remotive only returns remote jobs; supplement with mock for non-remote roles
    jobs = remotiveJobs;
    dataSource = "remotive";
  } else {
    jobs = generateMock(role, location);
    dataSource = "mock";
  }

  // Platform filter
  if (platform !== "all") {
    const filtered = jobs.filter((j) => j.platform.toLowerCase() === platform.toLowerCase());
    if (filtered.length > 0) jobs = filtered;
  }

  return NextResponse.json({
    total: jobs.length,
    role,
    location,
    platform,
    dataSource,
    jobs,
  });
}
