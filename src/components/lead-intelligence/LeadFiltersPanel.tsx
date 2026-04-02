"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterGroup {
  id: string;
  label: string;
  filters: { id: string; label: string; count?: number }[];
}

const filterGroups: FilterGroup[] = [
  {
    id: "person", label: "Person Filters",
    filters: [
      { id: "title", label: "Job Title" },
      { id: "seniority", label: "Seniority Level" },
      { id: "department", label: "Department" },
      { id: "experience", label: "Years of Experience" },
      { id: "skills", label: "Skills" },
      { id: "location", label: "Location / City" },
      { id: "country", label: "Country" },
      { id: "timezone", label: "Timezone" },
      { id: "language", label: "Language" },
    ],
  },
  {
    id: "company", label: "Company Filters",
    filters: [
      { id: "company_name", label: "Company Name" },
      { id: "industry", label: "Industry" },
      { id: "company_size", label: "Company Size" },
      { id: "revenue", label: "Revenue Range" },
      { id: "hq", label: "HQ Location" },
      { id: "hiring", label: "Hiring Status" },
      { id: "tech_stack", label: "Tech Stack" },
    ],
  },
  {
    id: "outreach", label: "Outreach Filters",
    filters: [
      { id: "email_status", label: "Email Status" },
      { id: "phone_status", label: "Phone Status" },
      { id: "whatsapp", label: "WhatsApp Available" },
      { id: "linkedin_avail", label: "LinkedIn Available" },
      { id: "enriched", label: "Enrichment Status" },
      { id: "verified_email", label: "Verified Email Only" },
      { id: "verified_phone", label: "Verified Mobile Only" },
      { id: "replied", label: "Replied / Not Replied" },
      { id: "bounced", label: "Bounced / Not Bounced" },
    ],
  },
  {
    id: "source", label: "Source Platform",
    filters: [
      { id: "src_linkedin", label: "LinkedIn Sales Nav", count: 2847 },
      { id: "src_salesrobot", label: "SalesRobot", count: 1204 },
      { id: "src_apollo", label: "Apollo.io", count: 4521 },
      { id: "src_smartlead", label: "Smartlead", count: 892 },
      { id: "src_instantly", label: "Instantly.ai", count: 340 },
      { id: "src_whatsapp", label: "WhatsApp API", count: 678 },
      { id: "src_csv", label: "CSV Import", count: 523 },
      { id: "src_manual", label: "Manual Entry", count: 189 },
    ],
  },
  {
    id: "crm", label: "CRM Filters",
    filters: [
      { id: "owner", label: "Lead Owner" },
      { id: "stage", label: "Pipeline Stage" },
      { id: "score", label: "Lead Score" },
      { id: "tags", label: "Tags" },
      { id: "created_date", label: "Created Date" },
      { id: "last_sync", label: "Last Synced" },
    ],
  },
];

const seniorityOptions = ["C-Suite", "VP", "Director", "Senior", "Manager", "Individual Contributor"];
const industryOptions = ["SaaS", "Fintech", "AI/ML", "Cloud Computing", "Developer Tools", "MarTech", "Healthcare", "E-commerce", "Venture Capital"];
const sizeOptions = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const stageOptions = ["new", "contacted", "qualified", "replied", "meeting_booked", "proposal", "converted", "lost"];

interface FiltersState {
  seniority: string[];
  industry: string[];
  companySize: string[];
  stage: string[];
  sources: string[];
  verifiedEmail: boolean;
  hasPhone: boolean;
  hasWhatsApp: boolean;
  enriched: boolean;
}

interface LeadFiltersPanelProps {
  onFiltersChange?: (filters: FiltersState) => void;
  activeFilters?: string[];
  onClearAll?: () => void;
}

