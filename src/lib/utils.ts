import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    new: "bg-blue-50 text-blue-700 border-blue-200",
    contacted: "bg-amber-50 text-amber-700 border-amber-200",
    qualified: "bg-emerald-50 text-emerald-700 border-emerald-200",
    replied: "bg-violet-50 text-violet-700 border-violet-200",
    lost: "bg-red-50 text-red-700 border-red-200",
    converted: "bg-green-50 text-green-700 border-green-200",
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    paused: "bg-amber-50 text-amber-700 border-amber-200",
    draft: "bg-slate-100 text-slate-600 border-slate-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    prospect: "bg-violet-50 text-violet-700 border-violet-200",
    applied: "bg-blue-50 text-blue-700 border-blue-200",
    screening: "bg-amber-50 text-amber-700 border-amber-200",
    interview: "bg-violet-50 text-violet-700 border-violet-200",
    offer: "bg-emerald-50 text-emerald-700 border-emerald-200",
    hired: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    inactive: "bg-slate-100 text-slate-500 border-slate-200",
  };
  return map[status] ?? "bg-slate-100 text-slate-600 border-slate-200";
}

export function getChannelColor(channel: string) {
  const map: Record<string, string> = {
    email: "bg-blue-100 text-blue-700",
    whatsapp: "bg-emerald-100 text-emerald-700",
    linkedin: "bg-sky-100 text-sky-700",
    sms: "bg-amber-100 text-amber-700",
    call: "bg-violet-100 text-violet-700",
  };
  return map[channel] ?? "bg-slate-100 text-slate-600";
}
