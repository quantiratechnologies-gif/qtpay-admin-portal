import React, { useState, useRef, useEffect } from "react";
import {
  Store,
  Activity,
  Zap,
  TrendingUp,
  SmartphoneNfc,
  ArrowDownLeft,
  ArrowRight,
  ArrowLeft,
  Users,
  ChevronDown,
  LogOut
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { StatusBadge } from "../components/Badge";
import { MdrRevenueModal } from "../components/MdrRevenueModal";
import { SalesAnalyticsModal, SalesPeriod } from "../components/SalesAnalyticsModal";
import { useTranslation } from "../lib/i18n/LanguageContext";
import type { PlatformTransaction, Merchant, CustomerUser, RiskAlert } from "../types";

interface ExecutiveDashboardProps {
  transactions: PlatformTransaction[];
  merchants: Merchant[];
  customers?: CustomerUser[];
  riskAlerts: RiskAlert[];
  lang?: "en" | "ar";
  onSelectTab?: (tab: any) => void;
  onLogout?: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  transactions,
  merchants,
  customers = [],
  onSelectTab,
  onLogout
}) => {
  const { isAr, t, formatCurrency, formatDate } = useTranslation();
  const [isMdrModalOpen, setIsMdrModalOpen] = useState(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [salesPeriod, setSalesPeriod] = useState<SalesPeriod>("yearly");
  const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState(false);
  const [isMerchantDropdownOpen, setIsMerchantDropdownOpen] = useState(false);

  const merchantDropdownRef = useRef<HTMLDivElement>(null);
  const salesDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        merchantDropdownRef.current &&
        !merchantDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMerchantDropdownOpen(false);
      }
      if (
        salesDropdownRef.current &&
        !salesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSalesDropdownOpen(false);
      }
    };
    if (isMerchantDropdownOpen || isSalesDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMerchantDropdownOpen, isSalesDropdownOpen]);

  const totalMerchantsCount = merchants.length;
  const activeMerchantsCount = merchants.filter((m) => m.status === "active").length;
  const inactiveMerchantsCount = merchants.filter((m) => m.status !== "active").length;
  const totalTerminalsCount = merchants.reduce((sum, m) => sum + (m.activeTerminals || 0), 0);

  // Dynamic Sales Metrics for Yearly / Monthly / Weekly
  const salesMetrics = {
    yearly: {
      label: t("salesModal.yearlySales"),
      value: 58234800,
      growth: "+34.2%",
      growthLabel: isAr ? "نمو سنوي (YoY)" : "YoY"
    },
    monthly: {
      label: t("salesModal.monthlySales"),
      value: 4852900,
      growth: "+24.8%",
      growthLabel: isAr ? "نمو شهري (MoM)" : "MoM"
    },
    weekly: {
      label: t("salesModal.weeklySales"),
      value: 1213225,
      growth: "+8.6%",
      growthLabel: isAr ? "نمو أسبوعي (WoW)" : "WoW"
    }
  };

  const activeSales = salesMetrics[salesPeriod];

  const totalUserValue = customers.reduce(
    (sum, c) => sum + (Number(c.totalTransferredSar) || 0),
    0
  );

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-4">

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Sales / Gross GMV with Period Dropdown & Click to Analyze */}
        <div className="relative" ref={salesDropdownRef}>
          <Card
            onClick={() => setIsSalesModalOpen(true)}
            className="p-4 space-y-2 border-[#7FE87F]/35 bg-gradient-to-b from-[#182236] to-[#111726] hover:border-[#7FE87F] hover:shadow-xl hover:shadow-[#7FE87F]/10 transition-all cursor-pointer group relative overflow-hidden h-full select-none"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#7FE87F] font-bold">
                {activeSales.label}
              </span>

              {/* Period Dropdown Button */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSalesDropdownOpen(!isSalesDropdownOpen);
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#7FE87F]/15 border border-[#7FE87F]/35 text-[#7FE87F] hover:bg-[#7FE87F]/25 text-[10px] font-extrabold transition-all cursor-pointer shadow-sm"
              >
                <span>
                  {salesPeriod === "yearly"
                    ? t("salesModal.periodYearly")
                    : salesPeriod === "monthly"
                    ? t("salesModal.periodMonthly")
                    : t("salesModal.periodWeekly")}
                </span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${
                    isSalesDropdownOpen ? "rotate-180 text-[#7FE87F]" : ""
                  }`}
                />
              </div>
            </div>

            <div className="text-2xl font-black text-white text-glow-primary tracking-tight tabular-nums group-hover:text-[#7FE87F] transition-colors">
              {formatCurrency(activeSales.value, { decimals: 0 })}
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-xs text-[#7FE87F] font-bold">
                <TrendingUp className="h-3.5 w-3.5 text-[#7FE87F]" /> {activeSales.growth} {activeSales.growthLabel}
              </div>
              <span className="text-[10px] text-[#7FE87F] font-bold flex items-center gap-0.5 group-hover:underline">
                {t("salesModal.viewAnalysis")}
              </span>
            </div>
          </Card>

          {/* Interactive Dropdown Menu */}
          {isSalesDropdownOpen && (
            <div
              className={`absolute top-full mt-2 bg-[#111726] border border-[#7FE87F]/40 rounded-xl p-1.5 shadow-2xl z-40 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl min-w-[200px] ${
                isAr ? "left-0" : "right-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-2 py-1 text-[10px] font-bold text-[#6E6E85] border-b border-[#2C2C44] pb-1">
                {isAr ? "اختر الفترة الزمنية" : "Select Time Period"}
              </div>

              {/* Option 1: Yearly */}
              <button
                onClick={() => {
                  setSalesPeriod("yearly");
                  setIsSalesDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  salesPeriod === "yearly"
                    ? "bg-gradient-to-r from-[#7FE87F]/25 to-[#6FD86F]/15 text-[#7FE87F] border border-[#7FE87F]/40"
                    : "text-[#A2A2BA] hover:text-white hover:bg-[#182236]"
                }`}
              >
                <span>{t("salesModal.yearlySales")}</span>
                <span className="text-[10px] text-[#7FE87F] font-mono">+34.2%</span>
              </button>

              {/* Option 2: Monthly */}
              <button
                onClick={() => {
                  setSalesPeriod("monthly");
                  setIsSalesDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  salesPeriod === "monthly"
                    ? "bg-gradient-to-r from-[#7FE87F]/25 to-[#6FD86F]/15 text-[#7FE87F] border border-[#7FE87F]/40"
                    : "text-[#A2A2BA] hover:text-white hover:bg-[#182236]"
                }`}
              >
                <span>{t("salesModal.monthlySales")}</span>
                <span className="text-[10px] text-[#7FE87F] font-mono">+24.8%</span>
              </button>

              {/* Option 3: Weekly */}
              <button
                onClick={() => {
                  setSalesPeriod("weekly");
                  setIsSalesDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  salesPeriod === "weekly"
                    ? "bg-gradient-to-r from-[#7FE87F]/25 to-[#6FD86F]/15 text-[#7FE87F] border border-[#7FE87F]/40"
                    : "text-[#A2A2BA] hover:text-white hover:bg-[#182236]"
                }`}
              >
                <span>{t("salesModal.weeklySales")}</span>
                <span className="text-[10px] text-[#7FE87F] font-mono">+8.6%</span>
              </button>
            </div>
          )}
        </div>

        {/* Card 2: User Value */}
        <Card className="p-4 space-y-2 border-[#2C2C44] hover:border-[#7FE87F]/60 group transition-all">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#A2A2BA] font-medium group-hover:text-[#7FE87F] transition-colors">
              {t("dashboard.userValue")}
            </span>
            <div className="p-1.5 rounded-lg bg-[#7FE87F]/10 text-[#7FE87F] border border-[#7FE87F]/25 group-hover:bg-[#7FE87F]/20 group-hover:border-[#7FE87F]/45 transition-all shadow-sm shadow-[#7FE87F]/10">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight tabular-nums group-hover:text-[#7FE87F] transition-colors">
            {formatCurrency(totalUserValue, { decimals: 0 })}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#7FE87F] font-bold">
            <TrendingUp className="h-3.5 w-3.5 text-[#7FE87F]" /> {t("dashboard.vsYesterday")}
          </div>
        </Card>

        {/* Card 3: MDR Revenue */}
        <Card
          onClick={() => setIsMdrModalOpen(true)}
          className="p-4 space-y-2 cursor-pointer border-[#7FE87F]/35 bg-gradient-to-b from-[#182236] to-[#111726] hover:border-[#7FE87F] hover:shadow-lg hover:shadow-[#7FE87F]/10 transition-all group relative overflow-hidden"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#7FE87F] font-bold">
              {t("dashboard.mdrRevenue")}
            </span>
            <div className="p-1.5 rounded-lg bg-[#7FE87F]/20 text-[#7FE87F] border border-[#7FE87F]/40 group-hover:bg-[#7FE87F]/30 transition-colors shadow-sm shadow-[#7FE87F]/20">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#7FE87F] text-glow-primary tracking-tight tabular-nums">
            {formatCurrency(Math.round(activeSales.value * 0.01), { decimals: 0 })}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A2A2BA] font-semibold">{activeSales.label} · 1.0% {isAr ? "متوسط العمولة" : "avg take"}</span>
            <span className="text-[10px] text-[#7FE87F] font-bold flex items-center gap-0.5 group-hover:underline">
              {t("dashboard.viewDetails")}
            </span>
          </div>
        </Card>

        {/* Card 4: Total Merchants with Interactive Active/Inactive Dropdown */}
        <div className="relative" ref={merchantDropdownRef}>
          <Card
            onClick={() => setIsMerchantDropdownOpen(!isMerchantDropdownOpen)}
            className={`p-4 space-y-2 cursor-pointer transition-all relative overflow-hidden group h-full select-none ${
              isMerchantDropdownOpen
                ? "border-[#7FE87F] bg-[#182236] ring-1 ring-[#7FE87F]/50 shadow-xl shadow-[#7FE87F]/15"
                : "hover:border-[#7FE87F]/50 hover:bg-[#182236]/60"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#A2A2BA] font-medium group-hover:text-[#7FE87F] transition-colors">
                {t("dashboard.totalMerchants")}
              </span>
              <div className="p-1.5 rounded-lg bg-[#7FE87F]/10 text-[#7FE87F] border border-[#7FE87F]/20 group-hover:bg-[#7FE87F]/25 transition-colors">
                <Store className="h-4 w-4" />
              </div>
            </div>

            <div className="text-2xl font-extrabold text-white tracking-tight tabular-nums group-hover:text-[#7FE87F] transition-colors">
              {totalMerchantsCount} {isAr ? "تجار" : "Merchants"}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#7FE87F] font-semibold">{totalTerminalsCount} {isAr ? "نقطة بيع" : "SoftPOS"}</span>
              <span className="text-[10px] text-[#A2A2BA] group-hover:text-[#7FE87F] font-bold flex items-center gap-1">
                {t("dashboard.statusBreakdown")}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isMerchantDropdownOpen ? "rotate-180 text-[#7FE87F]" : ""
                  }`}
                />
              </span>
            </div>
          </Card>

          {/* Dropdown Menu with 2 Interactive Buttons */}
          {isMerchantDropdownOpen && (
            <div className={`absolute top-full mt-2 bg-[#111726] border border-[#7FE87F]/40 rounded-xl p-2.5 shadow-2xl z-40 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl min-w-[260px] ${
              isAr ? "left-0" : "right-0"
            }`}>
              <div className="px-1 py-0.5 flex items-center justify-between text-[11px] font-bold text-[#A2A2BA] border-b border-[#2C2C44] pb-1.5">
                <span>{t("mdrModal.byMerchantStatus")}</span>
                <span className="text-[#7FE87F] font-mono font-bold">{totalMerchantsCount} {isAr ? "إجمالي" : "Total"}</span>
              </div>

              {/* Button 1: Active Merchants */}
              <div
                onClick={() => {
                  setIsMerchantDropdownOpen(false);
                  onSelectTab?.("merchants");
                }}
                className="w-full text-left p-2.5 rounded-lg bg-[#7FE87F]/10 border border-[#7FE87F]/25 hover:bg-[#7FE87F]/20 hover:border-[#7FE87F]/45 transition-all flex items-center justify-between group/btn cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#7FE87F] shadow-[0_0_8px_#7FE87F] animate-pulse flex-shrink-0" />
                  <div>
                    <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <span>{t("dashboard.activeMerchants")}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#7FE87F]/20 text-[#7FE87F] font-bold">
                        {Math.round((activeMerchantsCount / (totalMerchantsCount || 1)) * 100)}%
                      </span>
                    </div>
                    <div className="text-[10.5px] text-[#A2A2BA]">
                      {t("dashboard.activeSoftposProcessing")}
                    </div>
                  </div>
                </div>
                <div className={`${isAr ? "text-left" : "text-right"} flex-shrink-0 pl-2 pr-2`}>
                  <div className="text-lg font-black text-[#7FE87F] tabular-nums">
                    {activeMerchantsCount}
                  </div>
                  <div className="text-[9.5px] text-[#A2A2BA] uppercase font-semibold">
                    {t("common.active")}
                  </div>
                </div>
              </div>

              {/* Button 2: Inactive Merchants */}
              <div
                onClick={() => {
                  setIsMerchantDropdownOpen(false);
                  onSelectTab?.("merchants");
                }}
                className="w-full text-left p-2.5 rounded-lg bg-[#182236] border border-[#2C2C44] hover:bg-[#1E293B] transition-all flex items-center justify-between group/btn cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <span>{t("dashboard.inactiveMerchants")}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">
                        {Math.round((inactiveMerchantsCount / (totalMerchantsCount || 1)) * 100)}%
                      </span>
                    </div>
                    <div className="text-[10.5px] text-[#A2A2BA]">
                      {t("dashboard.inactiveReviewHold")}
                    </div>
                  </div>
                </div>
                <div className={`${isAr ? "text-left" : "text-right"} flex-shrink-0 pl-2 pr-2`}>
                  <div className="text-lg font-black text-amber-400 tabular-nums">
                    {inactiveMerchantsCount}
                  </div>
                  <div className="text-[9.5px] text-[#A2A2BA] uppercase font-semibold">
                    {t("common.inactive")}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Realtime Live Transaction Stream Card */}
      <Card className="p-4 sm:p-5 space-y-3 bg-[#111726]/80 border-[#2C2C44]">
        <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#7FE87F]/10 text-[#7FE87F]">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {t("dashboard.liveStreamTitle")}
              </h3>
              <p className="text-[11px] text-[#A2A2BA]">{t("dashboard.liveStreamSubtitle")}</p>
            </div>
          </div>
          <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-wider">
            <span className="live-indicator w-1 h-1" /> {t("common.liveStream")}
          </Badge>
        </div>

        <div className="space-y-2.5">
          {transactions.slice(0, 5).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 bg-[#111726] rounded-xl border border-[#2C2C44] hover:border-[#7FE87F]/35 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tx.paymentMethod === "mada"
                      ? "bg-[#7FE87F]/15 text-[#7FE87F] border border-[#7FE87F]/25"
                      : "bg-[#182236] text-slate-300 border border-[#2C2C44]"
                  }`}
                >
                  {tx.channel === "pos_softpos" ? (
                    <SmartphoneNfc className="h-4 w-4" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{tx.senderName}</span>
                    <ArrowIcon className="h-3 w-3 text-[#6E6E85]" />
                    <span className="text-[#7FE87F] font-semibold">{tx.receiverName}</span>
                  </div>
                  <div className="text-[10px] text-[#A2A2BA] tabular-nums">
                    {tx.orderRef} • {formatDate(tx.timestamp, "time")}
                  </div>
                </div>
              </div>

              <div className={isAr ? "text-left" : "text-right"}>
                <div className={`text-xs font-extrabold tabular-nums ${tx.status === "refunded" ? "text-amber-400" : "text-[#7FE87F]"}`}>
                  {tx.status === "refunded" ? "−" : "+"}{formatCurrency(tx.amount)}
                </div>
                <div className="mt-1">
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* MDR Revenue Analytics Modal */}
      <MdrRevenueModal
        isOpen={isMdrModalOpen}
        onClose={() => setIsMdrModalOpen(false)}
        merchants={merchants}
        transactions={transactions}
      />

      {/* Sales & Volume Analytics Modal */}
      <SalesAnalyticsModal
        isOpen={isSalesModalOpen}
        onClose={() => setIsSalesModalOpen(false)}
        initialPeriod={salesPeriod}
      />
    </div>
  );
};
