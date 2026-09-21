import React, { useState } from "react";
import {
  X,
  Users,
  Search,
  Eye,
  Check,
  Copy,
  TrendingUp,
  ShieldCheck,
  Download,
  SmartphoneNfc,
  Wallet,
  ShieldAlert,
  ArrowUpRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { StatusBadge } from "./Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "./ui/table";
import { UserDetailView } from "../views/UserDetailView";
import { useTranslation } from "../lib/i18n/LanguageContext";
import { exportCsv } from "../lib/exportCsv";
import type { CustomerUser, PlatformTransaction } from "../types";

interface UserAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: CustomerUser[];
  transactions?: PlatformTransaction[];
  onToggleFreezeAccount?: (customerId: string) => void;
  onUpdateDailyLimit?: (customerId: string, newLimit: number) => void;
  onRevokeDevice?: (customerId: string, deviceId: string) => void;
  lang?: "en" | "ar";
}

export const UserAnalyticsModal: React.FC<UserAnalyticsModalProps> = ({
  isOpen,
  onClose,
  customers = [],
  transactions = [],
  onToggleFreezeAccount,
  onUpdateDailyLimit,
  onRevokeDevice
}) => {
  const { isAr, t, formatCurrency, formatNumber } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1200);
  };

  const handleExportUsers = () => {
    exportCsv("qtpay_consumer_users_report", customers, [
      { label: "ID", value: (r) => r.id },
      { label: "Full Name", value: (r) => r.fullName },
      { label: "National ID", value: (r) => r.nationalId },
      { label: "Mobile", value: (r) => r.mobile },
      { label: "Email", value: (r) => r.email },
      { label: "Sarie Alias", value: (r) => r.sarieUpiId },
      { label: "Wallet Balance (SAR)", value: (r) => r.walletBalanceSar },
      { label: "Daily Limit (SAR)", value: (r) => r.dailyLimitSar },
      { label: "Risk Score", value: (r) => r.riskScore },
      { label: "KYC Status", value: (r) => r.kycStatus },
      { label: "Is Frozen", value: (r) => (r.isFrozen ? "Yes" : "No") }
    ]);
  };

  // KPI Calculations
  const totalBalance = customers.reduce((sum, c) => sum + (Number(c.walletBalanceSar) || 0), 0);
  const totalDailyLimits = customers.reduce((sum, c) => sum + (Number(c.dailyLimitSar) || 0), 0);
  const verifiedCount = customers.filter((c) => c.kycStatus === "verified" && !c.isFrozen).length;
  const avgBalance = customers.length > 0 ? totalBalance / customers.length : 0;
  const avgRiskScore =
    customers.length > 0
      ? Math.round(customers.reduce((sum, c) => sum + c.riskScore, 0) / customers.length)
      : 0;

  // Filtered list
  const filtered = customers.filter((c) => {
    const matchSearch =
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.fullNameAr.includes(search) ||
      c.nationalId.includes(search) ||
      c.mobile.includes(search) ||
      c.sarieUpiId.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    if (statusFilter === "verified") return c.kycStatus === "verified" && !c.isFrozen;
    if (statusFilter === "pending") return c.kycStatus === "pending";
    if (statusFilter === "frozen") return !!c.isFrozen;

    return true;
  });

  const selectedUser = customers.find((c) => c.id === selectedUserId);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#182236] to-[#0F172A] border border-[#7FE87F]/30 rounded-2xl w-full max-w-5xl shadow-2xl shadow-black/90 p-5 sm:p-6 space-y-4 max-h-[90vh] flex flex-col relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-[#7FE87F]/60 before:to-transparent"
        onClick={(e) => e.stopPropagation()}
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#2C2C44]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#7FE87F]/10 border border-[#7FE87F]/30 text-[#7FE87F] shadow-lg shadow-[#7FE87F]/10">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {isAr ? "بيانات المستخدمين والمحافظ الرقمية" : "User Value & Consumer Accounts"}
                </h2>
                <Badge className="bg-[#7FE87F]/15 border-[#7FE87F]/35 text-[#7FE87F] text-[10px] font-extrabold px-2 py-0.5">
                  {customers.length} {isAr ? "مستخدمين" : "USERS"}
                </Badge>
              </div>
              <p className="text-xs text-[#A2A2BA] mt-0.5">
                {isAr
                  ? "إدارة حسابات المستهلكين، أرصدة المحافظ، التحقق من نفاذ وحدود العمليات"
                  : "Manage consumer accounts, wallet balances, Nafath KYC verification & limits"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#111726] hover:bg-[#1E293B] text-[#A2A2BA] hover:text-white border border-[#2C2C44] transition-colors cursor-pointer"
              title={isAr ? "إغلاق" : "Close"}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          {/* KPI 1: Total User Balance */}
          <div className="bg-[#111726]/90 border border-[#7FE87F]/35 rounded-xl p-3.5 space-y-1 relative overflow-hidden shadow-md">
            <span className="text-[11px] font-bold text-[#7FE87F] flex items-center gap-1">
              <Wallet className="h-3.5 w-3.5" />
              {isAr ? "إجمالي أرصدة المستخدمين" : "Total User Balance"}
            </span>
            <div className="text-xl font-black text-white tabular-nums tracking-tight text-glow-primary">
              {formatCurrency(totalBalance)}
            </div>
            <div className="text-[10px] font-semibold text-[#7FE87F] flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+18.4% YoY Growth</span>
            </div>
          </div>

          {/* KPI 2: KYC Verified Count */}
          <div className="bg-[#111726]/90 border border-[#2C2C44] rounded-xl p-3.5 space-y-1 shadow-md">
            <span className="text-[11px] font-bold text-[#A2A2BA] flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#7FE87F]" />
              {isAr ? "المستخدمون الموثقون" : "Nafath Verified Users"}
            </span>
            <div className="text-xl font-black text-white tabular-nums tracking-tight">
              {verifiedCount} / {customers.length}
            </div>
            <div className="text-[10px] font-semibold text-[#7FE87F]">
              {Math.round((verifiedCount / (customers.length || 1)) * 100)}% {isAr ? "نسبة التوثيق" : "Verification Rate"}
            </div>
          </div>

          {/* KPI 3: Daily Limit Capacity */}
          <div className="bg-[#111726]/90 border border-[#2C2C44] rounded-xl p-3.5 space-y-1 shadow-md">
            <span className="text-[11px] font-bold text-[#A2A2BA] flex items-center gap-1">
              <SmartphoneNfc className="h-3.5 w-3.5 text-[#7FE87F]" />
              {isAr ? "طاقة التحويل اليومية" : "Daily Limit Capacity"}
            </span>
            <div className="text-xl font-black text-white tabular-nums tracking-tight">
              {formatCurrency(totalDailyLimits, { decimals: 0 })}
            </div>
            <div className="text-[10px] font-semibold text-[#A2A2BA]">
              {isAr ? "شبكة سريع للتحويل الفوري" : "Sarie Instant P2P/P2M"}
            </div>
          </div>

          {/* KPI 4: Avg Balance */}
          <div className="bg-[#111726]/90 border border-[#2C2C44] rounded-xl p-3.5 space-y-1 shadow-md">
            <span className="text-[11px] font-bold text-[#A2A2BA] flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              {isAr ? "متوسط رصيد المحفظة" : "Avg Wallet Balance"}
            </span>
            <div className="text-xl font-black text-white tabular-nums tracking-tight">
              {formatCurrency(avgBalance, { decimals: 0 })}
            </div>
            <div className="text-[10px] font-semibold text-emerald-400">
              {isAr ? "مستوى المخاطر:" : "Avg Risk:"} {avgRiskScore}/100 ({isAr ? "منخفض" : "Low"})
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6E6E85] pointer-events-none ${
                isAr ? "right-3" : "left-3"
              }`}
            />
            <Input
              type="text"
              placeholder={
                isAr
                  ? "البحث بالاسم، رقم الهوية، الجوال، أو معرف سريع..."
                  : "Search by name, phone, National ID, or Sarie alias..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`h-8 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F] ${
                isAr ? "pr-8 pl-3" : "pl-8 pr-3"
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2.5 text-xs bg-[#111726] border border-[#2C2C44] rounded-lg text-[#A2A2BA] outline-none cursor-pointer focus:border-[#7FE87F]"
            >
              <option value="all">{t("common.allStatus")}</option>
              <option value="verified">{t("consumers.filterVerified")}</option>
              <option value="pending">{t("common.pending")}</option>
              <option value="frozen">{t("consumers.filterFrozen")}</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportUsers}
              className="h-8 px-2.5 text-xs bg-[#111726] border-[#2C2C44] text-[#A2A2BA] hover:text-white hover:border-[#7FE87F]/50 gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-[#7FE87F]" />
              <span>{t("common.export")}</span>
            </Button>
          </div>
        </div>

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-auto border border-[#2C2C44]/80 rounded-xl bg-[#0B111E]">
          <Table>
            <TableHeader className="bg-[#111726] sticky top-0 z-10">
              <TableRow className="border-[#2C2C44]">
                <TableHead className={isAr ? "text-right" : "text-left"}>
                  {t("consumers.tableUser")}
                </TableHead>
                <TableHead>{t("consumers.tableNationalId")}</TableHead>
                <TableHead>{t("consumers.tableMobile")}</TableHead>
                <TableHead className="text-right">{t("consumers.tableWalletBalance")}</TableHead>
                <TableHead className="text-right">{t("consumers.tableDailyLimit")}</TableHead>
                <TableHead>{t("consumers.tableRiskScore")}</TableHead>
                <TableHead>{t("consumers.tableKycStatus")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="p-8 text-center text-xs text-[#6E6E85]">
                    {t("common.noResults")}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    onClick={() => setSelectedUserId(c.id)}
                    className="cursor-pointer hover:bg-[#182236] transition-colors border-[#2C2C44]/50"
                  >
                    <TableCell className={isAr ? "text-right" : "text-left"}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#182236] border border-[#2C2C44] flex items-center justify-center font-bold text-xs text-[#7FE87F]">
                          {c.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs hover:text-[#7FE87F] transition-colors">
                            {isAr && c.fullNameAr ? c.fullNameAr : c.fullName}
                          </div>
                          <div className="text-[10px] text-[#A2A2BA] font-mono">{c.sarieUpiId}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-200">
                        <span>{c.nationalId}</span>
                        <button
                          onClick={() => handleCopy(c.nationalId, `id-${c.id}`)}
                          className="text-[#6E6E85] hover:text-white cursor-pointer"
                          title="Copy National ID"
                        >
                          {copiedField === `id-${c.id}` ? (
                            <Check className="h-3 w-3 text-[#7FE87F]" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-slate-200 font-mono">{c.mobile}</span>
                    </TableCell>

                    <TableCell className="text-right">
                      <span className="font-bold text-xs text-[#7FE87F] tabular-nums">
                        {formatCurrency(c.walletBalanceSar)}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <span className="font-semibold text-xs text-slate-200 tabular-nums">
                        {formatCurrency(c.dailyLimitSar, { decimals: 0 })}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 bg-[#182236] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              c.riskScore < 25
                                ? "bg-[#7FE87F]"
                                : c.riskScore < 60
                                ? "bg-amber-400"
                                : "bg-red-400"
                            }`}
                            style={{ width: `${c.riskScore}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-[#A2A2BA]">
                          {c.riskScore}/100
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={c.isFrozen ? "frozen" : c.kycStatus} />
                    </TableCell>

                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUserId(c.id)}
                        className="h-7 px-2.5 text-xs bg-[#111726] hover:bg-[#182236] gap-1.5 text-slate-200 border-[#2C2C44] hover:border-[#7FE87F]/40 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#7FE87F]" />
                        <span>{t("common.view")}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2C2C44]/80 text-xs text-[#A2A2BA] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7FE87F] animate-pulse" />
            <span className="text-[11px]">
              {isAr
                ? "محدث لحظياً مع بوابة النفاذ الوطني ومنظومة التحويل السريع"
                : "Synced real-time with Nafath Identity SSO & Sarie Instant Network"}
            </span>
          </div>

          <Button
            onClick={onClose}
            className="h-8 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#7FE87F] via-[#6FD86F] to-[#5FBF5F] text-[#080C14] hover:brightness-110 shadow-lg shadow-[#7FE87F]/20 cursor-pointer"
          >
            {isAr ? "إغلاق نافذة المستخدمين" : "Close Analysis"}
          </Button>
        </div>
      </div>

      {/* Nested User Detail View Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto p-4 sm:p-6 flex items-start justify-center">
          <div className="w-full max-w-5xl bg-[#080C14] border border-[#2C2C44] rounded-2xl p-6 shadow-2xl my-4">
            <UserDetailView
              user={selectedUser}
              onBack={() => setSelectedUserId(null)}
              onToggleFreeze={(uid) => onToggleFreezeAccount && onToggleFreezeAccount(uid)}
              onUpdateDailyLimit={(uid, newLimit) => onUpdateDailyLimit && onUpdateDailyLimit(uid, newLimit)}
              onRevokeDevice={(uid, devId) => onRevokeDevice && onRevokeDevice(uid, devId)}
              transactions={transactions}
              lang={isAr ? "ar" : "en"}
            />
          </div>
        </div>
      )}
    </div>
  );
};
