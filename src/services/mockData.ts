import type {
  AdminUser,
  Merchant,
  CustomerUser,
  PlatformTransaction,
  SettlementBatch,
  RiskAlert,
  CommissionFeeTier,
  SamaAuditLog,
  RoleDefinition,
  AdminPermission
} from "../types";

export const currentAdminUser: AdminUser = {
  id: "adm_902183",
  name: "Eng. Abdulaziz Al-Qahtani",
  email: "admin@qtpay.sa",
  role: "superadmin",
  avatar: "AQ",
  lastLogin: "Today, 10:45 AM (Riyadh HQ)",
  ipAddress: "178.135.92.14",
  status: "active"
};

export const mockRoleDefinitions: RoleDefinition[] = [
  {
    id: "superadmin",
    title: "Super Administrator",
    titleAr: "المدير العام للنظام",
    description: "Full platform root control, role management, fee matrices, settlements, and emergency overrides.",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    memberCount: 2
  },
  {
    id: "compliance_officer",
    title: "Compliance & AML Officer",
    titleAr: "مسؤول الامتثال ومكافحة غسل الأموال",
    description: "SAMA compliance audits, KYC/KYB identity approvals, AML fraud screening, and wallet freezes.",
    badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    memberCount: 3
  },
  {
    id: "settlement_manager",
    title: "Operations & Settlements Manager",
    titleAr: "مدير العمليات والتسويات البنكية",
    description: "Merchant onboarding, SoftPOS terminal provisioning, IBAN verification, and batch clearing dispatch.",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    memberCount: 4
  },
  {
    id: "risk_analyst",
    title: "Risk & Fraud Analyst",
    titleAr: "محلل المخاطر والاحتيال",
    description: "Real-time velocity anomaly monitoring, transaction risk scoring, and suspicious activity flagging.",
    badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    memberCount: 3
  },
  {
    id: "support_lead",
    title: "Customer & Merchant Support Lead",
    titleAr: "مسؤول دعم العملاء والتجار",
    description: "Read-only ledger lookup, PIN/alias reset assistance, customer verification status queries.",
    badgeColor: "text-slate-400 bg-slate-500/10 border-slate-500/20",
    memberCount: 5
  }
];

export const mockAdminPermissions: AdminPermission[] = [
  {
    id: "perm_view_dashboard",
    name: "View Live Dashboard & Insights",
    description: "Access to high-level volume metrics, transaction velocity, and system health",
    category: "system",
    superadmin: true,
    compliance_officer: true,
    settlement_manager: true,
    risk_analyst: true,
    support_lead: true
  },
  {
    id: "perm_manage_roles",
    name: "Manage Admin Roles & Staff",
    description: "Create, assign, edit, and revoke administrative team credentials",
    category: "system",
    superadmin: true,
    compliance_officer: false,
    settlement_manager: false,
    risk_analyst: false,
    support_lead: false
  },
  {
    id: "perm_approve_kyb",
    name: "Approve & Suspend Merchants (KYB)",
    description: "Verify Wathq commercial registration, tax IDs, and modify merchant onboarding status",
    category: "merchants",
    superadmin: true,
    compliance_officer: true,
    settlement_manager: true,
    risk_analyst: false,
    support_lead: false
  },
  {
    id: "perm_provision_pos",
    name: "Provision SoftPOS Terminals",
    description: "Assign and de-provision terminal IDs and NFC payment keys for merchants",
    category: "merchants",
    superadmin: true,
    compliance_officer: false,
    settlement_manager: true,
    risk_analyst: false,
    support_lead: false
  },
  {
    id: "perm_hold_settlements",
    name: "Hold & Release Merchant Payouts",
    description: "Place temporary holds on merchant bank settlements pending risk investigation",
    category: "settlements",
    superadmin: true,
    compliance_officer: true,
    settlement_manager: true,
    risk_analyst: true,
    support_lead: false
  },
  {
    id: "perm_freeze_users",
    name: "Freeze & Unfreeze Consumer Wallets",
    description: "Immediately block outgoing Sarie transfers and QR payments for suspicious accounts",
    category: "users",
    superadmin: true,
    compliance_officer: true,
    settlement_manager: false,
    risk_analyst: true,
    support_lead: false
  },
  {
    id: "perm_adjust_limits",
    name: "Adjust Daily Transaction Limits",
    description: "Override default daily transfer thresholds for VIP or verified consumers",
    category: "users",
    superadmin: true,
    compliance_officer: true,
    settlement_manager: false,
    risk_analyst: false,
    support_lead: false
  },
  {
    id: "perm_execute_refunds",
    name: "Execute Immediate Gateway Refunds",
    description: "Issue immediate reversals for mada, Visa, or Apple Pay transactions",
    category: "transactions",
    superadmin: true,
    compliance_officer: false,
    settlement_manager: true,
    risk_analyst: false,
    support_lead: false
  },
  {
    id: "perm_modify_fees",
    name: "Modify Commission & MDR Rates",
    description: "Edit platform percentage rates and fixed fee caps across payment rails",
    category: "system",
    superadmin: true,
    compliance_officer: false,
    settlement_manager: false,
    risk_analyst: false,
    support_lead: false
  }
];

