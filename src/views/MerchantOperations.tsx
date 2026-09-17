import React, { useState } from "react";
import {
  Store,
  CheckCircle2,
  XCircle,
  Search,
  Terminal,
  ShieldCheck,
  Eye,
  Copy,
  Check
} from "lucide-react";
import { StatusBadge } from "../components/Badge";
import { Modal } from "../components/Modal";
import type { Merchant } from "../types";

interface MerchantOperationsProps {
  merchants: Merchant[];
  onUpdateMerchantStatus: (merchantId: string, newStatus: Merchant["status"]) => void;
  lang: "en" | "ar";
}

export const MerchantOperations: React.FC<MerchantOperationsProps> = ({
  merchants,
  onUpdateMerchantStatus,
  lang
}) => {
  const isAr = lang === "ar";
  const [search, setSearch] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1200);
  };

  const filtered = merchants.filter((m) => {
    const matchesSearch =
      m.businessName.toLowerCase().includes(search.toLowerCase()) ||
      m.crNumber.includes(search) ||
      m.vatNumber.includes(search) ||
      m.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <Store size={18} color="#7FE87F" />
          <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF" }}>
            {isAr ? "التجار" : "Merchants"}
          </h2>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>({merchants.length})</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ position: "relative" }}>
            <Search size={13} color="#64748B" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "10px" }} />
            <input
              type="text"
              placeholder={isAr ? "بحث..." : "Search..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ width: "180px", paddingLeft: "28px", height: "32px", fontSize: "12px" }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
            style={{ cursor: "pointer", height: "32px", padding: "0 8px", fontSize: "12px" }}
          >
            <option value="all">{isAr ? "الكل" : "All"}</option>
            <option value="pending_kyb">{isAr ? "معلق" : "Pending"}</option>
            <option value="active">{isAr ? "نشط" : "Active"}</option>
            <option value="suspended">{isAr ? "موقوف" : "Suspended"}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? "التاجر" : "Merchant"}</th>
              <th>{isAr ? "السجل / الضريبة" : "CR / VAT"}</th>
              <th>{isAr ? "المالك" : "Owner"}</th>
              <th>{isAr ? "البنك" : "Bank"}</th>
              <th>{isAr ? "الأجهزة" : "POS"}</th>
              <th>{isAr ? "الحالة" : "Status"}</th>
              <th>{isAr ? "إجراء" : "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td>
                  <div style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "12.5px" }}>{isAr ? m.businessNameAr : m.businessName}</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{m.city}</div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "11.5px", color: "#38BDF8", fontWeight: 600 }}>{m.crNumber}</span>
                    <button
                      onClick={() => handleCopy(m.crNumber, `cr-${m.id}`)}
                      style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: "2px" }}
                    >
                      {copiedField === `cr-${m.id}` ? <Check size={10} color="#10B981" /> : <Copy size={10} />}
                    </button>
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "10px", color: "var(--text-muted)" }}>{m.vatNumber}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: "12px" }}>{m.ownerName}</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{m.mobile}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: "12px" }}>{m.settlementBank}</div>
                  <div style={{ fontFamily: "monospace", fontSize: "10px", color: "var(--text-secondary)" }}>{m.settlementIban.slice(0, 14)}...</div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px", fontWeight: 700, fontSize: "11.5px" }}>
                    <Terminal size={12} color="#7FE87F" />
                    <span>{m.activeTerminals}</span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={m.status} />
                </td>
                <td>
                  <button
                    onClick={() => setSelectedMerchant(m)}
                    className="btn-secondary"
                    style={{ padding: "4px 8px", fontSize: "11px" }}
                  >
                    <Eye size={11} /> {isAr ? "عرض" : "View"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedMerchant && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMerchant(null)}
          title={selectedMerchant.businessName}
          width="480px"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: "8px",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <ShieldCheck size={16} color="#10B981" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#10B981" }}>
                Commercial Registration & Tax Verified
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px" }}>
              <div className="admin-card" style={{ padding: "8px 10px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>CR Number</span>
                <div style={{ fontWeight: 700, color: "#38BDF8", fontFamily: "monospace" }}>{selectedMerchant.crNumber}</div>
              </div>
              <div className="admin-card" style={{ padding: "8px 10px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>VAT Number</span>
                <div style={{ fontWeight: 700, fontFamily: "monospace" }}>{selectedMerchant.vatNumber}</div>
              </div>
              <div className="admin-card" style={{ padding: "8px 10px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>IBAN</span>
                <div style={{ fontWeight: 700, fontFamily: "monospace", fontSize: "10.5px" }}>{selectedMerchant.settlementIban}</div>
              </div>
              <div className="admin-card" style={{ padding: "8px 10px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>Active POS</span>
                <div style={{ fontWeight: 700 }}>{selectedMerchant.activeTerminals} Devices</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px", marginTop: "4px" }}>
              <button
                onClick={() => {
                  onUpdateMerchantStatus(selectedMerchant.id, "suspended");
                  setSelectedMerchant(null);
                }}
                className="btn-danger"
              >
                <XCircle size={12} /> {isAr ? "إيقاف" : "Suspend"}
              </button>
              <button
                onClick={() => {
                  onUpdateMerchantStatus(selectedMerchant.id, "active");
                  setSelectedMerchant(null);
                }}
                className="btn-primary"
              >
                <CheckCircle2 size={12} /> {isAr ? "اعتماد" : "Approve"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
