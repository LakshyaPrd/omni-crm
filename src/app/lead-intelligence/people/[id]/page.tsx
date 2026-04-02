"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { SourceBadge } from "@/components/lead-intelligence/SourceBadge";
import { SyncStatusChip } from "@/components/lead-intelligence/SyncStatusChip";
import { ActivityTimeline } from "@/components/lead-intelligence/ActivityTimeline";
import { ContactInfoBlock } from "@/components/lead-intelligence/ContactInfoBlock";
import { ConversationThread } from "@/components/lead-intelligence/ConversationThread";
import { ProfileHeader } from "@/components/lead-intelligence/ProfileHeader";
import { CompanyBlock } from "@/components/lead-intelligence/CompanyBlock";
import { importedLeads, leadActivities, leadConversations, leadCompanies } from "@/lib/leadIntelligenceData";
import {
  Mail, Phone, MessageCircle, Linkedin, MapPin, Globe, Briefcase,
  Brain, Zap, Star, Calendar, Plus, ArrowLeft, RefreshCw, MoreHorizontal,
  Copy, CheckCircle, XCircle, ExternalLink, Send, Paperclip, Sparkles,
  FileText, Upload, Database, AlertTriangle, Bot, ChevronRight,
  AtSign, Building2, Clock, User, Hash, Shield, Eye,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "contact", label: "Contact Info" },
  { id: "company", label: "Company" },
  { id: "activity", label: "Activity" },
  { id: "conversations", label: "Conversations" },
  { id: "campaigns", label: "Campaigns" },
  { id: "notes", label: "Notes" },
  { id: "files", label: "Files" },
  { id: "enrichment", label: "Enrichment" },
  { id: "ai", label: "AI Insights" },
];

