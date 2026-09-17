import React, { useState } from "react";
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "../components/ui/card";
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
    <div className="w-screen min-h-screen bg-[#080C14] bg-[radial-gradient(circle_at_50%_20%,rgba(127,232,127,0.07)_0%,transparent_60%)] flex items-center justify-center p-5 text-white font-sans">
      <Card className="w-full max-w-[400px] bg-[#0F1626] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
        {/* Brand Header */}
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7FE87F] to-[#059669] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(127,232,127,0.35)] text-[#080C14] font-black text-xl">
            QP
          </div>
          <CardTitle className="text-xl font-extrabold text-white">
            {isAr ? "لوحة تحكم الإدارة" : "QTPay Admin Portal"}
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            {isAr ? "سجل الدخول للمتابعة إلى النظام" : "Sign in to access admin control"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {error && (
            <div className="bg-red-500/15 border border-red-500/30 rounded-lg p-2.5 text-red-400 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 block">
                {isAr ? "البريد الإلكتروني" : "Admin Email / Username"}
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-slate-500 pointer-events-none" />
                <Input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@qtpay.sa"
                  className="pl-9 h-10 text-xs bg-[#121A2D] border-[var(--border-subtle)] focus:border-[#7FE87F]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 block">
                {isAr ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-slate-500 pointer-events-none" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-9 h-10 text-xs bg-[#121A2D] border-[var(--border-subtle)] focus:border-[#7FE87F]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-xl font-bold text-xs mt-2"
            >
              {isLoading ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <span>{isAr ? "تسجيل الدخول" : "Sign In"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