export const mockAdminTeamMembers: AdminUser[] = [
  {
    id: "adm_902183",
    name: "Eng. Abdulaziz Al-Qahtani",
    email: "admin@qtpay.sa",
    role: "superadmin",
    avatar: "AQ",
    lastLogin: "Just Now",
    ipAddress: "178.135.92.14",
    status: "active"
  },
  {
    id: "adm_902184",
    name: "Mona Al-Shehri",
    email: "m.shehri@qtpay.sa",
    role: "compliance_officer",
    avatar: "MS",
    lastLogin: "25 mins ago",
    ipAddress: "178.135.92.20",
    status: "active"
  },
  {
    id: "adm_902185",
    name: "Faris Al-Harbi",
    email: "f.harbi@qtpay.sa",
    role: "settlement_manager",
    avatar: "FH",
    lastLogin: "1 hour ago",
    ipAddress: "178.135.92.18",
    status: "active"
  },
  {
    id: "adm_902186",
    name: "Reem Al-Otaibi",
    email: "r.otaibi@qtpay.sa",
    role: "risk_analyst",
    avatar: "RO",
    lastLogin: "3 hours ago",
    ipAddress: "178.135.92.22",
    status: "active"
  },
  {
    id: "adm_902187",
    name: "Yousef Al-Ghamdi",
    email: "y.ghamdi@qtpay.sa",
    role: "support_lead",
    avatar: "YG",
    lastLogin: "Yesterday",
    ipAddress: "178.135.92.35",
    status: "active"
  }
];

