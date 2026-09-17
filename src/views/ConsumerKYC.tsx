import React, { useState } from "react";
import {
  Users,
  Search,
  Lock,
  Unlock
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
import type { CustomerUser } from "../types";

interface ConsumerKYCProps {
  customers: CustomerUser[];
  onToggleFreezeAccount: (customerId: string) => void;
  lang: "en" | "ar";
}

export const ConsumerKYC: React.FC<ConsumerKYCProps> = ({
  customers,
  onToggleFreezeAccount,
  lang
}) => {
  const isAr = lang === "ar";
  const [search, setSearch] = useState("");
  const [freezeModalUser, setFreezeModalUser] = useState<CustomerUser | null>(null);

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
            {isAr ? "المستخدمين" : "Users"}
          </h2>
          <Badge variant="secondary" className="text-[11px]">
            {customers.length}
          </Badge>
        </div>

        <div className="relative w-48">
          <Search className="absolute top-1/2 -translate-y-1/2 left-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          <Input
            type="text"
            placeholder={isAr ? "بحث..." : "Search User..."}
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
            <TableHead>{isAr ? "الهوية" : "National ID"}</TableHead>
            <TableHead>{isAr ? "الجوال / سريع" : "Mobile / Sarie"}</TableHead>
            <TableHead>{isAr ? "الرصيد" : "Balance"}</TableHead>
            <TableHead>{isAr ? "المخاطر" : "Risk"}</TableHead>
            <TableHead>{isAr ? "التحقق" : "KYC"}</TableHead>
            <TableHead>{isAr ? "إجراء" : "Action"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <div className="font-bold text-white text-xs">{isAr ? c.fullNameAr : c.fullName}</div>
                <div className="text-[10px] text-slate-400">{c.email}</div>
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs text-sky-400 font-semibold">{c.nationalId}</span>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-xs text-slate-200">{c.mobile}</div>
                <div className="text-[10px] text-[#7FE87F] font-mono">{c.sarieUpiId}</div>
              </TableCell>
              <TableCell>
                <span className="font-extrabold text-[#7FE87F] text-xs">
                  SAR {c.walletBalanceSar.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
              <TableCell>
                <Button
                  variant={c.isFrozen ? "default" : "destructive"}
                  size="sm"
                  onClick={() => setFreezeModalUser(c)}
                  className="h-7 px-2.5 text-xs gap-1"
                >
                  {c.isFrozen ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  <span>{c.isFrozen ? (isAr ? "فك التجميد" : "Unfreeze") : (isAr ? "تجميد" : "Freeze")}</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Confirmation Dialog */}
      <Dialog open={!!freezeModalUser} onOpenChange={(open) => !open && setFreezeModalUser(null)}>
        {freezeModalUser && (
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>
                {freezeModalUser.isFrozen ? "Unfreeze Account" : "Freeze Account"}
              </DialogTitle>
              <DialogDescription>
                {freezeModalUser.isFrozen
                  ? `Unfreeze wallet for ${freezeModalUser.fullName}? Outgoing transfers will be re-enabled.`
                  : `Freeze wallet for ${freezeModalUser.fullName} to block outgoing transfers?`}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFreezeModalUser(null)}
              >
                Cancel
              </Button>
              <Button
                variant={freezeModalUser.isFrozen ? "default" : "destructive"}
                size="sm"
                onClick={() => {
                  onToggleFreezeAccount(freezeModalUser.id);
                  setFreezeModalUser(null);
                }}
              >
                {freezeModalUser.isFrozen ? "Unfreeze" : "Freeze"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
