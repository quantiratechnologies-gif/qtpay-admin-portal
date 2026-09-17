import React from "react";

interface BadgeProps {
  status: string;
  text?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, text }) => {
  const displayLabel = text || status.replace(/_/g, " ").toUpperCase();
  
  let bg = "rgba(100, 116, 139, 0.15)";
  let color = "#94A3B8";
  let border = "rgba(100, 116, 139, 0.3)";

  if (["active", "settled", "completed", "verified", "low"].includes(status.toLowerCase())) {
    bg = "rgba(16, 185, 129, 0.15)";
    color = "#10B981";
    border = "rgba(16, 185, 129, 0.3)";
  } else if (["pending", "pending_kyb", "processing", "scheduled", "medium", "action_required"].includes(status.toLowerCase())) {
    bg = "rgba(245, 158, 11, 0.15)";
    color = "#F59E0B";
    border = "rgba(245, 158, 11, 0.3)";
  } else if (["failed", "suspended", "blacklisted", "rejected", "critical", "high", "flagged"].includes(status.toLowerCase())) {
    bg = "rgba(239, 68, 68, 0.15)";
    color = "#EF4444";
    border = "rgba(239, 68, 68, 0.3)";
  }

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      fontSize: "11px",
      fontWeight: 700,
      padding: "3px 8px",
      borderRadius: "6px",
      background: bg,
      color: color,
      border: `1px solid ${border}`,
      textTransform: "uppercase",
      letterSpacing: "0.03em"
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: color }} />
      {displayLabel}
    </span>
  );
};
