import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "gold" | "primary";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  let variantStyles = "bg-[#7FE87F]/15 text-[#7FE87F] border border-[#7FE87F]/35";

  if (variant === "secondary") {
    variantStyles = "bg-[#182236] text-[#A2A2BA] border border-[#2C2C44]";
  } else if (variant === "destructive") {
    variantStyles = "bg-red-500/15 text-red-400 border border-red-500/30";
  } else if (variant === "warning") {
    variantStyles = "bg-amber-500/15 text-amber-300 border border-amber-500/30";
  } else if (variant === "success") {
    variantStyles = "bg-[#7FE87F]/15 text-[#7FE87F] border border-[#7FE87F]/30";
  } else if (variant === "gold" || variant === "primary") {
    variantStyles = "bg-gradient-to-r from-[#7FE87F]/20 to-[#6FD86F]/20 text-[#7FE87F] border border-[#7FE87F]/40 shadow-sm shadow-[#7FE87F]/10";
  } else if (variant === "outline") {
    variantStyles = "bg-transparent text-[#A2A2BA] border border-[#2C2C44]";
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        variantStyles,
        className
      )}
      {...props}
    />
  );
}
