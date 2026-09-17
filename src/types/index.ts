export type AdminRole = "superadmin" | "compliance_officer" | "settlement_manager" | "risk_analyst" | "support_lead";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar: string;
  lastLogin: string;
  ipAddress: string;
}

export interface Merchant {
  id: string;
  businessName: string;
  businessNameAr: string;
  crNumber: string;
  vatNumber: string;
  nationalId: string;
  category: string;
  ownerName: string;
  mobile: string;
  email: string;
  city: string;
  settlementBank: string;
  settlementIban: string;
  status: "active" | "pending_kyb" | "action_required" | "suspended" | "blacklisted";
  riskTier: "low" | "medium" | "high";
  activeTerminals: number;
  monthlyVolumeSar: number;
  joinedAt: string;
}

export interface CustomerUser {
  id: string;
  fullName: string;
  fullNameAr: string;
  nationalId: string;
  mobile: string;
  email: string;
  sarieUpiId: string;
  walletBalanceSar: number;
  kycStatus: "verified" | "pending" | "rejected";
  riskScore: number; // 0 - 100
  isFrozen: boolean;
  totalTransferredSar: number;
  joinedAt: string;
}

export interface PlatformTransaction {
  id: string;
  orderRef: string;
  senderName: string;
  receiverName: string;
  amount: number;
  vatAmount: number;
  netAmount: number;
  platformMdrSar: number;
  paymentMethod: "mada" | "visa" | "mastercard" | "apple_pay" | "sarie_instant";
  channel: "pos_softpos" | "qr_scan" | "consumer_p2p" | "ecommerce_checkout";
  status: "settled" | "processing" | "failed" | "refunded" | "flagged";
  terminalId?: string;
  sarieUtr?: string;
  madaRrn?: string;
  cardLast4?: string;
  timestamp: string;
  zatcaQrCode?: string;
  riskFlagReason?: string;
}

export interface SettlementBatch {
  id: string;
  batchRef: string;
  bankName: string;
  partnerBankCode: "RJHI" | "NCBK" | "RIBL" | "BSFR" | "ALBI";
  totalMerchants: number;
  totalGrossSar: number;
  totalMdrDeductionSar: number;
  totalNetDisbursedSar: number;
  status: "completed" | "processing" | "scheduled" | "failed";
  cutoffTime: string;
  executedAt?: string;
}

export interface RiskAlert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  type: "velocity_breach" | "unusual_amount" | "geo_mismatch" | "multiple_card_failures" | "sanction_match";
  title: string;
  description: string;
  entityType: "merchant" | "user" | "transaction";
  entityId: string;
  entityName: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  timestamp: string;
}

export interface CommissionFeeTier {
  id: string;
  paymentMethod: string;
  ratePercentage: number;
  fixedFeeSar: number;
  capSar?: number;
  volumeTierMinSar: number;
  volumeTierMaxSar?: number;
  lastUpdated: string;
}

export interface SamaAuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminEmail: string;
  action: string;
  category: "KYB_APPROVAL" | "SETTLEMENT_DISPATCH" | "ACCOUNT_FREEZE" | "FEE_OVERRIDE" | "REFUND_EXECUTION" | "AML_FLAG";
  targetEntity: string;
  details: string;
  ipAddress: string;
  status: "SUCCESS" | "FAILED" | "BLOCKED";
}
