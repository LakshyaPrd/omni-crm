"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { conversations } from "@/lib/data";
import { getChannelColor } from "@/lib/utils";
import {
  Search, Filter, Mail, MessageCircle, Linkedin, Phone,
  Send, Paperclip, Sparkles, MoreHorizontal, Star,
  Archive, Trash2, RefreshCw, ChevronDown, Bot, X,
  Hash, AtSign, Smile,
} from "lucide-react";

const channelIcons: Record<string, React.ElementType> = {
  email: Mail, whatsapp: MessageCircle, linkedin: Linkedin, sms: Hash,
};

const mockMessages = [
  { id: 1, from: "them", text: "Hi, I got your email about the CRM platform. Looks interesting!", time: "10:12 AM", channel: "email" },
  { id: 2, from: "me", text: "Hey Alex! Great to hear from you. I'd love to learn more about what you're looking for in a CRM.", time: "10:15 AM", channel: "email" },
  { id: 3, from: "them", text: "We're mainly looking to automate our outreach. Our team spends way too much time on manual follow-ups.", time: "10:18 AM", channel: "email" },
  { id: 4, from: "me", text: "Totally understand – that's exactly what NexCRM was built for. Our automation sequences handle multi-channel follow-ups. Would love to show you a demo.", time: "10:22 AM", channel: "email" },
  { id: 5, from: "them", text: "That sounds great! Can we do a call next Tuesday?", time: "10:24 AM", channel: "email" },
];

const aiSuggestions = [
  "Sure! I'm available Tuesday at 2 PM or 4 PM EST. Which works better for you?",
  "Absolutely! Let me send you a Calendly link to book a time that works.",
  "Great idea! Here's our demo booking link: calendly.com/nexcrm. Looking forward to it!",
];

const avatarColors = ["bg-blue-500","bg-pink-500","bg-violet-500","bg-teal-500","bg-orange-500","bg-emerald-500"];

