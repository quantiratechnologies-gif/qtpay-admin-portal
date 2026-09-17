import React from "react";
import {
  DollarSign,
  Store,
  Activity,
  Zap,
  TrendingUp,
  SmartphoneNfc,
  ArrowDownLeft
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { StatusBadge } from "../components/Badge";
import type { PlatformTransaction, Merchant, RiskAlert } from "../types";

interface ExecutiveDashboardProps {
  transactions: PlatformTransaction[];
  merchants: Merchant[];
  riskAlerts: RiskAlert[];
  lang: "en" | "ar";
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  transactions,
  merchants,
  lang
}) => {
  const isAr = lang === "ar";
  const activeMerchantsCount = merchants.filter(m => m.status === "active").length;

  return (
    <div className="space-y-4">
      {/* Network Status Strip */}
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2">
          <span className="live-indicator w-1.5 h-1.5" />
          <span className="text-xs font-bold text-white">
            {isAr ? "الشبكة المركزية تعمل بكفاءة" : "Payment Network Operational"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#7FE87F] font-bold">142.8 TPS</span>
          <span className="text-slate-500 text-[10px]">•</span>
          <span className="text-sky-400 font-bold">18ms</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "إجمالي المعاملات" : "Gross Volume"}
            </span>
            <DollarSign className="h-4 w-4 text-[#7FE87F]" />
          </div>
          <div className="text-xl font-extrabold text-white">
            SAR 4,852,900
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
            <TrendingUp className="h-3 w-3" /> +18.4%
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "حجم اليوم" : "Today's Volume"}
            </span>
            <Activity className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            SAR 184,500
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
            <TrendingUp className="h-3 w-3" /> +12.1%
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "الإيرادات" : "MDR Revenue"}
            </span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            SAR 48,529
          </div>
          <div className="text-[11px] text-amber-400 font-bold">
            1.0% avg take
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "التجار النشطين" : "Active Merchants"}
            </span>
            <Store className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {activeMerchantsCount} Merchants
          </div>
          <div className="text-[11px] text-purple-400 font-bold">
            14 Terminals
          </div>
        </Card>
      </div>

      {/* Realtime Stream Table */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#7FE87F]" />
            <h3 className="text-sm font-bold text-white">
              {isAr ? "العمليات المباشرة" : "Live Transactions"}
            </h3>
          </div>
          <Badge variant="success" className="text-[10px] uppercase font-bold">
            <span className="live-indicator w-1 h-1" /> LIVE
          </Badge>
        </div>

        <div className="space-y-2">
          {transactions.slice(0, 5).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-2.5 bg-[#121A2D] rounded-lg border border-[var(--border-subtle)] hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center ${
                    tx.paymentMethod === "mada"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-sky-500/15 text-sky-400"
                  }`}
                >
                  {tx.channel === "pos_softpos" ? (
                    <SmartphoneNfc className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownLeft className="h-3.5 w-3.5" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {tx.senderName} ➔ {tx.receiverName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {tx.orderRef} • {new Date(tx.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className={isAr ? "text-left" : "text-right"}>
                <div className="text-xs font-extrabold text-[#7FE87F]">
                  +SAR {tx.amount.toFixed(2)}
                </div>
                <div className="mt-0.5">
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
