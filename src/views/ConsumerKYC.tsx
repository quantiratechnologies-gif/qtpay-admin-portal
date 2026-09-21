import React, { useState } from "react";
import {
  Users,
  Search,
  Eye,
  Check,
  Copy,
  Plus,
  UserPlus,
  ShieldCheck,
  Download
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
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
import { UserDetailView } from "./UserDetailView";
import { useTranslation } from "../lib/i18n/LanguageContext";
import { exportCsv } from "../lib/exportCsv";
import type { CustomerUser, PlatformTransaction } from "../types";

interface ConsumerKYCProps {
  customers: CustomerUser[];
  transactions?: PlatformTransaction[];
  onToggleFreezeAccount: (customerId: string) => void;
  onUpdateDailyLimit?: (customerId: string, newLimit: number) => void;
  onRevokeDevice?: (customerId: string, deviceId: string) => void;
  onAddCustomer?: (customer: Omit<CustomerUser, "id">) => void;
  lang?: "en" | "ar";
}

export const ConsumerKYC: React.FC<ConsumerKYCProps> = ({
  customers,
  transactions = [],
  onToggleFreezeAccount,
  onUpdateDailyLimit,
  onRevokeDevice,
  onAddCustomer
}) => {
  const { isAr, t, formatCurrency, formatNumber } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Add Customer Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formNameEn, setFormNameEn] = useState("");
  const [formNameAr, setFormNameAr] = useState("");
  const [formNationalId, setFormNationalId] = useState("");
  const [formMobile, setFormMobile] = useState("+9665");
  const [formEmail, setFormEmail] = useState("");
  const [formUpiId, setFormUpiId] = useState("");
  const [formDailyLimit, setFormDailyLimit] = useState(20000);
  const [formError, setFormError] = useState("");

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1200);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formNameEn.trim()) {
      setFormError(isAr ? "يرجى إدخال اسم المستهلك (EN)" : "Full Name (EN) is required");
      return;
    }
    if (!/^[12]\d{9}$/.test(formNationalId.trim())) {
      setFormError(
        isAr
          ? "رقم الهوية الوطنية أو الإقامة يجب أن يتكون من 10 أرقام ويبدأ بـ 1 أو 2"
          : "National ID / Iqama must be 10 digits starting with 1 or 2"
      );
      return;
    }
    if (!/^\+9665\d{8}$/.test(formMobile.trim().replace(/\s/g, ""))) {
      setFormError(isAr ? "رقم الجوال يجب أن يبدأ بـ +9665 ويليه 8 أرقام" : "Mobile must be in format +9665XXXXXXXX");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail.trim())) {
      setFormError(isAr ? "البريد الإلكتروني غير صحيح" : "Please enter a valid email address");
      return;
    }

    const generatedUpi = formUpiId.trim() || `${formMobile.slice(-4)}@sarie`;

    if (onAddCustomer) {
      onAddCustomer({
        fullName: formNameEn.trim(),
        fullNameAr: formNameAr.trim() || formNameEn.trim(),
        nationalId: formNationalId.trim(),
        mobile: formMobile.trim(),
        email: formEmail.trim(),
        sarieUpiId: generatedUpi,
        walletBalanceSar: 0,
        dailyLimitSar: Number(formDailyLimit) || 20000,
        monthlyLimitSar: (Number(formDailyLimit) || 20000) * 5,
        kycStatus: "pending",
        nafathVerifiedAt: undefined,
        riskScore: 10,
        isFrozen: false,
        totalTransferredSar: 0,
        totalReceivedSar: 0,
        joinedAt: new Date().toISOString().slice(0, 10),
        registeredDevices: [
          {
            id: `dev_${Date.now()}`,
            deviceName: "Primary Device (Pending Onboarding)",
            model: "Mobile Device",
            osVersion: "iOS / Android",
            biometricsActive: false,
            appVersion: "v3.2.0",
            lastActive: "Just Now",
            ipAddress: "178.135.92.14",
            city: "Riyadh",
            isCurrentDevice: true
          }
        ],
        activityLogs: [
          {
            id: `act_${Date.now()}`,
            userId: `usr_new`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "kyc_verify",
            title: "Consumer Account Created",
            details: "User profile initiated. Pending Nafath SSO authorization.",
            actor: "Super Admin",
            severity: "info"
          }
        ]
      });
    }

    // Reset Form
    setFormNameEn("");
    setFormNameAr("");
    setFormNationalId("");
    setFormMobile("+9665");
    setFormEmail("");
    setFormUpiId("");
    setFormDailyLimit(20000);
    setIsAddOpen(false);

    showNotice(
      isAr
        ? "تم تسجيل المستهلك الجديد بنجاح وجاهز للمطابقة عبر نفاذ"
        : `Customer ${formNameEn} onboarded successfully and queued for Nafath verification`
    );
  };

  const handleExportCustomers = () => {
    const ok = exportCsv(
      `qtpay-consumers-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered,
      [
        { label: "Full Name (EN)", value: (c) => c.fullName },
        { label: "Full Name (AR)", value: (c) => c.fullNameAr || c.fullName },
        { label: "National ID / Iqama", value: (c) => c.nationalId },
        { label: "Mobile", value: (c) => c.mobile },
        { label: "Email", value: (c) => c.email },
        { label: "SARIE Alias", value: (c) => c.sarieUpiId },
        { label: "Wallet Balance (SAR)", value: (c) => c.walletBalanceSar },
        { label: "Daily Limit (SAR)", value: (c) => c.dailyLimitSar || 20000 },
        { label: "KYC Status", value: (c) => c.kycStatus },
        { label: "Risk Score", value: (c) => c.riskScore },
        { label: "Frozen", value: (c) => c.isFrozen ? "Yes" : "No" },
        { label: "Joined Date", value: (c) => c.joinedAt }
      ]
    );
    showNotice(ok ? (isAr ? "تم تصدير سجل المستخدمين بنجاح" : "Consumers directory exported successfully") : "Export failed");
  };

  const selectedUser = customers.find((c) => c.id === selectedUserId);

  // If a user is selected, render the dedicated Sub-Screen!
  if (selectedUser) {
    return (
      <UserDetailView
        user={selectedUser}
        transactions={transactions}
        onBack={() => setSelectedUserId(null)}
        onToggleFreeze={onToggleFreezeAccount}
        onUpdateDailyLimit={onUpdateDailyLimit}
        onRevokeDevice={onRevokeDevice}
        lang={isAr ? "ar" : "en"}
      />
    );
  }

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (c.fullNameAr && c.fullNameAr.includes(search)) ||
      c.mobile.includes(search) ||
      c.nationalId.includes(search) ||
      c.sarieUpiId.includes(search)
  );

  return (
    <div className="space-y-4">
      {notice && (
        <div className="p-3 bg-[#7FE87F]/10 border border-[#7FE87F]/30 rounded-xl text-[#7FE87F] text-xs font-semibold flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-[#7FE87F]" />
          <span>{notice}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#7FE87F]/10 border border-[#7FE87F]/30 text-[#7FE87F]">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                {t("consumers.pageTitle")}
              </h2>
              <Badge variant="primary" className="text-[11px] font-bold">
                {customers.length} {t("consumers.usersBadge")}
              </Badge>
            </div>
            <p className="text-xs text-[#A2A2BA]">
              {t("consumers.pageSubtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative w-48 sm:w-64">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6E6E85] pointer-events-none ${
              isAr ? "right-2.5" : "left-2.5"
            }`} />
            <Input
              type="text"
              placeholder={t("consumers.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`h-8 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F] ${
                isAr ? "pr-8 pl-2.5" : "pl-8 pr-2.5"
              }`}
            />
          </div>

          {/* Export CSV Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCustomers}
            className="h-8 px-2.5 text-xs bg-[#111726] border-[#2C2C44] text-[#A2A2BA] hover:text-white hover:border-[#7FE87F]/50 gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#7FE87F]" />
            <span>{t("common.export")}</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={isAr ? "text-right" : "text-left"}>{t("consumers.tableUser")}</TableHead>
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
                className={`cursor-pointer hover:bg-[#182236] transition-colors ${
                  c.isFrozen ? "opacity-60 bg-red-950/10" : ""
                }`}
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
                    >
                      {copiedField === `id-${c.id}` ? <Check className="h-3 w-3 text-[#7FE87F]" /> : <Copy className="h-3 w-3" />}
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
                          c.riskScore < 25 ? "bg-[#7FE87F]" : c.riskScore < 60 ? "bg-amber-400" : "bg-red-400"
                        }`}
                        style={{ width: `${c.riskScore}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#A2A2BA]">{c.riskScore}/100</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={c.isFrozen ? "frozen" : c.kycStatus} />
                  </div>
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

      {/* Add Customer Modal Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md p-6 bg-[#111726] border-[#2C2C44] max-h-[90vh] overflow-y-auto text-start" dir={isAr ? "rtl" : "ltr"}>
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#7FE87F]/10 border border-[#7FE87F]/30 text-[#7FE87F]">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-extrabold text-white">
                  {isAr ? "تسجيل مستخدم محفظة جديد" : "Onboard Wallet Consumer"}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#A2A2BA]">
                  {isAr
                    ? "إدخال بيانات الهوية الوطنية ورقم الجوال ومعرف سريع"
                    : "Enter Saudi National ID / Iqama, mobile, and SARIE ID"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
              {formError}
            </div>
          )}

          <form onSubmit={handleCreateCustomer} className="space-y-4 pt-1">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A2A2BA]">
                  {isAr ? "الاسم الكامل (بالإنجليزية) *" : "Full Name (EN) *"}
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Mohammed Al-Otaibi"
                  value={formNameEn}
                  onChange={(e) => setFormNameEn(e.target.value)}
                  className="h-8.5 text-xs bg-[#080C14] border-[#2C2C44] focus:border-[#7FE87F]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A2A2BA]">
                  {isAr ? "الاسم الكامل (بالعربية)" : "Full Name (AR)"}
                </label>
                <Input
                  type="text"
                  placeholder="مثال: محمد العتيبي"
                  value={formNameAr}
                  onChange={(e) => setFormNameAr(e.target.value)}
                  className="h-8.5 text-xs bg-[#080C14] border-[#2C2C44] focus:border-[#7FE87F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A2A2BA]">
                  {isAr ? "رقم الهوية الوطنية / الإقامة (10 أرقام تبدأ بـ 1 أو 2) *" : "National ID / Iqama (10 digits starting 1 or 2) *"}
                </label>
                <Input
                  type="text"
                  maxLength={10}
                  placeholder="10XXXXXXXX / 20XXXXXXXX"
                  value={formNationalId}
                  onChange={(e) => setFormNationalId(e.target.value.replace(/\D/g, ""))}
                  className="h-8.5 text-xs font-mono bg-[#080C14] border-[#2C2C44] focus:border-[#7FE87F]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A2A2BA]">
                  {isAr ? "رقم الجوال (+9665...) *" : "Mobile (+9665...) *"}
                </label>
                <Input
                  type="text"
                  maxLength={13}
                  placeholder="+9665XXXXXXXX"
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value)}
                  className="h-8.5 text-xs font-mono bg-[#080C14] border-[#2C2C44] focus:border-[#7FE87F]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A2A2BA]">
                  {isAr ? "البريد الإلكتروني *" : "Email Address *"}
                </label>
                <Input
                  type="email"
                  placeholder="user@domain.sa"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="h-8.5 text-xs bg-[#080C14] border-[#2C2C44] focus:border-[#7FE87F]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A2A2BA]">
                    {isAr ? "معرف سريع (اختياري)" : "SARIE Alias (Optional)"}
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. 5678@sarie"
                    value={formUpiId}
                    onChange={(e) => setFormUpiId(e.target.value)}
                    className="h-8.5 text-xs font-mono bg-[#080C14] border-[#2C2C44] focus:border-[#7FE87F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A2A2BA]">
                    {isAr ? "الحد اليومي (ر.س) *" : "Daily Limit (SAR) *"}
                  </label>
                  <Input
                    type="number"
                    min={1000}
                    step={1000}
                    value={formDailyLimit}
                    onChange={(e) => setFormDailyLimit(Number(e.target.value))}
                    className="h-8.5 text-xs font-mono bg-[#080C14] border-[#2C2C44] focus:border-[#7FE87F]"
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-[#2C2C44]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddOpen(false)}
                className="border-[#2C2C44] hover:bg-[#182236] cursor-pointer text-[#A2A2BA]"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-gradient-to-r from-[#7FE87F] to-[#5FBF5F] text-[#080C14] hover:opacity-95 font-bold cursor-pointer shadow-md shadow-[#7FE87F]/20"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>{isAr ? "تسجيل الحساب" : "Create Account"}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