export const mockMerchants: Merchant[] = [
  {
    id: "mch_101",
    businessName: "Quantira Gourmet Cafe",
    businessNameAr: "كافيه كوانتيرا للقهوة المختصة",
    crNumber: "1010789234",
    vatNumber: "310984729100003",
    nationalId: "1089234812",
    category: "Food & Beverage",
    ownerName: "Fahad Al-Otaibi",
    mobile: "+966 50 123 4567",
    email: "ops@quantiracafe.sa",
    city: "Riyadh (Olaya District)",
    settlementBank: "Al Rajhi Bank",
    settlementIban: "SA44 8000 0456 6080 1012 3456",
    status: "active",
    riskTier: "low",
    activeTerminals: 4,
    terminalIds: ["TRM-984210", "TRM-984211", "TRM-984212", "TRM-984213"],
    monthlyVolumeSar: 482500,
    joinedAt: "2026-05-12",
    settlementHold: false,
    customMdrRate: 0.75,
    activityLogs: [
      {
        id: "act_m_01",
        merchantId: "mch_101",
        timestamp: "Today, 11:00 AM",
        type: "terminal_pulse",
        title: "Terminal TRM-984210 Active",
        details: "Heartbeat synced with SAMA SoftPOS gateway (mada EMV 3.0)",
        actor: "System Automated",
        severity: "success"
      },
      {
        id: "act_m_02",
        merchantId: "mch_101",
        timestamp: "Yesterday, 04:15 AM",
        type: "settlement_payout",
        title: "Settlement Dispatched (SAR 18,420.50)",
        details: "Transferred to Al Rajhi IBAN SA44 8000 0456 6080 1012 3456",
        actor: "Settlement Engine",
        severity: "info"
      },
      {
        id: "act_m_03",
        merchantId: "mch_101",
        timestamp: "2026-09-10",
        type: "pos_provision",
        title: "Provisioned 4th SoftPOS Terminal",
        details: "Terminal ID TRM-984213 allocated with NFC Tap-to-Phone license",
        actor: "Faris Al-Harbi",
        severity: "info"
      }
    ]
  },
  {
    id: "mch_102",
    businessName: "Al-Safwa Luxury Perfumes",
    businessNameAr: "عطور الصفوة الفاخرة",
    crNumber: "1010923841",
    vatNumber: "310948271000003",
    nationalId: "1098231456",
    category: "Luxury & Retail",
    ownerName: "Sultan Al-Ghamdi",
    mobile: "+966 55 987 6543",
    email: "sultan@alsafwa-perfumes.sa",
    city: "Jeddah (Red Sea Mall)",
    settlementBank: "Saudi National Bank (SNB)",
    settlementIban: "SA12 1000 0012 9081 2345 6789",
    status: "active",
    riskTier: "low",
    activeTerminals: 2,
    terminalIds: ["TRM-771209", "TRM-771210"],
    monthlyVolumeSar: 890400,
    joinedAt: "2026-06-01",
    settlementHold: false,
    activityLogs: [
      {
        id: "act_m_04",
        merchantId: "mch_102",
        timestamp: "Today, 10:15 AM",
        type: "terminal_pulse",
        title: "Apple Pay POS Transaction Processed",
        details: "Order SAR-892102 for SAR 1,850.00 approved without friction",
        actor: "Terminal TRM-771209",
        severity: "success"
      },
      {
        id: "act_m_05",
        merchantId: "mch_102",
        timestamp: "2026-08-25",
        type: "rate_override",
        title: "Preferred MDR Tier Activated",
        details: "High-volume discount applied (0.70% mada take)",
        actor: "Eng. Abdulaziz Al-Qahtani",
        severity: "info"
      }
    ]
  },
  {
    id: "mch_103",
    businessName: "Najd Organic Supermarkets",
    businessNameAr: "أسواق نجد العضوية",
    crNumber: "1010672190",
    vatNumber: "310872619000003",
    nationalId: "1078345612",
    category: "Groceries & Supermarket",
    ownerName: "Khalid Al-Dossary",
    mobile: "+966 54 321 0987",
    email: "khalid@najd-organics.sa",
    city: "Riyadh (Al Nakheel)",
    settlementBank: "Riyad Bank",
    settlementIban: "SA20 2000 0003 4567 8901 2345",
    status: "pending_kyb",
    riskTier: "medium",
    activeTerminals: 6,
    terminalIds: ["TRM-662101", "TRM-662102", "TRM-662103", "TRM-662104", "TRM-662105", "TRM-662106"],
    monthlyVolumeSar: 1250000,
    joinedAt: "2026-09-14",
    settlementHold: true,
    activityLogs: [
      {
        id: "act_m_06",
        merchantId: "mch_103",
        timestamp: "2026-09-14 02:30 PM",
        type: "kyb_update",
        title: "Merchant KYB Application Submitted",
        details: "Uploaded Wathq CR certificate and ZATCA VAT registration for review",
        actor: "Merchant Owner",
        severity: "warning"
      }
    ]
  },
  {
    id: "mch_104",
    businessName: "Riyadh Tech Electronics & Gadgets",
    businessNameAr: "تقنية الرياض للإلكترونيات",
    crNumber: "1010456123",
    vatNumber: "310123456700003",
    nationalId: "1045678912",
    category: "Electronics",
    ownerName: "Tariq Al-Shehri",
    mobile: "+966 56 789 0123",
    email: "contact@riyadhtech.sa",
    city: "Riyadh (King Fahd Rd)",
    settlementBank: "Banque Saudi Fransi",
    settlementIban: "SA55 5500 0004 5678 9012 3456",
    status: "action_required",
    riskTier: "medium",
    activeTerminals: 1,
    terminalIds: ["TRM-551901"],
    monthlyVolumeSar: 340000,
    joinedAt: "2026-09-10",
    settlementHold: false,
    activityLogs: [
      {
        id: "act_m_07",
        merchantId: "mch_104",
        timestamp: "2026-09-15 10:00 AM",
        type: "kyb_update",
        title: "National Address Verification Required",
        details: "Requested updated SPL national address document for HQ location",
        actor: "Mona Al-Shehri",
        severity: "warning"
      }
    ]
  },
  {
    id: "mch_105",
    businessName: "Desert Horizon Car Rentals",
    businessNameAr: "تأجير أفق الصحراء للسيارات",
    crNumber: "1010998877",
    vatNumber: "310998877600003",
    nationalId: "1034567890",
    category: "Automotive & Travel",
    ownerName: "Mansour Al-Mutairi",
    mobile: "+966 59 112 2334",
    email: "mansour@deserthorizon.sa",
    city: "Dammam (King Khalid St)",
    settlementBank: "Alinma Bank",
    settlementIban: "SA05 0500 0001 2345 6789 0123",
    status: "suspended",
    riskTier: "high",
    activeTerminals: 0,
    terminalIds: [],
    monthlyVolumeSar: 95000,
    joinedAt: "2026-07-22",
    settlementHold: true,
    activityLogs: [
      {
        id: "act_m_08",
        merchantId: "mch_105",
        timestamp: "Today, 09:30 AM",
        type: "settlement_hold",
        title: "Emergency Settlement Hold Enforced",
        details: "Hold placed due to 18 rapid velocity POS attempts and chargeback flag",
        actor: "Reem Al-Otaibi",
        severity: "error"
      },
      {
        id: "act_m_09",
        merchantId: "mch_105",
        timestamp: "Today, 09:32 AM",
        type: "kyb_update",
        title: "Merchant Account Suspended",
        details: "Suspension enacted pending full AML investigation",
        actor: "Mona Al-Shehri",
        severity: "error"
      }
    ]
  }
];

