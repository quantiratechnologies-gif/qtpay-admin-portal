import React, { useState } from "react";
import {
  Percent,
  CheckCircle2,
  Settings2,
  Sliders,
  Sparkles,
  Calculator
} from "lucide-react";
import type { CommissionFeeTier } from "../types";

interface CommissionMatrixProps {
  feeTiers: CommissionFeeTier[];
  onUpdateFee: (id: string, newRate: number, newFixed: number) => void;
  lang: "en" | "ar";
}

export const CommissionMatrix: React.FC<CommissionMatrixProps> = ({
  feeTiers,
  onUpdateFee,
  lang
}) => {
  const isAr = lang === "ar";
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rateInput, setRateInput] = useState<number>(0);
  const [fixedInput, setFixedInput] = useState<number>(0);

  // Live calculator test
  const [calcAmount, setCalcAmount] = useState<number>(250);

  const startEdit = (tier: CommissionFeeTier) => {
    setEditingId(tier.id);
    setRateInput(tier.ratePercentage);
    setFixedInput(tier.fixedFeeSar);
  };

  const saveEdit = (id: string) => {
    onUpdateFee(id, rateInput, fixedInput);
    setEditingId(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#FFFFFF" }}>
          {isAr ? "مصفوفة العمولات ورسوم العمليات (MDR)" : "MDR Fee Matrix & Platform Rates"}
        </h2>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
          {isAr ? "تحديد نسبة العمولة والرسوم الثابتة لكل وسيلة دفع (مدى، فيزا، أبل باي، سريع)" : "Dynamic variable rate % and fixed SAR fee schedules per payment rail"}
        </p>
      </div>

      {/* Fee Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? "وسيلة الدفع" : "Payment Rail"}</th>
              <th>{isAr ? "نسبة العمولة (%)" : "Variable Rate (%)"}</th>
              <th>{isAr ? "الرسم الثابت" : "Fixed Fee (SAR)"}</th>
              <th>{isAr ? "الحد الأقصى" : "Cap Limit"}</th>
              <th>{isAr ? "تاريخ التحديث" : "Last Updated"}</th>
              <th>{isAr ? "الإجراء" : "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {feeTiers.map((tier) => {
              const isEditing = editingId === tier.id;
              return (
                <tr key={tier.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "13px" }}>{tier.paymentMethod}</div>
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.05"
                        value={rateInput}
                        onChange={(e) => setRateInput(parseFloat(e.target.value))}
                        className="input-field"
                        style={{ width: "80px", height: "30px", fontSize: "12px" }}
                      />
                    ) : (
                      <span style={{ fontWeight: 800, color: "#7FE87F" }}>{tier.ratePercentage.toFixed(2)}%</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.10"
                        value={fixedInput}
                        onChange={(e) => setFixedInput(parseFloat(e.target.value))}
                        className="input-field"
                        style={{ width: "80px", height: "30px", fontSize: "12px" }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600 }}>SAR {tier.fixedFeeSar.toFixed(2)}</span>
                    )}
                  </td>
                  <td>
                    <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                      {tier.capSar ? `SAR ${tier.capSar.toFixed(2)} (SAMA Cap)` : "No Cap"}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{tier.lastUpdated}</span>
                  </td>
                  <td>
                    {isEditing ? (
                      <button
                        onClick={() => saveEdit(tier.id)}
                        className="btn-primary"
                        style={{ padding: "4px 10px", fontSize: "11.5px" }}
                      >
                        <CheckCircle2 size={12} /> {isAr ? "حفظ" : "Save"}
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(tier)}
                        className="btn-secondary"
                        style={{ padding: "4px 10px", fontSize: "11.5px" }}
                      >
                        <Settings2 size={12} /> {isAr ? "تعديل" : "Edit"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Realtime Fee Calculator Preview */}
      <div className="admin-card">
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
          <Calculator size={16} color="#7FE87F" />
          <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#FFFFFF" }}>
            {isAr ? "حاسبة الرسوم التقديرية المباشرة" : "Live MDR Fee Simulator"}
          </h3>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <div>
            <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
              Sample Transaction Amount (SAR)
            </label>
            <input
              type="number"
              value={calcAmount}
              onChange={(e) => setCalcAmount(parseFloat(e.target.value) || 0)}
              className="input-field"
              style={{ width: "160px", height: "36px", fontWeight: 700 }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", flex: 1 }}>
            {feeTiers.map((t) => {
              const variable = calcAmount * (t.ratePercentage / 100);
              const total = Math.min(t.capSar ? t.capSar : Infinity, variable + t.fixedFeeSar);
              return (
                <div
                  key={t.id}
                  style={{
                    padding: "8px 12px",
                    background: "#121A2D",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    flex: 1,
                    minWidth: "120px"
                  }}
                >
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.paymentMethod.split(" ")[0]}</div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#7FE87F", marginTop: "2px" }}>
                    SAR {total.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
