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
import { LanguageProvider, useTranslation } from "./lib/i18n/LanguageContext";
import type {
  AdminUser,
  Merchant,
  CustomerUser,
  PlatformTransaction,
  CommissionFeeTier,
  SoftPosTerminal
} from "./types";

function AppContent() {
  const { lang, isAr, toggleLang } = useTranslation();

  // Always start unauthenticated on load to show login page
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date>(new Date());

  // Application Data States
  const [merchants, setMerchants] = useState<Merchant[]>(mockMerchants);
  const [customers, setCustomers] = useState<CustomerUser[]>(mockCustomers);
  const [transactions, setTransactions] = useState<PlatformTransaction[]>(mockTransactions);
  const [feeTiers, setFeeTiers] = useState<CommissionFeeTier[]>(mockFeeTiers);

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
        t.id === id
          ? {
              ...t,
              ratePercentage: newRate,
              fixedFeeSar: newFixed,
              lastUpdated: isAr ? "الآن" : "Just Now"
            }
          : t
      )
    );
  };

  const handleProvisionTerminal = (merchantId: string, model: string) => {
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id !== merchantId) return m;
        const list = m.terminalsList || [];
        const newTerminalId = `TRM-${Math.floor(100000 + Math.random() * 900000)}`;
        const newTerminal: SoftPosTerminal = {
          id: `trm_${Date.now()}`,
          terminalId: newTerminalId,
          merchantId,
          model,
          osVersion:
            model.includes("Apple") || model.includes("iPhone") || model.includes("iPad")
              ? "iOS 18.2"
              : "Android 15",
          nfcStatus: "active",
          lastHeartbeat: "Just Now",
          dailyVolumeSar: 0,
          dailyTxCount: 0,
          status: "online"
        };
        const updatedList = [newTerminal, ...list];
        const updatedIds = [...(m.terminalIds || []), newTerminalId];
        return {
          ...m,
          terminalsList: updatedList,
          terminalIds: updatedIds,
          activeTerminals: updatedList.length
        };
      })
    );
  };

  const handleDecommissionTerminal = (merchantId: string, terminalId: string) => {
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id !== merchantId) return m;
        const list = (m.terminalsList || []).filter((t) => t.terminalId !== terminalId);
        const updatedIds = (m.terminalIds || []).filter((id) => id !== terminalId);
        return {
          ...m,
          terminalsList: list,
          terminalIds: updatedIds,
          activeTerminals: list.length
        };
      })
    );
  };

  const handleTogglePayoutHold = (merchantId: string) => {
    setMerchants((prev) =>
      prev.map((m) =>
        m.id === merchantId ? { ...m, settlementHold: !m.settlementHold } : m
      )
    );
  };

  const handleRevokeDevice = (userId: string, deviceId: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== userId) return c;
        const list = (c.registeredDevices || []).filter((d) => d.id !== deviceId);
        return {
          ...c,
          registeredDevices: list
        };
      })
    );
  };

  const handleAddMerchant = (m: Omit<Merchant, "id">) => {
    const newMerchant: Merchant = {
      ...m,
      id: `mch_${Date.now()}`
    };
    setMerchants((prev) => [newMerchant, ...prev]);
  };

  const handleAddCustomer = (c: Omit<CustomerUser, "id">) => {
    const newCustomer: CustomerUser = {
      ...c,
      id: `usr_${Date.now()}`
    };
    setCustomers((prev) => [newCustomer, ...prev]);
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTransactions((prev) => [...prev]);
      setMerchants((prev) => [...prev]);
      setCustomers((prev) => [...prev]);
      setLastSyncedAt(new Date());
      setIsRefreshing(false);
    }, 600);
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
          onToggleLang={toggleLang}
          onRefreshData={handleRefreshData}
          isRefreshing={isRefreshing}
          lastSyncedAt={lastSyncedAt}
          merchants={merchants}
          customers={customers}
          transactions={transactions}
          onNavigate={(tab) => setCurrentTab(tab)}
        />

        <main className="flex-1 p-4 sm:p-5 lg:p-6 overflow-y-auto">
          {currentTab === "dashboard" && (
            <ExecutiveDashboard
              transactions={transactions}
              merchants={merchants}
              customers={customers}
              riskAlerts={mockRiskAlerts}
              lang={lang}
              onSelectTab={setCurrentTab}
              onLogout={handleLogout}
            />
          )}

          {currentTab === "insights" && (
            <InsightsAnalytics
              lang={lang}
              onSelectTab={setCurrentTab}
            />
          )}

          {currentTab === "merchants" && (
            <MerchantOperations
              merchants={merchants}
              transactions={transactions}
              onUpdateMerchantStatus={handleUpdateMerchantStatus}
              onExecuteRefund={handleExecuteRefund}
              onProvisionTerminal={handleProvisionTerminal}
              onDecommissionTerminal={handleDecommissionTerminal}
              onTogglePayoutHold={handleTogglePayoutHold}
              onAddMerchant={handleAddMerchant}
              lang={lang}
            />
          )}

          {currentTab === "consumers" && (
            <ConsumerKYC
              customers={customers}
              transactions={transactions}
              onToggleFreezeAccount={handleToggleFreezeAccount}
              onUpdateDailyLimit={handleUpdateDailyLimit}
              onRevokeDevice={handleRevokeDevice}
              onAddCustomer={handleAddCustomer}
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

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
