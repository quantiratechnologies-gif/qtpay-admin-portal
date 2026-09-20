import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: any;
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  accentColor = "#7FE87F"
}) => {
  return (
    <div className="admin-card" style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
        <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)" }}>
          {title}
        </span>
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "rgba(127, 232, 127, 0.1)",
          border: "1px solid rgba(127, 232, 127, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accentColor
        }}>
          <Icon size={18} />
        </div>
      </div>

      <div style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF", marginBottom: "6px", letterSpacing: "-0.02em" }}>
        {value}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
        {change && (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
            color: isPositive ? "#7FE87F" : "#EF4444",
            fontWeight: 700
          }}>
            {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {change}
          </span>
        )}
        {subtitle && (
          <span style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
