"use client";
import { useState } from "react";
import { MapPin, Clock, Briefcase, RefreshCw, Star, MoreHorizontal, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SourceBadge } from "./SourceBadge";
import { SyncStatusChip } from "./SyncStatusChip";
import { QuickActionToolbar, QuickAction } from "./QuickActionToolbar";
import type { LeadSource } from "@/lib/leadIntelligenceData";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProfileHeaderProps {
  id: string;
  fullName: string;
  headline: string;
  designation: string;
  company: string;
  companyId?: string;
  location: string;
  timezone: string;
  experience: string;
  avatar: string;
  avatarColor: string;
  source: LeadSource;
  syncStatus: "synced" | "pending" | "failed" | "partial";
  syncedAt: string;
  connectionStatus: string;
  completionScore: number;
  leadScore: number;
  intentScore: number;
  engagementScore: number;
  stage: string;
  owner: string;
  ownerAvatar: string;
  onAction?: (action: QuickAction) => void;
  className?: string;
}

export function ProfileHeader({
  id, fullName, headline, designation, company, companyId, location, timezone,
  experience, avatar, avatarColor, source, syncStatus, syncedAt,
  connectionStatus, completionScore, leadScore, intentScore, engagementScore,
  stage, owner, ownerAvatar, onAction, className,
}: ProfileHeaderProps) {
  const [starred, setStarred] = useState(false);

  return (
    <div className={cn("bg-white border border-slate-100 rounded-2xl shadow-card overflow-hidden", className)}>
      {/* Cover */}
      <div className="h-20 bg-gradient-to-r from-brand-600 via-brand-500 to-violet-500 relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />
      </div>

      <div className="px-6 pb-5">
        {/* Row 1: avatar + name + badges + actions */}
        <div className="flex items-end gap-4 -mt-8 mb-4">
          {/* Avatar */}
          <div className={cn("w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-black shrink-0", avatarColor)}>
            {avatar}
          </div>

          {/* Name block */}
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{fullName}</h1>
              {connectionStatus !== "none" && (
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-medium">{connectionStatus}</span>
              )}
              <SourceBadge source={source} size="md" />
              <SyncStatusChip status={syncStatus} />
            </div>
            <p className="text-sm font-medium text-slate-600 mt-0.5 truncate">{headline}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{location}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timezone}</span>
              <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{experience}</span>
              <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" />Synced {syncedAt}</span>
            </div>
          </div>

          {/* Scores */}
          <div className="flex gap-3 pb-1 shrink-0">
            {[
              { label: "Score",      value: leadScore,      col: leadScore >= 80 ? "text-emerald-600" : "text-amber-600", bg: leadScore >= 80 ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200" },
              { label: "Intent",     value: intentScore,    col: "text-brand-600",  bg: "bg-brand-50 border-brand-200" },
              { label: "Engagement", value: engagementScore, col: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
            ].map(({ label, value, col, bg }) => (
              <div key={label} className={cn("border rounded-xl p-2.5 text-center min-w-[60px]", bg)}>
                <div className={cn("text-xl font-black", col)}>{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>

          {/* Top-right actions */}
          <div className="flex items-center gap-1.5 pb-1 shrink-0">
            <button
              onClick={() => setStarred(!starred)}
              className={cn("p-2 rounded-xl border transition-colors",
                starred ? "bg-amber-50 border-amber-200 text-amber-500" : "bg-white border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-200"
              )}
            >
              <Star className={cn("w-4 h-4", starred && "fill-amber-400")} />
            </button>
            <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile completion bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all"
              style={{ width: `${completionScore}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap">{completionScore}% profile complete</span>
        </div>

        {/* Owner + company breadcrumb */}
        <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Avatar initials={ownerAvatar} color="bg-brand-500" size="xs" />
            <span>Owner: <span className="font-medium text-slate-700">{owner}</span></span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1">
            {companyId ? (
              <Link href={`/lead-intelligence/companies/${companyId}`} className="font-medium text-brand-600 hover:underline flex items-center gap-1">
                {company}<ChevronRight className="w-3 h-3" />
              </Link>
            ) : (
              <span className="font-medium text-slate-700">{company}</span>
            )}
          </div>
          <span>·</span>
          <div className="flex items-center gap-1">
            Stage: <span className="font-medium text-slate-700 ml-1 capitalize">{stage.replace("_", " ")}</span>
          </div>
        </div>

        {/* Quick action toolbar */}
        <QuickActionToolbar
          show={["email","whatsapp","linkedin","call","campaign","schedule","note","assign"]}
          onAction={onAction}
          size="sm"
        />
      </div>
    </div>
  );
}
