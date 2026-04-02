"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { LeadFiltersPanel } from "@/components/lead-intelligence/LeadFiltersPanel";
import { LeadCard } from "@/components/lead-intelligence/LeadCard";
import { LeadListRow } from "@/components/lead-intelligence/LeadListRow";
import { QuickPreviewDrawer } from "@/components/lead-intelligence/QuickPreviewDrawer";
import { SavedSearchBar } from "@/components/lead-intelligence/SavedSearchBar";
import { SourceBadge } from "@/components/lead-intelligence/SourceBadge";
import { Button } from "@/components/ui/Button";
import { importedLeads, type ImportedLead } from "@/lib/leadIntelligenceData";
import {
  Download, Plus, RefreshCw, Tag, Mail, Trash2, X,
  ChevronDown, ArrowUpDown, LayoutList, LayoutGrid, Brain,
  Users, CheckSquare, Table2, Telescope, Sparkles,
  TrendingUp, Zap, Star, Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const sortOptions = ["Relevance", "Highest Score", "Latest Activity", "Company A–Z", "Source", "Stage"];
const TABLE_HEADERS = ["Name", "Company", "Location", "Source", "Stage", "Channels", "Score", "Sync", "Owner", "Last Activity", ""];

const SUGGESTED_SEARCHES = [
  { label: "SaaS Founders US", tags: ["USA","C-Suite","SaaS"],     count: 847 },
  { label: "VP+ Fintech EU",    tags: ["Europe","VP+","Fintech"],   count: 312 },
  { label: "Warm Replies",      tags: ["Replied","Score 80+"],      count: 164 },
  { label: "Uncontacted AI",    tags: ["AI","Not Contacted"],       count: 521 },
  { label: "Hiring Companies",  tags: ["Hiring","Enterprise"],      count: 289 },
];

export default function LeadSearchPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [preview, setPreview] = useState<ImportedLead | null>(null);
  const [view, setView] = useState<"list" | "grid" | "table">("list");
  const [sort, setSort] = useState("Relevance");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeChips, setActiveChips] = useState<string[]>([]);

  const filtered = importedLeads.filter((l) => {
    if (!search && !searched) return false;
    if (!search) return true;
    return (
      l.fullName.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.designation.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase()) ||
      l.industry.toLowerCase().includes(search.toLowerCase()) ||
      l.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const hasResults = searched || search.length > 0;
  const toggleSelect = (id: string) =>
    setSelected((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        {/* Hero search header */}
        <div className={cn("transition-all duration-300", hasResults ? "mb-5" : "mb-12 mt-8")}>
          <div className={cn("text-center transition-all duration-300", hasResults ? "mb-4" : "mb-8")}>
            {!hasResults && (
              <>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center">
                    <Telescope className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-black text-slate-900">Lead Search</h1>
                </div>
                <p className="text-slate-500 text-sm max-w-xl mx-auto">
                  Search across all imported leads from LinkedIn, Apollo, SalesRobot, Smartlead, Instantly,
                  WhatsApp and more. Use Boolean operators for advanced search.
                </p>
              </>
            )}
            {hasResults && (
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-brand-600" />
                <h1 className="text-xl font-bold text-slate-900">Search Results</h1>
                <span className="bg-brand-100 text-brand-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {filtered.length} leads found
                </span>
              </div>
            )}
          </div>

          {/* SavedSearchBar */}
          <div className={cn("mx-auto transition-all duration-300", hasResults ? "max-w-full" : "max-w-2xl")}>
            <SavedSearchBar
              value={search}
              onChange={(v) => { setSearch(v); if (v) setSearched(true); }}
              resultsCount={hasResults ? filtered.length : undefined}
              placeholder='Search by name, title, company, location, skill... (Boolean: "VP AND SaaS NOT intern")'
              onSaveSearch={(name) => console.log("Saved:", name)}
            />
          </div>

          {/* Boolean help chips */}
          {!hasResults && (
            <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
              <span className="text-xs text-slate-400">Examples:</span>
              {[
                '"CEO AND SaaS"',
                '"VP OR Director" fintech',
                '"Head of Growth" NOT intern',
                'engineer remote "Series B"',
              ].map((ex) => (
                <button
                  key={ex}
                  onClick={() => { setSearch(ex.replace(/"/g, "")); setSearched(true); }}
                  className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-brand-300 hover:text-brand-600 font-mono transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* === PRE-SEARCH STATE: Suggested searches + stats === */}
        {!hasResults && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Suggested searches */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <h3 className="text-sm font-semibold text-slate-700">Suggested Searches</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {SUGGESTED_SEARCHES.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => { setSearch(s.label); setSearched(true); }}
                    className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-card hover:shadow-card-md hover:border-brand-200 transition-all group text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
                      <Telescope className="w-4 h-4 text-brand-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-brand-700 transition-colors">{s.label}</div>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {s.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-slate-700">{s.count}</div>
                      <div className="text-xs text-slate-400">leads</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Source quick links */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-semibold text-slate-700">Browse by Source</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["linkedin","apollo","salesrobot","smartlead","instantly","whatsapp","email","csv"] as const).map((src) => (
                  <button
                    key={src}
                    onClick={() => { setSearch(src); setSearched(true); }}
                    className="hover:scale-105 transition-transform"
                  >
                    <SourceBadge source={src} size="md" />
                  </button>
                ))}
              </div>
            </div>

            {/* AI-powered search promo */}
            <div className="bg-gradient-to-r from-brand-50 to-violet-50 border border-brand-100 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-brand-900 mb-0.5">AI-Powered Search</h3>
                <p className="text-xs text-brand-700 leading-relaxed">
                  Describe who you&apos;re looking for in plain language. Our AI will find the best matches across all your imported leads.
                </p>
              </div>
              <button className="shrink-0 flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">
                <Sparkles className="w-4 h-4" />Try AI Search
              </button>
            </div>
          </div>
        )}

        {/* === RESULTS STATE === */}
        {hasResults && (
          <>
            {/* Active chips + controls */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {activeChips.map((chip) => (
                <div key={chip} className="flex items-center gap-1 bg-brand-50 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-full border border-brand-200">
                  {chip}
                  <button onClick={() => setActiveChips((p) => p.filter((c) => c !== chip))} className="ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {activeChips.length > 0 && (
                <button onClick={() => setActiveChips([])} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear all</button>
              )}
              <div className="ml-auto flex items-center gap-2">
                <Button variant="secondary" size="sm"><Download className="w-3.5 h-3.5" />Export</Button>
                {/* Sort */}
                <div className="relative">
                  <button onClick={() => setShowSortMenu(!showSortMenu)} className="btn-secondary gap-1.5 text-xs h-8 whitespace-nowrap">
                    <ArrowUpDown className="w-3.5 h-3.5" />{sort}<ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                  {showSortMenu && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-100 rounded-xl shadow-card-lg py-1 z-20 animate-fade-in">
                      {sortOptions.map((o) => (
                        <button key={o} onClick={() => { setSort(o); setShowSortMenu(false); }}
                          className={cn("w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition-colors", sort === o ? "text-brand-600 font-semibold" : "text-slate-700")}>
                          {o}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* View toggle */}
                <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                  {([{ v: "list" as const, I: LayoutList }, { v: "grid" as const, I: LayoutGrid }, { v: "table" as const, I: Table2 }]).map(({ v, I }) => (
                    <button key={v} onClick={() => setView(v)}
                      className={cn("p-1.5 transition-colors", view === v ? "bg-brand-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50")}>
                      <I className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bulk bar */}
            {selected.length > 0 && (
              <div className="bg-brand-600 text-white rounded-xl p-3 mb-4 flex items-center gap-3 animate-slide-in-up">
                <CheckSquare className="w-4 h-4" />
                <span className="text-sm font-semibold">{selected.length} selected</span>
                <div className="flex items-center gap-1.5 ml-2 flex-wrap">
                  {([{ I: Mail, l: "Email" }, { I: Tag, l: "Tag" }, { I: Users, l: "Assign" }, { I: Plus, l: "Campaign" }, { I: Download, l: "Export" }, { I: Trash2, l: "Delete" }]).map(({ I, l }) => (
                    <button key={l} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors">
                      <I className="w-3.5 h-3.5" />{l}
                    </button>
                  ))}
                </div>
                <button onClick={() => setSelected([])} className="ml-auto p-1 hover:bg-white/20 rounded-lg"><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* Main layout */}
            <div className="flex gap-4">
              {/* Filters */}
              <div className="sticky top-20 self-start">
                <LeadFiltersPanel onClearAll={() => {}} />
              </div>

              {/* Results */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">{filtered.length}</span> leads found
                      {search && <span className="text-slate-400"> for &quot;<span className="text-slate-700 font-medium">{search}</span>&quot;</span>}
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300 text-brand-600"
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onChange={() => setSelected(selected.length === filtered.length ? [] : filtered.map((l) => l.id))} />
                    <span className="text-xs text-slate-500">Select all</span>
                  </label>
                </div>

                {filtered.length === 0 && search && (
                  <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-card">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <Telescope className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-1">No results for &quot;{search}&quot;</h3>
                    <p className="text-sm text-slate-400 mb-4">Try different keywords, adjust your filters, or use Boolean operators</p>
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setSearch("")} className="btn-secondary text-xs">Clear search</button>
                      <button className="btn-primary text-xs"><Sparkles className="w-3.5 h-3.5" />Try AI Search</button>
                    </div>
                  </div>
                )}

                {/* List */}
                {view === "list" && filtered.length > 0 && (
                  <div className="space-y-2.5">
                    {filtered.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} onClick={() => setPreview(lead)}
                        selected={selected.includes(lead.id)} onSelect={() => toggleSelect(lead.id)} />
                    ))}
                  </div>
                )}

                {/* Grid */}
                {view === "grid" && filtered.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {filtered.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} onClick={() => setPreview(lead)}
                        selected={selected.includes(lead.id)} onSelect={() => toggleSelect(lead.id)} />
                    ))}
                  </div>
                )}

                {/* Table */}
                {view === "table" && filtered.length > 0 && (
                  <div className="bg-white border border-slate-100 rounded-xl shadow-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="pl-4 pr-2 py-3 w-10">
                              <input type="checkbox" className="rounded border-slate-300 text-brand-600"
                                checked={selected.length === filtered.length && filtered.length > 0}
                                onChange={() => setSelected(selected.length === filtered.length ? [] : filtered.map((l) => l.id))} />
                            </th>
                            {TABLE_HEADERS.map((h) => (
                              <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((lead, i) => (
                            <LeadListRow key={lead.id} lead={lead} index={i}
                              selected={selected.includes(lead.id)} onSelect={() => toggleSelect(lead.id)}
                              onClick={() => setPreview(lead)} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {filtered.length > 0 && (
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500">{filtered.length} results</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, "...", Math.ceil(importedLeads.length / 10)].map((p, i) => (
                        <button key={i} className={`w-7 h-7 text-xs rounded-lg transition-colors ${p === 1 ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{p}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {preview && <QuickPreviewDrawer lead={preview} onClose={() => setPreview(null)} />}
    </MainLayout>
  );
}
