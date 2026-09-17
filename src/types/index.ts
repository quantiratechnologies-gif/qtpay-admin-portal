export type AdminRole =
  | "superadmin"
  | "compliance_officer"
  | "settlement_manager"
  | "risk_analyst"
  | "support_lead";

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  category: "merchants" | "users" | "transactions" | "settlements" | "system";
  superadmin: boolean;
  compliance_officer: boolean;
  settlement_manager: boolean;
  risk_analyst: boolean;
  support_lead: boolean;
}

export interface RoleDefinition {
  id: AdminRole;
  title: string;
  titleAr: string;
  description: string;
  badgeColor: string;
  memberCount: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar: string;
  lastLogin: string;
  ipAddress: string;
  status: "active" | "suspended";
}

export interface SoftPosTerminal {
  id: string;
  terminalId: string;
  merchantId: string;
  model: string;
  osVersion: string;
  nfcStatus: "active" | "expired" | "pending_activation";
  lastHeartbeat: string;
  dailyVolumeSar: number;
  dailyTxCount: number;
  status: "online" | "offline" | "decommissioned";
}

export interface MerchantSettlementRecord {
  id: string;
  batchRef: string;
  bankName: string;
  grossAmountSar: number;
  mdrFeeSar: number;
  vatSar: number;
  netDisbursedSar: number;
  payoutDate: string;
  status: "completed" | "processing" | "held" | "failed";
  reconciliationRef: string;
}

export interface MerchantActivityLog {
  id: string;
  merchantId: string;
  timestamp: string;
  type: "terminal_pulse" | "pos_provision" | "settlement_hold" | "settlement_payout" | "kyb_update" | "rate_override";
  title: string;
  details: string;
  actor: string;
  severity?: "info" | "success" | "warning" | "error";
}

export interface UserDeviceSession {
  id: string;
  deviceName: string;
  model: string;
  osVersion: string;
  biometricsActive: boolean;
  appVersion: string;
  lastActive: string;
  ipAddress: string;
  city: string;
  isCurrentDevice: boolean;
}

export interface UserActivityLog {
  id: string;
  userId: string;
  timestamp: string;
  type: "login" | "transfer_out" | "transfer_in" | "pin_reset" | "limit_change" | "freeze" | "kyc_verify";
  title: string;
  details: string;
  actor: string;
  ipAddress?: string;
  severity?: "info" | "success" | "warning" | "error";
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
  address?: string;
  settlementBank: string;
  settlementIban: string;
  status: "active" | "pending_kyb" | "action_required" | "suspended" | "blacklisted";
  riskTier: "low" | "medium" | "high";
  activeTerminals: number;
  terminalIds?: string[];
  terminalsList?: SoftPosTerminal[];
  monthlyVolumeSar: number;
  joinedAt: string;
  settlementHold?: boolean;
  customMdrRate?: number;
  settlementRecords?: MerchantSettlementRecord[];
  activityLogs?: MerchantActivityLog[];
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
  dailyLimitSar: number;
  monthlyLimitSar?: number;
  kycStatus: "verified" | "pending" | "rejected";
  nafathVerifiedAt?: string;
  riskScore: number; // 0 - 100
  isFrozen: boolean;
  totalTransferredSar: number;
  totalReceivedSar?: number;
  joinedAt: string;
  registeredDevices?: UserDeviceSession[];
  activityLogs?: UserActivityLog[];
}

export interface PlatformTransaction {
  id: string;
  orderRef: string;
  merchantId?: string;
  userId?: string;
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
