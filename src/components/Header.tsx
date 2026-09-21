import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  Languages,
  RefreshCw,
  LogOut,
  ChevronDown,
  Store,
  ReceiptText,
  Users,
  X,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { useTranslation } from "../lib/i18n/LanguageContext";
import type { AdminUser, Merchant, CustomerUser, PlatformTransaction } from "../types";
import type { NavTab } from "./Sidebar";

interface HeaderProps {
  currentUser: AdminUser;
  onLogout: () => void;
  lang?: "en" | "ar";
  onToggleLang: () => void;
  onRefreshData: () => void;
  isRefreshing?: boolean;
  lastSyncedAt?: Date;
  merchants?: Merchant[];
  customers?: CustomerUser[];
  transactions?: PlatformTransaction[];
  onNavigate?: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onToggleLang,
  onRefreshData,
  isRefreshing = false,
  lastSyncedAt,
  merchants = [],
  customers = [],
  transactions = [],
  onNavigate
}) => {
  const { isAr, t, formatCurrency } = useTranslation();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo(() => {
    const s = query.trim().toLowerCase();
    if (s.length < 2) return null;
    return {
      merchants: merchants
        .filter(
          (m) =>
            m.businessName.toLowerCase().includes(s) ||
            (m.businessNameAr && m.businessNameAr.includes(query.trim())) ||
            m.crNumber.includes(s) ||
            m.ownerName.toLowerCase().includes(s)
        )
        .slice(0, 3),
      transactions: transactions
        .filter(
          (t) =>
            t.orderRef.toLowerCase().includes(s) ||
            (t.madaRrn && t.madaRrn.toLowerCase().includes(s)) ||
            (t.sarieUtr && t.sarieUtr.toLowerCase().includes(s)) ||
            t.senderName.toLowerCase().includes(s) ||
            t.receiverName.toLowerCase().includes(s)
        )
        .slice(0, 3),
      customers: customers
        .filter(
          (c) =>
            c.fullName.toLowerCase().includes(s) ||
            (c.fullNameAr && c.fullNameAr.includes(query.trim())) ||
            c.mobile.includes(s) ||
            c.nationalId.includes(s) ||
            c.sarieUpiId.toLowerCase().includes(s)
        )
        .slice(0, 3),
    };
  }, [query, merchants, transactions, customers]);

  const totalResults = results
    ? results.merchants.length + results.transactions.length + results.customers.length
    : 0;

  const handleSelect = (tab: NavTab) => {
    if (onNavigate) {
      onNavigate(tab);
    }
    setIsOpen(false);
    setQuery("");
  };

  return (
    <header className="h-14 bg-[#080C14]/90 backdrop-blur-md border-b border-[#2C2C44] px-4 sm:px-5 flex items-center justify-between sticky top-0 z-30 shadow-md relative before:absolute before:inset-x-0 before:bottom-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[#7FE87F]/25 before:to-transparent">
      {/* Search Input & Dynamic Dropdown */}
      <div className="relative w-48 sm:w-80" ref={searchContainerRef}>
        <Search
          className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6E6E85] pointer-events-none ${
            isAr ? "right-2.5" : "left-2.5"
          }`}
        />
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t("common.quickSearch")}
          className={`h-8 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F] focus:ring-1 focus:ring-[#7FE87F]/50 shadow-inner ${
            isAr ? "pr-8 pl-8" : "pl-8 pr-8"
          }`}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className={`absolute top-1/2 -translate-y-1/2 text-[#6E6E85] hover:text-white cursor-pointer ${
              isAr ? "left-2.5" : "right-2.5"
            }`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Search Results Dropdown */}
        {isOpen && query.trim().length >= 2 && (
          <div
            className={`absolute top-10 w-[340px] sm:w-[380px] bg-[#111726] border border-[#2C2C44] rounded-xl shadow-2xl z-50 overflow-hidden text-xs ${
              isAr ? "right-0" : "left-0"
            }`}
          >
            {totalResults === 0 ? (
              <div className="p-4 text-center text-[#6E6E85] text-xs">
                {isAr ? `لا توجد نتائج مطابقة لـ "${query}"` : `No results found for "${query}"`}
              </div>
            ) : (
              <div className="max-h-[380px] overflow-y-auto divide-y divide-[#2C2C44]/60">
                {/* Merchants Section */}
                {results && results.merchants.length > 0 && (
                  <div className="p-2 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-[#7FE87F] uppercase tracking-wider flex items-center gap-1.5">
                      <Store className="h-3 w-3" />
                      <span>{t("nav.merchants")} ({results.merchants.length})</span>
                    </div>
                    {results.merchants.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelect("merchants")}
                        className="w-full text-start p-2 rounded-lg hover:bg-[#182236] transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-white group-hover:text-[#7FE87F] transition-colors">
                            {isAr && m.businessNameAr ? m.businessNameAr : m.businessName}
                          </div>
                          <div className="text-[10px] text-[#A2A2BA]">
                            CR: {m.crNumber} • {m.city}
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#7FE87F]/10 text-[#7FE87F] font-semibold">
                          {m.activeTerminals} POS
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Transactions Section */}
                {results && results.transactions.length > 0 && (
                  <div className="p-2 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-[#7FE87F] uppercase tracking-wider flex items-center gap-1.5">
                      <ReceiptText className="h-3 w-3" />
                      <span>{t("nav.transactions")} ({results.transactions.length})</span>
                    </div>
                    {results.transactions.map((tx) => (
                      <button
                        key={tx.id}
                        onClick={() => handleSelect("ledger")}
                        className="w-full text-start p-2 rounded-lg hover:bg-[#182236] transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-white group-hover:text-[#7FE87F] transition-colors">
                            {tx.orderRef}
                          </div>
                          <div className="text-[10px] text-[#A2A2BA]">
                            {tx.senderName} → {tx.receiverName}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#7FE87F] tabular-nums">
                          {formatCurrency(tx.amount)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Customers Section */}
                {results && results.customers.length > 0 && (
                  <div className="p-2 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-[#7FE87F] uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      <span>{t("nav.consumers")} ({results.customers.length})</span>
                    </div>
                    {results.customers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelect("consumers")}
                        className="w-full text-start p-2 rounded-lg hover:bg-[#182236] transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-white group-hover:text-[#7FE87F] transition-colors">
                            {isAr && c.fullNameAr ? c.fullNameAr : c.fullName}
                          </div>
                          <div className="text-[10px] text-[#A2A2BA]">
                            {c.mobile} • ID: {c.nationalId}
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#182236] text-[#A2A2BA] font-mono">
                          {c.sarieUpiId}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Live Socket Status & Last Synced Timestamp */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-[#7FE87F]/15 to-[#6FD86F]/10 border border-[#7FE87F]/35 rounded-md text-[11px] text-[#7FE87F] font-bold shadow-sm shadow-[#7FE87F]/15">
            <span className="live-indicator w-1.5 h-1.5" />
            <span>{t("common.liveSync")}</span>
          </div>
          {lastSyncedAt && (
            <span className="text-[10px] text-[#6E6E85] hidden md:inline tabular-nums">
              {isAr ? "آخر تحديث" : "Synced"}{" "}
              {lastSyncedAt.toLocaleTimeString(isAr ? "ar-SA" : "en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          )}
        </div>

        {/* Refresh Live Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onRefreshData}
          disabled={isRefreshing}
          title={t("common.refreshData")}
          className="h-8 w-8 bg-[#111726] border-[#2C2C44] text-[#A2A2BA] hover:text-white hover:border-[#7FE87F]/50 hover:shadow-sm hover:shadow-[#7FE87F]/20 cursor-pointer"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 text-[#7FE87F] ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>

        {/* Language Switcher */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleLang}
          className="h-8 px-2.5 bg-[#7FE87F]/10 border-[#7FE87F]/40 text-[#7FE87F] hover:bg-[#7FE87F]/25 hover:border-[#7FE87F]/60 text-xs font-bold gap-1.5 shadow-sm shadow-[#7FE87F]/15 cursor-pointer"
        >
          <Languages className="h-3.5 w-3.5" />
          <span>{isAr ? "English" : "العربية"}</span>
        </Button>

        {/* Exit / Sign Out Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="h-8 px-2.5 bg-red-500/10 border-red-500/35 text-red-400 hover:bg-red-500/20 hover:border-red-500/60 text-xs font-bold gap-1.5 shadow-sm transition-all cursor-pointer"
          title={isAr ? "تسجيل الخروج من النظام" : "Exit Portal / Sign Out"}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{isAr ? "خروج" : "Exit"}</span>
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 bg-[#111726] border-[#2C2C44] text-white hover:bg-[#182236] hover:border-[#7FE87F]/40 gap-2 cursor-pointer"
            >
              <div className="w-5 h-5 rounded bg-gradient-to-br from-[#7FE87F] to-[#5FBF5F] text-[#080C14] font-extrabold flex items-center justify-center text-[10px] shadow-sm">
                {currentUser.avatar}
              </div>
              <span className="text-xs font-bold truncate max-w-[80px]">
                {isAr ? "عبدالعزيز" : currentUser.name.split(" ")[0]}
              </span>
              <ChevronDown className="h-3 w-3 text-[#A2A2BA]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={isAr ? "start" : "end"}
            className="w-56 bg-[#111726] border-[#2C2C44]"
          >
            <DropdownMenuLabel className="space-y-0.5">
              <div className="font-bold text-xs text-white">
                {isAr ? "م. عبدالعزيز القحطاني" : currentUser.name}
              </div>
              <div className="text-[10px] text-[#A2A2BA] truncate">{currentUser.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#2C2C44]" />
            <DropdownMenuItem
              onClick={onLogout}
              className="text-red-400 focus:bg-red-500/10 focus:text-red-400 font-semibold gap-2 py-2 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{t("nav.signOut")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
