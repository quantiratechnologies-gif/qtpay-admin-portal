import React, { useState } from "react";
import {
  ShieldCheck,
  UserPlus,
  ShieldAlert,
  Users,
  Check,
  X,
  Lock,
  UserCheck,
  MoreVertical,
  KeyRound
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
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
import type { AdminUser, AdminRole, AdminPermission } from "../types";

interface RolesAndPermissionsProps {
  lang: "en" | "ar";
}

export const RolesAndPermissions: React.FC<RolesAndPermissionsProps> = ({ lang }) => {
  const isAr = lang === "ar";
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
      lastLogin: "Never (Invited)",
      ipAddress: "Pending",
      status: "active"
    };

    setTeamMembers([newStaff, ...teamMembers]);
    setIsAddUserOpen(false);
    setNewName("");
    setNewEmail("");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#7FE87F]" />
          <h2 className="text-base font-extrabold text-white">
            {isAr ? "الأدوار والصلاحيات (RBAC)" : "Roles & Access Control (RBAC)"}
          </h2>
          <Badge variant="secondary" className="text-[11px]">
            {teamMembers.length} Staff
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub Navigation */}
          <div className="inline-flex rounded-lg bg-[#0E1526] p-1 border border-slate-800/80">
            <button
              onClick={() => setActiveTab("roles")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === "roles"
                  ? "bg-[#7FE87F] text-[#080C14]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isAr ? "الأدوار" : "Role Definitions"}
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === "staff"
                  ? "bg-[#7FE87F] text-[#080C14]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isAr ? "فريق الإدارة" : "Admin Staff"}
            </button>
            <button
              onClick={() => setActiveTab("matrix")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === "matrix"
                  ? "bg-[#7FE87F] text-[#080C14]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isAr ? "مصفوفة الصلاحيات" : "Permission Matrix"}
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddUserOpen(true)}
            className="gap-1.5 h-8 text-xs font-bold"
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
            <Card key={role.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isAr ? role.titleAr : role.title}
                  </h3>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded border ${role.badgeColor}`}>
                    {role.id.toUpperCase().replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold tabular-nums">
                  <Users className="h-3.5 w-3.5" />
                  <span>{teamMembers.filter((m) => m.role === role.id).length}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {role.description}
              </p>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Access Level</span>
                <span className="font-bold text-[#7FE87F]">
                  {role.id === "superadmin" ? "Root / Full Platform" : "Scoped Authority"}
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
                    <div className="w-7 h-7 rounded-lg bg-[#7FE87F]/15 border border-[#7FE87F]/30 text-[#7FE87F] font-extrabold flex items-center justify-center text-[10px]">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{member.name}</div>
                      <div className="text-[10px] text-slate-400">{member.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <select
                    value={member.role}
                    disabled={member.role === "superadmin"}
                    onChange={(e) => handleChangeMemberRole(member.id, e.target.value as AdminRole)}
                    className="h-7 px-2 text-xs bg-[#10182A] border border-slate-800/80 rounded-md text-slate-200 outline-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <option value="superadmin">Super Admin</option>
                    <option value="compliance_officer">Compliance & AML Officer</option>
                    <option value="settlement_manager">Operations Manager</option>
                    <option value="risk_analyst">Risk & Fraud Analyst</option>
                    <option value="support_lead">Support Lead</option>
                  </select>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-300 font-medium">{member.lastLogin}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-semibold text-sky-400 tabular-nums">{member.ipAddress}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={member.status === "active" ? "success" : "destructive"}
                    className="text-[10px]"
                  >
                    {member.status.toUpperCase()}
                  </Badge>
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
              <TableHead className="text-center">Super Admin</TableHead>
              <TableHead className="text-center">Compliance</TableHead>
              <TableHead className="text-center">Ops & Settle</TableHead>
              <TableHead className="text-center">Risk Analyst</TableHead>
              <TableHead className="text-center">Support</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((perm) => (
              <TableRow key={perm.id}>
                <TableCell>
                  <div className="font-bold text-white text-xs">{perm.name}</div>
                  <div className="text-[10px] text-slate-400">{perm.description}</div>
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
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-800/40 text-slate-600 border border-slate-800"
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite New Administrator</DialogTitle>
            <DialogDescription>
              Assign role and access permissions for a verified team member.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateStaff} className="space-y-3.5 py-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Full Name</label>
              <Input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Tariq Al-Husseini"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Corporate Email</label>
              <Input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="e.g. t.husseini@qtpay.sa"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Initial Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as AdminRole)}
                className="w-full h-9 px-3 text-xs bg-[#10182A] border border-slate-800/80 rounded-lg text-white outline-none"
              >
                <option value="compliance_officer">Compliance & AML Officer</option>
                <option value="settlement_manager">Operations & Settlements Manager</option>
                <option value="risk_analyst">Risk & Fraud Analyst</option>
                <option value="support_lead">Customer Support Lead</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddUserOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
