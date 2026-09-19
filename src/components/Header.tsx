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
import { useTranslation } from "../lib/i18n/LanguageContext";
import type { AdminUser } from "../types";

interface HeaderProps {
  currentUser: AdminUser;
  onLogout: () => void;
  lang?: "en" | "ar";
  onToggleLang: () => void;
  onRefreshData: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onToggleLang,
  onRefreshData,
  isRefreshing = false
}) => {
  const { isAr, t } = useTranslation();

  return (
    <header className="h-14 bg-[#080C14]/90 backdrop-blur-md border-b border-[#2C2C44] px-4 sm:px-5 flex items-center justify-between sticky top-0 z-30 shadow-md relative before:absolute before:inset-x-0 before:bottom-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[#7FE87F]/25 before:to-transparent">
      {/* Search Input */}
      <div className="relative w-48 sm:w-64">
        <Search
          className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6E6E85] pointer-events-none ${
            isAr ? "right-2.5" : "left-2.5"
          }`}
        />
        <Input
          type="text"
          placeholder={t("common.quickSearch")}
          className={`h-8 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F] focus:ring-1 focus:ring-[#7FE87F]/50 shadow-inner ${
            isAr ? "pr-8 pl-2.5" : "pl-8 pr-2.5"
          }`}
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Live Socket Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-[#7FE87F]/15 to-[#6FD86F]/10 border border-[#7FE87F]/35 rounded-md text-[11px] text-[#7FE87F] font-bold shadow-sm shadow-[#7FE87F]/15">
          <span className="live-indicator w-1.5 h-1.5" />
          <span>{t("common.liveSync")}</span>
        </div>

        {/* Refresh Live Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onRefreshData}
          disabled={isRefreshing}
          title={t("common.refreshData")}
          className="h-8 w-8 bg-[#111726] border-[#2C2C44] text-[#A2A2BA] hover:text-white hover:border-[#7FE87F]/50 hover:shadow-sm hover:shadow-[#7FE87F]/20"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-[#7FE87F] ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>

        {/* Language Switcher */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleLang}
          className="h-8 px-2.5 bg-[#7FE87F]/10 border-[#7FE87F]/40 text-[#7FE87F] hover:bg-[#7FE87F]/25 hover:border-[#7FE87F]/60 text-xs font-bold gap-1.5 shadow-sm shadow-[#7FE87F]/15"
        >
          <Languages className="h-3.5 w-3.5" />
          <span>{isAr ? "English" : "العربية"}</span>
        </Button>

        {/* Exit / Sign Out Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="h-8 px-2.5 bg-red-500/10 border-red-500/35 text-red-400 hover:bg-red-500/20 hover:border-red-500/60 text-xs font-bold gap-1.5 shadow-sm transition-all cursor-pointer"
          title={isAr ? "تسجيل الخروج من النظام" : "Exit Portal / Sign Out"}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{isAr ? "خروج" : "Exit"}</span>
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 bg-[#111726] border-[#2C2C44] text-white hover:bg-[#182236] hover:border-[#7FE87F]/40 gap-2"
            >
              <div className="w-5 h-5 rounded bg-gradient-to-br from-[#7FE87F] to-[#5FBF5F] text-[#080C14] font-extrabold flex items-center justify-center text-[10px] shadow-sm">
                {currentUser.avatar}
              </div>
              <span className="text-xs font-bold truncate max-w-[80px]">
                {isAr ? "عبدالعزيز" : currentUser.name.split(" ")[0]}
              </span>
              <ChevronDown className="h-3 w-3 text-[#A2A2BA]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isAr ? "start" : "end"} className="w-56 bg-[#111726] border-[#2C2C44]">
            <DropdownMenuLabel className="space-y-0.5">
              <div className="font-bold text-xs text-white">
                {isAr ? "م. عبدالعزيز القحطاني" : currentUser.name}
              </div>
              <div className="text-[10px] text-[#A2A2BA] truncate">{currentUser.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#2C2C44]" />
            <DropdownMenuItem
              onClick={onLogout}
              className="text-red-400 focus:bg-red-500/10 focus:text-red-400 font-semibold gap-2 py-2 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{t("nav.signOut")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
