"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/Badge";
import { SourceBadge } from "@/components/lead-intelligence/SourceBadge";
import { SyncStatusChip } from "@/components/lead-intelligence/SyncStatusChip";
import { importedLeads } from "@/lib/leadIntelligenceData";
import { Search, UserSearch, Mail, Phone, MessageCircle, Linkedin, MapPin, Brain, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PeopleProfilesPage() {
  const [search, setSearch] = useState("");
  const filtered = importedLeads.filter((l) =>
    !search || l.fullName.toLowerCase().includes(search.toLowerCase()) ||
    l.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <UserSearch className="w-5 h-5 text-brand-600" />
              <h1 className="text-xl font-bold text-slate-900">People Profiles</h1>
            </div>
            <p className="text-sm text-slate-500">Detailed profiles for all imported and CRM leads</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-lg mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input-field pl-10 h-10" placeholder="Search people..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filtered.map((lead) => (
            <div key={lead.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-card hover:shadow-card-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <Avatar initials={lead.avatar} color={lead.avatarColor} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">{lead.fullName}</h3>
                    <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">{lead.connectionStatus}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{lead.headline}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                    <MapPin className="w-3 h-3 shrink-0" />{lead.location}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                <SourceBadge source={lead.source} size="sm" />
                <StatusBadge status={lead.stage === "meeting_booked" ? "replied" : lead.stage} />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-brand-500" />
                  <span className={cn("text-xs font-bold", lead.score >= 80 ? "text-emerald-600" : "text-amber-600")}>{lead.score}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs text-slate-500">Intent {lead.intentScore}</span>
                </div>
                <SyncStatusChip status={lead.syncStatus} />
              </div>

              {/* Contact availability */}
              <div className="flex gap-1.5 mb-3">
                {[
                  { icon: Mail, active: lead.emailAvailable, color: "bg-blue-100 text-blue-600" },
                  { icon: Phone, active: lead.phoneAvailable, color: "bg-violet-100 text-violet-600" },
                  { icon: MessageCircle, active: !!lead.whatsapp, color: "bg-emerald-100 text-emerald-600" },
                  { icon: Linkedin, active: !!lead.linkedinUrl, color: "bg-sky-100 text-sky-600" },
                ].map(({ icon: Icon, active, color }, i) => (
                  <div key={i} className={cn("w-7 h-7 rounded-lg flex items-center justify-center", active ? color : "bg-slate-100 text-slate-300")}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                ))}
              </div>

              <Link href={`/lead-intelligence/people/${lead.id}`}>
                <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-brand-200 text-brand-600 text-xs font-medium hover:bg-brand-50 transition-colors">
                  View Full Profile <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
