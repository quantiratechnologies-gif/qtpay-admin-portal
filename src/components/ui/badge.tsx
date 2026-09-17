import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

export function Badge({
  className,
  variant = "default",
  style,
  ...props
}: BadgeProps) {
  let bg = "rgba(127, 232, 127, 0.15)";
  let color = "#7FE87F";
  let border = "1px solid rgba(127, 232, 127, 0.3)";

  if (variant === "secondary") {
    bg = "rgba(255, 255, 255, 0.08)";
    color = "#94A3B8";
    border = "1px solid var(--border-subtle)";
  } else if (variant === "destructive") {
    bg = "rgba(239, 68, 68, 0.15)";
    color = "#EF4444";
    border = "1px solid rgba(239, 68, 68, 0.3)";
  } else if (variant === "warning") {
    bg = "rgba(245, 158, 11, 0.15)";
    color = "#F59E0B";
    border = "1px solid rgba(245, 158, 11, 0.3)";
  } else if (variant === "success") {
    bg = "rgba(16, 185, 129, 0.15)";
    color = "#10B981";
    border = "1px solid rgba(16, 185, 129, 0.3)";
  }

  return (
    <div
      className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold", className)}
      style={{
        backgroundColor: bg,
        color,
        border,
        fontSize: "11px",
        fontWeight: 700,
        padding: "2px 6px",
        borderRadius: "6px",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        ...style
      }}
      {...props}
    />
  );
}
