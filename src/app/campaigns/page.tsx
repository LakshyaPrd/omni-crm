"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { campaigns } from "@/lib/data";
import { getChannelColor } from "@/lib/utils";
import {
  Plus, Search, Zap, Mail, MessageCircle, Linkedin, Phone,
  Clock, ChevronDown, MoreHorizontal, Play, Pause, Eye,
  ArrowDown, Settings2, Sparkles, GripVertical, Trash2, X,
} from "lucide-react";

const channelIcons: Record<string, React.ElementType> = {
  email: Mail, whatsapp: MessageCircle, linkedin: Linkedin, call: Phone,
};
const channelLabels: Record<string, string> = {
  email: "Email", whatsapp: "WhatsApp", linkedin: "LinkedIn", call: "Call",
};

const defaultSteps = [
  { id: 1, type: "email", delay: "Day 0", subject: "Quick intro from {{sender}}", body: "Hi {{first_name}},\n\nI noticed you're leading growth at {{company}}..." },
  { id: 2, type: "linkedin", delay: "Day 2", subject: "LinkedIn Connection Request", body: "Hi {{first_name}}, I'd love to connect..." },
  { id: 3, type: "email", delay: "Day 5", subject: "Following up – {{company}} + us", body: "Hey {{first_name}},\n\nJust wanted to follow up on my previous email..." },
  { id: 4, type: "whatsapp", delay: "Day 8", subject: "WhatsApp message", body: "Hi {{first_name}}! Did you get a chance to check out my email?" },
  { id: 5, type: "call", delay: "Day 12", subject: "Discovery Call", body: "Schedule a 15-min call to discuss how we can help {{company}}." },
];

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState<"list" | "builder">("list");
  const [builderSteps, setBuilderSteps] = useState(defaultSteps);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const removeStep = (id: number) => setBuilderSteps((prev) => prev.filter((s) => s.id !== id));

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Campaigns</h1>
            <p className="text-sm text-slate-500 mt-0.5">{campaigns.length} campaigns</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
              {(["list","builder"] as const).map((t) => (
                <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 font-medium capitalize transition-colors ${activeTab === t ? "bg-brand-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                  {t === "builder" ? "🔧 Builder" : "📋 List"}
                </button>
              ))}
            </div>
            <Button><Plus className="w-4 h-4" />New Campaign</Button>
          </div>
        </div>

        {activeTab === "list" ? (
          /* Campaign List */
          <div className="space-y-3">
            {campaigns.map((camp) => (
              <Card key={camp.id} className="hover:shadow-card-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 text-sm">{camp.name}</h3>
                      <StatusBadge status={camp.status} />
                    </div>
                    <div className="flex items-center gap-1">
                      {camp.channel.map((ch) => {
                        const Icon = channelIcons[ch];
                        return (
                          <span key={ch} className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${getChannelColor(ch)}`}>
                            <Icon className="w-3 h-3" />{channelLabels[ch]}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-center">
                    {[
                      { label: "Leads", value: camp.leads.toLocaleString() },
                      { label: "Sent", value: camp.sent.toLocaleString() },
                      { label: "Open Rate", value: camp.sent > 0 ? `${camp.openRate}%` : "—" },
                      { label: "Reply Rate", value: camp.sent > 0 ? `${camp.replyRate}%` : "—" },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className="text-sm font-bold text-slate-900">{value}</div>
                        <div className="text-xs text-slate-500">{label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    {camp.status === "active" ? (
                      <button className="btn-ghost text-xs"><Pause className="w-3.5 h-3.5" />Pause</button>
                    ) : camp.status === "paused" ? (
                      <button className="btn-ghost text-xs"><Play className="w-3.5 h-3.5" />Resume</button>
                    ) : null}
                    <button className="btn-ghost text-xs" onClick={() => setActiveTab("builder")}>
                      <Eye className="w-3.5 h-3.5" />View
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Campaign Builder */
          <div className="grid grid-cols-5 gap-4 h-[calc(100vh-180px)]">
            {/* Sequence Canvas */}
            <div className="col-span-3 overflow-y-auto">
              <Card className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Sequence Builder</h3>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm"><Settings2 className="w-3.5 h-3.5" />Settings</Button>
                    <Button size="sm"><Play className="w-3.5 h-3.5" />Launch</Button>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-0 relative">
                  {/* Start node */}
                  <div className="flex flex-col items-center mb-1">
                    <div className="w-32 py-2 bg-brand-600 rounded-lg flex items-center justify-center gap-2 text-white text-xs font-semibold">
                      <Zap className="w-3.5 h-3.5" />Trigger: New Lead
                    </div>
                    <div className="w-px h-5 bg-slate-200" />
                  </div>

                  {builderSteps.map((step, i) => {
                    const Icon = channelIcons[step.type] ?? Mail;
                    const color = {
                      email: "border-blue-200 bg-blue-50",
                      whatsapp: "border-emerald-200 bg-emerald-50",
                      linkedin: "border-sky-200 bg-sky-50",
                      call: "border-violet-200 bg-violet-50",
                    }[step.type] ?? "border-slate-200 bg-white";
                    const iconColor = {
                      email: "text-blue-600", whatsapp: "text-emerald-600",
                      linkedin: "text-sky-600", call: "text-violet-600",
                    }[step.type] ?? "text-slate-600";

                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        {/* Delay badge */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                          <Clock className="w-3 h-3" />{step.delay}
                          <ChevronDown className="w-3 h-3" />
                        </div>
                        {/* Step card */}
                        <div
                          onClick={() => setSelectedStep(step.id === selectedStep ? null : step.id)}
                          className={`w-full max-w-sm border-2 rounded-xl p-3 cursor-pointer transition-all ${color} ${selectedStep === step.id ? "ring-2 ring-brand-400 ring-offset-2" : "hover:shadow-sm"}`}
                        >
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                            <div className={`w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
                              <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-slate-800 capitalize">{channelLabels[step.type]}</div>
                              <div className="text-xs text-slate-500 truncate">{step.subject}</div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeStep(step.id); }}
                              className="p-1 rounded hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        {i < builderSteps.length - 1 && (
                          <div className="flex flex-col items-center my-1">
                            <div className="w-px h-4 bg-slate-200" />
                            <ArrowDown className="w-3.5 h-3.5 text-slate-300" />
                            <div className="w-px h-4 bg-slate-200" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add step */}
                  <div className="flex flex-col items-center mt-3">
                    <div className="w-px h-4 bg-slate-200" />
                    <div className="flex gap-2 flex-wrap justify-center">
                      {Object.entries(channelIcons).map(([type, Icon]) => (
                        <button
                          key={type}
                          onClick={() => setBuilderSteps((prev) => [...prev, { id: Date.now(), type, delay: "Day +3", subject: `New ${channelLabels[type]}`, body: "" }])}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:shadow-sm ${getChannelColor(type)} border-current/20`}
                        >
                          <Icon className="w-3.5 h-3.5" />+{channelLabels[type]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Step Editor Panel */}
            <div className="col-span-2">
              {selectedStep ? (
                <Card className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800">Edit Step</h3>
                    <button onClick={() => setSelectedStep(null)} className="p-1 rounded hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
                  </div>
                  {(() => {
                    const step = builderSteps.find((s) => s.id === selectedStep);
                    if (!step) return null;
                    return (
                      <div className="space-y-4 flex-1">
                        <div>
                          <label className="text-xs font-semibold text-slate-600 block mb-1.5">Delay</label>
                          <select className="input-field text-sm">
                            {["Immediately","Day 1","Day 2","Day 3","Day 5","Day 7","Day 10","Day 14"].map((d) => (
                              <option key={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 block mb-1.5">Subject / Title</label>
                          <input className="input-field text-sm" defaultValue={step.subject} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-slate-600">Message</label>
                            <button className="flex items-center gap-1 text-xs text-brand-600 font-medium hover:text-brand-700">
                              <Sparkles className="w-3 h-3" />AI Generate
                            </button>
                          </div>
                          <textarea
                            className="input-field text-sm resize-none"
                            rows={8}
                            defaultValue={step.body}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 block mb-1.5">Variables</label>
                          <div className="flex flex-wrap gap-1.5">
                            {["{{first_name}}","{{company}}","{{sender}}","{{title}}"].map((v) => (
                              <button key={v} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-brand-50 hover:text-brand-600 transition-colors font-mono">{v}</button>
                            ))}
                          </div>
                        </div>
                        <Button className="w-full">Save Step</Button>
                      </div>
                    );
                  })()}
                </Card>
              ) : (
                <Card className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-3">
                    <Settings2 className="w-6 h-6 text-brand-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Select a step to edit</p>
                  <p className="text-xs text-slate-400">Click on any step in the sequence to configure it</p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