export const mockCustomers: CustomerUser[] = [
  {
    id: "usr_201",
    fullName: "Fahad Al-Harbi",
    fullNameAr: "فهد الحربي",
    nationalId: "1089234812",
    mobile: "+966 50 123 4567",
    email: "fahad.alharbi@qpay.sa",
    sarieUpiId: "4567@sarie",
    walletBalanceSar: 12450.75,
    dailyLimitSar: 20000.00,
    kycStatus: "verified",
    riskScore: 12,
    isFrozen: false,
    totalTransferredSar: 84300,
    joinedAt: "2026-01-15",
    activityLogs: [
      {
        id: "act_u_01",
        userId: "usr_201",
        timestamp: "Today, 08:15 AM",
        type: "transfer_out",
        title: "Sarie Transfer to Sara Al-Husseini",
        details: "Sent SAR 500.00 via Sarie Alias 7890@sarie (UTR: SARIE2026091708911)",
        actor: "User (Mobile App)",
        ipAddress: "178.135.12.8",
        severity: "success"
      },
      {
        id: "act_u_02",
        userId: "usr_201",
        timestamp: "Yesterday, 07:30 PM",
        type: "transfer_in",
        title: "mada Card Top-up",
        details: "Loaded SAR 2,000.00 from Al Rajhi mada Card ending *9082",
        actor: "User (Mobile App)",
        ipAddress: "178.135.12.8",
        severity: "success"
      },
      {
        id: "act_u_03",
        userId: "usr_201",
        timestamp: "2026-08-10",
        type: "limit_change",
        title: "Daily Limit Increased to SAR 20,000",
        details: "Standard limit elevated after Nafath biometric verification",
        actor: "Mona Al-Shehri",
        severity: "info"
      }
    ]
  },
  {
    id: "usr_202",
    fullName: "Sara Al-Husseini",
    fullNameAr: "سارة الحسيني",
    nationalId: "1098451234",
    mobile: "+966 55 456 7890",
    email: "sara.husseini@gmail.com",
    sarieUpiId: "7890@sarie",
    walletBalanceSar: 4890.20,
    dailyLimitSar: 15000.00,
    kycStatus: "verified",
    riskScore: 8,
    isFrozen: false,
    totalTransferredSar: 41200,
    joinedAt: "2026-02-10",
    activityLogs: [
      {
        id: "act_u_04",
        userId: "usr_202",
        timestamp: "Today, 08:15 AM",
        type: "transfer_in",
        title: "Received Sarie Transfer (SAR 500.00)",
        details: "Credit received from Fahad Al-Harbi",
        actor: "Sarie Switch",
        severity: "success"
      },
      {
        id: "act_u_05",
        userId: "usr_202",
        timestamp: "2026-09-01",
        type: "login",
        title: "Biometric Login via iOS Device",
        details: "Face ID authentication from iPhone 16 Pro (Riyadh, SA)",
        actor: "User Device",
        ipAddress: "82.178.44.19",
        severity: "info"
      }
    ]
  },
  {
    id: "usr_203",
    fullName: "Mohammed Al-Zahrani",
    fullNameAr: "محمد الزهراني",
    nationalId: "1076543210",
    mobile: "+966 54 890 1234",
    email: "m.zahrani@yahoo.com",
    sarieUpiId: "1234@sarie",
    walletBalanceSar: 850.00,
    dailyLimitSar: 5000.00,
    kycStatus: "pending",
    riskScore: 45,
    isFrozen: false,
    totalTransferredSar: 5600,
    joinedAt: "2026-09-12",
    activityLogs: [
      {
        id: "act_u_06",
        userId: "usr_203",
        timestamp: "2026-09-12 11:20 AM",
        type: "kyc_verify",
        title: "Nafath Verification Initiated",
        details: "Awaiting national single sign-on approval for Tier 2 limits",
        actor: "Nafath Gateway",
        severity: "warning"
      }
    ]
  },
  {
    id: "usr_204",
    fullName: "Noura Al-Sudairy",
    fullNameAr: "نورة السديري",
    nationalId: "1054321987",
    mobile: "+966 56 234 5678",
    email: "noura.sudairy@outlook.com",
    sarieUpiId: "5678@sarie",
    walletBalanceSar: 28400.00,
    dailyLimitSar: 50000.00,
    kycStatus: "verified",
    riskScore: 15,
    isFrozen: false,
    totalTransferredSar: 198000,
    joinedAt: "2026-03-05",
    activityLogs: [
      {
        id: "act_u_07",
        userId: "usr_204",
        timestamp: "Yesterday, 02:10 PM",
        type: "transfer_out",
        title: "Merchant POS Checkout (SAR 1,850.00)",
        details: "Paid Al-Safwa Luxury Perfumes via Apple Pay",
        actor: "User (Apple Pay)",
        severity: "success"
      }
    ]
  },
  {
    id: "usr_205",
    fullName: "Rayan Bin Laden",
    fullNameAr: "ريان بن لادن",
    nationalId: "1032198765",
    mobile: "+966 59 998 8776",
    email: "rayan.flagged@mail.com",
    sarieUpiId: "8776@sarie",
    walletBalanceSar: 75000.00,
    dailyLimitSar: 0.00,
    kycStatus: "rejected",
    riskScore: 92,
    isFrozen: true,
    totalTransferredSar: 450000,
    joinedAt: "2026-08-19",
    activityLogs: [
      {
        id: "act_u_08",
        userId: "usr_205",
        timestamp: "Today, 09:15 AM",
        type: "freeze",
        title: "Emergency Wallet Freeze Enacted",
        details: "Outgoing transfers and balance withdrawals blocked due to SAMA AML Rule 4B match",
        actor: "Mona Al-Shehri",
        ipAddress: "178.135.92.20",
        severity: "error"
      }
    ]
  }
];

