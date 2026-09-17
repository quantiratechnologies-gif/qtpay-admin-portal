import React from "react";
import {
  Search,
  Languages,
  RefreshCw,
  LogOut,
  User
} from "lucide-react";
import type { AdminUser } from "../types";

interface HeaderProps {
  currentUser: AdminUser;
  onLogout: () => void;
  lang: "en" | "ar";
  onToggleLang: () => void;
  onRefreshData: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  lang,
  onToggleLang,
  onRefreshData,
  isRefreshing = false
}) => {
  const isAr = lang === "ar";

  return (
    <header style={{
      height: "64px",
      backgroundColor: "#0A0F1D",
      borderBottom: "1px solid var(--border-subtle)",
      padding: "0 22px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 30
    }}>
      {/* Search Bar */}
      <div style={{ position: "relative", width: "300px" }}>
        <Search
          size={15}
          color="#64748B"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            [isAr ? "right" : "left"]: "12px"
          }}
        />
        <input
          type="text"
          placeholder={isAr ? "بحث بالرقم المرجعي أو التاجر..." : "Search Order, Merchant, User..."}
          style={{
            width: "100%",
            background: "#121A2D",
            border: "1px solid var(--border-subtle)",
            borderRadius: "8px",
            padding: isAr ? "8px 34px 8px 12px" : "8px 12px 8px 34px",
            color: "#FFFFFF",
            fontSize: "12.5px",
            outline: "none"
          }}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Refresh Live Button */}
        <button
          onClick={onRefreshData}
          disabled={isRefreshing}
          style={{
            background: "#121A2D",
            border: "1px solid var(--border-subtle)",
            color: "#94A3B8",
            borderRadius: "8px",
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} color="#7FE87F" />
          <span>{isAr ? "تحديث" : "Refresh"}</span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={onToggleLang}
          style={{
            background: "rgba(127, 232, 127, 0.1)",
            border: "1px solid rgba(127, 232, 127, 0.3)",
            color: "#7FE87F",
            borderRadius: "8px",
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          <Languages size={13} />
          <span>{isAr ? "EN" : "عربي"}</span>
        </button>

        {/* Admin User Chip */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "5px 10px",
          background: "#121A2D",
          borderRadius: "8px",
          border: "1px solid var(--border-subtle)"
        }}>
          <div style={{
            width: "26px",
            height: "26px",
            borderRadius: "6px",
            background: "#7FE87F",
            color: "#080C14",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11.5px"
          }}>
            {currentUser.avatar}
          </div>
          <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#FFFFFF" }}>
            {currentUser.name}
          </span>
        </div>

        {/* Clear Header Logout Button */}
        <button
          onClick={onLogout}
          style={{
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#F87171",
            borderRadius: "8px",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          <LogOut size={14} />
          <span>{isAr ? "خروج" : "Logout"}</span>
        </button>
      </div>
    </header>
  );
};
