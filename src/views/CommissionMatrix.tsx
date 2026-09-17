import React, { useState } from "react";
import {
  Percent,
  CheckCircle2,
  Settings2,
  Sliders,
  Sparkles
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
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF" }}>
          {isAr ? "مصفوفة العمولات ورسوم العمليات (MDR Matrix)" : "Merchant Discount Rate (MDR) & Fee Matrix"}
        </h2>
        <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
          {isAr ? "تحديد نسبة العمولة والرسوم الثابتة لبطاقات مدى، فيزا، ماستركارد، وأبل باي وسريع" : "Configure dynamic interchange and merchant commission rates per payment rail"}
        </p>
      </div>

      {/* Fee Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? "وسيلة الدفع / الشبكة" : "Payment Rail / Scheme"}</th>
              <th>{isAr ? "نسبة العمولة (%)" : "Variable MDR Rate (%)"}</th>
              <th>{isAr ? "الرسم الثابت (ر.س)" : "Fixed Fee (SAR)"}</th>
              <th>{isAr ? "الحد الأقصى للعمولة" : "Cap Limit (SAR)"}</th>
              <th>{isAr ? "تاريخ التحديث" : "Last Updated"}</th>
              <th>{isAr ? "الإجراء" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {feeTiers.map((tier) => {
              const isEditing = editingId === tier.id;
              return (
                <tr key={tier.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{tier.paymentMethod}</div>
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.05"
                        value={rateInput}
                        onChange={(e) => setRateInput(parseFloat(e.target.value))}
                        className="input-field"
                        style={{ width: "90px" }}
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
                        style={{ width: "90px" }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600 }}>SAR {tier.fixedFeeSar.toFixed(2)}</span>
                    )}
                  </td>
                  <td>
                    <span style={{ color: "var(--text-secondary)" }}>
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
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        <CheckCircle2 size={13} /> {isAr ? "حفظ" : "Save"}
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(tier)}
                        className="btn-secondary"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        <Settings2 size={13} /> {isAr ? "تعديل" : "Edit Rates"}
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
