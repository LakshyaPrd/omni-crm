"use client";
import { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Search, MapPin, Briefcase, ExternalLink, Building2, Users,
  Filter, Loader2, Sparkles, Flame, Clock, RefreshCw,
  Globe, ChevronDown, CheckCircle2, Info, X, Mail
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { crmStore } from "@/lib/crmStore";
import Link from "next/link";
import { EmailFinderModal } from "@/components/leads/EmailFinderModal";

const PLATFORMS = ["All", "LinkedIn", "Indeed", "Glassdoor", "Naukri", "AngelList", "Wellfound"];

const platformColors: Record<string, string> = {
  LinkedIn: "bg-blue-100 text-blue-700 border-blue-200",
  Indeed: "bg-violet-100 text-violet-700 border-violet-200",
  Glassdoor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Naukri: "bg-orange-100 text-orange-700 border-orange-200",
  AngelList: "bg-slate-100 text-slate-700 border-slate-200",
  Wellfound: "bg-pink-100 text-pink-700 border-pink-200",
};

interface Job {
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
  platformUrl: string;
  postedAt: string;
  applyUrl: string;
  description: string;
  tags: string[];
  isNew: boolean;
  isHot: boolean;
}

export default function JobSearchPage() {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [platform, setPlatform] = useState("All");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ msg: string; type: "success" | "info" } | null>(null);
  const [showDataNotice, setShowDataNotice] = useState(true);
  const [dataSource, setDataSource] = useState<string>("mock");
  const [emailFinderJob, setEmailFinderJob] = useState<Job | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!role.trim()) return;

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setSearched(true);
    setJobs([]);
    setAddedIds(new Set());

    try {
      const params = new URLSearchParams({ role, location, platform: platform.toLowerCase() });
      const res = await fetch(`/api/jobs/search?${params}`, { signal: abortRef.current.signal });
      const data = await res.json();
      setJobs(data.jobs ?? []);
      setTotal(data.total ?? 0);
      setDataSource(data.dataSource ?? "mock");
    } catch {
      // aborted or failed
    } finally {
      setLoading(false);
    }
  }

  function addToCRM(job: Job) {
    crmStore.addCompany({
      name: job.company,
      industry: job.industry,
      location: job.location,
      website: `https://${job.companyDomain}`,
      size: job.companySize,
      source: "job_search",
      jobTitle: job.title,
      platform: job.platform,
    });
    setAddedIds((prev) => { const next = new Set(prev); next.add(job.id); return next; });
    showToast(`${job.company} added to Companies`, "success");
  }

  function showToast(msg: string, type: "success" | "info") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  const companyInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const colorPalette = [
    "bg-violet-600", "bg-blue-600", "bg-emerald-600",
    "bg-orange-600", "bg-pink-600", "bg-cyan-600", "bg-indigo-600",
  ];

  return (
    <>
    <MainLayout>
      <div className="animate-slide-in-up">
        {/* Toast */}
        {toast && (
          <div className={cn(
            "fixed top-5 right-5 z-50 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2",
            toast.type === "success" ? "bg-emerald-600" : "bg-brand-600"
          )}>
            <CheckCircle2 className="w-4 h-4" />
            <span>{toast.msg}</span>
            {toast.type === "success" && (
              <Link href="/companies" className="underline ml-1 text-white/80 hover:text-white text-xs">
                View Companies →
              </Link>
            )}
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-brand-600" />
            <h1 className="text-xl font-bold text-slate-900">Hiring Company Search</h1>
          </div>
          <p className="text-sm text-slate-500">
            Find companies actively hiring for specific roles across LinkedIn, Indeed, Glassdoor, Naukri & more
          </p>
        </div>

        {/* Data source notice */}
        {showDataNotice && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5 text-sm">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-amber-800">About job search results</p>
              <p className="text-amber-700 mt-0.5">
                Results are generated from a curated database of top tech companies and real job platforms.
                To scrape live job listings directly, connect your job board API keys in{" "}
                <Link href="/integrations" className="underline hover:text-amber-900">Integrations</Link>.
                Companies you add appear in your{" "}
                <Link href="/companies" className="underline hover:text-amber-900">Companies</Link> list.
              </p>
            </div>
            <button onClick={() => setShowDataNotice(false)} className="text-amber-500 hover:text-amber-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card mb-6">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  className="input-field pl-9 h-10"
                  placeholder="Job role (e.g. Software Engineer, Product Manager)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div className="relative flex-1 min-w-[180px]">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  className="input-field pl-9 h-10"
                  placeholder="Location (e.g. Bangalore, Remote)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={!role.trim() || loading} className="h-10 px-6">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Platform filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Platforms:</span>
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                    platform === p
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center">
              <Globe className="w-7 h-7 text-brand-500 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-800">Scanning platforms...</p>
              <p className="text-sm text-slate-500 mt-1">
                Searching LinkedIn, Indeed, Glassdoor, Naukri & more
              </p>
            </div>
          </div>
        )}

        {/* No results */}
        {!loading && searched && jobs.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No results found</p>
            <p className="text-sm mt-1">Try a different role or location</p>
          </div>
        )}

        {/* Results */}
        {!loading && jobs.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <p className="text-sm text-slate-600">
                  Found <span className="font-semibold text-slate-900">{total}</span> results for{" "}
                  <span className="font-semibold text-brand-600">{role}</span>
                  {location && <> in <span className="font-semibold text-slate-900">{location}</span></>}
                  {" "}·{" "}
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    dataSource === "jsearch" ? "bg-blue-100 text-blue-700" :
                    dataSource === "adzuna" ? "bg-violet-100 text-violet-700" :
                    dataSource === "remotive" ? "bg-emerald-100 text-emerald-700" :
                    "bg-slate-100 text-slate-500"
                  )}>
                    {dataSource === "jsearch" ? "Live · JSearch" :
                     dataSource === "adzuna" ? "Live · Adzuna" :
                     dataSource === "remotive" ? "Live · Remotive" : "Demo data"}
                  </span>
                </p>
                {addedIds.size > 0 && (
                  <p className="text-xs text-emerald-600 mt-0.5">
                    {addedIds.size} added to CRM ·{" "}
                    <Link href="/companies" className="underline hover:text-emerald-700">View Companies</Link>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link href="/lead-intelligence/email-finder" className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:underline">
                  <Mail className="w-3.5 h-3.5" />Bulk Email Finder →
                </Link>
                <button
                  onClick={() => handleSearch()}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />Refresh
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {jobs.map((job, i) => {
                const expanded = expandedId === job.id;
                const isAdded = addedIds.has(job.id);
                return (
                  <div
                    key={job.id}
                    className="bg-white border border-slate-100 rounded-2xl shadow-card hover:shadow-card-md transition-all"
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Company logo */}
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0",
                          colorPalette[i % colorPalette.length]
                        )}>
                          {companyInitials(job.company)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <h3 className="font-semibold text-slate-900">{job.title}</h3>
                                {job.isHot && (
                                  <span className="flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                                    <Flame className="w-3 h-3" />Hot
                                  </span>
                                )}
                                {job.isNew && !job.isHot && (
                                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    <Sparkles className="w-3 h-3" />New
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-slate-700">{job.company}</p>
                            </div>

                            {/* Platform badge */}
                            <span className={cn(
                              "text-xs font-bold px-2.5 py-1 rounded-lg border shrink-0",
                              platformColors[job.platform] ?? "bg-slate-100 text-slate-600 border-slate-200"
                            )}>
                              {job.platform}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 mt-2 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <MapPin className="w-3 h-3" />{job.location}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Users className="w-3 h-3" />{job.companySize}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Building2 className="w-3 h-3" />{job.industry}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />{job.postedAt}
                            </span>
                            {job.salary !== "Not disclosed" && (
                              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                {job.salary}
                              </span>
                            )}
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              {job.jobType}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded description */}
                      {expanded && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>
                          <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
                            <strong>Website:</strong>{" "}
                            <a href={`https://${job.companyDomain}`} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                              {job.companyDomain}
                            </a>
                            {" · "}
                            <strong>Size:</strong> {job.companySize}
                            {" · "}
                            <strong>Industry:</strong> {job.industry}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                        <button
                          onClick={() => setExpandedId(expanded ? null : job.id)}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                        >
                          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", expanded && "rotate-180")} />
                          {expanded ? "Hide details" : "View details"}
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEmailFinderJob(job)}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600 bg-white transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />Find Email
                          </button>
                          <button
                            onClick={() => !isAdded && addToCRM(job)}
                            disabled={isAdded}
                            className={cn(
                              "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors",
                              isAdded
                                ? "text-emerald-600 border-emerald-200 bg-emerald-50 cursor-default"
                                : "text-slate-600 hover:text-brand-600 border-slate-200 hover:border-brand-300 bg-white"
                            )}
                          >
                            {isAdded ? (
                              <><CheckCircle2 className="w-3.5 h-3.5" />Added to CRM</>
                            ) : (
                              <>+ Add to CRM</>
                            )}
                          </button>
                          <a
                            href={job.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            View Jobs <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Empty state before search */}
        {!loading && !searched && (
          <div className="text-center py-20 text-slate-400">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-brand-400" />
            </div>
            <p className="font-semibold text-slate-700 text-lg">Search for hiring companies</p>
            <p className="text-sm mt-2 max-w-sm mx-auto">
              Enter a job role and optionally a location to find companies actively hiring
            </p>
          </div>
        )}
      </div>
    </MainLayout>

    {emailFinderJob && (
      <EmailFinderModal
        defaultDomain={emailFinderJob.companyDomain}
        defaultCompany={emailFinderJob.company}
        onClose={() => setEmailFinderJob(null)}
      />
    )}
    </>
  );
}
