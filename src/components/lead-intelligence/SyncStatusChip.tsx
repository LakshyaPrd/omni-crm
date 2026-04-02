import { cn } from "@/lib/utils";
import { CheckCircle, Clock, AlertCircle, AlertTriangle } from "lucide-react";

type SyncStatus = "synced" | "pending" | "failed" | "partial";

const config: Record<SyncStatus, { label: string; color: string; Icon: React.ElementType }> = {
  synced:  { label: "Synced",  color: "text-emerald-600 bg-emerald-50", Icon: CheckCircle },
  pending: { label: "Pending", color: "text-amber-600 bg-amber-50",     Icon: Clock },
  failed:  { label: "Failed",  color: "text-red-600 bg-red-50",         Icon: AlertCircle },
  partial: { label: "Partial", color: "text-orange-600 bg-orange-50",   Icon: AlertTriangle },
};

export function SyncStatusChip({ status }: { status: SyncStatus }) {
  const { label, color, Icon } = config[status];
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full", color)}>
      <Icon className="w-3 h-3" />{label}
    </span>
  );
}
