import React from "react";
import {
  BarChart3,
  TrendingUp,
  Zap,
  Globe,
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldCheck,
  SmartphoneNfc
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { mockInsightsData } from "../services/mockData";

interface InsightsAnalyticsProps {
  lang: "en" | "ar";
}

export const InsightsAnalytics: React.FC<InsightsAnalyticsProps> = ({ lang }) => {
  const isAr = lang === "ar";
  const data = mockInsightsData;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#7FE87F]" />
          <h2 className="text-base font-extrabold text-white">
            {isAr ? "التحليلات والرؤى المالية" : "Insights & Network Analytics"}
          </h2>
          <Badge variant="success" className="text-[10px] uppercase font-bold">
            <span className="live-indicator w-1 h-1" /> LIVE METRICS
          </Badge>
        </div>

        <div className="text-xs text-slate-400">
          {isAr ? "تحديث فوري لشبكة الدفع المركزية" : "Realtime Saudi SAMA Gateway Telemetry"}
        </div>
      </div>

      {/* Top 4 Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "إجمالي حجم المعاملات" : "Gross Network GMV"}
            </span>
            <TrendingUp className="h-4 w-4 text-[#7FE87F]" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {data.monthlyGrossVolume}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
            <TrendingUp className="h-3 w-3" /> {data.monthlyGrowthRate} MoM
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "متوسط قيمة العملية" : "Avg Ticket Size"}
            </span>
            <CreditCard className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            SAR {data.averageTicketSizeSar.toFixed(2)}
          </div>
          <div className="text-[11px] text-sky-400 font-bold">
            Retail & SoftPOS Combined
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "نسبة نجاح المعاملات" : "Gateway Approval SLA"}
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {data.approvalRatePercentage}%
          </div>
          <div className="text-[11px] text-emerald-400 font-bold">
            0.18% decline rate
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "سرعة الاستجابة المركزية" : "Median Core Latency"}
            </span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {data.averageLatencyMs} ms
          </div>
          <div className="text-[11px] text-amber-400 font-bold">
            SAMA Direct Rail
          </div>
        </Card>
      </div>

      {/* Grid: Payment Rails Share & City Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Payment Rails Breakdown */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SmartphoneNfc className="h-4 w-4 text-[#7FE87F]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {isAr ? "حصة قنوات الدفع" : "Payment Rails Volume Share"}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">27,970 total ops</span>
          </div>

          <div className="space-y-3 pt-1">
            {data.railsBreakdown.map((rail) => (
              <div key={rail.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rail.color }} />
                    {rail.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-[11px]">SAR {(rail.volumeSar / 1000).toFixed(0)}k</span>
                    <span className="font-bold text-white">{rail.sharePercentage}%</span>
                  </div>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full h-2 rounded-full bg-[#121A2D] overflow-hidden border border-slate-800/80">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${rail.sharePercentage}%`,
                      backgroundColor: rail.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* City & Regional Breakdown */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-sky-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {isAr ? "التوزيع الجغرافي للحجم" : "Regional Volume Distribution"}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Kingdom-wide</span>
          </div>

          <div className="space-y-3 pt-1">
            {data.cityBreakdown.map((item) => (
              <div key={item.city} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">{item.city}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-[11px]">SAR {(item.volumeSar / 1000).toFixed(0)}k</span>
                    <span className="font-bold text-sky-400">{item.percentage}%</span>
                  </div>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full h-2 rounded-full bg-[#121A2D] overflow-hidden border border-slate-800/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Hourly Velocity & Traffic Heatmap */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? "كثافة المعاملات على مدار اليوم (TPS)" : "24-Hour Processing Velocity & TPS Profile"}
            </h3>
          </div>
          <span className="text-[11px] text-amber-400 font-bold">Peak: 195 TPS (20:00 AST)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
          {data.hourlyVelocity.map((slot) => (
            <div
              key={slot.hour}
              className="bg-[#10182A] border border-slate-800/80 rounded-lg p-2.5 flex flex-col items-center justify-between gap-1 text-center"
            >
              <span className="text-[11px] text-slate-400 font-mono">{slot.hour}</span>
              <div className="text-base font-extrabold text-[#7FE87F]">
                {slot.tps} <span className="text-[10px] text-slate-500 font-normal">TPS</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                SAR {(slot.volumeSar / 1000).toFixed(0)}k
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
