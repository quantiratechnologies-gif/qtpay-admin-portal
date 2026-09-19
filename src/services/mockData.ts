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

export const mockSettlementBatches: SettlementBatch[] = [
  {
    id: "set_bat_01",
    batchRef: "SET-20260917-RJHI-01",
    bankName: "Al Rajhi Bank (Direct Integration)",
    partnerBankCode: "RJHI",
    totalMerchants: 48,
    totalGrossSar: 1842500.00,
    totalMdrDeductionSar: 22110.00,
    totalNetDisbursedSar: 1820390.00,
    status: "completed",
    cutoffTime: "Today 04:00 AM",
    executedAt: "Today 04:15 AM"
  },
  {
    id: "set_bat_02",
    batchRef: "SET-20260917-NCBK-01",
    bankName: "Saudi National Bank (SNB Sarie Core)",
    partnerBankCode: "NCBK",
    totalMerchants: 32,
    totalGrossSar: 1240800.00,
    totalMdrDeductionSar: 14889.60,
    totalNetDisbursedSar: 1225910.40,
    status: "completed",
    cutoffTime: "Today 04:00 AM",
    executedAt: "Today 04:18 AM"
  },
  {
    id: "set_bat_03",
    batchRef: "SET-20260917-RIBL-02",
    bankName: "Riyad Bank (Midday Batch)",
    partnerBankCode: "RIBL",
    totalMerchants: 19,
    totalGrossSar: 685400.00,
    totalMdrDeductionSar: 8224.80,
    totalNetDisbursedSar: 677175.20,
    status: "scheduled",
    cutoffTime: "Today 02:00 PM"
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
    category: "Food & Beverage (MCC 5812)",
    ownerName: "Fahad Al-Otaibi",
    mobile: "+966 50 123 4567",
    email: "ops@quantiracafe.sa",
    city: "Riyadh",
    address: "Olaya St, Al Wurud District, Building 402",
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
    terminalsList: [
      {
        id: "term_01",
        terminalId: "TRM-984210",
        merchantId: "mch_101",
        model: "iPhone 15 Pro (Apple SoftPOS)",
        osVersion: "iOS 18.2 (Kernel 24.1)",
        nfcStatus: "active",
        lastHeartbeat: "3 mins ago",
        dailyVolumeSar: 12450.00,
        dailyTxCount: 84,
        status: "online"
      },
      {
        id: "term_02",
        terminalId: "TRM-984211",
        merchantId: "mch_101",
        model: "Samsung Galaxy S24 (Android SoftPOS)",
        osVersion: "Android 15 (OneUI 7.0)",
        nfcStatus: "active",
        lastHeartbeat: "10 mins ago",
        dailyVolumeSar: 8900.00,
        dailyTxCount: 52,
        status: "online"
      },
      {
        id: "term_03",
        terminalId: "TRM-984212",
        merchantId: "mch_101",
        model: "PAX A920 Pro SmartPOS",
        osVersion: "PayDroid 10.0",
        nfcStatus: "active",
        lastHeartbeat: "1 hour ago",
        dailyVolumeSar: 4100.00,
        dailyTxCount: 28,
        status: "online"
      },
      {
        id: "term_04",
        terminalId: "TRM-984213",
        merchantId: "mch_101",
        model: "iPhone 14 (Drive-thru SoftPOS)",
        osVersion: "iOS 18.1",
        nfcStatus: "active",
        lastHeartbeat: "15 mins ago",
        dailyVolumeSar: 6200.00,
        dailyTxCount: 40,
        status: "online"
      }
    ],
    settlementRecords: [
      {
        id: "stl_01",
        batchRef: "SET-20260917-RJHI-01",
        bankName: "Al Rajhi Bank",
        grossAmountSar: 18450.00,
        mdrFeeSar: 138.38,
        vatSar: 20.76,
        netDisbursedSar: 18290.86,
        payoutDate: "Today, 04:15 AM",
        status: "completed",
        reconciliationRef: "RJH-TX-9981204"
      },
      {
        id: "stl_02",
        batchRef: "SET-20260916-RJHI-01",
        bankName: "Al Rajhi Bank",
        grossAmountSar: 16200.00,
        mdrFeeSar: 121.50,
        vatSar: 18.23,
        netDisbursedSar: 16060.27,
        payoutDate: "Yesterday, 04:15 AM",
        status: "completed",
        reconciliationRef: "RJH-TX-9978102"
      }
    ],
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
        title: "Settlement Dispatched (SAR 18,290.86)",
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
    category: "Luxury & Retail (MCC 5977)",
    ownerName: "Sultan Al-Ghamdi",
    mobile: "+966 55 987 6543",
    email: "sultan@alsafwa-perfumes.sa",
    city: "Jeddah",
    address: "Red Sea Mall, Ground Floor, Gate 3",
    settlementBank: "Saudi National Bank (SNB)",
    settlementIban: "SA12 1000 0012 9081 2345 6789",
    status: "active",
    riskTier: "low",
    activeTerminals: 2,
    terminalIds: ["TRM-771209", "TRM-771210"],
    monthlyVolumeSar: 890400,
    joinedAt: "2026-06-01",
    settlementHold: false,
    customMdrRate: 0.70,
    terminalsList: [
      {
        id: "term_05",
        terminalId: "TRM-771209",
        merchantId: "mch_102",
        model: "iPad Pro M4 + SoftPOS Reader",
        osVersion: "iPadOS 18.2",
        nfcStatus: "active",
        lastHeartbeat: "1 min ago",
        dailyVolumeSar: 34500.00,
        dailyTxCount: 22,
        status: "online"
      },
      {
        id: "term_06",
        terminalId: "TRM-771210",
        merchantId: "mch_102",
        model: "Android SmartPOS Sunmi V2s",
        osVersion: "Android 14",
        nfcStatus: "active",
        lastHeartbeat: "45 mins ago",
        dailyVolumeSar: 18200.00,
        dailyTxCount: 14,
        status: "online"
      }
    ],
    settlementRecords: [
      {
        id: "stl_03",
        batchRef: "SET-20260917-NCBK-01",
        bankName: "Saudi National Bank (SNB)",
        grossAmountSar: 42800.00,
        mdrFeeSar: 299.60,
        vatSar: 44.94,
        netDisbursedSar: 42455.46,
        payoutDate: "Today, 04:18 AM",
        status: "completed",
        reconciliationRef: "SNB-TX-440918"
      }
    ],
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
    category: "Groceries & Supermarket (MCC 5411)",
    ownerName: "Khalid Al-Dossary",
    mobile: "+966 54 321 0987",
    email: "khalid@najd-organics.sa",
    city: "Riyadh",
    address: "Al Nakheel, Prince Turki I Rd",
    settlementBank: "Riyad Bank",
    settlementIban: "SA20 2000 0003 4567 8901 2345",
    status: "pending_kyb",
    riskTier: "medium",
    activeTerminals: 6,
    terminalIds: ["TRM-662101", "TRM-662102", "TRM-662103", "TRM-662104", "TRM-662105", "TRM-662106"],
    monthlyVolumeSar: 1250000,
    joinedAt: "2026-09-14",
    settlementHold: true,
    terminalsList: [],
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
    category: "Electronics (MCC 5732)",
    ownerName: "Tariq Al-Shehri",
    mobile: "+966 56 789 0123",
    email: "contact@riyadhtech.sa",
    city: "Riyadh",
    address: "King Fahd Rd, Al Murabba",
    settlementBank: "Banque Saudi Fransi",
    settlementIban: "SA55 5500 0004 5678 9012 3456",
    status: "action_required",
    riskTier: "medium",
    activeTerminals: 1,
    terminalIds: ["TRM-551901"],
    monthlyVolumeSar: 340000,
    joinedAt: "2026-09-10",
    settlementHold: false,
    terminalsList: [],
    activityLogs: []
  },
  {
    id: "mch_105",
    businessName: "Desert Horizon Car Rentals",
    businessNameAr: "تأجير أفق الصحراء للسيارات",
    crNumber: "1010998877",
    vatNumber: "310998877600003",
    nationalId: "1034567890",
    category: "Automotive & Travel (MCC 7512)",
    ownerName: "Mansour Al-Mutairi",
    mobile: "+966 59 112 2334",
    email: "mansour@deserthorizon.sa",
    city: "Dammam",
    address: "King Khalid St, Al Hussam",
    settlementBank: "Alinma Bank",
    settlementIban: "SA05 0500 0001 2345 6789 0123",
    status: "suspended",
    riskTier: "high",
    activeTerminals: 0,
    terminalIds: [],
    monthlyVolumeSar: 95000,
    joinedAt: "2026-07-22",
    settlementHold: true,
    terminalsList: [],
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
    monthlyLimitSar: 100000.00,
    kycStatus: "verified",
    nafathVerifiedAt: "2026-01-15 (Nafath National SSO)",
    riskScore: 12,
    isFrozen: false,
    totalTransferredSar: 84300,
    totalReceivedSar: 96750,
    joinedAt: "2026-01-15",
    registeredDevices: [
      {
        id: "dev_01",
        deviceName: "Fahad's iPhone 16 Pro",
        model: "iPhone 16 Pro (A3294)",
        osVersion: "iOS 18.3",
        biometricsActive: true,
        appVersion: "v2.4.1 (Build 890)",
        lastActive: "12 mins ago",
        ipAddress: "178.135.12.8",
        city: "Riyadh, Saudi Arabia",
        isCurrentDevice: true
      },
      {
        id: "dev_02",
        deviceName: "Fahad iPad Mini",
        model: "iPad Mini 7",
        osVersion: "iPadOS 18.2",
        biometricsActive: true,
        appVersion: "v2.3.9",
        lastActive: "3 days ago",
        ipAddress: "178.135.12.8",
        city: "Riyadh, Saudi Arabia",
        isCurrentDevice: false
      }
    ],
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
    monthlyLimitSar: 80000.00,
    kycStatus: "verified",
    nafathVerifiedAt: "2026-02-10 (Nafath National SSO)",
    riskScore: 8,
    isFrozen: false,
    totalTransferredSar: 41200,
    totalReceivedSar: 46090,
    joinedAt: "2026-02-10",
    registeredDevices: [
      {
        id: "dev_03",
        deviceName: "Sara's iPhone 15",
        model: "iPhone 15 (A3090)",
        osVersion: "iOS 18.2",
        biometricsActive: true,
        appVersion: "v2.4.1",
        lastActive: "Just Now",
        ipAddress: "82.178.44.19",
        city: "Jeddah, Saudi Arabia",
        isCurrentDevice: true
      }
    ],
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
    registeredDevices: [],
    activityLogs: []
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
    registeredDevices: [],
    activityLogs: []
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
    registeredDevices: [],
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
    merchantId: "mch_101",
    userId: "usr_201",
    senderName: "Fahad Al-Harbi (mada)",
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
    userId: "usr_201",
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
    merchantId: "mch_102",
    userId: "usr_204",
    senderName: "Noura Al-Sudairy (Apple Pay)",
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
    merchantId: "mch_105",
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
  },
  {
    id: "tx_905",
    orderRef: "SAR-892100",
    merchantId: "mch_101",
    senderName: "Guest (Apple Pay)",
    receiverName: "Quantira Gourmet Cafe",
    amount: 68.00,
    vatAmount: 10.20,
    netAmount: 57.80,
    platformMdrSar: 0.85,
    paymentMethod: "apple_pay",
    channel: "pos_softpos",
    status: "settled",
    terminalId: "TRM-984210",
    madaRrn: "RRN-887102948102",
    cardLast4: "3019",
    timestamp: "2026-09-17T02:50:00Z"
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

export const mockAdminTeamMembers: AdminUser[] = [
  {
    id: "usr_admin_01",
    name: "Tariq Al-Harbi",
    email: "admin@qtpay.sa",
    role: "superadmin",
    avatar: "TA",
    lastLogin: "Today, 10:45 AM (Riyadh HQ)",
    ipAddress: "10.14.22.8",
    status: "active"
  },
  {
    id: "usr_admin_02",
    name: "Noura Al-Otaibi",
    email: "noura@qtpay.sa",
    role: "compliance_officer",
    avatar: "NO",
    lastLogin: "Today, 09:12 AM",
    ipAddress: "10.14.22.15",
    status: "active"
  },
  {
    id: "usr_admin_03",
    name: "Faisal Bin Saud",
    email: "faisal@qtpay.sa",
    role: "settlement_manager",
    avatar: "FS",
    lastLogin: "Yesterday, 04:30 PM",
    ipAddress: "10.14.22.20",
    status: "active"
  },
  {
    id: "usr_admin_04",
    name: "Sara Al-Dosari",
    email: "sara@qtpay.sa",
    role: "risk_analyst",
    avatar: "SD",
    lastLogin: "Yesterday, 02:15 PM",
    ipAddress: "10.14.22.31",
    status: "active"
  }
];

export const mockAdminPermissions: AdminPermission[] = [
  {
    id: "perm_merchants_manage",
    name: "Merchant Onboarding & KYB Approval",
    description: "Approve commercial registries, SoftPOS allocations, and tariff overrides",
    category: "merchants",
    superadmin: true,
    compliance_officer: true,
    settlement_manager: false,
    risk_analyst: false,
    support_lead: false
  },
  {
    id: "perm_settlement_dispatch",
    name: "Bank Settlement Clearing Execution",
    description: "Authorize and dispatch T+0 daily disbursements to partner bank IBANs",
    category: "settlements",
    superadmin: true,
    compliance_officer: false,
    settlement_manager: true,
    risk_analyst: false,
    support_lead: false
  },
  {
    id: "perm_refund_execute",
    name: "Dispute & Direct Transaction Refunds",
    description: "Execute card chargebacks and reversals directly back to cardholder",
    category: "transactions",
    superadmin: true,
    compliance_officer: false,
    settlement_manager: true,
    risk_analyst: true,
    support_lead: false
  },
  {
    id: "perm_account_freeze",
    name: "Account Suspension & Asset Freezing",
    description: "Enforce immediate SAR withdrawal holds on flagged accounts",
    category: "users",
    superadmin: true,
    compliance_officer: true,
    settlement_manager: false,
    risk_analyst: true,
    support_lead: false
  },
  {
    id: "perm_fee_tariff_edit",
    name: "MDR Fee & Tariff Matrix Overrides",
    description: "Modify scheme interchange rates, fixed fees, and merchant caps",
    category: "system",
    superadmin: true,
    compliance_officer: false,
    settlement_manager: true,
    risk_analyst: false,
    support_lead: false
  }
];

export const mockSamaAuditLogs: SamaAuditLog[] = [
  {
    id: "aud_01",
    timestamp: "2026-09-17 11:45:10",
    adminName: "Tariq Al-Harbi",
    adminEmail: "admin@qtpay.sa",
    action: "FEE_OVERRIDE",
    category: "FEE_OVERRIDE",
    targetEntity: "Tamimi Supermarkets (mch_101)",
    details: "Adjusted custom mada MDR rate from 0.80% to 0.65%",
    ipAddress: "10.14.22.8",
    status: "SUCCESS"
  },
  {
    id: "aud_02",
    timestamp: "2026-09-17 10:15:22",
    adminName: "Noura Al-Otaibi",
    adminEmail: "noura@qtpay.sa",
    action: "KYB_APPROVAL",
    category: "KYB_APPROVAL",
    targetEntity: "Al-Safwa Luxury Perfumes (mch_102)",
    details: "Commercial Registry 1010923841 verified via Wathq API",
    ipAddress: "10.14.22.15",
    status: "SUCCESS"
  },
  {
    id: "aud_03",
    timestamp: "2026-09-17 04:15:00",
    adminName: "Faisal Bin Saud",
    adminEmail: "faisal@qtpay.sa",
    action: "SETTLEMENT_DISPATCH",
    category: "SETTLEMENT_DISPATCH",
    targetEntity: "Al Rajhi Clearing Batch (SET-20260917-RJHI-01)",
    details: "Dispatched SAR 3,046,300.40 to 80 merchant IBANs",
    ipAddress: "10.14.22.20",
    status: "SUCCESS"
  },
  {
    id: "aud_04",
    timestamp: "2026-09-16 18:30:11",
    adminName: "Sara Al-Dosari",
    adminEmail: "sara@qtpay.sa",
    action: "AML_FLAG",
    category: "AML_FLAG",
    targetEntity: "Terminal TRM-44912 (mch_105)",
    details: "Suspicious velocity breach resolved after merchant identity confirmation",
    ipAddress: "10.14.22.31",
    status: "SUCCESS"
  }
];

