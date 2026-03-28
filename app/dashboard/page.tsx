import Sidebar from "@/components/Sidebar";
import ChannelBadge from "@/components/ChannelBadge";
import { dashboardStats, leads } from "@/lib/mockData";
import StageBadge from "@/components/StageBadge";
import Link from "next/link";
import { TrendingUp, Users, Zap, Clock, ArrowUpRight, Activity } from "lucide-react";

const statCards = [
  { label: "Total Leads", value: dashboardStats.totalLeads, icon: Users, delta: "+12%", color: "text-accent" },
  { label: "Active Today", value: dashboardStats.activeToday, icon: Activity, delta: "+5", color: "text-ai" },
  { label: "AI Drafts Accepted", value: `${dashboardStats.aiDraftsAccepted}%`, icon: Zap, delta: "+3%", color: "text-success" },
  { label: "Avg Response", value: dashboardStats.avgResponseTime, icon: Clock, delta: "-0.8m", color: "text-warning" },
];

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar />
      <main className="flex-1 overflow-y-auto grid-bg">
        <div className="max-w-5xl mx-auto px-8 py-8 space-y-8 animate-fade-in">
          {/* Header */}
          <div>
            <h1 className="font-display text-2xl font-700 text-text-primary tracking-tight">Dashboard</h1>
            <p className="text-sm text-text-secondary mt-1">Monday, your pipeline is healthy with 7 new messages.</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4">
            {statCards.map(({ label, value, icon: Icon, delta, color }) => (
              <div key={label} className="bg-surface border border-border rounded-xl p-4 hover:border-border-light transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-elevated flex items-center justify-center ${color}`}>
                    <Icon size={15} />
                  </div>
                  <span className="text-[10px] font-mono text-success bg-success/10 px-1.5 py-0.5 rounded-full">{delta}</span>
                </div>
                <p className="font-display text-2xl font-700 text-text-primary">{value}</p>
                <p className="text-[11px] text-text-secondary mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Recent leads */}
            <div className="col-span-2 bg-surface border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-display font-600 text-sm text-text-primary">Recent Leads</h2>
                <Link href="/leads" className="text-[11px] text-accent hover:text-text-primary flex items-center gap-1 transition-colors">
                  View all <ArrowUpRight size={10} />
                </Link>
              </div>
              <div className="divide-y divide-border">
                {leads.slice(0, 5).map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-elevated transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent-subtle border border-accent/20 flex items-center justify-center text-[11px] font-display font-700 text-accent shrink-0">
                      {lead.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">{lead.name}</p>
                        <StageBadge stage={lead.stage} />
                      </div>
                      <p className="text-[11px] text-text-secondary truncate">{lead.title} · {lead.company}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {lead.channels.slice(0, 2).map((ch) => (
                        <ChannelBadge key={ch} channel={ch} showLabel={false} size="sm" />
                      ))}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-mono font-500 text-text-primary">{lead.score}</div>
                      <div className="text-[9px] text-text-muted">score</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Channel breakdown */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <h2 className="font-display font-600 text-sm text-text-primary mb-4">Channel Breakdown</h2>
                <div className="space-y-3">
                  {dashboardStats.channelBreakdown.map(({ channel, count, pct }) => (
                    <div key={channel}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-text-secondary">{channel}</span>
                        <span className="text-[11px] font-mono text-text-primary">{count}</span>
                      </div>
                      <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent/60 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity feed */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <h2 className="font-display font-600 text-sm text-text-primary mb-4">Live Activity</h2>
                <div className="space-y-3">
                  {dashboardStats.recentActivity.map((item) => (
                    <div key={item.id} className="flex items-start gap-2.5">
                      <ChannelBadge channel={item.channel} showLabel={false} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-text-primary font-medium truncate">{item.lead}</p>
                        <p className="text-[10px] text-text-secondary truncate">{item.action}</p>
                      </div>
                      <span className="text-[9px] font-mono text-text-muted shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
