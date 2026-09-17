import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Shield,
  Zap,
  Globe2,
  CheckCircle2,
  UserCheck
} from "lucide-react";
import type { AdminUser, AdminRole } from "../types";

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  lang: "en" | "ar";
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, lang }) => {
  const isAr = lang === "ar";
  const [email, setEmail] = useState("a.qahtani@qtpay.sa");
  const [passcode, setPasscode] = useState("908234");
  const [role, setRole] = useState<AdminRole>("superadmin");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const user: AdminUser = {
        id: "adm_" + Math.floor(100000 + Math.random() * 900000),
        name: role === "superadmin" ? "Eng. Abdulaziz Al-Qahtani" : role === "compliance_officer" ? "Mona Al-Shehri (Compliance)" : "Faris Al-Harbi (Settlements)",
        email: email,
        role: role,
        avatar: role === "superadmin" ? "AQ" : role === "compliance_officer" ? "MS" : "FH",
        lastLogin: "Just Now",
        ipAddress: "178.135.92.14"
      };
      onLoginSuccess(user);
      setIsLoading(false);
    }, 600);
  };

  const handleDemoSelect = (selectedRole: AdminRole, demoEmail: string) => {
    setRole(selectedRole);
    setEmail(demoEmail);
    setPasscode("908234");
  };

  return (
    <div style={{
      width: "100vw",
      minHeight: "100vh",
      backgroundColor: "#080C14",
      backgroundImage: "radial-gradient(circle at 50% 20%, rgba(127, 232, 127, 0.08) 0%, transparent 60%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxSizing: "border-box",
      color: "#FFFFFF"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "440px",
        background: "#0F1626",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "20px",
        padding: "32px 28px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #7FE87F, #059669)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto",
            boxShadow: "0 0 24px rgba(127, 232, 127, 0.4)",
            color: "#080C14",
            fontWeight: 900,
            fontSize: "24px"
          }}>
            QP
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px 0" }}>
            {isAr ? "تسجيل دخول المشرفين" : "QTPay SuperAdmin"}
          </h1>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>
            {isAr ? "بوابة الرقابة والامتثال لأنظمة البنك المركزي السعودي" : "Central Operations & SAMA Compliance Gateway"}
          </p>
        </div>

        {/* Demo Roles Quick Pill Picker */}
        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
            {isAr ? "اختيار الصلاحية السريعة (تجريبي)" : "Select Demo Authority"}
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
            <button
              type="button"
              onClick={() => handleDemoSelect("superadmin", "a.qahtani@qtpay.sa")}
              style={{
                padding: "8px 6px",
                borderRadius: "8px",
                border: role === "superadmin" ? "1px solid #7FE87F" : "1px solid var(--border-subtle)",
                background: role === "superadmin" ? "rgba(127, 232, 127, 0.12)" : "#121A2D",
                color: role === "superadmin" ? "#7FE87F" : "var(--text-secondary)",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              SuperAdmin
            </button>
            <button
              type="button"
              onClick={() => handleDemoSelect("compliance_officer", "m.shehri@qtpay.sa")}
              style={{
                padding: "8px 6px",
                borderRadius: "8px",
                border: role === "compliance_officer" ? "1px solid #38BDF8" : "1px solid var(--border-subtle)",
                background: role === "compliance_officer" ? "rgba(56, 189, 248, 0.12)" : "#121A2D",
                color: role === "compliance_officer" ? "#38BDF8" : "var(--text-secondary)",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Compliance
            </button>
            <button
              type="button"
              onClick={() => handleDemoSelect("settlement_manager", "f.harbi@qtpay.sa")}
              style={{
                padding: "8px 6px",
                borderRadius: "8px",
                border: role === "settlement_manager" ? "1px solid #F59E0B" : "1px solid var(--border-subtle)",
                background: role === "settlement_manager" ? "rgba(245, 158, 11, 0.12)" : "#121A2D",
                color: role === "settlement_manager" ? "#F59E0B" : "var(--text-secondary)",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Settlements
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
              {isAr ? "البريد الإلكتروني الإداري" : "Admin Official Email"}
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={15} color="#64748B" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "12px" }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ width: "100%", paddingLeft: "36px", height: "42px" }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
              {isAr ? "رمز التحقق / كلمة المرور" : "Master Security Passkey / OTP"}
            </label>
            <div style={{ position: "relative" }}>
              <KeyRound size={15} color="#64748B" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "12px" }} />
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="input-field"
                style={{ width: "100%", paddingLeft: "36px", height: "42px" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ width: "100%", height: "44px", justifyContent: "center", marginTop: "6px", fontSize: "14px" }}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>{isAr ? "تسجيل الدخول الآمن" : "Secure Portal Access"}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Security Badge Footer */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          fontSize: "11px",
          color: "#10B981",
          background: "rgba(16, 185, 129, 0.08)",
          padding: "8px",
          borderRadius: "8px"
        }}>
          <ShieldCheck size={14} />
          <span>SAMA End-to-End Encrypted Session</span>
        </div>
      </div>
    </div>
  );
};
