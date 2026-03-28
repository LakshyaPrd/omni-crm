"use client";
import Sidebar from "@/components/Sidebar";
import { companies, leads } from "@/lib/mockData";
import { Building2, Users, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const planColors: Record<string, string> = {
  enterprise: "bg-accent-subtle text-accent border-accent/25",
  growth: "bg-success/10 text-success border-success/25",
  starter: "bg-text-muted/10 text-text-secondary border-border",
};

export default function CompaniesPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar />
      <main className="flex-1 overflow-y-auto grid-bg">
        <div className="max-w-5xl mx-auto px-8 py-8 animate-fade-in">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-700 text-text-primary tracking-tight">Companies</h1>
              <p className="text-sm text-text-secondary mt-1">Manage isolated workspaces for each client</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-base text-sm font-600 font-display rounded-lg hover:bg-accent-dim transition-colors">
              + New Company
            </button>
          </div>

          {/* Company cards */}
          <div className="grid grid-cols-1 gap-5">
            {companies.map((company) => {
              const companyLeads = leads.filter((l) => l.companyId === company.id);
              const wonLeads = companyLeads.filter((l) => l.stage === "closed_won").length;
              const avgScore = companyLeads.length
                ? Math.round(companyLeads.reduce((s, l) => s + l.score, 0) / companyLeads.length)
                : 0;

              return (
                <div
                  key={company.id}
                  className="bg-surface border border-border rounded-xl p-6 hover:border-border-light transition-all group"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-display font-800 shrink-0"
                        style={{
                          background: company.color + "18",
                          color: company.color,
                          border: `1px solid ${company.color}33`,
                        }}
                      >
                        {company.initials}
                      </div>
                      <div>
                        <h2 className="font-display font-700 text-lg text-text-primary">{company.name}</h2>
                        <span
                          className={`inline-block text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full border mt-1 ${planColors[company.plan]}`}
                        >
                          {company.plan}
                        </span>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-[11px] text-accent border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent-subtle">
                      Open Workspace <ArrowUpRight size={10} />
                    </button>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-[10px] font-mono text-text-muted uppercase tracking-wide mb-1">Total Leads</p>
                      <p className="font-display font-700 text-xl text-text-primary">{company.leadCount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-text-muted uppercase tracking-wide mb-1">Active</p>
                      <p className="font-display font-700 text-xl text-text-primary">{companyLeads.length}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-text-muted uppercase tracking-wide mb-1">Closed Won</p>
                      <p className="font-display font-700 text-xl text-success">{wonLeads}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-text-muted uppercase tracking-wide mb-1">Avg Score</p>
                      <p className="font-display font-700 text-xl text-warning">{avgScore || "—"}</p>
                    </div>
                  </div>

                  {/* Lead avatars preview */}
                  {companyLeads.length > 0 && (
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {companyLeads.slice(0, 5).map((lead) => (
                          <Link key={lead.id} href={`/leads/${lead.id}`}>
                            <div className="w-7 h-7 rounded-full bg-elevated border-2 border-surface flex items-center justify-center text-[9px] font-display font-700 text-text-secondary hover:border-accent/40 transition-colors cursor-pointer">
                              {lead.avatar}
                            </div>
                          </Link>
                        ))}
                        {companyLeads.length > 5 && (
                          <div className="w-7 h-7 rounded-full bg-elevated border-2 border-surface flex items-center justify-center text-[9px] font-mono text-text-muted">
                            +{companyLeads.length - 5}
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-text-secondary">{companyLeads.length} leads in this workspace</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add company CTA */}
          <div className="mt-5 border border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-border-light transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center mb-3 group-hover:border-accent/30 transition-colors">
              <Building2 size={16} className="text-text-muted group-hover:text-accent transition-colors" />
            </div>
            <p className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">Add a new company workspace</p>
            <p className="text-xs text-text-muted mt-1">Each company gets isolated leads, channels, and agents</p>
          </div>
        </div>
      </main>
    </div>
  );
}
