"use client";
import { useState } from "react";
import {
  Mail, MessageCircle, Linkedin, Hash, Send, Paperclip,
  Smile, AtSign, Bot, Sparkles, X, Check, CheckCheck,
  Clock, Download, Image as ImageIcon,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SourceBadge } from "./SourceBadge";
import { cn } from "@/lib/utils";

export type ConvChannel = "email" | "whatsapp" | "linkedin" | "sms" | "call";

export interface ConvMessage {
  id: string | number;
  from: "me" | "them";
  sender: string;
  senderAvatar?: string;
  senderColor?: string;
  text: string;
  time: string;
  read?: boolean;
  attachments?: { name: string; size: string; type: "pdf" | "image" | "doc" }[];
  status?: "sent" | "delivered" | "read";
}

export interface ConvChannel_Data {
  channel: ConvChannel;
  messages: ConvMessage[];
  lastMessage?: string;
  unread?: number;
}

const channelConfig: Record<ConvChannel, {
  Icon: React.ElementType;
  label: string;
  color: string;
  bubbleMe: string;
  bubbleThem: string;
}> = {
  email:    { Icon: Mail,           label: "Email",    color: "bg-blue-500",    bubbleMe: "bg-brand-600 text-white", bubbleThem: "bg-white border border-slate-200 text-slate-800" },
  whatsapp: { Icon: MessageCircle,  label: "WhatsApp", color: "bg-emerald-500", bubbleMe: "bg-emerald-600 text-white", bubbleThem: "bg-emerald-50 border border-emerald-200 text-slate-800" },
  linkedin: { Icon: Linkedin,       label: "LinkedIn", color: "bg-sky-600",     bubbleMe: "bg-sky-600 text-white", bubbleThem: "bg-sky-50 border border-sky-200 text-slate-800" },
  sms:      { Icon: Hash,           label: "SMS",      color: "bg-violet-500",  bubbleMe: "bg-violet-600 text-white", bubbleThem: "bg-slate-100 border border-slate-200 text-slate-800" },
  call:     { Icon: Linkedin,       label: "Call Log", color: "bg-rose-500",    bubbleMe: "bg-rose-50 text-rose-800", bubbleThem: "bg-slate-50 text-slate-700" },
};

const aiSuggestions: Record<ConvChannel, string[]> = {
  email:    ["Sure! I'm available Tuesday at 2 PM or 4 PM EST.", "Happy to schedule a call — here's my Calendly link.", "Thanks for your interest! Let me send you our case study."],
  whatsapp: ["Hi! Yes, that works for me 👍", "Let me check my calendar and get back to you!", "Perfect — talk soon! 🙌"],
  linkedin: ["Thanks for the connection! Happy to connect and share more.", "Would love to learn more about your goals — open to a quick chat?", "Appreciate the response! Let's schedule something."],
  sms:      ["Sounds good! I'll confirm the details via email.", "Got it — I'll follow up shortly.", "Perfect, speak then!"],
  call:     ["Follow-up email sent with demo recording.", "Meeting notes added to CRM.", "Next step: proposal to be sent by EOD."],
};

interface ConversationThreadProps {
  channels: ConvChannel_Data[];
  contactName: string;
  contactAvatar?: string;
  contactColor?: string;
  ownerAvatar?: string;
  ownerName?: string;
  className?: string;
}

