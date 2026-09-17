import React from "react";
import {
  DollarSign,
  Store,
  Activity,
  ShieldCheck,
  Zap,
  TrendingUp,
  CreditCard,
  SmartphoneNfc,
  QrCode,
  ArrowDownLeft,
  Flame,
  CheckCircle2,
  Clock
} from "lucide-react";
import { MetricCard } from "../components/MetricCard";
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
  riskAlerts,
  lang
}) => {
  const isAr = lang === "ar";
  const activeMerchantsCount = merchants.filter(m => m.status === "active").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Top Banner: SAMA & Network Gateway Health (Clean & Compact) */}
      <div style={{
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(10, 15, 29, 0.9))",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        borderRadius: "14px",
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "34px",
            height: "34px",
            borderRadius: "8px",
            background: "rgba(16, 185, 129, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#10B981"
          }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#FFFFFF" }}>
              {isAr ? "شبكة المدفوعات الوطنية (SAMA • Sarie • mada • ZATCA)" : "National Switch (SAMA • Sarie • mada • ZATCA)"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 10px",
            borderRadius: "8px",
            background: "#121A2D",
            border: "1px solid var(--border-subtle)",
            fontSize: "11.5px",
            fontWeight: 700,
            color: "#7FE87F"
          }}>
            <Activity size={13} color="#7FE87F" /> 142.8 TPS
          </span>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 10px",
            borderRadius: "8px",
            background: "#121A2D",
            border: "1px solid var(--border-subtle)",
            fontSize: "11.5px",
            fontWeight: 700,
            color: "#38BDF8"
          }}>
            <Zap size={13} color="#38BDF8" /> 18ms
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "14px"
      }}>
        <MetricCard
          title={isAr ? "إجمالي المعاملات (GPV)" : "Gross Volume (GPV)"}
          value="SAR 4,852,900"
          change="+18.4%"
          isPositive={true}
          icon={DollarSign}
          accentColor="#7FE87F"
        />
        <MetricCard
          title={isAr ? "تداول اليوم" : "Today's Volume"}
          value="SAR 184,500"
          change="+12.1%"
          isPositive={true}
          icon={Activity}
          accentColor="#38BDF8"
        />
        <MetricCard
          title={isAr ? "عمولة المنصة (MDR)" : "MDR Revenue"}
          value="SAR 48,529"
          change="+15.8%"
          isPositive={true}
          icon={Zap}
          accentColor="#F59E0B"
        />
        <MetricCard
          title={isAr ? "التجار والأجهزة" : "Merchants & POS"}
          value={`${activeMerchantsCount} Mch / 14 POS`}
          change="+4 new"
          isPositive={true}
          icon={Store}
          accentColor="#A78BFA"
        />
      </div>

      {/* Two Column Layout: Live Activity + Recent High Risk Alerts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
        {/* Real-time Transactions Activity */}
        <div className="admin-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Activity size={16} color="#7FE87F" />
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#FFFFFF" }}>
                {isAr ? "بث العمليات المباشر" : "Realtime Transaction Feed"}
              </h3>
            </div>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 8px",
              borderRadius: "14px",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10B981",
              fontSize: "10.5px",
              fontWeight: 700
            }}>
              <span className="live-indicator" style={{ width: "5px", height: "5px" }} /> LIVE
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  background: "#121A2D",
                  borderRadius: "10px",
                  border: "1px solid var(--border-subtle)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: tx.paymentMethod === "mada" ? "rgba(16, 185, 129, 0.15)" : "rgba(56, 189, 248, 0.15)",
                    color: tx.paymentMethod === "mada" ? "#10B981" : "#38BDF8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "10px"
                  }}>
                    {tx.channel === "pos_softpos" ? <SmartphoneNfc size={16} /> : <ArrowDownLeft size={16} />}
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>
                      {tx.senderName} ➔ {tx.receiverName}
                    </div>
                    <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "1px", fontFamily: "monospace" }}>
                      {tx.orderRef} • {new Date(tx.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: isAr ? "left" : "right" }}>
                  <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#7FE87F" }}>
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

        {/* Risk & Compliance Radar */}
        <div className="admin-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Flame size={16} color="#EF4444" />
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#FFFFFF" }}>
                {isAr ? "رادار المخاطر" : "Risk Radar"}
              </h3>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#EF4444" }}>
              {riskAlerts.filter(a => a.status === "open").length} Active
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {riskAlerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  padding: "10px",
                  background: "#121A2D",
                  borderRadius: "10px",
                  border: alert.severity === "critical" ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid var(--border-subtle)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <StatusBadge status={alert.severity} />
                  <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{alert.timestamp}</span>
                </div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#FFFFFF", marginBottom: "2px" }}>
                  {alert.title}
                </div>
                <div style={{ fontSize: "11px", color: "#38BDF8", fontWeight: 600 }}>
                  {alert.entityName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