export const mockTransactions: PlatformTransaction[] = [
  {
    id: "tx_901",
    orderRef: "SAR-892104",
    senderName: "Customer (mada)",
    receiverName: "Quantira Gourmet Cafe",
    amount: 145.50,
    vatAmount: 21.83,
    netAmount: 123.67,
    platformMdrSar: 1.16,
    paymentMethod: "mada",
    channel: "pos_softpos",
    status: "settled",
    terminalId: "TRM-984210",
    sarieUtr: "SARIE2026091708912",
    madaRrn: "RRN-908234120938",
    cardLast4: "9082",
    timestamp: "2026-09-17T05:30:12Z"
  },
  {
    id: "tx_902",
    orderRef: "SAR-892103",
    senderName: "Fahad Al-Harbi",
    receiverName: "Sara Al-Husseini",
    amount: 500.00,
    vatAmount: 0.00,
    netAmount: 500.00,
    platformMdrSar: 0.50,
    paymentMethod: "sarie_instant",
    channel: "consumer_p2p",
    status: "settled",
    sarieUtr: "SARIE2026091708911",
    timestamp: "2026-09-17T05:15:44Z"
  },
  {
    id: "tx_903",
    orderRef: "SAR-892102",
    senderName: "Customer (Apple Pay)",
    receiverName: "Al-Safwa Luxury Perfumes",
    amount: 1850.00,
    vatAmount: 277.50,
    netAmount: 1572.50,
    platformMdrSar: 22.20,
    paymentMethod: "apple_pay",
    channel: "pos_softpos",
    status: "settled",
    terminalId: "TRM-771209",
    madaRrn: "RRN-451298371920",
    cardLast4: "4119",
    timestamp: "2026-09-17T04:45:10Z"
  },
  {
    id: "tx_904",
    orderRef: "SAR-892101",
    senderName: "Customer (Visa)",
    receiverName: "Desert Horizon Car Rentals",
    amount: 4500.00,
    vatAmount: 675.00,
    netAmount: 3825.00,
    platformMdrSar: 78.75,
    paymentMethod: "visa",
    channel: "ecommerce_checkout",
    status: "flagged",
    riskFlagReason: "Rapid velocity threshold exceeded from foreign IP",
    timestamp: "2026-09-17T03:12:00Z"
  }
];

