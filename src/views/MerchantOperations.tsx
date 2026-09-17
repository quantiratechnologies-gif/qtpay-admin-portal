import React, { useState } from "react";
import {
  Store,
  CheckCircle2,
  XCircle,
  Search,
  Terminal,
  ShieldCheck,
  Eye,
  Copy,
  Check,
  History,
  PauseCircle,
  PlayCircle,
  Plus,
  Trash2,
  Percent
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
import type { Merchant } from "../types";

interface MerchantOperationsProps {
  merchants: Merchant[];
  onUpdateMerchantStatus: (merchantId: string, newStatus: Merchant["status"]) => void;
  lang: "en" | "ar";
}

export const MerchantOperations: React.FC<MerchantOperationsProps> = ({
  merchants,
  onUpdateMerchantStatus,
  lang
}) => {
  const isAr = lang === "ar";
  const [search, setSearch] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [activityModalMerchant, setActivityModalMerchant] = useState<Merchant | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1200);
  };

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
            {isAr ? "التجار والتحكم بالعمليات" : "Merchants & Operations Control"}
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
              placeholder={isAr ? "بحث..." : "Search..."}
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
            <option value="all">{isAr ? "الكل" : "All"}</option>
            <option value="pending_kyb">{isAr ? "معلق" : "Pending"}</option>
            <option value="active">{isAr ? "نشط" : "Active"}</option>
            <option value="suspended">{isAr ? "موقوف" : "Suspended"}</option>
          </select>
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
            <TableHead>{isAr ? "التاجر" : "Merchant"}</TableHead>
            <TableHead>{isAr ? "السجل / الضريبة" : "CR / VAT"}</TableHead>
            <TableHead>{isAr ? "المالك" : "Owner"}</TableHead>
            <TableHead>{isAr ? "البنك" : "Bank"}</TableHead>
            <TableHead>{isAr ? "الأجهزة" : "POS"}</TableHead>
            <TableHead>{isAr ? "التسوية" : "Settlement"}</TableHead>
            <TableHead>{isAr ? "الحالة" : "Status"}</TableHead>
            <TableHead>{isAr ? "إجراء والنشاط" : "Control & Logs"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((m) => (
            <TableRow key={m.id}>
              <TableCell>
                <div className="font-bold text-white text-xs">{isAr ? m.businessNameAr : m.businessName}</div>
                <div className="text-[10px] text-slate-400">{m.city}</div>
              </TableCell>
              <TableCell>
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
                {m.settlementHold ? (
                  <Badge variant="destructive" className="text-[10px]">
                    ON HOLD
                  </Badge>
                ) : (
                  <Badge variant="success" className="text-[10px]">
                    ACTIVE
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={m.status} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMerchant(m)}
                    className="h-7 px-2 text-xs bg-[#10182A] hover:bg-slate-800 gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    <span>{isAr ? "عرض" : "Manage"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActivityModalMerchant(m)}
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

      {/* Merchant Management & Control Dialog */}
      <Dialog open={!!selectedMerchant} onOpenChange={(open) => !open && setSelectedMerchant(null)}>
        {selectedMerchant && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedMerchant.businessName}</DialogTitle>
              <DialogDescription>
                {selectedMerchant.city} • Merchant Profile & Operational Controls
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-1">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400">
                    Commercial Registration & Tax Verified
                  </span>
                </div>
                {selectedMerchant.customMdrRate && (
                  <span className="text-[11px] font-mono text-[#7FE87F] font-bold">
                    Custom MDR: {selectedMerchant.customMdrRate}%
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#10182A] border border-slate-800/80 rounded-lg p-2.5 space-y-0.5">
                  <span className="text-[10px] text-slate-400">CR Number</span>
                  <div className="font-mono font-bold text-sky-400">{selectedMerchant.crNumber}</div>
                </div>
                <div className="bg-[#10182A] border border-slate-800/80 rounded-lg p-2.5 space-y-0.5">
                  <span className="text-[10px] text-slate-400">VAT Number</span>
                  <div className="font-mono font-bold text-white">{selectedMerchant.vatNumber}</div>
                </div>
                <div className="bg-[#10182A] border border-slate-800/80 rounded-lg p-2.5 space-y-0.5">
                  <span className="text-[10px] text-slate-400">Settlement IBAN</span>
                  <div className="font-mono font-bold text-white text-[10px]">{selectedMerchant.settlementIban}</div>
                </div>
                <div className="bg-[#10182A] border border-slate-800/80 rounded-lg p-2.5 space-y-0.5">
                  <span className="text-[10px] text-slate-400">Active SoftPOS</span>
                  <div className="font-bold text-white">{selectedMerchant.activeTerminals} Terminals</div>
                </div>
              </div>

              {/* Quick Operation Controls */}
              <div className="p-3 rounded-lg bg-[#10182A] border border-slate-800/80 space-y-2">
                <span className="text-xs font-bold text-white block">Operational Actions</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      showNotice(`New SoftPOS Terminal provisioned for ${selectedMerchant.businessName}`);
                    }}
                    className="h-7 text-xs bg-slate-900 border-slate-800 text-slate-300 gap-1"
                  >
                    <Plus className="h-3 w-3 text-[#7FE87F]" />
                    <span>Provision Terminal</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      showNotice(`Settlement hold toggled for ${selectedMerchant.businessName}`);
                    }}
                    className="h-7 text-xs bg-slate-900 border-slate-800 text-slate-300 gap-1"
                  >
                    {selectedMerchant.settlementHold ? (
                      <>
                        <PlayCircle className="h-3 w-3 text-emerald-400" />
                        <span>Release Payouts</span>
                      </>
                    ) : (
                      <>
                        <PauseCircle className="h-3 w-3 text-amber-400" />
                        <span>Hold Payouts</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onUpdateMerchantStatus(selectedMerchant.id, "suspended");
                  setSelectedMerchant(null);
                  showNotice(`Merchant ${selectedMerchant.businessName} suspended`);
                }}
                className="gap-1.5"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>{isAr ? "إيقاف" : "Suspend"}</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  onUpdateMerchantStatus(selectedMerchant.id, "active");
                  setSelectedMerchant(null);
                  showNotice(`Merchant ${selectedMerchant.businessName} approved`);
                }}
                className="gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{isAr ? "اعتماد" : "Approve"}</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Merchant Activity Audit Modal */}
      <Dialog open={!!activityModalMerchant} onOpenChange={(open) => !open && setActivityModalMerchant(null)}>
        {activityModalMerchant && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-4 w-4 text-[#7FE87F]" />
                <span>Merchant Activity Log: {activityModalMerchant.businessName}</span>
              </DialogTitle>
              <DialogDescription>
                SoftPOS terminal heartbeats, settlement batches, and KYB status history
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2.5 max-h-72 overflow-y-auto py-1">
              {(activityModalMerchant.activityLogs || []).length > 0 ? (
                activityModalMerchant.activityLogs?.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-[#10182A] border border-slate-800/80 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{log.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-400">{log.details}</p>
                    <div className="text-[10px] text-slate-500 pt-0.5">
                      <span>Actor: {log.actor}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No previous activity records for this merchant.
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivityModalMerchant(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
