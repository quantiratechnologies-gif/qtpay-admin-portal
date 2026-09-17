import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    let variantStyles = "bg-[#7FE87F] text-[#080C14] hover:bg-[#6edc6e] font-bold shadow-sm";

    if (variant === "destructive") {
      variantStyles = "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 font-semibold";
    } else if (variant === "outline") {
      variantStyles = "bg-[#10182A] text-slate-200 border border-slate-800 hover:bg-slate-800 hover:text-white font-medium";
    } else if (variant === "secondary") {
      variantStyles = "bg-slate-800/80 text-slate-200 hover:bg-slate-700 font-semibold";
    } else if (variant === "ghost") {
      variantStyles = "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium";
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
