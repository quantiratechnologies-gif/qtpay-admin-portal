import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Store,
  Users,
  ReceiptText,
  Settings
} from "lucide-react";
import { Logo } from "./Logo";
import { useTranslation } from "../lib/i18n/LanguageContext";

export type NavTab = "dashboard" | "insights" | "merchants" | "consumers" | "ledger" | "settings";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  lang?: "en" | "ar";
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab
}) => {
  const { isAr, t } = useTranslation();

  const navItems: { id: NavTab; label: string; icon: any; badge?: string }[] = [
    { id: "dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { id: "insights", label: t("nav.insights"), icon: BarChart3, badge: t("nav.newBadge") },
    { id: "merchants", label: t("nav.merchants"), icon: Store, badge: "5" },
    { id: "consumers", label: t("nav.consumers"), icon: Users },
    { id: "ledger", label: t("nav.transactions"), icon: ReceiptText, badge: t("nav.liveBadge") },
    { id: "settings", label: t("nav.settings"), icon: Settings },
  ];

  return (
    <aside className={`w-60 min-h-screen bg-[#080C14]/95 backdrop-blur-xl flex flex-col justify-between flex-shrink-0 z-40 relative ${
      isAr ? "border-l border-[#2C2C44] shadow-2xl" : "border-r border-[#2C2C44] shadow-2xl"
    }`}>
      <div>
        {/* Brand Header with custom SVG Logo */}
        <div className="p-4 border-b border-[#2C2C44] flex items-center justify-between relative bg-gradient-to-r from-[#111726] to-[#080C14]">
          <div className="flex items-center gap-2">
            <Logo height={28} textColor="#FFFFFF" accentColor="#7FE87F" />
            <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#7FE87F]/15 text-[#7FE87F] border border-[#7FE87F]/40 tracking-wider shadow-sm shadow-[#7FE87F]/20">
              {isAr ? "لوحة الإدارة" : "ADMIN"}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isLiveBadge = item.badge === t("nav.liveBadge") || item.badge === "Live" || item.badge === "مباشر";
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-xs font-semibold cursor-pointer relative ${
                  isActive
                    ? "bg-gradient-to-r from-[#7FE87F]/25 via-[#6FD86F]/15 to-[#7FE87F]/10 border-[#7FE87F]/50 text-[#7FE87F] shadow-md shadow-[#7FE87F]/15 font-bold before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[#7FE87F]/50 before:to-transparent"
                    : "bg-transparent border-transparent text-[#A2A2BA] hover:text-white hover:bg-[#182236] hover:border-[#2C2C44]"
                } ${isAr ? "text-right" : "text-left"}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-[#7FE87F] drop-shadow-[0_0_6px_rgba(127,232,127,0.4)]" : "text-[#A2A2BA]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 border ${
                    isLiveBadge || item.badge === t("nav.newBadge") || item.badge === "New" || item.badge === "جديد"
                      ? "bg-[#7FE87F]/25 text-[#7FE87F] border-[#7FE87F]/45 shadow-sm shadow-[#7FE87F]/20"
                      : "bg-[#182236] text-[#A2A2BA] border-[#2C2C44]"
                  }`}>
                    {isLiveBadge && <span className="live-indicator w-1 h-1" />}
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-[#2C2C44] bg-[#070D0A]">
        <div className="flex items-center gap-2">
          <span className="live-indicator w-1.5 h-1.5" />
          <span className="text-xs font-bold text-[#7FE87F]">
            {t("common.centralNodeActive")}
          </span>
        </div>
        <div className="text-[10px] text-[#A2A2BA] mt-1">
          {t("common.version")} • {t("common.engineSubtitle")}
        </div>
      </div>
    </aside>
  );
};
