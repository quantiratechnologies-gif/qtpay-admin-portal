import React, { useState } from "react";
import {
  ReceiptText,
  Search,
  RotateCcw,
  SmartphoneNfc,
  ArrowDownLeft,
  Globe,
  SlidersHorizontal,
  Eye
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
          <ReceiptText size={20} color="#7FE87F" />
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#FFFFFF" }}>
            {isAr ? "سجل المعاملات المباشر" : "Global Realtime Ledger"}
          </h2>
          <span className="live-indicator" style={{ width: "6px", height: "6px" }} />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} color="#64748B" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "10px" }} />
            <input
              type="text"
              placeholder={isAr ? "بحث بالرقم المرجعي..." : "Search Ref or UTR..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ width: "220px", paddingLeft: "32px", paddingRight: "10px", height: "36px" }}
            />
          </div>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="input-field"
            style={{ cursor: "pointer", height: "36px", padding: "0 10px" }}
          >
            <option value="all">{isAr ? "كل القنوات" : "All Channels"}</option>
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
              <th>{isAr ? "المرجع" : "Ref"}</th>
              <th>{isAr ? "الطرفان" : "Flow"}</th>
              <th>{isAr ? "المبلغ" : "Gross"}</th>
              <th>{isAr ? "العمولة" : "MDR"}</th>
              <th>{isAr ? "القناة" : "Rail"}</th>
              <th>{isAr ? "الحالة" : "Status"}</th>
              <th>{isAr ? "إجراء" : "Action"}</th>
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
                  <div style={{ fontWeight: 800, color: "#FFFFFF", fontSize: "13.5px" }}>SAR {tx.amount.toFixed(2)}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: "#F59E0B", fontSize: "12.5px" }}>SAR {tx.platformMdrSar.toFixed(2)}</div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>
                    {tx.channel === "pos_softpos" ? <SmartphoneNfc size={14} color="#7FE87F" /> : <ArrowDownLeft size={14} color="#38BDF8" />}
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
                    style={{ padding: "5px 10px", fontSize: "11px" }}
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
          title={`Transaction: ${selectedTx.orderRef}`}
          width="520px"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{
              background: "#121A2D",
              borderRadius: "12px",
              padding: "14px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              fontSize: "12.5px"
            }}>
              <div>
                <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Gross Amount</span>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#7FE87F" }}>SAR {selectedTx.amount.toFixed(2)}</div>
              </div>
              <div>
                <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>MDR Take</span>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#F59E0B" }}>SAR {selectedTx.platformMdrSar.toFixed(2)}</div>
              </div>
              <div>
                <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Sarie UTR</span>
                <div style={{ fontFamily: "monospace", fontWeight: 600 }}>{selectedTx.sarieUtr || "N/A"}</div>
              </div>
              <div>
                <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>mada RRN</span>
                <div style={{ fontFamily: "monospace", fontWeight: 600 }}>{selectedTx.madaRrn || "N/A"}</div>
              </div>
            </div>

            {selectedTx.status !== "refunded" && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                <button
                  onClick={() => {
                    onExecuteRefund(selectedTx.id);
                    setSelectedTx(null);
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
    </div>
  );
};
