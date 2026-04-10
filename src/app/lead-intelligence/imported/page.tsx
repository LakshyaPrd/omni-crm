"use client";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { LeadFiltersPanel } from "@/components/lead-intelligence/LeadFiltersPanel";
import { LeadCard } from "@/components/lead-intelligence/LeadCard";
import { LeadListRow } from "@/components/lead-intelligence/LeadListRow";
import { QuickPreviewDrawer } from "@/components/lead-intelligence/QuickPreviewDrawer";
import { SourceBadge } from "@/components/lead-intelligence/SourceBadge";
import { Button } from "@/components/ui/Button";
import { ExcelImportModal } from "@/components/companies/ExcelImportModal";
import { importedLeads, type ImportedLead } from "@/lib/leadIntelligenceData";
import { crmStore } from "@/lib/crmStore";
import {
  Download, Plus, RefreshCw, Tag, Mail, Trash2,
  X, ChevronDown, ArrowUpDown, LayoutList, LayoutGrid,
  Users, CheckSquare, Table2, Search, FileSpreadsheet,
  CheckCircle2, Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sortOptions = ["Relevance", "Latest Activity", "Highest Score", "Company", "Source", "Stage"];
const TABLE_HEADERS = ["Name","Company","Location","Source","Stage","Score","Email Status","Added",""];

// Convert stored lead to ImportedLead shape for display
function storedToImported(sl: ReturnType<typeof crmStore.getLeads>[0]): ImportedLead {
  return {
    id: sl.id,
    firstName: sl.firstName,
    lastName: sl.lastName,
    fullName: sl.fullName || [sl.firstName, sl.lastName].filter(Boolean).join(" "),
    headline: sl.jobTitle || "Imported Contact",
    designation: sl.jobTitle || "",
    department: sl.department || "",
    seniority: "",
    company: "",
    companyId: "",
    industry: "",
    companySize: "",
    location: sl.location || "",
    city: "",
    country: "",
    timezone: "",
    avatar: ((sl.firstName[0] ?? "") + (sl.lastName[0] ?? "")).toUpperCase() || "?",
    avatarColor: "bg-brand-500",
    source: "csv",
    stage: "new",
    score: sl.emailStatus === "deliverable" ? 75 : sl.emailStatus === "risky" ? 45 : 30,
    intentScore: 50,
    engagementScore: 50,
    emails: sl.email ? [{ address: sl.email, verified: sl.emailStatus === "deliverable", primary: true }] : [],
    phones: sl.phone ? [{ number: sl.phone, verified: false, type: "mobile" }] : [],
    whatsapp: undefined,
    linkedinUrl: sl.linkedinUrl || undefined,
    website: undefined,
    tags: ["Imported", "Excel"],
    owner: "Me",
    ownerAvatar: "ME",
    syncedAt: sl.addedAt,
    lastActivity: "Just now",
    createdAt: sl.addedAt,
    connectionStatus: "none",
    emailAvailable: !!sl.email,
    phoneAvailable: !!sl.phone,
    enriched: false,
    syncStatus: "synced",
    campaignsCount: 0,
    skills: [],
    experience: "",
    education: "",
    summary: sl.notes || "",
  };
}

export default function ImportedLeadsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [preview, setPreview] = useState<ImportedLead | null>(null);
  const [view, setView] = useState<"list"|"grid"|"table">("list");
  const [sort, setSort] = useState("Relevance");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeChips, setActiveChips] = useState<string[]>(["Verified Email","Enriched"]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedFromExcel, setImportedFromExcel] = useState<ImportedLead[]>([]);
  const [toast, setToast] = useState("");

  // Load any previously imported leads from localStorage
  useEffect(() => {
    const stored = crmStore.getLeads();
    if (stored.length) {
      setImportedFromExcel(stored.map(storedToImported));
    }
  }, []);

  // Merge static leads with imported ones
  const allLeads = [...importedFromExcel, ...importedLeads];

  const filtered = allLeads.filter((l) =>
    !search ||
    l.fullName.toLowerCase().includes(search.toLowerCase()) ||
    l.company.toLowerCase().includes(search.toLowerCase()) ||
    l.designation.toLowerCase().includes(search.toLowerCase()) ||
    l.headline.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) =>
    setSelected((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);

  function handleExcelImport(employees: { firstName?: string; lastName?: string; email?: string; phone?: string; jobTitle?: string; department?: string; linkedinUrl?: string; location?: string; notes?: string; _emailStatus?: string; [key: string]: string | undefined }[]) {
    const validEmployees = employees.filter((e) => e.firstName || e.email);
    if (!validEmployees.length) return;

    const stored = crmStore.addLeads(
      validEmployees.map((e) => ({
        firstName: e.firstName ?? "",
        lastName: e.lastName ?? "",
        fullName: [e.firstName, e.lastName].filter(Boolean).join(" "),
        email: e.email ?? "",
        phone: e.phone ?? "",
        jobTitle: e.jobTitle ?? "",
        department: e.department ?? "",
        linkedinUrl: e.linkedinUrl ?? "",
        location: e.location ?? "",
        notes: e.notes ?? "",
        emailStatus: e._emailStatus ?? "idle",
        source: "excel" as const,
      }))
    );

    const newLeads = stored.map(storedToImported);
    setImportedFromExcel((prev) => [...newLeads, ...prev]);
    setShowImportModal(false);

    const deliverable = validEmployees.filter((e) => e._emailStatus === "deliverable").length;
    setToast(`${validEmployees.length} leads imported${deliverable ? ` · ${deliverable} verified emails` : ""}`);
    setTimeout(() => setToast(""), 4000);
  }

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        {/* Toast */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {toast}
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Brain className="w-5 h-5 text-brand-600" />
              <h1 className="text-xl font-bold text-slate-900">Imported Leads</h1>
              <span className="bg-brand-100 text-brand-700 text-xs font-semibold px-2 py-0.5 rounded-full">{allLeads.length} leads</span>
            </div>
            <p className="text-sm text-slate-500">Leads synced from LinkedIn, Apollo, SalesRobot, Smartlead, Instantly, WhatsApp and more</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary"><RefreshCw className="w-4 h-4" />Sync All</Button>
            <Button variant="secondary"><Download className="w-4 h-4" />Export</Button>
            <Button onClick={() => setShowImportModal(true)}>
              <FileSpreadsheet className="w-4 h-4" />Import
            </Button>
          </div>
        </div>

        {/* Search bar — fixed: using Lucide Search icon instead of raw SVG */}
        <div className="mb-3">
          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl shadow-card hover:border-slate-300 transition-all focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-200">
            <Search className="ml-3.5 w-4 h-4 text-slate-400 shrink-0" />
            <input
              className="flex-1 px-3 py-3 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              placeholder='Search by name, title, company, location...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 mr-1">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full font-medium mr-2 whitespace-nowrap">
              {filtered.length} results
            </span>
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 mr-2">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              Save search
            </button>
          </div>
        </div>

        {/* Chips + controls */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-xs text-slate-500 font-medium">Active filters:</span>
          {activeChips.map((chip) => (
            <div key={chip} className="flex items-center gap-1 bg-brand-50 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-full border border-brand-200">
              {chip}
              <button onClick={() => setActiveChips((p) => p.filter((c) => c !== chip))} className="ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {(["linkedin","apollo","salesrobot","smartlead"] as const).map((src) => (
            <div key={src}><SourceBadge source={src} size="sm" /></div>
          ))}
          {activeChips.length > 0 && (
            <button onClick={() => setActiveChips([])} className="text-xs text-red-500 hover:text-red-700 ml-1 font-medium">
              Clear all
            </button>
          )}
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowSortMenu(!showSortMenu)} className="btn-secondary gap-1.5 text-xs h-8">
                <ArrowUpDown className="w-3.5 h-3.5" />{sort}<ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-100 rounded-xl shadow-card-lg py-1 z-20">
                  {sortOptions.map((o) => (
                    <button key={o} onClick={() => { setSort(o); setShowSortMenu(false); }}
                      className={cn("w-full text-left px-3 py-2 text-xs hover:bg-slate-50", sort === o ? "text-brand-600 font-semibold" : "text-slate-700")}>
                      {o}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex border border-slate-200 rounded-lg overflow-hidden">
              {([
                { v: "list" as const, I: LayoutList },
                { v: "grid" as const, I: LayoutGrid },
                { v: "table" as const, I: Table2 },
              ]).map(({ v, I }) => (
                <button key={v} onClick={() => setView(v)}
                  className={cn("p-1.5 transition-colors", view === v ? "bg-brand-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50")}>
                  <I className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bulk action bar */}
        {selected.length > 0 && (
          <div className="bg-brand-600 text-white rounded-xl p-3 mb-4 flex items-center gap-3 animate-slide-in-up">
            <CheckSquare className="w-4 h-4" />
            <span className="text-sm font-semibold">{selected.length} selected</span>
            <div className="flex items-center gap-1.5 ml-2 flex-wrap">
              {([
                { I: Mail, l: "Email" },
                { I: Tag, l: "Tag" },
                { I: Users, l: "Assign" },
                { I: Plus, l: "Campaign" },
                { I: Download, l: "Export" },
                { I: Trash2, l: "Delete" },
              ]).map(({ I, l }) => (
                <button key={l} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors">
                  <I className="w-3.5 h-3.5" />{l}
                </button>
              ))}
            </div>
            <button onClick={() => setSelected([])} className="ml-auto p-1 hover:bg-white/20 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex gap-4">
          <div className="sticky top-20 self-start">
            <LeadFiltersPanel onClearAll={() => {}} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{filtered.length}</span> of{" "}
                <span className="font-semibold text-slate-900">{allLeads.length}</span> leads
                {importedFromExcel.length > 0 && (
                  <span className="ml-2 text-xs text-emerald-600 font-medium">
                    · {importedFromExcel.length} imported via Excel
                  </span>
                )}
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-brand-600"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={() => setSelected(selected.length === filtered.length ? [] : filtered.map((l) => l.id))}
                />
                <span className="text-xs text-slate-500">Select all</span>
              </label>
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <FileSpreadsheet className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium text-slate-600">No leads yet</p>
                <p className="text-sm mt-1">Import leads from Excel or sync from a platform</p>
                <Button className="mt-4" onClick={() => setShowImportModal(true)}>
                  <FileSpreadsheet className="w-4 h-4" />Import from Excel
                </Button>
              </div>
            )}

            {view === "list" && (
              <div className="space-y-2.5">
                {filtered.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onClick={() => setPreview(lead)} selected={selected.includes(lead.id)} onSelect={() => toggleSelect(lead.id)} />
                ))}
              </div>
            )}

            {view === "grid" && (
              <div className="grid grid-cols-2 gap-3">
                {filtered.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onClick={() => setPreview(lead)} selected={selected.includes(lead.id)} onSelect={() => toggleSelect(lead.id)} />
                ))}
              </div>
            )}

            {view === "table" && (
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
                        <LeadListRow key={lead.id} lead={lead} index={i} selected={selected.includes(lead.id)} onSelect={() => toggleSelect(lead.id)} onClick={() => setPreview(lead)} />
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">{filtered.length} leads</span>
                  <div className="flex items-center gap-1">
                    {[1,2,3,"...",8].map((p, i) => (
                      <button key={i} className={`w-7 h-7 text-xs rounded-lg transition-colors ${p===1?"bg-brand-600 text-white":"text-slate-600 hover:bg-slate-100"}`}>{p}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {view !== "table" && filtered.length > 0 && (
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">Showing {filtered.length} of {allLeads.length}</span>
                <div className="flex items-center gap-1">
                  {[1,2,3,"...",12].map((p, i) => (
                    <button key={i} className={`w-7 h-7 text-xs rounded-lg transition-colors ${p===1?"bg-brand-600 text-white":"text-slate-600 hover:bg-slate-100"}`}>{p}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {preview && <QuickPreviewDrawer lead={preview} onClose={() => setPreview(null)} />}

      {showImportModal && (
        <ExcelImportModal
          onClose={() => setShowImportModal(false)}
          onImport={handleExcelImport}
        />
      )}
    </MainLayout>
  );
}
