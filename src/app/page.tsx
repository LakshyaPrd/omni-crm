"use client";
import { MainLayout } from "@/components/layout/MainLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  kpiData, campaignPerformance, hiringFunnel, recentActivity,
} from "@/lib/data";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Plus, ArrowRight, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Welcome back, Emma! Here&apos;s what&apos;s happening.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary">
              <Activity className="w-4 h-4" />
              View Reports
            </Button>
            <Button>
              <Plus className="w-4 h-4" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpiData.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Campaign Performance */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">7D</Button>
                  <Button variant="ghost" size="sm">30D</Button>
                  <Button variant="secondary" size="sm">90D</Button>
                </div>
              </CardHeader>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={campaignPerformance} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="replied" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.07)" }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                  <Area type="monotone" dataKey="sent" stroke="#6366f1" strokeWidth={2} fill="url(#sent)" name="Sent" />
                  <Area type="monotone" dataKey="replied" stroke="#10b981" strokeWidth={2} fill="url(#replied)" name="Replied" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Hiring Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Hiring Funnel</CardTitle>
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardHeader>
            <div className="space-y-3">
              {hiringFunnel.map((stage, i) => {
                const pct = Math.round((stage.count / hiringFunnel[0].count) * 100);
                const colors = ["bg-brand-600", "bg-brand-500", "bg-brand-400", "bg-brand-300", "bg-brand-200"];
                return (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">{stage.stage}</span>
                      <span className="text-slate-500">{stage.count.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${colors[i]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Conversions Bar Chart */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Conversions</CardTitle>
              </CardHeader>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={campaignPerformance} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: 12 }} />
                  <Bar dataKey="converted" fill="#6366f1" radius={[4, 4, 0, 0]} name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <span className="text-xs text-brand-600 font-medium cursor-pointer hover:underline">View all</span>
            </CardHeader>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <Avatar initials={item.avatar} color={item.color} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <span className="font-semibold">{item.user}</span>{" "}
                      {item.action}
                      {item.target && <span className="text-brand-600"> {item.target}</span>}
                    </p>
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
