import React, { useState } from "react";
import {
  Store,
  CheckCircle2,
  XCircle,
  Search,
  Terminal,
  FileCheck,
  ShieldCheck,
  Eye,
  Copy,
  Check,
  Plus
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
    setTimeout(() => setCopiedField(null), 1500);
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
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Action Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Store size={18} color="#7FE87F" />
          <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#FFFFFF" }}>
            {isAr ? "دليل التجار ونقاط البيع" : "Merchant Directory & Terminals"}
          </h2>
          <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>({merchants.length})</span>
        </div>

        {/* Filter and Search Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ position: "relative" }}>
            <Search size={13} color="#64748B" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "10px" }} />
            <input
              type="text"
              placeholder={isAr ? "بحث بالاسم أو السجل..." : "Search Name or CR..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ width: "200px", paddingLeft: "30px", height: "34px", fontSize: "12px" }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
            style={{ cursor: "pointer", height: "34px", padding: "0 8px", fontSize: "12px" }}
          >
            <option value="all">{isAr ? "الكل" : "All Statuses"}</option>
            <option value="pending_kyb">{isAr ? "معلق" : "Pending"}</option>
            <option value="active">{isAr ? "نشط" : "Active"}</option>
            <option value="suspended">{isAr ? "موقوف" : "Suspended"}</option>
          </select>
        </div>
      </div>

      {/* Merchants Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? "المنشأة" : "Merchant"}</th>
              <th>{isAr ? "السجل التجاري والضريبة" : "Saudi CR & VAT"}</th>
              <th>{isAr ? "المالك" : "Owner"}</th>
              <th>{isAr ? "البنك ورقم الآيبان" : "Settlement Bank / IBAN"}</th>
              <th>{isAr ? "نقاط البيع" : "POS Fleet"}</th>
              <th>{isAr ? "الحالة" : "Status"}</th>
              <th>{isAr ? "الإجراء" : "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td>
                  <div style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "13px" }}>{isAr ? m.businessNameAr : m.businessName}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{m.category} • {m.city}</div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#38BDF8", fontWeight: 600 }}>CR: {m.crNumber}</span>
                    <button
                      onClick={() => handleCopy(m.crNumber, `cr-${m.id}`)}
                      style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: "2px" }}
                    >
                      {copiedField === `cr-${m.id}` ? <Check size={11} color="#10B981" /> : <Copy size={11} />}
                    </button>
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "10.5px", color: "var(--text-muted)" }}>VAT: {m.vatNumber}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{m.ownerName}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{m.mobile}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{m.settlementBank}</div>
                  <div style={{ fontFamily: "monospace", fontSize: "10.5px", color: "var(--text-secondary)" }}>{m.settlementIban.slice(0, 14)}...</div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 700, fontSize: "12px" }}>
                    <Terminal size={13} color="#7FE87F" />
                    <span>{m.activeTerminals} Terminals</span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={m.status} />
                </td>
                <td>
                  <button
                    onClick={() => setSelectedMerchant(m)}
                    className="btn-secondary"
                    style={{ padding: "5px 9px", fontSize: "11.5px" }}
                  >
                    <Eye size={12} /> {isAr ? "مراجعة" : "Review"}
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
          title={`Merchant Review: ${selectedMerchant.businessName}`}
          width="540px"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              borderRadius: "9px",
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <ShieldCheck size={18} color="#10B981" />
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#10B981" }}>
                Ministry of Commerce (Wathq) & ZATCA Verified
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px", fontSize: "12px" }}>
              <div className="admin-card" style={{ padding: "10px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>Saudi Commercial Reg (CR)</span>
                <div style={{ fontWeight: 700, color: "#38BDF8", fontFamily: "monospace", marginTop: "2px" }}>{selectedMerchant.crNumber}</div>
              </div>
              <div className="admin-card" style={{ padding: "10px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>ZATCA VAT Certificate</span>
                <div style={{ fontWeight: 700, fontFamily: "monospace", marginTop: "2px" }}>{selectedMerchant.vatNumber}</div>
              </div>
              <div className="admin-card" style={{ padding: "10px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>Settlement IBAN</span>
                <div style={{ fontWeight: 700, fontFamily: "monospace", fontSize: "11px", marginTop: "2px" }}>{selectedMerchant.settlementIban}</div>
              </div>
              <div className="admin-card" style={{ padding: "10px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>Assigned Terminals</span>
                <div style={{ fontWeight: 700, marginTop: "2px" }}>{selectedMerchant.activeTerminals} Active POS</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
              <button
                onClick={() => {
                  onUpdateMerchantStatus(selectedMerchant.id, "suspended");
                  setSelectedMerchant(null);
                }}
                className="btn-danger"
              >
                <XCircle size={13} /> {isAr ? "إيقاف التاجر" : "Suspend Merchant"}
              </button>
              <button
                onClick={() => {
                  onUpdateMerchantStatus(selectedMerchant.id, "active");
                  setSelectedMerchant(null);
                }}
                className="btn-primary"
              >
                <CheckCircle2 size={13} /> {isAr ? "اعتماد وتفعيل" : "Approve & Activate"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