export const mockFeeTiers: CommissionFeeTier[] = [
  {
    id: "fee_mada",
    paymentMethod: "mada Debit (SAMA Switch)",
    ratePercentage: 0.80,
    fixedFeeSar: 0.00,
    capSar: 40.00,
    volumeTierMinSar: 0,
    lastUpdated: "2026-08-01"
  },
  {
    id: "fee_visa_mc",
    paymentMethod: "Visa / Mastercard Domestic",
    ratePercentage: 1.75,
    fixedFeeSar: 1.00,
    volumeTierMinSar: 0,
    lastUpdated: "2026-08-01"
  },
  {
    id: "fee_apple_pay",
    paymentMethod: "Apple Pay (mada / Scheme)",
    ratePercentage: 1.25,
    fixedFeeSar: 0.50,
    capSar: 50.00,
    volumeTierMinSar: 0,
    lastUpdated: "2026-08-01"
  },
  {
    id: "fee_sarie_instant",
    paymentMethod: "Sarie Instant P2P / B2B Transfer",
    ratePercentage: 0.10,
    fixedFeeSar: 0.50,
    capSar: 5.00,
    volumeTierMinSar: 0,
    lastUpdated: "2026-08-01"
  }
];

export const mockRiskAlerts: RiskAlert[] = [
  {
    id: "rsk_101",
    severity: "critical",
    type: "velocity_breach",
    title: "High Frequency POS Authorizations",
    description: "Terminal TRM-44912 generated 18 tap-to-pay requests in 120 seconds with identical amount SAR 99.00",
    entityType: "merchant",
    entityId: "mch_105",
    entityName: "Desert Horizon Car Rentals",
    status: "open",
    timestamp: "12 mins ago"
  },
  {
    id: "rsk_102",
    severity: "high",
    type: "sanction_match",
    title: "SAMA / Absher AML Watchlist Partial Match",
    description: "Account creation attempted with National ID matching elevated AML screening criteria",
    entityType: "user",
    entityId: "usr_205",
    entityName: "Rayan Bin Laden",
    status: "investigating",
    timestamp: "45 mins ago"
  }
];

export const mockInsightsData = {
  monthlyGrossVolume: "SAR 4,852,900",
  monthlyGrowthRate: "+24.8%",
  averageTicketSizeSar: 242.60,
  approvalRatePercentage: 99.82,
  averageLatencyMs: 18.4,
  totalPlatformMdrRevenueSar: 48529.00,
  railsBreakdown: [
    { name: "mada Debit", sharePercentage: 61.4, volumeSar: 2980000, txCount: 18450, color: "#10B981" },
    { name: "Apple Pay (NFC)", sharePercentage: 24.2, volumeSar: 1175000, txCount: 7200, color: "#38BDF8" },
    { name: "Visa / Mastercard", sharePercentage: 10.1, volumeSar: 490000, txCount: 1400, color: "#F59E0B" },
    { name: "Sarie Instant P2P", sharePercentage: 4.3, volumeSar: 207900, txCount: 920, color: "#A78BFA" }
  ],
  cityBreakdown: [
    { city: "Riyadh", volumeSar: 2840000, percentage: 58.5 },
    { city: "Jeddah", volumeSar: 1210000, percentage: 24.9 },
    { city: "Dammam / Khobar", volumeSar: 510000, percentage: 10.5 },
    { city: "Mecca & Medina", volumeSar: 292900, percentage: 6.1 }
  ],
  hourlyVelocity: [
    { hour: "08:00", tps: 45, volumeSar: 42000 },
    { hour: "10:00", tps: 110, volumeSar: 118000 },
    { hour: "12:00", tps: 142, volumeSar: 184500 },
    { hour: "14:00", tps: 98, volumeSar: 135000 },
    { hour: "16:00", tps: 125, volumeSar: 160000 },
    { hour: "18:00", tps: 178, volumeSar: 245000 },
    { hour: "20:00", tps: 195, volumeSar: 290000 },
    { hour: "22:00", tps: 140, volumeSar: 190000 }
  ]
};
