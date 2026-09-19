import React, { useState } from "react";
import {
  Users,
  Search,
  Eye,
  Check,
  Copy
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
import { UserDetailView } from "./UserDetailView";
import { useTranslation } from "../lib/i18n/LanguageContext";
import type { CustomerUser, PlatformTransaction } from "../types";

interface ConsumerKYCProps {
  customers: CustomerUser[];
  transactions?: PlatformTransaction[];
  onToggleFreezeAccount: (customerId: string) => void;
  onUpdateDailyLimit?: (customerId: string, newLimit: number) => void;
  lang?: "en" | "ar";
}

export const ConsumerKYC: React.FC<ConsumerKYCProps> = ({
  customers,
  transactions = [],
  onToggleFreezeAccount,
  onUpdateDailyLimit
}) => {
  const { isAr, t, formatCurrency } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1200);
  };

  const selectedUser = customers.find((c) => c.id === selectedUserId);

  // If a user is selected, render the dedicated Sub-Screen!
  if (selectedUser) {
    return (
      <UserDetailView
        user={selectedUser}
        transactions={transactions}
        onBack={() => setSelectedUserId(null)}
        onToggleFreeze={onToggleFreezeAccount}
        onUpdateDailyLimit={onUpdateDailyLimit}
        lang={isAr ? "ar" : "en"}
      />
    );
  }

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (c.fullNameAr && c.fullNameAr.includes(search)) ||
      c.mobile.includes(search) ||
      c.nationalId.includes(search) ||
      c.sarieUpiId.includes(search)
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#7FE87F]/10 border border-[#7FE87F]/30 text-[#7FE87F]">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                {t("consumers.pageTitle")}
              </h2>
              <Badge variant="primary" className="text-[11px] font-bold">
                {customers.length} {t("consumers.usersBadge")}
              </Badge>
            </div>
            <p className="text-xs text-[#A2A2BA]">
              {t("consumers.pageSubtitle")}
            </p>
          </div>
        </div>

        <div className="relative w-52 sm:w-64">
          <Search className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6E6E85] pointer-events-none ${
            isAr ? "right-2.5" : "left-2.5"
          }`} />
          <Input
            type="text"
            placeholder={t("consumers.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`h-8 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F] ${
              isAr ? "pr-8 pl-2.5" : "pl-8 pr-2.5"
            }`}
          />
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={isAr ? "text-right" : "text-left"}>{t("consumers.tableUser")}</TableHead>
            <TableHead>{t("consumers.tableNationalId")}</TableHead>
            <TableHead>{t("consumers.tableMobile")}</TableHead>
            <TableHead className="text-right">{t("consumers.tableWalletBalance")}</TableHead>
            <TableHead className="text-right">{t("consumers.tableDailyLimit")}</TableHead>
            <TableHead>{t("consumers.tableRiskScore")}</TableHead>
            <TableHead>{t("consumers.tableKycStatus")}</TableHead>
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
            filtered.map((c) => (
              <TableRow
                key={c.id}
                onClick={() => setSelectedUserId(c.id)}
                className="cursor-pointer hover:bg-[#182236] transition-colors"
              >
                <TableCell className={isAr ? "text-right" : "text-left"}>
                  <div className="font-bold text-white text-xs hover:text-[#7FE87F] transition-colors">
                    {isAr && c.fullNameAr ? c.fullNameAr : c.fullName}
                  </div>
                  <div className="text-[10px] text-[#A2A2BA]">{c.email}</div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#7FE87F] font-semibold tabular-nums">{c.nationalId}</span>
                    <button
                      onClick={() => handleCopy(c.nationalId, `nid-${c.id}`)}
                      className="text-[#6E6E85] hover:text-white cursor-pointer"
                    >
                      {copiedField === `nid-${c.id}` ? <Check className="h-3 w-3 text-[#7FE87F]" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-xs text-neutral-200 tabular-nums">{c.mobile}</div>
                  <div className="text-[10px] text-[#7FE87F] font-medium">{c.sarieUpiId}</div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-extrabold text-[#7FE87F] text-xs tabular-nums">
                    {formatCurrency(c.walletBalanceSar)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-xs text-neutral-200 font-semibold tabular-nums">
                    {formatCurrency(c.dailyLimitSar || 20000, { decimals: 0 })}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-bold ${
                      c.riskScore > 70
                        ? "text-red-400"
                        : c.riskScore > 30
                        ? "text-amber-400"
                        : "text-[#7FE87F]"
                    }`}
                  >
                    {c.riskScore}/100
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={c.kycStatus} />
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUserId(c.id)}
                      className="h-7 px-2.5 text-xs bg-[#111726] hover:bg-[#182236] gap-1.5 text-neutral-200 hover:text-[#7FE87F] border-[#2C2C44] hover:border-[#7FE87F]/40 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-[#7FE87F]" />
                      <span>{t("common.view")}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
