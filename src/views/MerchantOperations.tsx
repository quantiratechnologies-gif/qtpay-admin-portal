import React, { useState } from "react";
import {
  Store,
  Search,
  Terminal,
  Eye,
  Copy,
  Check,
  Building2,
  ExternalLink
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
import type { Merchant, PlatformTransaction } from "../types";

interface MerchantOperationsProps {
  merchants: Merchant[];
  transactions?: PlatformTransaction[];
  onUpdateMerchantStatus: (merchantId: string, newStatus: Merchant["status"]) => void;
  onExecuteRefund?: (txId: string) => void;
  lang: "en" | "ar";
}

export const MerchantOperations: React.FC<MerchantOperationsProps> = ({
  merchants,
  transactions = [],
  onUpdateMerchantStatus,
  onExecuteRefund,
  lang
}) => {
  const isAr = lang === "ar";
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
        lang={lang}
      />
    );
  }

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
    <div className="space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-[#7FE87F]" />
          <h2 className="text-base font-extrabold text-white">
            {isAr ? "التجار والشركاء" : "Merchants & Enterprise Partners"}
          </h2>
          <Badge variant="secondary" className="text-[11px]">
            {merchants.length}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-48">
            <Search className="absolute top-1/2 -translate-y-1/2 left-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            <Input
              type="text"
              placeholder={isAr ? "بحث بالاسم أو السجل..." : "Search Merchant or CR..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs bg-[#10182A] border-slate-800/80"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2 text-xs bg-[#10182A] border border-slate-800/80 rounded-lg text-slate-200 outline-none cursor-pointer"
          >
            <option value="all">{isAr ? "الكل" : "All Status"}</option>
            <option value="pending_kyb">{isAr ? "معلق" : "Pending KYB"}</option>
            <option value="active">{isAr ? "نشط" : "Active"}</option>
            <option value="suspended">{isAr ? "موقوف" : "Suspended"}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{isAr ? "التاجر" : "Merchant"}</TableHead>
            <TableHead>{isAr ? "السجل / الضريبة" : "CR / VAT"}</TableHead>
            <TableHead>{isAr ? "المالك" : "Owner"}</TableHead>
            <TableHead>{isAr ? "البنك والحساب" : "Settlement Bank"}</TableHead>
            <TableHead>{isAr ? "الأجهزة" : "POS"}</TableHead>
            <TableHead>{isAr ? "حجم المعاملات" : "Monthly GMV"}</TableHead>
            <TableHead>{isAr ? "الحالة" : "Status"}</TableHead>
            <TableHead>{isAr ? "الإجراء" : "Action"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((m) => (
            <TableRow
              key={m.id}
              onClick={() => setSelectedMerchantId(m.id)}
              className="cursor-pointer hover:bg-slate-800/50"
            >
              <TableCell>
                <div className="font-bold text-white text-xs hover:text-[#7FE87F] transition-colors">
                  {isAr ? m.businessNameAr : m.businessName}
                </div>
                <div className="text-[10px] text-slate-400">{m.city} • {m.category}</div>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-sky-400 font-semibold">{m.crNumber}</span>
                  <button
                    onClick={() => handleCopy(m.crNumber, `cr-${m.id}`)}
                    className="text-slate-500 hover:text-white"
                  >
                    {copiedField === `cr-${m.id}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <div className="font-mono text-[10px] text-slate-400">{m.vatNumber}</div>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-xs text-slate-200">{m.ownerName}</div>
                <div className="text-[10px] text-slate-400">{m.mobile}</div>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-xs text-slate-200">{m.settlementBank}</div>
                <div className="font-mono text-[10px] text-slate-400">{m.settlementIban.slice(0, 14)}...</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 font-bold text-xs text-[#7FE87F]">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>{m.activeTerminals}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-mono font-bold text-xs text-white">
                  SAR {(m.monthlyVolumeSar / 1000).toFixed(0)}k
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={m.status} />
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMerchantId(m.id)}
                  className="h-7 px-2.5 text-xs bg-[#10182A] hover:bg-slate-800 gap-1 text-slate-200"
                >
                  <Eye className="h-3 w-3 text-[#7FE87F]" />
                  <span>{isAr ? "تفاصيل" : "Dossier"}</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
