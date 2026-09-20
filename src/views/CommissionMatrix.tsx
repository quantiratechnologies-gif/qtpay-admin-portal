import React, { useState } from "react";
import {
  Percent,
  CheckCircle2,
  Settings2,
  Landmark,
  ShieldAlert,
  Send,
  Server,
  AlertTriangle,
  ShieldCheck,
  Users,
  UserCheck,
  User,
  Mail,
  Phone,
  FileText,
  KeyRound,
  Download,
  Sliders,
  Bell,
  RefreshCw,
  Lock,
  Eye,
  Check,
  X,
  SmartphoneNfc,
  CreditCard,
  Zap,
  Globe
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { StatusBadge } from "../components/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "../components/ui/table";
import {
  mockSettlementBatches,
  mockRiskAlerts,
  mockAdminTeamMembers,
  mockAdminPermissions,
  mockSamaAuditLogs
} from "../services/mockData";
import { useTranslation } from "../lib/i18n/LanguageContext";
import { exportCsv } from "../lib/exportCsv";
import type { CommissionFeeTier, SettlementBatch, RiskAlert, AdminUser, AdminPermission, AdminRole, SamaAuditLog } from "../types";

interface CommissionMatrixProps {
  feeTiers: CommissionFeeTier[];
  onUpdateFee: (id: string, newRate: number, newFixed: number) => void;
  lang?: "en" | "ar";
}

export type SettingsSection = "rates" | "profile" | "settlements" | "risk" | "audit" | "gateways" | "security";

export const CommissionMatrix: React.FC<CommissionMatrixProps> = ({
  feeTiers,
  onUpdateFee
}) => {
  const { isAr, t, formatCurrency, formatNumber, formatPercent, formatDate } = useTranslation();
  const [activeSection, setActiveSection] = useState<SettingsSection>("rates");
  
  // MDR Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rateInput, setRateInput] = useState<number>(0);
  const [fixedInput, setFixedInput] = useState<number>(0);

  // Settlement, Risk, and Staff states
  const [batches, setBatches] = useState<SettlementBatch[]>(mockSettlementBatches);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>(mockRiskAlerts);
  const [permissions, setPermissions] = useState<AdminPermission[]>(mockAdminPermissions);
  const [auditLogs, setAuditLogs] = useState<SamaAuditLog[]>(mockSamaAuditLogs);
  const [isProcessingBatch, setIsProcessingBatch] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Admin Profile state
  const [adminName, setAdminName] = useState("Eng. Abdulaziz Al-Qahtani");
  const [adminEmail, setAdminEmail] = useState("a.alqahtani@qtpay.sa");
  const [adminPhone, setAdminPhone] = useState("+966 50 123 4567");
  const [adminRole, setAdminRole] = useState("Super Admin");
  const [adminDept, setAdminDept] = useState("Central Payments & Operations");
  const [adminId, setAdminId] = useState("ADM-88402-SA");
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Security & Preferences state
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [twoFactorEnforced, setTwoFactorEnforced] = useState(true);
  const [autoSettleTime, setAutoSettleTime] = useState("23:00");
  const [notificationEmail, setNotificationEmail] = useState("ops-alerts@qtpay.sa");

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const DEMO_CURRENT_PASSWORD = "admin123";

  const validatePasswordChange = (): string | null => {
    if (!currPass && !newPass && !confirmPass) return null; // profile-only save

    if (!currPass) return isAr ? "يرجى إدخال كلمة المرور الحالية" : "Current password is required";
    if (currPass !== DEMO_CURRENT_PASSWORD)
      return isAr ? "كلمة المرور الحالية غير صحيحة" : "Current password is incorrect";
    if (newPass === currPass)
      return isAr ? "يجب أن تختلف كلمة المرور الجديدة عن الحالية" : "New password must be different from your current password";
    if (newPass.length < 12)
      return isAr ? "يجب أن تكون كلمة المرور 12 خانة على الأقل" : "Password must be at least 12 characters";
    if (!/[A-Z]/.test(newPass)) return isAr ? "يجب أن تحتوي على حرف كبير" : "Must include an uppercase letter";
    if (!/[a-z]/.test(newPass)) return isAr ? "يجب أن تحتوي على حرف صغير" : "Must include a lowercase letter";
    if (!/[0-9]/.test(newPass)) return isAr ? "يجب أن تحتوي على رقم" : "Must include a number";
    if (!/[^A-Za-z0-9]/.test(newPass)) return isAr ? "يجب أن تحتوي على رمز خاص" : "Must include a special character";
    if (newPass !== confirmPass)
      return isAr ? "كلمة المرور الجديدة وتأكيدها غير متطابقين" : "New password and confirmation do not match";
    return null;
  };

  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validatePasswordChange();
    if (err) {
      showNotice(err);
      return;
    }

    const changed = !!newPass;
    setCurrPass("");
    setNewPass("");
    setConfirmPass("");

    if (changed) {
      setAuditLogs((prev) => [
        {
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
          adminName,
          adminEmail,
          action: "PASSWORD_CHANGED",
          category: "FEE_OVERRIDE",
          targetEntity: `${adminName} (${adminId})`,
          details: "Administrative password rotated. All other sessions invalidated.",
          ipAddress: "10.14.22.8",
          status: "SUCCESS"
        },
        ...prev
      ]);
    }

    showNotice(
      changed
        ? (isAr ? "تم تحديث كلمة المرور بنجاح وتسجيل العملية في سجل ساما" : "Password updated successfully and recorded in SAMA audit trail")
        : (isAr ? "تم تحديث الملف الشخصي وتفضيلات الحساب الإداري بنجاح" : "Admin profile and account settings saved successfully")
    );
  };

  const startEdit = (tier: CommissionFeeTier) => {
    setEditingId(tier.id);
    setRateInput(tier.ratePercentage);
    setFixedInput(tier.fixedFeeSar);
  };

  const saveEdit = (id: string) => {
    onUpdateFee(id, rateInput, fixedInput);
    setEditingId(null);
    showNotice(
      isAr
        ? "تم تحديث نسب شرائح الرسوم وتطبيقها على جميع قنوات الدفع النشطة بنجاح"
        : "Fee tier rates updated across active payment rails successfully"
    );
  };

  const handleDispatchBatch = (batchId: string) => {
    setIsProcessingBatch(batchId);
    setTimeout(() => {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === batchId
            ? { ...b, status: "completed", executedAt: isAr ? "الآن (عبر مقسم ساما)" : "Just Now (SAMA Core API)" }
            : b
        )
      );
      setIsProcessingBatch(null);
      showNotice(
        isAr
          ? "تم إرسال دفعة التسوية المصرفية بنجاح إلى واجهة المقاصة للبنك الشريك"
          : "Settlement batch dispatched successfully to partner bank clearing API"
      );
    }, 1000);
  };

  const handleResolveAlert = (alertId: string) => {
    setRiskAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: "resolved" } : a))
    );
    showNotice(
      isAr
        ? "تمت مراجعة تنبيه المخاطر والتأشير بالحل والامتثال الكامل"
        : "Risk alert investigated and marked resolved"
    );
  };

  const handleTogglePermission = (permId: string, role: AdminRole) => {
    if (role === "superadmin") return;
    setPermissions((prev) =>
      prev.map((p) => (p.id === permId ? { ...p, [role]: !p[role] } : p))
    );
    showNotice(isAr ? "تم تحديث مصفوفة الصلاحيات" : "Permissions matrix updated");
  };

  const handleSaveSecurityConfig = (e: React.FormEvent) => {
    e.preventDefault();
    showNotice(
      isAr
        ? "تم حفظ تفضيلات الأمان وإعدادات الجلسات بنجاح"
        : "Security preferences and session timeouts saved successfully"
    );
  };

  const getTierPaymentMethodName = (tier: CommissionFeeTier) => {
    if (!isAr) return tier.paymentMethod;
    if (tier.id.includes("mada")) return "بطاقات مدى (مقسم ساما المركزي)";
    if (tier.id.includes("visa")) return "فيزا وماستركارد (البطاقات الائتمانية المحلية)";
    if (tier.id.includes("apple")) return "أبل باي (Apple Pay - مدى والشبكات)";
    if (tier.id.includes("sarie")) return "سريع للتحويل الفوري (بين الأفراد والشركات)";
    return tier.paymentMethod;
  };

  const getBankDisplayName = (bankName: string) => {
    if (!isAr) return bankName;
    if (bankName.includes("Rajhi")) return "مصرف الراجحي (ربط مباشر)";
    if (bankName.includes("SNB") || bankName.includes("National")) return "البنك الأهلي السعودي (مقسم سريع)";
    if (bankName.includes("Riyad")) return "بنك الرياض (دفعة منتصف اليوم)";
    return bankName;
  };

  const getAlertSeverityLabel = (severity: string) => {
    if (!isAr) return severity.toUpperCase();
    switch (severity) {
      case "critical":
        return "حرج جداً";
      case "high":
        return "مرتفع";
      case "medium":
        return "متوسط";
      case "low":
        return "منخفض";
      default:
        return severity;
    }
  };

  const getAlertTitle = (alert: RiskAlert) => {
    if (!isAr) return alert.title;
    if (alert.id === "rsk_101") return "تكرار سريع لعمليات نقاط البيع (اشتباه تدوير)";
    if (alert.id === "rsk_102") return "مطابقة جزئية في قائمة حظر ومكافحة غسل الأموال";
    return alert.title;
  };

  const getAlertDescription = (alert: RiskAlert) => {
    if (!isAr) return alert.description;
    if (alert.id === "rsk_101")
      return "تم رصد 18 محاولة دفع متتالية خلال 120 ثانية بنفس المبلغ (99.00 ر.س) على الجهاز TRM-44912";
    if (alert.id === "rsk_102")
      return "محاولة إنشاء حساب بهوية وطنية مطابقة لمعايير الفحص والاشتباه الصادرة عن البنك المركزي";
    return alert.description;
  };

  const navTabs: { id: SettingsSection; labelEn: string; labelAr: string; icon: any }[] = [
    { id: "rates", labelEn: "MDR Rates", labelAr: "عمولات الدفع", icon: Percent },
    { id: "profile", labelEn: "Admin Profile", labelAr: "الملف الشخصي", icon: UserCheck },
    { id: "settlements", labelEn: "Settlements", labelAr: "محرك التسويات", icon: Landmark },
    { id: "risk", labelEn: "Risk & AML", labelAr: "المخاطر والحدود", icon: ShieldAlert },
    { id: "audit", labelEn: "SAMA Logs", labelAr: "سجلات الرقابة", icon: FileText },
    { id: "gateways", labelEn: "Gateways", labelAr: "بوابات الربط", icon: Server },
    { id: "security", labelEn: "Security & System", labelAr: "أمان النظام", icon: KeyRound },
  ];

  return (
    <div className="space-y-4">
      {/* Settings Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#7FE87F]/10 border border-[#7FE87F]/30 text-[#7FE87F] shadow-sm shadow-[#7FE87F]/20">
            <Settings2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                {t("settings.pageTitle")}
              </h2>
              <Badge variant="primary" className="text-[10px] uppercase font-bold shadow-sm shadow-[#7FE87F]/20">
                {isAr ? "لوحة الإدارة الشاملة" : "Central Admin Suite"}
              </Badge>
            </div>
            <p className="text-xs text-[#A2A2BA] mt-0.5">
              {t("settings.pageSubtitle")}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="inline-flex rounded-xl bg-[#111726] p-1 border border-[#2C2C44] flex-wrap gap-1 shadow-md">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#7FE87F] via-[#6FD86F] to-[#5FBF5F] text-[#080C14] shadow-md shadow-[#7FE87F]/25 font-black"
                    : "text-[#A2A2BA] hover:text-white hover:bg-[#182236]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-[#7FE87F]/15 border border-[#7FE87F]/40 rounded-xl text-[#7FE87F] text-xs font-bold flex items-center gap-2.5 shadow-md shadow-[#7FE87F]/10 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-[#7FE87F]" />
          <span>{notice}</span>
        </div>
      )}

      {/* SECTION 1: MDR Commission Rates */}
      {activeSection === "rates" && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#7FE87F]/10 text-[#7FE87F] border border-[#7FE87F]/20">
                <Percent className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? "مصفوفة عمولات الدفع (MDR)" : "MDR Tariff Matrix"}
                </h3>
                <p className="text-[11px] text-[#A2A2BA]">
                  {isAr ? "نسب الرسوم وسقوف الاستقطاع لكل وسيلة دفع" : "Scheme fee rates, fixed tariffs and deduction caps"}
                </p>
              </div>
            </div>
            <Badge variant="primary" className="text-[10px] font-bold">
              {isAr ? "محدث ومفعل" : "ACTIVE TARIFFS"}
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isAr ? "طريقة الدفع" : "Payment Rail"}</TableHead>
                <TableHead>{isAr ? "النسبة (%)" : "Rate (%)"}</TableHead>
                <TableHead>{isAr ? "الرسم الثابت" : "Fixed (SAR)"}</TableHead>
                <TableHead>{isAr ? "الحد الأقصى" : "Cap (SAR)"}</TableHead>
                <TableHead>{isAr ? "الإجراء" : "Action"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeTiers.map((tier) => {
                const isEditing = editingId === tier.id;
                return (
                  <TableRow key={tier.id}>
                    <TableCell>
                      <div className="font-bold text-white text-xs">{getTierPaymentMethodName(tier)}</div>
                      <div className="text-[10px] text-[#A2A2BA]">
                        {isAr ? `آخر تحديث: ${tier.lastUpdated}` : `Updated: ${tier.lastUpdated}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.05"
                          value={rateInput}
                          onChange={(e) => setRateInput(parseFloat(e.target.value))}
                          className="w-20 h-7 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F]"
                        />
                      ) : (
                        <span className="font-extrabold text-[#7FE87F] text-xs tabular-nums">
                          {formatPercent(tier.ratePercentage)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.10"
                          value={fixedInput}
                          onChange={(e) => setFixedInput(parseFloat(e.target.value))}
                          className="w-20 h-7 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F]"
                        />
                      ) : (
                        <span className="font-semibold text-xs text-neutral-200 tabular-nums">
                          {formatCurrency(tier.fixedFeeSar)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-neutral-300 text-xs tabular-nums font-medium">
                        {tier.capSar ? formatCurrency(tier.capSar) : (isAr ? "بدون سقف" : "None (No Cap)")}
                      </span>
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => saveEdit(tier.id)}
                          className="h-7 px-3 text-xs gap-1.5 font-bold btn-primary-shine"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{isAr ? "حفظ" : "Save"}</span>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(tier)}
                          className="h-7 px-3 text-xs bg-[#111726] hover:bg-[#182236] gap-1.5 border-[#2C2C44] hover:border-[#7FE87F]/50 text-neutral-200 hover:text-[#7FE87F] cursor-pointer"
                        >
                          <Settings2 className="h-3.5 w-3.5 text-[#7FE87F]" />
                          <span>{isAr ? "تعديل" : "Edit"}</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* SECTION 2: Admin Profile & Account Management */}
      {activeSection === "profile" && (
        <div className="space-y-4">
          <Card className="p-5 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#7FE87F]/10 text-[#7FE87F] border border-[#7FE87F]/25">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isAr ? "الملف الشخصي للمسؤول الإداري" : "Admin Profile & Personal Settings"}
                  </h3>
                  <p className="text-[11px] text-[#A2A2BA]">
                    {isAr ? "إدارة معلومات الحساب الإداري وكلمة المرور والتفضيلات" : "Manage administrative identity, contact info, security credentials & preferences"}
                  </p>
                </div>
              </div>
              <Badge variant="primary" className="text-[10px] font-bold shadow-sm shadow-[#7FE87F]/20">
                {adminRole.toUpperCase()}
              </Badge>
            </div>

            {/* Profile Overview Strip */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#182236] via-[#111726] to-[#182236] border border-[#7FE87F]/30 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7FE87F] to-[#5FBF5F] text-[#080C14] font-black flex items-center justify-center text-lg shadow-lg shadow-[#7FE87F]/20">
                  AQ
                </div>
                <div>
                  <div className="text-sm font-black text-white flex items-center gap-2">
                    <span>{adminName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7FE87F]/15 text-[#7FE87F] font-bold border border-[#7FE87F]/30">
                      {isAr ? "حساب موثوق" : "Verified SAMA Admin"}
                    </span>
                  </div>
                  <div className="text-xs text-[#A2A2BA] mt-0.5 flex items-center gap-3">
                    <span>{adminEmail}</span>
                    <span>•</span>
                    <span className="font-mono text-[#7FE87F]">{adminId}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-[#111726] border border-[#2C2C44] text-[#A2A2BA]">
                  {isAr ? "القسم: " : "Dept: "}<strong className="text-white font-semibold">{adminDept}</strong>
                </span>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveAdminProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A2A2BA] block flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-[#7FE87F]" />
                    <span>{isAr ? "الاسم الكامل للمسؤول" : "Full Name"}</span>
                  </label>
                  <Input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="h-9 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A2A2BA] block flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-[#7FE87F]" />
                    <span>{isAr ? "البريد الإلكتروني" : "Email Address"}</span>
                  </label>
                  <Input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="h-9 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A2A2BA] block flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[#7FE87F]" />
                    <span>{isAr ? "رقم الجوال (المعتمد)" : "Mobile Phone"}</span>
                  </label>
                  <Input
                    type="text"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="h-9 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A2A2BA] block flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-[#7FE87F]" />
                    <span>{isAr ? "القسم / الإدارة" : "Department"}</span>
                  </label>
                  <Input
                    type="text"
                    value={adminDept}
                    onChange={(e) => setAdminDept(e.target.value)}
                    className="h-9 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F]"
                  />
                </div>
              </div>

              {/* Password Change Card */}
              <div className="p-4 rounded-xl bg-[#111726] border border-[#2C2C44] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-[#2C2C44] pb-2">
                  <KeyRound className="h-4 w-4 text-[#7FE87F]" />
                  <span>{isAr ? "تغيير كلمة المرور الإدارية" : "Change Password"}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#A2A2BA] block">
                      {isAr ? "كلمة المرور الحالية" : "Current Password"}
                    </label>
                    <Input
                      type="password"
                      placeholder={isAr ? "أدخل كلمة المرور الحالية" : "Enter current password"}
                      value={currPass}
                      onChange={(e) => setCurrPass(e.target.value)}
                      className="h-8 text-xs bg-[#182236] border-[#2C2C44] focus:border-[#7FE87F]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[#A2A2BA] block">
                      {isAr ? "كلمة المرور الجديدة" : "New Password"}
                    </label>
                    <Input
                      type="password"
                      placeholder={isAr ? "12 خانة على الأقل" : "At least 12 characters"}
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="h-8 text-xs bg-[#182236] border-[#2C2C44] focus:border-[#7FE87F]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[#A2A2BA] block">
                      {isAr ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}
                    </label>
                    <Input
                      type="password"
                      placeholder={isAr ? "أعد إدخال كلمة المرور الجديدة" : "Re-enter new password"}
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="h-8 text-xs bg-[#182236] border-[#2C2C44] focus:border-[#7FE87F]"
                    />
                  </div>
                </div>

                {/* Live Password Rules Checklist */}
                {newPass.length > 0 && (
                  <div className="pt-2 border-t border-[#2C2C44]/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[11px]">
                    {[
                      {
                        label: isAr ? "12 خانة على الأقل" : "At least 12 characters",
                        valid: newPass.length >= 12
                      },
                      {
                        label: isAr ? "حرف كبير (A-Z)" : "Uppercase letter (A-Z)",
                        valid: /[A-Z]/.test(newPass)
                      },
                      {
                        label: isAr ? "حرف صغير (a-z)" : "Lowercase letter (a-z)",
                        valid: /[a-z]/.test(newPass)
                      },
                      {
                        label: isAr ? "رقم واحد على الأقل (0-9)" : "At least one number (0-9)",
                        valid: /[0-9]/.test(newPass)
                      },
                      {
                        label: isAr ? "رمز خاص (!@#$%^&*)" : "Special character (!@#$)",
                        valid: /[^A-Za-z0-9]/.test(newPass)
                      },
                      {
                        label: isAr ? "تطابق كلمة المرور" : "Passwords match",
                        valid: !!confirmPass && newPass === confirmPass
                      }
                    ].map((rule, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-1.5 transition-colors ${
                          rule.valid ? "text-[#7FE87F]" : "text-[#6E6E85]"
                        }`}
                      >
                        {rule.valid ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#7FE87F] shrink-0" />
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-[#6E6E85] shrink-0" />
                        )}
                        <span>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  className="h-9 px-6 text-xs font-extrabold btn-primary-shine shadow-lg shadow-[#7FE87F]/25 cursor-pointer"
                >
                  {isAr ? "حفظ التغييرات والملف الشخصي" : "Save Profile & Update Settings"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* SECTION 3: Bank Settlements & Escrow Engine */}
      {activeSection === "settlements" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="p-4 space-y-1">
              <span className="text-[11px] text-[#A2A2BA] font-medium">
                {isAr ? "رصيد حساب الضمان (Escrow)" : "Escrow Balance"}
              </span>
              <div className="text-xl font-black text-[#7FE87F] text-glow-primary tabular-nums">
                {formatCurrency(14890250)}
              </div>
              <span className="text-[10px] text-[#7FE87F] font-medium flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-[#7FE87F]" />
                {isAr ? "محمي بالكامل لدى البنك المركزي (ساما)" : "Fully Backed in Central Bank"}
              </span>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-[11px] text-[#A2A2BA] font-medium">
                {isAr ? "تسويات اليوم المجدولة" : "Today's Scheduled Payouts"}
              </span>
              <div className="text-xl font-black text-white tabular-nums">
                {formatCurrency(3046300.40)}
              </div>
              <span className="text-[10px] text-[#A2A2BA]">
                {isAr ? "80 تاجراً مستحقاً" : "80 Merchants eligible"}
              </span>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-[11px] text-[#A2A2BA] font-medium">
                {isAr ? "احتياطي المخاطر (5%)" : "Risk Reserve Buffer (5%)"}
              </span>
              <div className="text-xl font-black text-[#7FE87F] tabular-nums">
                {formatCurrency(744512.50)}
              </div>
              <span className="text-[10px] text-[#A2A2BA]">
                {isAr ? "تغطية النزاعات والمستردات" : "Dispute & chargeback buffer"}
              </span>
            </Card>
          </div>

          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#7FE87F]/10 text-[#7FE87F] border border-[#7FE87F]/20">
                  <Landmark className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isAr ? "دفعات التسوية المصرفية المركزية" : "Bank Settlement Batches"}
                  </h3>
                  <p className="text-[11px] text-[#A2A2BA]">
                    {isAr ? "دفعات المقاصة اليومية للبنوك الشريكة" : "Daily clearing batches for partner banks"}
                  </p>
                </div>
              </div>
              <Badge variant="primary" className="text-xs font-bold">
                {isAr ? "تسوية T+0 فورية" : "T+0 Clearing"}
              </Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isAr ? "رقم الدفعة والإغلاق" : "Batch Ref & Cutoff"}</TableHead>
                  <TableHead>{isAr ? "البنك الشريك" : "Partner Bank"}</TableHead>
                  <TableHead>{isAr ? "عدد التجار" : "Merchants"}</TableHead>
                  <TableHead>{isAr ? "المبلغ الإجمالي" : "Gross Volume"}</TableHead>
                  <TableHead>{isAr ? "اقتطاع المنصة" : "MDR Take"}</TableHead>
                  <TableHead>{isAr ? "صافي المحول" : "Net Disbursed"}</TableHead>
                  <TableHead>{isAr ? "الحالة" : "Status"}</TableHead>
                  <TableHead>{isAr ? "الإجراء" : "Action"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div className="font-semibold text-[#7FE87F] text-xs font-mono">{b.batchRef}</div>
                      <div className="text-[10px] text-[#A2A2BA]">
                        {isAr ? `الإغلاق: ${b.cutoffTime}` : `Cutoff: ${b.cutoffTime}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-white text-xs">{getBankDisplayName(b.bankName)}</div>
                      <div className="text-[10px] text-[#A2A2BA]">
                        {isAr ? `الرمز: ${b.partnerBankCode}` : `Code: ${b.partnerBankCode}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-xs text-neutral-200">
                        {formatNumber(b.totalMerchants)} {isAr ? "تاجر" : "merchants"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-xs text-neutral-200 tabular-nums">
                        {formatCurrency(b.totalGrossSar)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-[#7FE87F] text-xs tabular-nums">
                        {formatCurrency(b.totalMdrDeductionSar)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-extrabold text-[#7FE87F] text-xs tabular-nums">
                        {formatCurrency(b.totalNetDisbursedSar)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={b.status} />
                    </TableCell>
                    <TableCell>
                      {b.status === "scheduled" ? (
                        <Button
                          size="sm"
                          disabled={isProcessingBatch === b.id}
                          onClick={() => handleDispatchBatch(b.id)}
                          className="h-7 px-3 text-xs font-bold gap-1.5 btn-primary-shine"
                        >
                          <Send className="h-3 w-3" />
                          <span>
                            {isProcessingBatch === b.id
                              ? (isAr ? "جاري المقاصة..." : "Clearing...")
                              : (isAr ? "تنفيذ التسوية" : "Dispatch")}
                          </span>
                        </Button>
                      ) : (
                        <span className="text-[#7FE87F] text-xs font-semibold">
                          {isAr ? "✓ تم الإيداع" : "✓ Dispatched"}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* SECTION 4: Risk, AML & Transaction Limits */}
      {activeSection === "risk" && (
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isAr ? "تنبيهات المخاطر ومكافحة غسل الأموال" : "Risk Alerts & Watchlist"}
                  </h3>
                  <p className="text-[11px] text-[#A2A2BA]">
                    {isAr ? "مراقبة الأنماط غير الاعتيادية وتدوير الأموال" : "Monitor suspicious transaction velocity and AML screening"}
                  </p>
                </div>
              </div>
              <Badge variant="destructive" className="text-[10px] font-bold">
                {riskAlerts.filter((a) => a.status === "open").length} {isAr ? "تنبيهات مفتوحة" : "OPEN ALERTS"}
              </Badge>
            </div>

            <div className="space-y-3 pt-1">
              {riskAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl bg-[#111726] border border-[#2C2C44] flex items-start justify-between flex-wrap gap-3 hover:border-[#7FE87F]/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg mt-0.5 ${
                        alert.severity === "critical"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{getAlertTitle(alert)}</span>
                        <Badge
                          variant={alert.severity === "critical" ? "destructive" : "warning"}
                          className="text-[9.5px] font-bold"
                        >
                          {getAlertSeverityLabel(alert.severity)}
                        </Badge>
                        <span className="text-[10px] text-[#A2A2BA] font-medium">{alert.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#A2A2BA] mt-1">{getAlertDescription(alert)}</p>
                      <div className="text-xs text-[#7FE87F] font-medium mt-1.5 flex items-center gap-1">
                        <span>{isAr ? "الكيان:" : "Entity:"}</span>
                        <span className="font-semibold">{alert.entityName}</span>
                        <span className="text-[#6E6E85] font-mono">({alert.entityId})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {alert.status !== "resolved" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolveAlert(alert.id)}
                        className="h-8 px-3 text-xs bg-[#111726] border-[#2C2C44] text-neutral-200 hover:text-[#7FE87F] hover:border-[#7FE87F]/40 cursor-pointer"
                      >
                        {isAr ? "حل التنبيه" : "Resolve Flag"}
                      </Button>
                    ) : (
                      <span className="text-xs text-[#7FE87F] font-semibold">
                        {isAr ? "✓ تم الحل" : "✓ Resolved"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* SECTION 5: SAMA Regulatory Audit Logs */}
      {activeSection === "audit" && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44] flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#7FE87F]/10 text-[#7FE87F]">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? "سجل الرقابة وتدقيق البنك المركزي (ساما)" : "SAMA Regulatory Audit Trail"}
                </h3>
                <p className="text-[11px] text-[#A2A2BA]">
                  {isAr ? "سجل غير قابل للتعديل لكافة الإجراءات الإدارية وتعديل الرسوم" : "Immutable ledger of all admin actions, fee overrides & freezes"}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const ok = exportCsv(
                  `sama-audit-trail-${new Date().toISOString().slice(0, 10)}.csv`,
                  auditLogs,
                  [
                    { label: "Timestamp", value: (l) => l.timestamp },
                    { label: "Admin User", value: (l) => l.adminEmail },
                    { label: "Action", value: (l) => l.category },
                    { label: "Target Entity", value: (l) => l.targetEntity },
                    { label: "Details", value: (l) => l.details },
                    { label: "IP Address", value: (l) => l.ipAddress },
                    { label: "Status", value: (l) => l.status },
                  ]
                );
                showNotice(
                  ok
                    ? (isAr ? "تم تصدير سجل التدقيق بنجاح" : "Audit trail exported successfully")
                    : (isAr ? "فشل التصدير" : "Export failed. Please try again.")
                );
              }}
              className="h-8 px-3 text-xs bg-[#111726] border-[#2C2C44] text-[#7FE87F] hover:bg-[#182236] gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isAr ? "تصدير التقرير" : "Export Audit"}</span>
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isAr ? "التوقيت" : "Timestamp"}</TableHead>
                <TableHead>{isAr ? "المسؤول" : "Admin User"}</TableHead>
                <TableHead>{isAr ? "نوع الإجراء" : "Action"}</TableHead>
                <TableHead>{isAr ? "الهدف / الكيان" : "Target Entity"}</TableHead>
                <TableHead>{isAr ? "التفاصيل" : "Details"}</TableHead>
                <TableHead>{isAr ? "عنوان IP" : "IP Address"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-[#A2A2BA] font-mono">
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="font-bold text-xs text-white">
                    {log.adminEmail}
                  </TableCell>
                  <TableCell>
                    <Badge variant="primary" className="text-[10px] font-mono">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-white">
                    {log.targetEntity}
                  </TableCell>
                  <TableCell className="text-xs text-[#A2A2BA]">
                    {log.details}
                  </TableCell>
                  <TableCell className="text-xs text-[#A2A2BA] font-mono">
                    {log.ipAddress}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* SECTION 6: API Gateways & Connectivity */}
      {activeSection === "gateways" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            {
              nameEn: "Sarie Instant Core",
              nameAr: "مقسم سريع المباشر",
              latency: "14ms",
              latencyAr: "14 مللي ثانية",
              statusEn: "Operational",
              statusAr: "يعمل بكفاءة",
              descEn: "Interbank instant payments",
              descAr: "التحويل الفوري بين البنوك"
            },
            {
              nameEn: "Wathq CR & Legal API",
              nameAr: "بوابة واثق للتحقق",
              latency: "22ms",
              latencyAr: "22 مللي ثانية",
              statusEn: "Operational",
              statusAr: "يعمل بكفاءة",
              descEn: "Commercial registry link",
              descAr: "سجلات وزارة التجارة"
            },
            {
              nameEn: "Nafath National SSO",
              nameAr: "النفاذ الوطني (نفاذ)",
              latency: "38ms",
              latencyAr: "38 مللي ثانية",
              statusEn: "Operational",
              statusAr: "يعمل بكفاءة",
              descEn: "Biometric identity verification",
              descAr: "التحقق من الهوية الوطنية"
            },
            {
              nameEn: "ZATCA Fatoorah Phase 2",
              nameAr: "منظومة زاتكا للفوترة",
              latency: "19ms",
              latencyAr: "19 مللي ثانية",
              statusEn: "Operational",
              statusAr: "يعمل بكفاءة",
              descEn: "E-invoice clearance",
              descAr: "الاعتماد الرقمي للفواتير"
            }
          ].map((gw) => (
            <Card key={gw.nameEn} className="p-4 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white">{isAr ? gw.nameAr : gw.nameEn}</span>
                <span className="live-indicator w-2 h-2" />
              </div>
              <p className="text-[11px] text-[#A2A2BA] leading-relaxed">{isAr ? gw.descAr : gw.descEn}</p>
              <div className="pt-2 border-t border-[#2C2C44] flex justify-between text-xs font-medium">
                <span className="text-[#A2A2BA]">
                  {isAr ? "الاستجابة: " : "Latency: "}
                  <strong className="text-[#7FE87F] tabular-nums">{isAr ? gw.latencyAr : gw.latency}</strong>
                </span>
                <span className="text-[#7FE87F] font-bold">{isAr ? gw.statusAr : gw.statusEn}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* SECTION 7: Security & System Preferences */}
      {activeSection === "security" && (
        <Card className="p-5 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#7FE87F]/10 text-[#7FE87F]">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? "إعدادات الأمان وسياسات الجلسات" : "Security Policies & System Controls"}
                </h3>
                <p className="text-[11px] text-[#A2A2BA]">
                  {isAr ? "إدارة انتهاء الجلسات والمصادقة الثنائية والإشعارات" : "Session timeouts, mandatory 2FA, and automated settlement rules"}
                </p>
              </div>
            </div>
            <Badge variant="primary" className="text-[10px] font-bold">
              {isAr ? "معايير ساما للأمن السيبراني" : "SAMA CYBERSECURITY"}
            </Badge>
          </div>

          <form onSubmit={handleSaveSecurityConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A2A2BA] block">
                {isAr ? "مدة انتهاء جلسة الإدارة (بالدقائق)" : "Admin Session Idle Timeout (Minutes)"}
              </label>
              <Input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="h-9 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A2A2BA] block">
                {isAr ? "توقيت التسوية التلقائية اليومية" : "Daily Automated Settlement Cutoff Time"}
              </label>
              <Input
                type="time"
                value={autoSettleTime}
                onChange={(e) => setAutoSettleTime(e.target.value)}
                className="h-9 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A2A2BA] block">
                {isAr ? "بريد إشعارات الطوارئ والمخاطر" : "Emergency Risk & AML Notification Email"}
              </label>
              <Input
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                className="h-9 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F]"
              />
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer select-none bg-[#111726] p-2.5 rounded-lg border border-[#2C2C44]">
                <input
                  type="checkbox"
                  checked={twoFactorEnforced}
                  onChange={(e) => setTwoFactorEnforced(e.target.checked)}
                  className="rounded bg-[#111726] border-[#2C2C44] text-[#7FE87F] focus:ring-[#7FE87F]"
                />
                <span>{isAr ? "إلزام التحقق بخطوتين (2FA) لجميع مسؤولي النظام" : "Enforce mandatory 2FA for all administrative logins"}</span>
              </label>
            </div>

            <div className="col-span-1 md:col-span-2 pt-2">
              <Button
                type="submit"
                className="h-9 px-5 text-xs font-bold btn-primary-shine"
              >
                {isAr ? "حفظ وتطبيق الإعدادات" : "Save & Apply Security Policies"}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