export default function InboxPage() {
  const [activeConv, setActiveConv] = useState(conversations[0]);
  const [message, setMessage] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  return (
    <div className="fixed inset-0 pt-14 pl-60 flex bg-slate-50">
      {/* Conversations List */}
      <div className="w-72 bg-white border-r border-slate-100 flex flex-col shrink-0">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900">Inbox</h2>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><RefreshCw className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><Filter className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input className="input-field pl-8 h-8 text-xs" placeholder="Search conversations..." />
          </div>
        </div>

        {/* Channel filters */}
        <div className="flex gap-1 px-3 py-2 border-b border-slate-100 overflow-x-auto scrollbar-thin">
          {[
            { id: "all", label: "All" },
            { id: "email", label: "Email", icon: Mail },
            { id: "whatsapp", label: "WA", icon: MessageCircle },
            { id: "linkedin", label: "LI", icon: Linkedin },
            { id: "sms", label: "SMS", icon: Hash },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === id ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {Icon && <Icon className="w-3 h-3" />}{label}
            </button>
          ))}
        </div>

        {/* Conversation items */}
        <div className="flex-1 overflow-y-auto">
          {conversations
            .filter((c) => filter === "all" || c.channel === filter)
            .map((conv, i) => {
              const Icon = channelIcons[conv.channel] ?? Mail;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConv(conv)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-slate-50 ${activeConv.id === conv.id ? "bg-brand-50" : "hover:bg-slate-50"}`}
                >
                  <div className="relative shrink-0">
                    <Avatar initials={conv.avatar} color={avatarColors[i % avatarColors.length]} size="sm" />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center ${getChannelColor(conv.channel)} border border-white`}>
                      <Icon className="w-2 h-2" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-xs font-semibold truncate ${conv.unread ? "text-slate-900" : "text-slate-600"}`}>{conv.contact}</span>
                      <span className="text-xs text-slate-400 shrink-0 ml-1">{conv.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{conv.company}</p>
                    <p className={`text-xs truncate mt-0.5 ${conv.unread ? "text-slate-700 font-medium" : "text-slate-400"}`}>{conv.preview}</p>
                  </div>
                  {conv.unread && <div className="w-2 h-2 rounded-full bg-brand-600 shrink-0 mt-1.5" />}
                </div>
              );
            })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="h-14 bg-white border-b border-slate-100 flex items-center px-5 gap-4 shrink-0">
          <Avatar initials={activeConv.avatar} color={avatarColors[0]} size="sm" />
          <div>
            <div className="text-sm font-semibold text-slate-900">{activeConv.contact}</div>
            <div className="text-xs text-slate-500">{activeConv.company} · via {activeConv.channel}</div>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <button className="btn-ghost text-xs"><Star className="w-3.5 h-3.5" /></button>
            <button className="btn-ghost text-xs"><Archive className="w-3.5 h-3.5" /></button>
            <button className="btn-ghost text-xs"><MoreHorizontal className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {mockMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
              {msg.from === "them" && <Avatar initials={activeConv.avatar} color={avatarColors[0]} size="xs" className="mr-2 mt-1 shrink-0" />}
              <div
                className={`max-w-[60%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.from === "me"
                    ? "bg-brand-600 text-white rounded-tr-sm"
                    : "bg-white border border-slate-100 text-slate-800 rounded-tl-sm shadow-card"
                }`}
              >
                {msg.text}
                <div className={`text-xs mt-1 ${msg.from === "me" ? "text-brand-200" : "text-slate-400"}`}>{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Suggestions */}
        {aiOpen && (
          <div className="mx-4 mb-2 bg-gradient-to-r from-brand-50 to-violet-50 border border-brand-100 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                <Bot className="w-3.5 h-3.5" />AI Suggestions
              </div>
              <button onClick={() => setAiOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="space-y-1.5">
              {aiSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setMessage(s); setAiOpen(false); }}
                  className="w-full text-left text-xs text-slate-700 bg-white rounded-lg px-3 py-2 hover:bg-brand-50 hover:text-brand-700 transition-colors border border-slate-100"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composer */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0">
          <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all">
            <textarea
              className="w-full px-4 pt-3 pb-2 text-sm text-slate-900 placeholder-slate-400 bg-white resize-none focus:outline-none"
              rows={3}
              placeholder={`Reply to ${activeConv.contact}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex items-center justify-between px-3 pb-2.5">
              <div className="flex items-center gap-0.5">
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><Paperclip className="w-4 h-4" /></button>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><AtSign className="w-4 h-4" /></button>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><Smile className="w-4 h-4" /></button>
                <button
                  onClick={() => setAiOpen(!aiOpen)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 text-brand-600 text-xs font-medium hover:bg-brand-100 transition-colors ml-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />AI Reply
                </button>
              </div>
              <Button size="sm" disabled={!message.trim()}>
                <Send className="w-3.5 h-3.5" />Send
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: Lead details */}
      <div className="w-64 bg-white border-l border-slate-100 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Contact Info</p>
          <div className="text-center">
            <Avatar initials={activeConv.avatar} color={avatarColors[0]} size="lg" className="mx-auto mb-2" />
            <p className="font-semibold text-slate-900 text-sm">{activeConv.contact}</p>
            <p className="text-xs text-slate-500">{activeConv.company}</p>
          </div>
        </div>

        <div className="p-4 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Details</p>
          <div className="space-y-2">
            {[
              { label: "Channel", value: activeConv.channel },
              { label: "Status", value: "Qualified" },
              { label: "Score", value: "88/100" },
              { label: "Campaign", value: "SaaS Q3" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-xs font-medium text-slate-700">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Quick Actions</p>
          <div className="space-y-1.5">
            <button className="w-full text-left text-xs px-3 py-2 rounded-lg bg-brand-50 text-brand-700 font-medium hover:bg-brand-100 transition-colors">📅 Schedule Meeting</button>
            <button className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">➕ Add to Campaign</button>
            <button className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">📝 Add Note</button>
            <button className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">🏷 Update Status</button>
          </div>
        </div>
      </div>
    </div>
  );
}
