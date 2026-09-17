import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Search,
  CheckCircle2,
  XCircle,
  Smartphone,
  Wallet
} from "lucide-react";
import { StatusBadge } from "../components/Badge";
import type { CustomerUser } from "../types";

interface ConsumerKYCProps {
  customers: CustomerUser[];
  onToggleFreezeAccount: (customerId: string) => void;
  lang: "en" | "ar";
}

export const ConsumerKYC: React.FC<ConsumerKYCProps> = ({
  customers,
  onToggleFreezeAccount,
  lang
}) => {
  const isAr = lang === "ar";
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search) ||
      c.nationalId.includes(search) ||
      c.sarieUpiId.includes(search)
  );

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
            {isAr ? "دليل المستهلكين والتحقق من الهوية (Nafath/KYC)" : "Consumer KYC & Wallet Safety Directory"}
          </h2>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            {isAr ? "التحقق من الهوية الوطنية عبر نفاذ، درجات المخاطر الائتمانية، وتجميد الحسابات المشبوهة" : "Absher/Nafath National ID verification, AML risk scoring & emergency wallet safety lock"}
          </p>
        </div>

        <input
          type="text"
          placeholder={isAr ? "بحث بالاسم، رقم الهوية، أو معرف سريع..." : "Search Name, National ID, or Sarie Alias..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
          style={{ width: "280px" }}
        />
      </div>

      {/* Customer Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? "المستخدم / الهوية" : "Customer / Identity"}</th>
              <th>{isAr ? "رقم الجوال ومعرف سريع" : "Mobile & Sarie UPI ID"}</th>
              <th>{isAr ? "رصيد المحفظة" : "Wallet Balance"}</th>
              <th>{isAr ? "إجمالي التحويلات" : "Lifetime Volume"}</th>
              <th>{isAr ? "درجة المخاطر (0-100)" : "AML Risk Score"}</th>
              <th>{isAr ? "حالة نفاذ" : "Nafath KYC"}</th>
              <th>{isAr ? "إجراء الأمان" : "Safety Action"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{isAr ? c.fullNameAr : c.fullName}</div>
                  <div style={{ fontFamily: "monospace", fontSize: "11px", color: "var(--text-muted)" }}>ID: {c.nationalId}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{c.mobile}</div>
                  <div style={{ fontSize: "11px", color: "#38BDF8", fontFamily: "monospace" }}>{c.sarieUpiId}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 800, color: "#7FE87F" }}>
                    SAR {c.walletBalanceSar.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>
                    SAR {c.totalTransferredSar.toLocaleString()}
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "60px",
                      height: "6px",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "3px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${c.riskScore}%`,
                        height: "100%",
                        background: c.riskScore > 70 ? "#EF4444" : c.riskScore > 30 ? "#F59E0B" : "#10B981"
                      }} />
                    </div>
                    <span style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: c.riskScore > 70 ? "#EF4444" : c.riskScore > 30 ? "#F59E0B" : "#10B981"
                    }}>
                      {c.riskScore}
                    </span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={c.kycStatus} />
                </td>
                <td>
                  <button
                    onClick={() => onToggleFreezeAccount(c.id)}
                    className={c.isFrozen ? "btn-primary" : "btn-danger"}
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                  >
                    {c.isFrozen ? (
                      <>
                        <Unlock size={13} /> {isAr ? "إلغاء التجميد" : "Unfreeze"}
                      </>
                    ) : (
                      <>
                        <Lock size={13} /> {isAr ? "تجميد الحساب" : "Freeze"}
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
