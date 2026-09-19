import React, { useState } from "react";
import {
  Store,
  Search,
  Terminal,
  Eye,
  Copy,
  Check
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
import { MerchantDetailView } from "./MerchantDetailView";
import { useTranslation } from "../lib/i18n/LanguageContext";
import type { Merchant, PlatformTransaction } from "../types";

interface MerchantOperationsProps {
  merchants: Merchant[];
  transactions?: PlatformTransaction[];
  onUpdateMerchantStatus: (merchantId: string, newStatus: Merchant["status"]) => void;
  onExecuteRefund?: (txId: string) => void;
  lang?: "en" | "ar";
}

export const MerchantOperations: React.FC<MerchantOperationsProps> = ({
  merchants,
  transactions = [],
  onUpdateMerchantStatus,
  onExecuteRefund
}) => {
  const { isAr, t, formatCurrency, translateCategory } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1200);
  };

  const selectedMerchant = merchants.find((m) => m.id === selectedMerchantId);

  // If a merchant is selected, render the dedicated Sub-Screen!
  if (selectedMerchant) {
    return (
      <MerchantDetailView
        merchant={selectedMerchant}
        transactions={transactions}
        onBack={() => setSelectedMerchantId(null)}
        onUpdateStatus={onUpdateMerchantStatus}
        onExecuteRefund={onExecuteRefund}
        lang={isAr ? "ar" : "en"}
      />
    );
  }

  const filtered = merchants.filter((m) => {
    const matchesSearch =
      m.businessName.toLowerCase().includes(search.toLowerCase()) ||
      (m.businessNameAr && m.businessNameAr.includes(search)) ||
      m.crNumber.includes(search) ||
      m.vatNumber.includes(search) ||
      m.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#7FE87F]/10 border border-[#7FE87F]/30 text-[#7FE87F]">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                {t("merchants.pageTitle")}
              </h2>
              <Badge variant="primary" className="text-[11px] font-bold">
                {merchants.length} {t("merchants.registeredBadge")}
              </Badge>
            </div>
            <p className="text-xs text-[#A2A2BA]">
              {t("merchants.pageSubtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-52 sm:w-64">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6E6E85] pointer-events-none ${
              isAr ? "right-2.5" : "left-2.5"
            }`} />
            <Input
              type="text"
              placeholder={t("merchants.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`h-8 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F] ${
                isAr ? "pr-8 pl-2.5" : "pl-8 pr-2.5"
              }`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2.5 text-xs bg-[#111726] border border-[#2C2C44] rounded-lg text-[#A2A2BA] outline-none cursor-pointer focus:border-[#7FE87F]"
          >
            <option value="all">{t("common.allStatus")}</option>
            <option value="active">{t("common.active")}</option>
            <option value="pending_kyb">{t("common.pending")}</option>
            <option value="action_required">{t("common.actionRequired")}</option>
            <option value="suspended">{t("common.suspended")}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={isAr ? "text-right" : "text-left"}>{t("merchants.tableBusinessName")}</TableHead>
            <TableHead>{t("merchants.tableCrVat")}</TableHead>
            <TableHead>{t("merchants.ownerLabel")}</TableHead>
            <TableHead>{t("merchants.settlementBankLabel")}</TableHead>
            <TableHead>{t("merchants.tableTerminals")}</TableHead>
            <TableHead className="text-right">{t("merchants.tableVolume")}</TableHead>
            <TableHead>{t("common.status")}</TableHead>
            <TableHead className="text-right">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="p-8 text-center text-xs text-[#6E6E85]">
                {t("common.noResults")}
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((m) => (
              <TableRow
                key={m.id}
                onClick={() => setSelectedMerchantId(m.id)}
                className="cursor-pointer hover:bg-[#182236] transition-colors"
              >
                <TableCell className={isAr ? "text-right" : "text-left"}>
                  <div className="font-bold text-white text-xs hover:text-[#7FE87F] transition-colors">
                    {isAr && m.businessNameAr ? m.businessNameAr : m.businessName}
                  </div>
                  <div className="text-[10px] text-[#A2A2BA]">{m.city} • {translateCategory(m.category)}</div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#7FE87F] font-semibold tabular-nums">{m.crNumber}</span>
                    <button
                      onClick={() => handleCopy(m.crNumber, `cr-${m.id}`)}
                      className="text-[#6E6E85] hover:text-white cursor-pointer"
                    >
                      {copiedField === `cr-${m.id}` ? <Check className="h-3 w-3 text-[#7FE87F]" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                  <div className="text-[10px] text-[#A2A2BA] tabular-nums">{m.vatNumber}</div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-xs text-slate-200">{m.ownerName}</div>
                  <div className="text-[10px] text-[#A2A2BA] tabular-nums">{m.mobile}</div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-xs text-slate-200">{m.settlementBank}</div>
                  <div className="text-[10px] text-[#A2A2BA] tabular-nums">{m.settlementIban.slice(0, 14)}...</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 font-bold text-xs text-[#7FE87F]">
                    <Terminal className="h-3.5 w-3.5" />
                    <span>{m.activeTerminals} {isAr ? "نقطة بيع" : "SoftPOS"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-bold text-xs text-white tabular-nums">
                    {formatCurrency(m.monthlyVolumeSar, { decimals: 0 })}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={m.status} />
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMerchantId(m.id)}
                    className="h-7 px-2.5 text-xs bg-[#111726] hover:bg-[#182236] gap-1.5 text-slate-200 border-[#2C2C44] hover:border-[#7FE87F]/40 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-[#7FE87F]" />
                    <span>{t("common.view")}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
