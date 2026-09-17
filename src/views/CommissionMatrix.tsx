import React, { useState } from "react";
import {
  Percent,
  CheckCircle2,
  Settings2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "../components/ui/table";
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
    <div className="space-y-3.5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Percent className="h-4 w-4 text-[#7FE87F]" />
        <h2 className="text-base font-extrabold text-white">
          {isAr ? "الرسوم والعمولات" : "Rates & Fees"}
        </h2>
      </div>

      {/* Fee Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{isAr ? "طريقة الدفع" : "Payment Rail"}</TableHead>
            <TableHead>{isAr ? "النسبة (%)" : "Rate (%)"}</TableHead>
            <TableHead>{isAr ? "الرسم الثابت" : "Fixed (SAR)"}</TableHead>
            <TableHead>{isAr ? "الحد الأقصى" : "Cap"}</TableHead>
            <TableHead>{isAr ? "إجراء" : "Action"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feeTiers.map((tier) => {
            const isEditing = editingId === tier.id;
            return (
              <TableRow key={tier.id}>
                <TableCell>
                  <div className="font-bold text-white text-xs">{tier.paymentMethod}</div>
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.05"
                      value={rateInput}
                      onChange={(e) => setRateInput(parseFloat(e.target.value))}
                      className="w-20 h-7 text-xs bg-[#10182A] border-slate-800/80"
                    />
                  ) : (
                    <span className="font-extrabold text-[#7FE87F] text-xs">
                      {tier.ratePercentage.toFixed(2)}%
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.10"
                      value={fixedInput}
                      onChange={(e) => setFixedInput(parseFloat(e.target.value))}
                      className="w-20 h-7 text-xs bg-[#10182A] border-slate-800/80"
                    />
                  ) : (
                    <span className="font-semibold text-xs text-slate-200">SAR {tier.fixedFeeSar.toFixed(2)}</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-slate-400 text-xs">
                    {tier.capSar ? `SAR ${tier.capSar.toFixed(2)}` : "None"}
                  </span>
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => saveEdit(tier.id)}
                      className="h-7 px-2.5 text-xs gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{isAr ? "حفظ" : "Save"}</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(tier)}
                      className="h-7 px-2.5 text-xs bg-[#10182A] hover:bg-slate-800 gap-1"
                    >
                      <Settings2 className="h-3 w-3" />
                      <span>{isAr ? "تعديل" : "Edit"}</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
