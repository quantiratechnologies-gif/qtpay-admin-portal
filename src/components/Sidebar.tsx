import React from "react";
import {
  LayoutDashboard,
  Store,
  Users,
  ReceiptText,
  Building2,
  ShieldAlert,
  Percent,
  FileCheck,
  Zap,
  Globe2
} from "lucide-react";

export type NavTab =
  | "dashboard"
  | "merchants"
  | "consumers"
  | "ledger"
  | "settlements"
  | "risk"
  | "commissions"
  | "audit";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  lang: "en" | "ar";
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  lang
}) => {
  const isAr = lang === "ar";

  const navItems: { id: NavTab; labelEn: string; labelAr: string; icon: any; badge?: string }[] = [
    { id: "dashboard", labelEn: "Executive Dashboard", labelAr: "لوحة القيادة التنفيذية", icon: LayoutDashboard },
    { id: "merchants", labelEn: "Merchant KYB & Terminals", labelAr: "التحقق من التجار وأجهزة الدفع", icon: Store, badge: "1 Pending" },
    { id: "consumers", labelEn: "Consumer KYC & Wallets", labelAr: "المستهلكين والمحافظ الرقمية", icon: Users },
    { id: "ledger", labelEn: "Global Realtime Ledger", labelAr: "سجل العمليات الموحد", icon: ReceiptText, badge: "Live" },
    { id: "settlements", labelEn: "Settlements & Banking", labelAr: "التسويات المصرفية والسيولة", icon: Building2 },
    { id: "risk", labelEn: "Risk & AML Controls", labelAr: "مكافحة غسل الأموال والمخاطر", icon: ShieldAlert, badge: "3 Alerts" },
    { id: "commissions", labelEn: "MDR Fee Matrix", labelAr: "مصفوفة العمولات والرسوم", icon: Percent },
    { id: "audit", labelEn: "SAMA Audit Logs", labelAr: "سجلات الامتثال والرقابة", icon: FileCheck },
  ];

  return (
    <aside style={{
      width: "280px",
      minHeight: "100vh",
      backgroundColor: "#0A0F1D",
      borderRight: isAr ? "none" : "1px solid var(--border-subtle)",
      borderLeft: isAr ? "1px solid var(--border-subtle)" : "none",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      zIndex: 40
    }}>
      {/* Brand Header */}
      <div style={{
        padding: "24px 20px",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #7FE87F, #059669)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#080C14",
          fontWeight: 900,
          fontSize: "20px",
          boxShadow: "0 0 20px rgba(127, 232, 127, 0.4)"
        }}>
          QP
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              QTPay
            </span>
            <span style={{
              fontSize: "10px",
              fontWeight: 800,
              padding: "2px 6px",
              borderRadius: "4px",
              background: "rgba(127, 232, 127, 0.15)",
              color: "#7FE87F",
              border: "1px solid rgba(127, 232, 127, 0.3)"
            }}>
              SUPERADMIN
            </span>
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>SAMA & ZATCA Central Node</span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          padding: "8px 12px"
        }}>
          {isAr ? "الوحدات الرئيسية" : "CORE MODULES"}
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "11px 14px",
                borderRadius: "10px",
                border: "none",
                background: isActive ? "rgba(127, 232, 127, 0.12)" : "transparent",
                color: isActive ? "#7FE87F" : "var(--text-secondary)",
                fontWeight: isActive ? 700 : 500,
                fontSize: "13.5px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                textAlign: isAr ? "right" : "left"
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Icon size={18} color={isActive ? "#7FE87F" : "#94A3B8"} />
                <span>{isAr ? item.labelAr : item.labelEn}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: "12px",
                  background: item.badge === "Live" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                  color: item.badge === "Live" ? "#10B981" : "#F59E0B",
                  border: item.badge === "Live" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(245, 158, 11, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  {item.badge === "Live" && <span className="live-indicator" style={{ width: "5px", height: "5px" }} />}
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* SAMA Node Status Bar */}
      <div style={{
        padding: "16px",
        borderTop: "1px solid var(--border-subtle)",
        background: "rgba(0,0,0,0.2)"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="live-indicator" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#10B981" }}>
              {isAr ? "متصل بالبنك المركزي" : "Sarie / SAMA Online"}
            </span>
          </div>
          <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>14ms</span>
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
          {isAr ? "النسخة الرقابية v3.4 — شبكة المدفوعات الوطنية" : "Enterprise Sandbox • Saudi National Switch"}
        </div>
      </div>
    </aside>
  );
};
