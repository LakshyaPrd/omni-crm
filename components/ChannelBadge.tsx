import clsx from "clsx";
import type { Channel } from "@/lib/mockData";

const labels: Record<Channel, string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  linkedin: "LinkedIn",
  sms: "SMS",
  outreach: "Outreach",
};

const icons: Record<Channel, string> = {
  email: "✉",
  whatsapp: "💬",
  linkedin: "in",
  sms: "📱",
  outreach: "⚡",
};

interface Props {
  channel: Channel;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export default function ChannelBadge({ channel, showLabel = true, size = "sm" }: Props) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border font-mono font-500 uppercase tracking-wide",
        `ch-${channel}`,
        size === "sm" ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-1"
      )}
    >
      <span className={size === "sm" ? "text-[9px]" : "text-[10px]"}>{icons[channel]}</span>
      {showLabel && labels[channel]}
    </span>
  );
}
