import React, { useState, useRef, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Zap,
  CreditCard,
  CheckCircle2,
  Clock,
  PieChart as PieChartIcon,
  MapPin,
  ChevronDown,
  Calendar
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { PieChart, PieSliceData } from "../components/ui/PieChart";
import { SalesAnalyticsModal, SalesPeriod } from "../components/SalesAnalyticsModal";
import { mockInsightsData } from "../services/mockData";
import { useTranslation } from "../lib/i18n/LanguageContext";

interface InsightsAnalyticsProps {
  lang?: "en" | "ar";
  onSelectTab?: (tab: any) => void;
}

export const InsightsAnalytics: React.FC<InsightsAnalyticsProps> = ({ onSelectTab }) => {
  const { isAr, t, formatCurrency, formatNumber, formatPercent } = useTranslation();
  const data = mockInsightsData;

  const [salesPeriod, setSalesPeriod] = useState<SalesPeriod>("yearly");
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState(false);
  const salesDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        salesDropdownRef.current &&
        !salesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSalesDropdownOpen(false);
      }
    };
    if (isSalesDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSalesDropdownOpen]);

  // Dynamic values based on selected period
  const salesMetrics = {
    yearly: {
      label: t("salesModal.merchantSales"),
      value: 58234800,
      growth: "+34.2%",
      growthLabel: isAr ? "نمو سنوي (YoY)" : "YoY"
    },
    monthly: {
      label: t("salesModal.merchantSales"),
      value: 4852900,
      growth: "+24.8%",
      growthLabel: isAr ? "نمو شهري (MoM)" : "MoM"
    },
    weekly: {
      label: t("salesModal.merchantSales"),
      value: 1213225,
      growth: "+8.6%",
      growthLabel: isAr ? "نمو أسبوعي (WoW)" : "WoW"
    }
  };

  const activeMetric = salesMetrics[salesPeriod];

  const getRailName = (name: string) => {
    if (!isAr) return name;
    switch (name) {
      case "mada Debit":
        return "مدى (بطاقات الخصم)";
      case "Apple Pay (NFC)":
        return "أبل باي (Apple Pay)";
      case "Visa / Mastercard":
        return "فيزا / ماستركارد";
      case "Sarie Instant P2P":
        return "سريع (حوالات فورية)";
      default:
        return name;
    }
  };

  const getCityName = (city: string) => {
    if (!isAr) return city;
    switch (city) {
      case "Riyadh":
        return "الرياض";
      case "Jeddah":
        return "جدة";
      case "Dammam / Khobar":
        return "الدمام / الخبر";
      case "Mecca & Medina":
        return "مكة المكرمة والمدينة";
      default:
        return city;
    }
  };

  // Format data for PieChart components with unified green palette
  const railColors = ["#7FE87F", "#6FD86F", "#A2A2BA", "#6E6E85"];
  const railsPieData: PieSliceData[] = data.railsBreakdown.map((r, idx) => ({
    name: getRailName(r.name),
    value: r.volumeSar,
    percentage: r.sharePercentage,
    color: railColors[idx % railColors.length],
    subtext: isAr
      ? `${formatNumber(Math.round(r.volumeSar / 1000))} ألف ر.س إجمالي القيمة`
      : `SAR ${(r.volumeSar / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k GMV`
  }));

  const cityPieColors = ["#7FE87F", "#6FD86F", "#5FBF5F", "#4FA84F", "#A2A2BA"];
  const cityPieData: PieSliceData[] = data.cityBreakdown.map((c, idx) => ({
    name: getCityName(c.city),
    value: c.volumeSar,
    percentage: c.percentage,
    color: cityPieColors[idx % cityPieColors.length],
    subtext: isAr
      ? `${formatNumber(Math.round(c.volumeSar / 1000))} ألف ر.س إجمالي القيمة`
      : `SAR ${(c.volumeSar / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k GMV`
  }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#7FE87F]/10 border border-[#7FE87F]/30 text-[#7FE87F] shadow-sm shadow-[#7FE87F]/20">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                {t("insights.pageTitle")}
              </h2>
              <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-wider shadow-sm shadow-[#7FE87F]/20">
                <span className="live-indicator w-1 h-1" /> {t("common.live")}
              </Badge>
            </div>
            <p className="text-xs text-[#A2A2BA]">
              {t("insights.pageSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Merchant Sales - Click navigates to Merchant Section */}
        <div className="relative" ref={salesDropdownRef}>
          <Card
            onClick={() => onSelectTab ? onSelectTab("merchants") : setIsSalesModalOpen(true)}
            className="p-4 space-y-2 border-[#7FE87F]/35 bg-gradient-to-b from-[#182236] to-[#111726] hover:border-[#7FE87F] hover:shadow-xl hover:shadow-[#7FE87F]/10 transition-all cursor-pointer group relative overflow-hidden h-full select-none"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#7FE87F] font-bold">
                {activeMetric.label}
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
              {formatCurrency(activeMetric.value, { decimals: 0 })}
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-xs text-[#7FE87F] font-bold">
                <TrendingUp className="h-3.5 w-3.5 text-[#7FE87F]" /> {activeMetric.growth} {activeMetric.growthLabel}
              </div>
              <span className="text-[10px] text-[#7FE87F] font-bold flex items-center gap-0.5 group-hover:underline">
                {t("salesModal.viewMerchants")}
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

        <Card className="p-4 space-y-2 border-[#2C2C44] hover:border-[#7FE87F]/40">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#A2A2BA] font-medium">
              {isAr ? "متوسط العملية" : "Avg Ticket Size"}
            </span>
            <div className="p-1.5 rounded-md bg-[#7FE87F]/10 text-[#7FE87F] border border-[#7FE87F]/20">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight tabular-nums">
            {formatCurrency(data.averageTicketSizeSar)}
          </div>
          <div className="text-xs text-[#7FE87F] font-semibold">
            {isAr ? "التجزئة ونقاط البيع" : "Retail & SoftPOS"}
          </div>
        </Card>

        <Card className="p-4 space-y-2 border-[#2C2C44] hover:border-[#7FE87F]/40">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#A2A2BA] font-medium">
              {isAr ? "نسبة النجاح" : "Approval SLA"}
            </span>
            <div className="p-1.5 rounded-md bg-[#7FE87F]/10 text-[#7FE87F] border border-[#7FE87F]/20">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#7FE87F] tracking-tight tabular-nums">
            {formatPercent(data.approvalRatePercentage)}
          </div>
          <div className="text-xs text-[#5FBF5F] font-semibold">
            {isAr ? "معدل رفض 0.18%" : "0.18% decline rate"}
          </div>
        </Card>

        <Card className="p-4 space-y-2 border-[#2C2C44] hover:border-[#7FE87F]/40">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#A2A2BA] font-medium">
              {isAr ? "سرعة الاستجابة" : "Core Latency"}
            </span>
            <div className="p-1.5 rounded-md bg-[#7FE87F]/10 text-[#7FE87F] border border-[#7FE87F]/20">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight tabular-nums">
            {data.averageLatencyMs} {isAr ? "مللي ثانية" : "ms"}
          </div>
          <div className="text-xs text-[#5FBF5F] font-semibold">
            {isAr ? "ربط مباشر" : "Direct Switch"}
          </div>
        </Card>
      </div>

      {/* Grid: 2 Interactive Pie/Donut Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Donut Chart 1: Payment Rails Volume Share */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#7FE87F]/10 text-[#7FE87F]">
                <PieChartIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? "وسائل الدفع" : "Payment Rails"}
                </h3>
                <p className="text-[11px] text-[#A2A2BA]">
                  {isAr ? "توزيع العمليات عبر القنوات" : "Volume share by channel"}
                </p>
              </div>
            </div>
            <Badge variant="primary" className="text-[11px] font-bold">
              {isAr ? "27,970 عملية" : "27,970 ops"}
            </Badge>
          </div>

          <PieChart
            data={railsPieData}
            centerLabel={isAr ? "حصة مدى" : "mada"}
            centerValue="62%"
            size={170}
            thickness={24}
            valuePrefix={isAr ? "" : "SAR "}
            valueSuffix={isAr ? " ر.س" : ""}
          />
        </Card>

        {/* Donut Chart 2: Regional & City Breakdown */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#7FE87F]/10 text-[#7FE87F]">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? "التوزيع الجغرافي" : "Regional Distribution"}
                </h3>
                <p className="text-[11px] text-[#A2A2BA]">
                  {isAr ? "حجم العمليات في المناطق" : "Volume across regions"}
                </p>
              </div>
            </div>
            <Badge variant="primary" className="text-[11px] font-bold">
              {isAr ? "المملكة" : "Kingdom-wide"}
            </Badge>
          </div>

          <PieChart
            data={cityPieData}
            centerLabel={isAr ? "الرياض" : "Riyadh"}
            centerValue="45%"
            size={170}
            thickness={24}
            valuePrefix={isAr ? "" : "SAR "}
            valueSuffix={isAr ? " ر.س" : ""}
          />
        </Card>
      </div>

      {/* Hourly Velocity & Traffic Heatmap */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-[#7FE87F]/10 text-[#7FE87F]">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {isAr ? "كثافة العمليات (TPS)" : "24-Hour Processing (TPS)"}
              </h3>
              <p className="text-[11px] text-[#A2A2BA]">
                {isAr ? "حجم وسرعة المعالجة على مدار اليوم" : "Throughput cadence over 24 hours"}
              </p>
            </div>
          </div>
          <Badge variant="primary" className="text-xs font-bold">
            {isAr ? "الذروة: 195 عملية/ث (20:00)" : "Peak: 195 TPS (20:00)"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-1">
          {data.hourlyVelocity.map((slot) => (
            <div
              key={slot.hour}
              className="bg-[#111726] border border-[#2C2C44] rounded-lg p-3 flex flex-col items-center justify-between gap-1.5 text-center hover:border-[#7FE87F]/40 transition-colors"
            >
              <span className="text-xs text-[#A2A2BA] font-semibold">{slot.hour}</span>
              <div className="text-lg font-extrabold text-[#7FE87F] tabular-nums">
                {slot.tps} <span className="text-[11px] text-[#6E6E85] font-normal">{isAr ? "عملية/ث" : "TPS"}</span>
              </div>
              <span className="text-[11px] text-slate-300 font-medium tabular-nums">
                {isAr
                  ? `${formatNumber(Math.round(slot.volumeSar / 1000))} ألف ر.س`
                  : `SAR ${(slot.volumeSar / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k`}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Deep-dive Sales & Volume Analytics Modal */}
      <SalesAnalyticsModal
        isOpen={isSalesModalOpen}
        onClose={() => setIsSalesModalOpen(false)}
        initialPeriod={salesPeriod}
      />
    </div>
  );
};
