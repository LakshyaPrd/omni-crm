"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { syncHistory } from "@/lib/leadIntelligenceData";
import {
  RefreshCw, CheckCircle, AlertCircle, AlertTriangle, Clock,
  Download, Filter, Search, Eye, RotateCcw, Activity, Zap, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  completed: { label: "Completed", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  partial:   { label: "Partial",   color: "bg-amber-50 text-amber-700 border-amber-200",   icon: AlertTriangle },
  failed:    { label: "Failed",    color: "bg-red-50 text-red-700 border-red-200",         icon: AlertCircle },
};

const typeColors: Record<string, string> = {
  "Auto Sync":    "bg-brand-100 text-brand-700",
  "Manual Import":"bg-violet-100 text-violet-700",
  "Webhook":      "bg-sky-100 text-sky-700",
  "Real-time":    "bg-emerald-100 text-emerald-700",
  "CSV Import":   "bg-orange-100 text-orange-700",
};

export default function SyncHistoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = syncHistory.filter((s) => {
    const matchSearch = !search || s.source.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || s.status === filter;
    return matchSearch && matchFilter;
  });

  const totalSuccess = syncHistory.reduce((a, s) => a + s.success, 0);
  const totalFailed = syncHistory.reduce((a, s) => a + s.failed, 0);
  const totalRecords = syncHistory.reduce((a, s) => a + s.records, 0);

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <RefreshCw className="w-5 h-5 text-brand-600" />
              <h1 className="text-xl font-bold text-slate-900">Sync History</h1>
            </div>
            <p className="text-sm text-slate-500">All import and sync activity across connected platforms</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary"><Download className="w-4 h-4" />Export Logs</Button>
            <Button><RefreshCw className="w-4 h-4" />Trigger Sync</Button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Records", value: totalRecords.toLocaleString(), icon: Activity, color: "text-brand-600 bg-brand-50" },
            { label: "Successful", value: totalSuccess.toLocaleString(), icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
            { label: "Failed", value: totalFailed.toLocaleString(), icon: AlertCircle, color: "text-red-600 bg-red-50" },
            { label: "Sync Events", value: syncHistory.length, icon: Zap, color: "text-violet-600 bg-violet-50" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-slate-100 rounded-xl p-4 shadow-card flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color.split(" ")[1])}>
                <Icon className={cn("w-5 h-5", color.split(" ")[0])} />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="input-field pl-9 h-9" placeholder="Search by source..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1.5">
            {[
              { id: "all", label: "All" },
              { id: "completed", label: "✓ Completed" },
              { id: "partial", label: "⚠ Partial" },
              { id: "failed", label: "✗ Failed" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  filter === id ? "bg-brand-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                )}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Sync log table */}
        <Card padding={false}>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-5 py-3 text-left table-header">Source</th>
                <th className="px-5 py-3 text-left table-header">Type</th>
                <th className="px-5 py-3 text-left table-header">Timestamp</th>
                <th className="px-5 py-3 text-left table-header">Records</th>
                <th className="px-5 py-3 text-left table-header">Success</th>
                <th className="px-5 py-3 text-left table-header">Failed</th>
                <th className="px-5 py-3 text-left table-header">Status</th>
                <th className="px-5 py-3 text-left table-header">By</th>
                <th className="px-5 py-3 text-left table-header">Duration</th>
                <th className="px-5 py-3 text-left table-header w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sync) => {
                const status = statusConfig[sync.status];
                const StatusIcon = status.icon;
                return (
                  <>
                    <tr
                      key={sync.id}
                      className="table-row cursor-pointer"
                      onClick={() => setExpanded(expanded === sync.id ? null : sync.id)}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                          <span className="text-sm font-medium text-slate-800">{sync.source}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded", typeColors[sync.type] ?? "bg-slate-100 text-slate-600")}>{sync.type}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Clock className="w-3 h-3 text-slate-400" />{sync.timestamp}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-slate-800">{sync.records.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className="text-sm font-semibold text-emerald-600">{sync.success.toLocaleString()}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={cn("text-sm font-semibold", sync.failed > 0 ? "text-red-500" : "text-slate-400")}>{sync.failed}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={cn("flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border w-fit", status.color)}>
                          <StatusIcon className="w-3 h-3" />{status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-600">{sync.initiatedBy}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{sync.duration}</span>
                      </td>
                      <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="View Details">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {sync.status !== "completed" && (
                            <button className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors" title="Retry">
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expanded === sync.id && (
                      <tr key={`${sync.id}-detail`} className="bg-slate-50">
                        <td colSpan={10} className="px-5 py-4">
                          <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-2">
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Sync Details</p>
                              <div className="space-y-1.5">
                                {[
                                  { label: "Sync ID", value: sync.id },
                                  { label: "Records Processed", value: `${sync.records} total · ${sync.success} success · ${sync.failed} failed` },
                                  { label: "Success Rate", value: `${sync.records > 0 ? Math.round((sync.success / sync.records) * 100) : 0}%` },
                                ].map(({ label, value }) => (
                                  <div key={label} className="flex gap-3">
                                    <span className="text-xs text-slate-500 w-32 shrink-0">{label}</span>
                                    <span className="text-xs font-medium text-slate-700">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {sync.failed > 0 && (
                              <div className="col-span-2">
                                <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2">Error Summary</p>
                                <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                                  <p className="text-xs text-red-700">{sync.failed} record(s) failed to sync. Common causes: invalid email format, missing required fields, API rate limit exceeded.</p>
                                  <button className="text-xs text-red-600 font-medium mt-2 hover:underline">View error details →</button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </MainLayout>
  );
}
