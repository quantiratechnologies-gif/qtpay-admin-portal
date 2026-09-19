import React, { useState } from "react";
import {
  ReceiptText,
  Search,
  RotateCcw,
  SmartphoneNfc,
  ArrowDownLeft,
  Eye,
  ShieldCheck,
  Coins,
  Percent,
  Hash,
  Clock,
  ArrowRight,
  ArrowLeft,
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
import { useTranslation } from "../lib/i18n/LanguageContext";
import type { PlatformTransaction } from "../types";

interface GlobalLedgerProps {
  transactions: PlatformTransaction[];
  onExecuteRefund: (txId: string) => void;
  lang?: "en" | "ar";
}

export const GlobalLedger: React.FC<GlobalLedgerProps> = ({
  transactions,
  onExecuteRefund
}) => {
  const { isAr, t, formatCurrency, formatDate, translatePaymentMethod, translateChannel } = useTranslation();
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

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#7FE87F]/10 border border-[#7FE87F]/30 text-[#7FE87F]">
            <ReceiptText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                {t("ledger.pageTitle")}
              </h2>
              <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-wider">
                <span className="live-indicator w-1 h-1" /> {t("common.liveStream")}
              </Badge>
            </div>
            <p className="text-xs text-[#A2A2BA]">
              {t("ledger.pageSubtitle")}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-52 sm:w-64">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6E6E85] pointer-events-none ${
              isAr ? "right-2.5" : "left-2.5"
            }`} />
            <Input
              type="text"
              placeholder={isAr ? "بحث بالرقم المرجعي أو UTR..." : "Search Ref or UTR..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`h-8 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F] ${
                isAr ? "pr-8 pl-2.5" : "pl-8 pr-2.5"
              }`}
            />
          </div>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="h-8 px-2.5 text-xs bg-[#111726] border border-[#2C2C44] rounded-lg text-[#A2A2BA] outline-none cursor-pointer focus:border-[#7FE87F]"
          >
            <option value="all">{t("ledger.allChannels")}</option>
            <option value="pos_softpos">{translateChannel("pos_softpos")}</option>
            <option value="consumer_p2p">{translateChannel("consumer_p2p")}</option>
            <option value="ecommerce_checkout">{translateChannel("ecommerce_checkout")}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={isAr ? "text-right" : "text-left"}>{t("ledger.tableOrderRef")}</TableHead>
            <TableHead>{t("ledger.tableSenderReceiver")}</TableHead>
            <TableHead className="text-right">{t("ledger.tableAmount")}</TableHead>
            <TableHead className="text-right">{t("ledger.tableMdr")}</TableHead>
            <TableHead>{t("ledger.tablePaymentMethod")}</TableHead>
            <TableHead>{t("common.status")}</TableHead>
            <TableHead className="text-right">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="p-8 text-center text-xs text-[#6E6E85]">
                {t("common.noResults")}
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-[#182236] transition-colors">
                <TableCell className={isAr ? "text-right" : "text-left"}>
                  <div className="font-semibold text-[#7FE87F] text-xs tracking-tight">{tx.orderRef}</div>
                  <div className="text-[10px] text-[#A2A2BA] flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3 text-[#6E6E85]" />
                    {formatDate(tx.timestamp, "time")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-white text-xs">{tx.senderName}</div>
                  <div className="text-[11px] text-[#7FE87F] flex items-center gap-1 font-medium">
                    <ArrowIcon className="h-3 w-3 text-[#6E6E85]" /> {tx.receiverName}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-bold text-white text-xs tabular-nums">{formatCurrency(tx.amount)}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-bold text-[#7FE87F] text-xs tabular-nums">{formatCurrency(tx.platformMdrSar)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    {tx.channel === "pos_softpos" ? (
                      <SmartphoneNfc className="h-3.5 w-3.5 text-[#7FE87F]" />
                    ) : (
                      <ArrowDownLeft className="h-3.5 w-3.5 text-[#7FE87F]" />
                    )}
                    <span className="text-neutral-200">{translatePaymentMethod(tx.paymentMethod)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={tx.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTx(tx)}
                    className="h-7 px-2.5 text-xs bg-[#111726] hover:bg-[#182236] gap-1.5 text-neutral-200 hover:text-[#7FE87F] border-[#2C2C44] hover:border-[#7FE87F]/40 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-[#7FE87F]" />
                    <span>{t("common.details")}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Inspect & ZATCA Compliance Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        {selectedTx && (
          <DialogContent className="max-w-lg p-6 bg-[#111726] border-[#2C2C44]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#7FE87F]/10 text-[#7FE87F] border border-[#7FE87F]/20">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold text-white">{isAr ? "الطلب:" : "Order:"} {selectedTx.orderRef}</DialogTitle>
                    <DialogDescription className="text-xs text-[#A2A2BA]">
                      {isAr ? "تفاصيل العملية والضريبة" : "Transaction details & tax"}
                    </DialogDescription>
                  </div>
                </div>
                <Badge variant="primary" className="text-[10px] font-bold tracking-wider">
                  <ShieldCheck className="h-3 w-3 mr-1 inline" /> {isAr ? "معتمد زاتكا" : "ZATCA"}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Financial Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#080C14] rounded-xl p-3.5 border border-[#2C2C44] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#A2A2BA] font-medium">
                    <Coins className="h-3.5 w-3.5 text-[#7FE87F]" />
                    <span>{isAr ? "المبلغ الإجمالي" : "Gross Amount"}</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#7FE87F] tabular-nums">
                    {formatCurrency(selectedTx.amount)}
                  </div>
                </div>

                <div className="bg-[#080C14] rounded-xl p-3.5 border border-[#2C2C44] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#A2A2BA] font-medium">
                    <Percent className="h-3.5 w-3.5 text-[#7FE87F]" />
                    <span>{isAr ? "رسوم المنصة" : "MDR Take"}</span>
                  </div>
                  <div className="text-lg font-extrabold text-white tabular-nums">
                    {formatCurrency(selectedTx.platformMdrSar)}
                  </div>
                </div>
              </div>

              {/* Reference IDs Card */}
              <div className="bg-[#080C14] rounded-xl p-4 border border-[#2C2C44] space-y-2.5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-[#2C2C44]">
                  <span className="text-[#A2A2BA] flex items-center gap-1.5 font-medium">
                    <Hash className="h-3.5 w-3.5 text-[#7FE87F]" />
                    {t("ledger.utrLabel")}
                  </span>
                  <span className="font-semibold text-white text-xs tabular-nums">
                    {selectedTx.sarieUtr || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A2A2BA] flex items-center gap-1.5 font-medium">
                    <SmartphoneNfc className="h-3.5 w-3.5 text-[#7FE87F]" />
                    {t("ledger.rrnLabel")}
                  </span>
                  <span className="font-semibold text-white text-xs tabular-nums">
                    {selectedTx.madaRrn || "N/A"}
                  </span>
                </div>
              </div>

              {/* ZATCA Tax & Compliance Breakdown */}
              <div className="p-4 bg-[#7FE87F]/5 border border-[#7FE87F]/20 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#7FE87F] font-bold text-xs">
                    <ShieldCheck className="h-4 w-4 text-[#7FE87F]" />
                    <span>{isAr ? "الضريبة المضافة (زاتكا)" : "Tax Breakdown (ZATCA)"}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-[#7FE87F] border-[#7FE87F]/30 bg-[#7FE87F]/5">
                    {isAr ? "الضريبة: 15%" : "VAT: 15%"}
                  </Badge>
                </div>
                <div className="space-y-1.5 pt-1 text-xs text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-[#A2A2BA]">{isAr ? "المبلغ الأساسي:" : "Taxable Base:"}</span>
                    <span className="font-semibold text-white tabular-nums">{formatCurrency(selectedTx.amount / 1.15)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A2A2BA]">{isAr ? "الضريبة (15%):" : "VAT (15%):"}</span>
                    <span className="font-semibold text-[#7FE87F] tabular-nums">{formatCurrency(selectedTx.amount - selectedTx.amount / 1.15)}</span>
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
                  className="gap-2 font-semibold cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{t("ledger.refundBtn")}</span>
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Refund Confirmation Dialog */}
      <Dialog open={!!refundConfirmTx} onOpenChange={(open) => !open && setRefundConfirmTx(null)}>
        {refundConfirmTx && (
          <DialogContent className="max-w-md p-6 bg-[#111726] border-[#2C2C44]">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-white">{t("ledger.refundDialogTitle")}</DialogTitle>
                  <DialogDescription className="text-xs text-[#A2A2BA]">
                    {t("ledger.refundDialogSubtitle")}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="py-3 text-xs text-neutral-300 bg-[#080C14] border border-[#2C2C44] rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#A2A2BA]">{t("ledger.tableOrderRef")}:</span>
                <span className="font-semibold text-[#7FE87F]">{refundConfirmTx.orderRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A2A2BA]">{isAr ? "مبلغ الاسترجاع:" : "Refund Amount:"}</span>
                <span className="font-bold text-white tabular-nums">{formatCurrency(refundConfirmTx.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A2A2BA]">{t("ledger.tablePaymentMethod")}:</span>
                <span className="font-semibold text-[#7FE87F]">{translatePaymentMethod(refundConfirmTx.paymentMethod)}</span>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRefundConfirmTx(null)}
                className="border-[#2C2C44] hover:bg-[#182236] cursor-pointer text-[#A2A2BA]"
              >
                {t("common.cancel")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onExecuteRefund(refundConfirmTx.id);
                  setRefundConfirmTx(null);
                }}
                className="gap-1.5 font-bold cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{t("ledger.confirmRefund")}</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
