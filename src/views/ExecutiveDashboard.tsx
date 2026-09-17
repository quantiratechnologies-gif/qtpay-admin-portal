import React from "react";
import {
  DollarSign,
  Users,
  Store,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Building,
  CreditCard,
  Zap
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

  // Calculate macro KPIs
  const totalVolumeSar = 4852900.50;
  const todayVolumeSar = 184500.00;
  const activeMerchantsCount = merchants.filter(m => m.status === "active").length;
  const mdrEarningsSar = 48529.00;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Banner: SAMA & Network Gateway Health */}
      <div style={{
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(10, 15, 29, 0.8))",
        border: "1px solid rgba(16, 185, 129, 0.25)",
        borderRadius: "16px",
        padding: "18px 22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: "rgba(16, 185, 129, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#10B981"
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#FFFFFF" }}>
              {isAr ? "نظام المدفوعات الوطني السعودي يعمل بكفاءة 100%" : "SAMA National Payment Network Operational"}
            </div>
            <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              {isAr ? "بوابة سريع (Sarie Switch) • شبكة مدى (mada Network) • الربط الضريبي زاتكا المرحلة الثانية" : "Sarie Instant Switch • mada Dual Interface • ZATCA Phase-2 Realtime E-Invoicing"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            padding: "8px 14px",
            background: "#121A2D",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Current TPS</div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#7FE87F" }}>142.8 tx/s</div>
          </div>
          <div style={{
            padding: "8px 14px",
            background: "#121A2D",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Sarie Latency</div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#38BDF8" }}>18ms</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px"
      }}>
        <MetricCard
          title={isAr ? "إجمالي حجم المعاملات (GPV)" : "Total Gross Processing (GPV)"}
          value="SAR 4,852,900"
          subtitle={isAr ? "مقارنة بالشهر السابق" : "vs last 30 days"}
          change="+18.4%"
          isPositive={true}
          icon={DollarSign}
          accentColor="#7FE87F"
        />
        <MetricCard
          title={isAr ? "حجم تداول اليوم" : "Today's Processed Volume"}
          value="SAR 184,500"
          subtitle={isAr ? "2,419 عملية مكتملة" : "2,419 settled transactions"}
          change="+12.1%"
          isPositive={true}
          icon={Activity}
          accentColor="#38BDF8"
        />
        <MetricCard
          title={isAr ? "إيرادات عمولة المنصة (MDR)" : "Platform Net MDR Revenue"}
          value="SAR 48,529"
          subtitle={isAr ? "متوسط العمولة 1.0%" : "Avg net take-rate 1.0%"}
          change="+15.8%"
          isPositive={true}
          icon={Zap}
          accentColor="#F59E0B"
        />
        <MetricCard
          title={isAr ? "التجار النشطين والأجهزة" : "Active Merchants & Terminals"}
          value={`${activeMerchantsCount} Merchants / 14 POS`}
          subtitle={isAr ? "1 في انتظار الاعتماد" : "1 pending KYB review"}
          change="+4 this week"
          isPositive={true}
          icon={Store}
          accentColor="#A78BFA"
        />
      </div>

      {/* Two Column Layout: Live Activity + Recent High Risk Alerts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
        {/* Real-time Transactions Activity */}
        <div className="admin-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF" }}>
                {isAr ? "بث العمليات الحية المباشرة" : "Realtime Global Transaction Feed"}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                {isAr ? "متصل مباشرة مع قاعدة البيانات المركزية Supabase Realtime" : "Streaming live events via Supabase postgres_changes"}
              </p>
            </div>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "20px",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10B981",
              fontSize: "11px",
              fontWeight: 700
            }}>
              <span className="live-indicator" /> LIVE FEED
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  background: "#121A2D",
                  borderRadius: "12px",
                  border: "1px solid var(--border-subtle)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: tx.paymentMethod === "mada" ? "rgba(16, 185, 129, 0.15)" : "rgba(56, 189, 248, 0.15)",
                    color: tx.paymentMethod === "mada" ? "#10B981" : "#38BDF8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "11px"
                  }}>
                    {tx.paymentMethod.toUpperCase().slice(0, 4)}
                  </div>
                  <div>
                    <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#FFFFFF" }}>
                      {tx.senderName} ➔ {tx.receiverName}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {tx.orderRef} • {tx.channel.replace(/_/g, " ").toUpperCase()} • {new Date(tx.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: isAr ? "left" : "right" }}>
                  <div style={{ fontSize: "14.5px", fontWeight: 800, color: "#7FE87F" }}>
                    +SAR {tx.amount.toFixed(2)}
                  </div>
                  <div style={{ marginTop: "3px" }}>
                    <StatusBadge status={tx.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk & Compliance Radar */}
        <div className="admin-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF" }}>
              {isAr ? "رادار المخاطر وغسل الأموال" : "Risk & AML Radar"}
            </h3>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#EF4444" }}>
              {riskAlerts.filter(a => a.status === "open").length} Active
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {riskAlerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  padding: "12px",
                  background: "#121A2D",
                  borderRadius: "12px",
                  border: alert.severity === "critical" ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid var(--border-subtle)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <StatusBadge status={alert.severity} />
                  <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{alert.timestamp}</span>
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>
                  {alert.title}
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  {alert.description}
                </div>
                <div style={{ fontSize: "11px", color: "#7FE87F", marginTop: "6px", fontWeight: 600 }}>
                  Entity: {alert.entityName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
