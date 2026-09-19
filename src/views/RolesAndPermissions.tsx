import React, { useState } from "react";
import {
  ShieldCheck,
  UserPlus,
  Users,
  Check,
  X
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../components/ui/dialog";
import {
  mockRoleDefinitions,
  mockAdminPermissions,
  mockAdminTeamMembers
} from "../services/mockData";
import { useTranslation } from "../lib/i18n/LanguageContext";
import type { AdminUser, AdminRole, AdminPermission } from "../types";

interface RolesAndPermissionsProps {
  lang?: "en" | "ar";
}

export const RolesAndPermissions: React.FC<RolesAndPermissionsProps> = () => {
  const { lang, isAr, formatNumber } = useTranslation();
  const [teamMembers, setTeamMembers] = useState<AdminUser[]>(mockAdminTeamMembers);
  const [permissions, setPermissions] = useState<AdminPermission[]>(mockAdminPermissions);
  const [activeTab, setActiveTab] = useState<"roles" | "staff" | "matrix">("roles");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<AdminRole>("compliance_officer");

  const handleTogglePermission = (permId: string, role: AdminRole) => {
    if (role === "superadmin") return; // Superadmin always has all permissions
    setPermissions((prev) =>
      prev.map((p) => (p.id === permId ? { ...p, [role]: !p[role] } : p))
    );
  };

  const handleToggleMemberStatus = (userId: string) => {
    setTeamMembers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u
      )
    );
  };

  const handleChangeMemberRole = (userId: string, targetRole: AdminRole) => {
    setTeamMembers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: targetRole } : u))
    );
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newStaff: AdminUser = {
      id: `adm_${Date.now().toString().slice(-6)}`,
      name: newName,
      email: newEmail,
      role: newRole,
      avatar: newName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      lastLogin: isAr ? "لم يسجل بعد (تمت الدعوة)" : "Never (Invited)",
      ipAddress: isAr ? "قيد الانتظار" : "Pending",
      status: "active"
    };

    setTeamMembers([newStaff, ...teamMembers]);
    setIsAddUserOpen(false);
    setNewName("");
    setNewEmail("");
  };

  const getRoleDisplayName = (role: AdminRole) => {
    if (!isAr) {
      switch (role) {
        case "superadmin":
          return "Super Admin";
        case "compliance_officer":
          return "Compliance & AML Officer";
        case "settlement_manager":
          return "Operations Manager";
        case "risk_analyst":
          return "Risk & Fraud Analyst";
        case "support_lead":
          return "Support Lead";
      }
    }
    switch (role) {
      case "superadmin":
        return "المدير العام الأعلى للنظام";
      case "compliance_officer":
        return "مسؤول الامتثال ومكافحة غسل الأموال";
      case "settlement_manager":
        return "مدير التسويات والعمليات المصرفية";
      case "risk_analyst":
        return "محلل الاحتيال وإدارة المخاطر";
      case "support_lead":
        return "رئيس فريق الدعم والعمليات";
    }
  };

  const getPermissionName = (perm: AdminPermission) => {
    if (!isAr) return perm.name;
    const map: Record<string, string> = {
      "perm_kyb_approve": "اعتماد وتوثيق طلبات KYB للتجار",
      "perm_terminal_provision": "إصدار وتفعيل أجهزة نقاط البيع (SoftPOS)",
      "perm_settlement_dispatch": "تنفيذ وإرسال دفعات المقاصة والتسوية للبنوك",
      "perm_settlement_hold": "حجز وتعليق التسويات المصرفية للتاجر",
      "perm_user_freeze": "تجميد الحسابات والمحافظ احترازياً",
      "perm_refund_execute": "تنفيذ عمليات الاسترجاع المالي المباشر عبر ساما",
      "perm_rate_override": "تعديل مصفوفة العمولات ورسوم المعالجة (MDR)",
      "perm_audit_view": "استعراض سجلات التدقيق والامتثال المشفرة"
    };
    return map[perm.id] || perm.name;
  };

  const getPermissionDesc = (perm: AdminPermission) => {
    if (!isAr) return perm.description;
    const map: Record<string, string> = {
      "perm_kyb_approve": "صلاحية مراجعة واعتماد السجلات التجارية والوثائق الضريبية",
      "perm_terminal_provision": "تخصيص تراخيص الاتصال اللاتلامسي NFC للأجهزة",
      "perm_settlement_dispatch": "إرسال أوامر التحويل الآلي إلى البنوك الشريكة عبر سريع",
      "perm_settlement_hold": "إيقاف صرف المستحقات للآيبان لأسباب الاشتباه والمخاطر",
      "perm_user_freeze": "تعليق الحوالات الصادرة للأفراد وفق لوائح الامتثال",
      "perm_refund_execute": "إرجاع مبالغ العمليات إلى وسائل الدفع الأصلية للعملاء",
      "perm_rate_override": "تخصيص نسب الاستقطاع والرسوم الثابتة للعمليات",
      "perm_audit_view": "الاطلاع على البصمات المشفرة وسجلات النشاط الإداري"
    };
    return map[perm.id] || perm.description;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#F1D77A]" />
          <h2 className="text-base font-extrabold text-white">
            {isAr ? "الأدوار والصلاحيات والأمان (RBAC)" : "Roles & Access Control (RBAC)"}
          </h2>
          <Badge variant="gold" className="text-[11px]">
            {formatNumber(teamMembers.length)} {isAr ? "مسؤول إداري" : "Staff"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub Navigation */}
          <div className="inline-flex rounded-lg bg-[#121212] p-1 border border-[#262626]">
            <button
              onClick={() => setActiveTab("roles")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "roles"
                  ? "bg-gradient-to-r from-[#F1D77A] via-[#D4AF37] to-[#B38F26] text-[#0B0B0B] font-bold shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {isAr ? "الأدوار" : "Role Definitions"}
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "staff"
                  ? "bg-gradient-to-r from-[#F1D77A] via-[#D4AF37] to-[#B38F26] text-[#0B0B0B] font-bold shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {isAr ? "فريق الإدارة" : "Admin Staff"}
            </button>
            <button
              onClick={() => setActiveTab("matrix")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "matrix"
                  ? "bg-gradient-to-r from-[#F1D77A] via-[#D4AF37] to-[#B38F26] text-[#0B0B0B] font-bold shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {isAr ? "مصفوفة الصلاحيات" : "Permission Matrix"}
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddUserOpen(true)}
            className="gap-1.5 h-8 text-xs font-bold bg-gradient-to-r from-[#F1D77A] via-[#D4AF37] to-[#B38F26] text-[#0B0B0B] hover:opacity-95 shadow-md shadow-[#D4AF37]/20"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>{isAr ? "إضافة مسؤول" : "Invite Admin"}</span>
          </Button>
        </div>
      </div>

      {/* Tab 1: Roles Overview Cards */}
      {activeTab === "roles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockRoleDefinitions.map((role) => (
            <Card key={role.id} className="p-4 space-y-3 bg-[#171717] border-[#262626]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isAr ? role.titleAr : role.title}
                  </h3>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded border ${role.badgeColor}`}>
                    {role.id.toUpperCase().replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-400 font-semibold tabular-nums">
                  <Users className="h-3.5 w-3.5" />
                  <span>{formatNumber(teamMembers.filter((m) => m.role === role.id).length)}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                {role.description}
              </p>

              <div className="pt-2 border-t border-[#262626] flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">{isAr ? "مستوى الوصول" : "Access Level"}</span>
                <span className="font-bold text-[#F1D77A]">
                  {role.id === "superadmin"
                    ? (isAr ? "صلاحية شاملة / وصول جذري" : "Root / Full Platform")
                    : (isAr ? "صلاحيات مخصصة" : "Scoped Authority")}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 2: Admin Staff List */}
      {activeTab === "staff" && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{isAr ? "المسؤول" : "Admin Staff"}</TableHead>
              <TableHead>{isAr ? "الدور المعين" : "Assigned Role"}</TableHead>
              <TableHead>{isAr ? "آخر تسجيل دخول" : "Last Activity"}</TableHead>
              <TableHead>{isAr ? "عنوان IP" : "Security IP"}</TableHead>
              <TableHead>{isAr ? "الحالة" : "Status"}</TableHead>
              <TableHead>{isAr ? "الإجراء" : "Action"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F1D77A] font-extrabold flex items-center justify-center text-[10px]">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{member.name}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{member.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <select
                    value={member.role}
                    disabled={member.role === "superadmin"}
                    onChange={(e) => handleChangeMemberRole(member.id, e.target.value as AdminRole)}
                    className="h-7 px-2 text-xs bg-[#121212] border border-[#262626] rounded-md text-neutral-200 outline-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed focus:border-[#D4AF37]"
                  >
                    <option value="superadmin">{getRoleDisplayName("superadmin")}</option>
                    <option value="compliance_officer">{getRoleDisplayName("compliance_officer")}</option>
                    <option value="settlement_manager">{getRoleDisplayName("settlement_manager")}</option>
                    <option value="risk_analyst">{getRoleDisplayName("risk_analyst")}</option>
                    <option value="support_lead">{getRoleDisplayName("support_lead")}</option>
                  </select>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-neutral-300 font-medium">{member.lastLogin}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-semibold text-[#F1D77A] tabular-nums font-mono">{member.ipAddress}</span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={member.status} />
                </TableCell>
                <TableCell>
                  {member.role !== "superadmin" && (
                    <Button
                      variant={member.status === "active" ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleMemberStatus(member.id)}
                      className="h-7 px-2 text-xs"
                    >
                      {member.status === "active"
                        ? (isAr ? "إيقاف" : "Suspend")
                        : (isAr ? "تفعيل" : "Activate")}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Tab 3: Permission Matrix */}
      {activeTab === "matrix" && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{isAr ? "الصلاحية" : "Permission"}</TableHead>
              <TableHead className="text-center">{isAr ? "المدير العام" : "Super Admin"}</TableHead>
              <TableHead className="text-center">{isAr ? "الامتثال" : "Compliance"}</TableHead>
              <TableHead className="text-center">{isAr ? "التسويات" : "Ops & Settle"}</TableHead>
              <TableHead className="text-center">{isAr ? "المخاطر" : "Risk Analyst"}</TableHead>
              <TableHead className="text-center">{isAr ? "الدعم" : "Support"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((perm) => (
              <TableRow key={perm.id}>
                <TableCell>
                  <div className="font-bold text-white text-xs">{getPermissionName(perm)}</div>
                  <div className="text-[10px] text-neutral-400">{getPermissionDesc(perm)}</div>
                </TableCell>
                {(["superadmin", "compliance_officer", "settlement_manager", "risk_analyst", "support_lead"] as AdminRole[]).map(
                  (role) => {
                    const isGranted = perm[role];
                    return (
                      <TableCell key={role} className="text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(perm.id, role)}
                          disabled={role === "superadmin"}
                          className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-all ${
                            isGranted
                              ? "bg-[#D4AF37]/20 text-[#F1D77A] border border-[#D4AF37]/40"
                              : "bg-[#121212] text-neutral-600 border border-[#262626]"
                          } ${role !== "superadmin" ? "cursor-pointer hover:scale-105" : "cursor-default"}`}
                        >
                          {isGranted ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                        </button>
                      </TableCell>
                    );
                  }
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Invite Admin Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-w-md bg-[#171717] border-[#262626]">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isAr ? "دعوة مسؤول إداري جديد" : "Invite New Administrator"}
            </DialogTitle>
            <DialogDescription className="text-neutral-400">
              {isAr
                ? "تعيين الدور وصلاحيات الوصول للمسؤول المصرح له في البوابة."
                : "Assign role and access permissions for a verified team member."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateStaff} className="space-y-3.5 py-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-400">
                {isAr ? "الاسم الكامل" : "Full Name"}
              </label>
              <Input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={isAr ? "مثال: طارق الحسيني" : "e.g. Tariq Al-Husseini"}
                className="bg-[#121212] border-[#262626] text-white focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-400">
                {isAr ? "البريد الإلكتروني الرسمي" : "Corporate Email"}
              </label>
              <Input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={isAr ? "t.husseini@qtpay.sa" : "e.g. t.husseini@qtpay.sa"}
                className="bg-[#121212] border-[#262626] text-white focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-400">
                {isAr ? "الدور الإداري الابتدائي" : "Initial Role"}
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as AdminRole)}
                className="w-full h-9 px-3 text-xs bg-[#121212] border border-[#262626] rounded-lg text-white outline-none focus:border-[#D4AF37]"
              >
                <option value="compliance_officer">{getRoleDisplayName("compliance_officer")}</option>
                <option value="settlement_manager">{getRoleDisplayName("settlement_manager")}</option>
                <option value="risk_analyst">{getRoleDisplayName("risk_analyst")}</option>
                <option value="support_lead">{getRoleDisplayName("support_lead")}</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddUserOpen(false)}
                className="border-[#262626] hover:bg-[#262626] text-neutral-300"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" size="sm" className="bg-gradient-to-r from-[#F1D77A] via-[#D4AF37] to-[#B38F26] text-[#0B0B0B] hover:opacity-95 font-bold shadow-md shadow-[#D4AF37]/20">
                {isAr ? "إرسال الدعوة" : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

