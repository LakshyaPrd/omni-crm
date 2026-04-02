import { Mail, Phone, Linkedin, MessageCircle, MapPin, Clock, Star, Zap, CheckCircle, XCircle } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SourceBadge } from "./SourceBadge";
import { SyncStatusChip } from "./SyncStatusChip";
import { StatusBadge } from "@/components/ui/Badge";
import type { ImportedLead } from "@/lib/leadIntelligenceData";
import { cn } from "@/lib/utils";

interface LeadCardProps {
  lead: ImportedLead;
  onClick?: () => void;
  selected?: boolean;
  onSelect?: () => void;
}

export function LeadCard({ lead, onClick, selected, onSelect }: LeadCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white border rounded-xl p-4 cursor-pointer transition-all duration-150 group",
        selected
          ? "border-brand-400 ring-1 ring-brand-300 shadow-card-md"
          : "border-slate-100 hover:border-slate-200 hover:shadow-card-md shadow-card"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div onClick={(e) => { e.stopPropagation(); onSelect?.(); }} className="pt-0.5">
          <div className={cn("w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
            selected ? "bg-brand-600 border-brand-600" : "border-slate-300 group-hover:border-slate-400"
          )}>
            {selected && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
        </div>

        {/* Avatar */}
        <Avatar initials={lead.avatar} color={lead.avatarColor} size="md" />

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-sm text-slate-900 truncate">{lead.fullName}</span>
              {lead.connectionStatus !== "none" && (
                <span className="text-xs text-slate-400 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded font-medium">{lead.connectionStatus}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <SourceBadge source={lead.source} size="sm" />
              <SyncStatusChip status={lead.syncStatus} />
            </div>
          </div>
          <p className="text-xs text-slate-500 truncate mb-1">{lead.headline}</p>
          <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{lead.location}</span>
            <span className="text-slate-300">·</span>
            <span>{lead.timezone}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {lead.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">{tag}</span>
            ))}
            {lead.tags.length > 3 && <span className="text-xs text-slate-400">+{lead.tags.length - 3}</span>}
          </div>

          {/* Contact availability & score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("flex items-center gap-0.5 text-xs", lead.emailAvailable ? "text-emerald-600" : "text-slate-300")}>
                {lead.emailAvailable ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <Mail className="w-3 h-3" />
              </div>
              <div className={cn("flex items-center gap-0.5 text-xs", lead.phoneAvailable ? "text-emerald-600" : "text-slate-300")}>
                {lead.phoneAvailable ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <Phone className="w-3 h-3" />
              </div>
              <div className={cn("flex items-center gap-0.5 text-xs", lead.whatsapp ? "text-emerald-600" : "text-slate-300")}>
                {lead.whatsapp ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <MessageCircle className="w-3 h-3" />
              </div>
              <div className={cn("flex items-center gap-0.5 text-xs", lead.linkedinUrl ? "text-sky-600" : "text-slate-300")}>
                {lead.linkedinUrl ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <Linkedin className="w-3 h-3" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                <span className={cn("text-xs font-bold", lead.score >= 80 ? "text-emerald-600" : lead.score >= 60 ? "text-amber-600" : "text-red-500")}>{lead.score}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {lead.lastActivity}
              </div>
            </div>
          </div>
        </div>

        {/* Stage */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <StatusBadge status={lead.stage === "meeting_booked" ? "replied" : lead.stage} />
          <div className="flex items-center gap-1">
            <Avatar initials={lead.ownerAvatar} color="bg-brand-500" size="xs" />
            <span className="text-xs text-slate-500">{lead.owner}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
