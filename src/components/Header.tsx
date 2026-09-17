import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Languages,
  RefreshCw,
  LogOut,
  ChevronDown,
  ShieldCheck,
  User,
  Zap
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header style={{
      height: "60px",
      backgroundColor: "#0A0F1D",
      borderBottom: "1px solid var(--border-subtle)",
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 30
    }}>
      {/* Search Input */}
      <div style={{ position: "relative", width: "260px" }}>
        <Search
          size={14}
          color="#64748B"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            [isAr ? "right" : "left"]: "10px"
          }}
        />
        <input
          type="text"
          placeholder={isAr ? "بحث سريع (CR, UTR)..." : "Quick Search..."}
          style={{
            width: "100%",
            background: "#121A2D",
            border: "1px solid var(--border-subtle)",
            borderRadius: "7px",
            padding: isAr ? "7px 30px 7px 10px" : "7px 10px 7px 30px",
            color: "#FFFFFF",
            fontSize: "12px",
            outline: "none"
          }}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Live Socket Status */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "5px 9px",
          background: "rgba(16, 185, 129, 0.08)",
          borderRadius: "6px",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          fontSize: "11px",
          color: "#10B981",
          fontWeight: 700
        }}>
          <span className="live-indicator" style={{ width: "5px", height: "5px" }} />
          <span>Live Sync</span>
        </div>

        {/* Refresh Live Button */}
        <button
          onClick={onRefreshData}
          disabled={isRefreshing}
          title={isAr ? "تحديث البيانات" : "Refresh Data"}
          style={{
            background: "#121A2D",
            border: "1px solid var(--border-subtle)",
            color: "#94A3B8",
            borderRadius: "7px",
            padding: "6px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} color="#7FE87F" />
        </button>

        {/* Language Switcher */}
        <button
          onClick={onToggleLang}
          style={{
            background: "rgba(127, 232, 127, 0.08)",
            border: "1px solid rgba(127, 232, 127, 0.25)",
            color: "#7FE87F",
            borderRadius: "7px",
            padding: "5px 9px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "11.5px",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          <Languages size={12} />
          <span>{isAr ? "EN" : "عربي"}</span>
        </button>

        {/* User Profile with Dropdown */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "4px 8px 4px 6px",
              background: "#121A2D",
              borderRadius: "7px",
              border: "1px solid var(--border-subtle)",
              cursor: "pointer"
            }}
          >
            <div style={{
              width: "22px",
              height: "22px",
              borderRadius: "5px",
              background: "#7FE87F",
              color: "#080C14",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10.5px"
            }}>
              {currentUser.avatar}
            </div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#FFFFFF" }}>
              {currentUser.name.split(" ")[0]}
            </span>
            <ChevronDown size={12} color="#94A3B8" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              [isAr ? "left" : "right"]: 0,
              width: "200px",
              background: "#0F1626",
              border: "1px solid var(--border-strong)",
              borderRadius: "10px",
              padding: "8px",
              boxShadow: "0 15px 30px rgba(0,0,0,0.6)",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              zIndex: 50
            }}>
              <div style={{ padding: "6px 8px", borderBottom: "1px solid var(--border-subtle)", marginBottom: "4px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#FFFFFF" }}>{currentUser.name}</div>
                <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "1px" }}>{currentUser.email}</div>
              </div>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogout();
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "7px 8px",
                  borderRadius: "6px",
                  border: "none",
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#F87171",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  textAlign: isAr ? "right" : "left"
                }}
              >
                <LogOut size={13} />
                <span>{isAr ? "تسجيل الخروج" : "Sign Out"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
