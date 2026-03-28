"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Plug, Bell, Shield, Palette, Key,
  CheckCircle2, Circle, ChevronRight,
} from "lucide-react";
import clsx from "clsx";

const CHANNEL_INTEGRATIONS = [
  { id: "email", label: "Email (Mailgun / SendGrid)", desc: "Inbound & outbound email via webhooks", connected: true, color: "#818cf8" },
  { id: "whatsapp", label: "WhatsApp (Meta Cloud API)", desc: "WhatsApp Business messaging", connected: true, color: "#34d399" },
  { id: "linkedin", label: "LinkedIn Messaging API", desc: "InMail + connection thread sync", connected: false, color: "#60a5fa" },
  { id: "sms", label: "SMS (Twilio)", desc: "Two-way SMS for leads", connected: false, color: "#fbbf24" },
  { id: "outreach", label: "Outreach.io Webhook", desc: "Pull leads from sequences", connected: true, color: "#fb923c" },
];

const SECTIONS = [
  { id: "integrations", icon: Plug, label: "Integrations" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "security", icon: Shield, label: "Security & Access" },
  { id: "ai", icon: Key, label: "AI & API Keys" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("integrations");
  const [integrations, setIntegrations] = useState(
    Object.fromEntries(CHANNEL_INTEGRATIONS.map((c) => [c.id, c.connected]))
  );
  const [notifications, setNotifications] = useState({
    newLead: true, inboundMsg: true, aiDraft: false, dailySummary: true, weeklyReport: false,
  });
  const [aiModel, setAiModel] = useState("claude-sonnet-4-20250514");
  const [apiKey, setApiKey] = useState("sk-ant-•••••••••••••••••••••••••••••••••••••");

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar />
      <main className="flex-1 overflow-y-auto grid-bg">
        <div className="max-w-4xl mx-auto px-8 py-8 animate-fade-in">
          <h1 className="font-display text-2xl font-700 text-text-primary tracking-tight mb-8">Settings</h1>

          <div className="flex gap-6">
            {/* Left nav */}
            <div className="w-48 shrink-0">
              <nav className="space-y-0.5">
                {SECTIONS.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setActive(id)}
                    className={clsx(
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all text-left",
                      active === id
                        ? "bg-accent-subtle text-accent border border-accent/20"
                        : "text-text-secondary hover:text-text-primary hover:bg-elevated"
                    )}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">

              {/* Integrations */}
              {active === "integrations" && (
                <div className="bg-surface border border-border rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="font-display font-700 text-base text-text-primary">Channel Integrations</h2>
                    <p className="text-xs text-text-secondary mt-0.5">Connect channels to unify all lead conversations</p>
                  </div>
                  <div className="divide-y divide-border">
                    {CHANNEL_INTEGRATIONS.map((ch) => (
                      <div key={ch.id} className="flex items-center gap-4 px-6 py-4">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-700 shrink-0"
                          style={{ background: ch.color + "18", color: ch.color, border: `1px solid ${ch.color}33` }}
                        >
                          {ch.id.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">{ch.label}</p>
                          <p className="text-[11px] text-text-secondary">{ch.desc}</p>
                        </div>
                        <button
                          onClick={() => setIntegrations((p) => ({ ...p, [ch.id]: !p[ch.id] }))}
                          className={clsx(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-600 font-display border transition-all",
                            integrations[ch.id]
                              ? "bg-success/10 text-success border-success/25 hover:bg-success/20"
                              : "bg-elevated text-text-secondary border-border hover:border-border-light hover:text-text-primary"
                          )}
                        >
                          {integrations[ch.id] ? (
                            <><CheckCircle2 size={11} /> Connected</>
                          ) : (
                            <><Circle size={11} /> Connect</>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications */}
              {active === "notifications" && (
                <div className="bg-surface border border-border rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="font-display font-700 text-base text-text-primary">Notification Preferences</h2>
                    <p className="text-xs text-text-secondary mt-0.5">Choose what triggers alerts for you</p>
                  </div>
                  <div className="divide-y divide-border">
                    {Object.entries({
                      newLead: "New lead created",
                      inboundMsg: "Inbound message received",
                      aiDraft: "AI draft ready for review",
                      dailySummary: "Daily activity summary",
                      weeklyReport: "Weekly performance report",
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between px-6 py-4">
                        <p className="text-sm text-text-primary">{label}</p>
                        <button
                          onClick={() => setNotifications((p) => ({ ...p, [key]: !p[key as keyof typeof notifications] }))}
                          className={clsx(
                            "w-10 h-5 rounded-full transition-colors relative shrink-0",
                            notifications[key as keyof typeof notifications] ? "bg-accent" : "bg-elevated border border-border"
                          )}
                        >
                          <span className={clsx(
                            "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                            notifications[key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0.5"
                          )} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security */}
              {active === "security" && (
                <div className="space-y-4">
                  <div className="bg-surface border border-border rounded-xl p-6">
                    <h2 className="font-display font-700 text-base text-text-primary mb-4">Access Control</h2>
                    <div className="space-y-3">
                      {[
                        { role: "Admin", desc: "Full access to all companies and settings", count: 1 },
                        { role: "Manager", desc: "Can view and edit leads, cannot change settings", count: 3 },
                        { role: "Agent", desc: "Can view leads and send messages only", count: 8 },
                      ].map(({ role, desc, count }) => (
                        <div key={role} className="flex items-center justify-between p-3 bg-elevated rounded-lg border border-border">
                          <div>
                            <p className="text-sm font-medium text-text-primary">{role}</p>
                            <p className="text-[11px] text-text-secondary">{desc}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-text-muted">{count} users</span>
                            <ChevronRight size={12} className="text-text-muted" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-surface border border-border rounded-xl p-6">
                    <h2 className="font-display font-700 text-base text-text-primary mb-1">Row-Level Security</h2>
                    <p className="text-xs text-text-secondary mb-4">Each company's data is isolated at the database level. Agents only see leads from their assigned company workspace.</p>
                    <div className="flex items-center gap-2 text-[11px] text-success bg-success/10 border border-success/20 px-3 py-2 rounded-lg w-fit">
                      <CheckCircle2 size={12} /> RLS enforced on all tables
                    </div>
                  </div>
                </div>
              )}

              {/* AI & API Keys */}
              {active === "ai" && (
                <div className="space-y-4">
                  <div className="bg-surface border border-border rounded-xl p-6">
                    <h2 className="font-display font-700 text-base text-text-primary mb-4">AI Configuration</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-wide text-text-muted block mb-2">Model</label>
                        <select
                          value={aiModel}
                          onChange={(e) => setAiModel(e.target.value)}
                          className="w-full bg-elevated border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent/40 transition-colors"
                        >
                          <option value="claude-sonnet-4-20250514">Claude Sonnet 4 (Recommended)</option>
                          <option value="claude-opus-4-6">Claude Opus 4.6 (Highest quality)</option>
                          <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 (Fastest)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-wide text-text-muted block mb-2">Anthropic API Key</label>
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="w-full bg-elevated border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary font-mono focus:outline-none focus:border-accent/40 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-wide text-text-muted block mb-2">AI Context window</label>
                        <p className="text-xs text-text-secondary mb-2">Number of past messages to include when generating AI replies</p>
                        <select className="bg-elevated border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent/40 transition-colors">
                          <option>Last 10 messages</option>
                          <option>Last 20 messages</option>
                          <option>Full conversation</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="bg-ai-subtle border border-ai/20 rounded-xl p-5">
                    <p className="text-[11px] font-mono text-ai/70 uppercase tracking-wide mb-1">How AI context works</p>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      When a lead sends a message, the AI reads the <code className="text-ai/80 bg-ai/10 px-1 py-0.5 rounded text-[10px]">AI_CONTEXT_SNAPSHOT</code> for that lead — a running summary of all past conversations across every channel — and uses it to craft a relevant, contextual reply draft. The snapshot is updated automatically after every message.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
