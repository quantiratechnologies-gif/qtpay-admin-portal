import type {
  AdminUser,
  Merchant,
  CustomerUser,
  PlatformTransaction,
  SettlementBatch,
  RiskAlert,
  CommissionFeeTier,
  SamaAuditLog
} from "../types";

export const currentAdminUser: AdminUser = {
  id: "adm_902183",
  name: "Eng. Abdulaziz Al-Qahtani",
  email: "a.qahtani@qtpay.sa",
  role: "superadmin",
  avatar: "AQ",
  lastLogin: "Today, 10:45 AM (Riyadh HQ)",
  ipAddress: "178.135.92.14"
};

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
    monthlyVolumeSar: 482500,
    joinedAt: "2026-05-12"
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
    monthlyVolumeSar: 890400,
    joinedAt: "2026-06-01"
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
    monthlyVolumeSar: 1250000,
    joinedAt: "2026-09-14"
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
    monthlyVolumeSar: 340000,
    joinedAt: "2026-09-10"
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
    monthlyVolumeSar: 95000,
    joinedAt: "2026-07-22"
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
    kycStatus: "verified",
    riskScore: 12,
    isFrozen: false,
    totalTransferredSar: 84300,
    joinedAt: "2026-01-15"
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
    kycStatus: "verified",
    riskScore: 8,
    isFrozen: false,
    totalTransferredSar: 41200,
    joinedAt: "2026-02-10"
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
    kycStatus: "pending",
    riskScore: 45,
    isFrozen: false,
    totalTransferredSar: 5600,
    joinedAt: "2026-09-12"
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
    kycStatus: "verified",
    riskScore: 15,
    isFrozen: false,
    totalTransferredSar: 198000,
    joinedAt: "2026-03-05"
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
    kycStatus: "rejected",
    riskScore: 92,
    isFrozen: true,
    totalTransferredSar: 450000,
    joinedAt: "2026-08-19"
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
  },
  {
    id: "rsk_103",
    severity: "medium",
    type: "unusual_amount",
    title: "Single Transfer Exceeds Retail Profile Average",
    description: "P2P Sarie transfer of SAR 45,000 initiated from standard Tier 1 retail wallet",
    entityType: "transaction",
    entityId: "tx_899",
    entityName: "Order SAR-889104",
    status: "resolved",
    timestamp: "2 hours ago"
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

export const mockSamaAuditLogs: SamaAuditLog[] = [
  {
    id: "aud_991",
    timestamp: "2026-09-17 10:42:15",
    adminName: "Eng. Abdulaziz Al-Qahtani",
    adminEmail: "a.qahtani@qtpay.sa",
    action: "DISPATCH_SETTLEMENT_BATCH",
    category: "SETTLEMENT_DISPATCH",
    targetEntity: "Batch SET-20260917-RJHI-01 (SAR 1,820,390)",
    details: "Dispatched direct settlement instructions to Al Rajhi Corporate Clearing API",
    ipAddress: "178.135.92.14",
    status: "SUCCESS"
  },
  {
    id: "aud_992",
    timestamp: "2026-09-17 09:15:30",
    adminName: "Mona Al-Shehri (Compliance Lead)",
    adminEmail: "m.shehri@qtpay.sa",
    action: "FREEZE_SUSPICIOUS_ACCOUNT",
    category: "ACCOUNT_FREEZE",
    targetEntity: "User usr_205 (Rayan Bin Laden)",
    details: "Applied emergency account freeze pursuant to SAMA AML guideline Rule 4B",
    ipAddress: "178.135.92.20",
    status: "SUCCESS"
  },
  {
    id: "aud_993",
    timestamp: "2026-09-17 08:30:00",
    adminName: "Faris Al-Harbi (Ops Specialist)",
    adminEmail: "f.harbi@qtpay.sa",
    action: "APPROVE_MERCHANT_KYB",
    category: "KYB_APPROVAL",
    targetEntity: "Merchant mch_101 (Quantira Gourmet Cafe)",
    details: "Verified Wathq CR 1010789234 and ZATCA VAT 310984729100003 successfully",
    ipAddress: "178.135.92.18",
    status: "SUCCESS"
  }
];
