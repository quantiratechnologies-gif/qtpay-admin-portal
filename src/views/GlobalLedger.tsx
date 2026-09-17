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
  FileCheck,
  Coins,
  Percent,
  Hash,
  Clock,
  ArrowRight,
  AlertTriangle,
  FileText
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#00FF24]/10 border border-[#00FF24]/30 text-[#00FF24]">
            <ReceiptText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                {isAr ? "سجل المعاملات والعمليات الحية" : "Live Transactions & Audit Ledger"}
              </h2>
              <Badge variant="success" className="text-[10px] uppercase font-bold tracking-wider">
                <span className="live-indicator w-1 h-1" /> LIVE STREAM
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              {isAr ? "متابعة فورية لجميع عمليات التحويل ونقاط البيع والفواتير الضريبية" : "Realtime Saudi SAMA, mada & SoftPOS transaction audit stream"}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-52">
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
            className="h-8 px-2.5 text-xs bg-[#10182A] border border-slate-800/80 rounded-lg text-slate-200 outline-none cursor-pointer focus:border-[#00FF24]/50"
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
                <div className="font-semibold text-sky-400 text-xs tracking-tight">{tx.orderRef}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3 text-slate-500" />
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-white text-xs">{tx.senderName}</div>
                <div className="text-[11px] text-[#00FF24] flex items-center gap-1 font-medium">
                  <ArrowRight className="h-3 w-3" /> {tx.receiverName}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-bold text-white text-xs tabular-nums">SAR {tx.amount.toFixed(2)}</span>
              </TableCell>
              <TableCell>
                <span className="font-bold text-amber-400 text-xs tabular-nums">SAR {tx.platformMdrSar.toFixed(2)}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase">
                  {tx.channel === "pos_softpos" ? (
                    <SmartphoneNfc className="h-3.5 w-3.5 text-[#00FF24]" />
                  ) : (
                    <ArrowDownLeft className="h-3.5 w-3.5 text-sky-400" />
                  )}
                  <span className="text-slate-200">{tx.paymentMethod}</span>
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
                  className="h-7 px-2.5 text-xs bg-[#10182A] hover:bg-slate-800 gap-1.5 text-slate-200 border-slate-800"
                >
                  <Eye className="h-3.5 w-3.5 text-[#00FF24]" />
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
          <DialogContent className="max-w-lg p-6">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold text-white">Order: {selectedTx.orderRef}</DialogTitle>
                    <DialogDescription className="text-xs text-slate-400">
                      Transaction audit ledger & cryptographic receipt
                    </DialogDescription>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px] font-bold tracking-wider">
                  <ShieldCheck className="h-3 w-3 mr-1 inline" /> ZATCA VERIFIED
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Financial Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#10182A] rounded-xl p-3.5 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Coins className="h-3.5 w-3.5 text-[#00FF24]" />
                    <span>Gross Processed</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#00FF24] tabular-nums">
                    SAR {selectedTx.amount.toFixed(2)}
                  </div>
                </div>

                <div className="bg-[#10182A] rounded-xl p-3.5 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Percent className="h-3.5 w-3.5 text-amber-400" />
                    <span>MDR Take Revenue</span>
                  </div>
                  <div className="text-lg font-extrabold text-amber-400 tabular-nums">
                    SAR {selectedTx.platformMdrSar.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Reference IDs Card */}
              <div className="bg-[#10182A] rounded-xl p-4 border border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                    <Hash className="h-3.5 w-3.5 text-sky-400" />
                    Sarie Instant UTR
                  </span>
                  <span className="font-semibold text-white text-xs tabular-nums">
                    {selectedTx.sarieUtr || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                    <SmartphoneNfc className="h-3.5 w-3.5 text-emerald-400" />
                    mada Gateway RRN
                  </span>
                  <span className="font-semibold text-white text-xs tabular-nums">
                    {selectedTx.madaRrn || "N/A"}
                  </span>
                </div>
              </div>

              {/* ZATCA Tax & Compliance Breakdown */}
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="h-4 w-4" />
                    <span>ZATCA Phase 2 Simplified Tax Invoice</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    VAT: 15%
                  </Badge>
                </div>
                <div className="space-y-1.5 pt-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Net Taxable Base:</span>
                    <span className="font-semibold text-white tabular-nums">SAR {(selectedTx.amount / 1.15).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Calculated VAT (15%):</span>
                    <span className="font-semibold text-emerald-400 tabular-nums">SAR {(selectedTx.amount - selectedTx.amount / 1.15).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              {selectedTx.status !== "refunded" && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const tx = selectedTx;
                    setSelectedTx(null);
                    setRefundConfirmTx(tx);
                  }}
                  className="gap-2 font-semibold"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isAr ? "استرجاع فوري (Refund)" : "Execute Immediate Refund"}</span>
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Refund Confirmation Dialog */}
      <Dialog open={!!refundConfirmTx} onOpenChange={(open) => !open && setRefundConfirmTx(null)}>
        {refundConfirmTx && (
          <DialogContent className="max-w-md p-6">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-white">Confirm Immediate Refund</DialogTitle>
                  <DialogDescription className="text-xs text-slate-400">
                    This action will reverse the transaction through the banking network.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="py-3 text-xs text-slate-300 bg-[#10182A] border border-slate-800/80 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Reference:</span>
                <span className="font-semibold text-sky-400">{refundConfirmTx.orderRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Refund Amount:</span>
                <span className="font-bold text-white tabular-nums">SAR {refundConfirmTx.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Channel:</span>
                <span className="font-semibold text-emerald-400 uppercase">{refundConfirmTx.paymentMethod}</span>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRefundConfirmTx(null)}
                className="border-slate-800 hover:bg-slate-800"
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
                className="gap-1.5 font-bold"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Confirm & Reverse Funds</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
