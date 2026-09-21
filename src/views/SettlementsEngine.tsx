import React, { useState } from "react";
import { Send } from "lucide-react";
import { StatusBadge } from "../components/Badge";
import { useTranslation } from "../lib/i18n/LanguageContext";
import type { SettlementBatch } from "../types";

interface SettlementsEngineProps {
  batches: SettlementBatch[];
  onDispatchBatch: (batchId: string) => void;
  lang?: "en" | "ar";
}

export const SettlementsEngine: React.FC<SettlementsEngineProps> = ({
  batches,
  onDispatchBatch
}) => {
  const { lang, isAr, formatCurrency, formatNumber } = useTranslation();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleDispatch = (id: string) => {
    setIsProcessing(id);
    setTimeout(() => {
      onDispatchBatch(id);
      setIsProcessing(null);
    }, 1200);
  };

  const getBankDisplayName = (bankName: string) => {
    if (!isAr) return bankName;
    if (bankName.includes("Rajhi")) return "مصرف الراجحي (ربط مباشر)";
    if (bankName.includes("SNB") || bankName.includes("National")) return "البنك الأهلي السعودي (مقسم سريع)";
    if (bankName.includes("Riyad")) return "بنك الرياض (دفعة منتصف اليوم)";
    return bankName;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "14px"
      }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF" }}>
            {isAr ? "محرك التسويات المصرفية" : "Bank Settlements Engine"}
          </h2>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            {isAr
              ? "إدارة دفعات التحويل للبنوك وحسابات الضمان"
              : "Manage batch clearing to partner banks & escrow liquidity"}
          </p>
        </div>
      </div>

      {/* Escrow Liquidity Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
        <div className="admin-card">
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {isAr ? "رصيد حساب الضمان" : "Escrow Balance"}
          </span>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#F1D77A", marginTop: "4px" }} className="tabular-nums">
            {formatCurrency(14890250)}
          </div>
          <span style={{ fontSize: "11px", color: "#D4AF37" }}>
            {isAr ? "محمي بالكامل لدى البنك المركزي" : "100% Backed in Central Bank"}
          </span>
        </div>

        <div className="admin-card">
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {isAr ? "تسويات اليوم" : "Today's Payouts"}
          </span>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF", marginTop: "4px" }} className="tabular-nums">
            {formatCurrency(3046300.40)}
          </div>
          <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
            {isAr ? "80 تاجراً" : "80 Merchants"}
          </span>
        </div>

        <div className="admin-card">
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {isAr ? "احتياطي المخاطر (5%)" : "Risk Reserve (5%)"}
          </span>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#F1D77A", marginTop: "4px" }} className="tabular-nums">
            {formatCurrency(744512.50)}
          </div>
          <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
            {isAr ? "تغطية النزاعات والمستردات" : "Dispute coverage"}
          </span>
        </div>
      </div>

      {/* Batches Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? "رقم الدفعة وموعد الإغلاق" : "Batch Reference"}</th>
              <th>{isAr ? "البنك الشريك" : "Partner Bank Integration"}</th>
              <th>{isAr ? "عدد التجار" : "Merchants Count"}</th>
              <th>{isAr ? "المبلغ الإجمالي" : "Gross Volume"}</th>
              <th>{isAr ? "خصم عمولة المنصة" : "MDR Deducted"}</th>
              <th>{isAr ? "صافي التحويل للآيبان" : "Net Disbursed to IBAN"}</th>
              <th>{isAr ? "حالة الدفعة" : "Status"}</th>
              <th>{isAr ? "الإجراء" : "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b) => (
              <tr key={b.id}>
                <td>
                  <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#F1D77A" }}>{b.batchRef}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {isAr ? `موعد الإغلاق: ${b.cutoffTime}` : `Cutoff: ${b.cutoffTime}`}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 700 }}>{getBankDisplayName(b.bankName)}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {isAr ? `الرمز: ${b.partnerBankCode}` : `Code: ${b.partnerBankCode}`}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>
                    {formatNumber(b.totalMerchants)} {isAr ? "تاجر" : "merchants"}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 700 }} className="tabular-nums">{formatCurrency(b.totalGrossSar)}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: "#F1D77A" }} className="tabular-nums">
                    {formatCurrency(b.totalMdrDeductionSar)}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 800, color: "#F1D77A" }} className="tabular-nums">
                    {formatCurrency(b.totalNetDisbursedSar)}
                  </div>
                </td>
                <td>
                  <StatusBadge status={b.status} />
                </td>
                <td>
                  {b.status === "scheduled" ? (
                    <button
                      onClick={() => handleDispatch(b.id)}
                      disabled={isProcessing === b.id}
                      className="btn-primary"
                      style={{ padding: "6px 12px", fontSize: "12px" }}
                    >
                      <Send size={13} /> {isProcessing === b.id ? (isAr ? "جاري المقاصة..." : "Clearing...") : (isAr ? "تنفيذ التسوية الآن" : "Dispatch Now")}
                    </button>
                  ) : (
                    <span style={{ fontSize: "12px", color: "#F1D77A", fontWeight: 600 }}>
                      ✓ {isAr ? "مكتملة ومودعة" : "Executed"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

