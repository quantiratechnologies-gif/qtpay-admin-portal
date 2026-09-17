import React, { useState } from "react";
import {
  Users,
  Search,
  Lock,
  Unlock,
  Sliders,
  History,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
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
import type { CustomerUser, UserActivityLog } from "../types";

interface ConsumerKYCProps {
  customers: CustomerUser[];
  onToggleFreezeAccount: (customerId: string) => void;
  onUpdateDailyLimit?: (customerId: string, newLimit: number) => void;
  lang: "en" | "ar";
}

export const ConsumerKYC: React.FC<ConsumerKYCProps> = ({
  customers,
  onToggleFreezeAccount,
  onUpdateDailyLimit,
  lang
}) => {
  const isAr = lang === "ar";
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<CustomerUser | null>(null);
  const [activityModalUser, setActivityModalUser] = useState<CustomerUser | null>(null);
  const [limitModalUser, setLimitModalUser] = useState<CustomerUser | null>(null);
  const [tempLimit, setTempLimit] = useState<number>(20000);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

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
            {isAr ? "المستخدمين والتحكم بالحسابات" : "Users & Account Control"}
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

      {feedbackNotice && (
        <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{isAr ? "المستخدم" : "User"}</TableHead>
            <TableHead>{isAr ? "الهوية" : "National ID"}</TableHead>
            <TableHead>{isAr ? "الجوال / سريع" : "Mobile / Sarie"}</TableHead>
            <TableHead>{isAr ? "الرصيد" : "Balance"}</TableHead>
            <TableHead>{isAr ? "الحد اليومي" : "Daily Limit"}</TableHead>
            <TableHead>{isAr ? "المخاطر" : "Risk"}</TableHead>
            <TableHead>{isAr ? "التحقق" : "KYC"}</TableHead>
            <TableHead>{isAr ? "الإجراء والنشاط" : "Control & Logs"}</TableHead>
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
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-slate-300 font-semibold">
                    SAR {(c.dailyLimitSar || 20000).toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      setLimitModalUser(c);
                      setTempLimit(c.dailyLimitSar || 20000);
                    }}
                    title="Adjust Limit"
                    className="text-slate-500 hover:text-white p-0.5"
                  >
                    <Sliders className="h-3 w-3" />
                  </button>
                </div>
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
                <div className="flex items-center gap-1.5">
                  <Button
                    variant={c.isFrozen ? "default" : "destructive"}
                    size="sm"
                    onClick={() => onToggleFreezeAccount(c.id)}
                    className="h-7 px-2 text-xs gap-1"
                  >
                    {c.isFrozen ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    <span>{c.isFrozen ? (isAr ? "فك التجميد" : "Unfreeze") : (isAr ? "تجميد" : "Freeze")}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActivityModalUser(c)}
                    className="h-7 px-2 text-xs bg-[#10182A] hover:bg-slate-800 gap-1 text-slate-300"
                  >
                    <History className="h-3 w-3" />
                    <span>{isAr ? "السجل" : "Logs"}</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* User Activity & Audit History Modal */}
      <Dialog open={!!activityModalUser} onOpenChange={(open) => !open && setActivityModalUser(null)}>
        {activityModalUser && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-4 w-4 text-[#7FE87F]" />
                <span>User Activity Audit: {activityModalUser.fullName}</span>
              </DialogTitle>
              <DialogDescription>
                Real-time security telemetry, login events, and transaction history
              </DialogDescription>
            </DialogHeader>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2 p-2 bg-[#10182A] border border-slate-800/80 rounded-lg">
              <Button
                variant="outline"
                size="sm"
                onClick={() => showNotice(`Force KYC re-verification triggered for ${activityModalUser.fullName}`)}
                className="h-7 text-xs bg-slate-900 border-slate-800 text-slate-300 gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Request Re-KYC</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => showNotice(`Sarie PIN reset link dispatched to ${activityModalUser.mobile}`)}
                className="h-7 text-xs bg-slate-900 border-slate-800 text-slate-300 gap-1"
              >
                <KeyRound className="h-3 w-3" />
                <span>Reset Sarie PIN</span>
              </Button>
            </div>

            {/* Timeline */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto py-1">
              {(activityModalUser.activityLogs || []).length > 0 ? (
                activityModalUser.activityLogs?.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-[#10182A] border border-slate-800/80 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{log.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-400">{log.details}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-0.5">
                      <span>Actor: {log.actor}</span>
                      {log.ipAddress && <span>• IP: {log.ipAddress}</span>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No previous security flags recorded for this user.
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivityModalUser(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Adjust Daily Limit Modal */}
      <Dialog open={!!limitModalUser} onOpenChange={(open) => !open && setLimitModalUser(null)}>
        {limitModalUser && (
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Adjust Daily Transfer Limit</DialogTitle>
              <DialogDescription>
                Set maximum outgoing daily transfer threshold for {limitModalUser.fullName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Target Daily Limit:</span>
                <span className="text-base font-extrabold text-[#7FE87F] font-mono">
                  SAR {tempLimit.toLocaleString()}
                </span>
              </div>

              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={tempLimit}
                onChange={(e) => setTempLimit(parseInt(e.target.value))}
                className="w-full accent-[#7FE87F] cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>SAR 5,000 (Tier 1)</span>
                <span>SAR 100,000 (VIP)</span>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLimitModalUser(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (onUpdateDailyLimit) {
                    onUpdateDailyLimit(limitModalUser.id, tempLimit);
                  }
                  showNotice(`Daily limit for ${limitModalUser.fullName} updated to SAR ${tempLimit.toLocaleString()}`);
                  setLimitModalUser(null);
                }}
              >
                Save Limit
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
