import React from "react";
import {
  DollarSign,
  Store,
  Activity,
  Zap,
  TrendingUp,
  SmartphoneNfc,
  ArrowDownLeft,
  ShieldCheck
} from "lucide-react";
import { StatusBadge } from "../components/Badge";
import type { PlatformTransaction, Merchant, RiskAlert } from "../types";

interface ExecutiveDashboardProps {
  transactions: PlatformTransaction[];
  merchants: Merchant[];
  riskAlerts: RiskAlert[];
  lang: "en" | "ar";
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  transactions,
  merchants,
  lang
}) => {
  const isAr = lang === "ar";
  const activeMerchantsCount = merchants.filter(m => m.status === "active").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Network Status Strip */}
      <div style={{
        background: "rgba(16, 185, 129, 0.06)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        borderRadius: "10px",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="live-indicator" style={{ width: "6px", height: "6px" }} />
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>
            {isAr ? "الشبكة المركزية تعمل بكفاءة" : "Payment Network Operational"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "#7FE87F", fontWeight: 700 }}>142.8 TPS</span>
          <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>•</span>
          <span style={{ fontSize: "12px", color: "#38BDF8", fontWeight: 700 }}>18ms</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: "12px"
      }}>
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
              {isAr ? "إجمالي المعاملات" : "Gross Volume"}
            </span>
            <DollarSign size={16} color="#7FE87F" />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF" }}>
            SAR 4,852,900
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#10B981", fontWeight: 700, marginTop: "4px" }}>
            <TrendingUp size={12} /> +18.4%
          </div>
        </div>

        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
              {isAr ? "حجم اليوم" : "Today's Volume"}
            </span>
            <Activity size={16} color="#38BDF8" />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF" }}>
            SAR 184,500
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#10B981", fontWeight: 700, marginTop: "4px" }}>
            <TrendingUp size={12} /> +12.1%
          </div>
        </div>

        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
              {isAr ? "الإيرادات" : "MDR Revenue"}
            </span>
            <Zap size={16} color="#F59E0B" />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF" }}>
            SAR 48,529
          </div>
          <div style={{ fontSize: "11px", color: "#F59E0B", fontWeight: 700, marginTop: "4px" }}>
            1.0% avg take
          </div>
        </div>

        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
              {isAr ? "التجار النشطين" : "Active Merchants"}
            </span>
            <Store size={16} color="#A78BFA" />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF" }}>
            {activeMerchantsCount} Merchants
          </div>
          <div style={{ fontSize: "11px", color: "#A78BFA", fontWeight: 700, marginTop: "4px" }}>
            14 Terminals
          </div>
        </div>
      </div>

      {/* Realtime Stream Table */}
      <div className="admin-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Activity size={15} color="#7FE87F" />
            <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#FFFFFF" }}>
              {isAr ? "العمليات المباشرة" : "Live Transactions"}
            </h3>
          </div>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "2px 7px",
            borderRadius: "10px",
            background: "rgba(16, 185, 129, 0.15)",
            color: "#10B981",
            fontSize: "10px",
            fontWeight: 700
          }}>
            <span className="live-indicator" style={{ width: "4px", height: "4px" }} /> LIVE
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {transactions.slice(0, 5).map((tx) => (
            <div
              key={tx.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                background: "#121A2D",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  background: tx.paymentMethod === "mada" ? "rgba(16, 185, 129, 0.15)" : "rgba(56, 189, 248, 0.15)",
                  color: tx.paymentMethod === "mada" ? "#10B981" : "#38BDF8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {tx.channel === "pos_softpos" ? <SmartphoneNfc size={14} /> : <ArrowDownLeft size={14} />}
                </div>
                <div>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#FFFFFF" }}>
                    {tx.senderName} ➔ {tx.receiverName}
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                    {tx.orderRef} • {new Date(tx.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: isAr ? "left" : "right" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#7FE87F" }}>
                  +SAR {tx.amount.toFixed(2)}
                </div>
                <div style={{ marginTop: "2px" }}>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
