import { cn } from "@/lib/utils";
import type { LeadSource } from "@/lib/leadIntelligenceData";

const sourceConfig: Record<LeadSource, { label: string; color: string; dot: string }> = {
  linkedin:    { label: "LinkedIn",    color: "bg-sky-100 text-sky-800 border-sky-200",         dot: "bg-sky-500" },
  salesrobot:  { label: "SalesRobot", color: "bg-violet-100 text-violet-800 border-violet-200", dot: "bg-violet-500" },
  apollo:      { label: "Apollo",      color: "bg-indigo-100 text-indigo-800 border-indigo-200", dot: "bg-indigo-500" },
  smartlead:   { label: "Smartlead",  color: "bg-blue-100 text-blue-800 border-blue-200",       dot: "bg-blue-500" },
  instantly:   { label: "Instantly",  color: "bg-amber-100 text-amber-800 border-amber-200",    dot: "bg-amber-500" },
  whatsapp:    { label: "WhatsApp",   color: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500" },
  calling:     { label: "Calling",    color: "bg-rose-100 text-rose-800 border-rose-200",       dot: "bg-rose-500" },
  email:       { label: "Email",      color: "bg-orange-100 text-orange-800 border-orange-200", dot: "bg-orange-500" },
  csv:         { label: "CSV Import", color: "bg-slate-100 text-slate-700 border-slate-200",    dot: "bg-slate-400" },
  manual:      { label: "Manual",     color: "bg-gray-100 text-gray-700 border-gray-200",       dot: "bg-gray-400" },
};

interface SourceBadgeProps {
  source: LeadSource;
  size?: "sm" | "md";
  showDot?: boolean;
}

export function SourceBadge({ source, size = "sm", showDot = true }: SourceBadgeProps) {
  const config = sourceConfig[source] ?? sourceConfig.manual;
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 font-medium border rounded-full",
      size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1",
      config.color
    )}>
      {showDot && <span className={cn("rounded-full shrink-0", size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2", config.dot)} />}
      {config.label}
    </span>
  );
}
