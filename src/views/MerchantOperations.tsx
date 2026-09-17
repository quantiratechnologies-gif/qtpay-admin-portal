import React, { useState } from "react";
import {
  Store,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  Search,
  Filter,
  Plus,
  Terminal,
  Building,
  CreditCard
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
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Action Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "14px"
      }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF" }}>
            {isAr ? "إدارة واعتماد التجار وأجهزة نقاط البيع" : "Merchant KYB Approvals & Terminals"}
          </h2>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            {isAr ? "التحقق من السجلات التجارية (واثق)، الأرقام الضريبية (زاتكا)، وتخصيص أجهزة الدفع" : "Saudi Commercial Registration verification (Wathq), ZATCA VAT validation & SoftPOS fleet"}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            placeholder={isAr ? "بحث بالاسم، رقم السجل، أو الضريبة..." : "Search Name, CR, or VAT..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ width: "240px" }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
            style={{ cursor: "pointer" }}
          >
            <option value="all">{isAr ? "كل الحالات" : "All Statuses"}</option>
            <option value="pending_kyb">{isAr ? "في انتظار الاعتماد" : "Pending KYB"}</option>
            <option value="active">{isAr ? "نشط ومفعل" : "Active"}</option>
            <option value="action_required">{isAr ? "يتطلب إجراء" : "Action Required"}</option>
            <option value="suspended">{isAr ? "موقوف مؤقتاً" : "Suspended"}</option>
          </select>
        </div>
      </div>

      {/* Merchants Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? "اسم التاجر / المنشأة" : "Merchant / Business Name"}</th>
              <th>{isAr ? "السجل التجاري والضريبة" : "Saudi CR / VAT Number"}</th>
              <th>{isAr ? "المالك والاتصال" : "Owner & Contact"}</th>
              <th>{isAr ? "البنك ورقم الآيبان" : "Settlement Bank / IBAN"}</th>
              <th>{isAr ? "الأجهزة النشطة" : "Active POS"}</th>
              <th>{isAr ? "الحالة" : "KYB Status"}</th>
              <th>{isAr ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td>
                  <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{isAr ? m.businessNameAr : m.businessName}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{m.category} • {m.city}</div>
                </td>
                <td>
                  <div style={{ fontFamily: "monospace", fontSize: "12.5px", color: "#38BDF8", fontWeight: 600 }}>CR: {m.crNumber}</div>
                  <div style={{ fontFamily: "monospace", fontSize: "11px", color: "var(--text-muted)" }}>VAT: {m.vatNumber}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{m.ownerName}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{m.mobile}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{m.settlementBank}</div>
                  <div style={{ fontFamily: "monospace", fontSize: "11px", color: "var(--text-secondary)" }}>{m.settlementIban}</div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }}>
                    <Terminal size={14} color="#7FE87F" />
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
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                  >
                    {isAr ? "مراجعة الملف" : "Review KYB"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review & Approve KYB Modal */}
      {selectedMerchant && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMerchant(null)}
          title={`KYB Verification: ${selectedMerchant.businessName}`}
          width="620px"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Wathq and ZATCA Live Verification Simulation Card */}
            <div style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "12px",
              padding: "14px",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <FileCheck size={28} color="#10B981" />
              <div>
                <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#10B981" }}>
                  Wathq Commercial Registry & ZATCA Verified
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Entity Status: Active in Ministry of Commerce • Tax Certificate Valid through 2027
                </div>
              </div>
            </div>

            {/* Merchant Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
              <div className="admin-card" style={{ padding: "12px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>Business Name</span>
                <div style={{ fontWeight: 700, marginTop: "2px" }}>{selectedMerchant.businessName}</div>
              </div>
              <div className="admin-card" style={{ padding: "12px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>Commercial Reg (CR)</span>
                <div style={{ fontWeight: 700, marginTop: "2px", color: "#38BDF8" }}>{selectedMerchant.crNumber}</div>
              </div>
              <div className="admin-card" style={{ padding: "12px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>ZATCA VAT ID</span>
                <div style={{ fontWeight: 700, marginTop: "2px" }}>{selectedMerchant.vatNumber}</div>
              </div>
              <div className="admin-card" style={{ padding: "12px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>Owner National ID</span>
                <div style={{ fontWeight: 700, marginTop: "2px" }}>{selectedMerchant.nationalId}</div>
              </div>
              <div className="admin-card" style={{ padding: "12px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>Settlement IBAN</span>
                <div style={{ fontWeight: 700, marginTop: "2px", fontFamily: "monospace" }}>{selectedMerchant.settlementIban}</div>
              </div>
              <div className="admin-card" style={{ padding: "12px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>Risk Tier</span>
                <div style={{ marginTop: "2px" }}>
                  <StatusBadge status={selectedMerchant.riskTier} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
              <button
                onClick={() => {
                  onUpdateMerchantStatus(selectedMerchant.id, "suspended");
                  setSelectedMerchant(null);
                }}
                className="btn-danger"
              >
                <XCircle size={15} /> {isAr ? "إيقاف التاجر" : "Suspend Merchant"}
              </button>

              <button
                onClick={() => {
                  onUpdateMerchantStatus(selectedMerchant.id, "active");
                  setSelectedMerchant(null);
                }}
                className="btn-primary"
              >
                <CheckCircle2 size={15} /> {isAr ? "اعتماد وتفعيل الأجهزة" : "Approve & Activate"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
