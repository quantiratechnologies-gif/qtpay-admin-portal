import React from "react";
import { useTranslation } from "../lib/i18n/LanguageContext";

interface BadgeProps {
  status: string;
  text?: string;
  lang?: "en" | "ar";
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, text }) => {
  const { translateStatus } = useTranslation();
  const displayLabel = text || translateStatus(status);

  const s = (status || "").toLowerCase();

  let bg = "bg-slate-800/60";
  let color = "text-slate-300";
  let border = "border-slate-700/60";
  let dot = "bg-slate-400";

  if (["active", "settled", "completed", "verified", "low", "online", "resolved"].includes(s)) {
    bg = "bg-emerald-500/10";
    color = "text-emerald-400";
    border = "border-emerald-500/20";
    dot = "bg-emerald-400";
  } else if (["pending", "pending_kyb", "processing", "scheduled", "medium", "held", "refunded"].includes(s)) {
    bg = "bg-amber-500/10";
    color = "text-amber-400";
    border = "border-amber-500/20";
    dot = "bg-amber-400";
  } else if (["action_required"].includes(s)) {
    bg = "bg-orange-500/10";
    color = "text-orange-400";
    border = "border-orange-500/20";
    dot = "bg-orange-400";
  } else if (["failed", "suspended", "blacklisted", "rejected", "critical", "high", "flagged", "offline"].includes(s)) {
    bg = "bg-rose-500/10";
    color = "text-rose-400";
    border = "border-rose-500/20";
    dot = "bg-rose-400";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${bg} ${color} ${border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
      <span className="whitespace-nowrap leading-none">{displayLabel}</span>
    </span>
  );
};
