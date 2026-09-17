import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    let variantStyles: React.CSSProperties = {
      backgroundColor: "var(--brand-green)",
      color: "var(--brand-green-ink)",
      fontWeight: 700,
      border: "none"
    };

    if (variant === "destructive") {
      variantStyles = {
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        color: "#F87171",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        fontWeight: 600
      };
    } else if (variant === "outline") {
      variantStyles = {
        backgroundColor: "transparent",
        color: "#FFFFFF",
        border: "1px solid var(--border-subtle)",
        fontWeight: 600
      };
    } else if (variant === "secondary") {
      variantStyles = {
        backgroundColor: "var(--bg-card-hover)",
        color: "#FFFFFF",
        border: "1px solid var(--border-subtle)",
        fontWeight: 600
      };
    } else if (variant === "ghost") {
      variantStyles = {
        backgroundColor: "transparent",
        color: "#94A3B8",
        border: "none",
        fontWeight: 500
      };
    }

    let sizeStyles: React.CSSProperties = {
      padding: "8px 14px",
      fontSize: "13px",
      borderRadius: "8px"
    };

    if (size === "sm") {
      sizeStyles = {
        padding: "5px 10px",
        fontSize: "11.5px",
        borderRadius: "6px"
      };
    } else if (size === "lg") {
      sizeStyles = {
        padding: "12px 20px",
        fontSize: "14.5px",
        borderRadius: "10px"
      };
    } else if (size === "icon") {
      sizeStyles = {
        width: "32px",
        height: "32px",
        padding: "0",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "7px"
      };
    }

    return (
      <button
        ref={ref}
        className={cn("inline-flex items-center justify-center gap-2 cursor-pointer transition-all", className)}
        style={{
          ...variantStyles,
          ...sizeStyles,
          cursor: props.disabled ? "not-allowed" : "pointer",
          opacity: props.disabled ? 0.6 : 1,
          boxSizing: "border-box"
        }}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
