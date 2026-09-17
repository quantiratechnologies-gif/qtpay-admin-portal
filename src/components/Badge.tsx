import React from "react";

interface BadgeProps {
  status: string;
  text?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, text }) => {
  const displayLabel = text || status.replace(/_/g, " ").toUpperCase();
  
  let bg = "bg-slate-800/60";
  let color = "text-slate-400";
  let border = "border-slate-700/60";
  let dot = "bg-slate-400";

  if (["active", "settled", "completed", "verified", "low"].includes(status.toLowerCase())) {
    bg = "bg-emerald-500/10";
    color = "text-emerald-400";
    border = "border-emerald-500/25";
    dot = "bg-emerald-400";
  } else if (["pending", "pending_kyb", "processing", "scheduled", "medium", "action_required"].includes(status.toLowerCase())) {
    bg = "bg-amber-500/10";
    color = "text-amber-400";
    border = "border-amber-500/25";
    dot = "bg-amber-400";
  } else if (["failed", "suspended", "blacklisted", "rejected", "critical", "high", "flagged"].includes(status.toLowerCase())) {
    bg = "bg-red-500/10";
    color = "text-red-400";
    border = "border-red-500/25";
    dot = "bg-red-400";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-0.5 rounded-md border ${bg} ${color} ${border} uppercase tracking-wider`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {displayLabel}
    </span>
  );
};
