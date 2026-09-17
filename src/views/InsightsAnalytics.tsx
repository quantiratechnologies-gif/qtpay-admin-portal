import React from "react";
import {
  BarChart3,
  TrendingUp,
  Zap,
  Globe,
  CreditCard,
  CheckCircle2,
  Clock,
  PieChart as PieChartIcon,
  SmartphoneNfc,
  Layers,
  MapPin
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { PieChart, PieSliceData } from "../components/ui/PieChart";
import { mockInsightsData } from "../services/mockData";

interface InsightsAnalyticsProps {
  lang: "en" | "ar";
}

export const InsightsAnalytics: React.FC<InsightsAnalyticsProps> = ({ lang }) => {
  const isAr = lang === "ar";
  const data = mockInsightsData;

  // Format data for PieChart components
  const railsPieData: PieSliceData[] = data.railsBreakdown.map((r) => ({
    name: r.name,
    value: r.volumeSar,
    percentage: r.sharePercentage,
    color: r.color,
    subtext: `SAR ${(r.volumeSar / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k GMV`
  }));

  const cityPieColors = ["#00E5FF", "#3B82F6", "#8B5CF6", "#EC4899", "#10B981"];
  const cityPieData: PieSliceData[] = data.cityBreakdown.map((c, idx) => ({
    name: c.city,
    value: c.volumeSar,
    percentage: c.percentage,
    color: cityPieColors[idx % cityPieColors.length],
    subtext: `SAR ${(c.volumeSar / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k GMV`
  }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#00FF24]/10 border border-[#00FF24]/30 text-[#00FF24]">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                {isAr ? "التحليلات والرؤى المالية" : "Insights & Network Analytics"}
              </h2>
              <Badge variant="success" className="text-[10px] uppercase font-bold tracking-wider">
                <span className="live-indicator w-1 h-1" /> LIVE SAMA TELEMETRY
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              {isAr ? "تحديث فوري لشبكة الدفع المركزية ونقاط البيع" : "Realtime Saudi SAMA Gateway Telemetry & Merchant Transaction Volumes"}
            </p>
          </div>
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "إجمالي حجم المعاملات" : "Gross Network GMV"}
            </span>
            <div className="p-1.5 rounded-md bg-[#00FF24]/10 text-[#00FF24]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {data.monthlyGrossVolume}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <TrendingUp className="h-3.5 w-3.5" /> {data.monthlyGrowthRate} MoM
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "متوسط قيمة العملية" : "Avg Ticket Size"}
            </span>
            <div className="p-1.5 rounded-md bg-sky-500/10 text-sky-400">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            SAR {data.averageTicketSizeSar.toFixed(2)}
          </div>
          <div className="text-xs text-sky-400 font-semibold">
            Retail & SoftPOS Combined
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "نسبة نجاح المعاملات" : "Gateway Approval SLA"}
            </span>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {data.approvalRatePercentage}%
          </div>
          <div className="text-xs text-emerald-400 font-semibold">
            0.18% decline rate (healthy)
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "سرعة الاستجابة المركزية" : "Median Core Latency"}
            </span>
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {data.averageLatencyMs} ms
          </div>
          <div className="text-xs text-amber-400 font-semibold">
            SAMA Direct Rail
          </div>
        </Card>
      </div>

      {/* Grid: 2 Interactive Pie/Donut Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Donut Chart 1: Payment Rails Volume Share */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                <PieChartIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? "حصة قنوات الدفع (مخطط دائري)" : "Payment Rails Volume Share"}
                </h3>
                <p className="text-[11px] text-slate-400">Distribution across mada, Apple Pay, Visa & Sarie</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[11px] font-bold text-slate-300">
              27,970 total ops
            </Badge>
          </div>

          <PieChart
            data={railsPieData}
            centerLabel="mada Share"
            centerValue="62%"
            size={170}
            thickness={24}
            valuePrefix="SAR "
            valueSuffix=""
          />
        </Card>

        {/* Donut Chart 2: Regional & City Breakdown */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-sky-500/10 text-sky-400">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? "التوزيع الجغرافي للمناطق (مخطط دائري)" : "Regional Volume Distribution"}
                </h3>
                <p className="text-[11px] text-slate-400">Transaction GMV across major Saudi metropolitan areas</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[11px] font-bold text-sky-300">
              Kingdom-wide
            </Badge>
          </div>

          <PieChart
            data={cityPieData}
            centerLabel="Riyadh GMV"
            centerValue="45%"
            size={170}
            thickness={24}
            valuePrefix="SAR "
            valueSuffix=""
          />
        </Card>
      </div>

      {/* Hourly Velocity & Traffic Heatmap */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {isAr ? "كثافة المعاملات على مدار اليوم (TPS)" : "24-Hour Processing Velocity & TPS Profile"}
              </h3>
              <p className="text-[11px] text-slate-400">Peak transaction throughput & volume cadence</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs text-amber-400 font-bold border-amber-500/30 bg-amber-500/10">
            Peak: 195 TPS (20:00 AST)
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-1">
          {data.hourlyVelocity.map((slot) => (
            <div
              key={slot.hour}
              className="bg-[#10182A] border border-slate-800/80 rounded-lg p-3 flex flex-col items-center justify-between gap-1.5 text-center hover:border-slate-700 transition-colors"
            >
              <span className="text-xs text-slate-400 font-semibold">{slot.hour}</span>
              <div className="text-lg font-extrabold text-[#00FF24]">
                {slot.tps} <span className="text-[11px] text-slate-400 font-normal">TPS</span>
              </div>
              <span className="text-[11px] text-slate-300 font-medium">
                SAR {(slot.volumeSar / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
