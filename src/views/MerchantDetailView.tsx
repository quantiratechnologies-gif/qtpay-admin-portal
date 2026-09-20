import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
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
  Copy,
  Check,
  Download,
  Percent,
  CreditCard,
  RotateCcw,
  SmartphoneNfc,
  Coins,
  FileText,
  Clock,
  Activity
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../components/ui/dialog";
import { useTranslation } from "../lib/i18n/LanguageContext";
import { exportCsv } from "../lib/exportCsv";
import type { Merchant, PlatformTransaction } from "../types";

interface MerchantDetailViewProps {
  merchant: Merchant;
  transactions: PlatformTransaction[];
  onBack: () => void;
  onUpdateStatus: (merchantId: string, newStatus: Merchant["status"]) => void;
  onExecuteRefund?: (txId: string) => void;
  onProvisionTerminal?: (merchantId: string, model: string) => void;
  lang?: "en" | "ar";
}

export const MerchantDetailView: React.FC<MerchantDetailViewProps> = ({
  merchant,
  transactions,
  onBack,
  onUpdateStatus,
  onExecuteRefund,
  onProvisionTerminal
}) => {
  const { isAr, t, formatCurrency, formatDate, translateCategory, translatePaymentMethod } = useTranslation();
  const [activeTab, setActiveTab] = useState<"profile" | "terminals" | "transactions" | "settlements" | "activity">("profile");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [newTerminalModel, setNewTerminalModel] = useState("Apple SoftPOS (iPhone iOS 18+)");
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

  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-8 px-3 bg-[#171717] border-[#262626] text-neutral-300 hover:text-white hover:border-[#D4AF37]/40 gap-1.5 cursor-pointer"
          >
            <BackIcon className="h-3.5 w-3.5" />
            <span>{isAr ? "العودة" : "Back"}</span>
          </Button>
          <span className="text-neutral-600 text-xs">/</span>
          <span className="text-xs font-bold text-white">{isAr && merchant.businessNameAr ? merchant.businessNameAr : merchant.businessName}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const ok = exportCsv(
                `${merchant.crNumber}-dossier-${new Date().toISOString().slice(0, 10)}.csv`,
                merchantTransactions,
                [
                  { label: "Order Ref", value: (t) => t.orderRef },
                  { label: "Date", value: (t) => t.timestamp },
                  { label: "Sender", value: (t) => t.senderName },
                  { label: "Receiver", value: (t) => t.receiverName },
                  { label: "Gross (SAR)", value: (t) => t.amount },
                  { label: "VAT (SAR)", value: (t) => t.vatAmount },
                  { label: "MDR (SAR)", value: (t) => t.platformMdrSar },
                  { label: "Net (SAR)", value: (t) => t.netAmount },
                  { label: "Method", value: (t) => t.paymentMethod },
                  { label: "Terminal", value: (t) => t.terminalId },
                  { label: "mada RRN", value: (t) => t.madaRrn },
                  { label: "Status", value: (t) => t.status },
                ]
              );
              showNotice(
                ok
                  ? (isAr ? "تم تصدير كشف حساب التاجر بنجاح" : "Merchant dossier exported successfully")
                  : (isAr ? "فشل التصدير" : "Export failed. Please try again.")
              );
            }}
            className="h-8 px-3 bg-[#171717] border-[#262626] text-neutral-300 hover:text-[#F1D77A] hover:border-[#D4AF37]/40 gap-1.5 text-xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#F1D77A]" />
            <span>{t("common.export")}</span>
          </Button>

          {merchant.status === "active" ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onUpdateStatus(merchant.id, "suspended");
                showNotice(isAr ? `تم إيقاف التاجر ${merchant.businessNameAr || merchant.businessName}` : `Merchant ${merchant.businessName} suspended`);
              }}
              className="h-8 px-3 text-xs gap-1.5 font-bold cursor-pointer"
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
                showNotice(isAr ? `تم اعتماد وتفعيل التاجر ${merchant.businessNameAr || merchant.businessName}` : `Merchant ${merchant.businessName} activated`);
              }}
              className="h-8 px-3 text-xs gap-1.5 font-bold cursor-pointer bg-gradient-to-r from-[#F1D77A] via-[#D4AF37] to-[#B38F26] text-[#0B0B0B] hover:opacity-95 shadow-md shadow-[#D4AF37]/20"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-[#0B0B0B]" />
              <span>{isAr ? "اعتماد وتفعيل" : "Approve & Activate"}</span>
            </Button>
          )}
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl text-[#F1D77A] text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Header Dossier Card */}
      <Card className="p-5 space-y-4 bg-[#171717] border-[#262626]">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#F1D77A]/20 to-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#F1D77A] p-3 shadow-inner">
              <Store className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-extrabold text-white">
                  {isAr && merchant.businessNameAr ? merchant.businessNameAr : merchant.businessName}
                </h1>
                <StatusBadge status={merchant.status} />
                <Badge variant={merchant.riskTier === "low" ? "success" : merchant.riskTier === "medium" ? "warning" : "destructive"}>
                  {merchant.riskTier === "low" ? (isAr ? "مخاطر منخفضة" : "LOW RISK") : merchant.riskTier === "medium" ? (isAr ? "مخاطر متوسطة" : "MEDIUM RISK") : (isAr ? "مخاطر مرتفعة" : "HIGH RISK")}
                </Badge>
              </div>
              <p className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                <span>{translateCategory(merchant.category)}</span>
                <span>• {isAr ? "تاريخ الانضمام" : "Joined"} {merchant.joinedAt}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={isAr ? "text-left" : "text-right"}>
              <span className="text-[10px] text-neutral-400 block uppercase font-medium">{t("merchants.tableVolume")}</span>
              <span className="text-xl font-extrabold text-[#F1D77A] tabular-nums">
                {formatCurrency(merchant.monthlyVolumeSar, { decimals: 0 })}
              </span>
            </div>
            <div className="h-9 w-px bg-[#262626]" />
            <div className={isAr ? "text-left" : "text-right"}>
              <span className="text-[10px] text-neutral-400 block uppercase font-medium">{t("merchants.tableTerminals")}</span>
              <span className="text-xl font-extrabold text-white tabular-nums">
                {(merchant.terminalsList || []).length} SoftPOS
              </span>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-1.5 border-t border-[#262626] pt-3 overflow-x-auto">
          {[
            { id: "profile", label: t("merchants.tabOverview"), icon: Building2 },
            { id: "terminals", label: `${t("merchants.tabTerminals")} (${(merchant.terminalsList || []).length})`, icon: Terminal },
            { id: "transactions", label: `${t("nav.transactions")} (${merchantTransactions.length})`, icon: ReceiptText },
            { id: "settlements", label: t("merchants.tabSettlements"), icon: DollarSign },
            { id: "activity", label: t("merchants.tabActivity"), icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#F1D77A] via-[#D4AF37] to-[#B38F26] text-[#0B0B0B] font-bold shadow-md shadow-[#D4AF37]/20"
                    : "text-neutral-400 hover:text-white hover:bg-[#1F1F1F]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Tab 1: Profile & Legal Info */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Legal Identity Card */}
          <Card className="p-5 space-y-4 bg-[#171717] border-[#262626]">
            <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#D4AF37]/10 text-[#F1D77A] border border-[#D4AF37]/20">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isAr ? "السجل التجاري والضريبي" : "CR & Tax Info"}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {isAr ? "موثق عبر واثق وزاتكا" : "Verified via Wathq & ZATCA"}
                  </p>
                </div>
              </div>
              <Badge variant="success" className="text-[10px] font-bold">
                {isAr ? "موثق في واثق" : "WATHQ VERIFIED"}
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-[#262626]/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-[#F1D77A]" />
                  {t("merchants.crLabel")}
                </span>
                <div className="flex items-center gap-2 text-[#F1D77A] font-bold tabular-nums">
                  <span>{merchant.crNumber}</span>
                  <button onClick={() => handleCopy(merchant.crNumber, "cr")} className="text-neutral-500 hover:text-white cursor-pointer">
                    {copiedField === "cr" ? <Check className="h-3.5 w-3.5 text-[#F1D77A]" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#262626]/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Percent className="h-3.5 w-3.5 text-[#F1D77A]" />
                  {t("merchants.vatLabel")}
                </span>
                <div className="flex items-center gap-2 text-white font-bold tabular-nums">
                  <span>{merchant.vatNumber}</span>
                  <button onClick={() => handleCopy(merchant.vatNumber, "vat")} className="text-neutral-500 hover:text-white cursor-pointer">
                    {copiedField === "vat" ? <Check className="h-3.5 w-3.5 text-[#F1D77A]" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#262626]/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Store className="h-3.5 w-3.5 text-[#D4AF37]" />
                  {t("merchants.ownerLabel")}
                </span>
                <span className="font-bold text-white">{merchant.ownerName}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#262626]/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-[#F1D77A]" />
                  {t("merchants.nationalIdLabel")}
                </span>
                <span className="text-neutral-300 font-semibold tabular-nums">{merchant.nationalId}</span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-neutral-400 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                  {isAr ? "الموقع والعنوان" : "Physical Address"}
                </span>
                <span className="text-neutral-300 font-medium">{merchant.address || merchant.city}</span>
              </div>
            </div>
          </Card>

          {/* Settlement Banking & Pricing Card */}
          <Card className="p-5 space-y-4 bg-[#171717] border-[#262626]">
            <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#D4AF37]/10 text-[#F1D77A] border border-[#D4AF37]/20">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isAr ? "الحساب المصرفي والتسوية" : "Bank & Settlement"}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {isAr ? "المقاصة عبر سريع" : "Sarie Clearing"}
                  </p>
                </div>
              </div>
              <Badge variant={merchant.settlementHold ? "destructive" : "success"} className="text-[10px] font-bold">
                {merchant.settlementHold ? (isAr ? "التسويات محجوزة" : "PAYOUTS HELD") : (isAr ? "التسويات نشطة" : "SETTLEMENT ACTIVE")}
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-[#262626]/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-[#F1D77A]" />
                  {t("merchants.settlementBankLabel")}
                </span>
                <span className="font-bold text-white">{merchant.settlementBank}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#262626]/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Coins className="h-3.5 w-3.5 text-[#D4AF37]" />
                  {t("merchants.ibanLabel")}
                </span>
                <div className="flex items-center gap-2 text-white text-xs font-bold tabular-nums">
                  <span>{merchant.settlementIban}</span>
                  <button onClick={() => handleCopy(merchant.settlementIban, "iban")} className="text-neutral-500 hover:text-white cursor-pointer">
                    {copiedField === "iban" ? <Check className="h-3.5 w-3.5 text-[#F1D77A]" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#262626]/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Percent className="h-3.5 w-3.5 text-[#F1D77A]" />
                  {t("merchants.customMdrLabel")}
                </span>
                <span className="font-bold text-[#F1D77A]">
                  {merchant.customMdrRate ? `${merchant.customMdrRate}% (${isAr ? "شريحة مخصصة" : "Custom Tier"})` : `0.80% (${isAr ? "النسبة القياسية" : "Standard Platform"})`}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#262626]/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-[#D4AF37]" />
                  {isAr ? "جدول الإقفال المحاسبي" : "Settlement Cutoff"}
                </span>
                <span className="font-semibold text-neutral-200">
                  {isAr ? "يومياً T+0 في 04:00 صباحاً" : "Daily T+0 @ 04:00 AM AST"}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-neutral-400">{isAr ? "إجراء حجز التسوية" : "Payout Action"}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showNotice(isAr ? "تم تحديث حالة حجز التسوية" : `Payout hold toggled for ${merchant.businessName}`)}
                  className="h-8 text-xs bg-[#121212] border-[#262626] gap-2 text-neutral-200 hover:text-[#F1D77A] hover:border-[#D4AF37]/40 cursor-pointer"
                >
                  {merchant.settlementHold ? <PlayCircle className="h-3.5 w-3.5 text-[#F1D77A]" /> : <PauseCircle className="h-3.5 w-3.5 text-[#D4AF37]" />}
                  <span>{merchant.settlementHold ? t("merchants.releaseHold") : t("merchants.holdSettlement")}</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: SoftPOS Terminals Fleet */}
      {activeTab === "terminals" && (
        <Card className="p-5 space-y-4 bg-[#171717] border-[#262626]">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#262626]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#D4AF37]/10 text-[#F1D77A] border border-[#D4AF37]/20">
                <Terminal className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? "أجهزة نقاط البيع (SoftPOS)" : "SoftPOS Terminals"}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {isAr ? "الأجهزة ونقاط البيع النشطة" : "Active merchant terminals"}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setIsProvisionModalOpen(true)}
              className="h-8 px-3 text-xs font-bold gap-1.5 bg-gradient-to-r from-[#F1D77A] via-[#D4AF37] to-[#B38F26] text-[#0B0B0B] hover:opacity-95 shadow-md shadow-[#D4AF37]/20 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t("merchants.provisionTerminal")}</span>
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isAr ? "معرف الجهاز (Terminal ID)" : "Terminal ID"}</TableHead>
                <TableHead>{t("merchants.terminalModel")}</TableHead>
                <TableHead>{t("merchants.terminalNfc")}</TableHead>
                <TableHead>{t("merchants.terminalHeartbeat")}</TableHead>
                <TableHead className="text-right">{t("merchants.terminalDailyVol")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(merchant.terminalsList || []).length > 0 ? (
                merchant.terminalsList?.map((term) => (
                  <TableRow key={term.id}>
                    <TableCell>
                      <span className="font-semibold text-[#F1D77A] text-xs tabular-nums">{term.terminalId}</span>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-xs text-white">{term.model}</div>
                      <div className="text-[10px] text-neutral-400">{term.osVersion}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={term.nfcStatus === "active" ? "gold" : "warning"} className="text-[10px] font-bold">
                        {term.nfcStatus === "active" ? (isAr ? "نشط" : "ACTIVE") : (isAr ? "معلق" : "PENDING")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-neutral-300">{term.lastHeartbeat}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-extrabold text-[#F1D77A] text-xs tabular-nums">
                        {formatCurrency(term.dailyVolumeSar)}
                      </div>
                      <div className="text-[10px] text-neutral-400">{term.dailyTxCount} {isAr ? "عملية اليوم" : "tx today"}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={term.status === "online" ? "gold" : "secondary"} className="text-[10px] font-bold">
                        {term.status === "online" ? (isAr ? "متصل" : "ONLINE") : (isAr ? "غير متصل" : "OFFLINE")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => showNotice(isAr ? `تم إلغاء تفعيل نقطة البيع ${term.terminalId}` : `Terminal ${term.terminalId} decommissioned`)}
                        className="h-7 px-2.5 text-xs font-semibold cursor-pointer"
                      >
                        {isAr ? "إلغاء" : "Revoke"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-neutral-500 text-xs">
                    {isAr ? "لا توجد أجهزة نقاط بيع مخصصة حالياً. انقر 'إصدار نقطة بيع' للبدء." : "No active terminals currently assigned. Click 'Provision SoftPOS' to deploy."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Tab 3: Complete Transaction History */}
      {activeTab === "transactions" && (
        <Card className="p-5 space-y-4 bg-[#171717] border-[#262626]">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#262626]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#D4AF37]/10 text-[#F1D77A] border border-[#D4AF37]/20">
                <ReceiptText className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? "سجل العمليات" : "Transactions"}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {isAr ? "مدفوعات ومشتريات العملاء" : "Customer checkouts & payments"}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs text-neutral-300 font-semibold border-[#262626]">
              {merchantTransactions.length} {isAr ? "عملية" : "operations"}
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("ledger.tableOrderRef")}</TableHead>
                <TableHead>{isAr ? "العميل / المرسل" : "Customer / Sender"}</TableHead>
                <TableHead className="text-right">{t("ledger.tableAmount")}</TableHead>
                <TableHead className="text-right">{t("ledger.tableMdr")}</TableHead>
                <TableHead>{t("ledger.tablePaymentMethod")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchantTransactions.length > 0 ? (
                merchantTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="font-semibold text-[#F1D77A] text-xs">{tx.orderRef}</div>
                      <div className="text-[10px] text-neutral-400">{formatDate(tx.timestamp, "time")}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-white text-xs">{tx.senderName}</div>
                      <div className="text-[10px] text-neutral-400">{tx.cardLast4 ? `${isAr ? "بطاقة تنتهي بـ" : "Card ending"} *${tx.cardLast4}` : (isAr ? "محفظة رقمية" : "Digital Wallet")}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-white text-xs tabular-nums">{formatCurrency(tx.amount)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-[#F1D77A] text-xs tabular-nums">{formatCurrency(tx.platformMdrSar)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        {tx.paymentMethod === "apple_pay" ? <SmartphoneNfc className="h-3.5 w-3.5 text-[#F1D77A]" /> : <CreditCard className="h-3.5 w-3.5 text-[#D4AF37]" />}
                        <span className="text-neutral-200">{translatePaymentMethod(tx.paymentMethod)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tx.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.status !== "refunded" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (onExecuteRefund) onExecuteRefund(tx.id);
                            showNotice(isAr ? `تم تنفيذ الاسترجاع للطلب ${tx.orderRef}` : `Refund processed for order ${tx.orderRef}`);
                          }}
                          className="h-7 px-2.5 text-xs gap-1.5 font-semibold cursor-pointer"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>{t("ledger.refundBtn")}</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-neutral-500 text-xs">
                    {t("common.noResults")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Tab 4: Settlement Batches */}
      {activeTab === "settlements" && (
        <Card className="p-5 space-y-4 bg-[#171717] border-[#262626]">
          <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#D4AF37]/10 text-[#F1D77A] border border-[#D4AF37]/20">
                <DollarSign className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? "سجل دفعات التسوية" : "Settlement Batches"}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {isAr ? "صافي التحويلات بعد الرسوم" : "Net payouts after deductions"}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs text-neutral-300 border-[#262626]">
              {isAr ? "تسوية آلية" : "Automated Clearing"}
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isAr ? "المرجع والتاريخ" : "Batch Ref & Date"}</TableHead>
                <TableHead>{t("settlements.partnerBank")}</TableHead>
                <TableHead className="text-right">{t("settlements.grossSar")}</TableHead>
                <TableHead className="text-right">{t("settlements.mdrDeductions")}</TableHead>
                <TableHead className="text-right">{t("settlements.netDisbursed")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead>{isAr ? "المرجع المطابق" : "Recon Ref"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(merchant.settlementRecords || []).length > 0 ? (
                merchant.settlementRecords?.map((stl) => (
                  <TableRow key={stl.id}>
                    <TableCell>
                      <div className="font-semibold text-[#F1D77A] text-xs">{stl.batchRef}</div>
                      <div className="text-[10px] text-neutral-400">{stl.payoutDate}</div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-xs text-white">{stl.bankName}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-xs text-neutral-200 tabular-nums">{formatCurrency(stl.grossAmountSar)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-[#F1D77A] text-xs tabular-nums">
                        {formatCurrency(stl.mdrFeeSar + stl.vatSar)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-extrabold text-[#F1D77A] text-xs tabular-nums">
                        {formatCurrency(stl.netDisbursedSar)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="gold" className="text-[10px] font-bold">
                        {stl.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-neutral-400 tabular-nums">{stl.reconciliationRef}</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-neutral-500 text-xs">
                    {isAr ? "لا توجد تسويات مسجلة سابقاً لهذا التاجر." : "No historical settlement disbursements recorded."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Tab 5: Activity & Audit Trail */}
      {activeTab === "activity" && (
        <Card className="p-5 space-y-4 bg-[#171717] border-[#262626]">
          <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#D4AF37]/10 text-[#F1D77A] border border-[#D4AF37]/20">
                <History className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? "سجل الأحداث والتدقيق" : "Audit Events"}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {isAr ? "سجل العمليات المشفر" : "Operations log"}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs text-neutral-300 border-[#262626]">
              {isAr ? "سجل مشفر" : "Immutable Log"}
            </Badge>
          </div>

          <div className="space-y-3">
            {(merchant.activityLogs || []).length > 0 ? (
              merchant.activityLogs?.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-[#121212] border border-[#262626] space-y-1.5 hover:border-[#D4AF37]/40 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-[#F1D77A]" />
                      {log.title}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-medium">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-neutral-400">{log.details}</p>
                  <div className="text-[10px] text-neutral-500 pt-1 border-t border-[#262626]">
                    <span>{isAr ? "المنفذ:" : "Actor:"} <strong className="text-neutral-300">{log.actor}</strong></span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-neutral-500 text-xs">
                {t("common.noData")}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Provision SoftPOS Modal */}
      <Dialog open={isProvisionModalOpen} onOpenChange={setIsProvisionModalOpen}>
        <DialogContent className="max-w-md p-6 bg-[#171717] border-[#262626]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#F1D77A] border border-[#D4AF37]/30">
                <Terminal className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-white">
                  {t("merchants.provisionTerminal")}
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-400">
                  {isAr ? "إصدار وتفعيل نقطة بيع جديدة للتاجر" : `Allocate a new terminal for ${merchant.businessName}`}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">
                {isAr ? "منصة الجهاز" : "Platform"}
              </label>
              <select
                value={newTerminalModel}
                onChange={(e) => setNewTerminalModel(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-[#121212] border border-[#262626] rounded-xl text-white outline-none focus:border-[#D4AF37]"
              >
                <option value="Apple SoftPOS (iPhone iOS 18+)">Apple SoftPOS (iOS 18+)</option>
                <option value="Android SoftPOS (Samsung / Google)">Android SoftPOS (Android 14+)</option>
                <option value="PAX A920 Pro SmartPOS">PAX A920 Pro SmartPOS</option>
                <option value="Sunmi V2s Handheld POS">Sunmi V2s Handheld POS</option>
              </select>
            </div>

            <div className="p-3 bg-[#121212] border border-[#262626] rounded-xl space-y-1 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#F1D77A]" />
                {isAr ? "فحص الأمان والشهادات" : "Security Check"}
              </span>
              <p className="text-[11px] text-neutral-400">
                {isAr ? "حقن مفاتيح التشفير اللاتلامسي تلقائياً." : "Encryption keys will be injected automatically."}
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsProvisionModalOpen(false)}
              className="border-[#262626] hover:bg-[#262626] cursor-pointer text-neutral-300"
            >
              {t("common.cancel")}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (onProvisionTerminal) {
                  onProvisionTerminal(merchant.id, newTerminalModel);
                }
                setIsProvisionModalOpen(false);
                showNotice(
                  isAr
                    ? "تم إصدار وتفعيل نقطة بيع جديدة بنجاح"
                    : `Terminal provisioned successfully for ${merchant.businessName}`
                );
              }}
              className="bg-gradient-to-r from-[#F1D77A] via-[#D4AF37] to-[#B38F26] text-[#0B0B0B] hover:opacity-95 font-bold cursor-pointer shadow-md shadow-[#D4AF37]/20"
            >
              {isAr ? "تأكيد الإصدار والتفعيل" : "Confirm Provisioning"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
