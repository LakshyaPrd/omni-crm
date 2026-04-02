import { cn } from "@/lib/utils";

interface Activity {
  id: number;
  type: string;
  icon: string;
  label: string;
  detail: string;
  time: string;
  user: string;
  channel: string;
}

const channelColors: Record<string, string> = {
  email: "bg-blue-100 text-blue-700",
  linkedin: "bg-sky-100 text-sky-700",
  whatsapp: "bg-emerald-100 text-emerald-700",
  calendly: "bg-violet-100 text-violet-700",
  apollo: "bg-indigo-100 text-indigo-700",
  internal: "bg-slate-100 text-slate-600",
};

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-100" />

      <div className="space-y-4">
        {activities.map((act, i) => (
          <div key={act.id} className="flex gap-4 relative">
            {/* Icon bubble */}
            <div className="w-12 h-12 shrink-0 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-base z-10 shadow-sm">
                {act.icon}
              </div>
            </div>

            {/* Content */}
            <div className={cn("flex-1 bg-white border border-slate-100 rounded-xl p-3.5 shadow-card", "hover:border-slate-200 transition-colors")}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-800">{act.label}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", channelColors[act.channel] ?? "bg-slate-100 text-slate-600")}>
                    {act.channel}
                  </span>
                  <span className="text-xs text-slate-400">{act.time}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{act.detail}</p>
              <p className="text-xs text-slate-400 mt-1.5">by {act.user}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
