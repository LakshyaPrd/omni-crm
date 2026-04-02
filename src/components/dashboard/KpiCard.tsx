import { TrendingUp, TrendingDown, Users, Zap, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Users, Zap, MessageSquare, TrendingUp,
};

interface KpiCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
}

export function KpiCard({ label, value, change, positive, icon }: KpiCardProps) {
  const Icon = iconMap[icon] ?? TrendingUp;
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-brand-600" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        <div className={cn("flex items-center gap-1 mt-1 text-xs font-medium", positive ? "text-emerald-600" : "text-red-500")}>
          {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{change}</span>
          <span className="text-slate-400 font-normal ml-0.5">vs last month</span>
        </div>
      </div>
    </div>
  );
}
