"use client";
import { useState } from "react";
import {
  Mail, MessageCircle, Linkedin, Phone, Zap, Calendar,
  Plus, UserCheck, RefreshCw, Star, MoreHorizontal,
  FileText, ChevronDown, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type QuickAction =
  | "email" | "whatsapp" | "linkedin" | "call" | "campaign"
  | "schedule" | "note" | "assign" | "enrich" | "sync" | "star";

interface Action {
  id: QuickAction;
  label: string;
  icon: React.ElementType;
  color: string;
  shortcut?: string;
}

const ACTIONS: Action[] = [
  { id: "email",    label: "Send Email",      icon: Mail,          color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",      shortcut: "E" },
  { id: "whatsapp", label: "WhatsApp",         icon: MessageCircle, color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100", shortcut: "W" },
  { id: "linkedin", label: "LinkedIn",         icon: Linkedin,      color: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",           shortcut: "L" },
  { id: "call",     label: "Call",             icon: Phone,         color: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100", shortcut: "C" },
  { id: "campaign", label: "Add to Campaign",  icon: Zap,           color: "bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100",    shortcut: "A" },
  { id: "schedule", label: "Schedule",         icon: Calendar,      color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100" },
  { id: "note",     label: "Add Note",         icon: FileText,      color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
  { id: "assign",   label: "Assign Owner",     icon: UserCheck,     color: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200" },
  { id: "enrich",   label: "Enrich Lead",      icon: Star,          color: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100" },
  { id: "sync",     label: "Sync Again",       icon: RefreshCw,     color: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100" },
];

interface QuickActionToolbarProps {
  /** IDs to show. Defaults to top 6. */
  show?: QuickAction[];
  /** Compact: icon-only buttons */
  compact?: boolean;
  /** Size variant */
  size?: "sm" | "md";
  onAction?: (action: QuickAction) => void;
  className?: string;
}

export function QuickActionToolbar({
  show = ["email", "whatsapp", "linkedin", "call", "campaign", "schedule"],
  compact = false,
  size = "md",
  onAction,
  className,
}: QuickActionToolbarProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const visible = ACTIONS.filter((a) => show.includes(a.id));
  const overflow = ACTIONS.filter((a) => !show.includes(a.id));

  const btn = (a: Action) => (
    <button
      key={a.id}
      title={`${a.label}${a.shortcut ? ` (${a.shortcut})` : ""}`}
      onClick={() => onAction?.(a.id)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border font-medium transition-all duration-150",
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-xs",
        compact ? "justify-center" : "",
        a.color
      )}
    >
      <a.icon className={size === "sm" ? "w-3 h-3 shrink-0" : "w-3.5 h-3.5 shrink-0"} />
      {!compact && <span>{a.label}</span>}
    </button>
  );

  return (
    <div className={cn("flex items-center flex-wrap gap-1.5 relative", className)}>
      {visible.map(btn)}

      {overflow.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              "inline-flex items-center gap-1 rounded-xl border bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 font-medium transition-colors",
              size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-xs"
            )}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
            {!compact && <span>More</span>}
            <ChevronDown className="w-3 h-3" />
          </button>

          {moreOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-100 rounded-xl shadow-card-lg z-50 py-1.5 animate-fade-in">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 mb-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">More actions</span>
                <button onClick={() => setMoreOpen(false)}><X className="w-3.5 h-3.5 text-slate-400" /></button>
              </div>
              {overflow.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { onAction?.(a.id); setMoreOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <a.icon className="w-3.5 h-3.5 text-slate-400" />
                  {a.label}
                  {a.shortcut && <kbd className="ml-auto text-slate-300 border border-slate-200 rounded px-1 text-xs">{a.shortcut}</kbd>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
