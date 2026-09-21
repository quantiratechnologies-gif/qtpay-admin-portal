import React from "react";
import {
  ShieldAlert,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";
import { StatusBadge } from "../components/Badge";
import { useTranslation } from "../lib/i18n/LanguageContext";
import type { RiskAlert } from "../types";

interface RiskAndAMLProps {
  alerts: RiskAlert[];
  onResolveAlert: (alertId: string) => void;
  lang?: "en" | "ar";
}

export const RiskAndAML: React.FC<RiskAndAMLProps> = ({
  alerts,
  onResolveAlert
}) => {
  const { lang, isAr } = useTranslation();

  const getAlertTitle = (alert: RiskAlert) => {
    if (!isAr) return alert.title;
    if (alert.id === "rsk_101") return "تكرار سريع لعمليات نقاط البيع (اشتباه تدوير)";
    if (alert.id === "rsk_102") return "مطابقة جزئية في قائمة حظر ومكافحة غسل الأموال";
    return alert.title;
  };

  const getAlertDescription = (alert: RiskAlert) => {
    if (!isAr) return alert.description;
    if (alert.id === "rsk_101")
      return "تم رصد 18 محاولة دفع متتالية خلال 120 ثانية بنفس المبلغ (99.00 ر.س) على الجهاز TRM-44912";
    if (alert.id === "rsk_102")
      return "محاولة إنشاء حساب بهوية وطنية مطابقة لمعايير الفحص والاشتباه الصادرة عن البنك المركزي";
    return alert.description;
  };

  const getEntityTypeLabel = (type: string) => {
    if (!isAr) return type.toUpperCase();
    switch (type) {
      case "merchant":
        return "تاجر / منشأة";
      case "user":
        return "عميل فردي";
      case "transaction":
        return "عملية دفع";
      default:
        return type;
    }
  };

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
            {isAr ? "المخاطر ومكافحة الاحتيال (AML)" : "Risk & AML Monitoring"}
          </h2>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            {isAr
              ? "مراقبة الأنشطة المشبوهة وتكرار العمليات وقوائم الحظر"
              : "Suspicious activity monitoring, velocity breaches, and watchlist screening"}
          </p>
        </div>

        <button className="btn-secondary">
          <FileSpreadsheet size={15} /> {isAr ? "تصدير تقرير AML" : "Export AML Report"}
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
                  <span style={{ fontSize: "14px", fontWeight: 800, color: "#FFFFFF" }}>{getAlertTitle(a)}</span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>• {a.timestamp}</span>
                </div>
                <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  {getAlertDescription(a)}
                </div>
                <div style={{ fontSize: "11.5px", color: "#F1D77A", marginTop: "6px", fontWeight: 600 }}>
                  {isAr ? "الكيان:" : "Target:"} {a.entityName} ({getEntityTypeLabel(a.entityType)})
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
                  <CheckCircle2 size={14} /> {isAr ? "حل التنبيه" : "Resolve Alert"}
                </button>
              ) : (
                <span style={{ fontSize: "12px", color: "#F1D77A", fontWeight: 700 }}>
                  {isAr ? "✓ تم الحل" : "✓ Resolved"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

