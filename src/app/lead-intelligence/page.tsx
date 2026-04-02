"use client";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { SourceBadge } from "@/components/lead-intelligence/SourceBadge";
import { SyncStatusChip } from "@/components/lead-intelligence/SyncStatusChip";
import { Avatar } from "@/components/ui/Avatar";
import { importedLeads, leadSources, syncHistory } from "@/lib/leadIntelligenceData";
import {
  Brain, FileDown, UserSearch, Globe, Telescope, RefreshCw,
  TrendingUp, Zap, CheckCircle, AlertTriangle, ArrowRight,
  Users, Database, Activity,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const modules = [
  { label: "Imported Leads", href: "/lead-intelligence/imported", icon: FileDown, color: "bg-brand-600", desc: `${importedLeads.length} leads from 8 sources`, stat: importedLeads.length },
  { label: "People Profiles", href: "/lead-intelligence/people", icon: UserSearch, color: "bg-violet-600", desc: "Full enriched profiles", stat: importedLeads.filter((l) => l.enriched).length },
  { label: "Company Profiles", href: "/lead-intelligence/companies", icon: Globe, color: "bg-emerald-600", desc: "5 companies tracked", stat: 5 },
  { label: "Lead Sources", href: "/lead-intelligence/sources", icon: Telescope, color: "bg-sky-600", desc: "8 integrations, 7 active", stat: 7 },
  { label: "Sync History", href: "/lead-intelligence/sync-history", icon: RefreshCw, color: "bg-orange-500", desc: "Last sync 15 min ago", stat: syncHistory.length },
];

export default function LeadIntelligencePage() {
  const totalRecords = leadSources.reduce((a, s) => a + s.recordsSynced, 0);
  const activeSourcesCount = leadSources.filter((s) => s.connected).length;
  const highScoreLeads = importedLeads.filter((l) => l.score >= 80).length;
  const repliedLeads = importedLeads.filter((l) => l.repliedAt).length;

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        {/* Hero header */}
        <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-violet-600 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0tNiAwaDZ2Nmgtdi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-black text-white">Lead Intelligence</h1>
              </div>
              <p className="text-brand-100 text-sm max-w-lg">
                Centralized hub for all leads imported from LinkedIn Sales Navigator, Apollo, SalesRobot, Smartlead, Instantly, WhatsApp, and more.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Leads", value: totalRecords.toLocaleString() },
                { label: "Active Sources", value: activeSourcesCount },
                { label: "Hot Leads", value: highScoreLeads },
                { label: "Replied", value: repliedLeads },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/15 backdrop-blur rounded-xl px-4 py-3 text-center">
                  <div className="text-2xl font-black">{value}</div>
                  <div className="text-xs text-brand-100">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {modules.map(({ label, href, icon: Icon, color, desc, stat }) => (
            <Link key={href} href={href}>
              <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-card hover:shadow-card-md transition-all group cursor-pointer">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", color)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-black text-slate-900 mb-0.5">{stat}</div>
                <div className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">{label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                <div className="flex items-center gap-1 text-brand-600 text-xs font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Recent imports */}
          <div className="col-span-2 bg-white border border-slate-100 rounded-xl shadow-card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">Recently Imported Leads</h3>
              <Link href="/lead-intelligence/imported">
                <span className="text-xs text-brand-600 font-medium hover:underline">View all</span>
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {importedLeads.slice(0, 5).map((lead) => (
                <Link key={lead.id} href={`/lead-intelligence/people/${lead.id}`}>
                  <div className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                    <Avatar initials={lead.avatar} color={lead.avatarColor} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-800">{lead.fullName}</span>
                        <SourceBadge source={lead.source} size="sm" />
                      </div>
                      <p className="text-xs text-slate-500 truncate">{lead.designation} · {lead.company}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <SyncStatusChip status={lead.syncStatus} />
                      <span className={cn("text-xs font-bold", lead.score >= 80 ? "text-emerald-600" : "text-amber-600")}>{lead.score}</span>
                      <span className="text-xs text-slate-400">{lead.syncedAt}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Source health */}
          <div className="bg-white border border-slate-100 rounded-xl shadow-card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">Source Health</h3>
              <Link href="/lead-intelligence/sources">
                <span className="text-xs text-brand-600 font-medium hover:underline">Manage</span>
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {leadSources.slice(0, 5).map((source) => (
                <div key={source.id} className="flex items-center gap-3">
                  <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center shrink-0", source.color)}>
                    <Activity className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-slate-700 truncate">{source.name}</span>
                      <span className={cn("text-xs font-bold ml-2", source.connected ? "text-emerald-600" : "text-slate-400")}>
                        {source.connected ? `${source.syncHealth}%` : "Off"}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", source.syncHealth >= 90 ? "bg-emerald-500" : source.syncHealth >= 70 ? "bg-amber-500" : "bg-red-400")}
                        style={{ width: source.connected ? `${source.syncHealth}%` : "0%" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
