import React, { useState } from "react";
import {
  X,
  TrendingUp,
  Calendar,
  CreditCard,
  SmartphoneNfc,
  Store,
  Zap,
  ArrowUpRight,
  Download,
  ShoppingBag,
  Utensils,
  Laptop,
  HeartPulse,
  Activity
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useTranslation } from "../lib/i18n/LanguageContext";
import { mockMerchants } from "../services/mockData";

export type SalesPeriod = "yearly" | "monthly" | "weekly";

interface SalesAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPeriod?: SalesPeriod;
  lang?: "en" | "ar";
}

export const SalesAnalyticsModal: React.FC<SalesAnalyticsModalProps> = ({
  isOpen,
  onClose,
  initialPeriod = "yearly"
}) => {
  const { isAr, t, formatCurrency, formatNumber, formatPercent } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<SalesPeriod>(initialPeriod);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  // Period-specific sales data
  const periodData = {
    yearly: {
      title: isAr ? "المبيعات السنوية (2026)" : "Yearly Sales (2026)",
      periodLabel: t("salesModal.periodYearly"),
      grossVolumeSar: 58234800,
      settledVolumeSar: 57652452,
      txCount: 335640,
      avgTicketSar: 173.50,
      growthRate: "+34.2%",
      growthLabel: isAr ? "نمو سنوي (YoY)" : "YoY Growth",
      peakPeriod: isAr ? "نوفمبر (عروض يوم التأسيس والجمعة)" : "November (White Friday / Founding Day)",
      chartBars: [
        { label: isAr ? "يناير" : "Jan", value: 4100000, tx: 23600 },
        { label: isAr ? "فبراير" : "Feb", value: 4350000, tx: 25100 },
        { label: isAr ? "مارس" : "Mar", value: 4600000, tx: 26500 },
        { label: isAr ? "أبريل" : "Apr", value: 4720000, tx: 27200 },
        { label: isAr ? "مايو" : "May", value: 4890000, tx: 28200 },
        { label: isAr ? "يونيو" : "Jun", value: 4950000, tx: 28500 },
        { label: isAr ? "يوليو" : "Jul", value: 4820000, tx: 27800 },
        { label: isAr ? "أغسطس" : "Aug", value: 5050000, tx: 29100 },
        { label: isAr ? "سبتمبر" : "Sep", value: 5200000, tx: 29900 },
        { label: isAr ? "أكتوبر" : "Oct", value: 5120000, tx: 29500 },
        { label: isAr ? "نوفمبر" : "Nov", value: 5580000, tx: 32100 },
        { label: isAr ? "ديسمبر" : "Dec", value: 4854800, tx: 28140 },
      ]
    },
    monthly: {
      title: isAr ? "المبيعات الشهرية (الشهر الحالي)" : "Monthly Sales (Current Month)",
      periodLabel: t("salesModal.periodMonthly"),
      grossVolumeSar: 4852900,
      settledVolumeSar: 4804371,
      txCount: 27970,
      avgTicketSar: 173.50,
      growthRate: "+24.8%",
      growthLabel: isAr ? "نمو شهري (MoM)" : "MoM Growth",
      peakPeriod: isAr ? "يوم 27 (إيداع الرواتب)" : "Day 27 (Payroll Day)",
      chartBars: [
        { label: isAr ? "الأسبوع 1" : "Week 1", value: 1120000, tx: 6450 },
        { label: isAr ? "الأسبوع 2" : "Week 2", value: 1185000, tx: 6830 },
        { label: isAr ? "الأسبوع 3" : "Week 3", value: 1210000, tx: 6970 },
        { label: isAr ? "الأسبوع 4" : "Week 4", value: 1337900, tx: 7720 },
      ]
    },
    weekly: {
      title: isAr ? "المبيعات الأسبوعية (الأسبوع الحالي)" : "Weekly Sales (Current Week)",
      periodLabel: t("salesModal.periodWeekly"),
      grossVolumeSar: 1213225,
      settledVolumeSar: 1201092,
      txCount: 6990,
      avgTicketSar: 173.50,
      growthRate: "+8.6%",
      growthLabel: isAr ? "نمو أسبوعي (WoW)" : "WoW Growth",
      peakPeriod: isAr ? "يوم الخميس (عطلة نهاية الأسبوع)" : "Thursday (Weekend Shopping Peak)",
      chartBars: [
        { label: isAr ? "السبت" : "Sat", value: 165000, tx: 950 },
        { label: isAr ? "الأحد" : "Sun", value: 152000, tx: 875 },
        { label: isAr ? "الإثنين" : "Mon", value: 158000, tx: 910 },
        { label: isAr ? "الثلاثاء" : "Tue", value: 162000, tx: 935 },
        { label: isAr ? "الأربعاء" : "Wed", value: 178000, tx: 1025 },
        { label: isAr ? "الخميس" : "Thu", value: 218225, tx: 1255 },
        { label: isAr ? "الجمعة" : "Fri", value: 180000, tx: 1040 },
      ]
    }
  };

  const current = periodData[selectedPeriod];
  const maxBarValue = Math.max(...current.chartBars.map((b) => b.value));

  // Payment Rails breakdown for active period
  const paymentRails = [
    {
      name: isAr ? "مدى (نقاط البيع والبطاقات)" : "mada (SoftPOS & Cards)",
      share: 58,
      volume: current.grossVolumeSar * 0.58,
      color: "#7FE87F",
      icon: SmartphoneNfc
    },
    {
      name: isAr ? "أبل باي (NFC)" : "Apple Pay (NFC)",
      share: 24,
      volume: current.grossVolumeSar * 0.24,
      color: "#6FD86F",
      icon: SmartphoneNfc
    },
    {
      name: isAr ? "فيزا وماستركارد" : "Visa & Mastercard",
      share: 12,
      volume: current.grossVolumeSar * 0.12,
      color: "#A2A2BA",
      icon: CreditCard
    },
    {
      name: isAr ? "سريع للتحويل الفوري (P2M)" : "Sarie Instant P2M",
      share: 6,
      volume: current.grossVolumeSar * 0.06,
      color: "#6E6E85",
      icon: Zap
    }
  ];

  // Sector breakdown
  const sectorContributions = [
    {
      name: isAr ? "التجزئة والسوبرماركت" : "Retail & Supermarkets",
      share: 42,
      volume: current.grossVolumeSar * 0.42,
      icon: ShoppingBag,
      color: "#7FE87F"
    },
    {
      name: isAr ? "المطاعم والمقاهي" : "Restaurants & Cafes",
      share: 28,
      volume: current.grossVolumeSar * 0.28,
      icon: Utensils,
      color: "#6FD86F"
    },
    {
      name: isAr ? "الإلكترونيات والتقنية" : "Electronics & Tech",
      share: 16,
      volume: current.grossVolumeSar * 0.16,
      icon: Laptop,
      color: "#5FBF5F"
    },
    {
      name: isAr ? "الرعاية الصحية والخدمات" : "Healthcare & Services",
      share: 14,
      volume: current.grossVolumeSar * 0.14,
      icon: HeartPulse,
      color: "#A2A2BA"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-gradient-to-b from-[#182236] to-[#111726] border border-[#7FE87F]/35 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-black/90 overflow-hidden relative before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-[#7FE87F]/60 before:to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Period Switcher */}
        <div className="p-4 sm:p-5 border-b border-[#2C2C44] flex items-center justify-between flex-wrap gap-3 bg-gradient-to-r from-[#182236] to-[#111726]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#7FE87F]/15 border border-[#7FE87F]/35 text-[#7FE87F] shadow-sm shadow-[#7FE87F]/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  {t("salesModal.title")}
                </h2>
                <Badge variant="primary" className="text-[10px] uppercase font-bold shadow-sm shadow-[#7FE87F]/20">
                  {current.periodLabel}
                </Badge>
              </div>
              <p className="text-xs text-[#A2A2BA] mt-0.5">
                {t("salesModal.subtitle")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Period Switcher Pills */}
            <div className="flex items-center bg-[#111726] border border-[#2C2C44] rounded-xl p-1 gap-1">
              {(["yearly", "monthly", "weekly"] as SalesPeriod[]).map((period) => {
                const isSelected = selectedPeriod === period;
                const label =
                  period === "yearly"
                    ? t("salesModal.periodYearly")
                    : period === "monthly"
                    ? t("salesModal.periodMonthly")
                    : t("salesModal.periodWeekly");
                return (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-[#7FE87F] to-[#6FD86F] text-[#080C14] shadow-md shadow-[#7FE87F]/20 font-black"
                        : "text-[#A2A2BA] hover:text-white hover:bg-[#182236]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#182236] hover:bg-[#1E293B] text-[#A2A2BA] hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#080C14]">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {/* KPI 1: Gross Sales */}
            <div className="bg-gradient-to-b from-[#182236] to-[#111726] border border-[#7FE87F]/35 rounded-xl p-3.5 space-y-1 relative shadow-md">
              <span className="text-[11px] font-medium text-[#A2A2BA] block">
                {t("salesModal.grossVolume")}
              </span>
              <div className="text-xl font-black text-[#7FE87F] text-glow-primary tabular-nums">
                {formatCurrency(current.grossVolumeSar, { decimals: 0 })}
              </div>
              <span className="text-[10px] text-[#7FE87F] font-bold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> {current.growthRate} {current.growthLabel}
              </span>
            </div>

            {/* KPI 2: Net Settled */}
            <div className="bg-[#111726] border border-[#2C2C44] rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] font-medium text-[#A2A2BA] block">
                {t("salesModal.settledVolume")}
              </span>
              <div className="text-xl font-black text-white tabular-nums">
                {formatCurrency(current.settledVolumeSar, { decimals: 0 })}
              </div>
              <span className="text-[10px] text-[#7FE87F] font-semibold">
                99.0% {isAr ? "نسبة التسوية الصافية" : "net clearance"}
              </span>
            </div>

            {/* KPI 3: Total Operations */}
            <div className="bg-[#111726] border border-[#2C2C44] rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] font-medium text-[#A2A2BA] block">
                {t("salesModal.totalTransactions")}
              </span>
              <div className="text-xl font-black text-white tabular-nums">
                {formatNumber(current.txCount)}
              </div>
              <span className="text-[10px] text-[#A2A2BA]">
                {isAr ? "عملية مدفوعات معتمدة" : "settled payment ops"}
              </span>
            </div>

            {/* KPI 4: Avg Ticket */}
            <div className="bg-[#111726] border border-[#2C2C44] rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] font-medium text-[#A2A2BA] block">
                {t("salesModal.avgTicketSize")}
              </span>
              <div className="text-xl font-black text-[#7FE87F] tabular-nums">
                {formatCurrency(current.avgTicketSar)}
              </div>
              <span className="text-[10px] text-[#A2A2BA] truncate block" title={current.peakPeriod}>
                {current.peakPeriod}
              </span>
            </div>
          </div>

          {/* Sales Trajectory Bar Chart */}
          <div className="bg-gradient-to-b from-[#182236] to-[#111726] border border-[#2C2C44] rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#2C2C44]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-[#7FE87F]/10 text-[#7FE87F]">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {t("salesModal.salesTrendTitle")} ({current.periodLabel})
                  </h3>
                  <p className="text-[11px] text-[#A2A2BA]">
                    {isAr ? "مخطط الأداء وتوزيع حجم المبيعات عبر الفترة" : "Visual sales volume distribution across the timeline"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[11px] text-[#A2A2BA]">
                  {isAr ? "ذروة المبيعات:" : "Peak Performance:"}
                </span>
                <Badge variant="primary" className="text-[10px] font-bold">
                  {current.peakPeriod}
                </Badge>
              </div>
            </div>

            {/* Interactive Bar Chart */}
            <div className="pt-3">
              <div className="h-48 flex items-end justify-between gap-1.5 sm:gap-2 px-2 pb-2 border-b border-[#2C2C44]">
                {current.chartBars.map((bar, index) => {
                  const heightPercent = Math.max(15, Math.round((bar.value / maxBarValue) * 100));
                  const isHovered = hoveredBarIndex === index;
                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                      onMouseEnter={() => setHoveredBarIndex(index)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                    >
                      {/* Tooltip on Hover */}
                      {isHovered && (
                        <div className="absolute bottom-full mb-2 bg-[#080C14] border border-[#7FE87F]/50 rounded-lg p-2 shadow-2xl z-30 min-w-[130px] pointer-events-none text-center">
                          <div className="text-[10px] font-bold text-[#A2A2BA]">{bar.label}</div>
                          <div className="text-xs font-black text-[#7FE87F] tabular-nums">
                            {formatCurrency(bar.value, { decimals: 0 })}
                          </div>
                          <div className="text-[9px] text-[#A2A2BA] tabular-nums">
                            {formatNumber(bar.tx)} {isAr ? "عملية" : "ops"}
                          </div>
                        </div>
                      )}

                      {/* Bar Fill */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 relative ${
                          isHovered
                            ? "bg-gradient-to-t from-[#7FE87F] to-[#D0FAD0] shadow-lg shadow-[#7FE87F]/30 scale-x-105"
                            : "bg-gradient-to-t from-[#5FBF5F]/70 via-[#6FD86F]/85 to-[#7FE87F] hover:brightness-110"
                        }`}
                      >
                        {/* Top specular glow cap */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-white/60 rounded-t-lg" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bar Labels */}
              <div className="flex justify-between gap-1.5 sm:gap-2 px-2 pt-2">
                {current.chartBars.map((bar, index) => (
                  <div
                    key={index}
                    className={`flex-1 text-center text-[10px] font-semibold transition-colors ${
                      hoveredBarIndex === index ? "text-[#7FE87F] font-bold" : "text-[#A2A2BA]"
                    }`}
                  >
                    {bar.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Two Columns: Channels & Sectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card: Sales by Channel */}
            <div className="bg-[#111726] border border-[#2C2C44] rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#7FE87F]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {t("salesModal.channelBreakdownTitle")}
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-[#7FE87F]">100%</span>
              </div>

              <div className="space-y-3">
                {paymentRails.map((rail, idx) => {
                  const Icon = rail.icon;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-[#7FE87F]" />
                          <span className="font-semibold text-white">{rail.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#7FE87F] tabular-nums">
                            {formatCurrency(rail.volume, { decimals: 0 })}
                          </span>
                          <span className="text-[11px] font-bold text-[#A2A2BA] tabular-nums w-8 text-right">
                            {rail.share}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-[#080C14] rounded-full overflow-hidden border border-[#2C2C44]">
                        <div
                          style={{ width: `${rail.share}%` }}
                          className="h-full bg-gradient-to-r from-[#5FBF5F] to-[#7FE87F] rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card: Commercial Sector Breakdown */}
            <div className="bg-[#111726] border border-[#2C2C44] rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-[#7FE87F]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {t("salesModal.sectorBreakdownTitle")}
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-[#7FE87F]">100%</span>
              </div>

              <div className="space-y-3">
                {sectorContributions.map((sector, idx) => {
                  const Icon = sector.icon;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-[#7FE87F]" />
                          <span className="font-semibold text-white">{sector.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#7FE87F] tabular-nums">
                            {formatCurrency(sector.volume, { decimals: 0 })}
                          </span>
                          <span className="text-[11px] font-bold text-[#A2A2BA] tabular-nums w-8 text-right">
                            {sector.share}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-[#080C14] rounded-full overflow-hidden border border-[#2C2C44]">
                        <div
                          style={{ width: `${sector.share}%` }}
                          className="h-full bg-gradient-to-r from-[#5FBF5F] to-[#7FE87F] rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Merchant Sales Champions */}
          <div className="bg-[#111726] border border-[#2C2C44] rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-[#7FE87F]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {t("salesModal.topMerchantsTitle")}
                </h3>
              </div>
              <span className="text-xs text-[#A2A2BA]">
                {isAr ? "حسب حجم مبيعات الفترة" : "Ranked by sales volume"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {mockMerchants.slice(0, 6).map((m, idx) => {
                const multiplier = selectedPeriod === "yearly" ? 12 : selectedPeriod === "weekly" ? 0.25 : 1;
                const merchantPeriodVol = (Number(m.monthlyVolumeSar) || 0) * multiplier;
                return (
                  <div
                    key={m.id}
                    className="p-3 rounded-lg bg-[#182236] border border-[#2C2C44] hover:border-[#7FE87F]/40 transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="text-[10px] w-4 h-4 rounded-full bg-[#7FE87F]/20 text-[#7FE87F] flex items-center justify-center font-black">
                          {idx + 1}
                        </span>
                        <span className="truncate max-w-[130px]">{isAr && m.businessNameAr ? m.businessNameAr : m.businessName}</span>
                      </div>
                      <div className="text-[10px] text-[#A2A2BA]">
                        {m.activeTerminals} {isAr ? "نقطة بيع" : "SoftPOS"} • {m.city}
                      </div>
                    </div>
                    <div className={isAr ? "text-left" : "text-right"}>
                      <div className="text-xs font-black text-[#7FE87F] tabular-nums">
                        {formatCurrency(merchantPeriodVol, { decimals: 0 })}
                      </div>
                      <span className="text-[9px] text-[#7FE87F] font-semibold">
                        {m.status === "active" ? (isAr ? "نشط" : "Active") : (isAr ? "معلق" : "Hold")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-[#2C2C44] bg-[#111726] flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs text-[#A2A2BA]">
            {isAr ? "تمت المزامنة المباشرة مع نظام التسويات المركزية" : "Synced real-time with central settlement clearing"}
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={onClose}
            className="btn-primary-shine px-4 py-1.5 text-xs font-bold"
          >
            {isAr ? "إغلاق التحليل" : "Close Analysis"}
          </Button>
        </div>
      </div>
    </div>
  );
};
