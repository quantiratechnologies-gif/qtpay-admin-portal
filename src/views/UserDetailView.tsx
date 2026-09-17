import React, { useState } from "react";
import {
  ArrowLeft,
  User,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Sliders,
  ReceiptText,
  DollarSign,
  History,
  Smartphone,
  CreditCard,
  RefreshCw,
  KeyRound,
  Download,
  Copy,
  Check,
  Zap,
  ArrowDownLeft,
  ArrowUpRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
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
import type { CustomerUser, PlatformTransaction } from "../types";

interface UserDetailViewProps {
  user: CustomerUser;
  transactions: PlatformTransaction[];
  onBack: () => void;
  onToggleFreeze: (userId: string) => void;
  onUpdateDailyLimit?: (userId: string, newLimit: number) => void;
  lang: "en" | "ar";
}

export const UserDetailView: React.FC<UserDetailViewProps> = ({
  user,
  transactions,
  onBack,
  onToggleFreeze,
  onUpdateDailyLimit,
  lang
}) => {
  const isAr = lang === "ar";
  const [activeTab, setActiveTab] = useState<"profile" | "transactions" | "devices" | "activity">("profile");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [tempLimit, setTempLimit] = useState<number>(user.dailyLimitSar || 20000);
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1200);
  };

  const userTransactions = transactions.filter(
    (tx) => tx.userId === user.id || tx.senderName.toLowerCase().includes(user.fullName.toLowerCase().slice(0, 5)) || tx.receiverName.toLowerCase().includes(user.fullName.toLowerCase().slice(0, 5))
  );

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-8 px-2.5 bg-[#10182A] border-slate-800/80 text-slate-300 hover:text-white gap-1.5"
          >
            <ArrowLeft className={`h-3.5 w-3.5 ${isAr ? "rotate-180" : ""}`} />
            <span>{isAr ? "العودة للمستخدمين" : "Back to Users"}</span>
          </Button>
          <span className="text-slate-600 text-xs">/</span>
          <span className="text-xs font-bold text-white">{isAr ? user.fullNameAr : user.fullName}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => showNotice(`Official audit dossier for ${user.fullName} exported to CSV`)}
            className="h-8 px-2.5 bg-[#10182A] border-slate-800/80 text-slate-300 hover:text-white gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isAr ? "تصدير الملف" : "Export Dossier"}</span>
          </Button>

          <Button
            variant={user.isFrozen ? "default" : "destructive"}
            size="sm"
            onClick={() => {
              onToggleFreeze(user.id);
              showNotice(`Wallet ${user.isFrozen ? "unfrozen" : "frozen"} for ${user.fullName}`);
            }}
            className="h-8 px-2.5 text-xs gap-1.5 font-bold"
          >
            {user.isFrozen ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            <span>{user.isFrozen ? (isAr ? "فك التجميد" : "Unfreeze Wallet") : (isAr ? "تجميد الحساب" : "Freeze Account")}</span>
          </Button>
        </div>
      </div>

      {notice && (
        <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Header Dossier Card */}
      <Card className="p-5 space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7FE87F]/20 to-emerald-500/10 border border-[#7FE87F]/30 flex items-center justify-center text-[#7FE87F] font-black text-base">
              {user.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-extrabold text-white">
                  {isAr ? user.fullNameAr : user.fullName}
                </h1>
                <StatusBadge status={user.kycStatus} />
                <Badge
                  variant={user.riskScore > 70 ? "destructive" : user.riskScore > 30 ? "warning" : "success"}
                >
                  RISK: {user.riskScore}/100
                </Badge>
                {user.isFrozen && (
                  <Badge variant="destructive">WALLET FROZEN</Badge>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Sarie Alias: <span className="font-mono text-[#7FE87F] font-bold">{user.sarieUpiId}</span> • Joined {user.joinedAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Wallet Balance</span>
              <span className="text-lg font-extrabold text-[#7FE87F]">
                SAR {user.walletBalanceSar.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Daily Limit</span>
              <span className="text-lg font-extrabold text-sky-400">
                SAR {(user.dailyLimitSar || 20000).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-1.5 border-t border-slate-800/60 pt-3 overflow-x-auto">
          {[
            { id: "profile", labelEn: "Profile & KYC Limits", labelAr: "الهوية والحدود", icon: User },
            { id: "transactions", labelEn: `Transaction Ledger (${userTransactions.length})`, labelAr: "سجل العمليات", icon: ReceiptText },
            { id: "devices", labelEn: `Bound Devices (${(user.registeredDevices || []).length || 1})`, labelAr: "الأجهزة والجلسات", icon: Smartphone },
            { id: "activity", labelEn: "Activity & Audit Log", labelAr: "سجل الأمان والنشاط", icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#7FE87F] text-[#080C14]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Tab 1: Profile & KYC Limits */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Identity Info Card */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#7FE87F]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Nafath Biometric & Absher Verification
                </h3>
              </div>
              <Badge variant="success" className="text-[10px]">TIER 2 VERIFIED</Badge>
            </div>

            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Saudi National ID / Iqama</span>
                <div className="flex items-center gap-1.5 font-mono text-sky-400 font-bold">
                  <span>{user.nationalId}</span>
                  <button onClick={() => handleCopy(user.nationalId, "nid")} className="text-slate-500 hover:text-white">
                    {copiedField === "nid" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Registered Mobile Number</span>
                <span className="font-semibold text-white">{user.mobile}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Email Address</span>
                <span className="text-slate-300 font-mono">{user.email}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Sarie Instant Pay Alias</span>
                <span className="font-mono font-bold text-[#7FE87F]">{user.sarieUpiId}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Nafath SSO Verification</span>
                <span className="text-xs text-emerald-400 font-medium">{user.nafathVerifiedAt || "Verified via Absher"}</span>
              </div>
            </div>
          </Card>

          {/* Transfer Limits & Actions Card */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-sky-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Transfer Limits & Administrative Actions
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#7FE87F]">SAMA Regulated</span>
            </div>

            <div className="space-y-3 text-xs pt-1">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Daily Transfer Limit Usage:</span>
                  <span className="font-bold text-white font-mono">SAR 500 / SAR {(user.dailyLimitSar || 20000).toLocaleString()}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#121A2D] overflow-hidden border border-slate-800/80">
                  <div className="h-full rounded-full bg-[#7FE87F]" style={{ width: "2.5%" }} />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#10182A] border border-slate-800/80 space-y-2">
                <span className="text-xs font-bold text-white block">Security & Service Triggers</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTempLimit(user.dailyLimitSar || 20000);
                      setIsLimitModalOpen(true);
                    }}
                    className="h-7 text-xs bg-slate-900 border-slate-800 text-slate-300 gap-1"
                  >
                    <Sliders className="h-3 w-3 text-sky-400" />
                    <span>Adjust Limit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showNotice(`Sarie PIN reset instruction sent to ${user.mobile}`)}
                    className="h-7 text-xs bg-slate-900 border-slate-800 text-slate-300 gap-1"
                  >
                    <KeyRound className="h-3 w-3 text-amber-400" />
                    <span>Reset PIN</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showNotice(`Nafath Re-KYC authentication initiated for ${user.fullName}`)}
                    className="h-7 text-xs bg-slate-900 border-slate-800 text-slate-300 gap-1"
                  >
                    <RefreshCw className="h-3 w-3 text-[#7FE87F]" />
                    <span>Force Re-KYC</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Complete Transaction Ledger */}
      {activeTab === "transactions" && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ReceiptText className="h-4 w-4 text-[#7FE87F]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Transaction Ledger for {user.fullName}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{userTransactions.length} operations</span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Ref & Time</TableHead>
                <TableHead>Counterparty</TableHead>
                <TableHead>Amount (SAR)</TableHead>
                <TableHead>Channel & Method</TableHead>
                <TableHead>Sarie Instant UTR</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userTransactions.length > 0 ? (
                userTransactions.map((tx) => {
                  const isOutgoing = tx.senderName.toLowerCase().includes(user.fullName.toLowerCase().slice(0, 5));
                  return (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="font-mono font-bold text-sky-400 text-xs">{tx.orderRef}</div>
                        <div className="text-[10px] text-slate-400">{new Date(tx.timestamp).toLocaleTimeString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-white text-xs">{isOutgoing ? tx.receiverName : tx.senderName}</div>
                        <div className="text-[10px] text-slate-400">{isOutgoing ? "Debit / Outgoing" : "Credit / Incoming"}</div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-extrabold text-xs ${isOutgoing ? "text-slate-200" : "text-[#7FE87F]"}`}>
                          {isOutgoing ? "-" : "+"}SAR {tx.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold uppercase text-slate-300">{tx.paymentMethod}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-[11px] text-sky-400">{tx.sarieUtr || "N/A"}</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={tx.status} />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-slate-500 text-xs">
                    No transactions found for this user.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Tab 3: Bound Devices & Security Sessions */}
      {activeTab === "devices" && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-sky-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Registered Hardware & Bound Mobile Devices
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Secure Enclave Bound</span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device Model</TableHead>
                <TableHead>OS & App Version</TableHead>
                <TableHead>Biometrics</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>IP & Location</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(user.registeredDevices || []).length > 0 ? (
                user.registeredDevices?.map((dev) => (
                  <TableRow key={dev.id}>
                    <TableCell>
                      <div className="font-bold text-white text-xs">{dev.deviceName}</div>
                      <div className="text-[10px] text-slate-400">{dev.model}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-slate-300">{dev.osVersion}</div>
                      <div className="text-[10px] text-slate-500">{dev.appVersion}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success" className="text-[10px]">
                        FACE ID ACTIVE
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-300">{dev.lastActive}</span>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-xs text-sky-400">{dev.ipAddress}</div>
                      <div className="text-[10px] text-slate-400">{dev.city}</div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => showNotice(`Device session revoked for ${dev.deviceName}`)}
                        className="h-7 px-2 text-xs"
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-slate-500 text-xs">
                    No hardware devices bound to this account.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Tab 4: Activity & Audit Trail */}
      {activeTab === "activity" && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-[#7FE87F]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Security & Telemetry Audit Timeline
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Real-time Stream</span>
          </div>

          <div className="space-y-2.5">
            {(user.activityLogs || []).length > 0 ? (
              user.activityLogs?.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-[#10182A] border border-slate-800/80 space-y-1"
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
                No security flags or activity records for this user.
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Adjust Limit Dialog */}
      <Dialog open={isLimitModalOpen} onOpenChange={setIsLimitModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Adjust Daily Transfer Limit</DialogTitle>
            <DialogDescription>
              Set maximum daily outgoing transfer limit for {user.fullName}
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
              onClick={() => setIsLimitModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (onUpdateDailyLimit) onUpdateDailyLimit(user.id, tempLimit);
                showNotice(`Daily limit for ${user.fullName} set to SAR ${tempLimit.toLocaleString()}`);
                setIsLimitModalOpen(false);
              }}
            >
              Save Limit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
