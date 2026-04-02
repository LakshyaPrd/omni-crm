import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
}

const variantMap = {
  default: "bg-slate-100 text-slate-600 border-slate-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  purple: "bg-violet-50 text-violet-700 border-violet-200",
};

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "badge border",
        variantMap[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  const colorMap: Record<string, string> = {
    new: "info",
    contacted: "warning",
    qualified: "success",
    replied: "purple",
    lost: "danger",
    active: "success",
    paused: "warning",
    draft: "default",
    completed: "info",
    prospect: "purple",
    applied: "info",
    screening: "warning",
    interview: "purple",
    offer: "success",
    hired: "success",
    rejected: "danger",
    inactive: "default",
  } as const;

  return (
    <Badge variant={(colorMap[status] as any) ?? "default"}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
      {label}
    </Badge>
  );
}
