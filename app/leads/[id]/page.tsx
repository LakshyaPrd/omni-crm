import Sidebar from "@/components/Sidebar";
import ChannelBadge from "@/components/ChannelBadge";
import StageBadge from "@/components/StageBadge";
import ConversationTimeline from "@/components/ConversationTimeline";
import AIComposer from "@/components/AIComposer";
import { leads, channelIdentities, aiSnapshots } from "@/lib/mockData";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Brain, TrendingUp, MessageSquare,
  Globe, Sparkles, Target, AlertCircle,
} from "lucide-react";

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = leads.find((l) => l.id === params.id);
  if (!lead) notFound();

  const identities = channelIdentities[lead.id] || [];
  const snapshot = aiSnapshots[lead.id];

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar />
      <main className="flex-1 overflow-y-auto grid-bg">
        <div className="max-w-6xl mx-auto px-8 py-8 animate-fade-in">
          {/* Back */}
          <Link href="/leads" className="inline-flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-text-primary mb-5 transition-colors">
            <ArrowLeft size={12} /> Back to Leads
          </Link>

          {/* Lead header */}
          <div className="bg-surface border border-border rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-accent-subtle border border-accent/30 flex items-center justify-center text-lg font-display font-700 text-accent">
                  {lead.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="font-display text-xl font-700 text-text-primary">{lead.name}</h1>
                    <StageBadge stage={lead.stage} />
                  </div>
                  <p className="text-sm text-text-secondary">{lead.title} · {lead.company}</p>
                  <p className="text-xs text-text-muted font-mono mt-0.5">{lead.email}</p>
                  <div className="flex items-center gap-2 mt-3">
                    {lead.channels.map((ch) => (
                      <ChannelBadge key={ch} channel={ch} size="md" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-display font-700 text-success">{lead.score}</div>
                <p className="text-[11px] text-text-secondary">lead score</p>
                <p className="text-[10px] text-text-muted font-mono mt-1">Last touch: {lead.lastTouchedAt}</p>
              </div>
            </div>

            {/* Channel identities */}
            {identities.length > 0 && (
              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-3 flex items-center gap-1.5">
                  <Globe size={10} /> Channel identities
                </p>
                <div className="flex flex-wrap gap-2">
                  {identities.map((id) => (
                    <div key={id.channel} className="flex items-center gap-2 bg-elevated border border-border rounded-lg px-3 py-1.5">
                      <ChannelBadge channel={id.channel} showLabel={false} size="sm" />
                      <span className="text-[11px] font-mono text-text-secondary">{id.handle}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-[1fr_380px] gap-6">
            {/* Conversation timeline */}
            <div className="space-y-4">
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
                  <MessageSquare size={14} className="text-text-secondary" />
                  <h2 className="font-display font-600 text-sm text-text-primary">Conversation Timeline</h2>
                  <span className="text-[10px] font-mono text-text-muted bg-elevated px-1.5 py-0.5 rounded-full ml-auto">All channels merged</span>
                </div>
                <div className="p-5">
                  <ConversationTimeline leadId={lead.id} />
                </div>
              </div>

              {/* AI Composer */}
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2 flex items-center gap-1.5">
                  <Sparkles size={10} className="text-ai" /> AI-powered reply
                </p>
                <AIComposer leadId={lead.id} />
              </div>
            </div>

            {/* Right panel */}
            <div className="space-y-4">
              {/* AI Context Snapshot */}
              {snapshot && (
                <div className="bg-surface border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-ai-subtle/40">
                    <Brain size={13} className="text-ai" />
                    <h3 className="font-display font-600 text-sm text-ai">AI Context</h3>
                    <span className={`ml-auto text-[9px] font-mono px-2 py-0.5 rounded-full uppercase ${
                      snapshot.sentiment === "positive" ? "bg-success/10 text-success" :
                      snapshot.sentiment === "negative" ? "bg-danger/10 text-danger" :
                      "bg-text-muted/10 text-text-secondary"
                    }`}>{snapshot.sentiment}</span>
                  </div>
                  <div className="p-4 space-y-4">
                    <p className="text-[12px] text-text-secondary leading-relaxed">{snapshot.summary}</p>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">Key facts</p>
                      <ul className="space-y-1.5">
                        {snapshot.keyFacts.map((fact, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] text-text-secondary">
                            <span className="text-ai mt-0.5 shrink-0">·</span>
                            {fact}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-ai-subtle border border-ai/20 rounded-lg px-3 py-2.5">
                      <div className="flex items-start gap-2">
                        <Target size={11} className="text-ai mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] font-mono text-ai/70 uppercase tracking-wide mb-0.5">Next action</p>
                          <p className="text-[11px] text-text-primary leading-relaxed">{snapshot.nextAction}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-[9px] font-mono text-text-muted">Updated {snapshot.updatedAt}</p>
                  </div>
                </div>
              )}

              {/* Lead score breakdown */}
              <div className="bg-surface border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={13} className="text-accent" />
                  <h3 className="font-display font-600 text-sm text-text-primary">Score Breakdown</h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Engagement", val: 91 },
                    { label: "Intent signals", val: 84 },
                    { label: "Channel activity", val: 88 },
                    { label: "Response speed", val: 78 },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-text-secondary">{label}</span>
                        <span className="font-mono text-text-primary">{val}</span>
                      </div>
                      <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent/50"
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-surface border border-border rounded-xl p-4">
                <h3 className="font-display font-600 text-sm text-text-primary mb-3">Notes</h3>
                <textarea
                  rows={4}
                  placeholder="Add a note about this lead..."
                  className="w-full bg-elevated border border-border rounded-lg px-3 py-2.5 text-[12px] text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-accent/40 transition-colors leading-relaxed"
                />
                <button className="mt-2 text-[11px] text-accent hover:text-text-primary font-medium transition-colors">
                  Save note
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
