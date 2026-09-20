import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  User,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Sliders,
  ReceiptText,
  History,
  Smartphone,
  RefreshCw,
  KeyRound,
  Download,
  Copy,
  Check,
  Sparkles,
  Phone,
  Mail,
  Fingerprint,
  Calendar,
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
import type { CustomerUser, PlatformTransaction } from "../types";

interface UserDetailViewProps {
  user: CustomerUser;
  transactions: PlatformTransaction[];
  onBack: () => void;
  onToggleFreeze: (userId: string) => void;
  onUpdateDailyLimit?: (userId: string, newLimit: number) => void;
  onRevokeDevice?: (userId: string, deviceId: string) => void;
  lang?: "en" | "ar";
}

export const UserDetailView: React.FC<UserDetailViewProps> = ({
  user,
  transactions,
  onBack,
  onToggleFreeze,
  onUpdateDailyLimit,
  onRevokeDevice
}) => {
  const { isAr, t, formatCurrency, formatDate, translatePaymentMethod } = useTranslation();
  const [activeTab, setActiveTab] = useState<"profile" | "transactions" | "devices" | "activity">("profile");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [tempLimit, setTempLimit] = useState<number>(user.dailyLimitSar || 20000);
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

  const userTransactions = transactions.filter(
    (tx) => tx.userId === user.id || tx.senderName.toLowerCase().includes(user.fullName.toLowerCase().slice(0, 5)) || tx.receiverName.toLowerCase().includes(user.fullName.toLowerCase().slice(0, 5))
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
            className="h-8 px-3 bg-[#111726] border-[#2C2C44] text-neutral-300 hover:text-white hover:border-[#7FE87F]/40 gap-1.5 cursor-pointer"
          >
            <BackIcon className="h-3.5 w-3.5" />
            <span>{isAr ? "العودة" : "Back"}</span>
          </Button>
          <span className="text-neutral-600 text-xs">/</span>
          <span className="text-xs font-bold text-white">{isAr && user.fullNameAr ? user.fullNameAr : user.fullName}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (userTransactions.length === 0) {
                showNotice(
                  isAr
                    ? "لا توجد عمليات لتصديرها لهذا العميل حالياً"
                    : "No transactions to export for this customer"
                );
                return;
              }
              const ok = exportCsv(
                `${user.nationalId}-customer-dossier-${new Date().toISOString().slice(0, 10)}.csv`,
                userTransactions,
                [
                  { label: "Order Ref", value: (t) => t.orderRef },
                  { label: "Date & Time", value: (t) => t.timestamp },
                  { label: "Counterparty", value: (t) => t.receiverName },
                  { label: "Amount (SAR)", value: (t) => t.amount },
                  { label: "Channel", value: (t) => t.channel },
                  { label: "Payment Method", value: (t) => t.paymentMethod },
                  { label: "SARIE UTR", value: (t) => t.sarieUtr || "" },
                  { label: "Status", value: (t) => t.status }
                ]
              );
              showNotice(
                ok
                  ? (isAr ? "تم تصدير ملف العميل المعتمد بنجاح" : "Customer audit dossier exported successfully")
                  : "Export failed"
              );
            }}
            className="h-8 px-3 bg-[#111726] border-[#2C2C44] text-neutral-300 hover:text-[#7FE87F] hover:border-[#7FE87F]/40 gap-1.5 text-xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#7FE87F]" />
            <span>{t("common.export")}</span>
          </Button>

          <Button
            variant={user.isFrozen ? "default" : "destructive"}
            size="sm"
            onClick={() => {
              onToggleFreeze(user.id);
              showNotice(isAr ? (user.isFrozen ? "تم إلغاء تجميد الحساب" : "تم تجميد الحساب احترازياً") : `Wallet ${user.isFrozen ? "unfrozen" : "frozen"}`);
            }}
            className={`h-8 px-3 text-xs gap-1.5 font-bold cursor-pointer ${
              user.isFrozen ? "bg-gradient-to-r from-[#7FE87F] via-[#6FD86F] to-[#5FBF5F] text-[#080C14] hover:opacity-95 shadow-md shadow-[#7FE87F]/20" : ""
            }`}
          >
            {user.isFrozen ? <Unlock className="h-3.5 w-3.5 text-[#080C14]" /> : <Lock className="h-3.5 w-3.5" />}
            <span>{user.isFrozen ? t("consumers.unfreezeAccount") : t("consumers.freezeAccount")}</span>
          </Button>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-[#7FE87F]/10 border border-[#7FE87F]/30 rounded-xl text-[#7FE87F] text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-[#7FE87F]" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Header Dossier Card */}
      <Card className="p-5 space-y-4 bg-[#111726] border-[#2C2C44]">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#7FE87F]/20 to-[#6FD86F]/10 border border-[#7FE87F]/40 flex items-center justify-center text-[#7FE87F] font-black text-lg p-3 shadow-inner">
              {user.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-extrabold text-white">
                  {isAr && user.fullNameAr ? user.fullNameAr : user.fullName}
                </h1>
                <StatusBadge status={user.kycStatus} />
                <Badge
                  variant={user.riskScore > 70 ? "destructive" : user.riskScore > 30 ? "warning" : "primary"}
                >
                  {isAr ? `مؤشر المخاطر: ${user.riskScore}/100` : `RISK: ${user.riskScore}/100`}
                </Badge>
                {user.isFrozen && (
                  <Badge variant="destructive">{isAr ? "الحساب مجمد" : "WALLET FROZEN"}</Badge>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-1 flex items-center gap-2 flex-wrap">
                <span>{isAr ? "معرف سريع:" : "Sarie Alias:"}</span>
                <span className="font-semibold text-[#7FE87F] bg-[#7FE87F]/10 px-2 py-0.5 rounded border border-[#7FE87F]/30">{user.sarieUpiId}</span>
                <span>• {isAr ? "تاريخ التسجيل" : "Joined"} {user.joinedAt}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={isAr ? "text-left" : "text-right"}>
              <span className="text-[10px] text-neutral-400 block uppercase font-medium">{t("consumers.walletBalanceLabel")}</span>
              <span className="text-xl font-extrabold text-[#7FE87F] tabular-nums">
                {formatCurrency(user.walletBalanceSar)}
              </span>
            </div>
            <div className="h-9 w-px bg-[#2C2C44]" />
            <div className={isAr ? "text-left" : "text-right"}>
              <span className="text-[10px] text-neutral-400 block uppercase font-medium">{t("consumers.dailyLimitLabel")}</span>
              <span className="text-xl font-extrabold text-white tabular-nums">
                {formatCurrency(user.dailyLimitSar || 20000, { decimals: 0 })}
              </span>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-1.5 border-t border-[#2C2C44] pt-3 overflow-x-auto">
          {[
            { id: "profile", label: t("consumers.tabOverview"), icon: User },
            { id: "transactions", label: `${t("nav.transactions")} (${userTransactions.length})`, icon: ReceiptText },
            { id: "devices", label: `${t("consumers.tabDevices")} (${(user.registeredDevices || []).length})`, icon: Smartphone },
            { id: "activity", label: t("consumers.tabActivity"), icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#7FE87F] via-[#6FD86F] to-[#5FBF5F] text-[#080C14] font-bold shadow-md shadow-[#7FE87F]/20"
                    : "text-neutral-400 hover:text-white hover:bg-[#182236]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Tab 1: Profile & KYC Limits */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Identity Info Card */}
          <Card className="p-5 space-y-4 bg-[#111726] border-[#2C2C44]">
            <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#7FE87F]/10 text-[#7FE87F] border border-[#7FE87F]/20">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isAr ? "التحقق عبر نفاذ وأبشر" : "Nafath & Absher KYC"}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {isAr ? "موثق لدى مركز المعلومات الوطني" : "Verified with NIC"}
                  </p>
                </div>
              </div>
              <Badge variant="primary" className="text-[10px] font-bold">
                {isAr ? "توثيق المستوى الثاني" : "TIER 2 VERIFIED"}
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-[#2C2C44]/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Fingerprint className="h-3.5 w-3.5 text-[#7FE87F]" />
                  {t("consumers.tableNationalId")}
                </span>
                <div className="flex items-center gap-2 text-[#7FE87F] font-bold tabular-nums">
                  <span>{user.nationalId}</span>
                  <button onClick={() => handleCopy(user.nationalId, "nid")} className="text-neutral-500 hover:text-white cursor-pointer">
                    {copiedField === "nid" ? <Check className="h-3.5 w-3.5 text-[#7FE87F]" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#2C2C44]/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#7FE87F]" />
                  {t("consumers.tableMobile")}
                </span>
                <span className="font-semibold text-white tabular-nums">{user.mobile}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#2C2C44]/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-[#7FE87F]" />
                  {isAr ? "البريد الإلكتروني" : "Email Address"}
                </span>
                <span className="text-neutral-300 font-medium">{user.email}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#2C2C44]/60">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#7FE87F]" />
                  {t("consumers.tableSarieAlias")}
                </span>
                <span className="font-bold text-[#7FE87F]">{user.sarieUpiId}</span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-[#7FE87F]" />
                  {t("consumers.nafathVerified")}
                </span>
                <span className="text-xs text-[#7FE87F] font-semibold">{user.nafathVerifiedAt || (isAr ? "موثق عبر أبشر" : "Verified via Absher")}</span>
              </div>
            </div>
          </Card>

          {/* Transfer Limits & Actions Card */}
          <Card className="p-5 space-y-4 bg-[#111726] border-[#2C2C44]">
            <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#7FE87F]/10 text-[#7FE87F] border border-[#7FE87F]/20">
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isAr ? "حدود التحويل" : "Transfer Limits"}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {isAr ? "الحد اليومي وضوابط الأمان" : "Daily threshold & security"}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] text-[#7FE87F] border-[#7FE87F]/30 bg-[#7FE87F]/5">
                {isAr ? "منظم من ساما" : "SAMA Regulated"}
              </Badge>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-neutral-400">{isAr ? "استخدام الحد اليومي:" : "Daily Transfer Limit Usage:"}</span>
                  <span className="font-bold text-white tabular-nums">
                    {formatCurrency(500)} / {formatCurrency(user.dailyLimitSar || 20000, { decimals: 0 })}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#182236] overflow-hidden border border-[#2C2C44]">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#5FBF5F] to-[#7FE87F]" style={{ width: "2.5%" }} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#182236] border border-[#2C2C44] space-y-2.5">
                <span className="text-xs font-bold text-white block">{isAr ? "إجراءات الأمان والخدمة" : "Security & Service Triggers"}</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTempLimit(user.dailyLimitSar || 20000);
                      setIsLimitModalOpen(true);
                    }}
                    className="h-8 text-xs bg-[#111726] border-[#2C2C44] text-neutral-200 hover:text-[#7FE87F] hover:border-[#7FE87F]/40 gap-1.5 cursor-pointer"
                  >
                    <Sliders className="h-3.5 w-3.5 text-[#7FE87F]" />
                    <span>{isAr ? "تعديل الحد" : "Adjust Limit"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showNotice(isAr ? `تم إرسال تعليمات إعادة تعيين رمز PIN إلى ${user.mobile}` : `Sarie PIN reset sent to ${user.mobile}`)}
                    className="h-8 text-xs bg-[#111726] border-[#2C2C44] text-neutral-200 hover:text-[#7FE87F] hover:border-[#7FE87F]/40 gap-1.5 cursor-pointer"
                  >
                    <KeyRound className="h-3.5 w-3.5 text-[#7FE87F]" />
                    <span>{isAr ? "إعادة تعيين PIN" : "Reset PIN"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showNotice(isAr ? `تم طلب إعادة توثيق نفاذ للعميل ${user.fullNameAr || user.fullName}` : `Nafath Re-KYC initiated for ${user.fullName}`)}
                    className="h-8 text-xs bg-[#111726] border-[#2C2C44] text-neutral-200 hover:text-[#7FE87F] hover:border-[#7FE87F]/40 gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-[#7FE87F]" />
                    <span>{isAr ? "إعادة توثيق نفاذ" : "Force Re-KYC"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Complete Transaction Ledger */}
      {activeTab === "transactions" && (
        <Card className="p-5 space-y-4 bg-[#111726] border-[#2C2C44]">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#2C2C44]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#7FE87F]/10 text-[#7FE87F] border border-[#7FE87F]/20">
                <ReceiptText className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? "سجل العمليات" : "Transactions"}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {isAr ? "سجل الحوالات والمدفوعات" : "Transfers & payments"}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs text-neutral-300 font-semibold border-[#2C2C44]">
              {userTransactions.length} {isAr ? "عملية" : "operations"}
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("ledger.tableOrderRef")}</TableHead>
                <TableHead>{isAr ? "الطرف الآخر" : "Counterparty"}</TableHead>
                <TableHead className="text-right">{t("ledger.tableAmount")}</TableHead>
                <TableHead>{t("ledger.tablePaymentMethod")}</TableHead>
                <TableHead>{t("ledger.utrLabel")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userTransactions.length > 0 ? (
                userTransactions.map((tx) => {
                  const isOutgoing = tx.senderName.toLowerCase().includes(user.fullName.toLowerCase().slice(0, 5));
                  return (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="font-semibold text-[#7FE87F] text-xs">{tx.orderRef}</div>
                        <div className="text-[10px] text-neutral-400">{formatDate(tx.timestamp, "time")}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-white text-xs">{isOutgoing ? tx.receiverName : tx.senderName}</div>
                        <div className="text-[10px] text-neutral-400">{isOutgoing ? (isAr ? "حوالة صادرة" : "Debit / Outgoing") : (isAr ? "حوالة واردة" : "Credit / Incoming")}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-bold text-xs tabular-nums ${isOutgoing ? "text-neutral-200" : "text-[#7FE87F]"}`}>
                          {isOutgoing ? "-" : "+"}{formatCurrency(tx.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-neutral-300">{translatePaymentMethod(tx.paymentMethod)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold text-[#7FE87F] tabular-nums">{tx.sarieUtr || "N/A"}</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={tx.status} />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-neutral-500 text-xs">
                    {t("common.noResults")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Tab 3: Bound Devices & Security Sessions */}
      {activeTab === "devices" && (
        <Card className="p-5 space-y-4 bg-[#111726] border-[#2C2C44]">
          <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#7FE87F]/10 text-[#7FE87F] border border-[#7FE87F]/20">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? "الأجهزة المسجلة" : "Registered Devices"}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {isAr ? "الأجهزة المرتبطة بالحساب" : "Devices linked to wallet"}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs text-[#7FE87F] border-[#7FE87F]/30 bg-[#7FE87F]/5">
              {isAr ? "مقترن ومحمي" : "Secure Enclave Bound"}
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isAr ? "طراز الجهاز" : "Device Model"}</TableHead>
                <TableHead>{isAr ? "نظام التشغيل والتطبيق" : "OS & App Version"}</TableHead>
                <TableHead>{isAr ? "المصادقة الحيوية" : "Biometrics"}</TableHead>
                <TableHead>{isAr ? "آخر نشاط" : "Last Active"}</TableHead>
                <TableHead>{isAr ? "عنوان IP والموقع" : "IP & Location"}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(user.registeredDevices || []).length > 0 ? (
                user.registeredDevices?.map((dev) => (
                  <TableRow key={dev.id}>
                    <TableCell>
                      <div className="font-bold text-white text-xs">{dev.deviceName}</div>
                      <div className="text-[10px] text-neutral-400">{dev.model}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-neutral-300">{dev.osVersion}</div>
                      <div className="text-[10px] text-neutral-500">{dev.appVersion}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="primary" className="text-[10px] font-bold">
                        {isAr ? "بصمة الوجه نشطة" : "FACE ID ACTIVE"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-neutral-300">{dev.lastActive}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-semibold text-[#7FE87F] tabular-nums">{dev.ipAddress}</div>
                      <div className="text-[10px] text-neutral-400">{dev.city}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          onRevokeDevice?.(user.id, dev.id);
                          showNotice(
                            isAr
                              ? `تم إلغاء اقتران وجلسة الجهاز ${dev.deviceName}`
                              : `Device session revoked for ${dev.deviceName}`
                          );
                        }}
                        className="h-7 px-2.5 text-xs font-semibold cursor-pointer"
                      >
                        {isAr ? "إلغاء الجلسة" : "Revoke"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-neutral-500 text-xs">
                    {isAr ? "لا توجد أجهزة مسجلة لهذا الحساب حالياً." : "No hardware devices bound to this account."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Tab 4: Activity & Audit Trail */}
      {activeTab === "activity" && (
        <Card className="p-5 space-y-4 bg-[#111726] border-[#2C2C44]">
          <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#7FE87F]/10 text-[#7FE87F] border border-[#7FE87F]/20">
                <History className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? "سجل النشاط" : "Activity Log"}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {isAr ? "سجل العمليات" : "Operations log"}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs text-neutral-300 border-[#2C2C44]">
              {isAr ? "بث مباشر" : "Real-time Stream"}
            </Badge>
          </div>

          <div className="space-y-3">
            {(user.activityLogs || []).length > 0 ? (
              user.activityLogs?.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-[#182236] border border-[#2C2C44] space-y-1.5 hover:border-[#7FE87F]/40 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-[#7FE87F]" />
                      {log.title}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-medium">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-neutral-400">{log.details}</p>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500 pt-1 border-t border-[#2C2C44]">
                    <span>{isAr ? "المنفذ:" : "Actor:"} <strong className="text-neutral-300">{log.actor}</strong></span>
                    {log.ipAddress && <span>• IP: <strong className="text-neutral-300">{log.ipAddress}</strong></span>}
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

      {/* Adjust Limit Dialog */}
      <Dialog open={isLimitModalOpen} onOpenChange={setIsLimitModalOpen}>
        <DialogContent className="max-w-md p-6 bg-[#111726] border-[#2C2C44]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#7FE87F]/10 text-[#7FE87F] border border-[#7FE87F]/30">
                <Sliders className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-white">
                  {t("consumers.updateLimitTitle")}
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-400">
                  {isAr ? "تحديد سقف التحويل اليومي للعميل" : `Set daily transfer limit for ${user.fullName}`}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="p-4 bg-[#182236] border border-[#2C2C44] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-medium">{t("consumers.newDailyLimitLabel")}</span>
                <span className="text-xl font-extrabold text-[#7FE87F] tabular-nums">
                  {formatCurrency(tempLimit, { decimals: 0 })}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={tempLimit}
                onChange={(e) => setTempLimit(parseInt(e.target.value))}
                className="w-full accent-[#7FE87F] cursor-pointer h-2 bg-[#2C2C44] rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 pt-1 font-medium">
                <span>{formatCurrency(5000, { decimals: 0 })} ({isAr ? "الافتراضي" : "Tier 1 Default"})</span>
                <span>{formatCurrency(100000, { decimals: 0 })} ({isAr ? "الحد الأقصى" : "VIP Limit"})</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLimitModalOpen(false)}
              className="border-[#2C2C44] hover:bg-[#182236] cursor-pointer text-neutral-300"
            >
              {t("common.cancel")}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (onUpdateDailyLimit) onUpdateDailyLimit(user.id, tempLimit);
                showNotice(isAr ? `تم تحديث الحد اليومي بنجاح إلى ${formatCurrency(tempLimit, { decimals: 0 })}` : `Daily limit set to SAR ${tempLimit.toLocaleString()}`);
                setIsLimitModalOpen(false);
              }}
              className="bg-gradient-to-r from-[#7FE87F] via-[#6FD86F] to-[#5FBF5F] text-[#080C14] hover:opacity-95 font-bold cursor-pointer shadow-md shadow-[#7FE87F]/20"
            >
              {t("consumers.updateLimitBtn")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
