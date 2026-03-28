"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChannelBadge from "@/components/ChannelBadge";
import StageBadge from "@/components/StageBadge";
import { leads } from "@/lib/mockData";
import type { LeadStage } from "@/lib/mockData";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpRight, TrendingUp } from "lucide-react";
import clsx from "clsx";

const STAGES: { value: LeadStage | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "closed_won", label: "Won" },
];

export default function LeadsPage() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<LeadStage | "all">("all");

  const filtered = leads.filter((l) => {
    const matchQuery = l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.company.toLowerCase().includes(query.toLowerCase()) ||
      l.email.toLowerCase().includes(query.toLowerCase());
    const matchStage = stage === "all" || l.stage === stage;
    return matchQuery && matchStage;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar />
      <main className="flex-1 overflow-y-auto grid-bg">
        <div className="max-w-5xl mx-auto px-8 py-8 animate-fade-in">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-700 text-text-primary tracking-tight">Leads</h1>
              <p className="text-sm text-text-secondary mt-1">{leads.length} total · {filtered.length} shown</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-base text-sm font-600 font-display rounded-lg hover:bg-accent-dim transition-colors">
              + Add Lead
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search leads..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
              {STAGES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setStage(value)}
                  className={clsx(
                    "px-3 py-1.5 text-[11px] font-mono font-500 rounded-md transition-all",
                    stage === value
                      ? "bg-accent-subtle text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-0 text-[10px] font-mono uppercase tracking-widest text-text-muted px-5 py-2.5 border-b border-border">
              <span className="w-8" />
              <span>Lead</span>
              <span className="w-28 text-center">Stage</span>
              <span className="w-24 text-center">Channels</span>
              <span className="w-14 text-center">Score</span>
              <span className="w-24 text-right">Last touch</span>
            </div>
            <div className="divide-y divide-border">
              {filtered.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-0 items-center px-5 py-4 hover:bg-elevated transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-accent-subtle border border-accent/20 flex items-center justify-center text-[11px] font-display font-700 text-accent mr-3 shrink-0">
                    {lead.avatar}
                  </div>
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors truncate">{lead.name}</p>
                    </div>
                    <p className="text-[11px] text-text-secondary truncate">{lead.title} · {lead.company}</p>
                    <p className="text-[10px] text-text-muted font-mono truncate">{lead.email}</p>
                  </div>
                  <div className="w-28 flex justify-center">
                    <StageBadge stage={lead.stage} />
                  </div>
                  <div className="w-24 flex justify-center gap-1">
                    {lead.channels.slice(0, 3).map((ch) => (
                      <ChannelBadge key={ch} channel={ch} showLabel={false} size="sm" />
                    ))}
                  </div>
                  <div className="w-14 text-center">
                    <div className="inline-flex items-center gap-1">
                      <span className={clsx(
                        "text-sm font-mono font-700",
                        lead.score >= 80 ? "text-success" : lead.score >= 60 ? "text-warning" : "text-text-secondary"
                      )}>
                        {lead.score}
                      </span>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <span className="text-[11px] font-mono text-text-muted">{lead.lastTouchedAt}</span>
                    <ArrowUpRight size={10} className="inline ml-1 text-text-muted group-hover:text-accent transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
