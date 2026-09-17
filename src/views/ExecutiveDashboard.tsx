import React from "react";
import {
  DollarSign,
  Store,
  Activity,
  ShieldCheck,
  Zap,
  TrendingUp,
  SmartphoneNfc,
  ArrowDownLeft,
  Flame,
  Clock,
  CheckCircle2,
  Users
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
  riskAlerts,
  lang
}) => {
  const isAr = lang === "ar";
  const activeMerchantsCount = merchants.filter(m => m.status === "active").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* SAMA Health Bar */}
      <div style={{
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(10, 15, 29, 0.95))",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        borderRadius: "12px",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ShieldCheck size={16} color="#10B981" />
          <span style={{ fontSize: "13px", fontWeight: 800, color: "#FFFFFF" }}>
            {isAr ? "شبكة المدفوعات المركزية (SAMA • Sarie • mada • ZATCA)" : "SAMA Central Payment Network (Sarie • mada • ZATCA)"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 8px",
            borderRadius: "6px",
            background: "#121A2D",
            border: "1px solid var(--border-subtle)",
            fontSize: "11px",
            fontWeight: 700,
            color: "#7FE87F"
          }}>
            <Activity size={12} color="#7FE87F" /> 142.8 TPS
          </span>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 8px",
            borderRadius: "6px",
            background: "#121A2D",
            border: "1px solid var(--border-subtle)",
            fontSize: "11px",
            fontWeight: 700,
            color: "#38BDF8"
          }}>
            <Zap size={12} color="#38BDF8" /> 18ms Latency
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: "12px"
      }}>
        {/* Metric 1 */}
        <div className="admin-card" style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
              {isAr ? "إجمالي المعاملات (GPV)" : "Gross Volume (GPV)"}
            </span>
            <DollarSign size={16} color="#7FE87F" />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            SAR 4,852,900
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#10B981", fontWeight: 700, marginTop: "4px" }}>
            <TrendingUp size={12} /> +18.4%
          </div>
        </div>

        {/* Metric 2 */}
        <div className="admin-card" style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
              {isAr ? "تداول اليوم" : "Today's Volume"}
            </span>
            <Activity size={16} color="#38BDF8" />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            SAR 184,500
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#10B981", fontWeight: 700, marginTop: "4px" }}>
            <TrendingUp size={12} /> +12.1%
          </div>
        </div>

        {/* Metric 3 */}
        <div className="admin-card" style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
              {isAr ? "عمولة المنصة (MDR)" : "MDR Revenue"}
            </span>
            <Zap size={16} color="#F59E0B" />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            SAR 48,529
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#F59E0B", fontWeight: 700, marginTop: "4px" }}>
            1.0% avg take-rate
          </div>
        </div>

        {/* Metric 4 */}
        <div className="admin-card" style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
              {isAr ? "التجار ونقاط البيع" : "Merchants & POS"}
            </span>
            <Store size={16} color="#A78BFA" />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            {activeMerchantsCount} Mch / 14 POS
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#A78BFA", fontWeight: 700, marginTop: "4px" }}>
            +4 new this week
          </div>
        </div>
      </div>

      {/* Split Section: Realtime Stream + Radar */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "14px" }}>
        {/* Realtime Stream */}
        <div className="admin-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Activity size={15} color="#7FE87F" />
              <h3 style={{ fontSize: "14.5px", fontWeight: 800, color: "#FFFFFF" }}>
                {isAr ? "بث العمليات المباشر" : "Realtime Transaction Feed"}
              </h3>
            </div>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 7px",
              borderRadius: "12px",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10B981",
              fontSize: "10px",
              fontWeight: 700
            }}>
              <span className="live-indicator" style={{ width: "4px", height: "4px" }} /> LIVE
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  background: "#121A2D",
                  borderRadius: "9px",
                  border: "1px solid var(--border-subtle)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <div style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "7px",
                    background: tx.paymentMethod === "mada" ? "rgba(16, 185, 129, 0.15)" : "rgba(56, 189, 248, 0.15)",
                    color: tx.paymentMethod === "mada" ? "#10B981" : "#38BDF8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "10px"
                  }}>
                    {tx.channel === "pos_softpos" ? <SmartphoneNfc size={15} /> : <ArrowDownLeft size={15} />}
                  </div>
                  <div>
                    <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#FFFFFF" }}>
                      {tx.senderName} ➔ {tx.receiverName}
                    </div>
                    <div style={{ fontSize: "10.5px", color: "var(--text-muted)", fontFamily: "monospace" }}>
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

        {/* Network & Health Radar */}
        <div className="admin-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={15} color="#38BDF8" />
              <h3 style={{ fontSize: "14.5px", fontWeight: 800, color: "#FFFFFF" }}>
                {isAr ? "حالة الأنظمة" : "System Gateways"}
              </h3>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ padding: "9px 11px", background: "#121A2D", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 700 }}>Sarie Instant P2P</span>
                <span style={{ fontSize: "10.5px", color: "#10B981", fontWeight: 700 }}>99.99%</span>
              </div>
              <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px" }}>Direct SAMA Core Link</div>
            </div>

            <div style={{ padding: "9px 11px", background: "#121A2D", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 700 }}>mada Switch POS</span>
                <span style={{ fontSize: "10.5px", color: "#10B981", fontWeight: 700 }}>Active</span>
              </div>
              <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px" }}>14 POS Fleets Synchronized</div>
            </div>

            <div style={{ padding: "9px 11px", background: "#121A2D", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 700 }}>ZATCA E-Invoicing</span>
                <span style={{ fontSize: "10.5px", color: "#10B981", fontWeight: 700 }}>Phase 2</span>
              </div>
              <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px" }}>Cryptographic Signing Live</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