const channelColors: Record<string, string> = {
  email: "bg-blue-100 text-blue-700", linkedin: "bg-sky-100 text-sky-700",
  whatsapp: "bg-emerald-100 text-emerald-700",
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function ContactRow({ icon: Icon, label, value, verified, type }: { icon: React.ElementType; label: string; value: string; verified?: boolean; type?: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-400 mb-0.5">{label}{type && ` · ${type}`}</div>
        <div className="text-sm font-medium text-slate-800 truncate">{value}</div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {verified !== undefined && (
          verified
            ? <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5"><CheckCircle className="w-3 h-3" />Verified</span>
            : <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Unverified</span>
        )}
        <CopyButton value={value} />
      </div>
    </div>
  );
}

export default function LeadProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [convChannel, setConvChannel] = useState<"email" | "linkedin" | "whatsapp">("email");
  const [message, setMessage] = useState("");
  const [starred, setStarred] = useState(false);

  const lead = importedLeads.find((l) => l.id === params.id) ?? importedLeads[0];

  const completionScore = Math.round(
    ([lead.emails.length > 0, lead.phones.length > 0, lead.linkedinUrl, lead.whatsapp, lead.summary, lead.skills.length > 0, lead.enriched].filter(Boolean).length / 7) * 100
  );

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
          <Link href="/lead-intelligence/imported" className="flex items-center gap-1 hover:text-brand-600 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />Imported Leads
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 font-medium">{lead.fullName}</span>
        </div>

        {/* Profile Header */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-card mb-5 overflow-hidden">
          {/* Cover gradient */}
          <div className="h-20 bg-gradient-to-r from-brand-600 via-brand-500 to-violet-500 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0tNiAwaDZ2Nmgtdi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          </div>

          <div className="px-6 pb-5">
            <div className="flex items-end gap-5 -mt-8 mb-4">
              <div className={`w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-black ${lead.avatarColor}`}>
                {lead.avatar}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900">{lead.fullName}</h1>
                  <span className="text-sm text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-medium">{lead.connectionStatus}</span>
                  <SourceBadge source={lead.source} size="md" />
                  <SyncStatusChip status={lead.syncStatus} />
                </div>
                <p className="text-sm font-medium text-slate-600 mt-0.5">{lead.headline}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{lead.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lead.timezone}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{lead.experience}</span>
                  <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" />Synced {lead.syncedAt}</span>
                </div>
              </div>

              {/* Score badges */}
              <div className="flex gap-3 pb-1">
                {[
                  { label: "Lead Score", value: lead.score, color: lead.score >= 80 ? "text-emerald-600" : "text-amber-600", bg: lead.score >= 80 ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200" },
                  { label: "Intent", value: lead.intentScore, color: "text-brand-600", bg: "bg-brand-50 border-brand-200" },
                  { label: "Engagement", value: lead.engagementScore, color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={`border rounded-xl p-3 text-center ${bg}`}>
                    <div className={`text-2xl font-black ${color}`}>{value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 pb-1">
                <button onClick={() => setStarred(!starred)} className={cn("p-2 rounded-xl border transition-colors", starred ? "bg-amber-50 border-amber-200 text-amber-500" : "bg-white border-slate-200 text-slate-400 hover:text-amber-500")}>
                  <Star className={cn("w-4 h-4", starred && "fill-amber-400")} />
                </button>
                <Button variant="secondary" size="sm"><RefreshCw className="w-3.5 h-3.5" />Sync</Button>
                <Button variant="secondary" size="sm"><MoreHorizontal className="w-3.5 h-3.5" /></Button>
              </div>
            </div>

            {/* Profile completion */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all" style={{ width: `${completionScore}%` }} />
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap">{completionScore}% complete</span>
            </div>

            {/* Quick action bar */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: "Send Email", icon: Mail, color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
                { label: "WhatsApp", icon: MessageCircle, color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
                { label: "LinkedIn", icon: Linkedin, color: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100" },
                { label: "Call", icon: Phone, color: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100" },
                { label: "Add to Campaign", icon: Zap, color: "bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100" },
                { label: "Schedule", icon: Calendar, color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100" },
                { label: "Add Note", icon: Plus, color: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200" },
              ].map(({ label, icon: Icon, color }) => (
                <button key={label} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors", color)}>
                  <Icon className="w-3.5 h-3.5" />{label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs + Content */}
        <div className="flex gap-5">
          {/* Left: Tabs content */}
          <div className="flex-1 min-w-0">
            {/* Tab bar */}
            <div className="bg-white border border-slate-100 rounded-xl shadow-card mb-4 overflow-x-auto">
              <div className="flex items-center px-2 py-1 gap-0.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                      activeTab === tab.id ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >{tab.label}</button>
                ))}
              </div>
            </div>

            {/* === OVERVIEW TAB === */}
            {activeTab === "overview" && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-card">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3">Professional Summary</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{lead.summary}</p>
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {lead.skills.map((skill) => (
                        <span key={skill} className="text-xs bg-brand-50 text-brand-700 border border-brand-100 px-2.5 py-1 rounded-lg font-medium">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Experience</h4>
                      <p className="text-sm text-slate-700">{lead.experience}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Education</h4>
                      <p className="text-sm text-slate-700">{lead.education}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-800">Tags & Classification</h3>
                    <Button variant="ghost" size="sm"><Plus className="w-3.5 h-3.5" />Add Tag</Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full font-medium hover:bg-slate-200 cursor-pointer transition-colors">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-card">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3">Source Information</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Source Platform", value: lead.source },
                      { label: "Sync Status", value: lead.syncStatus },
                      { label: "Last Synced", value: lead.syncedAt },
                      { label: "Created At", value: lead.createdAt },
                      { label: "Campaigns", value: `${lead.campaignsCount} campaigns` },
                      { label: "Connection", value: lead.connectionStatus },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-slate-50 rounded-lg p-3">
                        <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                        <div className="text-sm font-medium text-slate-800 capitalize">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === CONTACT INFO TAB === */}
            {activeTab === "contact" && (
              <div className="animate-fade-in space-y-4">
                <ContactInfoBlock
                  fields={[
                    ...lead.emails.map((e, i) => ({
                      type: "email" as const,
                      label: i === 0 ? "Primary Email" : "Alternate Email",
                      value: e.address,
                      verified: e.verified,
                      primary: e.primary,
                    })),
                    ...lead.phones.map((p) => ({
                      type: "phone" as const,
                      label: "Phone",
                      value: p.number,
                      verified: p.verified,
                      note: p.type,
                    })),
                    ...(lead.whatsapp ? [{ type: "whatsapp" as const, label: "WhatsApp", value: lead.whatsapp, verified: true }] : []),
                    ...(lead.linkedinUrl ? [{ type: "linkedin" as const, label: "LinkedIn", value: lead.linkedinUrl }] : []),
                    ...(lead.website ? [{ type: "website" as const, label: "Website", value: lead.website }] : []),
                  ]}
                />
                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-card">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Verification Summary</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Email Verified",   ok: lead.emails.some((e) => e.verified) },
                      { label: "Phone Verified",   ok: lead.phones.some((p) => p.verified) },
                      { label: "WhatsApp Active",  ok: !!lead.whatsapp },
                      { label: "LinkedIn Found",   ok: !!lead.linkedinUrl },
                    ].map(({ label, ok }) => (
                      <div key={label} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg", ok ? "bg-emerald-50" : "bg-slate-50")}>
                        {ok ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-slate-300" />}
                        <span className={cn("text-xs font-medium", ok ? "text-emerald-700" : "text-slate-500")}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === COMPANY TAB === */}
            {activeTab === "company" && (
              <div className="space-y-4 animate-fade-in">
                <CompanyBlock
                  companyId={lead.companyId}
                  name={lead.company}
                  website={lead.website}
                  industry={lead.industry}
                  size={lead.companySize}
                  headquarters={lead.city + ", " + lead.country}
                  contacts={leadCompanies.find((c) => c.id === lead.companyId)?.contacts}
                  activeCampaigns={leadCompanies.find((c) => c.id === lead.companyId)?.activeCampaigns}
                  revenue={leadCompanies.find((c) => c.id === lead.companyId)?.revenue}
                  hiringStatus={leadCompanies.find((c) => c.id === lead.companyId)?.hiringStatus}
                  techStack={leadCompanies.find((c) => c.id === lead.companyId)?.techStack}
                  description={leadCompanies.find((c) => c.id === lead.companyId)?.description}
                  logoColor={leadCompanies.find((c) => c.id === lead.companyId)?.logoColor}
                />
              </div>
            )}

            {/* === ACTIVITY TAB === */}
            {activeTab === "activity" && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-800">Activity Timeline</h3>
                  <div className="flex gap-1">
                    {["All","Email","LinkedIn","WhatsApp"].map((f) => (
                      <button key={f} className={cn("px-2.5 py-1 rounded-full text-xs font-medium transition-colors", f === "All" ? "bg-brand-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300")}>{f}</button>
                    ))}
                  </div>
                </div>
                <ActivityTimeline activities={leadActivities} />
              </div>
            )}

            {/* === CONVERSATIONS TAB === */}
            {activeTab === "conversations" && (
              <div className="animate-fade-in">
                <ConversationThread
                  channels={[
                    { channel: "email",    messages: leadConversations.email.map((m) => ({ ...m, id: String(m.id), status: "read" as const })) },
                    { channel: "linkedin", messages: leadConversations.linkedin.map((m) => ({ ...m, id: String(m.id), status: "read" as const })) },
                    { channel: "whatsapp", messages: leadConversations.whatsapp.map((m) => ({ ...m, id: String(m.id), status: "read" as const })) },
                    { channel: "sms",      messages: [] },
                    { channel: "call",     messages: [] },
                  ]}
                  contactName={lead.fullName}
                  contactAvatar={lead.avatar}
                  contactColor={lead.avatarColor}
                  ownerAvatar="ER"
                  ownerName="Emma R."
                />
              </div>
            )}

            {/* === CAMPAIGNS TAB === */}
            {activeTab === "campaigns" && (
              <div className="animate-fade-in space-y-3">
                {[
                  { name: "SaaS Founders Q3", status: "active", step: "Step 3 / 5", next: "Follow-up email in 2 days", response: "Opened" },
                  { name: "LinkedIn Outreach Wave", status: "completed", step: "Completed", next: "—", response: "Replied" },
                ].map((c) => (
                  <div key={c.name} className="bg-white border border-slate-100 rounded-xl p-4 shadow-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-brand-500" />
                        <span className="text-sm font-semibold text-slate-800">{c.name}</span>
                        <StatusBadge status={c.status} />
                      </div>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[{ label: "Progress", v: c.step }, { label: "Next Action", v: c.next }, { label: "Response", v: c.response }].map(({ label, v }) => (
                        <div key={label} className="bg-slate-50 rounded-lg p-2">
                          <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                          <div className="text-xs font-semibold text-slate-800">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <Button variant="secondary" className="w-full"><Plus className="w-4 h-4" />Add to Campaign</Button>
              </div>
            )}

            {/* === NOTES TAB === */}
            {activeTab === "notes" && (
              <div className="animate-fade-in space-y-4">
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-card">
                  <textarea className="input-field resize-none text-sm" rows={3} placeholder="Add an internal note... Use @name to mention teammates" />
                  <div className="flex justify-end mt-2">
                    <Button size="sm">Add Note</Button>
                  </div>
                </div>
                {[
                  { author: "Emma R.", time: "Jan 15 · 3:00 PM", note: "Very interested, mentioned budget approval next Q. Follow up after meeting.", pinned: true },
                  { author: "David P.", time: "Jan 14 · 4:00 PM", note: "Checked their website — they're using HubSpot currently. Strong switching intent.", pinned: false },
                ].map((n, i) => (
                  <div key={i} className={cn("bg-white border rounded-xl p-4 shadow-card", n.pinned && "border-amber-200 bg-amber-50/30")}>
                    {n.pinned && <div className="text-xs text-amber-600 font-semibold mb-1.5 flex items-center gap-1">📌 Pinned</div>}
                    <p className="text-sm text-slate-700 mb-2 leading-relaxed">{n.note}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Avatar initials={n.author.split(" ").map(w => w[0]).join("")} color="bg-brand-500" size="xs" />
                      {n.author} · {n.time}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* === FILES TAB === */}
            {activeTab === "files" && (
              <div className="animate-fade-in space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-brand-300 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">Drop files or click to upload</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, DOCX, MP3, MP4 up to 50MB</p>
                </div>
                {[
                  { name: "Sarah_Connor_Resume.pdf", type: "Resume", size: "342 KB", date: "Jan 14" },
                  { name: "Proposal_TechVault.pdf", type: "Proposal", size: "1.2 MB", date: "Jan 15" },
                  { name: "Call_Recording_01.mp3", type: "Voice Note", size: "4.8 MB", date: "Jan 15" },
                ].map((file) => (
                  <div key={file.name} className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-card flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-slate-500" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">{file.type} · {file.size} · {file.date}</p>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><ExternalLink className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            )}

            {/* === ENRICHMENT TAB === */}
            {activeTab === "enrichment" && (
              <div className="animate-fade-in space-y-4">
                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-brand-600" />
                      <h3 className="text-sm font-semibold text-slate-800">Enrichment Data</h3>
                    </div>
                    <Button variant="secondary" size="sm"><RefreshCw className="w-3.5 h-3.5" />Re-enrich</Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { source: "Apollo.io", fields: 24, status: "enriched", date: lead.syncedAt },
                      { source: "LinkedIn", fields: 12, status: "enriched", date: lead.syncedAt },
                    ].map((e) => (
                      <div key={e.source} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-700">{e.source}</span>
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">✓ {e.status}</span>
                        </div>
                        <div className="text-xs text-slate-500">{e.fields} fields mapped · {e.date}</div>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Raw Enriched Fields</h4>
                  <div className="space-y-2">
                    {[
                      { field: "job_title", value: lead.designation, source: "Apollo", confidence: "High" },
                      { field: "company_name", value: lead.company, source: "LinkedIn", confidence: "High" },
                      { field: "email_verified", value: "True", source: "Apollo", confidence: "High" },
                      { field: "company_size", value: lead.companySize, source: "Apollo", confidence: "Medium" },
                      { field: "linkedin_url", value: lead.linkedinUrl ?? "N/A", source: "LinkedIn", confidence: "High" },
                      { field: "phone_mobile", value: lead.phones[0]?.number ?? "Not found", source: "Apollo", confidence: "Low" },
                    ].map(({ field, value, source, confidence }) => (
                      <div key={field} className="flex items-center gap-3 py-1.5 border-b border-slate-100 last:border-0">
                        <span className="text-xs font-mono text-slate-500 w-36 shrink-0">{field}</span>
                        <span className="text-xs text-slate-800 flex-1 truncate">{value}</span>
                        <span className="text-xs text-slate-400 w-16 shrink-0">{source}</span>
                        <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium",
                          confidence === "High" ? "bg-emerald-100 text-emerald-700" :
                          confidence === "Medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"
                        )}>{confidence}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === AI INSIGHTS TAB === */}
            {activeTab === "ai" && (
              <div className="animate-fade-in space-y-4">
                <div className="bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-100 rounded-xl p-5 shadow-card">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-brand-900">AI Lead Summary</h3>
                    <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full ml-auto">Generated {lead.syncedAt}</span>
                  </div>
                  <p className="text-sm text-brand-800 leading-relaxed">{lead.summary} Based on their engagement patterns, they are in active evaluation mode and respond best to ROI-focused messaging. Recommend scheduling a product demo within the next 48 hours for best conversion probability.</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Intent Score", value: lead.intentScore, max: 100, color: "bg-brand-500", desc: "Active buyer signals detected" },
                    { label: "Engagement", value: lead.engagementScore, max: 100, color: "bg-violet-500", desc: "Email opens + LinkedIn activity" },
                    { label: "Lead Score", value: lead.score, max: 100, color: "bg-emerald-500", desc: "Overall qualification score" },
                  ].map(({ label, value, color, desc }) => (
                    <div key={label} className="bg-white border border-slate-100 rounded-xl p-4 shadow-card text-center">
                      <div className="relative w-16 h-16 mx-auto mb-2">
                        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                          <circle cx="32" cy="32" r="28" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                          <circle cx="32" cy="32" r="28" fill="none" stroke={color.replace("bg-", "#").replace("-500", "")} strokeWidth="6"
                            strokeDasharray={`${(value / 100) * 176} 176`} strokeLinecap="round"
                            className={cn("transition-all", color.includes("brand") ? "stroke-brand-500" : color.includes("violet") ? "stroke-violet-500" : "stroke-emerald-500")}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-base font-black text-slate-900">{value}</div>
                      </div>
                      <div className="text-xs font-semibold text-slate-800">{label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-card">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3">Recommended Next Actions</h3>
                  <div className="space-y-2.5">
                    {[
                      { action: "Send personalized follow-up email", priority: "High", icon: "📧", color: "border-red-200 bg-red-50" },
                      { action: "Schedule discovery call within 48 hours", priority: "High", icon: "📅", color: "border-orange-200 bg-orange-50" },
                      { action: "Share case study relevant to SaaS industry", priority: "Medium", icon: "📄", color: "border-amber-200 bg-amber-50" },
                      { action: "Connect on LinkedIn for social proof", priority: "Low", icon: "💼", color: "border-slate-200 bg-slate-50" },
                    ].map(({ action, priority, icon, color }) => (
                      <div key={action} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl border", color)}>
                        <span>{icon}</span>
                        <span className="text-sm text-slate-700 flex-1">{action}</span>
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full",
                          priority === "High" ? "bg-red-100 text-red-700" :
                          priority === "Medium" ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-600"
                        )}>{priority}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-800">Suggested Message Draft</h3>
                    <Button variant="secondary" size="sm"><Sparkles className="w-3.5 h-3.5" />Regenerate</Button>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 font-mono text-xs text-slate-700 leading-relaxed border border-slate-200">
                    Hi {lead.firstName},<br /><br />
                    Just following up on our previous conversation. Given that you're scaling growth at {lead.company}, I thought you'd find our recent case study on how we helped a similar SaaS company achieve 3x reply rates really valuable.<br /><br />
                    Would you be open to a quick 15-min call this week to explore if we could deliver similar results for {lead.company}?<br /><br />
                    Best,<br />Emma
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm"><Mail className="w-3.5 h-3.5" />Send Email</Button>
                    <Button variant="secondary" size="sm"><Copy className="w-3.5 h-3.5" />Copy</Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar: quick info */}
          <div className="w-56 shrink-0 space-y-4">
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-card">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick Info</p>
              <div className="space-y-2.5">
                {[
                  { icon: User, label: "Owner", value: lead.owner },
                  { icon: Zap, label: "Stage", value: lead.stage.replace("_", " ") },
                  { icon: Hash, label: "Campaigns", value: `${lead.campaignsCount} active` },
                  { icon: Clock, label: "Last Activity", value: lead.lastActivity },
                  { icon: RefreshCw, label: "Synced", value: lead.syncedAt },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-400">{label}</div>
                      <div className="text-xs font-semibold text-slate-700 capitalize truncate">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-card">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Change Stage</p>
              <select className="input-field text-xs">
                {["new","contacted","qualified","replied","meeting_booked","proposal","converted","lost"].map((s) => (
                  <option key={s} value={s} selected={s === lead.stage}>{s.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
                ))}
              </select>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-card">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Assign Owner</p>
              <select className="input-field text-xs">
                {["Emma R.","David P.","Sarah M.","Raj G."].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
