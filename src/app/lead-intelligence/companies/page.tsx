"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { leadCompanies } from "@/lib/leadIntelligenceData";
import { Search, Globe, Users, Zap, ArrowRight, Building2, MapPin, BarChart3, Link2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const hiringColors: Record<string, string> = {
  "Actively Hiring": "bg-emerald-100 text-emerald-700",
  "Hiring": "bg-blue-100 text-blue-700",
  "Not Hiring": "bg-slate-100 text-slate-500",
};

export default function CompanyProfilesPage() {
  const [search, setSearch] = useState("");
  const filtered = leadCompanies.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Globe className="w-5 h-5 text-brand-600" />
              <h1 className="text-xl font-bold text-slate-900">Company Profiles</h1>
            </div>
            <p className="text-sm text-slate-500">All companies with associated contacts and campaigns</p>
          </div>
          <Button><Building2 className="w-4 h-4" />Add Company</Button>
        </div>

        <div className="relative max-w-lg mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input-field pl-10 h-10" placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="space-y-4">
          {filtered.map((company) => (
            <div key={company.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card hover:shadow-card-md transition-all group">
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 ${company.logoColor}`}>
                  {company.logo}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">{company.name}</h3>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", hiringColors[company.hiringStatus] ?? "bg-slate-100 text-slate-500")}>{company.hiringStatus}</span>
                      </div>
                      <p className="text-sm text-slate-500">{company.industry} · {company.size} employees</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {company.source.map((src) => (
                        <span key={src} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize">{src}</span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-3 leading-relaxed line-clamp-2">{company.description}</p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {company.techStack.map((tech) => (
                      <span key={tech} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">{tech}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-800">{company.contacts}</span>
                        <span className="text-slate-500">contacts</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Zap className="w-4 h-4 text-brand-400" />
                        <span className="font-semibold text-slate-800">{company.activeCampaigns}</span>
                        <span className="text-slate-500">campaigns</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <BarChart3 className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold text-slate-800">{company.revenue}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />{company.headquarters}
                      </div>
                    </div>
                    <Link href={`/lead-intelligence/companies/${company.id}`}>
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-brand-200 text-brand-600 text-xs font-medium hover:bg-brand-50 transition-colors">
                        View Profile <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
