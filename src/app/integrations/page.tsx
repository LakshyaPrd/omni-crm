"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { integrations } from "@/lib/data";
import {
  Mail, MessageCircle, Linkedin, Phone, Video, Calendar,
  Database, Cloud, Hash, Cpu, Search, PlugZap, CheckCircle,
  AlertCircle, ExternalLink,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Mail, MessageCircle, Linkedin, Phone, Video, Calendar,
  Database, Cloud, Hash, Cpu, Search,
};

const categoryColors: Record<string, string> = {
  Email: "bg-blue-100 text-blue-700",
  Messaging: "bg-emerald-100 text-emerald-700",
  Social: "bg-sky-100 text-sky-700",
  SMS: "bg-amber-100 text-amber-700",
  Meetings: "bg-violet-100 text-violet-700",
  CRM: "bg-pink-100 text-pink-700",
  Notifications: "bg-orange-100 text-orange-700",
  AI: "bg-indigo-100 text-indigo-700",
  Data: "bg-teal-100 text-teal-700",
};

const categories = ["All", "Email", "Messaging", "Social", "SMS", "Meetings", "CRM", "AI", "Data", "Notifications"];

export default function IntegrationsPage() {
  const [connectedMap, setConnectedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(integrations.map((i) => [i.id, i.connected]))
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = integrations.filter((i) => {
    const matchCat = activeCategory === "All" || i.category === activeCategory;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const connectedCount = Object.values(connectedMap).filter(Boolean).length;

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Integrations</h1>
            <p className="text-sm text-slate-500 mt-0.5">{connectedCount} of {integrations.length} connected</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Connected", value: connectedCount, icon: "✅", color: "text-emerald-600" },
            { label: "Available", value: integrations.length - connectedCount, icon: "🔌", color: "text-slate-600" },
            { label: "Categories", value: 9, icon: "📦", color: "text-brand-600" },
            { label: "API Calls Today", value: "12.4K", icon: "⚡", color: "text-violet-600" },
          ].map((s) => (
            <Card key={s.label} className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="input-field pl-9 h-9" placeholder="Search integrations..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === cat ? "bg-brand-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Integration cards grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((integ) => {
            const Icon = iconMap[integ.icon] ?? PlugZap;
            const connected = connectedMap[integ.id];
            return (
              <Card key={integ.id} className="hover:shadow-card-md transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 text-sm">{integ.name}</h3>
                      {connected && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                    </div>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${categoryColors[integ.category] ?? "bg-slate-100 text-slate-600"}`}>
                      {integ.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{integ.description}</p>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${connected ? "text-emerald-600" : "text-slate-400"}`}>
                    <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                    {connected ? "Connected" : "Not connected"}
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    {connected && (
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => setConnectedMap((prev) => ({ ...prev, [integ.id]: !prev[integ.id] }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        connected
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-brand-600 text-white hover:bg-brand-700"
                      }`}
                    >
                      {connected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
