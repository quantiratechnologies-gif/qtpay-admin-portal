import React, { useState } from "react";
import {
  ReceiptText,
  Search,
  Filter,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Layers,
  ArrowDownLeft
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
      (tx.sarieUtr && tx.sarieUtr.includes(search)) ||
      (tx.madaRrn && tx.madaRrn.includes(search));
    const matchesChannel = channelFilter === "all" || tx.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF" }}>
              {isAr ? "سجل المعاملات المالي الموحد (المركزي)" : "Global Realtime Transactions Ledger"}
            </h2>
            <span className="live-indicator" />
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            {isAr ? "التدقيق المباشر لجميع عمليات مدى، أبل باي، التحويل الفوري سريع، وإيصالات زاتكا" : "Unified auditable stream of POS taps, SoftPOS, P2P Sarie wires, & ZATCA e-invoices"}
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            placeholder={isAr ? "بحث بالرقم المرجعي، UTR، أو RRN..." : "Search Order Ref, Sarie UTR, RRN..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ width: "260px" }}
          />
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="input-field"
            style={{ cursor: "pointer" }}
          >
            <option value="all">{isAr ? "جميع القنوات" : "All Channels"}</option>
            <option value="pos_softpos">{isAr ? "نقاط البيع والجوال" : "POS / SoftPOS"}</option>
            <option value="consumer_p2p">{isAr ? "تحويل الأفراد (سريع)" : "Consumer Sarie"}</option>
            <option value="ecommerce_checkout">{isAr ? "بوابة الدفع الإلكتروني" : "E-Commerce Gateway"}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? "الرقم المرجعي والتوقيت" : "Order Ref & Timestamp"}</th>
              <th>{isAr ? "المرسل ➔ المستقبل" : "Sender ➔ Receiver"}</th>
              <th>{isAr ? "المبلغ والإجمالي" : "Gross Amount"}</th>
              <th>{isAr ? "عمولة المنصة (MDR)" : "MDR Take"}</th>
              <th>{isAr ? "طريقة الدفع والقناة" : "Payment Method & Channel"}</th>
              <th>{isAr ? "أرقام التدقيق (UTR / RRN)" : "Sarie UTR / mada RRN"}</th>
              <th>{isAr ? "الحالة" : "Status"}</th>
              <th>{isAr ? "التفاصيل" : "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id}>
                <td>
                  <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#38BDF8" }}>{tx.orderRef}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{new Date(tx.timestamp).toLocaleString()}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{tx.senderName}</div>
                  <div style={{ fontSize: "11px", color: "#7FE87F" }}>➔ {tx.receiverName}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 800, color: "#FFFFFF" }}>SAR {tx.amount.toFixed(2)}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>VAT (15%): SAR {tx.vatAmount.toFixed(2)}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: "#F59E0B" }}>SAR {tx.platformMdrSar.toFixed(2)}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, textTransform: "uppercase" }}>{tx.paymentMethod}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{tx.channel.replace(/_/g, " ")}</div>
                </td>
                <td>
                  <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#94A3B8" }}>{tx.sarieUtr || tx.madaRrn || "-"}</div>
                </td>
                <td>
                  <StatusBadge status={tx.status} />
                </td>
                <td>
                  <button
                    onClick={() => setSelectedTx(tx)}
                    className="btn-secondary"
                    style={{ padding: "6px 10px", fontSize: "11.5px" }}
                  >
                    {isAr ? "تدقيق" : "Inspect"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Inspection Modal */}
      {selectedTx && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTx(null)}
          title={`Audit Inspection: ${selectedTx.orderRef}`}
          width="600px"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{
              background: "#121A2D",
              borderRadius: "14px",
              padding: "16px",
              border: "1px solid var(--border-subtle)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              fontSize: "13px"
            }}>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Gross Processed Amount</span>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#7FE87F" }}>SAR {selectedTx.amount.toFixed(2)}</div>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Platform Revenue (MDR)</span>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#F59E0B" }}>SAR {selectedTx.platformMdrSar.toFixed(2)}</div>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Sarie Instant UTR</span>
                <div style={{ fontFamily: "monospace", fontWeight: 600 }}>{selectedTx.sarieUtr || "N/A"}</div>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>mada Gateway RRN</span>
                <div style={{ fontFamily: "monospace", fontWeight: 600 }}>{selectedTx.madaRrn || "N/A"}</div>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>POS Terminal ID</span>
                <div style={{ fontWeight: 600 }}>{selectedTx.terminalId || "Mobile SoftPOS"}</div>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>ZATCA Phase-2 Status</span>
                <div style={{ fontWeight: 700, color: "#10B981" }}>Compliant & Signed</div>
              </div>
            </div>

            {selectedTx.status !== "refunded" && (
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  onClick={() => {
                    onExecuteRefund(selectedTx.id);
                    setSelectedTx(null);
                  }}
                  className="btn-danger"
                >
                  <RotateCcw size={14} /> {isAr ? "إجراء استرجاع مالي فوري (Refund)" : "Authorize Immediate Refund"}
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
