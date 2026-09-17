import React, { useState } from "react";
import {
  ReceiptText,
  Search,
  RotateCcw,
  SmartphoneNfc,
  ArrowDownLeft,
  Eye,
  QrCode,
  ShieldCheck,
  Download,
  FileCheck
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { StatusBadge } from "../components/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../components/ui/dialog";
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
    <div className="space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2">
          <ReceiptText className="h-4 w-4 text-[#7FE87F]" />
          <h2 className="text-base font-extrabold text-white">
            {isAr ? "سجل المعاملات والعمليات الحية" : "Live Transactions & Audit Ledger"}
          </h2>
          <Badge variant="success" className="text-[10px] uppercase font-bold">
            <span className="live-indicator w-1 h-1" /> LIVE STREAM
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative w-48">
            <Search className="absolute top-1/2 -translate-y-1/2 left-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            <Input
              type="text"
              placeholder={isAr ? "بحث بالرقم المرجعي..." : "Search Ref or UTR..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs bg-[#10182A] border-slate-800/80"
            />
          </div>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="h-8 px-2 text-xs bg-[#10182A] border border-slate-800/80 rounded-lg text-slate-200 outline-none cursor-pointer"
          >
            <option value="all">{isAr ? "كل القنوات" : "All Rails"}</option>
            <option value="pos_softpos">POS / SoftPOS</option>
            <option value="consumer_p2p">Sarie P2P</option>
            <option value="ecommerce_checkout">E-Commerce</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{isAr ? "المرجع والتوقيت" : "Order Ref & Time"}</TableHead>
            <TableHead>{isAr ? "الطرفان" : "Transaction Flow"}</TableHead>
            <TableHead>{isAr ? "المبلغ" : "Gross (SAR)"}</TableHead>
            <TableHead>{isAr ? "عمولة المنصة" : "MDR Take"}</TableHead>
            <TableHead>{isAr ? "القناة والدفع" : "Payment Rail"}</TableHead>
            <TableHead>{isAr ? "الحالة" : "Status"}</TableHead>
            <TableHead>{isAr ? "الإجراء" : "Action"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>
                <div className="font-mono font-bold text-sky-400 text-xs">{tx.orderRef}</div>
                <div className="text-[10px] text-slate-400">{new Date(tx.timestamp).toLocaleTimeString()}</div>
              </TableCell>
              <TableCell>
                <div className="font-bold text-white text-xs">{tx.senderName}</div>
                <div className="text-[10px] text-[#7FE87F]">➔ {tx.receiverName}</div>
              </TableCell>
              <TableCell>
                <span className="font-extrabold text-white text-xs font-mono">SAR {tx.amount.toFixed(2)}</span>
              </TableCell>
              <TableCell>
                <span className="font-bold text-amber-400 text-xs font-mono">SAR {tx.platformMdrSar.toFixed(2)}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase">
                  {tx.channel === "pos_softpos" ? (
                    <SmartphoneNfc className="h-3.5 w-3.5 text-[#7FE87F]" />
                  ) : (
                    <ArrowDownLeft className="h-3.5 w-3.5 text-sky-400" />
                  )}
                  <span>{tx.paymentMethod}</span>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={tx.status} />
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTx(tx)}
                  className="h-7 px-2.5 text-xs bg-[#10182A] hover:bg-slate-800 gap-1 text-slate-200"
                >
                  <Eye className="h-3 w-3 text-[#7FE87F]" />
                  <span>{isAr ? "تفاصيل" : "Inspect"}</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Inspect & ZATCA Compliance Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        {selectedTx && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Order: {selectedTx.orderRef}</DialogTitle>
                <Badge variant="success" className="text-[10px]">ZATCA PHASE 2 VERIFIED</Badge>
              </div>
              <DialogDescription>
                Transaction ledger audit details & cryptographic invoice receipt
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-1">
              <div className="bg-[#10182A] rounded-lg p-3 grid grid-cols-2 gap-2.5 text-xs border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400">Gross Processed</span>
                  <div className="text-sm font-extrabold text-[#7FE87F] font-mono">SAR {selectedTx.amount.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">MDR Take Revenue</span>
                  <div className="text-sm font-extrabold text-amber-400 font-mono">SAR {selectedTx.platformMdrSar.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Sarie Instant UTR</span>
                  <div className="font-mono font-semibold text-white text-[11px] truncate">{selectedTx.sarieUtr || "N/A"}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">mada Gateway RRN</span>
                  <div className="font-mono font-semibold text-white text-[11px] truncate">{selectedTx.madaRrn || "N/A"}</div>
                </div>
              </div>

              {/* ZATCA Tax & Compliance Breakdown */}
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <ShieldCheck className="h-4 w-4" />
                    <span>ZATCA Simplified Tax Invoice</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">VAT: 15%</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-300 pt-1">
                  <span>Net Taxable Base:</span>
                  <span className="font-mono">SAR {(selectedTx.amount / 1.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Calculated VAT (15%):</span>
                  <span className="font-mono">SAR {(selectedTx.amount - selectedTx.amount / 1.15).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              {selectedTx.status !== "refunded" && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const tx = selectedTx;
                    setSelectedTx(null);
                    setRefundConfirmTx(tx);
                  }}
                  className="gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isAr ? "استرجاع فوري (Refund)" : "Execute Refund"}</span>
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Refund Confirmation Dialog */}
      <Dialog open={!!refundConfirmTx} onOpenChange={(open) => !open && setRefundConfirmTx(null)}>
        {refundConfirmTx && (
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirm Immediate Refund</DialogTitle>
              <DialogDescription>
                Are you sure you want to reverse <strong className="text-white">SAR {refundConfirmTx.amount.toFixed(2)}</strong> for order <strong className="text-sky-400">{refundConfirmTx.orderRef}</strong> back to the original payment method?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRefundConfirmTx(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onExecuteRefund(refundConfirmTx.id);
                  setRefundConfirmTx(null);
                }}
              >
                Confirm Refund
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
