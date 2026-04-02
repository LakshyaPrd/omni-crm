"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { analyticsData, campaignPerformance } from "@/lib/data";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import { Download, Calendar, Filter, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";

const topCampaigns = [
  { name: "SaaS Founders Q3", opens: 42.3, replies: 18.7, conv: 8.2 },
  { name: "Startup Accelerator", opens: 51.2, replies: 22.5, conv: 11.4 },
  { name: "DevTools Cold", opens: 38.1, replies: 14.2, conv: 6.8 },
  { name: "Re-engagement Aug", opens: 28.4, replies: 9.1, conv: 3.2 },
];

const radarData = [
  { metric: "Open Rate", value: 82 }, { metric: "Reply Rate", value: 68 },
  { metric: "Click Rate", value: 74 }, { metric: "Conversion", value: 61 },
  { metric: "Deliverability", value: 95 }, { metric: "AI Score", value: 88 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("30d");

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Reports & Analytics</h1>
            <p className="text-sm text-slate-500 mt-0.5">Comprehensive performance insights</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
              {["7d","30d","90d","YTD"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${period === p ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button variant="secondary"><Calendar className="w-4 h-4" />Custom Range</Button>
            <Button variant="secondary"><Filter className="w-4 h-4" />Filter</Button>
            <Button><Download className="w-4 h-4" />Export</Button>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Avg Open Rate", value: "43.8%", change: "+5.2%", up: true },
            { label: "Avg Reply Rate", value: "17.4%", change: "+3.1%", up: true },
            { label: "Conversion Rate", value: "6.8%", change: "+1.2%", up: true },
            { label: "Emails Sent", value: "38,200", change: "+22%", up: true },
          ].map((k) => (
            <Card key={k.label}>
              <div className="text-xs text-slate-500 mb-1">{k.label}</div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{k.value}</div>
              <div className={`flex items-center gap-1 text-xs font-medium ${k.up ? "text-emerald-600" : "text-red-500"}`}>
                {k.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {k.change} vs previous period
              </div>
            </Card>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Open rates trend */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Open Rate Trend</CardTitle>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5" />+5.2% this period</span>
              </CardHeader>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={analyticsData.openRates} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip formatter={(v: number) => [`${v}%`, "Open Rate"]} contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: 12 }} />
                  <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2.5} fill="url(#openGrad)" dot={{ fill: "#6366f1", strokeWidth: 0, r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Radar / Health */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Health</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#cbd5e1" }} />
                <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Reply rate */}
          <Card>
            <CardHeader>
              <CardTitle>Reply Rate by Week</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={analyticsData.replyRates} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip formatter={(v: number) => [`${v}%`, "Reply Rate"]} contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: 12 }} />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", strokeWidth: 0, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Conversions */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Conversions</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={analyticsData.conversions} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: 12 }} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Top campaigns table */}
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Top Performing Campaigns</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-5 py-3 text-left table-header">Campaign</th>
                <th className="px-5 py-3 text-left table-header">Open Rate</th>
                <th className="px-5 py-3 text-left table-header">Reply Rate</th>
                <th className="px-5 py-3 text-left table-header">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {topCampaigns.map((camp) => (
                <tr key={camp.name} className="table-row">
                  <td className="px-5 py-3 text-sm font-medium text-slate-800">{camp.name}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${camp.opens}%` }} />
                      </div>
                      <span className="text-xs font-medium text-slate-700">{camp.opens}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${camp.replies * 3}%` }} />
                      </div>
                      <span className="text-xs font-medium text-slate-700">{camp.replies}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${camp.conv * 8}%` }} />
                      </div>
                      <span className="text-xs font-medium text-slate-700">{camp.conv}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </MainLayout>
  );
}
