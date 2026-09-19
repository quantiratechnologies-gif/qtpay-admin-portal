import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { Language, TranslationSchema } from "./types";
import { en } from "./en";
import { ar } from "./ar";

interface LanguageContextType {
  lang: Language;
  isAr: boolean;
  dir: "ltr" | "rtl";
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translations: TranslationSchema;
  formatCurrency: (amount: number, options?: { hideCurrency?: boolean; decimals?: number }) => string;
  formatNumber: (num: number, options?: { decimals?: number }) => string;
  formatPercent: (num: number, options?: { showSign?: boolean; decimals?: number }) => string;
  formatDate: (
    dateInput: string | Date | number,
    formatStyle?: "date" | "time" | "datetime" | "short"
  ) => string;
  formatRelativeTime: (dateInput: string | Date | number) => string;
  translateStatus: (status: string) => string;
  translatePaymentMethod: (method: string) => string;
  translateChannel: (channel: string) => string;
  translateRole: (role: string) => string;
  translateCategory: (category: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "qtpay_admin_lang";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "ar" || saved === "en") return saved;
    } catch {
      // ignore
    }
    return "en";
  });

  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "ar" : "en");
  };

  // Sync HTML dir and classes
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    if (isAr) {
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
    }
  }, [lang, dir, isAr]);

  const translations = useMemo(() => (isAr ? ar : en), [isAr]);

  // Nested key translation lookup helper
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let current: any = translations;
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        // Fallback to English if missing in current
        let fallback: any = en;
        for (const fbKey of keys) {
          if (fallback && typeof fallback === "object" && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            return key;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== "string") return key;

    if (params) {
      return Object.entries(params).reduce((acc, [pKey, pVal]) => {
        return acc.replace(new RegExp(`{{${pKey}}}`, "g"), String(pVal));
      }, current);
    }

    return current;
  };

  // Centralized currency formatting
  const formatCurrency = (
    amount: number,
    options: { hideCurrency?: boolean; decimals?: number } = {}
  ): string => {
    const { hideCurrency = false, decimals = 2 } = options;
    const num = Number(amount) || 0;
    const formattedNum = num.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    if (hideCurrency) return formattedNum;

    if (isAr) {
      return `${formattedNum} ر.س`;
    }
    return `SAR ${formattedNum}`;
  };

  // Locale-aware number formatting
  const formatNumber = (num: number, options: { decimals?: number } = {}): string => {
    const val = Number(num) || 0;
    const { decimals } = options;
    return val.toLocaleString("en-US", {
      minimumFractionDigits: decimals !== undefined ? decimals : 0,
      maximumFractionDigits: decimals !== undefined ? decimals : 2
    });
  };

  // Percentage formatting
  const formatPercent = (
    num: number,
    options: { showSign?: boolean; decimals?: number } = {}
  ): string => {
    const val = Number(num) || 0;
    const { showSign = true, decimals = 1 } = options;
    const formatted = val.toFixed(decimals);
    const sign = showSign && val > 0 ? "+" : "";
    return `${sign}${formatted}%`;
  };

  // Date formatting
  const formatDate = (
    dateInput: string | Date | number,
    formatStyle: "date" | "time" | "datetime" | "short" = "datetime"
  ): string => {
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return String(dateInput);

      const locale = isAr ? "ar-SA" : "en-US";

      if (formatStyle === "time") {
        return new Intl.DateTimeFormat(locale, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        }).format(date);
      }

      if (formatStyle === "date") {
        return new Intl.DateTimeFormat(locale, {
          year: "numeric",
          month: "short",
          day: "numeric"
        }).format(date);
      }

      if (formatStyle === "short") {
        return new Intl.DateTimeFormat(locale, {
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }).format(date);
      }

      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }).format(date);
    } catch {
      return String(dateInput);
    }
  };

  // Relative time helper
  const formatRelativeTime = (dateInput: string | Date | number): string => {
    try {
      const date = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
      if (isNaN(date.getTime())) return String(dateInput);

      const diffSecs = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diffSecs < 60) {
        return isAr ? "الآن" : "Just now";
      }
      const diffMins = Math.floor(diffSecs / 60);
      if (diffMins < 60) {
        return isAr ? `منذ ${diffMins} دقيقة` : `${diffMins} mins ago`;
      }
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        return isAr ? `منذ ${diffHours} ساعة` : `${diffHours} hours ago`;
      }
      const diffDays = Math.floor(diffHours / 24);
      return isAr ? `منذ ${diffDays} يوم` : `${diffDays} days ago`;
    } catch {
      return String(dateInput);
    }
  };

  // Translate status enum
  const translateStatus = (status: string): string => {
    const map: Record<string, { en: string; ar: string }> = {
      active: { en: "Active", ar: "نشط" },
      inactive: { en: "Inactive", ar: "غير نشط" },
      pending: { en: "Pending", ar: "قيد المراجعة" },
      pending_kyb: { en: "Pending KYB", ar: "قيد تدقيق KYB" },
      action_required: { en: "Action Required", ar: "مطلوب إجراء" },
      suspended: { en: "Suspended", ar: "معلق" },
      blacklisted: { en: "Blacklisted", ar: "محظور" },
      settled: { en: "Settled", ar: "تمت التسوية" },
      refunded: { en: "Refunded", ar: "مسترجع" },
      flagged: { en: "Flagged", ar: "مشتبه به" },
      completed: { en: "Completed", ar: "مكتمل" },
      processing: { en: "Processing", ar: "قيد المعالجة" },
      held: { en: "Held", ar: "محجوز" },
      failed: { en: "Failed", ar: "فاشل" },
      scheduled: { en: "Scheduled", ar: "مجدول" },
      verified: { en: "Verified", ar: "موثق" },
      unverified: { en: "Unverified", ar: "غير موثق" },
      rejected: { en: "Rejected", ar: "مرفوض" },
      online: { en: "Online", ar: "متصل" },
      offline: { en: "Offline", ar: "غير متصل" },
      decommissioned: { en: "Decommissioned", ar: "خارج الخدمة" }
    };
    const s = status?.toLowerCase();
    if (map[s]) {
      return isAr ? map[s].ar : map[s].en;
    }
    return status;
  };

  // Translate payment method enum
  const translatePaymentMethod = (method: string): string => {
    const map: Record<string, { en: string; ar: string }> = {
      mada: { en: "mada", ar: "مدى" },
      apple_pay: { en: "Apple Pay", ar: "أبل باي" },
      visa: { en: "Visa", ar: "فيزا" },
      mastercard: { en: "Mastercard", ar: "ماستركارد" },
      sarie_instant: { en: "Sarie Instant", ar: "سريع الفوري" }
    };
    const m = method?.toLowerCase();
    if (map[m]) {
      return isAr ? map[m].ar : map[m].en;
    }
    return method;
  };

  // Translate transaction channel enum
  const translateChannel = (channel: string): string => {
    const map: Record<string, { en: string; ar: string }> = {
      pos_softpos: { en: "SoftPOS (Tap-to-Phone)", ar: "نقاط البيع (SoftPOS)" },
      consumer_p2p: { en: "Consumer Sarie P2P", ar: "حوالات سريع (P2P)" },
      ecommerce_checkout: { en: "E-Commerce Gateway", ar: "بوابة الدفع الإلكتروني" }
    };
    const c = channel?.toLowerCase();
    if (map[c]) {
      return isAr ? map[c].ar : map[c].en;
    }
    return channel;
  };

  // Translate administrative roles
  const translateRole = (role: string): string => {
    const map: Record<string, { en: string; ar: string }> = {
      superadmin: { en: "Super Administrator", ar: "المدير العام الأعلى" },
      compliance_officer: { en: "SAMA Compliance Officer", ar: "مسؤول الامتثال لساما" },
      settlement_manager: { en: "Settlement Manager", ar: "مدير التسويات" },
      risk_analyst: { en: "Fraud & AML Analyst", ar: "محلل المخاطر وغسل الأموال" },
      support_lead: { en: "Operations Support Lead", ar: "رئيس الدعم والعمليات" }
    };
    const r = role?.toLowerCase();
    if (map[r]) {
      return isAr ? map[r].ar : map[r].en;
    }
    return role;
  };

  // Translate business categories
  const translateCategory = (category: string): string => {
    const map: Record<string, { en: string; ar: string }> = {
      "Food & Beverage (MCC 5812)": { en: "Food & Beverage (MCC 5812)", ar: "المطاعم والمقاهي (MCC 5812)" },
      "Luxury & Retail (MCC 5977)": { en: "Luxury & Retail (MCC 5977)", ar: "العطور والتجزئة الفاخرة (MCC 5977)" },
      "Groceries & Supermarket (MCC 5411)": { en: "Groceries & Supermarket (MCC 5411)", ar: "السوبرماركت والمواد الغذائية (MCC 5411)" },
      "Electronics (MCC 5732)": { en: "Electronics (MCC 5732)", ar: "الأجهزة والإلكترونيات (MCC 5732)" },
      "Automotive & Travel (MCC 7512)": { en: "Automotive & Travel (MCC 7512)", ar: "السيارات وتأجير المركبات (MCC 7512)" }
    };
    if (map[category]) {
      return isAr ? map[category].ar : map[category].en;
    }
    return category;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        isAr,
        dir,
        setLang,
        toggleLang,
        t,
        translations,
        formatCurrency,
        formatNumber,
        formatPercent,
        formatDate,
        formatRelativeTime,
        translateStatus,
        translatePaymentMethod,
        translateChannel,
        translateRole,
        translateCategory
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