function FilterSection({ group, expanded, onToggle, children }: {
  group: FilterGroup; expanded: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
      >
        {group.label}
        {expanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
      </button>
      {expanded && <div className="pb-3 space-y-1">{children}</div>}
    </div>
  );
}

function CheckOption({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 py-1 cursor-pointer group">
      <input type="checkbox" checked={checked} onChange={onChange} className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-3.5 h-3.5" />
      <span className={cn("text-xs flex-1 transition-colors", checked ? "text-brand-700 font-medium" : "text-slate-600 group-hover:text-slate-800")}>{label}</span>
      {count !== undefined && <span className="text-xs text-slate-400">{count.toLocaleString()}</span>}
    </label>
  );
}

export function LeadFiltersPanel({ onClearAll }: LeadFiltersPanelProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    person: true, company: true, outreach: false, source: true, crm: false,
  });
  const [selectedSeniority, setSelectedSeniority] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [selectedStage, setSelectedStage] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [hasWhatsApp, setHasWhatsApp] = useState(false);
  const [enrichedOnly, setEnrichedOnly] = useState(false);

  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));
  const toggleArr = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const totalActive = selectedSeniority.length + selectedIndustry.length + selectedSize.length +
    selectedStage.length + selectedSources.length + (verifiedEmail ? 1 : 0) + (hasWhatsApp ? 1 : 0) + (enrichedOnly ? 1 : 0);

  const clearAll = () => {
    setSelectedSeniority([]); setSelectedIndustry([]); setSelectedSize([]);
    setSelectedStage([]); setSelectedSources([]); setVerifiedEmail(false);
    setHasWhatsApp(false); setEnrichedOnly(false);
    onClearAll?.();
  };

  return (
    <div className="w-56 shrink-0 bg-white border border-slate-100 rounded-xl shadow-card overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
          <span className="text-xs font-semibold text-slate-700">Filters</span>
          {totalActive > 0 && (
            <span className="bg-brand-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{totalActive}</span>
          )}
        </div>
        {totalActive > 0 && (
          <button onClick={clearAll} className="text-xs text-brand-600 hover:text-brand-800 font-medium">Clear</button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin">
        {/* Person */}
        <FilterSection group={filterGroups[0]} expanded={!!expanded.person} onToggle={() => toggle("person")}>
          <div className="mb-2">
            <p className="text-xs text-slate-500 mb-1">Seniority</p>
            {seniorityOptions.map((s) => (
              <CheckOption key={s} label={s} checked={selectedSeniority.includes(s)}
                onChange={() => toggleArr(selectedSeniority, s, setSelectedSeniority)} />
            ))}
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Location</p>
            <input className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="City, Country..." />
          </div>
        </FilterSection>

        {/* Company */}
        <FilterSection group={filterGroups[1]} expanded={!!expanded.company} onToggle={() => toggle("company")}>
          <div className="mb-2">
            <p className="text-xs text-slate-500 mb-1">Industry</p>
            {industryOptions.slice(0, 5).map((ind) => (
              <CheckOption key={ind} label={ind} checked={selectedIndustry.includes(ind)}
                onChange={() => toggleArr(selectedIndustry, ind, setSelectedIndustry)} />
            ))}
            <button className="text-xs text-brand-600 mt-1 hover:underline">+ More</button>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Company Size</p>
            {sizeOptions.map((s) => (
              <CheckOption key={s} label={s} checked={selectedSize.includes(s)}
                onChange={() => toggleArr(selectedSize, s, setSelectedSize)} />
            ))}
          </div>
        </FilterSection>

        {/* Outreach */}
        <FilterSection group={filterGroups[2]} expanded={!!expanded.outreach} onToggle={() => toggle("outreach")}>
          <CheckOption label="Verified Email Only" checked={verifiedEmail} onChange={() => setVerifiedEmail(!verifiedEmail)} />
          <CheckOption label="Has WhatsApp" checked={hasWhatsApp} onChange={() => setHasWhatsApp(!hasWhatsApp)} />
          <CheckOption label="Enriched Only" checked={enrichedOnly} onChange={() => setEnrichedOnly(!enrichedOnly)} />
          <div className="mt-2">
            <p className="text-xs text-slate-500 mb-1">Reply Status</p>
            {["Replied", "Not Replied", "Bounced"].map((s) => (
              <CheckOption key={s} label={s} checked={false} onChange={() => {}} />
            ))}
          </div>
        </FilterSection>

        {/* Source */}
        <FilterSection group={filterGroups[3]} expanded={!!expanded.source} onToggle={() => toggle("source")}>
          {filterGroups[3].filters.map((f) => (
            <CheckOption key={f.id} label={f.label} count={f.count}
              checked={selectedSources.includes(f.id)}
              onChange={() => toggleArr(selectedSources, f.id, setSelectedSources)} />
          ))}
        </FilterSection>

        {/* CRM */}
        <FilterSection group={filterGroups[4]} expanded={!!expanded.crm} onToggle={() => toggle("crm")}>
          <div className="mb-2">
            <p className="text-xs text-slate-500 mb-1">Pipeline Stage</p>
            {stageOptions.map((s) => (
              <CheckOption key={s} label={s.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                checked={selectedStage.includes(s)} onChange={() => toggleArr(selectedStage, s, setSelectedStage)} />
            ))}
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Lead Score</p>
            <div className="flex gap-2 items-center">
              <input type="range" min={0} max={100} defaultValue={0} className="flex-1 accent-brand-600" />
              <span className="text-xs text-slate-600 w-8">100+</span>
            </div>
          </div>
        </FilterSection>
      </div>

      {/* Saved Searches */}
      <div className="border-t border-slate-100 p-3">
        <p className="text-xs font-semibold text-slate-500 mb-2">Saved Searches</p>
        <div className="space-y-1">
          {["SaaS Founders US", "VP+ FinTech", "Warm Leads Only"].map((s) => (
            <button key={s} className="w-full text-left text-xs text-brand-600 hover:bg-brand-50 px-2 py-1 rounded transition-colors truncate">{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
