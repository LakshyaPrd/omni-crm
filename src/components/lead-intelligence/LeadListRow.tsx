import { Mail, Phone, MessageCircle, Linkedin, Clock, MoreHorizontal, CheckCircle, XCircle, Zap } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SourceBadge } from "./SourceBadge";
import { SyncStatusChip } from "./SyncStatusChip";
import { StatusBadge } from "@/components/ui/Badge";
import type { ImportedLead } from "@/lib/leadIntelligenceData";
import { cn } from "@/lib/utils";

interface LeadListRowProps {
  lead: ImportedLead;
  selected?: boolean;
  onSelect?: () => void;
  onClick?: () => void;
  onAction?: (action: string, leadId: string) => void;
  index?: number;
}

const avatarColors = [
  "bg-violet-500","bg-blue-500","bg-emerald-500","bg-orange-500",
  "bg-pink-500","bg-teal-500","bg-red-500","bg-indigo-500","bg-amber-500","bg-cyan-500",
];

export function LeadListRow({ lead, selected, onSelect, onClick, onAction, index = 0 }: LeadListRowProps) {
  return (
    <tr
      className={cn(
        "group border-t border-slate-100 transition-colors cursor-pointer",
        selected ? "bg-brand-50" : "hover:bg-slate-50"
      )}
      onClick={onClick}
    >
      {/* Checkbox */}
      <td className="pl-4 pr-2 py-3 w-10" onClick={(e) => { e.stopPropagation(); onSelect?.(); }}>
        <div className={cn("w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
          selected ? "bg-brand-600 border-brand-600" : "border-slate-300 group-hover:border-slate-400"
        )}>
          {selected && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>}
        </div>
      </td>

      {/* Name + avatar */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <Avatar initials={lead.avatar} color={lead.avatarColor ?? avatarColors[index % avatarColors.length]} size="sm" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">{lead.fullName}</div>
            <div className="text-xs text-slate-500 truncate">{lead.designation}</div>
          </div>
        </div>
      </td>

      {/* Company */}
      <td className="px-3 py-3">
        <div className="text-sm text-slate-700 truncate">{lead.company}</div>
        <div className="text-xs text-slate-400 truncate">{lead.industry}</div>
      </td>

      {/* Location */}
      <td className="px-3 py-3">
        <div className="text-xs text-slate-600 truncate">{lead.city}</div>
        <div className="text-xs text-slate-400 truncate">{lead.country}</div>
      </td>

      {/* Source */}
      <td className="px-3 py-3">
        <SourceBadge source={lead.source} size="sm" />
      </td>

      {/* Stage */}
      <td className="px-3 py-3">
        <StatusBadge status={lead.stage === "meeting_booked" ? "replied" : lead.stage} />
      </td>

      {/* Contact availability */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-1.5">
          <div title="Email" className={cn(lead.emailAvailable ? "text-emerald-500" : "text-slate-200")}>
            <Mail className="w-3.5 h-3.5" />
          </div>
          <div title="Phone" className={cn(lead.phoneAvailable ? "text-violet-500" : "text-slate-200")}>
            <Phone className="w-3.5 h-3.5" />
          </div>
          <div title="WhatsApp" className={cn(lead.whatsapp ? "text-emerald-600" : "text-slate-200")}>
            <MessageCircle className="w-3.5 h-3.5" />
          </div>
          <div title="LinkedIn" className={cn(lead.linkedinUrl ? "text-sky-500" : "text-slate-200")}>
            <Linkedin className="w-3.5 h-3.5" />
          </div>
        </div>
      </td>

      {/* Score */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-1.5">
          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full", lead.score >= 80 ? "bg-emerald-500" : lead.score >= 60 ? "bg-amber-500" : "bg-red-400")}
              style={{ width: `${lead.score}%` }}
            />
          </div>
          <span className={cn("text-xs font-bold", lead.score >= 80 ? "text-emerald-600" : lead.score >= 60 ? "text-amber-600" : "text-red-500")}>
            {lead.score}
          </span>
        </div>
      </td>

      {/* Sync status */}
      <td className="px-3 py-3">
        <SyncStatusChip status={lead.syncStatus} />
      </td>

      {/* Owner */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-1.5">
          <Avatar initials={lead.ownerAvatar} color="bg-brand-500" size="xs" />
          <span className="text-xs text-slate-600">{lead.owner}</span>
        </div>
      </td>

      {/* Last activity */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="w-3 h-3 shrink-0" />
          {lead.lastActivity}
        </div>
      </td>

      {/* Actions */}
      <td className="px-3 py-3 w-10" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onAction?.("menu", lead.id)}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
