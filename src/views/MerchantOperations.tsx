import React, { useState } from "react";
import {
  Store,
  Search,
  Terminal,
  Eye,
  Copy,
  Check,
  Plus,
  Building2,
  ShieldCheck,
  FileText
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
import { MerchantDetailView } from "./MerchantDetailView";
import { useTranslation } from "../lib/i18n/LanguageContext";
import type { Merchant, PlatformTransaction } from "../types";

interface MerchantOperationsProps {
  merchants: Merchant[];
  transactions?: PlatformTransaction[];
  onUpdateMerchantStatus: (merchantId: string, newStatus: Merchant["status"]) => void;
  onExecuteRefund?: (txId: string) => void;
  onProvisionTerminal?: (merchantId: string, model: string) => void;
  onAddMerchant?: (merchant: Omit<Merchant, "id">) => void;
  lang?: "en" | "ar";
}

export const MerchantOperations: React.FC<MerchantOperationsProps> = ({
  merchants,
  transactions = [],
  onUpdateMerchantStatus,
  onExecuteRefund,
  onProvisionTerminal,
  onAddMerchant
}) => {
  const { isAr, t, formatCurrency, translateCategory } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Add Merchant Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formNameEn, setFormNameEn] = useState("");
  const [formNameAr, setFormNameAr] = useState("");
  const [formCr, setFormCr] = useState("");
  const [formVat, setFormVat] = useState("");
  const [formCategory, setFormCategory] = useState("Food & Beverage (MCC 5812)");
  const [formOwner, setFormOwner] = useState("");
  const [formMobile, setFormMobile] = useState("+9665");
  const [formEmail, setFormEmail] = useState("");
  const [formCity, setFormCity] = useState("Riyadh");
  const [formBank, setFormBank] = useState("Al Rajhi Bank");
  const [formIban, setFormIban] = useState("SA");
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

  const handleCreateMerchant = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formNameEn.trim()) {
      setFormError(isAr ? "يرجى إدخال اسم المنشأة التجاري (EN)" : "Business Name (EN) is required");
      return;
    }
    if (!/^\d{10}$/.test(formCr.trim())) {
      setFormError(isAr ? "رقم السجل التجاري يجب أن يتكون من 10 أرقام" : "CR Number must be exactly 10 digits");
      return;
    }
    if (!/^\d{15}$/.test(formVat.trim())) {
      setFormError(isAr ? "الرقم الضريبي يجب أن يتكون من 15 رقماً" : "VAT Number must be exactly 15 digits");
      return;
    }
    if (!formOwner.trim()) {
      setFormError(isAr ? "يرجى إدخال اسم المفوض أو المالك" : "Owner name is required");
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
    const cleanIban = formIban.trim().replace(/\s/g, "").toUpperCase();
    if (!/^SA\d{22}$/.test(cleanIban)) {
      setFormError(isAr ? "رقم الآيبان غير صحيح (يجب أن يبدأ بـ SA ويليه 22 رقماً)" : "IBAN must start with SA followed by 22 digits");
      return;
    }

    if (onAddMerchant) {
      onAddMerchant({
        businessName: formNameEn.trim(),
        businessNameAr: formNameAr.trim() || formNameEn.trim(),
        crNumber: formCr.trim(),
        vatNumber: formVat.trim(),
        nationalId: `10${Math.floor(10000000 + Math.random() * 90000000)}`,
        category: formCategory,
        ownerName: formOwner.trim(),
        mobile: formMobile.trim(),
        email: formEmail.trim(),
        city: formCity,
        settlementBank: formBank,
        settlementIban: cleanIban,
        status: "pending_kyb",
        riskTier: "low",
        activeTerminals: 0,
        terminalIds: [],
        terminalsList: [],
        monthlyVolumeSar: 0,
        joinedAt: new Date().toISOString().slice(0, 10),
        settlementHold: false,
        activityLogs: [
          {
            id: `act_${Date.now()}`,
            merchantId: `mch_new`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "kyb_update",
            title: "Merchant Registered",
            details: "Initial merchant account onboarded via Admin Portal",
            actor: "Super Admin",
            severity: "info"
          }
        ]
      });
    }

    // Reset Form
    setFormNameEn("");
    setFormNameAr("");
    setFormCr("");
    setFormVat("");
    setFormOwner("");
    setFormMobile("+9665");
    setFormEmail("");
    setFormIban("SA");
    setIsAddOpen(false);

    showNotice(
      isAr
        ? "تم تسجيل التاجر الجديد بنجاح وإرسال ملف التحقق (KYB)"
        : `Merchant ${formNameEn} registered successfully and placed in KYB review`
    );
  };

  const selectedMerchant = merchants.find((m) => m.id === selectedMerchantId);

  // If a merchant is selected, render the dedicated Sub-Screen!
  if (selectedMerchant) {
    return (
      <MerchantDetailView
        merchant={selectedMerchant}
        transactions={transactions}
        onBack={() => setSelectedMerchantId(null)}
        onUpdateStatus={onUpdateMerchantStatus}
        onExecuteRefund={onExecuteRefund}
        onProvisionTerminal={onProvisionTerminal}
        lang={isAr ? "ar" : "en"}
      />
    );
  }

  const filtered = merchants.filter((m) => {
    const matchesSearch =
      m.businessName.toLowerCase().includes(search.toLowerCase()) ||
      (m.businessNameAr && m.businessNameAr.includes(search)) ||
      m.crNumber.includes(search) ||
      m.vatNumber.includes(search) ||
      m.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <Store className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                {t("merchants.pageTitle")}
              </h2>
              <Badge variant="primary" className="text-[11px] font-bold">
                {merchants.length} {t("merchants.registeredBadge")}
              </Badge>
            </div>
            <p className="text-xs text-[#A2A2BA]">
              {t("merchants.pageSubtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative w-48 sm:w-56">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6E6E85] pointer-events-none ${
              isAr ? "right-2.5" : "left-2.5"
            }`} />
            <Input
              type="text"
              placeholder={t("merchants.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`h-8 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F] ${
                isAr ? "pr-8 pl-2.5" : "pl-8 pr-2.5"
              }`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2.5 text-xs bg-[#111726] border border-[#2C2C44] rounded-lg text-[#A2A2BA] outline-none cursor-pointer focus:border-[#7FE87F]"
          >
            <option value="all">{t("common.allStatus")}</option>
            <option value="active">{t("common.active")}</option>
            <option value="pending_kyb">{t("common.pending")}</option>
            <option value="action_required">{t("common.actionRequired")}</option>
            <option value="suspended">{t("common.suspended")}</option>
          </select>

          {/* Add Merchant Button */}
          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="h-8 px-3 text-xs bg-gradient-to-r from-[#7FE87F] to-[#5FBF5F] text-[#080C14] hover:opacity-95 font-black gap-1.5 shadow-md shadow-[#7FE87F]/20 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span>{isAr ? "إضافة تاجر جديد" : "Add Merchant"}</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={isAr ? "text-right" : "text-left"}>{t("merchants.tableBusinessName")}</TableHead>
            <TableHead>{t("merchants.tableCrVat")}</TableHead>
            <TableHead>{t("merchants.ownerLabel")}</TableHead>
            <TableHead>{t("merchants.settlementBankLabel")}</TableHead>
            <TableHead>{t("merchants.tableTerminals")}</TableHead>
            <TableHead className="text-right">{t("merchants.tableVolume")}</TableHead>
            <TableHead>{t("common.status")}</TableHead>
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
            filtered.map((m) => (
              <TableRow
                key={m.id}
                onClick={() => setSelectedMerchantId(m.id)}
                className="cursor-pointer hover:bg-[#182236] transition-colors"
              >
                <TableCell className={isAr ? "text-right" : "text-left"}>
                  <div className="font-bold text-white text-xs hover:text-[#7FE87F] transition-colors">
                    {isAr && m.businessNameAr ? m.businessNameAr : m.businessName}
                  </div>
                  <div className="text-[10px] text-[#A2A2BA]">{m.city} • {translateCategory(m.category)}</div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#7FE87F] font-semibold tabular-nums">{m.crNumber}</span>
                    <button
                      onClick={() => handleCopy(m.crNumber, `cr-${m.id}`)}
                      className="text-[#6E6E85] hover:text-white cursor-pointer"
                    >
                      {copiedField === `cr-${m.id}` ? <Check className="h-3 w-3 text-[#7FE87F]" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                  <div className="text-[10px] text-[#A2A2BA] tabular-nums">{m.vatNumber}</div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-xs text-slate-200">{m.ownerName}</div>
                  <div className="text-[10px] text-[#A2A2BA] tabular-nums">{m.mobile}</div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-xs text-slate-200">{m.settlementBank}</div>
                  <div className="text-[10px] text-[#A2A2BA] tabular-nums">{m.settlementIban.slice(0, 14)}...</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 font-bold text-xs text-[#7FE87F]">
                    <Terminal className="h-3.5 w-3.5" />
                    <span>{(m.terminalsList || []).length} {isAr ? "نقطة بيع" : "SoftPOS"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-bold text-xs text-white tabular-nums">
                    {formatCurrency(m.monthlyVolumeSar, { decimals: 0 })}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={m.status} />
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMerchantId(m.id)}
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

      {/* Add Merchant Modal Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-xl p-6 bg-[#111726] border-[#2C2C44] max-h-[90vh] overflow-y-auto text-start" dir={isAr ? "rtl" : "ltr"}>
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#7FE87F]/10 border border-[#7FE87F]/30 text-[#7FE87F]">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-extrabold text-white">
                  {isAr ? "تسجيل تاجر جديد في المنظومة" : "Onboard New Merchant (KYB)"}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#A2A2BA]">
                  {isAr
                    ? "إدخال بيانات السجل التجاري والضريبة والحساب البنكي المعتمد"
                    : "Enter commercial registration, ZATCA VAT, and settlement IBAN"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
              {formError}
            </div>
          )}

          <form onSubmit={handleCreateMerchant} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A2A2BA]">
                  {isAr ? "اسم المنشأة التجاري (بالإنجليزية) *" : "Business Name (EN) *"}
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Al-Riyadh Roastery"
                  value={formNameEn}
                  onChange={(e) => setFormNameEn(e.target.value)}
                  className="h-8.5 text-xs bg-[#080C14] border-[#2C2C44] focus:border-[#7FE87F]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A2A2BA]">
                  {isAr ? "اسم المنشأة التجاري (بالعربية)" : "Business Name (AR)"}
                </label>
                <Input
                  type="text"
                  placeholder="مثال: محمصة الرياض المختصة"
                  value={formNameAr}
                  onChange={(e) => setFormNameAr(e.target.value)}
                  className="h-8.5 text-xs bg-[#080C14] border-[#2C2C44] focus:border-[#7FE87F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A2A2BA]">
                  {isAr ? "رقم السجل التجاري (10 أرقام) *" : "CR Number (10 digits) *"}
                </label>
                <Input
                  type="text"
                  maxLength={10}
                  placeholder="1010XXXXXX"
                  value={formCr}
                  onChange={(e) => setFormCr(e.target.value.replace(/\D/g, ""))}
                  className="h-8.5 text-xs font-mono bg-[#080C14] border-[#2C2C44] focus:border-[#7FE87F]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A2A2BA]">
                  {isAr ? "الرقم الضريبي زاتكا (15 رقماً) *" : "ZATCA VAT Number (15 digits) *"}
                </label>
                <Input
                  type="text"
                  maxLength={15}
                  placeholder="310XXXXXXXXXXXX"
                  value={formVat}
                  onChange={(e) => setFormVat(e.target.value.replace(/\D/g, ""))}
                  className="h-8.5 text-xs font-mono bg-[#080C14] border-[#2C2C44] focus:border-[#7FE87F]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A2A2BA]">
                  {isAr ? "النشاط التجاري (التصنيف) *" : "Commercial Category *"}
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full h-8.5 px-2.5 text-xs bg-[#080C14] border border-[#2C2C44] rounded-md text-white outline-none focus:border-[#7FE87F]"
                >
                  <option value="Food & Beverage (MCC 5812)">Food & Beverage (MCC 5812)</option>
                  <option value="Luxury & Retail (MCC 5977)">Luxury & Retail (MCC 5977)</option>
                  <option value="Groceries & Supermarket (MCC 5411)">Groceries & Supermarket (MCC 5411)</option>
                  <option value="Electronics (MCC 5732)">Electronics (MCC 5732)</option>
                  <option value="Automotive & Travel (MCC 7512)">Automotive & Travel (MCC 7512)</option>
                  <option value="Healthcare & Pharmacy (MCC 5912)">Healthcare & Pharmacy (MCC 5912)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A2A2BA]">
                  {isAr ? "المدينة المقر *" : "City Headquarters *"}
                </label>
                <select
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  className="w-full h-8.5 px-2.5 text-xs bg-[#080C14] border border-[#2C2C44] rounded-md text-white outline-none focus:border-[#7FE87F]"
                >
                  <option value="Riyadh">Riyadh (الرياض)</option>
                  <option value="Jeddah">Jeddah (جدة)</option>
                  <option value="Dammam">Dammam (الدمام)</option>
                  <option value="Mecca">Mecca (مكة المكرمة)</option>
                  <option value="Medina">Medina (المدينة المنورة)</option>
                  <option value="Khobar">Khobar (الخبر)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A2A2BA]">
                  {isAr ? "اسم المالك / المفوض الإداري *" : "Owner / Authorized Manager *"}
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Sultan Al-Otaibi"
                  value={formOwner}
                  onChange={(e) => setFormOwner(e.target.value)}
                  className="h-8.5 text-xs bg-[#080C14] border-[#2C2C44] focus:border-[#7FE87F]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A2A2BA]">
                  {isAr ? "رقم الجوال المعتمد (+9665...) *" : "Mobile (+9665...) *"}
                </label>
                <Input
                  type="text"
                  maxLength={13}
                  placeholder="+966501234567"
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value)}
                  className="h-8.5 text-xs font-mono bg-[#080C14] border-[#2C2C44] focus:border-[#7FE87F]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A2A2BA]">
                  {isAr ? "البريد الإلكتروني للفوترة *" : "Billing Email *"}
                </label>
                <Input
                  type="email"
                  placeholder="finance@merchant.sa"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="h-8.5 text-xs bg-[#080C14] border-[#2C2C44] focus:border-[#7FE87F]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A2A2BA]">
                  {isAr ? "بنك التسوية الرئيسي *" : "Settlement Bank *"}
                </label>
                <select
                  value={formBank}
                  onChange={(e) => setFormBank(e.target.value)}
                  className="w-full h-8.5 px-2.5 text-xs bg-[#080C14] border border-[#2C2C44] rounded-md text-white outline-none focus:border-[#7FE87F]"
                >
                  <option value="Al Rajhi Bank">Al Rajhi Bank (مصرف الراجحي)</option>
                  <option value="Saudi National Bank (SNB)">Saudi National Bank - SNB (الأهلي)</option>
                  <option value="Riyad Bank">Riyad Bank (بنك الرياض)</option>
                  <option value="Banque Saudi Fransi">Banque Saudi Fransi (السعودي الفرنسي)</option>
                  <option value="Alinma Bank">Alinma Bank (مصرف الإنماء)</option>
                  <option value="Bank Albilad">Bank Albilad (بنك البلاد)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#A2A2BA]">
                {isAr ? "رقم الآيبان البنكي (SA + 22 رقماً) *" : "Settlement IBAN (SA + 22 digits) *"}
              </label>
              <Input
                type="text"
                maxLength={24}
                placeholder="SA4480000456608010123456"
                value={formIban}
                onChange={(e) => setFormIban(e.target.value.toUpperCase())}
                className="h-8.5 text-xs font-mono uppercase bg-[#080C14] border-[#2C2C44] focus:border-[#7FE87F]"
                required
              />
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
                <span>{isAr ? "إتمام التسجيل" : "Register Merchant"}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
