import React, { useState, useEffect } from "react";
import { Sidebar, NavTab } from "./components/Sidebar";
import { Header } from "./components/Header";
import { AdminLogin } from "./views/AdminLogin";
import { ExecutiveDashboard } from "./views/ExecutiveDashboard";
import { InsightsAnalytics } from "./views/InsightsAnalytics";
import { MerchantOperations } from "./views/MerchantOperations";
import { ConsumerKYC } from "./views/ConsumerKYC";
import { GlobalLedger } from "./views/GlobalLedger";
import { CommissionMatrix } from "./views/CommissionMatrix";
import {
  mockMerchants,
  mockCustomers,
  mockTransactions,
  mockRiskAlerts,
  mockFeeTiers
} from "./services/mockData";
import { subscribeToPlatformTransactions } from "./services/supabaseClient";
import type {
  AdminUser,
  Merchant,
  CustomerUser,
  PlatformTransaction,
  CommissionFeeTier
} from "./types";

export function App() {
  // Always start unauthenticated on load to show login page
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Application Data States
  const [merchants, setMerchants] = useState<Merchant[]>(mockMerchants);
  const [customers, setCustomers] = useState<CustomerUser[]>(mockCustomers);
  const [transactions, setTransactions] = useState<PlatformTransaction[]>(mockTransactions);
  const [feeTiers, setFeeTiers] = useState<CommissionFeeTier[]>(mockFeeTiers);

  // Sync RTL direction
  useEffect(() => {
    if (lang === "ar") {
      document.body.classList.add("rtl");
      document.documentElement.dir = "rtl";
    } else {
      document.body.classList.remove("rtl");
      document.documentElement.dir = "ltr";
    }
  }, [lang]);

  // Connect to Supabase Realtime Platform Stream
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToPlatformTransactions((newTx) => {
      setTransactions((prev) => [newTx, ...prev]);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // If not logged in, render Admin Login screen!
  if (!currentUser) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} lang={lang} />;
  }

  // Action Handlers
  const handleUpdateMerchantStatus = (merchantId: string, newStatus: Merchant["status"]) => {
    setMerchants((prev) =>
      prev.map((m) => (m.id === merchantId ? { ...m, status: newStatus } : m))
    );
  };

  const handleToggleFreezeAccount = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, isFrozen: !c.isFrozen } : c))
    );
  };

  const handleUpdateDailyLimit = (customerId: string, newLimit: number) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, dailyLimitSar: newLimit } : c))
    );
  };

  const handleExecuteRefund = (txId: string) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === txId ? { ...tx, status: "refunded" } : tx))
    );
  };

  const handleUpdateFee = (id: string, newRate: number, newFixed: number) => {
    setFeeTiers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ratePercentage: newRate, fixedFeeSar: newFixed, lastUpdated: "Just Now" } : t
      )
    );
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="flex min-h-screen bg-[#080C14] text-slate-100">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        lang={lang}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          lang={lang}
          onToggleLang={() => setLang(lang === "en" ? "ar" : "en")}
          onRefreshData={handleRefreshData}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 p-5 lg:p-6 overflow-y-auto">
          {currentTab === "dashboard" && (
            <ExecutiveDashboard
              transactions={transactions}
              merchants={merchants}
              riskAlerts={mockRiskAlerts}
              lang={lang}
            />
          )}

          {currentTab === "insights" && (
            <InsightsAnalytics
              lang={lang}
            />
          )}

          {currentTab === "merchants" && (
            <MerchantOperations
              merchants={merchants}
              onUpdateMerchantStatus={handleUpdateMerchantStatus}
              lang={lang}
            />
          )}

          {currentTab === "consumers" && (
            <ConsumerKYC
              customers={customers}
              onToggleFreezeAccount={handleToggleFreezeAccount}
              onUpdateDailyLimit={handleUpdateDailyLimit}
              lang={lang}
            />
          )}

          {currentTab === "ledger" && (
            <GlobalLedger
              transactions={transactions}
              onExecuteRefund={handleExecuteRefund}
              lang={lang}
            />
          )}

          {currentTab === "settings" && (
            <CommissionMatrix
              feeTiers={feeTiers}
              onUpdateFee={handleUpdateFee}
              lang={lang}
            />
          )}
        </main>
      </div>
    </div>
  );
}
