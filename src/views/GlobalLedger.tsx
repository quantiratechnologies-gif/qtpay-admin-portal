import React, { useState } from "react";
import {
  ReceiptText,
  Search,
  RotateCcw,
  SmartphoneNfc,
  ArrowDownLeft,
  Eye
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
            {isAr ? "سجل المعاملات" : "Transactions"}
          </h2>
          <Badge variant="success" className="text-[10px] uppercase font-bold">
            <span className="live-indicator w-1 h-1" /> LIVE
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
              className="pl-8 h-8 text-xs bg-[#121A2D] border-[var(--border-subtle)]"
            />
          </div>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="h-8 px-2 text-xs bg-[#121A2D] border border-[var(--border-subtle)] rounded-lg text-white outline-none cursor-pointer"
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
                <span className="font-extrabold text-white text-xs">SAR {tx.amount.toFixed(2)}</span>
              </TableCell>
              <TableCell>
                <span className="font-bold text-amber-400 text-xs">SAR {tx.platformMdrSar.toFixed(2)}</span>
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
                  className="h-7 px-2.5 text-xs bg-[#121A2D] hover:bg-[#1A243B] gap-1"
                >
                  <Eye className="h-3 w-3" />
                  <span>{isAr ? "تفاصيل" : "Inspect"}</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Inspect Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        {selectedTx && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Order: {selectedTx.orderRef}</DialogTitle>
              <DialogDescription>
                Transaction ledger audit details
              </DialogDescription>
            </DialogHeader>

            <div className="bg-[#121A2D] rounded-lg p-3 grid grid-cols-2 gap-2.5 text-xs border border-[var(--border-subtle)] my-1">
              <div>
                <span className="text-[10px] text-slate-400">Gross Processed</span>
                <div className="text-sm font-extrabold text-[#7FE87F]">SAR {selectedTx.amount.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">MDR Take Revenue</span>
                <div className="text-sm font-extrabold text-amber-400">SAR {selectedTx.platformMdrSar.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Sarie Instant UTR</span>
                <div className="font-mono font-semibold text-white truncate">{selectedTx.sarieUtr || "N/A"}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">mada Gateway RRN</span>
                <div className="font-mono font-semibold text-white truncate">{selectedTx.madaRrn || "N/A"}</div>
              </div>
            </div>

            {selectedTx.status !== "refunded" && (
              <DialogFooter>
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
              </DialogFooter>
            )}
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
