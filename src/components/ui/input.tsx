import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, style, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn("input-field", className)}
        style={{
          backgroundColor: "var(--bg-input)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "8px",
          padding: "8px 12px",
          color: "#FFFFFF",
          fontSize: "12.5px",
          outline: "none",
          boxSizing: "border-box",
          ...style
        }}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
