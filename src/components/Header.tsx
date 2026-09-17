import React from "react";
import {
  Bell,
  Search,
  Languages,
  Shield,
  RefreshCw,
  LogOut,
  ChevronDown
} from "lucide-react";
import { currentAdminUser } from "../services/mockData";

interface HeaderProps {
  lang: "en" | "ar";
  onToggleLang: () => void;
  onRefreshData: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  onRefreshData,
  isRefreshing = false
}) => {
  const isAr = lang === "ar";

  return (
    <header style={{
      height: "70px",
      backgroundColor: "#0A0F1D",
      borderBottom: "1px solid var(--border-subtle)",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 30
    }}>
      {/* Global Search Bar */}
      <div style={{ position: "relative", width: "360px" }}>
        <Search
          size={16}
          color="#64748B"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            [isAr ? "right" : "left"]: "14px"
          }}
        />
        <input
          type="text"
          placeholder={isAr ? "بحث عن تاجر، سريالية، أمر دفع، أو رقم هوية..." : "Search Merchant CR, Sarie UTR, Order Ref, National ID..."}
          style={{
            width: "100%",
            background: "#121A2D",
            border: "1px solid var(--border-subtle)",
            borderRadius: "10px",
            padding: isAr ? "9px 40px 9px 14px" : "9px 14px 9px 40px",
            color: "#FFFFFF",
            fontSize: "13px",
            outline: "none"
          }}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Refresh Live Button */}
        <button
          onClick={onRefreshData}
          disabled={isRefreshing}
          style={{
            background: "#121A2D",
            border: "1px solid var(--border-subtle)",
            color: "#94A3B8",
            borderRadius: "8px",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12.5px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} color="#7FE87F" />
          <span>{isAr ? "تحديث مباشر" : "Sync Live"}</span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={onToggleLang}
          style={{
            background: "rgba(127, 232, 127, 0.1)",
            border: "1px solid rgba(127, 232, 127, 0.3)",
            color: "#7FE87F",
            borderRadius: "8px",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12.5px",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          <Languages size={14} />
          <span>{isAr ? "English" : "العربية"}</span>
        </button>

        {/* Notification Bell */}
        <div style={{ position: "relative" }}>
          <button style={{
            background: "#121A2D",
            border: "1px solid var(--border-subtle)",
            borderRadius: "8px",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            cursor: "pointer"
          }}>
            <Bell size={16} />
            <span style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              width: "8px",
              height: "8px",
              background: "#EF4444",
              borderRadius: "50%",
              boxShadow: "0 0 8px #EF4444"
            }} />
          </button>
        </div>

        {/* Admin Profile Chip */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "6px 12px",
          background: "#121A2D",
          borderRadius: "10px",
          border: "1px solid var(--border-subtle)"
        }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "#7FE87F",
            color: "#080C14",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px"
          }}>
            {currentAdminUser.avatar}
          </div>
          <div style={{ textAlign: isAr ? "right" : "left" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>
              {currentAdminUser.name}
            </div>
            <div style={{ fontSize: "11px", color: "#7FE87F", fontWeight: 600 }}>
              {isAr ? "مسؤول النظام الأعلى" : "SuperAdmin (HQ)"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
