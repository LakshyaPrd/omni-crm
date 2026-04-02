"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { leads } from "@/lib/data";
import { getChannelColor } from "@/lib/utils";
import {
  Search, Filter, Plus, Download, MoreHorizontal, Mail,
  Phone, Linkedin, X, ChevronRight, Star, Tag, Trash2,
  SlidersHorizontal, CheckSquare, ExternalLink, Clock,
} from "lucide-react";

const avatarColors = [
  "bg-blue-500","bg-violet-500","bg-emerald-500","bg-orange-500",
  "bg-pink-500","bg-teal-500","bg-red-500","bg-indigo-500","bg-amber-500","bg-cyan-500",
];

export default function LeadsPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeLead, setActiveLead] = useState<typeof leads[0] | null>(null);
  const [search, setSearch] = useState("");

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const openDrawer = (lead: typeof leads[0]) => {
    setActiveLead(lead);
    setDrawerOpen(true);
  };

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Leads</h1>
            <p className="text-sm text-slate-500 mt-0.5">{leads.length} total leads</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary"><Download className="w-4 h-4" />Export</Button>
            <Button><Plus className="w-4 h-4" />Add Lead</Button>
          </div>
        </div>

        <Card padding={false}>
          {/* Toolbar */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-100">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="input-field pl-9 h-9"
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="secondary"><Filter className="w-4 h-4" />Filter</Button>
            <Button variant="secondary"><SlidersHorizontal className="w-4 h-4" />Sort</Button>

            {selected.length > 0 && (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
                <span className="text-xs font-medium text-slate-600">{selected.length} selected</span>
                <Button variant="secondary" size="sm"><Mail className="w-3.5 h-3.5" />Email</Button>
                <Button variant="secondary" size="sm"><Tag className="w-3.5 h-3.5" />Tag</Button>
                <Button variant="danger" size="sm"><Trash2 className="w-3.5 h-3.5" />Delete</Button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="w-10 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onChange={() =>
                        setSelected(selected.length === filtered.length ? [] : filtered.map((l) => l.id))
                      }
                    />
                  </th>
                  <th className="px-4 py-3 text-left table-header">Name</th>
                  <th className="px-4 py-3 text-left table-header">Company</th>
                  <th className="px-4 py-3 text-left table-header">Email</th>
                  <th className="px-4 py-3 text-left table-header">Status</th>
                  <th className="px-4 py-3 text-left table-header">Score</th>
                  <th className="px-4 py-3 text-left table-header">Tags</th>
                  <th className="px-4 py-3 text-left table-header">Last Contact</th>
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr
                    key={lead.id}
                    className="table-row cursor-pointer"
                    onClick={() => openDrawer(lead)}
                  >
                    <td className="px-4 py-3" onClick={(e) => { e.stopPropagation(); toggleSelect(lead.id); }}>
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        checked={selected.includes(lead.id)}
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar initials={lead.name.split(" ").map((n) => n[0]).join("")} color={avatarColors[i % avatarColors.length]} size="sm" />
                        <span className="text-sm font-medium text-slate-800">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{lead.company}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{lead.email}</td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${lead.score >= 80 ? "bg-emerald-500" : lead.score >= 60 ? "bg-amber-500" : "bg-red-400"}`}
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{lead.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {lead.tags.map((tag) => (
                          <span key={tag} className="badge bg-slate-100 text-slate-600 text-xs">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {lead.lastContact}
                      </div>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">Showing {filtered.length} of {leads.length} leads</span>
            <div className="flex items-center gap-1">
              {[1,2,3,"...",12].map((p, i) => (
                <button
                  key={i}
                  className={`w-7 h-7 text-xs rounded-lg transition-colors ${p === 1 ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Lead Detail Drawer */}
      {drawerOpen && activeLead && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setDrawerOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-[420px] bg-white border-l border-slate-100 shadow-card-lg z-50 animate-slide-in-right flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Lead Details</h3>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><ExternalLink className="w-4 h-4" /></button>
                <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Profile */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-start gap-4">
                  <Avatar initials={activeLead.name.split(" ").map((n) => n[0]).join("")} color="bg-brand-600" size="lg" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-base">{activeLead.name}</h4>
                    <p className="text-sm text-slate-500">{activeLead.company}</p>
                    <p className="text-sm text-slate-500">{activeLead.email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <StatusBadge status={activeLead.status} />
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-500 transition-colors">
                    <Star className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick actions */}
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-brand-50 text-brand-700 text-sm font-medium hover:bg-brand-100 transition-colors">
                    <Mail className="w-3.5 h-3.5" />Email
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors">
                    <Phone className="w-3.5 h-3.5" />Call
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-sky-50 text-sky-700 text-sm font-medium hover:bg-sky-100 transition-colors">
                    <Linkedin className="w-3.5 h-3.5" />LinkedIn
                  </button>
                </div>
              </div>

              {/* AI Score */}
              <div className="p-5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">AI Lead Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${activeLead.score >= 80 ? "bg-emerald-500" : activeLead.score >= 60 ? "bg-amber-500" : "bg-red-400"}`}
                      style={{ width: `${activeLead.score}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-slate-900">{activeLead.score}/100</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Based on engagement, company fit, and timing signals</p>
              </div>

              {/* Details */}
              <div className="p-5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Lead Details</p>
                <div className="space-y-2.5">
                  {[
                    { label: "Company", value: activeLead.company },
                    { label: "Email", value: activeLead.email },
                    { label: "Last Contact", value: activeLead.lastContact },
                    { label: "Tags", value: activeLead.tags.join(", ") },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{label}</span>
                      <span className="text-xs font-medium text-slate-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity timeline */}
              <div className="p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Activity</p>
                <div className="space-y-4">
                  {[
                    { action: "Email opened", detail: "Campaign: SaaS Founders Q3", time: "2h ago", icon: "📧" },
                    { action: "LinkedIn viewed", detail: "Visited profile", time: "1d ago", icon: "💼" },
                    { action: "Email sent", detail: "Follow-up sequence #2", time: "3d ago", icon: "📤" },
                  ].map((a, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs shrink-0">{a.icon}</div>
                      <div>
                        <p className="text-xs font-medium text-slate-800">{a.action}</p>
                        <p className="text-xs text-slate-500">{a.detail}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-5 py-4 border-t border-slate-100 flex gap-2">
              <Button className="flex-1">Add to Campaign</Button>
              <Button variant="secondary" className="flex-1">Edit Lead</Button>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
}
