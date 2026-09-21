import React, { useState } from "react";
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Languages,
  KeyRound,
  CheckCircle2,
  ShieldAlert,
  X,
  Smartphone
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
import { Logo } from "../components/Logo";
import { useTranslation } from "../lib/i18n/LanguageContext";
import { currentAdminUser } from "../services/mockData";
import type { AdminUser } from "../types";

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  lang?: "en" | "ar";
}

const DEMO_CREDENTIALS = [
  { email: "a.alqahtani@qtpay.sa", password: "admin123" },
  { email: "admin@qtpay.sa", password: "admin123" },
];

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const { isAr, t, toggleLang } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Forgot Password Modal State
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<"email" | "otp" | "new_password" | "success">("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email || !password) {
      setError(isAr ? "يرجى إدخال البريد الإلكتروني وكلمة المرور" : "Please enter email and password");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(isAr ? "صيغة البريد الإلكتروني غير صحيحة" : "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const match = DEMO_CREDENTIALS.find(
        (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password
      );

      if (!match) {
        setIsLoading(false);
        setError(isAr ? "بيانات الدخول غير صحيحة" : "Invalid credentials");
        return;
      }

      const user: AdminUser = {
        ...currentAdminUser,
        email: match.email,
        lastLogin: isAr ? "اليوم، 10:45 ص (المقر الرئيسي)" : "Today, 10:45 AM (Riyadh HQ)"
      };
      onLoginSuccess(user);
      setIsLoading(false);
    }, 350);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (!resetEmail) {
      setForgotError(isAr ? "يرجى إدخال البريد الإلكتروني" : "Please enter email address");
      return;
    }
    setIsForgotLoading(true);
    setTimeout(() => {
      setIsForgotLoading(false);
      setForgotStep("otp");
      setResetOtp("");
    }, 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (!resetOtp || resetOtp.length < 4) {
      setForgotError(isAr ? "يرجى إدخال رمز التحقق الصحيح" : "Please enter valid 6-digit OTP");
      return;
    }
    setIsForgotLoading(true);
    setTimeout(() => {
      setIsForgotLoading(false);
      setForgotStep("new_password");
    }, 400);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (!newPassword || newPassword.length < 12) {
      setForgotError(isAr ? "يجب أن تكون كلمة المرور 12 خانة على الأقل" : "Password must be at least 12 characters");
      return;
    }
    if (
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !/[^A-Za-z0-9]/.test(newPassword)
    ) {
      setForgotError(
        isAr
          ? "يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة وأرقام ورموز خاصة"
          : "Password must contain uppercase, lowercase, numbers, and special characters"
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError(isAr ? "كلمات المرور غير متطابقة" : "Passwords do not match");
      return;
    }
    setIsForgotLoading(true);
    setTimeout(() => {
      setIsForgotLoading(false);
      setPassword(newPassword);
      setEmail(resetEmail);
      setForgotStep("success");
      setSuccessMsg(t("auth.passwordResetSuccess"));
    }, 500);
  };

  const closeForgotModal = () => {
    setIsForgotOpen(false);
    setForgotStep("email");
    setForgotError("");
    setResetOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="w-screen min-h-screen bg-[#080C14] bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(127,232,127,0.14)_0%,transparent_70%)] flex flex-col items-center justify-center p-4 sm:p-5 text-white font-sans relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute w-[500px] h-[500px] bg-[#7FE87F]/10 rounded-full blur-[120px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Top Bar with Language Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLang}
          className="h-8 px-3 bg-[#7FE87F]/10 border-[#7FE87F]/40 text-[#7FE87F] hover:bg-[#7FE87F]/25 hover:border-[#7FE87F]/60 text-xs font-bold gap-1.5 cursor-pointer shadow-lg shadow-[#7FE87F]/10"
        >
          <Languages className="h-3.5 w-3.5" />
          <span>{isAr ? "English" : "العربية"}</span>
        </Button>
      </div>

      <Card className="w-full max-w-[420px] bg-gradient-to-b from-[#182236]/95 to-[#111726]/98 border border-[#7FE87F]/35 rounded-2xl p-7 sm:p-8 shadow-2xl shadow-black/80 space-y-4 hover:border-[#7FE87F]/60 transition-all relative z-10 before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-[#7FE87F]/60 before:to-transparent">
        {/* Brand Header with Logo */}
        <CardHeader className="text-center space-y-2.5 pb-1">
          <div className="flex justify-center pb-2 drop-shadow-[0_0_15px_rgba(127,232,127,0.3)]">
            <Logo height={48} textColor="#FFFFFF" accentColor="#7FE87F" />
          </div>
          <CardTitle className="text-2xl font-extrabold primary-shimmer-text tracking-tight">
            {isAr ? "تسجيل الدخول الإداري" : "Admin Login"}
          </CardTitle>
          <CardDescription className="text-xs text-[#A2A2BA]">
            {isAr ? "سجل الدخول للمتابعة إلى لوحة التحكم" : "Sign in to access admin control"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {error && (
            <div className="bg-red-500/15 border border-red-500/30 rounded-lg p-2.5 text-red-400 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-[#7FE87F]/15 border border-[#7FE87F]/40 rounded-lg p-2.5 text-[#7FE87F] text-xs font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A2A2BA] block">
                {t("auth.emailLabel")}
              </label>
              <div className="relative">
                <Mail className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E6E85] pointer-events-none ${
                  isAr ? "right-3" : "left-3"
                }`} />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@qtpay.sa"
                  className={`h-10 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F] ${
                    isAr ? "pr-9 pl-3" : "pl-9 pr-3"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A2A2BA] block">
                {t("auth.passwordLabel")}
              </label>
              <div className="relative">
                <Lock className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E6E85] pointer-events-none ${
                  isAr ? "right-3" : "left-3"
                }`} />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isAr ? "أدخل كلمة المرور" : "Enter password"}
                  className={`h-10 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F] ${
                    isAr ? "pr-9 pl-9" : "pl-9 pr-9"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-[#6E6E85] hover:text-white cursor-pointer ${
                    isAr ? "left-3" : "right-3"
                  }`}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-[#A2A2BA] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-[#111726] border-[#2C2C44] text-[#7FE87F] focus:ring-[#7FE87F]"
                />
                <span>{t("auth.rememberMe")}</span>
              </label>

              {/* Forgot Password Trigger */}
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="text-xs font-bold text-[#7FE87F] hover:text-white hover:underline transition-colors cursor-pointer"
              >
                {t("auth.forgotPassword")}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-xl font-black text-xs mt-3 flex items-center justify-center gap-2 cursor-pointer btn-primary-shine bg-gradient-to-r from-[#7FE87F] via-[#6FD86F] to-[#5FBF5F] text-[#080C14] hover:brightness-110 shadow-lg shadow-[#7FE87F]/20"
            >
              {isLoading ? (
                <span>{t("auth.signingIn")}</span>
              ) : (
                <>
                  <span>{t("auth.signInBtn")}</span>
                  <ArrowIcon className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Demo Credentials Reference Box */}
      <div className="mt-4 p-3 bg-[#182236]/80 border border-[#7FE87F]/30 rounded-xl text-center text-xs space-y-1 z-10 max-w-[420px] w-full shadow-lg backdrop-blur-sm">
        <div className="text-[11px] font-semibold text-[#A2A2BA]">
          {isAr ? "بيانات الدخول الإدارية (يرجى الإدخال يدوياً):" : "Valid Admin Credentials (Enter manually):"}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-mono text-[#7FE87F]">
          <span><strong className="text-white font-sans">{isAr ? "البريد:" : "Email:"}</strong> a.alqahtani@qtpay.sa</span>
          <span><strong className="text-white font-sans">{isAr ? "كلمة المرور:" : "Password:"}</strong> admin123</span>
        </div>
      </div>

      {/* Interactive Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div
            className="bg-gradient-to-b from-[#182236] to-[#111726] border border-[#7FE87F]/40 rounded-2xl w-full max-w-[420px] p-6 shadow-2xl shadow-black/90 space-y-4 relative before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-[#7FE87F]/60 before:to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#2C2C44]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#7FE87F]/15 border border-[#7FE87F]/35 text-[#7FE87F]">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    {t("auth.resetPasswordTitle")}
                  </h3>
                  <p className="text-[11px] text-[#A2A2BA]">
                    {t("auth.resetPasswordSubtitle")}
                  </p>
                </div>
              </div>
              <button
                onClick={closeForgotModal}
                className="p-1 rounded-lg bg-[#182236] hover:bg-[#1E293B] text-[#A2A2BA] hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {forgotError && (
              <div className="bg-red-500/15 border border-red-500/30 rounded-lg p-2.5 text-red-400 text-xs font-semibold text-center">
                {forgotError}
              </div>
            )}

            {/* Step 1: Request OTP */}
            {forgotStep === "email" && (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A2A2BA] block">
                    {t("auth.emailLabel")}
                  </label>
                  <div className="relative">
                    <Mail className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E6E85] pointer-events-none ${
                      isAr ? "right-3" : "left-3"
                    }`} />
                    <Input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="admin@qtpay.sa"
                      className={`h-10 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F] ${
                        isAr ? "pr-9 pl-3" : "pl-9 pr-3"
                      }`}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-[#A2A2BA] bg-[#111726] p-2.5 rounded-lg border border-[#2C2C44]">
                  {isAr
                    ? "سيتم إرسال رمز أمان لمرة واحدة (OTP) مكون من 6 أرقام إلى بريدك المعتمد."
                    : "A 6-digit one-time security OTP will be sent to your registered admin email."}
                </div>

                <Button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full h-10 rounded-xl font-bold text-xs btn-primary-shine bg-gradient-to-r from-[#7FE87F] via-[#6FD86F] to-[#5FBF5F] text-[#080C14] hover:brightness-110 shadow-lg shadow-[#7FE87F]/20 cursor-pointer"
                >
                  {isForgotLoading ? (
                    <span>{isAr ? "جاري الإرسال..." : "Sending OTP..."}</span>
                  ) : (
                    <span>{t("auth.sendResetOtp")}</span>
                  )}
                </Button>
              </form>
            )}

            {/* Step 2: Enter OTP */}
            {forgotStep === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                <div className="bg-[#7FE87F]/10 border border-[#7FE87F]/30 rounded-lg p-2.5 text-[#7FE87F] text-xs font-semibold">
                  {t("auth.otpSentMessage")}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A2A2BA] block">
                    {t("auth.enterOtpLabel")}
                  </label>
                  <div className="relative">
                    <Smartphone className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E6E85] pointer-events-none ${
                      isAr ? "right-3" : "left-3"
                    }`} />
                    <Input
                      type="text"
                      maxLength={6}
                      required
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      placeholder="123456"
                      className={`h-10 text-center font-mono tracking-widest text-base font-extrabold bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F] ${
                        isAr ? "pr-9 pl-3" : "pl-9 pr-3"
                      }`}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full h-10 rounded-xl font-bold text-xs btn-primary-shine bg-gradient-to-r from-[#7FE87F] via-[#6FD86F] to-[#5FBF5F] text-[#080C14] hover:brightness-110 shadow-lg shadow-[#7FE87F]/20 cursor-pointer"
                >
                  {isForgotLoading ? (
                    <span>{isAr ? "جاري التحقق..." : "Verifying..."}</span>
                  ) : (
                    <span>{isAr ? "تحقق ومتابعة" : "Verify & Continue"}</span>
                  )}
                </Button>
              </form>
            )}

            {/* Step 3: Set New Password */}
            {forgotStep === "new_password" && (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A2A2BA] block">
                    {t("auth.newPasswordLabel")}
                  </label>
                  <div className="relative">
                    <Lock className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E6E85] pointer-events-none ${
                      isAr ? "right-3" : "left-3"
                    }`} />
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={isAr ? "12 خانة على الأقل" : "At least 12 characters"}
                      className={`h-10 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F] ${
                        isAr ? "pr-9 pl-9" : "pl-9 pr-9"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={`absolute top-1/2 -translate-y-1/2 text-[#6E6E85] hover:text-white cursor-pointer ${
                        isAr ? "left-3" : "right-3"
                      }`}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A2A2BA] block">
                    {t("auth.confirmPasswordLabel")}
                  </label>
                  <div className="relative">
                    <Lock className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E6E85] pointer-events-none ${
                      isAr ? "right-3" : "left-3"
                    }`} />
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={isAr ? "أعد إدخال كلمة المرور" : "Re-enter password"}
                      className={`h-10 text-xs bg-[#111726] border-[#2C2C44] focus:border-[#7FE87F] ${
                        isAr ? "pr-9 pl-3" : "pl-9 pr-3"
                      }`}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full h-10 rounded-xl font-bold text-xs btn-primary-shine bg-gradient-to-r from-[#7FE87F] via-[#6FD86F] to-[#5FBF5F] text-[#080C14] hover:brightness-110 shadow-lg shadow-[#7FE87F]/20 cursor-pointer"
                >
                  {isForgotLoading ? (
                    <span>{isAr ? "جاري الحفظ..." : "Saving..."}</span>
                  ) : (
                    <span>{t("auth.updatePasswordBtn")}</span>
                  )}
                </Button>
              </form>
            )}

            {/* Step 4: Success */}
            {forgotStep === "success" && (
              <div className="text-center space-y-4 py-2">
                <div className="w-12 h-12 rounded-full bg-[#7FE87F]/20 text-[#7FE87F] border border-[#7FE87F]/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    {isAr ? "تم تحديث كلمة المرور بنجاح" : "Password Updated Successfully"}
                  </h4>
                  <p className="text-xs text-[#A2A2BA] mt-1">
                    {t("auth.passwordResetSuccess")}
                  </p>
                </div>
                <Button
                  onClick={closeForgotModal}
                  className="w-full h-10 rounded-xl font-bold text-xs btn-primary-shine bg-gradient-to-r from-[#7FE87F] via-[#6FD86F] to-[#5FBF5F] text-[#080C14] hover:brightness-110 shadow-lg shadow-[#7FE87F]/20 cursor-pointer"
                >
                  {t("auth.backToLogin")}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
