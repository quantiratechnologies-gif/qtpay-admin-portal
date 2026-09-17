import React from "react";
import {
  LayoutDashboard,
  Store,
  Users,
  ReceiptText,
  Landmark,
  ShieldAlert,
  Percent,
  FileCheck,
  ShieldCheck
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
    { id: "dashboard", labelEn: "Overview", labelAr: "الرئيسية", icon: LayoutDashboard },
    { id: "merchants", labelEn: "Merchants & POS", labelAr: "التجار ونقاط البيع", icon: Store, badge: "1" },
    { id: "consumers", labelEn: "Customers & KYC", labelAr: "المستهلكين", icon: Users },
    { id: "ledger", labelEn: "Live Ledger", labelAr: "سجل العمليات", icon: ReceiptText, badge: "Live" },
    { id: "settlements", labelEn: "Settlements", labelAr: "التسويات", icon: Landmark },
    { id: "risk", labelEn: "Risk & AML", labelAr: "المخاطر", icon: ShieldAlert, badge: "3" },
    { id: "commissions", labelEn: "MDR Rates", labelAr: "الرسوم", icon: Percent },
    { id: "audit", labelEn: "SAMA Audit", labelAr: "الامتثال", icon: FileCheck },
  ];

  return (
    <aside style={{
      width: "250px",
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
        padding: "20px 18px",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #7FE87F, #059669)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#080C14",
          fontWeight: 900,
          fontSize: "18px",
          boxShadow: "0 0 16px rgba(127, 232, 127, 0.35)"
        }}>
          QP
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              QTPay
            </span>
            <span style={{
              fontSize: "9.5px",
              fontWeight: 800,
              padding: "1px 5px",
              borderRadius: "4px",
              background: "rgba(127, 232, 127, 0.15)",
              color: "#7FE87F",
              border: "1px solid rgba(127, 232, 127, 0.3)"
            }}>
              ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: "3px" }}>
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
                padding: "10px 12px",
                borderRadius: "10px",
                border: "none",
                background: isActive ? "rgba(127, 232, 127, 0.12)" : "transparent",
                color: isActive ? "#7FE87F" : "var(--text-secondary)",
                fontWeight: isActive ? 700 : 500,
                fontSize: "13px",
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
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Icon size={17} color={isActive ? "#7FE87F" : "#94A3B8"} />
                <span>{isAr ? item.labelAr : item.labelEn}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "10px",
                  background: item.badge === "Live" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                  color: item.badge === "Live" ? "#10B981" : "#F59E0B",
                  border: item.badge === "Live" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(245, 158, 11, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px"
                }}>
                  {item.badge === "Live" && <span className="live-indicator" style={{ width: "4px", height: "4px" }} />}
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* SAMA Node Status Bar */}
      <div style={{
        padding: "14px",
        borderTop: "1px solid var(--border-subtle)",
        background: "rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="live-indicator" style={{ width: "6px", height: "6px" }} />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#10B981" }}>
            SAMA Online
          </span>
        </div>
        <span style={{ fontSize: "10.5px", color: "var(--text-muted)", fontFamily: "monospace" }}>18ms</span>
      </div>
    </aside>
  );
};
