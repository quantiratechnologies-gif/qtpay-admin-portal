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

  let bg = "bg-[#182236]";
  let color = "text-[#A2A2BA]";
  let border = "border-[#2C2C44]";
  let dot = "bg-[#A2A2BA]";

  const s = status.toLowerCase();

  if (["active", "settled", "completed", "verified", "low", "online"].includes(s)) {
    bg = "bg-[#7FE87F]/15";
    color = "text-[#7FE87F]";
    border = "border-[#7FE87F]/35";
    dot = "bg-[#7FE87F]";
  } else if (["pending", "pending_kyb", "processing", "scheduled", "medium", "action_required"].includes(s)) {
    bg = "bg-amber-500/10";
    color = "text-amber-300";
    border = "border-amber-500/25";
    dot = "bg-amber-400";
  } else if (["failed", "suspended", "blacklisted", "rejected", "critical", "high", "flagged", "offline"].includes(s)) {
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
