import React, { useState } from "react";
import {
  Users,
  Search,
  Lock,
  Unlock
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
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Users size={18} color="#7FE87F" />
          <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF" }}>
            {isAr ? "المستخدمين" : "Users"}
          </h2>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>({customers.length})</span>
        </div>

        <div style={{ position: "relative" }}>
          <Search size={13} color="#64748B" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "10px" }} />
          <input
            type="text"
            placeholder={isAr ? "بحث..." : "Search User..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ width: "180px", paddingLeft: "28px", height: "32px", fontSize: "12px" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? "المستخدم" : "User"}</th>
              <th>{isAr ? "الهوية" : "National ID"}</th>
              <th>{isAr ? "الجوال / سريع" : "Mobile / Sarie"}</th>
              <th>{isAr ? "الرصيد" : "Balance"}</th>
              <th>{isAr ? "المخاطر" : "Risk"}</th>
              <th>{isAr ? "التحقق" : "KYC"}</th>
              <th>{isAr ? "إجراء" : "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "12.5px" }}>{isAr ? c.fullNameAr : c.fullName}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{c.email}</div>
                </td>
                <td>
                  <span style={{ fontFamily: "monospace", fontSize: "11.5px", color: "#38BDF8" }}>{c.nationalId}</span>
                </td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: "12px" }}>{c.mobile}</div>
                  <div style={{ fontSize: "10px", color: "#7FE87F", fontFamily: "monospace" }}>{c.sarieUpiId}</div>
                </td>
                <td>
                  <span style={{ fontWeight: 800, color: "#7FE87F", fontSize: "12.5px" }}>
                    SAR {c.walletBalanceSar.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: c.riskScore > 70 ? "#EF4444" : c.riskScore > 30 ? "#F59E0B" : "#10B981"
                  }}>
                    {c.riskScore}/100
                  </span>
                </td>
                <td>
                  <StatusBadge status={c.kycStatus} />
                </td>
                <td>
                  <button
                    onClick={() => setFreezeModalUser(c)}
                    className={c.isFrozen ? "btn-primary" : "btn-danger"}
                    style={{ padding: "4px 8px", fontSize: "11px" }}
                  >
                    {c.isFrozen ? <Unlock size={11} /> : <Lock size={11} />}
                    <span>{c.isFrozen ? (isAr ? "فك التجميد" : "Unfreeze") : (isAr ? "تجميد" : "Freeze")}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {freezeModalUser && (
        <Modal
          isOpen={true}
          onClose={() => setFreezeModalUser(null)}
          title={freezeModalUser.isFrozen ? "Unfreeze Account" : "Freeze Account"}
          width="400px"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: 0 }}>
              {freezeModalUser.isFrozen
                ? `Unfreeze wallet for ${freezeModalUser.fullName}?`
                : `Freeze wallet for ${freezeModalUser.fullName} to block outgoing transfers?`}
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
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
                {freezeModalUser.isFrozen ? "Unfreeze" : "Freeze"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
