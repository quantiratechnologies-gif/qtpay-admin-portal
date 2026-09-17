import React, { useState } from "react";
import {
  Percent,
  CheckCircle2,
  Settings2,
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
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Percent size={18} color="#7FE87F" />
        <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF" }}>
          {isAr ? "الرسوم والعمولات" : "Rates & Fees"}
        </h2>
      </div>

      {/* Fee Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? "طريقة الدفع" : "Payment Rail"}</th>
              <th>{isAr ? "النسبة (%)" : "Rate (%)"}</th>
              <th>{isAr ? "الرسم الثابت" : "Fixed (SAR)"}</th>
              <th>{isAr ? "الحد الأقصى" : "Cap"}</th>
              <th>{isAr ? "إجراء" : "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {feeTiers.map((tier) => {
              const isEditing = editingId === tier.id;
              return (
                <tr key={tier.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "12.5px" }}>{tier.paymentMethod}</div>
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.05"
                        value={rateInput}
                        onChange={(e) => setRateInput(parseFloat(e.target.value))}
                        className="input-field"
                        style={{ width: "70px", height: "28px", fontSize: "11.5px" }}
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
                        style={{ width: "70px", height: "28px", fontSize: "11.5px" }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600 }}>SAR {tier.fixedFeeSar.toFixed(2)}</span>
                    )}
                  </td>
                  <td>
                    <span style={{ color: "var(--text-secondary)", fontSize: "11.5px" }}>
                      {tier.capSar ? `SAR ${tier.capSar.toFixed(2)}` : "None"}
                    </span>
                  </td>
                  <td>
                    {isEditing ? (
                      <button
                        onClick={() => saveEdit(tier.id)}
                        className="btn-primary"
                        style={{ padding: "3px 8px", fontSize: "11px" }}
                      >
                        <CheckCircle2 size={11} /> {isAr ? "حفظ" : "Save"}
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(tier)}
                        className="btn-secondary"
                        style={{ padding: "3px 8px", fontSize: "11px" }}
                      >
                        <Settings2 size={11} /> {isAr ? "تعديل" : "Edit"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
