"use client";
import { X, ExternalLink, Mail, Phone, MessageCircle, Linkedin, MapPin, Briefcase, Brain, Zap, Star, Plus, Calendar } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SourceBadge } from "./SourceBadge";
import { SyncStatusChip } from "./SyncStatusChip";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ImportedLead } from "@/lib/leadIntelligenceData";
import Link from "next/link";

interface QuickPreviewDrawerProps {
  lead: ImportedLead;
  onClose: () => void;
}

export function QuickPreviewDrawer({ lead, onClose }: QuickPreviewDrawerProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[380px] bg-white border-l border-slate-100 shadow-card-lg z-50 animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Quick Preview</span>
          <div className="flex items-center gap-1">
            <Link href={`/lead-intelligence/people/${lead.id}`}>
              <button className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors" title="Open full profile">
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </Link>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Profile */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-start gap-3 mb-4">
              <Avatar initials={lead.avatar} color={lead.avatarColor} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold text-slate-900">{lead.fullName}</h3>
                  <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">{lead.connectionStatus}</span>
                </div>
                <p className="text-xs text-slate-600 mb-1 font-medium">{lead.designation}</p>
                <p className="text-xs text-slate-500 truncate">{lead.company}</p>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3 h-3" />{lead.location}
                </div>
              </div>
              <button className="p-1.5 text-slate-300 hover:text-amber-400 transition-colors"><Star className="w-4 h-4" /></button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <SourceBadge source={lead.source} />
              <StatusBadge status={lead.stage === "meeting_booked" ? "replied" : lead.stage} />
              <SyncStatusChip status={lead.syncStatus} />
            </div>

            {/* Scores */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Lead Score", value: lead.score, color: lead.score >= 80 ? "text-emerald-600" : "text-amber-600" },
                { label: "Intent", value: lead.intentScore, color: "text-brand-600" },
                { label: "Engagement", value: lead.engagementScore, color: "text-violet-600" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-slate-50 rounded-lg p-2 text-center">
                  <div className={`text-lg font-black ${color}`}>{value}</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: "Email", icon: Mail, color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
                { label: "WhatsApp", icon: MessageCircle, color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
                { label: "LinkedIn", icon: Linkedin, color: "bg-sky-50 text-sky-700 hover:bg-sky-100" },
                { label: "Call", icon: Phone, color: "bg-violet-50 text-violet-700 hover:bg-violet-100" },
              ].map(({ label, icon: Icon, color }) => (
                <button key={label} className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${color}`}>
                  <Icon className="w-3.5 h-3.5" />{label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="p-5 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Contact Info</p>
            <div className="space-y-2.5">
              {lead.emails.map((e, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-700 flex-1">{e.address}</span>
                  {e.verified ? <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">✓ Verified</span> : <span className="text-xs text-slate-400">Unverified</span>}
                </div>
              ))}
              {lead.phones.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-700 flex-1">{p.number}</span>
                  <span className="text-xs text-slate-400 capitalize">{p.type}</span>
                  {p.verified && <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">✓</span>}
                </div>
              ))}
              {lead.whatsapp && (
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-slate-700">{lead.whatsapp}</span>
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">WhatsApp</span>
                </div>
              )}
              {lead.linkedinUrl && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span className="text-xs text-sky-600 truncate">{lead.linkedinUrl}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="p-5 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {lead.skills.map((skill) => (
                <span key={skill} className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-lg font-medium">{skill}</span>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">AI Summary</p>
            <p className="text-xs text-slate-600 leading-relaxed">{lead.summary}</p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 flex gap-2">
          <Link href={`/lead-intelligence/people/${lead.id}`} className="flex-1">
            <Button className="w-full">View Full Profile</Button>
          </Link>
          <Button variant="secondary"><Plus className="w-4 h-4" />Campaign</Button>
          <Button variant="secondary"><Calendar className="w-4 h-4" /></Button>
        </div>
      </div>
    </>
  );
}
