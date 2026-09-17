import React from "react";
import {
  LayoutDashboard,
  Store,
  Users,
  ReceiptText,
  Settings
} from "lucide-react";

export type NavTab = "dashboard" | "merchants" | "consumers" | "ledger" | "settings";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  lang: "en" | "ar";
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  lang
}) => {
  const isAr = lang === "ar";

  const navItems: { id: NavTab; labelEn: string; labelAr: string; icon: any; badge?: string }[] = [
    { id: "dashboard", labelEn: "Dashboard", labelAr: "الرئيسية", icon: LayoutDashboard },
    { id: "merchants", labelEn: "Merchants", labelAr: "التجار", icon: Store, badge: "1" },
    { id: "consumers", labelEn: "Users", labelAr: "المستخدمين", icon: Users },
    { id: "ledger", labelEn: "Transactions", labelAr: "المعاملات", icon: ReceiptText, badge: "Live" },
    { id: "settings", labelEn: "Settings & Rates", labelAr: "الإعدادات والرسوم", icon: Settings },
  ];

  return (
    <aside style={{
      width: "240px",
      minHeight: "100vh",
      backgroundColor: "#0A0F1D",
      borderRight: isAr ? "none" : "1px solid var(--border-subtle)",
      borderLeft: isAr ? "1px solid var(--border-subtle)" : "none",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      flexShrink: 0,
      zIndex: 40
    }}>
      <div>
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
              <span style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF" }}>
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
        <nav style={{ padding: "14px 10px", display: "flex", flexDirection: "column", gap: "3px" }}>
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
                  fontSize: "13.5px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: isAr ? "right" : "left"
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
      </div>

      {/* System Status Footer */}
      <div style={{ padding: "14px 18px", borderTop: "1px solid var(--border-subtle)", background: "rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="live-indicator" style={{ width: "6px", height: "6px" }} />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#10B981" }}>
            Central Node Active
          </span>
        </div>
        <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
          v1.0.0 • QTPay Admin Engine
        </div>
      </div>
    </aside>
  );
};
