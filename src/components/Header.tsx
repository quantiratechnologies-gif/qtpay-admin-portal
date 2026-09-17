import React from "react";
import {
  Search,
  Languages,
  RefreshCw,
  LogOut,
  ChevronDown
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
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
    <header className="h-14 bg-[#0A0F1D] border-b border-[var(--border-subtle)] px-5 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input */}
      <div className="relative w-64">
        <Search
          className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none ${
            isAr ? "right-2.5" : "left-2.5"
          }`}
        />
        <Input
          type="text"
          placeholder={isAr ? "بحث سريع (CR, UTR)..." : "Quick Search..."}
          className={`h-8 text-xs bg-[#121A2D] border-[var(--border-subtle)] focus:border-[#7FE87F] ${
            isAr ? "pr-8 pl-2.5" : "pl-8 pr-2.5"
          }`}
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Live Socket Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[11px] text-emerald-400 font-bold">
          <span className="live-indicator w-1.5 h-1.5" />
          <span>Live Sync</span>
        </div>

        {/* Refresh Live Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onRefreshData}
          disabled={isRefreshing}
          title={isAr ? "تحديث البيانات" : "Refresh Data"}
          className="h-8 w-8 bg-[#121A2D] border-[var(--border-subtle)] text-slate-400 hover:text-white"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-[#7FE87F] ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>

        {/* Language Switcher */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleLang}
          className="h-8 px-2.5 bg-[#7FE87F]/10 border-[#7FE87F]/30 text-[#7FE87F] hover:bg-[#7FE87F]/20 text-xs font-bold gap-1.5"
        >
          <Languages className="h-3.5 w-3.5" />
          <span>{isAr ? "EN" : "عربي"}</span>
        </Button>

        {/* User Profile Dropdown using Radix DropdownMenu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 bg-[#121A2D] border-[var(--border-subtle)] text-white hover:bg-[#1A243B] gap-2"
            >
              <div className="w-5 h-5 rounded bg-[#7FE87F] text-[#080C14] font-extrabold flex items-center justify-center text-[10px]">
                {currentUser.avatar}
              </div>
              <span className="text-xs font-bold">
                {currentUser.name.split(" ")[0]}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isAr ? "start" : "end"} className="w-52">
            <DropdownMenuLabel className="space-y-0.5">
              <div className="font-bold text-xs text-white">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="text-red-400 focus:bg-red-500/10 focus:text-red-400 font-semibold gap-2 py-2"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{isAr ? "تسجيل الخروج" : "Sign Out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
