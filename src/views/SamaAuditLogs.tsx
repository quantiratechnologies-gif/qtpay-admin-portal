import React from "react";
import {
  FileCheck,
  ShieldCheck,
  Search,
  Download,
  Lock,
  History
} from "lucide-react";
import { StatusBadge } from "../components/Badge";
import type { SamaAuditLog } from "../types";

interface SamaAuditLogsProps {
  logs: SamaAuditLog[];
  lang: "en" | "ar";
}

export const SamaAuditLogs: React.FC<SamaAuditLogsProps> = ({ logs, lang }) => {
  const isAr = lang === "ar";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "14px"
      }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF" }}>
            {isAr ? "سجل الامتثال والتدقيق الإداري الصارم (SAMA Immutable Audit)" : "SAMA Compliance & Immutable Audit Log"}
          </h2>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            {isAr ? "سجل مشفر وغير قابل للتعديل لجميع العمليات الإدارية، التسويات، وتجميد الحسابات" : "Tamper-evident administrative action ledger required by Saudi Central Bank cyber regulations"}
          </p>
        </div>

        <button className="btn-secondary">
          <Download size={14} /> {isAr ? "تنزيل تقرير التدقيق الموثق" : "Export Official Audit Packet"}
        </button>
      </div>

      {/* Logs Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? "التوقيت (توقيت الرياض)" : "Timestamp (AST)"}</th>
              <th>{isAr ? "المسؤول / البريد" : "Admin User & Email"}</th>
              <th>{isAr ? "الإجراء والتصنيف" : "Action & Category"}</th>
              <th>{isAr ? "الكيان المستهدف" : "Target Entity"}</th>
              <th>{isAr ? "تفاصيل العملية" : "Details"}</th>
              <th>{isAr ? "عنوان IP" : "Source IP"}</th>
              <th>{isAr ? "النتيجة" : "Result"}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>
                  <div style={{ fontFamily: "monospace", fontSize: "11.5px", color: "#94A3B8" }}>{log.timestamp}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{log.adminName}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{log.adminEmail}</div>
                </td>
                <td>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background: "rgba(56, 189, 248, 0.15)",
                    color: "#38BDF8"
                  }}>
                    {log.action}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: "#7FE87F" }}>{log.targetEntity}</div>
                </td>
                <td>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", maxWidth: "340px" }}>{log.details}</div>
                </td>
                <td>
                  <div style={{ fontFamily: "monospace", fontSize: "11px" }}>{log.ipAddress}</div>
                </td>
                <td>
                  <StatusBadge status={log.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
