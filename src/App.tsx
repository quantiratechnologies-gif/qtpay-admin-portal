import React, { useState, useEffect } from "react";
import { Sidebar, NavTab } from "./components/Sidebar";
import { Header } from "./components/Header";
import { AdminLogin } from "./views/AdminLogin";
import { ExecutiveDashboard } from "./views/ExecutiveDashboard";
import { MerchantOperations } from "./views/MerchantOperations";
import { ConsumerKYC } from "./views/ConsumerKYC";
import { GlobalLedger } from "./views/GlobalLedger";
import { SettlementsEngine } from "./views/SettlementsEngine";
import { RiskAndAML } from "./views/RiskAndAML";
import { CommissionMatrix } from "./views/CommissionMatrix";
import { SamaAuditLogs } from "./views/SamaAuditLogs";
import {
  mockMerchants,
  mockCustomers,
  mockTransactions,
  mockSettlementBatches,
  mockRiskAlerts,
  mockFeeTiers,
  mockSamaAuditLogs,
  currentAdminUser
} from "./services/mockData";
import { subscribeToPlatformTransactions } from "./services/supabaseClient";
import type {
  AdminUser,
  Merchant,
  CustomerUser,
  PlatformTransaction,
  SettlementBatch,
  RiskAlert,
  CommissionFeeTier,
  SamaAuditLog
} from "./types";

export function App() {
  // Authentication Gate State
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Application Data States
  const [merchants, setMerchants] = useState<Merchant[]>(mockMerchants);
  const [customers, setCustomers] = useState<CustomerUser[]>(mockCustomers);
  const [transactions, setTransactions] = useState<PlatformTransaction[]>(mockTransactions);
  const [settlementBatches, setSettlementBatches] = useState<SettlementBatch[]>(mockSettlementBatches);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>(mockRiskAlerts);
  const [feeTiers, setFeeTiers] = useState<CommissionFeeTier[]>(mockFeeTiers);
  const [auditLogs, setAuditLogs] = useState<SamaAuditLog[]>(mockSamaAuditLogs);

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

      const log: SamaAuditLog = {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        adminName: "Supabase Realtime Engine",
        adminEmail: "system@qtpay.sa",
        action: "RECORD_LIVE_TRANSACTION",
        category: "SETTLEMENT_DISPATCH",
        targetEntity: `Order ${newTx.orderRef} (SAR ${newTx.amount})`,
        details: `Received real-time ${newTx.paymentMethod.toUpperCase()} transaction on ${newTx.channel}`,
        ipAddress: "127.0.0.1 (Direct Socket)",
        status: "SUCCESS"
      };
      setAuditLogs((prev) => [log, ...prev]);
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
    const target = merchants.find((m) => m.id === merchantId);
    const log: SamaAuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      adminName: currentUser.name,
      adminEmail: currentUser.email,
      action: newStatus === "active" ? "APPROVE_MERCHANT_KYB" : "SUSPEND_MERCHANT",
      category: "KYB_APPROVAL",
      targetEntity: target ? target.businessName : merchantId,
      details: `Changed merchant KYB status to ${newStatus.toUpperCase()}`,
      ipAddress: currentUser.ipAddress,
      status: "SUCCESS"
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const handleToggleFreezeAccount = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, isFrozen: !c.isFrozen } : c))
    );
    const target = customers.find((c) => c.id === customerId);
    const isNowFrozen = target ? !target.isFrozen : true;
    const log: SamaAuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      adminName: currentUser.name,
      adminEmail: currentUser.email,
      action: isNowFrozen ? "FREEZE_CUSTOMER_WALLET" : "UNFREEZE_CUSTOMER_WALLET",
      category: "ACCOUNT_FREEZE",
      targetEntity: target ? target.fullName : customerId,
      details: isNowFrozen ? "Locked wallet safety lock due to compliance investigation" : "Restored wallet access",
      ipAddress: currentUser.ipAddress,
      status: "SUCCESS"
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const handleExecuteRefund = (txId: string) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === txId ? { ...tx, status: "refunded" } : tx))
    );
    const target = transactions.find((tx) => tx.id === txId);
    const log: SamaAuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      adminName: currentUser.name,
      adminEmail: currentUser.email,
      action: "EXECUTE_REFUND",
      category: "REFUND_EXECUTION",
      targetEntity: target ? target.orderRef : txId,
      details: `Reversed SAR ${target?.amount} back to original payment rail`,
      ipAddress: currentUser.ipAddress,
      status: "SUCCESS"
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const handleDispatchBatch = (batchId: string) => {
    setSettlementBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: "completed", executedAt: "Just Now" } : b))
    );
    const target = settlementBatches.find((b) => b.id === batchId);
    const log: SamaAuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      adminName: currentUser.name,
      adminEmail: currentUser.email,
      action: "DISPATCH_SETTLEMENT_BATCH",
      category: "SETTLEMENT_DISPATCH",
      targetEntity: target ? target.batchRef : batchId,
      details: `Dispatched net SAR ${target?.totalNetDisbursedSar.toLocaleString()} to partner bank`,
      ipAddress: currentUser.ipAddress,
      status: "SUCCESS"
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const handleResolveAlert = (alertId: string) => {
    setRiskAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: "resolved" } : a))
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
    }, 600);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-page)" }}>
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        lang={lang}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
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
              riskAlerts={riskAlerts}
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

          {currentTab === "settlements" && (
            <SettlementsEngine
              batches={settlementBatches}
              onDispatchBatch={handleDispatchBatch}
              lang={lang}
            />
          )}

          {currentTab === "risk" && (
            <RiskAndAML
              alerts={riskAlerts}
              onResolveAlert={handleResolveAlert}
              lang={lang}
            />
          )}

          {currentTab === "commissions" && (
            <CommissionMatrix
              feeTiers={feeTiers}
              onUpdateFee={handleUpdateFee}
              lang={lang}
            />
          )}

          {currentTab === "audit" && (
            <SamaAuditLogs
              logs={auditLogs}
              lang={lang}
            />
          )}
        </main>
      </div>
    </div>
  );
}
