import React, { useState } from "react";
import {
  Users,
  Search,
  Lock,
  Unlock,
  Eye,
  Sliders,
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
import type { CustomerUser, PlatformTransaction } from "../types";

interface ConsumerKYCProps {
  customers: CustomerUser[];
  transactions?: PlatformTransaction[];
  onToggleFreezeAccount: (customerId: string) => void;
  onUpdateDailyLimit?: (customerId: string, newLimit: number) => void;
  lang: "en" | "ar";
}

export const ConsumerKYC: React.FC<ConsumerKYCProps> = ({
  customers,
  transactions = [],
  onToggleFreezeAccount,
  onUpdateDailyLimit,
  lang
}) => {
  const isAr = lang === "ar";
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
        lang={lang}
      />
    );
  }

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search) ||
      c.nationalId.includes(search) ||
      c.sarieUpiId.includes(search)
  );

  return (
    <div className="space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#7FE87F]" />
          <h2 className="text-base font-extrabold text-white">
            {isAr ? "المستخدمين وحسابات الأفراد" : "Consumers & KYC Accounts"}
          </h2>
          <Badge variant="secondary" className="text-[11px]">
            {customers.length}
          </Badge>
        </div>

        <div className="relative w-48">
          <Search className="absolute top-1/2 -translate-y-1/2 left-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          <Input
            type="text"
            placeholder={isAr ? "بحث بالاسم أو الهوية أو سريع..." : "Search User or Sarie..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs bg-[#10182A] border-slate-800/80"
          />
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{isAr ? "المستخدم" : "User"}</TableHead>
            <TableHead>{isAr ? "الهوية الوطنية" : "National ID"}</TableHead>
            <TableHead>{isAr ? "الجوال / معرف سريع" : "Mobile / Sarie"}</TableHead>
            <TableHead>{isAr ? "الرصيد المتاح" : "Wallet Balance"}</TableHead>
            <TableHead>{isAr ? "الحد اليومي" : "Daily Limit"}</TableHead>
            <TableHead>{isAr ? "المخاطر" : "Risk"}</TableHead>
            <TableHead>{isAr ? "التحقق" : "KYC"}</TableHead>
            <TableHead>{isAr ? "الإجراء" : "Action"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((c) => (
            <TableRow
              key={c.id}
              onClick={() => setSelectedUserId(c.id)}
              className="cursor-pointer hover:bg-slate-800/50"
            >
              <TableCell>
                <div className="font-bold text-white text-xs hover:text-[#7FE87F] transition-colors">
                  {isAr ? c.fullNameAr : c.fullName}
                </div>
                <div className="text-[10px] text-slate-400">{c.email}</div>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-sky-400 font-semibold">{c.nationalId}</span>
                  <button
                    onClick={() => handleCopy(c.nationalId, `nid-${c.id}`)}
                    className="text-slate-500 hover:text-white"
                  >
                    {copiedField === `nid-${c.id}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-xs text-slate-200">{c.mobile}</div>
                <div className="text-[10px] text-[#7FE87F] font-mono">{c.sarieUpiId}</div>
              </TableCell>
              <TableCell>
                <span className="font-extrabold text-[#7FE87F] text-xs font-mono">
                  SAR {c.walletBalanceSar.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs text-slate-300 font-semibold">
                  SAR {(c.dailyLimitSar || 20000).toLocaleString()}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`text-xs font-bold ${
                    c.riskScore > 70
                      ? "text-red-400"
                      : c.riskScore > 30
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {c.riskScore}/100
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={c.kycStatus} />
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUserId(c.id)}
                    className="h-7 px-2.5 text-xs bg-[#10182A] hover:bg-slate-800 gap-1 text-slate-200"
                  >
                    <Eye className="h-3 w-3 text-[#7FE87F]" />
                    <span>{isAr ? "تفاصيل" : "Dossier"}</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
