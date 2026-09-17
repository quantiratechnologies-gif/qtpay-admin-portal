import React, { useState } from "react";
import {
  Store,
  CheckCircle2,
  XCircle,
  Search,
  Terminal,
  Building,
  FileCheck,
  ShieldCheck,
  Eye,
  SlidersHorizontal
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
          <Store size={20} color="#7FE87F" />
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#FFFFFF" }}>
            {isAr ? "التجار ونقاط البيع" : "Merchants & POS Fleets"}
          </h2>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>({merchants.length})</span>
        </div>

        {/* Filter and Search Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} color="#64748B" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "10px" }} />
            <input
              type="text"
              placeholder={isAr ? "بحث بالاسم أو السجل..." : "Search Merchant or CR..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ width: "220px", paddingLeft: "32px", paddingRight: "10px", height: "36px" }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
            style={{ cursor: "pointer", height: "36px", padding: "0 10px" }}
          >
            <option value="all">{isAr ? "الكل" : "All"}</option>
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
              <th>{isAr ? "السجل والضريبة" : "CR / VAT"}</th>
              <th>{isAr ? "المالك" : "Owner"}</th>
              <th>{isAr ? "البنك" : "Bank & IBAN"}</th>
              <th>{isAr ? "الأجهزة" : "Terminals"}</th>
              <th>{isAr ? "الحالة" : "Status"}</th>
              <th>{isAr ? "إجراء" : "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td>
                  <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{isAr ? m.businessNameAr : m.businessName}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{m.city}</div>
                </td>
                <td>
                  <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#38BDF8", fontWeight: 600 }}>{m.crNumber}</div>
                  <div style={{ fontFamily: "monospace", fontSize: "10.5px", color: "var(--text-muted)" }}>{m.vatNumber}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{m.ownerName}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{m.mobile}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{m.settlementBank}</div>
                  <div style={{ fontFamily: "monospace", fontSize: "10.5px", color: "var(--text-secondary)" }}>{m.settlementIban.slice(0, 12)}...</div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 700 }}>
                    <Terminal size={13} color="#7FE87F" />
                    <span>{m.activeTerminals} POS</span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={m.status} />
                </td>
                <td>
                  <button
                    onClick={() => setSelectedMerchant(m)}
                    className="btn-secondary"
                    style={{ padding: "5px 10px", fontSize: "11.5px" }}
                  >
                    <Eye size={13} /> {isAr ? "مراجعة" : "Review"}
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
          title={`KYB: ${selectedMerchant.businessName}`}
          width="540px"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "10px",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <ShieldCheck size={20} color="#10B981" />
              <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#10B981" }}>
                Wathq CR & ZATCA Tax Status: Verified & Active
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12.5px" }}>
              <div className="admin-card" style={{ padding: "10px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "10.5px" }}>Saudi CR</span>
                <div style={{ fontWeight: 700, color: "#38BDF8", fontFamily: "monospace" }}>{selectedMerchant.crNumber}</div>
              </div>
              <div className="admin-card" style={{ padding: "10px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "10.5px" }}>ZATCA VAT</span>
                <div style={{ fontWeight: 700, fontFamily: "monospace" }}>{selectedMerchant.vatNumber}</div>
              </div>
              <div className="admin-card" style={{ padding: "10px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "10.5px" }}>Settlement IBAN</span>
                <div style={{ fontWeight: 700, fontFamily: "monospace", fontSize: "11px" }}>{selectedMerchant.settlementIban}</div>
              </div>
              <div className="admin-card" style={{ padding: "10px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "10.5px" }}>Risk Tier</span>
                <div style={{ marginTop: "2px" }}><StatusBadge status={selectedMerchant.riskTier} /></div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
              <button
                onClick={() => {
                  onUpdateMerchantStatus(selectedMerchant.id, "suspended");
                  setSelectedMerchant(null);
                }}
                className="btn-danger"
              >
                <XCircle size={14} /> {isAr ? "إيقاف" : "Suspend"}
              </button>
              <button
                onClick={() => {
                  onUpdateMerchantStatus(selectedMerchant.id, "active");
                  setSelectedMerchant(null);
                }}
                className="btn-primary"
              >
                <CheckCircle2 size={14} /> {isAr ? "اعتماد وتفعيل" : "Approve & Activate"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
