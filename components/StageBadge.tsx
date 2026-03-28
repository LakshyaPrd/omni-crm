import clsx from "clsx";
import type { LeadStage } from "@/lib/mockData";

const labels: Record<LeadStage, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

export default function StageBadge({ stage }: { stage: LeadStage }) {
  return (
    <span className={clsx("text-[10px] font-mono font-500 px-2 py-0.5 rounded-full uppercase tracking-wide", `stage-${stage}`)}>
      {labels[stage]}
    </span>
  );
}
