import React, { useState } from "react";
import {
  ArrowLeft,
  Store,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  PauseCircle,
  PlayCircle,
  Plus,
  Terminal,
  ReceiptText,
  DollarSign,
  History,
  Building2,
  MapPin,
  Phone,
  Mail,
  Copy,
  Check,
  Download,
  Percent,
  CreditCard,
  RotateCcw,
  SmartphoneNfc
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { StatusBadge } from "../components/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../components/ui/dialog";
import type { Merchant, PlatformTransaction, SoftPosTerminal } from "../types";

interface MerchantDetailViewProps {
  merchant: Merchant;
  transactions: PlatformTransaction[];
  onBack: () => void;
  onUpdateStatus: (merchantId: string, newStatus: Merchant["status"]) => void;
  onExecuteRefund?: (txId: string) => void;
  lang: "en" | "ar";
}

export const MerchantDetailView: React.FC<MerchantDetailViewProps> = ({
  merchant,
  transactions,
  onBack,
  onUpdateStatus,
  onExecuteRefund,
  lang
}) => {
  const isAr = lang === "ar";
  const [activeTab, setActiveTab] = useState<"profile" | "terminals" | "transactions" | "settlements" | "activity">("profile");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [newTerminalModel, setNewTerminalModel] = useState("Apple SoftPOS (iPhone)");
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1200);
  };

  const merchantTransactions = transactions.filter(
    (tx) => tx.merchantId === merchant.id || tx.receiverName.toLowerCase().includes(merchant.businessName.toLowerCase().slice(0, 8))
  );

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-8 px-2.5 bg-[#10182A] border-slate-800/80 text-slate-300 hover:text-white gap-1.5"
          >
            <ArrowLeft className={`h-3.5 w-3.5 ${isAr ? "rotate-180" : ""}`} />
            <span>{isAr ? "العودة للتجار" : "Back to Merchants"}</span>
          </Button>
          <span className="text-slate-600 text-xs">/</span>
          <span className="text-xs font-bold text-white">{isAr ? merchant.businessNameAr : merchant.businessName}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => showNotice("Official statement exported to PDF / CSV")}
            className="h-8 px-2.5 bg-[#10182A] border-slate-800/80 text-slate-300 hover:text-white gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isAr ? "تصدير كشف حساب" : "Export Dossier"}</span>
          </Button>

          {merchant.status === "active" ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onUpdateStatus(merchant.id, "suspended");
                showNotice(`Merchant ${merchant.businessName} suspended`);
              }}
              className="h-8 px-2.5 text-xs gap-1.5"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>{isAr ? "إيقاف التاجر" : "Suspend Merchant"}</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onUpdateStatus(merchant.id, "active");
                showNotice(`Merchant ${merchant.businessName} approved & activated`);
              }}
              className="h-8 px-2.5 text-xs gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isAr ? "اعتماد التاجر" : "Approve & Activate"}</span>
            </Button>
          )}
        </div>
      </div>

      {notice && (
        <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Header Dossier Card */}
      <Card className="p-5 space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-[#7FE87F]">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-extrabold text-white">
                  {isAr ? merchant.businessNameAr : merchant.businessName}
                </h1>
                <StatusBadge status={merchant.status} />
                <Badge variant={merchant.riskTier === "low" ? "success" : merchant.riskTier === "medium" ? "warning" : "destructive"}>
                  {merchant.riskTier.toUpperCase()} RISK
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{merchant.category} • Joined {merchant.joinedAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Monthly GMV</span>
              <span className="text-base font-extrabold text-[#7FE87F]">
                SAR {merchant.monthlyVolumeSar.toLocaleString()}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Active Terminals</span>
              <span className="text-base font-extrabold text-sky-400">
                {merchant.activeTerminals} SoftPOS
              </span>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-1.5 border-t border-slate-800/60 pt-3 overflow-x-auto">
          {[
            { id: "profile", labelEn: "Profile & Legal Info", labelAr: "البيانات القانونية والبنكية", icon: Building2 },
            { id: "terminals", labelEn: `SoftPOS Terminals (${(merchant.terminalsList || []).length || merchant.activeTerminals})`, labelAr: "أجهزة نقاط البيع", icon: Terminal },
            { id: "transactions", labelEn: `Transactions (${merchantTransactions.length})`, labelAr: "العمليات المالية", icon: ReceiptText },
            { id: "settlements", labelEn: "Settlements & Payouts", labelAr: "التسويات البنكية", icon: DollarSign },
            { id: "activity", labelEn: "Activity & Audit Log", labelAr: "سجل النشاط والأمان", icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#7FE87F] text-[#080C14]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Tab 1: Profile & Legal Info */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Legal Identity Card */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#7FE87F]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Commercial Registration & Tax Verification
                </h3>
              </div>
              <Badge variant="success" className="text-[10px]">WATHQ VERIFIED</Badge>
            </div>

            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Commercial Registration (CR)</span>
                <div className="flex items-center gap-1.5 font-mono text-sky-400 font-bold">
                  <span>{merchant.crNumber}</span>
                  <button onClick={() => handleCopy(merchant.crNumber, "cr")} className="text-slate-500 hover:text-white">
                    {copiedField === "cr" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">ZATCA VAT Tax Number</span>
                <div className="flex items-center gap-1.5 font-mono text-white font-bold">
                  <span>{merchant.vatNumber}</span>
                  <button onClick={() => handleCopy(merchant.vatNumber, "vat")} className="text-slate-500 hover:text-white">
                    {copiedField === "vat" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Owner Authorized Representative</span>
                <span className="font-bold text-white">{merchant.ownerName}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Owner National ID</span>
                <span className="font-mono text-slate-300">{merchant.nationalId}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Physical Location & Address</span>
                <span className="text-slate-300 text-right">{merchant.address || merchant.city}</span>
              </div>
            </div>
          </Card>

          {/* Settlement Banking & Pricing Card */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Settlement Banking & Payout Rails
                </h3>
              </div>
              <Badge variant={merchant.settlementHold ? "destructive" : "success"} className="text-[10px]">
                {merchant.settlementHold ? "PAYOUTS HELD" : "SETTLEMENT ACTIVE"}
              </Badge>
            </div>

            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Settlement Partner Bank</span>
                <span className="font-bold text-white">{merchant.settlementBank}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Verified IBAN</span>
                <div className="flex items-center gap-1.5 font-mono text-white text-[11px] font-bold">
                  <span>{merchant.settlementIban}</span>
                  <button onClick={() => handleCopy(merchant.settlementIban, "iban")} className="text-slate-500 hover:text-white">
                    {copiedField === "iban" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">MDR Commission Rate</span>
                <span className="font-bold text-[#7FE87F]">
                  {merchant.customMdrRate ? `${merchant.customMdrRate}% (Custom Tier)` : "0.80% (Standard Platform)"}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Settlement Cutoff Schedule</span>
                <span className="font-medium text-slate-300">Daily T+0 @ 04:00 AM AST</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Payout Action</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showNotice(`Payout hold toggled for ${merchant.businessName}`)}
                  className="h-7 text-xs bg-slate-900 border-slate-800 gap-1 text-slate-300"
                >
                  {merchant.settlementHold ? <PlayCircle className="h-3 w-3 text-emerald-400" /> : <PauseCircle className="h-3 w-3 text-amber-400" />}
                  <span>{merchant.settlementHold ? "Release Hold" : "Place Hold"}</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: SoftPOS Terminals Fleet */}
      {activeTab === "terminals" && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-[#7FE87F]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                SoftPOS Devices & Terminals Fleet
              </h3>
            </div>
            <Button
              size="sm"
              onClick={() => setIsProvisionModalOpen(true)}
              className="h-8 px-2.5 text-xs font-bold gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Provision SoftPOS</span>
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Terminal ID</TableHead>
                <TableHead>Device Model & OS</TableHead>
                <TableHead>NFC SAMA Key</TableHead>
                <TableHead>Last Heartbeat</TableHead>
                <TableHead>Daily Volume</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(merchant.terminalsList || []).length > 0 ? (
                merchant.terminalsList?.map((term) => (
                  <TableRow key={term.id}>
                    <TableCell>
                      <span className="font-mono font-bold text-sky-400 text-xs">{term.terminalId}</span>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-xs text-white">{term.model}</div>
                      <div className="text-[10px] text-slate-400">{term.osVersion}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={term.nfcStatus === "active" ? "success" : "warning"} className="text-[10px]">
                        {term.nfcStatus.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-300">{term.lastHeartbeat}</span>
                    </TableCell>
                    <TableCell>
                      <div className="font-extrabold text-[#7FE87F] text-xs">
                        SAR {term.dailyVolumeSar.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">{term.dailyTxCount} tx today</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={term.status === "online" ? "success" : "secondary"} className="text-[10px]">
                        {term.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => showNotice(`Terminal ${term.terminalId} decommissioned`)}
                        className="h-7 px-2 text-xs"
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-slate-500 text-xs">
                    No active terminals currently assigned. Click "Provision SoftPOS" to deploy.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Tab 3: Complete Transaction History */}
      {activeTab === "transactions" && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ReceiptText className="h-4 w-4 text-[#7FE87F]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Full Transaction History for {merchant.businessName}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{merchantTransactions.length} operations</span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Ref & Time</TableHead>
                <TableHead>Customer / Sender</TableHead>
                <TableHead>Gross Amount</TableHead>
                <TableHead>MDR Take</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchantTransactions.length > 0 ? (
                merchantTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="font-mono font-bold text-sky-400 text-xs">{tx.orderRef}</div>
                      <div className="text-[10px] text-slate-400">{new Date(tx.timestamp).toLocaleTimeString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-white text-xs">{tx.senderName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{tx.cardLast4 ? `Card ending *${tx.cardLast4}` : "Digital Wallet"}</div>
                    </TableCell>
                    <TableCell>
                      <span className="font-extrabold text-white text-xs">SAR {tx.amount.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-amber-400 text-xs">SAR {tx.platformMdrSar.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase">
                        {tx.paymentMethod === "apple_pay" ? <SmartphoneNfc className="h-3.5 w-3.5 text-sky-400" /> : <CreditCard className="h-3.5 w-3.5 text-[#7FE87F]" />}
                        <span>{tx.paymentMethod}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tx.status} />
                    </TableCell>
                    <TableCell>
                      {tx.status !== "refunded" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (onExecuteRefund) onExecuteRefund(tx.id);
                            showNotice(`Refund processed for order ${tx.orderRef}`);
                          }}
                          className="h-7 px-2 text-xs gap-1"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Refund</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-slate-500 text-xs">
                    No transactions found for this merchant.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Tab 4: Settlement Batches */}
      {activeTab === "settlements" && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Historical Bank Settlement Batches
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Automated Clearing</span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Ref & Date</TableHead>
                <TableHead>Bank Channel</TableHead>
                <TableHead>Gross Volume</TableHead>
                <TableHead>MDR & VAT Take</TableHead>
                <TableHead>Net Disbursed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recon Ref</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(merchant.settlementRecords || []).length > 0 ? (
                merchant.settlementRecords?.map((stl) => (
                  <TableRow key={stl.id}>
                    <TableCell>
                      <div className="font-mono font-bold text-sky-400 text-xs">{stl.batchRef}</div>
                      <div className="text-[10px] text-slate-400">{stl.payoutDate}</div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-xs text-white">{stl.bankName}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-xs text-slate-200">SAR {stl.grossAmountSar.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-amber-400 text-xs">
                        SAR {(stl.mdrFeeSar + stl.vatSar).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-extrabold text-[#7FE87F] text-xs">
                        SAR {stl.netDisbursedSar.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success" className="text-[10px]">
                        {stl.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[11px] text-slate-400">{stl.reconciliationRef}</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-slate-500 text-xs">
                    No historical settlement disbursements recorded.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Tab 5: Activity & Audit Trail */}
      {activeTab === "activity" && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-[#7FE87F]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Live Audit & Telemetry Events
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Immutable Log</span>
          </div>

          <div className="space-y-2.5">
            {(merchant.activityLogs || []).length > 0 ? (
              merchant.activityLogs?.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-[#10182A] border border-slate-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{log.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-400">{log.details}</p>
                  <div className="text-[10px] text-slate-500 pt-0.5">
                    <span>Actor: {log.actor}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">
                No activity logs available for this merchant.
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Provision SoftPOS Modal */}
      <Dialog open={isProvisionModalOpen} onOpenChange={setIsProvisionModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Provision SoftPOS Terminal</DialogTitle>
            <DialogDescription>
              Allocate a new SAMA-compliant SoftPOS terminal ID for {merchant.businessName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Target Device Type</label>
              <select
                value={newTerminalModel}
                onChange={(e) => setNewTerminalModel(e.target.value)}
                className="w-full h-9 px-3 text-xs bg-[#10182A] border border-slate-800/80 rounded-lg text-white outline-none"
              >
                <option value="Apple SoftPOS (iPhone)">Apple SoftPOS (iPhone iOS 18+)</option>
                <option value="Android SoftPOS (Samsung / Google)">Android SoftPOS (Android 14+)</option>
                <option value="PAX A920 Pro SmartPOS">PAX A920 Pro SmartPOS</option>
                <option value="Sunmi V2s Handheld POS">Sunmi V2s Handheld POS</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsProvisionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                showNotice(`New Terminal provisioned for ${merchant.businessName} on ${newTerminalModel}`);
                setIsProvisionModalOpen(false);
              }}
            >
              Confirm Provisioning
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
