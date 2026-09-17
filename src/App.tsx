import React, { useState, useEffect } from "react";
import { Sidebar, NavTab } from "./components/Sidebar";
import { Header } from "./components/Header";
import { AdminLogin } from "./views/AdminLogin";
import { ExecutiveDashboard } from "./views/ExecutiveDashboard";
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
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("qtpay_admin_session");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch(e) {}
      }
    }
    return null;
  });

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
    localStorage.setItem("qtpay_admin_session", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("qtpay_admin_session");
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
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-page)" }}>
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onLogout={handleLogout}
        lang={lang}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          lang={lang}
          onToggleLang={() => setLang(lang === "en" ? "ar" : "en")}
          onRefreshData={handleRefreshData}
          isRefreshing={isRefreshing}
        />

        <main style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
          {currentTab === "dashboard" && (
            <ExecutiveDashboard
              transactions={transactions}
              merchants={merchants}
              riskAlerts={mockRiskAlerts}
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
