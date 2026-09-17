import React, { useState } from "react";
import {
  ReceiptText,
  Search,
  RotateCcw,
  SmartphoneNfc,
  ArrowDownLeft,
  Globe,
  Eye,
  CheckCircle2,
  FileCheck
} from "lucide-react";
import { StatusBadge } from "../components/Badge";
import { Modal } from "../components/Modal";
import type { PlatformTransaction } from "../types";

interface GlobalLedgerProps {
  transactions: PlatformTransaction[];
  onExecuteRefund: (txId: string) => void;
  lang: "en" | "ar";
}

export const GlobalLedger: React.FC<GlobalLedgerProps> = ({
  transactions,
  onExecuteRefund,
  lang
}) => {
  const isAr = lang === "ar";
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [selectedTx, setSelectedTx] = useState<PlatformTransaction | null>(null);
  const [refundConfirmTx, setRefundConfirmTx] = useState<PlatformTransaction | null>(null);

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.orderRef.toLowerCase().includes(search.toLowerCase()) ||
      tx.senderName.toLowerCase().includes(search.toLowerCase()) ||
      tx.receiverName.toLowerCase().includes(search.toLowerCase()) ||
      (tx.sarieUtr && tx.sarieUtr.includes(search));
    const matchesChannel = channelFilter === "all" || tx.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

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
          <ReceiptText size={18} color="#7FE87F" />
          <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#FFFFFF" }}>
            {isAr ? "سجل المعاملات والعمليات الحية" : "Live Transactions & Audit Ledger"}
          </h2>
          <span className="live-indicator" style={{ width: "5px", height: "5px" }} />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ position: "relative" }}>
            <Search size={13} color="#64748B" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "10px" }} />
            <input
              type="text"
              placeholder={isAr ? "بحث بالرقم المرجعي..." : "Search Ref or UTR..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ width: "200px", paddingLeft: "30px", height: "34px", fontSize: "12px" }}
            />
          </div>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="input-field"
            style={{ cursor: "pointer", height: "34px", padding: "0 8px", fontSize: "12px" }}
          >
            <option value="all">{isAr ? "كل القنوات" : "All Rails"}</option>
            <option value="pos_softpos">POS / SoftPOS</option>
            <option value="consumer_p2p">Sarie P2P</option>
            <option value="ecommerce_checkout">E-Commerce</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? "المرجع والتوقيت" : "Order Ref & Time"}</th>
              <th>{isAr ? "الطرفان" : "Transaction Flow"}</th>
              <th>{isAr ? "المبلغ" : "Gross (SAR)"}</th>
              <th>{isAr ? "عمولة المنصة" : "MDR Take"}</th>
              <th>{isAr ? "القناة والدفع" : "Payment Rail"}</th>
              <th>{isAr ? "الحالة" : "Status"}</th>
              <th>{isAr ? "الإجراء" : "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id}>
                <td>
                  <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#38BDF8", fontSize: "12.5px" }}>{tx.orderRef}</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{new Date(tx.timestamp).toLocaleTimeString()}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "13px" }}>{tx.senderName}</div>
                  <div style={{ fontSize: "10.5px", color: "#7FE87F" }}>➔ {tx.receiverName}</div>
                </td>
                <td>
                  <span style={{ fontWeight: 800, color: "#FFFFFF", fontSize: "13px" }}>SAR {tx.amount.toFixed(2)}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: "#F59E0B", fontSize: "12px" }}>SAR {tx.platformMdrSar.toFixed(2)}</span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>
                    {tx.channel === "pos_softpos" ? <SmartphoneNfc size={13} color="#7FE87F" /> : <ArrowDownLeft size={13} color="#38BDF8" />}
                    <span>{tx.paymentMethod}</span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={tx.status} />
                </td>
                <td>
                  <button
                    onClick={() => setSelectedTx(tx)}
                    className="btn-secondary"
                    style={{ padding: "5px 9px", fontSize: "11px" }}
                  >
                    <Eye size={12} /> {isAr ? "تفاصيل" : "Inspect"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inspect Modal */}
      {selectedTx && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTx(null)}
          title={`Transaction Details: ${selectedTx.orderRef}`}
          width="500px"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{
              background: "#121A2D",
              borderRadius: "10px",
              padding: "14px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              fontSize: "12px"
            }}>
              <div>
                <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Gross Processed</span>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#7FE87F" }}>SAR {selectedTx.amount.toFixed(2)}</div>
              </div>
              <div>
                <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>MDR Take Revenue</span>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#F59E0B" }}>SAR {selectedTx.platformMdrSar.toFixed(2)}</div>
              </div>
              <div>
                <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Sarie Instant UTR</span>
                <div style={{ fontFamily: "monospace", fontWeight: 600 }}>{selectedTx.sarieUtr || "N/A"}</div>
              </div>
              <div>
                <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>mada Gateway RRN</span>
                <div style={{ fontFamily: "monospace", fontWeight: 600 }}>{selectedTx.madaRrn || "N/A"}</div>
              </div>
            </div>

            {selectedTx.status !== "refunded" && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                <button
                  onClick={() => {
                    const tx = selectedTx;
                    setSelectedTx(null);
                    setRefundConfirmTx(tx);
                  }}
                  className="btn-danger"
                >
                  <RotateCcw size={13} /> {isAr ? "استرجاع فوري (Refund)" : "Execute Refund"}
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Refund Confirmation Modal */}
      {refundConfirmTx && (
        <Modal
          isOpen={true}
          onClose={() => setRefundConfirmTx(null)}
          title="Confirm Immediate Refund"
          width="440px"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.4", margin: 0 }}>
              Are you sure you want to reverse <strong>SAR {refundConfirmTx.amount.toFixed(2)}</strong> for order <strong>{refundConfirmTx.orderRef}</strong> back to the original payment method?
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
              <button
                onClick={() => setRefundConfirmTx(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onExecuteRefund(refundConfirmTx.id);
                  setRefundConfirmTx(null);
                }}
                className="btn-danger"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
