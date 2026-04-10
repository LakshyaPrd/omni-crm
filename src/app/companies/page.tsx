"use client";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { companiesList } from "@/lib/data";
import { Search, Plus, Building2, Users, MoreHorizontal, Mail, Activity, Briefcase } from "lucide-react";
import { AddCompanyModal } from "@/components/companies/AddCompanyModal";
import { crmStore } from "@/lib/crmStore";
import Link from "next/link";

const industryColors: Record<string, string> = {
  Fintech: "bg-emerald-100 text-emerald-700",
  Productivity: "bg-violet-100 text-violet-700",
  "Design Tools": "bg-pink-100 text-pink-700",
  "Dev Tools": "bg-blue-100 text-blue-700",
  Infrastructure: "bg-orange-100 text-orange-700",
  Database: "bg-cyan-100 text-cyan-700",
};

const companyInitials = (name: string) => name.split(" ").map((w) => w[0]).join("").slice(0, 2);
const companyColors = ["bg-violet-600","bg-blue-600","bg-pink-600","bg-emerald-600","bg-orange-600","bg-cyan-600"];

interface StoredCompany {
  id: number;
  name: string;
  industry: string;
  leads: number;
  status: string;
  revenue: string;
  contacts: number;
  website?: string;
  hq?: string;
  size?: string;
  description?: string;
  employeeCount?: number;
}

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [companies, setCompanies] = useState<StoredCompany[]>(
    companiesList.map((c) => ({ ...c, status: c.status || "prospect" }))
  );
  const [toast, setToast] = useState("");

  // Load companies added from Job Search via crmStore
  useEffect(() => {
    const fromJobSearch = crmStore.getCompanies();
    if (fromJobSearch.length) {
      const mapped: StoredCompany[] = fromJobSearch.map((c) => ({
        id: Number(c.id.replace("jc-", "")) || Date.now(),
        name: c.name,
        industry: c.industry || "Other",
        leads: 0,
        status: "prospect",
        revenue: "—",
        contacts: 0,
        website: c.website,
        hq: c.location,
        size: c.size,
        description: `Hiring: ${c.jobTitle ?? ""} · Source: ${c.platform ?? "Job Search"}`,
      }));
      setCompanies((prev) => {
        const existingNames = new Set(prev.map((c) => c.name.toLowerCase()));
        const newOnes = mapped.filter((c) => !existingNames.has(c.name.toLowerCase()));
        return newOnes.length ? [...newOnes, ...prev] : prev;
      });
    }
  }, []);

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(data: { company: { name: string; website: string; industry: string; size: string; hq: string; description: string; founded: string; revenue: string; linkedinUrl: string; tags: string }; employees: { firstName: string; lastName: string; email: string; [key: string]: string }[] }) {
    const { company, employees } = data;
    const newCompany: StoredCompany = {
      id: Date.now(),
      name: company.name,
      industry: company.industry || "Other",
      leads: 0,
      status: "prospect",
      revenue: company.revenue || "—",
      contacts: employees.filter((e) => e.firstName || e.email).length,
      website: company.website,
      hq: company.hq,
      size: company.size,
      description: company.description,
      employeeCount: employees.filter((e) => e.firstName || e.email).length,
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
            <span>✓</span> {toast}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Companies</h1>
            <p className="text-sm text-slate-500 mt-0.5">{companies.length} companies tracked</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/lead-intelligence/jobs" className="btn-secondary text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4" />Find Hiring Companies
            </Link>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" />Add Company
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="input-field pl-9 h-9" placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {(["grid","table"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${view === v ? "bg-brand-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((company, i) => (
              <Card key={company.id} className="hover:shadow-card-md transition-shadow cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${companyColors[i % companyColors.length]}`}>
                      {companyInitials(company.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">{company.name}</h3>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${industryColors[company.industry] ?? "bg-slate-100 text-slate-600"}`}>
                        {company.industry}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={company.status} />
                </div>

                {company.hq && (
                  <p className="text-xs text-slate-400 mb-3 truncate">{company.hq}</p>
                )}

                <div className="grid grid-cols-3 gap-3 py-3 border-t border-b border-slate-100 my-3">
                  {[
                    { label: "Leads", value: company.leads },
                    { label: "Contacts", value: company.contacts },
                    { label: "Revenue", value: company.revenue },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <div className="text-sm font-bold text-slate-900">{value}</div>
                      <div className="text-xs text-slate-500">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                    <Users className="w-3.5 h-3.5" />Contacts
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-brand-600 hover:bg-brand-50 transition-colors">
                    <Activity className="w-3.5 h-3.5" />Activity
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                    <Mail className="w-3.5 h-3.5" />Email
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card padding={false}>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-left table-header">Company</th>
                  <th className="px-4 py-3 text-left table-header">Industry</th>
                  <th className="px-4 py-3 text-left table-header">Status</th>
                  <th className="px-4 py-3 text-left table-header">Leads</th>
                  <th className="px-4 py-3 text-left table-header">Contacts</th>
                  <th className="px-4 py-3 text-left table-header">Revenue</th>
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((company, i) => (
                  <tr key={company.id} className="table-row cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${companyColors[i % companyColors.length]}`}>
                          {companyInitials(company.name)}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-800">{company.name}</span>
                          {company.hq && <p className="text-xs text-slate-400">{company.hq}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${industryColors[company.industry] ?? "bg-slate-100 text-slate-600"}`}>
                        {company.industry}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={company.status} /></td>
                    <td className="px-4 py-3 text-sm text-slate-700">{company.leads}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{company.contacts}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{company.revenue}</td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><MoreHorizontal className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {showAddModal && (
        <AddCompanyModal onClose={() => setShowAddModal(false)} onSave={handleSave} />
      )}
    </MainLayout>
  );
}
