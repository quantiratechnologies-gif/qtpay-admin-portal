import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  Lock,
  Unlock,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { StatusBadge } from "../components/Badge";
import { Modal } from "../components/Modal";
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
  const [freezeModalUser, setFreezeModalUser] = useState<CustomerUser | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search) ||
      c.nationalId.includes(search) ||
      c.sarieUpiId.includes(search)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Users size={18} color="#7FE87F" />
          <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#FFFFFF" }}>
            {isAr ? "دليل المستهلكين والتحقق من الهوية" : "Customer Accounts & KYC Directory"}
          </h2>
          <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>({customers.length})</span>
        </div>

        <div style={{ position: "relative" }}>
          <Search size={13} color="#64748B" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "10px" }} />
          <input
            type="text"
            placeholder={isAr ? "بحث بالمستخدم أو الهوية..." : "Search User, National ID..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ width: "220px", paddingLeft: "30px", height: "34px", fontSize: "12px" }}
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? "المستخدم" : "Customer"}</th>
              <th>{isAr ? "الهوية الوطنية" : "National ID / Iqama"}</th>
              <th>{isAr ? "رقم الجوال ومعرف سريع" : "Mobile & Sarie ID"}</th>
              <th>{isAr ? "رصيد المحفظة" : "Wallet Balance"}</th>
              <th>{isAr ? "درجة المخاطر" : "Risk Score"}</th>
              <th>{isAr ? "حالة نفاذ" : "Nafath KYC"}</th>
              <th>{isAr ? "الأمان" : "Safety"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "13px" }}>{isAr ? c.fullNameAr : c.fullName}</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{c.email}</div>
                </td>
                <td>
                  <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#38BDF8" }}>{c.nationalId}</span>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{c.mobile}</div>
                  <div style={{ fontSize: "10.5px", color: "#7FE87F", fontFamily: "monospace" }}>{c.sarieUpiId}</div>
                </td>
                <td>
                  <span style={{ fontWeight: 800, color: "#7FE87F", fontSize: "13px" }}>
                    SAR {c.walletBalanceSar.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{
                      width: "48px",
                      height: "5px",
                      background: "rgba(255,255,255,0.08)",
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
                      fontSize: "11px",
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
                    onClick={() => setFreezeModalUser(c)}
                    className={c.isFrozen ? "btn-primary" : "btn-danger"}
                    style={{ padding: "5px 10px", fontSize: "11.5px" }}
                  >
                    {c.isFrozen ? (
                      <>
                        <Unlock size={12} /> {isAr ? "فك التجميد" : "Unfreeze"}
                      </>
                    ) : (
                      <>
                        <Lock size={12} /> {isAr ? "تجميد" : "Freeze"}
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Safety Confirmation Modal */}
      {freezeModalUser && (
        <Modal
          isOpen={true}
          onClose={() => setFreezeModalUser(null)}
          title={freezeModalUser.isFrozen ? "Unfreeze Customer Account" : "Emergency Account Freeze"}
          width="440px"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.4", margin: 0 }}>
              {freezeModalUser.isFrozen
                ? `Are you sure you want to restore full wallet functionality for ${freezeModalUser.fullName}?`
                : `Are you sure you want to immediately freeze the wallet and Sarie payments for ${freezeModalUser.fullName}? This will block outgoing transfers.`}
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
              <button
                onClick={() => setFreezeModalUser(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onToggleFreezeAccount(freezeModalUser.id);
                  setFreezeModalUser(null);
                }}
                className={freezeModalUser.isFrozen ? "btn-primary" : "btn-danger"}
              >
                {freezeModalUser.isFrozen ? "Confirm Unfreeze" : "Confirm Freeze"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
