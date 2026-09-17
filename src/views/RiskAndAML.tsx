import React from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  FileSpreadsheet,
  Lock,
  UserX
} from "lucide-react";
import { StatusBadge } from "../components/Badge";
import type { RiskAlert } from "../types";

interface RiskAndAMLProps {
  alerts: RiskAlert[];
  onResolveAlert: (alertId: string) => void;
  lang: "en" | "ar";
}

export const RiskAndAML: React.FC<RiskAndAMLProps> = ({
  alerts,
  onResolveAlert,
  lang
}) => {
  const isAr = lang === "ar";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "14px"
      }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF" }}>
            {isAr ? "مكافحة غسل الأموال (AML) وإدارة المخاطر والاحتيال" : "Anti-Money Laundering (AML) & Fraud Prevention"}
          </h2>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            {isAr ? "مراقبة الأنشطة المشبوهة، تكرار العمليات، ومطابقة قوائم العقوبات الصادرة عن البنك المركزي" : "SAMA STR reporting, velocity breach detection, sanctions list screening, & fraud blacklists"}
          </p>
        </div>

        <button className="btn-secondary">
          <FileSpreadsheet size={15} /> {isAr ? "تصدير تقرير SAMA AML الشهري" : "Export SAMA AML Report (STR)"}
        </button>
      </div>

      {/* Alerts Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {alerts.map((a) => (
          <div
            key={a.id}
            className="admin-card"
            style={{
              borderLeft: a.severity === "critical" ? "4px solid #EF4444" : a.severity === "high" ? "4px solid #F59E0B" : "4px solid #38BDF8",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px"
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", maxWidth: "700px" }}>
              <div style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: a.severity === "critical" ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
                color: a.severity === "critical" ? "#EF4444" : "#F59E0B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <ShieldAlert size={22} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <StatusBadge status={a.severity} />
                  <span style={{ fontSize: "14px", fontWeight: 800, color: "#FFFFFF" }}>{a.title}</span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>• {a.timestamp}</span>
                </div>
                <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  {a.description}
                </div>
                <div style={{ fontSize: "11.5px", color: "#38BDF8", marginTop: "6px", fontWeight: 600 }}>
                  Target: {a.entityName} ({a.entityType.toUpperCase()})
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {a.status !== "resolved" ? (
                <button
                  onClick={() => onResolveAlert(a.id)}
                  className="btn-primary"
                  style={{ padding: "8px 14px", fontSize: "12.5px" }}
                >
                  <CheckCircle2 size={14} /> {isAr ? "حل والتأشير بالامتثال" : "Resolve Alert"}
                </button>
              ) : (
                <span style={{ fontSize: "12px", color: "#10B981", fontWeight: 700 }}>
                  ✓ Resolved by Admin
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
