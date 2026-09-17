import React from "react";
import {
  DollarSign,
  Store,
  Activity,
  Zap,
  TrendingUp,
  SmartphoneNfc,
  ArrowDownLeft,
  ArrowRight
} from "lucide-react";
import { Card } from "../components/ui/card";
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
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="live-indicator w-2 h-2" />
          <span className="text-xs font-bold text-white">
            {isAr ? "الشبكة المركزية تعمل بكفاءة" : "Payment Network Core Operational"}
          </span>
          <Badge variant="success" className="text-[10px] font-bold">SAMA DIRECT</Badge>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#00FF24] font-bold tabular-nums">142.8 TPS</span>
          <span className="text-slate-600 text-xs">•</span>
          <span className="text-sky-400 font-bold tabular-nums">18ms median latency</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "إجمالي المعاملات" : "Gross Volume"}
            </span>
            <div className="p-1.5 rounded-lg bg-[#00FF24]/10 text-[#00FF24]">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight tabular-nums">
            SAR 4,852,900
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <TrendingUp className="h-3.5 w-3.5" /> +18.4% MoM
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "حجم اليوم" : "Today's Volume"}
            </span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight tabular-nums">
            SAR 184,500
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <TrendingUp className="h-3.5 w-3.5" /> +12.1% vs yesterday
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "الإيرادات" : "MDR Revenue"}
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight tabular-nums">
            SAR 48,529
          </div>
          <div className="text-xs text-amber-400 font-semibold">
            1.0% avg platform take
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? "التجار النشطين" : "Active Merchants"}
            </span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Store className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight tabular-nums">
            {activeMerchantsCount} Merchants
          </div>
          <div className="text-xs text-purple-400 font-semibold">
            14 SoftPOS Terminals
          </div>
        </Card>
      </div>

      {/* Realtime Stream Table */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#00FF24]/10 text-[#00FF24]">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {isAr ? "العمليات المباشرة" : "Live Transaction Stream"}
              </h3>
              <p className="text-[11px] text-slate-400">Real-time incoming payment events</p>
            </div>
          </div>
          <Badge variant="success" className="text-[10px] uppercase font-bold tracking-wider">
            <span className="live-indicator w-1 h-1" /> LIVE STREAM
          </Badge>
        </div>

        <div className="space-y-2.5">
          {transactions.slice(0, 5).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 bg-[#10182A] rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tx.paymentMethod === "mada"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-sky-500/15 text-sky-400"
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
                    <ArrowRight className="h-3 w-3 text-slate-500" />
                    <span className="text-[#00FF24]">{tx.receiverName}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 tabular-nums">
                    {tx.orderRef} • {new Date(tx.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className={isAr ? "text-left" : "text-right"}>
                <div className="text-xs font-extrabold text-[#00FF24] tabular-nums">
                  +SAR {tx.amount.toFixed(2)}
                </div>
                <div className="mt-1">
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
