import { messages } from "@/lib/mockData";
import ChannelBadge from "./ChannelBadge";
import clsx from "clsx";

export default function ConversationTimeline({ leadId }: { leadId: string }) {
  const thread = messages.filter((m) => m.leadId === leadId);

  return (
    <div className="flex flex-col gap-4">
      {thread.map((msg) => {
        const isOut = msg.direction === "outbound";
        return (
          <div key={msg.id} className={clsx("flex gap-3", isOut && "flex-row-reverse")}>
            {/* Avatar */}
            <div className={clsx(
              "w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-display font-700 mt-0.5",
              isOut ? "bg-accent-subtle text-accent border border-accent/30" : "bg-elevated text-text-secondary border border-border"
            )}>
              {isOut ? "Y" : "P"}
            </div>

            {/* Bubble */}
            <div className={clsx("max-w-[78%] space-y-1.5", isOut && "items-end flex flex-col")}>
              <div className={clsx(
                "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                isOut
                  ? "bg-accent-subtle border border-accent/20 text-text-primary rounded-tr-sm"
                  : "bg-elevated border border-border text-text-primary rounded-tl-sm"
              )}>
                {msg.body}
              </div>
              <div className={clsx("flex items-center gap-2", isOut && "flex-row-reverse")}>
                <ChannelBadge channel={msg.channel} size="sm" />
                <span className="text-[10px] text-text-muted font-mono">{msg.sentAt}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
