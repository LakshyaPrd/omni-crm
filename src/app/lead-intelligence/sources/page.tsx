"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { leadSources } from "@/lib/leadIntelligenceData";
import {
  Telescope, CheckCircle, AlertCircle, RefreshCw, Settings2, FileText,
  Zap, Mail, MessageCircle, Phone, Search, Bot, AtSign, Linkedin,
  ExternalLink, AlertTriangle, Activity, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Linkedin, Bot, Search, Mail, Zap, MessageCircle, Phone, AtSign, Activity,
};

const healthColor = (h: number) => h >= 90 ? "text-emerald-600" : h >= 70 ? "text-amber-600" : "text-red-500";
const healthBg = (h: number) => h >= 90 ? "bg-emerald-500" : h >= 70 ? "bg-amber-500" : "bg-red-500";

export default function LeadSourcesPage() {
  const [connectedMap, setConnectedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(leadSources.map((s) => [s.id, s.connected]))
  );

  const totalRecords = leadSources.reduce((sum, s) => sum + s.recordsSynced, 0);
  const connectedCount = Object.values(connectedMap).filter(Boolean).length;

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Telescope className="w-5 h-5 text-brand-600" />
              <h1 className="text-xl font-bold text-slate-900">Lead Sources</h1>
            </div>
            <p className="text-sm text-slate-500">Manage 3rd-party integrations and data sync health</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary"><RefreshCw className="w-4 h-4" />Sync All</Button>
            <Button><Plus className="w-4 h-4" />Add Source</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Connected Sources", value: connectedCount, color: "text-emerald-600 bg-emerald-50", icon: CheckCircle },
            { label: "Total Records Synced", value: totalRecords.toLocaleString(), color: "text-brand-600 bg-brand-50", icon: Activity },
            { label: "Avg Sync Health", value: `${Math.round(leadSources.filter((s) => s.connected).reduce((a, s) => a + s.syncHealth, 0) / Math.max(connectedCount, 1))}%`, color: "text-violet-600 bg-violet-50", icon: Zap },
            { label: "Total Errors", value: leadSources.reduce((s, l) => s + l.errors, 0), color: "text-amber-600 bg-amber-50", icon: AlertTriangle },
          ].map(({ label, value, color, icon: Icon }) => (
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

        {/* Sources grid */}
        <div className="grid grid-cols-2 gap-4">
          {leadSources.map((source) => {
            const Icon = iconMap[source.icon] ?? Zap;
            const connected = connectedMap[source.id];
            return (
              <div key={source.id} className={cn("bg-white border rounded-2xl p-5 shadow-card transition-all", connected ? "border-slate-100" : "border-slate-100 opacity-75")}>
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0", source.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-slate-900">{source.name}</h3>
                      <div className={cn("flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                        connected ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", connected ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
                        {connected ? "Active" : "Disconnected"}
                      </div>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{source.category}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-500 mb-4 leading-relaxed">{source.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Records", value: source.recordsSynced.toLocaleString() },
                    { label: "Fields Mapped", value: source.fieldsMapped },
                    { label: "Errors", value: source.errors },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-2.5 text-center">
                      <div className={cn("text-base font-black", label === "Errors" && source.errors > 0 ? "text-red-500" : "text-slate-900")}>{value}</div>
                      <div className="text-xs text-slate-400">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Sync health */}
                {connected && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">Sync Health</span>
                      <span className={cn("font-bold", healthColor(source.syncHealth))}>{source.syncHealth}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", healthBg(source.syncHealth))} style={{ width: `${source.syncHealth}%` }} />
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Last sync: {source.lastSync}</div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setConnectedMap((p) => ({ ...p, [source.id]: !p[source.id] }))}
                    className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                      connected ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-brand-600 text-white hover:bg-brand-700"
                    )}
                  >
                    {connected ? "Disconnect" : "Connect"}
                  </button>
                  {connected && (
                    <>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">
                        <RefreshCw className="w-3 h-3" />Sync Now
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">
                        <Settings2 className="w-3 h-3" />Field Map
                      </button>
                      {source.errors > 0 && (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
                          <FileText className="w-3 h-3" />Errors ({source.errors})
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
