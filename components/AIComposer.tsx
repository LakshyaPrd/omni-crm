"use client";
import { useState } from "react";
import { Sparkles, Send, RefreshCw, ChevronDown, Zap } from "lucide-react";
import type { Channel } from "@/lib/mockData";
import ChannelBadge from "./ChannelBadge";
import clsx from "clsx";

const CHANNELS: Channel[] = ["whatsapp", "email", "linkedin", "sms"];

const AI_SUGGESTIONS = [
  "Thanks for reaching out about the LinkedIn integration, Priya! Yes — we support both InMail and connection request threads, and they all flow into the same unified timeline. For onboarding, most teams are fully live within 48 hours. Want me to send over our quick-start guide?",
  "Hi Priya! Great question. Our LinkedIn integration covers InMails, connection messages, and comment threads. Onboarding is handled by a dedicated specialist and typically takes 1–2 business days. Should I book a slot with our team?",
];

export default function AIComposer({ leadId }: { leadId: string }) {
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [draft, setDraft] = useState(AI_SUGGESTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [channelOpen, setChannelOpen] = useState(false);
  const [sent, setSent] = useState(false);

  function regenerate() {
    setLoading(true);
    setTimeout(() => {
      setDraft(AI_SUGGESTIONS[1]);
      setLoading(false);
    }, 900);
  }

  function handleSend() {
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }

  return (
    <div className="rounded-xl border border-ai/30 bg-ai-subtle overflow-hidden glow-ai">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ai/20">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-ai/20 flex items-center justify-center">
            <Sparkles size={11} className="text-ai" />
          </div>
          <span className="text-xs font-display font-600 text-ai">AI Draft</span>
          <span className="text-[9px] font-mono text-ai/60 bg-ai/10 px-1.5 py-0.5 rounded-full uppercase">
            context-aware
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={regenerate}
            className="flex items-center gap-1 text-[11px] text-ai/70 hover:text-ai px-2 py-1 rounded-md hover:bg-ai/10 transition-colors"
          >
            <RefreshCw size={10} className={clsx(loading && "animate-spin")} />
            Regenerate
          </button>
        </div>
      </div>

      {/* Draft area */}
      <div className="px-4 py-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          className="w-full bg-transparent text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none leading-relaxed"
          placeholder="AI draft will appear here..."
        />
      </div>

      {/* Send bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-ai/20 gap-3">
        {/* Channel selector */}
        <div className="relative">
          <button
            onClick={() => setChannelOpen(!channelOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-elevated border border-border text-xs text-text-secondary hover:text-text-primary hover:border-border-light transition-colors"
          >
            <ChannelBadge channel={channel} showLabel size="sm" />
            <ChevronDown size={10} className={clsx("transition-transform", channelOpen && "rotate-180")} />
          </button>
          {channelOpen && (
            <div className="absolute bottom-full mb-1 left-0 bg-elevated border border-border rounded-lg overflow-hidden z-10 animate-slide-in min-w-[120px]">
              {CHANNELS.map((ch) => (
                <button
                  key={ch}
                  onClick={() => { setChannel(ch); setChannelOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 w-full hover:bg-border transition-colors"
                >
                  <ChannelBadge channel={ch} size="sm" />
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSend}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-600 font-display transition-all",
            sent
              ? "bg-success/20 text-success border border-success/30"
              : "bg-ai text-base hover:bg-ai-dim active:scale-95"
          )}
        >
          {sent ? (
            <><Zap size={12} /> Sent!</>
          ) : (
            <><Send size={12} /> Send via {channel}</>
          )}
        </button>
      </div>
    </div>
  );
}
