import React, { useState } from "react";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";
import type { AdminUser } from "../types";

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  lang: "en" | "ar";
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, lang }) => {
  const isAr = lang === "ar";
  const [email, setEmail] = useState("admin@qtpay.sa");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(isAr ? "يرجى إدخال البريد الإلكتروني وكلمة المرور" : "Please enter email and password");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const user: AdminUser = {
        id: "admin_01",
        name: "Administrator",
        email: email,
        role: "superadmin",
        avatar: "AD",
        lastLogin: "Just Now",
        ipAddress: "127.0.0.1"
      };
      onLoginSuccess(user);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div style={{
      width: "100vw",
      minHeight: "100vh",
      backgroundColor: "#080C14",
      backgroundImage: "radial-gradient(circle at 50% 20%, rgba(127, 232, 127, 0.07) 0%, transparent 60%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxSizing: "border-box",
      color: "#FFFFFF",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "#0F1626",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "20px",
        padding: "36px 30px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        display: "flex",
        flexDirection: "column",
        gap: "22px"
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "50px",
            height: "50px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #7FE87F, #059669)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto",
            boxShadow: "0 0 20px rgba(127, 232, 127, 0.35)",
            color: "#080C14",
            fontWeight: 900,
            fontSize: "22px"
          }}>
            QP
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 6px 0" }}>
            {isAr ? "لوحة تحكم الإدارة" : "QTPay Admin Portal"}
          </h1>
          <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>
            {isAr ? "سجل الدخول للمتابعة إلى النظام" : "Sign in to access admin control"}
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "10px",
            padding: "10px 14px",
            color: "#F87171",
            fontSize: "12.5px",
            fontWeight: 600
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#94A3B8", display: "block", marginBottom: "6px" }}>
              {isAr ? "البريد الإلكتروني" : "Admin Email / Username"}
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} color="#64748B" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "14px" }} />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@qtpay.sa"
                className="input-field"
                style={{ width: "100%", paddingLeft: "40px", paddingRight: "14px", height: "44px", fontSize: "13.5px" }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#94A3B8", display: "block", marginBottom: "6px" }}>
              {isAr ? "كلمة المرور" : "Password"}
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} color="#64748B" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "14px" }} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                style={{ width: "100%", paddingLeft: "40px", paddingRight: "40px", height: "44px", fontSize: "13.5px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  right: "12px",
                  background: "none",
                  border: "none",
                  color: "#64748B",
                  cursor: "pointer",
                  padding: "4px"
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{
              width: "100%",
              height: "46px",
              justifyContent: "center",
              marginTop: "4px",
              fontSize: "14.5px",
              fontWeight: 800,
              borderRadius: "12px"
            }}
          >
            {isLoading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <span>{isAr ? "تسجيل الدخول" : "Sign In"}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
