"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { leadCompanies } from "@/lib/leadIntelligenceData";
import { Search, Globe, Users, Zap, ArrowRight, Building2, MapPin, BarChart3, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AddCompanyModal } from "@/components/companies/AddCompanyModal";

const hiringColors: Record<string, string> = {
  "Actively Hiring": "bg-emerald-100 text-emerald-700",
  "Hiring": "bg-blue-100 text-blue-700",
  "Not Hiring": "bg-slate-100 text-slate-500",
};

const colorPalette = [
  "bg-violet-600", "bg-blue-600", "bg-emerald-600",
  "bg-orange-600", "bg-pink-600", "bg-cyan-600", "bg-indigo-600",
  "bg-teal-600", "bg-red-600", "bg-amber-600",
];

type LeadCompany = (typeof leadCompanies)[0];

interface AddedCompany extends LeadCompany {
  _isNew?: boolean;
}

function makeInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function CompanyProfilesPage() {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [companies, setCompanies] = useState<AddedCompany[]>(leadCompanies);
  const [toast, setToast] = useState("");

  const filtered = companies.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.headquarters.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(data: {
    company: {
      name: string; website: string; industry: string; size: string;
      hq: string; description: string; founded: string; revenue: string;
      linkedinUrl: string; tags: string;
    };
    employees: { firstName: string; lastName: string; email: string; [key: string]: string }[];
  }) {
    const { company, employees } = data;
    const validEmployees = employees.filter((e) => e.firstName || e.email);

    const newCompany: AddedCompany = {
      id: `co-${Date.now()}`,
      name: company.name,
      website: company.website || "",
      industry: company.industry || "Other",
      size: company.size || "Unknown",
      headquarters: company.hq || "—",
      revenue: company.revenue || "—",
      logo: makeInitials(company.name),
      logoColor: colorPalette[company.name.length % colorPalette.length],
      contacts: validEmployees.length,
      activeCampaigns: 0,
      source: ["manual"],
      linkedinUrl: company.linkedinUrl || "",
      phone: "",
      founded: company.founded || "",
      description: company.description || `${company.industry} company.`,
      techStack: company.tags
        ? company.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      hiringStatus: "Not Hiring",
      _isNew: true,
    };

    setCompanies((prev) => [newCompany, ...prev]);
    setShowAddModal(false);
    setToast(`${company.name} added successfully!`);
    setTimeout(() => setToast(""), 3500);
  }

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        {/* Toast */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {toast}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Globe className="w-5 h-5 text-brand-600" />
              <h1 className="text-xl font-bold text-slate-900">Company Profiles</h1>
              <span className="bg-brand-100 text-brand-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {companies.length}
              </span>
            </div>
            <p className="text-sm text-slate-500">All companies with associated contacts and campaigns</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Building2 className="w-4 h-4" />Add Company
          </Button>
        </div>

        <div className="relative max-w-lg mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input-field pl-10 h-10"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-slate-600">No companies found</p>
            <p className="text-sm mt-1">Try a different search or add a new company</p>
            <Button className="mt-4" onClick={() => setShowAddModal(true)}>
              <Building2 className="w-4 h-4" />Add Company
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {filtered.map((company, i) => (
            <div
              key={company.id}
              className={cn(
                "bg-white border rounded-2xl p-5 shadow-card hover:shadow-card-md transition-all group",
                company._isNew ? "border-brand-200 ring-1 ring-brand-100" : "border-slate-100"
              )}
            >
              {company._isNew && (
                <div className="flex items-center gap-1 text-xs text-brand-600 font-medium mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Just added
                </div>
              )}

              <div className="flex items-start gap-5">
                {/* Logo */}
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0",
                  company.logoColor || colorPalette[i % colorPalette.length]
                )}>
                  {company.logo || makeInitials(company.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
                          {company.name}
                        </h3>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          hiringColors[company.hiringStatus] ?? "bg-slate-100 text-slate-500"
                        )}>
                          {company.hiringStatus}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {company.industry} · {company.size} employees
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                      {company.source.map((src) => (
                        <span key={src} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize">
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-3 leading-relaxed line-clamp-2">
                    {company.description}
                  </p>

                  {/* Tech stack / tags */}
                  {company.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {company.techStack.map((tech) => (
                        <span key={tech} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-6 flex-wrap">
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
                      {company.headquarters && company.headquarters !== "—" && (
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {company.headquarters}
                        </div>
                      )}
                      {company.founded && (
                        <span className="text-xs text-slate-400">Est. {company.founded}</span>
                      )}
                    </div>

                    {/* For newly added companies no detail page exists yet, so show a placeholder */}
                    {company._isNew ? (
                      <button
                        disabled
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-400 text-xs font-medium cursor-default"
                      >
                        Profile coming soon <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <Link href={`/lead-intelligence/companies/${company.id}`}>
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-brand-200 text-brand-600 text-xs font-medium hover:bg-brand-50 transition-colors">
                          View Profile <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <AddCompanyModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSave}
        />
      )}
    </MainLayout>
  );
}
