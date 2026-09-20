import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-lg border border-[#2C2C44] bg-[#111726] px-3 py-1.5 text-xs text-white shadow-inner transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-[#737373] focus-visible:outline-none focus-visible:border-[#7FE87F] focus-visible:ring-1 focus-visible:ring-[#7FE87F]/30 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
