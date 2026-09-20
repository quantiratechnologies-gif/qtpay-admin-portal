import React, { useState } from "react";
import {
  X,
  Zap,
  Store,
  CreditCard,
  SmartphoneNfc,
  TrendingUp,
  PieChart as PieIcon,
  Search
} from "lucide-react";
import { PieChart, PieSliceData } from "./ui/PieChart";
import { Badge } from "./ui/badge";
import { StatusBadge } from "./Badge";
import { useTranslation } from "../lib/i18n/LanguageContext";
import type { Merchant, PlatformTransaction } from "../types";

interface MdrRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchants: Merchant[];
  transactions: PlatformTransaction[];
  lang?: "en" | "ar";
}

export const MdrRevenueModal: React.FC<MdrRevenueModalProps> = ({
  isOpen,
  onClose,
  merchants
}) => {
  const { isAr, t, formatCurrency, formatNumber, translateCategory } = useTranslation();

  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<"payment_methods" | "merchant_status">("payment_methods");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMethodKey, setSelectedMethodKey] = useState<string | null>(null);

  // Merchant counts
  const totalMerchants = merchants.length;
  const activeMerchants = merchants.filter((m) => m.status === "active");
  const pendingMerchants = merchants.filter((m) => m.status === "pending_kyb");
  const actionReqMerchants = merchants.filter((m) => m.status === "action_required");
  const suspendedMerchants = merchants.filter((m) => m.status === "suspended" || m.status === "blacklisted");

  // Calculate MDR by Payment Method with Unified Green theme colors
  const paymentMethodData = [
    {
      name: isAr ? "مدى (نقاط البيع والبطاقات)" : "mada (SoftPOS & Cards)",
      key: "mada",
      color: "#7FE87F",
      revenueSar: 28146.82,
      volumeSar: 3518350,
      percentage: 58,
      avgTakeRate: "0.80%",
      txCount: 1240,
      icon: SmartphoneNfc
    },
    {
      name: isAr ? "أبل باي (نقاط البيع والتطبيق)" : "Apple Pay (NFC & Web)",
      key: "apple_pay",
      color: "#6FD86F",
      revenueSar: 11646.96,
      volumeSar: 970580,
      percentage: 24,
      avgTakeRate: "1.20%",
      txCount: 485,
      icon: SmartphoneNfc
    },
    {
      name: isAr ? "بطاقات فيزا وماستركارد" : "Visa & Mastercard",
      key: "visa_mc",
      color: "#A2A2BA",
      revenueSar: 5823.48,
      volumeSar: 332770,
      percentage: 12,
      avgTakeRate: "1.75%",
      txCount: 162,
      icon: CreditCard
    },
    {
      name: isAr ? "سريع للتحويل الفوري (P2M)" : "Sarie Instant P2M",
      key: "sarie_instant",
      color: "#6E6E85",
      revenueSar: 2911.74,
      volumeSar: 582348,
      percentage: 6,
      avgTakeRate: "0.50%",
      txCount: 94,
      icon: Zap
    }
  ];

  const paymentPieData: PieSliceData[] = paymentMethodData.map((item) => ({
    name: item.name,
    value: item.revenueSar,
    percentage: item.percentage,
    color: item.color,
    subtext: isAr
      ? `الحجم: ${formatNumber(item.volumeSar / 1000, { decimals: 0 })} ألف ر.س • النسبة: ${item.avgTakeRate}`
      : `Vol: SAR ${(item.volumeSar / 1000).toFixed(0)}k • MDR: ${item.avgTakeRate}`
  }));

  // Merchant Status Pie Data
  const statusPieData: PieSliceData[] = [
    {
      name: isAr ? "التجار النشطين" : "Active Merchants",
      value: activeMerchants.length,
      percentage: Math.round((activeMerchants.length / (totalMerchants || 1)) * 100),
      color: "#7FE87F",
      subtext: isAr
        ? `${activeMerchants.length} تاجر (${activeMerchants.reduce((sum, m) => sum + (m.activeTerminals || 0), 0)} نقطة بيع)`
        : `${activeMerchants.length} merchants (${activeMerchants.reduce((sum, m) => sum + (m.activeTerminals || 0), 0)} SoftPOS)`
    },
    {
      name: isAr ? "قيد التدقيق (KYB)" : "Pending KYB Review",
      value: pendingMerchants.length,
      percentage: Math.round((pendingMerchants.length / (totalMerchants || 1)) * 100),
      color: "#6FD86F",
      subtext: isAr ? "بانتظار التوثيق" : `${pendingMerchants.length} pending verification`
    },
    {
      name: isAr ? "مطلوب إجراء" : "Action Required",
      value: actionReqMerchants.length,
      percentage: Math.round((actionReqMerchants.length / (totalMerchants || 1)) * 100),
      color: "#F59E0B",
      subtext: isAr ? "تحديث الأجهزة" : `${actionReqMerchants.length} terminal updates`
    },
    {
      name: isAr ? "معلق / محظور" : "Suspended / Hold",
      value: suspendedMerchants.length,
      percentage: Math.round((suspendedMerchants.length / (totalMerchants || 1)) * 100),
      color: "#EF4444",
      subtext: isAr ? "حجز احترازي" : `${suspendedMerchants.length} settlement holds`
    }
  ];

  // Filter merchants for the detailed list
  const filteredMerchants = merchants.filter((m) => {
    const matchesSearch =
      m.businessName.toLowerCase().includes(search.toLowerCase()) ||
      (m.businessNameAr && m.businessNameAr.includes(search)) ||
      m.category.toLowerCase().includes(search.toLowerCase()) ||
      m.crNumber.includes(search);
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalMdrRevenueSar = paymentMethodData.reduce((acc, p) => acc + p.revenueSar, 0);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-gradient-to-b from-[#182236] to-[#111726] border border-[#7FE87F]/35 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-black/90 overflow-hidden relative before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-[#7FE87F]/60 before:to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#2C2C44] flex items-center justify-between bg-gradient-to-r from-[#182236] to-[#111726]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#7FE87F]/15 border border-[#7FE87F]/35 text-[#7FE87F] shadow-sm shadow-[#7FE87F]/20">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  {t("mdrModal.title")}
                </h2>
                <Badge variant="primary" className="text-[10px] uppercase font-bold shadow-sm shadow-[#7FE87F]/20">
                  {t("mdrModal.liveAnalytics")}
                </Badge>
              </div>
              <p className="text-xs text-[#A2A2BA] mt-0.5">
                {t("mdrModal.subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#182236] hover:bg-[#1E293B] text-[#A2A2BA] hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#080C14]">
          {/* Top KPI Summary Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="bg-[#111726] border border-[#7FE87F]/30 rounded-xl p-3 space-y-1">
              <span className="text-[11px] font-medium text-[#A2A2BA] block">
                {t("mdrModal.totalMdrRevenue")}
              </span>
              <div className="text-lg font-black text-[#7FE87F] tabular-nums">
                {formatCurrency(totalMdrRevenueSar)}
              </div>
              <span className="text-[10px] text-[#7FE87F] font-bold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +14.2% MoM
              </span>
            </div>

            <div className="bg-[#111726] border border-[#2C2C44] rounded-xl p-3 space-y-1">
              <span className="text-[11px] font-medium text-[#A2A2BA] block">
                {t("mdrModal.totalMerchants")}
              </span>
              <div className="text-lg font-black text-white tabular-nums">
                {totalMerchants} {isAr ? "تاجر" : "Merchants"}
              </div>
              <span className="text-[10px] text-[#7FE87F] font-medium">
                {activeMerchants.length} {isAr ? "نشط" : "Active"} • {suspendedMerchants.length} {isAr ? "معلق" : "Held"}
              </span>
            </div>

            <div className="bg-[#111726] border border-[#2C2C44] rounded-xl p-3 space-y-1">
              <span className="text-[11px] font-medium text-[#A2A2BA] block">
                {t("mdrModal.avgTakeRate")}
              </span>
              <div className="text-lg font-black text-[#7FE87F] tabular-nums">
                1.00%
              </div>
              <span className="text-[10px] text-[#A2A2BA]">
                {t("mdrModal.takeRateTier")}
              </span>
            </div>

            <div className="bg-[#111726] border border-[#2C2C44] rounded-xl p-3 space-y-1">
              <span className="text-[11px] font-medium text-[#A2A2BA] block">
                {t("mdrModal.topRevenueChannel")}
              </span>
              <div className="text-lg font-black text-white truncate">
                {isAr ? "نقاط بيع مدى" : "mada SoftPOS"}
              </div>
              <span className="text-[10px] text-[#7FE87F]">
                58% {isAr ? "من إجمالي الإيراد" : "of platform take"}
              </span>
            </div>
          </div>

          {/* Chart Section with Tabs */}
          <div className="bg-[#111726] border border-[#2C2C44] rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#2C2C44]">
              <div className="flex items-center gap-2">
                <PieIcon className="h-4 w-4 text-[#7FE87F]" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  {t("mdrModal.revenueDistributionChart")}
                </h3>
              </div>

              {/* View Toggle Buttons */}
              <div className="flex items-center p-0.5 bg-[#080C14] border border-[#2C2C44] rounded-lg text-xs">
                <button
                  onClick={() => setActiveTab("payment_methods")}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    activeTab === "payment_methods"
                      ? "bg-[#7FE87F]/20 text-[#7FE87F] border border-[#7FE87F]/40 shadow-sm"
                      : "text-[#A2A2BA] hover:text-white"
                  }`}
                >
                  {t("mdrModal.byPaymentMethod")}
                </button>
                <button
                  onClick={() => setActiveTab("merchant_status")}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    activeTab === "merchant_status"
                      ? "bg-[#7FE87F]/20 text-[#7FE87F] border border-[#7FE87F]/40 shadow-sm"
                      : "text-[#A2A2BA] hover:text-white"
                  }`}
                >
                  {t("mdrModal.byMerchantStatus")}
                </button>
              </div>
            </div>

            {/* Render Selected Pie Chart */}
            {activeTab === "payment_methods" ? (
              <div>
                <PieChart
                  data={paymentPieData}
                  centerValue={formatCurrency(totalMdrRevenueSar, { hideCurrency: false, decimals: 0 })}
                  centerLabel={t("mdrModal.mdrTotalLabel")}
                  size={190}
                  thickness={28}
                  valuePrefix={isAr ? "" : "SAR "}
                  valueSuffix={isAr ? " ر.س" : ""}
                />
              </div>
            ) : (
              <div>
                <PieChart
                  data={statusPieData}
                  centerValue={`${totalMerchants}`}
                  centerLabel={t("mdrModal.merchantsTotalLabel")}
                  size={190}
                  thickness={28}
                  valueSuffix={isAr ? " تجار" : " merchants"}
                />
              </div>
            )}
          </div>

          {/* Payment Methods Breakdown Cards Grid */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#7FE87F]" />
              {t("mdrModal.paymentMethodDetails")}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {paymentMethodData.map((item) => {
                const isSelected = selectedMethodKey === item.key;
                return (
                  <div
                    key={item.key}
                    onClick={() => setSelectedMethodKey(isSelected ? null : item.key)}
                    className={`p-3 bg-[#111726] border rounded-xl space-y-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#7FE87F] shadow-lg shadow-[#7FE87F]/20 bg-gradient-to-b from-[#182236] to-[#111726] ring-1 ring-[#7FE87F]"
                        : "border-[#2C2C44] hover:border-[#7FE87F]/40 hover:bg-[#151D2E]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-bold truncate max-w-[130px]"
                        style={{ color: item.color }}
                      >
                        {item.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#182236] text-[#A2A2BA] font-mono font-bold">
                        {item.percentage}%
                      </span>
                    </div>

                    <div>
                      <div className="text-sm font-extrabold text-white tabular-nums">
                        {formatCurrency(item.revenueSar)}
                      </div>
                      <div className="text-[10px] text-[#A2A2BA]">
                        {t("mdrModal.onGrossVolumeOf")} {formatCurrency(item.volumeSar, { decimals: 0 })}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#2C2C44] flex items-center justify-between text-[10px]">
                      <span className="text-[#A2A2BA]">{t("mdrModal.mdrRate")}</span>
                      <span className="font-bold text-[#7FE87F]">{item.avgTakeRate}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Channel Drilldown Strip */}
            {selectedMethodKey && (() => {
              const selectedItem = paymentMethodData.find((p) => p.key === selectedMethodKey);
              if (!selectedItem) return null;
              return (
                <div className="mt-3 flex items-center justify-between rounded-xl border border-[#7FE87F]/40 bg-[#7FE87F]/10 px-4 py-3 shadow-inner">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#7FE87F] flex items-center gap-1.5">
                      <span className="live-indicator w-1.5 h-1.5" />
                      <span>{isAr ? "تفاصيل القناة المحددة" : "Selected Payment Channel Analysis"}</span>
                    </div>
                    <div className="text-sm font-extrabold text-white mt-0.5">
                      {selectedItem.name} — {formatCurrency(selectedItem.revenueSar)} ({selectedItem.percentage}% {isAr ? "من إجمالي العمولات" : "of total MDR"})
                      <span className="text-[#A2A2BA] font-medium text-xs">
                        {" "}· {formatNumber(selectedItem.txCount)} {isAr ? "عملية منفذة" : "settled transactions"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMethodKey(null)}
                    className="text-[11px] font-bold text-[#A2A2BA] hover:text-white px-2.5 py-1 rounded-md bg-[#111726] border border-[#2C2C44] hover:border-[#7FE87F]/40 cursor-pointer"
                  >
                    {isAr ? "إلغاء التحديد" : "Clear"}
                  </button>
                </div>
              );
            })()}
          </div>

          {/* Merchant-Level MDR Breakdown Table */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Store className="h-4 w-4 text-[#7FE87F]" />
                  {t("mdrModal.merchantContributionTitle")}
                </h4>
                <p className="text-[11px] text-[#A2A2BA]">
                  {t("mdrModal.merchantContributionSubtitle")}
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className={`absolute top-2.5 h-3.5 w-3.5 text-[#6E6E85] pointer-events-none ${
                    isAr ? "right-2.5" : "left-2.5"
                  }`} />
                  <input
                    type="text"
                    placeholder={t("mdrModal.filterMerchantPlaceholder")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`py-1.5 bg-[#111726] border border-[#2C2C44] rounded-lg text-xs text-white placeholder-[#6E6E85] focus:outline-none focus:border-[#7FE87F] ${
                      isAr ? "pr-8 pl-3" : "pl-8 pr-3"
                    }`}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-[#111726] border border-[#2C2C44] rounded-lg text-xs text-[#A2A2BA] focus:outline-none focus:border-[#7FE87F]"
                >
                  <option value="all">{t("common.allStatus")}</option>
                  <option value="active">{t("common.active")}</option>
                  <option value="pending_kyb">{t("common.pending")}</option>
                  <option value="action_required">{t("common.actionRequired")}</option>
                  <option value="suspended">{t("common.suspended")}</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="border border-[#2C2C44] rounded-xl overflow-x-auto bg-[#111726]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2C2C44] bg-[#182236] text-[11px] font-bold text-[#A2A2BA]">
                    <th className={`p-3 ${isAr ? "text-right" : "text-left"}`}>{t("mdrModal.tableMerchant")}</th>
                    <th className="p-3">{t("mdrModal.tableStatus")}</th>
                    <th className="p-3">{t("mdrModal.tablePaymentMethods")}</th>
                    <th className="p-3 text-right">{t("mdrModal.tableMonthlyVol")}</th>
                    <th className="p-3 text-right">{t("mdrModal.tableMdrRate")}</th>
                    <th className="p-3 text-right">{t("mdrModal.tableEstMdr")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C2C44]">
                  {filteredMerchants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-xs text-[#6E6E85]">
                        {t("mdrModal.noMatchingMerchants")}
                      </td>
                    </tr>
                  ) : (
                    filteredMerchants.map((merchant) => {
                      const rate = merchant.customMdrRate || (merchant.status === "active" ? 0.75 : 1.0);
                      const mdrSar = ((merchant.monthlyVolumeSar || 0) * (rate / 100));

                      return (
                        <tr key={merchant.id} className="hover:bg-[#182236] transition-colors">
                          <td className={`p-3 ${isAr ? "text-right" : "text-left"}`}>
                            <div className="font-bold text-white">
                              {isAr && merchant.businessNameAr ? merchant.businessNameAr : merchant.businessName}
                            </div>
                            <div className="text-[10px] text-[#A2A2BA] flex items-center gap-1.5">
                              <span>CR: {merchant.crNumber}</span>
                              <span>•</span>
                              <span className="text-[#A2A2BA]">{translateCategory(merchant.category)}</span>
                            </div>
                          </td>

                          <td className="p-3">
                            <StatusBadge status={merchant.status} />
                          </td>

                          <td className="p-3">
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded bg-[#7FE87F]/15 border border-[#7FE87F]/25 text-[#7FE87F] text-[10px] font-bold">
                                {isAr ? "مدى" : "mada"}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-[#182236] text-slate-300 text-[10px] font-bold">
                                {isAr ? "أبل باي" : "Apple Pay"}
                              </span>
                              {merchant.riskTier !== "high" && (
                                <span className="px-1.5 py-0.5 rounded bg-[#182236] border border-[#2C2C44] text-slate-300 text-[10px] font-bold">
                                  {isAr ? "فيزا/ماستركارد" : "Visa/MC"}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-3 text-right font-mono font-bold text-slate-200 tabular-nums">
                            {formatCurrency(merchant.monthlyVolumeSar, { decimals: 0 })}
                          </td>

                          <td className="p-3 text-right font-mono font-bold text-[#7FE87F] tabular-nums">
                            {rate.toFixed(2)}%
                          </td>

                          <td className="p-3 text-right font-mono font-extrabold text-[#7FE87F] tabular-nums">
                            {formatCurrency(mdrSar)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#2C2C44] bg-[#111726] flex items-center justify-between">
          <div className="text-xs text-[#A2A2BA]">
            {t("mdrModal.footerNotice")}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#182236] hover:bg-[#1E293B] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer border border-[#2C2C44]"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
};
