"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { SourceBadge } from "@/components/lead-intelligence/SourceBadge";
import { leadCompanies, importedLeads } from "@/lib/leadIntelligenceData";
import {
  ArrowLeft, Globe, Users, Zap, MapPin, Building2, ExternalLink,
  Phone, Linkedin, BarChart3, Plus, Mail, ChevronRight,
  Calendar, FileText, Bot, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = ["Overview", "Contacts", "Activity", "Campaigns", "Notes", "Files", "AI Summary"];

export default function CompanyProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const company = leadCompanies.find((c) => c.id === params.id) ?? leadCompanies[0];
  const companyLeads = importedLeads.filter((l) => l.companyId === company.id);

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
          <Link href="/lead-intelligence/companies" className="flex items-center gap-1 hover:text-brand-600 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />Company Profiles
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 font-medium">{company.name}</span>
        </div>

        {/* Header */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-card mb-5 overflow-hidden">
          <div className="h-16 bg-gradient-to-r from-slate-700 to-slate-900" />
          <div className="px-6 pb-5">
            <div className="flex items-end gap-4 -mt-7 mb-4">
              <div className={`w-16 h-16 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white text-xl font-black ${company.logoColor}`}>
                {company.logo}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-xl font-bold text-slate-900">{company.name}</h1>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{company.hiringStatus}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{company.industry}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{company.size} employees</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{company.headquarters}</span>
                  <a href="#" className="flex items-center gap-1 text-brand-600 hover:underline"><Globe className="w-3.5 h-3.5" />{company.website}</a>
                </div>
              </div>
              <div className="flex items-center gap-2 pb-1">
                <Button variant="secondary" size="sm"><Phone className="w-3.5 h-3.5" />Call</Button>
                <Button variant="secondary" size="sm"><Mail className="w-3.5 h-3.5" />Email</Button>
                <Button size="sm"><Plus className="w-3.5 h-3.5" />Add Contact</Button>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed">{company.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Contacts", value: company.contacts, icon: Users, color: "text-brand-600 bg-brand-50" },
                { label: "Active Campaigns", value: company.activeCampaigns, icon: Zap, color: "text-violet-600 bg-violet-50" },
                { label: "Revenue", value: company.revenue, icon: BarChart3, color: "text-emerald-600 bg-emerald-50" },
                { label: "Founded", value: company.founded, icon: Calendar, color: "text-amber-600 bg-amber-50" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", color.split(" ")[1])}>
                      <Icon className={cn("w-3.5 h-3.5", color.split(" ")[0])} />
                    </div>
                    <span className="text-xs text-slate-500">{label}</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-5">
          <div className="flex-1">
            <div className="bg-white border border-slate-100 rounded-xl shadow-card mb-4">
              <div className="flex items-center px-2 py-1 gap-0.5">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={cn("px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                      activeTab === tab ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"
                    )}>{tab}</button>
                ))}
              </div>
            </div>

            {activeTab === "Overview" && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-card">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {company.techStack.map((tech) => (
                      <span key={tech} className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-mono font-medium">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-card">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3">Lead Sources</h3>
                  <div className="flex gap-2">
                    {company.source.map((src) => (
                      <SourceBadge key={src} source={src as any} size="md" />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Contacts" && (
              <div className="space-y-3 animate-fade-in">
                {(companyLeads.length > 0 ? companyLeads : importedLeads.slice(0, 3)).map((lead) => (
                  <div key={lead.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-card flex items-center gap-3">
                    <Avatar initials={lead.avatar} color={lead.avatarColor} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{lead.fullName}</p>
                      <p className="text-xs text-slate-500">{lead.designation}</p>
                    </div>
                    <StatusBadge status={lead.stage === "meeting_booked" ? "replied" : lead.stage} />
                    <Link href={`/lead-intelligence/people/${lead.id}`}>
                      <button className="text-xs text-brand-600 hover:underline flex items-center gap-1">
                        View <ExternalLink className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "AI Summary" && (
              <div className="bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-100 rounded-xl p-5 shadow-card animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-5 h-5 text-brand-600" />
                  <h3 className="text-sm font-semibold text-brand-900">AI Company Analysis</h3>
                  <Button variant="secondary" size="sm" className="ml-auto"><Sparkles className="w-3.5 h-3.5" />Regenerate</Button>
                </div>
                <p className="text-sm text-brand-800 leading-relaxed">
                  {company.name} is a {company.size}-person {company.industry} company generating approximately {company.revenue}. 
                  They are currently {company.hiringStatus.toLowerCase()}, signaling growth mode. 
                  Their tech stack ({company.techStack.join(", ")}) indicates a modern engineering culture with strong cloud infrastructure. 
                  Based on contact engagement patterns, there is high likelihood of conversion — recommend prioritizing enterprise outreach with ROI-focused messaging.
                </p>
              </div>
            )}

            {(activeTab === "Activity" || activeTab === "Campaigns" || activeTab === "Notes" || activeTab === "Files") && (
              <div className="bg-white border border-slate-100 rounded-xl p-8 text-center shadow-card animate-fade-in">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-600">No {activeTab.toLowerCase()} yet</p>
                <p className="text-xs text-slate-400 mt-1">Data will appear here as you interact with this company</p>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="w-52 shrink-0 space-y-4">
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-card">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick Info</p>
              <div className="space-y-2.5">
                {[
                  { label: "Phone", value: company.phone },
                  { label: "LinkedIn", value: "View page →" },
                  { label: "Founded", value: company.founded },
                  { label: "HQ", value: company.headquarters },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-xs text-slate-400">{label}</div>
                    <div className="text-xs font-semibold text-slate-700">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-card">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Account Owner</p>
              <div className="flex items-center gap-2">
                <Avatar initials="ER" color="bg-brand-600" size="sm" />
                <div>
                  <div className="text-xs font-semibold text-slate-800">Emma R.</div>
                  <div className="text-xs text-slate-400">Account Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
