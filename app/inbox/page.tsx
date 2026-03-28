"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChannelBadge from "@/components/ChannelBadge";
import StageBadge from "@/components/StageBadge";
import { leads, messages } from "@/lib/mockData";
import type { Channel } from "@/lib/mockData";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import clsx from "clsx";

const CHANNEL_FILTERS: { value: Channel | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "sms", label: "SMS" },
];

export default function InboxPage() {
  const [activeChannel, setActiveChannel] = useState<Channel | "all">("all");
  const [selectedLead, setSelectedLead] = useState(leads[0]);
  const [query, setQuery] = useState("");

  // Get last message per lead
  const inboxItems = leads.map((lead) => {
    const lastMsg = messages.filter((m) => m.leadId === lead.id).at(-1);
    return { lead, lastMsg };
  }).filter(({ lastMsg }) => !lastMsg || activeChannel === "all" || lastMsg.channel === activeChannel);

  const filtered = inboxItems.filter(({ lead }) =>
    lead.name.toLowerCase().includes(query.toLowerCase()) ||
    lead.company.toLowerCase().includes(query.toLowerCase())
  );

  const threadMsgs = messages.filter((m) => m.leadId === selectedLead.id);

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar />

      {/* Inbox list */}
      <div className="w-80 shrink-0 border-r border-border bg-surface flex flex-col">
        <div className="px-4 pt-5 pb-3 border-b border-border">
          <h1 className="font-display font-700 text-base text-text-primary mb-3">Unified Inbox</h1>
          <div className="relative mb-3">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-elevated border border-border rounded-lg pl-7 pr-3 py-2 text-[12px] text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          {/* Channel filter tabs */}
          <div className="flex gap-1 flex-wrap">
            {CHANNEL_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveChannel(value)}
                className={clsx(
                  "px-2.5 py-1 text-[10px] font-mono rounded-md transition-all",
                  activeChannel === value
                    ? "bg-accent-subtle text-accent border border-accent/25"
                    : "text-text-secondary hover:text-text-primary hover:bg-elevated border border-transparent"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Lead list */}
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {filtered.map(({ lead, lastMsg }) => (
            <button
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={clsx(
                "w-full text-left px-4 py-3.5 transition-colors",
                selectedLead.id === lead.id ? "bg-accent-subtle" : "hover:bg-elevated"
              )}
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-elevated border border-border flex items-center justify-center text-[11px] font-display font-700 text-text-secondary shrink-0">
                  {lead.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={clsx("text-[12px] font-medium truncate", selectedLead.id === lead.id ? "text-accent" : "text-text-primary")}>
                      {lead.name}
                    </span>
                    <span className="text-[9px] font-mono text-text-muted shrink-0 ml-1">{lead.lastTouchedAt}</span>
                  </div>
                  {lastMsg && (
                    <p className="text-[11px] text-text-secondary truncate">
                      {lastMsg.direction === "outbound" ? "You: " : ""}{lastMsg.body.slice(0, 50)}…
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <StageBadge stage={lead.stage} />
                    {lastMsg && <ChannelBadge channel={lastMsg.channel} showLabel={false} size="sm" />}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Thread view */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Thread header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent-subtle border border-accent/30 flex items-center justify-center text-sm font-display font-700 text-accent">
              {selectedLead.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-600 text-sm text-text-primary">{selectedLead.name}</h2>
                <StageBadge stage={selectedLead.stage} />
              </div>
              <p className="text-[11px] text-text-secondary">{selectedLead.title} · {selectedLead.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedLead.channels.map((ch) => (
              <ChannelBadge key={ch} channel={ch} size="md" />
            ))}
            <Link
              href={`/leads/${selectedLead.id}`}
              className="text-[11px] text-accent hover:text-text-primary border border-accent/30 hover:border-accent/60 px-3 py-1.5 rounded-lg transition-all ml-2"
            >
              View Profile →
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {threadMsgs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-text-muted text-sm">
              No messages yet for this lead.
            </div>
          ) : (
            threadMsgs.map((msg) => {
              const isOut = msg.direction === "outbound";
              return (
                <div key={msg.id} className={clsx("flex gap-3", isOut && "flex-row-reverse")}>
                  <div className={clsx(
                    "w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-display font-700 mt-0.5",
                    isOut ? "bg-accent-subtle text-accent border border-accent/30" : "bg-elevated text-text-secondary border border-border"
                  )}>
                    {isOut ? "Y" : selectedLead.avatar[0]}
                  </div>
                  <div className={clsx("max-w-[70%] space-y-1.5", isOut && "items-end flex flex-col")}>
                    <div className={clsx(
                      "rounded-2xl px-4 py-3 text-[13px] leading-relaxed",
                      isOut ? "bg-accent-subtle border border-accent/20 text-text-primary rounded-tr-sm" : "bg-elevated border border-border text-text-primary rounded-tl-sm"
                    )}>
                      {msg.body}
                    </div>
                    <div className={clsx("flex items-center gap-2", isOut && "flex-row-reverse")}>
                      <ChannelBadge channel={msg.channel} size="sm" />
                      <span className="text-[10px] text-text-muted font-mono">{msg.sentAt}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick reply bar */}
        <div className="px-6 py-4 border-t border-border bg-surface">
          <div className="flex items-end gap-3">
            <textarea
              rows={2}
              placeholder="Type a reply... or let AI draft one"
              className="flex-1 bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-accent/40 transition-colors"
            />
            <div className="flex flex-col gap-2 shrink-0">
              <button className="px-4 py-2 bg-ai/20 border border-ai/30 text-ai text-[11px] font-600 font-display rounded-lg hover:bg-ai/30 transition-colors">
                ✦ AI Draft
              </button>
              <button className="px-4 py-2 bg-accent text-base text-[11px] font-600 font-display rounded-lg hover:bg-accent-dim transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
