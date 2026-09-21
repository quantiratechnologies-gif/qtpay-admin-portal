import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    let variantStyles = "btn-primary-shine bg-gradient-to-r from-[#7FE87F] via-[#6FD86F] to-[#5FBF5F] text-[#080C14] hover:brightness-110 font-bold shadow-lg shadow-[#7FE87F]/25 border-t border-white/40 transition-all active:scale-[0.98]";

    if (variant === "destructive") {
      variantStyles = "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 font-semibold";
    } else if (variant === "outline") {
      variantStyles = "bg-[#111726]/90 text-slate-200 border border-[#2C2C44] hover:bg-[#182236] hover:border-[#7FE87F]/50 hover:text-white font-medium shadow-sm hover:shadow-[#7FE87F]/10 transition-all";
    } else if (variant === "secondary") {
      variantStyles = "bg-[#182236] text-slate-200 border border-[#2C2C44] hover:bg-[#1E293B] hover:border-[#7FE87F]/30 font-semibold transition-all";
    } else if (variant === "ghost") {
      variantStyles = "bg-transparent text-[#A2A2BA] hover:text-white hover:bg-[#182236] font-medium";
    }

    let sizeStyles = "h-9 px-3.5 py-2 text-xs rounded-lg";

    if (size === "sm") {
      sizeStyles = "h-7 px-2.5 text-xs rounded-md";
    } else if (size === "lg") {
      sizeStyles = "h-11 px-5 text-sm rounded-xl";
    } else if (size === "icon") {
      sizeStyles = "h-8 w-8 p-0 rounded-lg";
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles,
          sizeStyles,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
