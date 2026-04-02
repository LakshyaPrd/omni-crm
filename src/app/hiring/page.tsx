"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { candidates } from "@/lib/data";
import {
  Search, Plus, Filter, MoreHorizontal, Star, MapPin, Briefcase,
  Brain, Calendar, FileText, MessageSquare, X, ExternalLink,
  CheckCircle, XCircle, Clock, ChevronRight,
} from "lucide-react";

const avatarColors = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-orange-500","bg-red-500","bg-teal-500"];

const kanbanColumns = [
  { id: "applied", label: "Applied", color: "bg-blue-500", count: 1 },
  { id: "screening", label: "Screening", color: "bg-amber-500", count: 1 },
  { id: "interview", label: "Interview", color: "bg-violet-500", count: 2 },
  { id: "offer", label: "Offer", color: "bg-emerald-500", count: 1 },
  { id: "hired", label: "Hired", color: "bg-green-500", count: 0 },
  { id: "rejected", label: "Rejected", color: "bg-red-500", count: 1 },
];

export default function HiringPage() {
  const [view, setView] = useState<"table" | "kanban">("table");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState<typeof candidates[0] | null>(null);
  const [search, setSearch] = useState("");

  const filtered = candidates.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase())
  );

  const openProfile = (c: typeof candidates[0]) => { setActiveCandidate(c); setDrawerOpen(true); };

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Hiring</h1>
            <p className="text-sm text-slate-500 mt-0.5">{candidates.length} candidates across all roles</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
              {(["table","kanban"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className={`px-4 py-2 font-medium capitalize transition-colors ${view === v ? "bg-brand-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                  {v}
                </button>
              ))}
            </div>
            <Button><Plus className="w-4 h-4" />Add Candidate</Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="input-field pl-9 h-9" placeholder="Search candidates..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="secondary"><Filter className="w-4 h-4" />Filter</Button>
          {/* Role filter pills */}
          {["All Roles","Engineering","Product","Design","Sales"].map((r, i) => (
            <button key={r} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${i === 0 ? "bg-brand-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"}`}>{r}</button>
          ))}
        </div>

        {view === "table" ? (
          <Card padding={false}>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-left table-header">Candidate</th>
                  <th className="px-4 py-3 text-left table-header">Role</th>
                  <th className="px-4 py-3 text-left table-header">Status</th>
                  <th className="px-4 py-3 text-left table-header">AI Score</th>
                  <th className="px-4 py-3 text-left table-header">Experience</th>
                  <th className="px-4 py-3 text-left table-header">Location</th>
                  <th className="px-4 py-3 text-left table-header">Applied</th>
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} className="table-row cursor-pointer" onClick={() => openProfile(c)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar initials={c.name.split(" ").map((n) => n[0]).join("")} color={avatarColors[i % avatarColors.length]} size="sm" />
                        <span className="text-sm font-medium text-slate-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{c.role}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Brain className={`w-3.5 h-3.5 ${c.aiScore >= 80 ? "text-emerald-500" : c.aiScore >= 60 ? "text-amber-500" : "text-red-400"}`} />
                        <span className={`text-xs font-bold ${c.aiScore >= 80 ? "text-emerald-700" : c.aiScore >= 60 ? "text-amber-700" : "text-red-600"}`}>{c.aiScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />{c.experience}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />{c.location}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{c.applied}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><MoreHorizontal className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          /* Kanban view */
          <div className="flex gap-4 overflow-x-auto pb-4">
            {kanbanColumns.map((col) => {
              const colCandidates = candidates.filter((c) => c.status === col.id);
              return (
                <div key={col.id} className="w-64 shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <span className="text-xs font-semibold text-slate-700">{col.label}</span>
                    <span className="ml-auto text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">{colCandidates.length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {colCandidates.map((c, i) => (
                      <div
                        key={c.id}
                        onClick={() => openProfile(c)}
                        className="card p-3 cursor-pointer hover:shadow-card-md transition-shadow"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <Avatar initials={c.name.split(" ").map((n) => n[0]).join("")} color={avatarColors[i % avatarColors.length]} size="xs" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{c.name}</p>
                            <p className="text-xs text-slate-500 truncate">{c.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="w-3 h-3" />{c.location}
                          </div>
                          <div className={`flex items-center gap-0.5 text-xs font-semibold ${c.aiScore >= 80 ? "text-emerald-600" : "text-amber-600"}`}>
                            <Brain className="w-3 h-3" />{c.aiScore}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-400 hover:border-brand-300 hover:text-brand-500 transition-colors">
                      + Add candidate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Candidate Profile Drawer */}
      {drawerOpen && activeCandidate && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setDrawerOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-[460px] bg-white border-l border-slate-100 shadow-card-lg z-50 animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Candidate Profile</h3>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><ExternalLink className="w-4 h-4" /></button>
                <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Profile header */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-start gap-4">
                  <Avatar initials={activeCandidate.name.split(" ").map((n) => n[0]).join("")} color="bg-violet-600" size="lg" />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-lg">{activeCandidate.name}</h4>
                    <p className="text-sm text-slate-600">{activeCandidate.role}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{activeCandidate.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{activeCandidate.experience}</span>
                    </div>
                    <div className="mt-2"><StatusBadge status={activeCandidate.status} /></div>
                  </div>
                </div>
              </div>

              {/* AI Score */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-brand-600" />
                    <p className="text-xs font-semibold text-slate-700">AI Match Score</p>
                  </div>
                  <span className={`text-xl font-black ${activeCandidate.aiScore >= 80 ? "text-emerald-600" : "text-amber-600"}`}>
                    {activeCandidate.aiScore}<span className="text-sm font-normal text-slate-400">/100</span>
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${activeCandidate.aiScore >= 80 ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${activeCandidate.aiScore}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[["Skills", "95%"], ["Experience", "88%"], ["Culture", "79%"]].map(([label, val]) => (
                    <div key={label} className="bg-slate-50 rounded-lg p-2 text-center">
                      <div className="text-xs font-bold text-slate-800">{val}</div>
                      <div className="text-xs text-slate-500">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview stages */}
              <div className="p-5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Interview Progress</p>
                <div className="space-y-2.5">
                  {[
                    { stage: "Resume Review", done: true },
                    { stage: "Phone Screen", done: true },
                    { stage: "Technical Interview", done: activeCandidate.status === "interview" || activeCandidate.status === "offer" },
                    { stage: "Culture Fit", done: activeCandidate.status === "offer" },
                    { stage: "Final Decision", done: false },
                  ].map(({ stage, done }) => (
                    <div key={stage} className="flex items-center gap-3">
                      {done ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0" />}
                      <span className={`text-xs ${done ? "text-slate-800 font-medium" : "text-slate-400"}`}>{stage}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume preview placeholder */}
              <div className="p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Resume</p>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-600">{activeCandidate.name}_Resume.pdf</p>
                  <button className="mt-2 text-xs text-brand-600 font-medium hover:underline">View Resume</button>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-slate-100 flex gap-2">
              <button className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />Advance
              </button>
              <button className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />Schedule
              </button>
              <button className="flex-1 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" />Reject
              </button>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
}
