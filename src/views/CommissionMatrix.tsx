import React, { useState } from "react";
import {
  Percent,
  CheckCircle2,
  Settings2,
  Landmark,
  ShieldAlert,
  Send,
  Download,
  Activity,
  Server,
  Sliders,
  DollarSign,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { StatusBadge } from "../components/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "../components/ui/table";
import { mockSettlementBatches, mockRiskAlerts } from "../services/mockData";
import type { CommissionFeeTier, SettlementBatch, RiskAlert } from "../types";

interface CommissionMatrixProps {
  feeTiers: CommissionFeeTier[];
  onUpdateFee: (id: string, newRate: number, newFixed: number) => void;
  lang: "en" | "ar";
}

export const CommissionMatrix: React.FC<CommissionMatrixProps> = ({
  feeTiers,
  onUpdateFee,
  lang
}) => {
  const isAr = lang === "ar";
  const [activeSection, setActiveSection] = useState<"rates" | "settlements" | "risk" | "gateways">("rates");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rateInput, setRateInput] = useState<number>(0);
  const [fixedInput, setFixedInput] = useState<number>(0);

  const [batches, setBatches] = useState<SettlementBatch[]>(mockSettlementBatches);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>(mockRiskAlerts);
  const [isProcessingBatch, setIsProcessingBatch] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const startEdit = (tier: CommissionFeeTier) => {
    setEditingId(tier.id);
    setRateInput(tier.ratePercentage);
    setFixedInput(tier.fixedFeeSar);
  };

  const saveEdit = (id: string) => {
    onUpdateFee(id, rateInput, fixedInput);
    setEditingId(null);
    showNotice("Fee tier rates updated across active payment rails");
  };

  const handleDispatchBatch = (batchId: string) => {
    setIsProcessingBatch(batchId);
    setTimeout(() => {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === batchId
            ? { ...b, status: "completed", executedAt: "Just Now (SAMA Core API)" }
            : b
        )
      );
      setIsProcessingBatch(null);
      showNotice("Settlement batch dispatched successfully to partner bank clearing API");
    }, 1000);
  };

  const handleResolveAlert = (alertId: string) => {
    setRiskAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: "resolved" } : a))
    );
    showNotice("Risk alert investigated and marked resolved");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-[#7FE87F]" />
          <h2 className="text-base font-extrabold text-white">
            {isAr ? "الإعدادات ومحرك التسويات والامتثال" : "Settings, Settlements & Compliance Hub"}
          </h2>
        </div>

        {/* Section Navigation Pills */}
        <div className="inline-flex rounded-lg bg-[#0E1526] p-1 border border-slate-800/80">
          {[
            { id: "rates", labelEn: "MDR Rates", labelAr: "عمولات الدفع", icon: Percent },
            { id: "settlements", labelEn: "Bank Clearing", labelAr: "التسويات المصرفية", icon: Landmark },
            { id: "risk", labelEn: "Risk & AML", labelAr: "المخاطر والامتثال", icon: ShieldAlert },
            { id: "gateways", labelEn: "SAMA Telemetry", labelAr: "ربط الجهات", icon: Server }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-[#7FE87F] text-[#080C14]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {notice && (
        <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Section 1: MDR Commission Rates */}
      {activeSection === "rates" && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Platform Merchant Discount Rate (MDR) Matrix
              </h3>
              <p className="text-[11px] text-slate-400">
                SAMA maximum take rates and fixed scheme transaction charges
              </p>
            </div>
            <Badge variant="secondary" className="text-[10px]">ACTIVE TARIFF</Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isAr ? "طريقة الدفع" : "Payment Rail"}</TableHead>
                <TableHead>{isAr ? "النسبة (%)" : "Rate (%)"}</TableHead>
                <TableHead>{isAr ? "الرسم الثابت" : "Fixed (SAR)"}</TableHead>
                <TableHead>{isAr ? "الحد الأقصى" : "Cap (SAR)"}</TableHead>
                <TableHead>{isAr ? "إجراء" : "Action"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeTiers.map((tier) => {
                const isEditing = editingId === tier.id;
                return (
                  <TableRow key={tier.id}>
                    <TableCell>
                      <div className="font-bold text-white text-xs">{tier.paymentMethod}</div>
                      <div className="text-[10px] text-slate-400">Updated: {tier.lastUpdated}</div>
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.05"
                          value={rateInput}
                          onChange={(e) => setRateInput(parseFloat(e.target.value))}
                          className="w-20 h-7 text-xs bg-[#10182A] border-slate-800/80"
                        />
                      ) : (
                        <span className="font-extrabold text-[#7FE87F] text-xs">
                          {tier.ratePercentage.toFixed(2)}%
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.10"
                          value={fixedInput}
                          onChange={(e) => setFixedInput(parseFloat(e.target.value))}
                          className="w-20 h-7 text-xs bg-[#10182A] border-slate-800/80"
                        />
                      ) : (
                        <span className="font-semibold text-xs text-slate-200">SAR {tier.fixedFeeSar.toFixed(2)}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-400 text-xs">
                        {tier.capSar ? `SAR ${tier.capSar.toFixed(2)}` : "None (No Cap)"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => saveEdit(tier.id)}
                          className="h-7 px-2.5 text-xs gap-1"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{isAr ? "حفظ" : "Save"}</span>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(tier)}
                          className="h-7 px-2.5 text-xs bg-[#10182A] hover:bg-slate-800 gap-1"
                        >
                          <Settings2 className="h-3 w-3" />
                          <span>{isAr ? "تعديل" : "Edit"}</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Section 2: Bank Settlements & Clearing Engine */}
      {activeSection === "settlements" && (
        <div className="space-y-3">
          {/* Escrow Liquidity Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="p-3.5 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Total SAMA Escrow Float</span>
              <div className="text-lg font-extrabold text-[#7FE87F]">SAR 14,890,250.00</div>
              <span className="text-[10px] text-emerald-400 font-medium">100% Backed in Saudi Central Bank</span>
            </Card>

            <Card className="p-3.5 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Today's Cleared Payouts</span>
              <div className="text-lg font-extrabold text-white">SAR 3,046,300.40</div>
              <span className="text-[10px] text-slate-400">80 Merchants Disbursed</span>
            </Card>

            <Card className="p-3.5 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Rolling Risk Reserve (5%)</span>
              <div className="text-lg font-extrabold text-amber-400">SAR 744,512.50</div>
              <span className="text-[10px] text-slate-400">Cover for Chargebacks & Disputes</span>
            </Card>
          </div>

          {/* Batches Table */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Automated Partner Bank Settlement Batches
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">T+0 Direct Clearing</span>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Ref & Cutoff</TableHead>
                  <TableHead>Partner Bank</TableHead>
                  <TableHead>Merchants</TableHead>
                  <TableHead>Gross Volume</TableHead>
                  <TableHead>MDR Take</TableHead>
                  <TableHead>Net Disbursed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div className="font-mono font-bold text-sky-400 text-xs">{b.batchRef}</div>
                      <div className="text-[10px] text-slate-400">Cutoff: {b.cutoffTime}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-white text-xs">{b.bankName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Code: {b.partnerBankCode}</div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-xs text-slate-200">{b.totalMerchants} merchants</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-xs text-slate-200">SAR {b.totalGrossSar.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-amber-400 text-xs">SAR {b.totalMdrDeductionSar.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-extrabold text-[#7FE87F] text-xs">SAR {b.totalNetDisbursedSar.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={b.status} />
                    </TableCell>
                    <TableCell>
                      {b.status === "scheduled" ? (
                        <Button
                          size="sm"
                          disabled={isProcessingBatch === b.id}
                          onClick={() => handleDispatchBatch(b.id)}
                          className="h-7 px-2.5 text-xs font-bold gap-1"
                        >
                          <Send className="h-3 w-3" />
                          <span>{isProcessingBatch === b.id ? "Clearing..." : "Dispatch"}</span>
                        </Button>
                      ) : (
                        <span className="text-emerald-400 text-xs font-semibold">✓ Dispatched</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* Section 3: Risk & AML Watchlist Center */}
      {activeSection === "risk" && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Real-Time Risk Alerts & Absher AML Watchlist Matches
              </h3>
              <p className="text-[11px] text-slate-400">Automated fraud detection engine rules</p>
            </div>
            <Badge variant="destructive" className="text-[10px]">
              {riskAlerts.filter(a => a.status === "open").length} OPEN ALERTS
            </Badge>
          </div>

          <div className="space-y-2.5 pt-1">
            {riskAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-lg bg-[#10182A] border border-slate-800/80 flex items-start justify-between flex-wrap gap-2"
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-1.5 rounded-md mt-0.5 ${
                    alert.severity === "critical"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{alert.title}</span>
                      <Badge variant={alert.severity === "critical" ? "destructive" : "warning"} className="text-[9.5px]">
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{alert.description}</p>
                    <div className="text-[10px] text-sky-400 font-mono mt-1">
                      Entity: {alert.entityName} ({alert.entityId})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {alert.status !== "resolved" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolveAlert(alert.id)}
                      className="h-7 px-2.5 text-xs bg-slate-900 border-slate-800 text-slate-200"
                    >
                      Resolve Flag
                    </Button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold">✓ Resolved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Section 4: SAMA & Regulatory Telemetry */}
      {activeSection === "gateways" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: "SAMA Sarie Instant Core", latency: "14ms", status: "Operational", desc: "Saudi Interbank Instant Payment Switch" },
            { name: "Wathq CR & Legal API", latency: "22ms", status: "Operational", desc: "Ministry of Commerce Registry Link" },
            { name: "Nafath National SSO", latency: "38ms", status: "Operational", desc: "Absher Biometric Identity Verification" },
            { name: "ZATCA Fatoorah Phase 2", latency: "19ms", status: "Operational", desc: "Cryptographic E-Invoice Clearance" }
          ].map((gw) => (
            <Card key={gw.name} className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white">{gw.name}</span>
                <span className="live-indicator w-2 h-2" />
              </div>
              <p className="text-[11px] text-slate-400">{gw.desc}</p>
              <div className="pt-2 border-t border-slate-800/60 flex justify-between text-xs font-mono">
                <span className="text-slate-500">Latency: <strong className="text-[#7FE87F]">{gw.latency}</strong></span>
                <span className="text-emerald-400 font-bold">{gw.status}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
