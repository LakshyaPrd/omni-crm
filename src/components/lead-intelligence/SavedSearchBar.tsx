"use client";
import { useState, useRef, useEffect } from "react";
import { Search, Bookmark, Clock, X, ChevronDown, Plus, Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: string[];
  pinned?: boolean;
  resultsCount?: number;
  createdAt?: string;
}

interface RecentSearch {
  query: string;
  time: string;
}

const DEFAULT_SAVED: SavedSearch[] = [
  { id: "s1", name: "SaaS Founders US", query: "founder CEO SaaS",    filters: ["USA", "SaaS", "C-Suite"],      pinned: true,  resultsCount: 847 },
  { id: "s2", name: "VP+ FinTech",       query: "VP fintech",          filters: ["Fintech", "VP+"],              pinned: true,  resultsCount: 312 },
  { id: "s3", name: "Warm Leads Only",   query: "",                    filters: ["Replied", "Score 80+"],        pinned: false, resultsCount: 164 },
  { id: "s4", name: "EU Enterprise",     query: "director manager",    filters: ["Europe", "201-500"],           pinned: false, resultsCount: 528 },
];

const DEFAULT_RECENT: RecentSearch[] = [
  { query: "Head of Marketing London", time: "2h ago" },
  { query: "CTO startup Series A",     time: "5h ago" },
  { query: "\"growth AND SaaS\"",       time: "1d ago" },
  { query: "VP Sales remote",          time: "2d ago" },
];

interface SavedSearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  resultsCount?: number;
  onSaveSearch?: (name: string, query: string) => void;
  className?: string;
}

export function SavedSearchBar({
  value, onChange, placeholder, resultsCount, onSaveSearch, className,
}: SavedSearchBarProps) {
  const [open, setOpen] = useState(false);
  const [saveMode, setSaveMode] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saved, setSaved] = useState<SavedSearch[]>(DEFAULT_SAVED);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleSave = () => {
    if (!saveName.trim()) return;
    const ns: SavedSearch = { id: Date.now().toString(), name: saveName, query: value, filters: [], createdAt: "just now" };
    setSaved((p) => [ns, ...p]);
    onSaveSearch?.(saveName, value);
    setSaveMode(false);
    setSaveName("");
  };

  const handleLoad = (s: SavedSearch) => { onChange(s.query); setOpen(false); };
  const handleDelete = (id: string, e: React.MouseEvent) => { e.stopPropagation(); setSaved((p) => p.filter((s) => s.id !== id)); };
  const handlePin = (id: string, e: React.MouseEvent) => { e.stopPropagation(); setSaved((p) => p.map((s) => s.id === id ? { ...s, pinned: !s.pinned } : s)); };

  const pinned = saved.filter((s) => s.pinned);
  const others = saved.filter((s) => !s.pinned);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* Search input */}
      <div className={cn("flex items-center bg-white border rounded-xl shadow-card transition-all",
        open ? "border-brand-400 ring-2 ring-brand-200" : "border-slate-200 hover:border-slate-300"
      )}>
        <Search className="ml-3.5 w-4.5 h-4.5 text-slate-400 shrink-0" />
        <input
          className="flex-1 px-3 py-3 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
          placeholder={placeholder ?? 'Search by name, title, company... (Boolean: "CEO AND SaaS")'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        <div className="flex items-center gap-1 pr-2">
          {value && (
            <button onClick={() => onChange("")} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {resultsCount !== undefined && (
            <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full font-medium whitespace-nowrap">
              {resultsCount.toLocaleString()} results
            </span>
          )}
          <button
            onClick={() => setSaveMode(!saveMode)}
            className={cn("flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
              saveMode ? "bg-brand-100 text-brand-700" : "text-slate-500 hover:bg-slate-100"
            )}
            title="Save search"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      {/* Save search input */}
      {saveMode && (
        <div className="flex items-center gap-2 mt-2 animate-slide-in-up">
          <input
            autoFocus
            className="flex-1 px-3 py-2 border border-brand-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
            placeholder="Name this search..."
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setSaveMode(false); }}
          />
          <button onClick={handleSave} className="px-3 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">Save</button>
          <button onClick={() => setSaveMode(false)} className="px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-card-lg z-50 animate-fade-in overflow-hidden">
          {/* Boolean hint */}
          <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 border-b border-brand-100">
            <span className="text-xs text-brand-700">
              💡 Boolean search: <code className="font-mono bg-brand-100 px-1 rounded">"VP AND SaaS"</code>,{" "}
              <code className="font-mono bg-brand-100 px-1 rounded">CEO OR founder</code>,{" "}
              <code className="font-mono bg-brand-100 px-1 rounded">NOT intern</code>
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {/* Pinned saves */}
            {pinned.length > 0 && (
              <div className="p-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />Pinned Searches
                </div>
                {pinned.map((s) => (
                  <div key={s.id} onClick={() => handleLoad(s)} className="flex items-center gap-2.5 px-2 py-2 hover:bg-slate-50 rounded-lg cursor-pointer group">
                    <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-800 truncate">{s.name}</div>
                      <div className="flex gap-1 flex-wrap mt-0.5">
                        {s.filters.map((f) => <span key={f} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0 rounded">{f}</span>)}
                      </div>
                    </div>
                    {s.resultsCount && <span className="text-xs text-slate-400 shrink-0">{s.resultsCount}</span>}
                    <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity">
                      <button onClick={(e) => handlePin(s.id, e)} className="p-1 hover:bg-slate-200 rounded text-slate-400"><Star className="w-3 h-3" /></button>
                      <button onClick={(e) => handleDelete(s.id, e)} className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Other saved */}
            {others.length > 0 && (
              <div className="p-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  <Bookmark className="w-3 h-3" />Saved Searches
                </div>
                {others.map((s) => (
                  <div key={s.id} onClick={() => handleLoad(s)} className="flex items-center gap-2.5 px-2 py-2 hover:bg-slate-50 rounded-lg cursor-pointer group">
                    <Bookmark className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    <span className="flex-1 text-sm text-slate-700 truncate">{s.name}</span>
                    {s.resultsCount && <span className="text-xs text-slate-400 shrink-0">{s.resultsCount}</span>}
                    <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity">
                      <button onClick={(e) => handlePin(s.id, e)} className="p-1 hover:bg-amber-50 rounded text-slate-400 hover:text-amber-500"><Star className="w-3 h-3" /></button>
                      <button onClick={(e) => handleDelete(s.id, e)} className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent searches */}
            <div className="p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                <Clock className="w-3 h-3" />Recent Searches
              </div>
              {DEFAULT_RECENT.map((r, i) => (
                <div key={i} onClick={() => { onChange(r.query); setOpen(false); }}
                  className="flex items-center gap-2.5 px-2 py-2 hover:bg-slate-50 rounded-lg cursor-pointer group">
                  <Clock className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span className="flex-1 text-sm text-slate-600 truncate">{r.query}</span>
                  <span className="text-xs text-slate-400 shrink-0">{r.time}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSaveName(r.query); setSaveMode(true); setOpen(false); }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-brand-50 rounded text-slate-400 hover:text-brand-600 transition-all"
                    title="Save this search"
                  >
                    <Bookmark className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
