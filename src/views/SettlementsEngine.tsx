import React, { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Send,
  Download,
  Landmark,
  ShieldCheck
} from "lucide-react";
import { StatusBadge } from "../components/Badge";
import type { SettlementBatch } from "../types";

interface SettlementsEngineProps {
  batches: SettlementBatch[];
  onDispatchBatch: (batchId: string) => void;
  lang: "en" | "ar";
}

export const SettlementsEngine: React.FC<SettlementsEngineProps> = ({
  batches,
  onDispatchBatch,
  lang
}) => {
  const isAr = lang === "ar";
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleDispatch = (id: string) => {
    setIsProcessing(id);
    setTimeout(() => {
      onDispatchBatch(id);
      setIsProcessing(null);
    }, 1200);
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
            {isAr ? "محرك التسويات المصرفية والسيولة النقدية" : "Settlements & Banking Clearing Engine"}
          </h2>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            {isAr ? "إدارة دفعات التحويل الآلي للبنوك السعودية (الراجحي، الأهلي، الرياض) وحسابات الضمان" : "Automated batch clearing to Saudi partner banks (Al Rajhi, SNB, Riyad Bank) & Escrow liquidity"}
          </p>
        </div>
      </div>

      {/* Escrow Liquidity Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
        <div className="admin-card">
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Total SAMA Escrow Float</span>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#7FE87F", marginTop: "4px" }}>
            SAR 14,890,250.00
          </div>
          <span style={{ fontSize: "11px", color: "#10B981" }}>100% Fully Backed in Saudi Central Bank</span>
        </div>

        <div className="admin-card">
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Today's Cleared Payouts</span>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF", marginTop: "4px" }}>
            SAR 3,046,300.40
          </div>
          <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>80 Merchants Disbursed</span>
        </div>

        <div className="admin-card">
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Rolling Risk Reserve (5%)</span>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#F59E0B", marginTop: "4px" }}>
            SAR 744,512.50
          </div>
          <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Cover for Chargebacks & Disputes</span>
        </div>
      </div>

      {/* Batches Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? "رقم الدفعة" : "Batch Reference"}</th>
              <th>{isAr ? "البنك الشريك" : "Partner Bank Integration"}</th>
              <th>{isAr ? "عدد التجار" : "Merchants Count"}</th>
              <th>{isAr ? "إجمالي المبلغ الإجمالي" : "Gross Volume (SAR)"}</th>
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
                  <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#38BDF8" }}>{b.batchRef}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Cutoff: {b.cutoffTime}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700 }}>{b.bankName}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Code: {b.partnerBankCode}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{b.totalMerchants} merchants</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700 }}>SAR {b.totalGrossSar.toLocaleString()}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: "#F59E0B" }}>SAR {b.totalMdrDeductionSar.toLocaleString()}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 800, color: "#7FE87F" }}>SAR {b.totalNetDisbursedSar.toLocaleString()}</div>
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
                      <Send size={13} /> {isProcessing === b.id ? "Clearing..." : (isAr ? "تنفيذ التسوية الآن" : "Dispatch Now")}
                    </button>
                  ) : (
                    <span style={{ fontSize: "12px", color: "#10B981", fontWeight: 600 }}>
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