export function ConversationThread({
  channels,
  contactName,
  contactAvatar = "CT",
  contactColor = "bg-brand-500",
  ownerAvatar = "ME",
  ownerName = "You",
  className,
}: ConversationThreadProps) {
  const [active, setActive] = useState<ConvChannel>(channels[0]?.channel ?? "email");
  const [message, setMessage] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [internalNote, setInternalNote] = useState(false);

  const activeCfg = channelConfig[active];
  const activeData = channels.find((c) => c.channel === active);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessage("");
    setAiOpen(false);
  };

  return (
    <div className={cn("bg-white border border-slate-100 rounded-xl overflow-hidden shadow-card flex", className)} style={{ height: 560 }}>
      {/* ── Left: channel selector ── */}
      <div className="w-44 border-r border-slate-100 flex flex-col">
        <div className="px-3 py-3 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Channels</p>
        </div>
        <div className="flex-1 overflow-y-auto py-1.5 px-2 space-y-0.5">
          {channels.map((ch) => {
            const cfg = channelConfig[ch.channel];
            const isActive = active === ch.channel;
            return (
              <button
                key={ch.channel}
                onClick={() => setActive(ch.channel)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left transition-all",
                  isActive ? "bg-brand-50 border border-brand-200" : "hover:bg-slate-50 border border-transparent"
                )}
              >
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", cfg.color)}>
                  <cfg.Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-xs font-semibold truncate", isActive ? "text-brand-700" : "text-slate-700")}>{cfg.label}</div>
                  <div className="text-xs text-slate-400 truncate">{ch.messages.length} msgs</div>
                </div>
                {ch.unread ? (
                  <span className="w-4 h-4 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold shrink-0">{ch.unread}</span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Internal notes toggle */}
        <div className="p-2 border-t border-slate-100">
          <button
            onClick={() => setInternalNote(!internalNote)}
            className={cn(
              "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors",
              internalNote ? "bg-amber-50 text-amber-700 border border-amber-200" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <div className="w-5 h-5 rounded bg-amber-100 flex items-center justify-center">📝</div>
            Internal Notes
          </button>
        </div>
      </div>

      {/* ── Center: message thread ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Thread header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", activeCfg.color)}>
            <activeCfg.Icon className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-800">{contactName}</span>
          <span className="text-xs text-slate-400">via {activeCfg.label}</span>
          <div className="ml-auto flex items-center gap-1">
            {internalNote && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">📝 Note mode</span>}
            <span className="text-xs text-slate-400">{activeData?.messages.length ?? 0} messages</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {activeData?.messages.map((msg) => (
            <div key={msg.id} className={cn("flex items-end gap-2", msg.from === "me" ? "justify-end" : "justify-start")}>
              {msg.from === "them" && (
                <Avatar
                  initials={contactAvatar}
                  color={contactColor}
                  size="xs"
                  className="shrink-0 mb-0.5"
                />
              )}
              <div className={cn("flex flex-col", msg.from === "me" ? "items-end" : "items-start", "max-w-[68%]")}>
                <span className={cn("text-xs mb-1 font-medium", msg.from === "me" ? "text-slate-400" : "text-slate-500")}>
                  {msg.from === "me" ? ownerName : msg.sender}
                </span>
                <div className={cn(
                  "px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.from === "me" ? cn(activeCfg.bubbleMe, "rounded-br-sm") : cn(activeCfg.bubbleThem, "rounded-bl-sm"),
                  internalNote && msg.from === "me" ? "bg-amber-50 text-amber-900 border border-amber-200" : ""
                )}>
                  {msg.text}

                  {/* Attachments */}
                  {msg.attachments?.map((att, i) => (
                    <div key={i} className="mt-2 flex items-center gap-2 bg-black/10 rounded-lg px-3 py-1.5">
                      <Paperclip className="w-3 h-3 shrink-0" />
                      <span className="text-xs truncate flex-1">{att.name}</span>
                      <span className="text-xs opacity-70">{att.size}</span>
                      <Download className="w-3 h-3 shrink-0 cursor-pointer" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className={cn("text-xs", msg.from === "me" ? "text-slate-400" : "text-slate-400")}>{msg.time}</span>
                  {msg.from === "me" && msg.status && (
                    msg.status === "read" ? <CheckCheck className="w-3 h-3 text-emerald-500" /> :
                    msg.status === "delivered" ? <CheckCheck className="w-3 h-3 text-slate-400" /> :
                    <Check className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </div>
              {msg.from === "me" && (
                <Avatar initials={ownerAvatar} color="bg-brand-600" size="xs" className="shrink-0 mb-0.5" />
              )}
            </div>
          ))}

          {(!activeData || activeData.messages.length === 0) && (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <activeCfg.Icon className="w-8 h-8 text-slate-200 mb-2" />
              <p className="text-sm text-slate-400">No {activeCfg.label} messages yet</p>
              <p className="text-xs text-slate-300 mt-1">Start a conversation below</p>
            </div>
          )}
        </div>

        {/* AI suggestions */}
        {aiOpen && (
          <div className="mx-3 mb-2 bg-gradient-to-r from-brand-50 to-violet-50 border border-brand-100 rounded-xl p-3 animate-slide-in-up">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                <Bot className="w-3.5 h-3.5" />AI Suggested Replies
              </div>
              <button onClick={() => setAiOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="space-y-1.5">
              {(aiSuggestions[active] ?? []).map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setMessage(s); setAiOpen(false); }}
                  className="w-full text-left text-xs text-slate-700 bg-white rounded-lg px-3 py-2 hover:bg-brand-50 hover:text-brand-700 transition-colors border border-slate-100 shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composer */}
        <div className={cn("p-3 border-t border-slate-100 shrink-0", internalNote && "bg-amber-50/50")}>
          {internalNote && (
            <div className="text-xs text-amber-600 font-medium mb-2 flex items-center gap-1">
              📝 Writing internal note — not sent externally
            </div>
          )}
          <div className={cn("border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all",
            internalNote ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"
          )}>
            <textarea
              className={cn("w-full px-3.5 pt-2.5 pb-1.5 text-sm resize-none focus:outline-none", internalNote ? "bg-amber-50 text-amber-900 placeholder-amber-400" : "bg-white text-slate-900 placeholder-slate-400")}
              rows={2}
              placeholder={internalNote ? "Write a note visible only to your team..." : `Reply via ${activeCfg.label}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend(); }}
            />
            <div className="flex items-center justify-between px-3 pb-2">
              <div className="flex items-center gap-0.5">
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors" title="Attach file"><Paperclip className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors" title="Emoji"><Smile className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors" title="Mention"><AtSign className="w-3.5 h-3.5" /></button>
                {!internalNote && (
                  <button
                    onClick={() => setAiOpen(!aiOpen)}
                    className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ml-0.5",
                      aiOpen ? "bg-brand-100 text-brand-700" : "bg-brand-50 text-brand-600 hover:bg-brand-100"
                    )}
                  >
                    <Sparkles className="w-3 h-3" />AI Reply
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 hidden sm:block">⌘ + Enter to send</span>
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                    message.trim() ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                >
                  <Send className="w-3.5 h-3.5" />
                  {internalNote ? "Save Note" : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: AI suggestions panel (static) ── */}
      <div className="w-44 border-l border-slate-100 flex flex-col bg-slate-50/60">
        <div className="px-3 py-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-brand-500" />
            <p className="text-xs font-semibold text-slate-700">AI Context</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
          <div className="bg-white rounded-xl border border-brand-100 p-3">
            <div className="text-xs font-semibold text-brand-700 mb-1.5">Intent Signals</div>
            {[
              { label: "Opened email", count: "3×" },
              { label: "Clicked link", count: "1×" },
              { label: "Replied fast", count: "✓" },
            ].map(({ label, count }) => (
              <div key={label} className="flex items-center justify-between text-xs py-0.5">
                <span className="text-slate-600">{label}</span>
                <span className="font-semibold text-emerald-600">{count}</span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-3">
            <div className="text-xs font-semibold text-slate-700 mb-1.5">Last Note</div>
            <p className="text-xs text-slate-500 leading-relaxed">Budget confirmed for Q2. High intent to purchase.</p>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Quick Templates</div>
            {["Intro message", "Follow-up", "Demo invite", "Pricing info"].map((t) => (
              <button key={t} onClick={() => setMessage(`[Template: ${t}]`)}
                className="w-full text-left text-xs text-brand-600 hover:bg-brand-50 px-2 py-1.5 rounded-lg transition-colors mb-0.5">
                + {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
