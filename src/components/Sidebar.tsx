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
    <aside className={`w-60 min-h-screen bg-[#0A0F1D] flex flex-col justify-between flex-shrink-0 z-40 ${
      isAr ? "border-l border-slate-800/80" : "border-r border-slate-800/80"
    }`}>
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7FE87F] to-[#059669] flex items-center justify-center text-[#080C14] font-black text-lg shadow-[0_0_16px_rgba(127,232,127,0.35)]">
            QP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white tracking-tight">
                QTPay
              </span>
              <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded bg-[#7FE87F]/15 text-[#7FE87F] border border-[#7FE87F]/30">
                ADMIN
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-xs font-semibold cursor-pointer ${
                  isActive
                    ? "bg-[#7FE87F]/10 border-[#7FE87F]/30 text-[#7FE87F]"
                    : "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40"
                } ${isAr ? "text-right" : "text-left"}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#7FE87F]" : "text-slate-400"}`} />
                  <span>{isAr ? item.labelAr : item.labelEn}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 border ${
                    item.badge === "Live"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  }`}>
                    {item.badge === "Live" && <span className="live-indicator w-1 h-1" />}
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-black/20">
        <div className="flex items-center gap-2">
          <span className="live-indicator w-1.5 h-1.5" />
          <span className="text-xs font-bold text-emerald-400">
            Central Node Active
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-1">
          v1.0.0 • QTPay Admin Engine
        </div>
      </div>
    </aside>
  );
};
