import React, { useState } from "react";
import {
  X,
  TrendingUp,
  CreditCard,
  SmartphoneNfc,
  Store,
  Zap,
  ShoppingBag,
  Utensils,
  Laptop,
  HeartPulse,
  Activity,
  PieChart as PieIcon,
  Layers,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { PieChart, PieSliceData } from "./ui/PieChart";
import { useTranslation } from "../lib/i18n/LanguageContext";
import { mockMerchants } from "../services/mockData";

export type SalesPeriod = "yearly" | "monthly" | "weekly";

interface SalesAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPeriod?: SalesPeriod;
  lang?: "en" | "ar";
}

interface MonthData {
  label: string;
  fullLabelEn: string;
  fullLabelAr: string;
  value: number;
  tx: number;
  avgTicket: number;
  growth: string;
  madaPct: number;
  applePct: number;
  visaPct: number;
  sariePct: number;
  retailPct: number;
  foodPct: number;
  techPct: number;
  healthPct: number;
}

export const SalesAnalyticsModal: React.FC<SalesAnalyticsModalProps> = ({
  isOpen,
  onClose,
  initialPeriod = "yearly"
}) => {
  const { isAr, t, formatCurrency, formatNumber } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<SalesPeriod>(initialPeriod);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  // Default to November (index 10) as peak month or 0
  const [selectedBarIndex, setSelectedBarIndex] = useState<number>(10);
  const [pieMode, setPieMode] = useState<"channels" | "sectors">("channels");

  if (!isOpen) return null;

  // Comprehensive 12-Month Detailed Data from Jan to Dec
  const yearlyMonths: MonthData[] = [
    {
      label: isAr ? "يناير" : "Jan",
      fullLabelEn: "January 2026",
      fullLabelAr: "يناير 2026",
      value: 4100000,
      tx: 23600,
      avgTicket: 173.72,
      growth: "+18.2% YoY",
      madaPct: 58,
      applePct: 24,
      visaPct: 12,
      sariePct: 6,
      retailPct: 44,
      foodPct: 26,
      techPct: 16,
      healthPct: 14
    },
    {
      label: isAr ? "فبراير" : "Feb",
      fullLabelEn: "February 2026 (Founding Day)",
      fullLabelAr: "فبراير 2026 (يوم التأسيس)",
      value: 4350000,
      tx: 25100,
      avgTicket: 173.30,
      growth: "+22.4% YoY",
      madaPct: 57,
      applePct: 25,
      visaPct: 12,
      sariePct: 6,
      retailPct: 45,
      foodPct: 27,
      techPct: 15,
      healthPct: 13
    },
    {
      label: isAr ? "مارس" : "Mar",
      fullLabelEn: "March 2026 (Ramadan Season)",
      fullLabelAr: "مارس 2026 (موسم رمضان)",
      value: 4600000,
      tx: 26500,
      avgTicket: 173.58,
      growth: "+26.1% YoY",
      madaPct: 59,
      applePct: 23,
      visaPct: 11,
      sariePct: 7,
      retailPct: 48,
      foodPct: 28,
      techPct: 13,
      healthPct: 11
    },
    {
      label: isAr ? "أبريل" : "Apr",
      fullLabelEn: "April 2026 (Eid Al-Fitr)",
      fullLabelAr: "أبريل 2026 (عيد الفطر المبارك)",
      value: 4720000,
      tx: 27200,
      avgTicket: 173.52,
      growth: "+28.5% YoY",
      madaPct: 58,
      applePct: 24,
      visaPct: 12,
      sariePct: 6,
      retailPct: 46,
      foodPct: 29,
      techPct: 14,
      healthPct: 11
    },
    {
      label: isAr ? "مايو" : "May",
      fullLabelEn: "May 2026",
      fullLabelAr: "مايو 2026",
      value: 4890000,
      tx: 28200,
      avgTicket: 173.40,
      growth: "+29.8% YoY",
      madaPct: 56,
      applePct: 26,
      visaPct: 12,
      sariePct: 6,
      retailPct: 42,
      foodPct: 28,
      techPct: 17,
      healthPct: 13
    },
    {
      label: isAr ? "يونيو" : "Jun",
      fullLabelEn: "June 2026 (Eid Al-Adha / Summer)",
      fullLabelAr: "يونيو 2026 (عيد الأضحى والصيف)",
      value: 4950000,
      tx: 28500,
      avgTicket: 173.68,
      growth: "+31.0% YoY",
      madaPct: 58,
      applePct: 24,
      visaPct: 12,
      sariePct: 6,
      retailPct: 40,
      foodPct: 32,
      techPct: 15,
      healthPct: 13
    },
    {
      label: isAr ? "يوليو" : "Jul",
      fullLabelEn: "July 2026",
      fullLabelAr: "يوليو 2026",
      value: 4820000,
      tx: 27800,
      avgTicket: 173.38,
      growth: "+27.4% YoY",
      madaPct: 57,
      applePct: 25,
      visaPct: 13,
      sariePct: 5,
      retailPct: 38,
      foodPct: 33,
      techPct: 16,
      healthPct: 13
    },
    {
      label: isAr ? "أغسطس" : "Aug",
      fullLabelEn: "August 2026 (Back to School)",
      fullLabelAr: "أغسطس 2026 (العودة للمدارس)",
      value: 5050000,
      tx: 29100,
      avgTicket: 173.53,
      growth: "+33.2% YoY",
      madaPct: 58,
      applePct: 24,
      visaPct: 12,
      sariePct: 6,
      retailPct: 46,
      foodPct: 25,
      techPct: 18,
      healthPct: 11
    },
    {
      label: isAr ? "سبتمبر" : "Sep",
      fullLabelEn: "September 2026 (Saudi National Day 96)",
      fullLabelAr: "سبتمبر 2026 (اليوم الوطني 96)",
      value: 5200000,
      tx: 29900,
      avgTicket: 173.91,
      growth: "+35.6% YoY",
      madaPct: 59,
      applePct: 24,
      visaPct: 11,
      sariePct: 6,
      retailPct: 47,
      foodPct: 26,
      techPct: 16,
      healthPct: 11
    },
    {
      label: isAr ? "أكتوبر" : "Oct",
      fullLabelEn: "October 2026 (Riyadh Season Launch)",
      fullLabelAr: "أكتوبر 2026 (انطلاق موسم الرياض)",
      value: 5120000,
      tx: 29500,
      avgTicket: 173.55,
      growth: "+34.0% YoY",
      madaPct: 58,
      applePct: 25,
      visaPct: 11,
      sariePct: 6,
      retailPct: 41,
      foodPct: 31,
      techPct: 16,
      healthPct: 12
    },
    {
      label: isAr ? "نوفمبر" : "Nov",
      fullLabelEn: "November 2026 (White Friday Peak)",
      fullLabelAr: "نوفمبر 2026 (ذروة الجمعة البيضاء)",
      value: 5580000,
      tx: 32100,
      avgTicket: 173.83,
      growth: "+41.8% YoY",
      madaPct: 60,
      applePct: 24,
      visaPct: 11,
      sariePct: 5,
      retailPct: 51,
      foodPct: 24,
      techPct: 17,
      healthPct: 8
    },
    {
      label: isAr ? "ديسمبر" : "Dec",
      fullLabelEn: "December 2026 (Year-End Surge)",
      fullLabelAr: "ديسمبر 2026 (إغلاق نهاية العام)",
      value: 4854800,
      tx: 28140,
      avgTicket: 172.52,
      growth: "+30.5% YoY",
      madaPct: 58,
      applePct: 24,
      visaPct: 12,
      sariePct: 6,
      retailPct: 43,
      foodPct: 28,
      techPct: 16,
      healthPct: 13
    }
  ];

  // Monthly Period Sub-bars
  const monthlyWeeks: MonthData[] = [
    {
      label: isAr ? "الأسبوع 1" : "Week 1",
      fullLabelEn: "Week 1 (Payroll Window)",
      fullLabelAr: "الأسبوع 1 (فترة الرواتب)",
      value: 1120000,
      tx: 6450,
      avgTicket: 173.64,
      growth: "+21.4%",
      madaPct: 58,
      applePct: 24,
      visaPct: 12,
      sariePct: 6,
      retailPct: 44,
      foodPct: 26,
      techPct: 16,
      healthPct: 14
    },
    {
      label: isAr ? "الأسبوع 2" : "Week 2",
      fullLabelEn: "Week 2 (Mid-Month Flow)",
      fullLabelAr: "الأسبوع 2 (منتصف الشهر)",
      value: 1185000,
      tx: 6830,
      avgTicket: 173.50,
      growth: "+23.1%",
      madaPct: 57,
      applePct: 25,
      visaPct: 12,
      sariePct: 6,
      retailPct: 42,
      foodPct: 28,
      techPct: 16,
      healthPct: 14
    },
    {
      label: isAr ? "الأسبوع 3" : "Week 3",
      fullLabelEn: "Week 3 (Commercial Surge)",
      fullLabelAr: "الأسبوع 3 (الذروة التجارية)",
      value: 1210000,
      tx: 6970,
      avgTicket: 173.60,
      growth: "+25.8%",
      madaPct: 59,
      applePct: 23,
      visaPct: 12,
      sariePct: 6,
      retailPct: 43,
      foodPct: 27,
      techPct: 17,
      healthPct: 13
    },
    {
      label: isAr ? "الأسبوع 4" : "Week 4",
      fullLabelEn: "Week 4 (Month-End Clearance)",
      fullLabelAr: "الأسبوع 4 (إغلاق نهاية الشهر)",
      value: 1337900,
      tx: 7720,
      avgTicket: 173.30,
      growth: "+28.9%",
      madaPct: 60,
      applePct: 24,
      visaPct: 10,
      sariePct: 6,
      retailPct: 48,
      foodPct: 26,
      techPct: 15,
      healthPct: 11
    }
  ];

  // Weekly Period Sub-bars
  const weeklyDays: MonthData[] = [
    {
      label: isAr ? "السبت" : "Sat",
      fullLabelEn: "Saturday",
      fullLabelAr: "السبت",
      value: 165000,
      tx: 950,
      avgTicket: 173.68,
      growth: "+7.2%",
      madaPct: 58,
      applePct: 24,
      visaPct: 12,
      sariePct: 6,
      retailPct: 40,
      foodPct: 35,
      techPct: 15,
      healthPct: 10
    },
    {
      label: isAr ? "الأحد" : "Sun",
      fullLabelEn: "Sunday",
      fullLabelAr: "الأحد",
      value: 152000,
      tx: 875,
      avgTicket: 173.71,
      growth: "+6.8%",
      madaPct: 57,
      applePct: 24,
      visaPct: 13,
      sariePct: 6,
      retailPct: 42,
      foodPct: 28,
      techPct: 16,
      healthPct: 14
    },
    {
      label: isAr ? "الإثنين" : "Mon",
      fullLabelEn: "Monday",
      fullLabelAr: "الإثنين",
      value: 158000,
      tx: 910,
      avgTicket: 173.62,
      growth: "+7.9%",
      madaPct: 58,
      applePct: 24,
      visaPct: 12,
      sariePct: 6,
      retailPct: 43,
      foodPct: 27,
      techPct: 16,
      healthPct: 14
    },
    {
      label: isAr ? "الثلاثاء" : "Tue",
      fullLabelEn: "Tuesday",
      fullLabelAr: "الثلاثاء",
      value: 162000,
      tx: 935,
      avgTicket: 173.26,
      growth: "+8.1%",
      madaPct: 58,
      applePct: 25,
      visaPct: 11,
      sariePct: 6,
      retailPct: 41,
      foodPct: 29,
      techPct: 17,
      healthPct: 13
    },
    {
      label: isAr ? "الأربعاء" : "Wed",
      fullLabelEn: "Wednesday",
      fullLabelAr: "الأربعاء",
      value: 178000,
      tx: 1025,
      avgTicket: 173.65,
      growth: "+9.4%",
      madaPct: 58,
      applePct: 24,
      visaPct: 12,
      sariePct: 6,
      retailPct: 42,
      foodPct: 30,
      techPct: 16,
      healthPct: 12
    },
    {
      label: isAr ? "الخميس" : "Thu",
      fullLabelEn: "Thursday (Weekend Peak)",
      fullLabelAr: "الخميس (ذروة عطلة نهاية الأسبوع)",
      value: 218225,
      tx: 1255,
      avgTicket: 173.88,
      growth: "+12.8%",
      madaPct: 60,
      applePct: 25,
      visaPct: 10,
      sariePct: 5,
      retailPct: 46,
      foodPct: 34,
      techPct: 12,
      healthPct: 8
    },
    {
      label: isAr ? "الجمعة" : "Fri",
      fullLabelEn: "Friday",
      fullLabelAr: "الجمعة",
      value: 180000,
      tx: 1040,
      avgTicket: 173.07,
      growth: "+8.5%",
      madaPct: 59,
      applePct: 24,
      visaPct: 11,
      sariePct: 6,
      retailPct: 38,
      foodPct: 42,
      techPct: 12,
      healthPct: 8
    }
  ];

  const activeBars =
    selectedPeriod === "yearly"
      ? yearlyMonths
      : selectedPeriod === "monthly"
      ? monthlyWeeks
      : weeklyDays;

  const safeSelectedIdx = Math.min(selectedBarIndex, activeBars.length - 1);
  const selectedMonth = activeBars[safeSelectedIdx] || activeBars[0];

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
      peakPeriod: isAr ? "نوفمبر (عروض يوم التأسيس والجمعة)" : "November (White Friday / Founding Day)"
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
      peakPeriod: isAr ? "الأسبوع 4 (إيداع الرواتب)" : "Week 4 (Payroll Day)"
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
      peakPeriod: isAr ? "يوم الخميس (عطلة نهاية الأسبوع)" : "Thursday (Weekend Shopping Peak)"
    }
  };

  const current = periodData[selectedPeriod];
  const maxBarValue = Math.max(...activeBars.map((b) => b.value));

  // Dynamic Pie Chart Slices for Selected Month: Payment Channels
  const selectedMonthChannelSlices: PieSliceData[] = [
    {
      name: isAr ? "مدى (نقاط البيع والبطاقات)" : "mada (SoftPOS & Cards)",
      value: selectedMonth.value * (selectedMonth.madaPct / 100),
      percentage: selectedMonth.madaPct,
      color: "#7FE87F",
      subtext: isAr ? "شبكة مدى الوطنية" : "National Payment Network"
    },
    {
      name: isAr ? "أبل باي (NFC وتطبيق)" : "Apple Pay (NFC & Web)",
      value: selectedMonth.value * (selectedMonth.applePct / 100),
      percentage: selectedMonth.applePct,
      color: "#6FD86F",
      subtext: isAr ? "المدفوعات اللاتلامسية" : "Contactless Mobile"
    },
    {
      name: isAr ? "فيزا وماستركارد" : "Visa & Mastercard",
      value: selectedMonth.value * (selectedMonth.visaPct / 100),
      percentage: selectedMonth.visaPct,
      color: "#A2A2BA",
      subtext: isAr ? "البطاقات الائتمانية الدولية" : "Credit & International"
    },
    {
      name: isAr ? "سريع للتحويل الفوري (P2M)" : "Sarie Instant P2M",
      value: selectedMonth.value * (selectedMonth.sariePct / 100),
      percentage: selectedMonth.sariePct,
      color: "#6E6E85",
      subtext: isAr ? "التحويل البنكي الفوري" : "Instant Bank Settlement"
    }
  ];

  // Dynamic Pie Chart Slices for Selected Month: Commercial Sectors
  const selectedMonthSectorSlices: PieSliceData[] = [
    {
      name: isAr ? "التجزئة والسوبرماركت" : "Retail & Supermarkets",
      value: selectedMonth.value * (selectedMonth.retailPct / 100),
      percentage: selectedMonth.retailPct,
      color: "#7FE87F",
      subtext: isAr ? "متاجر الأغذية والتموينات" : "Groceries & Hypermarkets"
    },
    {
      name: isAr ? "المطاعم والمقاهي (F&B)" : "Restaurants & Cafes",
      value: selectedMonth.value * (selectedMonth.foodPct / 100),
      percentage: selectedMonth.foodPct,
      color: "#6FD86F",
      subtext: isAr ? "المأكولات والمشروبات السريعة" : "Fine Dining & Fast Food"
    },
    {
      name: isAr ? "الإلكترونيات والتقنية" : "Electronics & Tech",
      value: selectedMonth.value * (selectedMonth.techPct / 100),
      percentage: selectedMonth.techPct,
      color: "#5FBF5F",
      subtext: isAr ? "الأجهزة والهواتف والملحقات" : "Gadgets & Hardware"
    },
    {
      name: isAr ? "الرعاية الصحية والخدمات" : "Healthcare & Services",
      value: selectedMonth.value * (selectedMonth.healthPct / 100),
      percentage: selectedMonth.healthPct,
      color: "#A2A2BA",
      subtext: isAr ? "الصيدليات والعيادات الطبية" : "Clinics, Pharmacies & Care"
    }
  ];

  const currentPieSlices = pieMode === "channels" ? selectedMonthChannelSlices : selectedMonthSectorSlices;

  const currentMonthLabel = isAr ? selectedMonth.fullLabelAr : selectedMonth.fullLabelEn;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-gradient-to-b from-[#182236] to-[#111726] border border-[#7FE87F]/35 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl shadow-black/90 overflow-hidden relative before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-[#7FE87F]/60 before:to-transparent"
        onClick={(e) => e.stopPropagation()}
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Header with Period Switcher */}
        <div className="p-4 sm:p-5 border-b border-[#2C2C44] flex items-center justify-between flex-wrap gap-3 bg-gradient-to-r from-[#182236] to-[#111726] shrink-0">
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
                    onClick={() => {
                      setSelectedPeriod(period);
                      setSelectedBarIndex(period === "yearly" ? 10 : 0);
                    }}
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

          {/* Sales Trajectory Bar Chart (Jan - Dec) */}
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
                    {isAr
                      ? "انقر على أي شهر (من يناير إلى ديسمبر) لعرض تحليل المبيعات بمخطط دائري (Pie Chart)"
                      : "Click on any month (Jan - Dec) to inspect its sales in a dynamic Pie Chart"}
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
            <div className="pt-2">
              <div className="h-48 flex items-end justify-between gap-1.5 sm:gap-2 px-2 pb-2 border-b border-[#2C2C44]">
                {activeBars.map((bar, index) => {
                  const heightPercent = Math.max(16, Math.round((bar.value / maxBarValue) * 100));
                  const isHovered = hoveredBarIndex === index;
                  const isSelected = selectedBarIndex === index;
                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                      onClick={() => setSelectedBarIndex(index)}
                      onMouseEnter={() => setHoveredBarIndex(index)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                    >
                      {/* Active Selection Badge Indicator on top */}
                      {isSelected && (
                        <div className="absolute -top-7 px-1.5 py-0.5 rounded-md bg-[#7FE87F] text-[#080C14] text-[9px] font-black uppercase tracking-wider shadow-lg shadow-[#7FE87F]/40 animate-bounce">
                          {bar.label}
                        </div>
                      )}

                      {/* Tooltip on Hover */}
                      {isHovered && !isSelected && (
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
                        className={`w-full max-w-[44px] rounded-t-lg transition-all duration-300 relative ${
                          isSelected
                            ? "bg-gradient-to-t from-[#7FE87F] via-[#9DF79D] to-white shadow-xl shadow-[#7FE87F]/60 ring-2 ring-[#7FE87F] scale-x-110 brightness-110"
                            : isHovered
                            ? "bg-gradient-to-t from-[#7FE87F] to-[#D0FAD0] shadow-lg shadow-[#7FE87F]/30 scale-x-105"
                            : "bg-gradient-to-t from-[#5FBF5F]/70 via-[#6FD86F]/85 to-[#7FE87F] hover:brightness-110"
                        }`}
                      >
                        {/* Top specular glow cap */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-white/70 rounded-t-lg" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bar Month Labels */}
              <div className="flex justify-between gap-1.5 sm:gap-2 px-2 pt-2.5">
                {activeBars.map((bar, index) => {
                  const isSelected = selectedBarIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedBarIndex(index)}
                      className={`flex-1 text-center text-[11px] font-bold transition-all cursor-pointer py-1 rounded-md ${
                        isSelected
                          ? "bg-[#7FE87F]/20 text-[#7FE87F] border border-[#7FE87F]/40 shadow-sm"
                          : hoveredBarIndex === index
                          ? "text-[#7FE87F] bg-[#182236]"
                          : "text-[#A2A2BA] hover:text-white"
                      }`}
                    >
                      {bar.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DYNAMIC MONTHLY PIE CHART BREAKDOWN SECTION */}
          <div className="bg-gradient-to-b from-[#182236] to-[#111726] border border-[#7FE87F]/40 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#7FE87F] before:to-transparent">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2C2C44]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#7FE87F]/15 border border-[#7FE87F]/35 text-[#7FE87F] shadow-md shadow-[#7FE87F]/15">
                  <PieIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-white">
                      {isAr
                        ? `تحليل مبيعات ${currentMonthLabel} (مخطط دائري)`
                        : `${currentMonthLabel} Sales Distribution (Pie Chart)`}
                    </h3>
                    <Badge variant="primary" className="text-[10px] font-bold">
                      {selectedMonth.growth}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#A2A2BA] mt-0.5">
                    {isAr
                      ? "توزيع مبيعات الشهر حسب قنوات الدفع والقطاعات التجارية"
                      : "Detailed volume and percentage share per payment rail & business sector"}
                  </p>
                </div>
              </div>

              {/* Pie Chart Mode Toggle (Channels vs Sectors) */}
              <div className="flex items-center bg-[#0B111E] border border-[#2C2C44] rounded-xl p-1 gap-1 self-start sm:self-auto">
                <button
                  onClick={() => setPieMode("channels")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    pieMode === "channels"
                      ? "bg-[#7FE87F] text-[#080C14] shadow-md shadow-[#7FE87F]/20 font-black"
                      : "text-[#A2A2BA] hover:text-white"
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>{isAr ? "قنوات الدفع" : "Payment Rails"}</span>
                </button>
                <button
                  onClick={() => setPieMode("sectors")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    pieMode === "sectors"
                      ? "bg-[#7FE87F] text-[#080C14] shadow-md shadow-[#7FE87F]/20 font-black"
                      : "text-[#A2A2BA] hover:text-white"
                  }`}
                >
                  <Store className="h-3.5 w-3.5" />
                  <span>{isAr ? "القطاعات التجارية" : "Commercial Sectors"}</span>
                </button>
              </div>
            </div>

            {/* Key Month Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#0B111E]/90 border border-[#2C2C44]">
              <div>
                <span className="text-[10px] text-[#A2A2BA] block font-semibold">
                  {isAr ? "مبيعات هذا الشهر:" : "Month Gross Sales:"}
                </span>
                <span className="text-sm sm:text-base font-black text-[#7FE87F] tabular-nums">
                  {formatCurrency(selectedMonth.value, { decimals: 0 })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#A2A2BA] block font-semibold">
                  {isAr ? "عدد العمليات:" : "Operations Count:"}
                </span>
                <span className="text-sm sm:text-base font-black text-white tabular-nums">
                  {formatNumber(selectedMonth.tx)} {isAr ? "عملية" : "ops"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#A2A2BA] block font-semibold">
                  {isAr ? "متوسط قيمة العملية:" : "Average Ticket:"}
                </span>
                <span className="text-sm sm:text-base font-black text-[#7FE87F] tabular-nums">
                  {formatCurrency(selectedMonth.avgTicket)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#A2A2BA] block font-semibold">
                  {isAr ? "معدل النمو:" : "Growth Trajectory:"}
                </span>
                <span className="text-sm sm:text-base font-black text-emerald-400">
                  {selectedMonth.growth}
                </span>
              </div>
            </div>

            {/* Interactive Pie Chart & Breakdown List */}
            <div className="bg-[#0B111E] border border-[#2C2C44] rounded-xl p-4 sm:p-5">
              <PieChart
                data={currentPieSlices}
                centerValue={formatCurrency(selectedMonth.value, { decimals: 0 })}
                centerLabel={selectedMonth.label}
                size={220}
                thickness={32}
              />
            </div>

            {/* Quick Month Navigator Bar */}
            <div className="pt-1 border-t border-[#2C2C44]/80 flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-[#A2A2BA] text-[11px] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#7FE87F]" />
                {isAr
                  ? `أنت تشاهد حالياً تحليل ${currentMonthLabel}`
                  : `Currently viewing ${currentMonthLabel} analysis`}
              </span>

              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {activeBars.map((bar, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedBarIndex(idx)}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-bold transition-all cursor-pointer ${
                      selectedBarIndex === idx
                        ? "bg-[#7FE87F] text-[#080C14] font-black"
                        : "bg-[#182236] text-[#A2A2BA] hover:text-white border border-[#2C2C44]"
                    }`}
                  >
                    {bar.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top Merchant Sales Champions */}
          <div className="bg-[#111726] border border-[#2C2C44] rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-[#7FE87F]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {t("salesModal.topMerchantsTitle")} ({selectedMonth.label})
                </h3>
              </div>
              <span className="text-xs text-[#A2A2BA]">
                {isAr ? "أبرز التجار حسب حجم المبيعات" : "Top performing merchants"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {mockMerchants.slice(0, 6).map((m, idx) => {
                const monthMultiplier = selectedMonth.value / 4852900;
                const merchantPeriodVol = (Number(m.monthlyVolumeSar) || 0) * monthMultiplier;
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
                        <span className="truncate max-w-[130px]">
                          {isAr && m.businessNameAr ? m.businessNameAr : m.businessName}
                        </span>
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
        <div className="p-3.5 sm:p-4 border-t border-[#2C2C44] bg-[#111726] flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="text-xs text-[#A2A2BA]">
            {isAr
              ? "تمت المزامنة المباشرة مع نظام التسويات المركزية ومقاصة مدى"
              : "Synced real-time with central settlement clearing & mada network"}
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
