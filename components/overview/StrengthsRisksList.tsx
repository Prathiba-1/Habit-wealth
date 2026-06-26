"use client";

import { useSettings } from "@/hooks/useSettings";
import { Check } from "lucide-react";

export function StrengthsRisksList() {
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="bg-bg-1 border border-[var(--border)] rounded-lg p-4 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  const income       = settings.income_monthly;
  const budget       = settings.monthly_budget;
  const savingsRate  = income > 0 ? Math.round(((income - budget) / income) * 100) : 0;
  const efMonths     = settings.emergency_fund_target_months;
  const hasDebt      = settings.debt_amount > 0;

  const strengths: { title: string; desc: string }[] = [];
  const risks:     { title: string; desc: string; severity: string }[] = [];

  // Strengths
  if (savingsRate >= settings.savings_target_pct)
    strengths.push({ title: "On savings target", desc: `Saving ${savingsRate}% of income, meeting your ${settings.savings_target_pct}% goal.` });
  if (!hasDebt)
    strengths.push({ title: "Debt free", desc: "No outstanding debt — full income goes toward your goals." });
  if (efMonths >= 6)
    strengths.push({ title: "Strong safety net", desc: `${efMonths}-month emergency fund target is well above the 3-month minimum.` });
  if (strengths.length === 0)
    strengths.push({ title: "Getting started", desc: "Complete your financial profile to see personalised strengths." });

  // Risks
  if (savingsRate < settings.savings_target_pct && income > 0)
    risks.push({ title: "Below savings target", desc: `Saving ${savingsRate}% but targeting ${settings.savings_target_pct}%. Close the gap by trimming discretionary spend.`, severity: "medium" });
  if (efMonths < 3)
    risks.push({ title: "Low emergency coverage", desc: `${efMonths} months is below the 3-month minimum. Prioritise building this up first.`, severity: "high" });
  if (hasDebt && settings.debt_interest_rate > 12)
    risks.push({ title: "High-interest debt", desc: `${settings.debt_interest_rate}% p.a. on ₹${(settings.debt_amount / 100000).toFixed(1)}L is expensive. Consider paying this down before investing.`, severity: "high" });
  if (risks.length === 0)
    risks.push({ title: "Looking good", desc: "No major risks detected. Keep maintaining your current habits.", severity: "low" });

  const severityColor: Record<string, string> = {
    high:   "var(--red)",
    medium: "var(--amber)",
    low:    "var(--text2)",
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
        <div className="text-[10px] font-medium uppercase tracking-widest text-ink-2 mb-3">Strengths</div>
        <div className="flex flex-col gap-2.5">
          {strengths.map((s, i) => (
            <div key={i} className="flex gap-2">
              <Check size={13} className="text-teal mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[12px] font-medium text-ink-0">{s.title}</div>
                <div className="text-[11px] text-ink-2 mt-0.5">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
        <div className="text-[10px] font-medium uppercase tracking-widest text-ink-2 mb-3">Risks</div>
        <div className="flex flex-col gap-2.5">
          {risks.map((r, i) => (
            <div key={i} className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: severityColor[r.severity] }} />
              <div>
                <div className="text-[12px] font-medium text-ink-0">{r.title}</div>
                <div className="text-[11px] text-ink-2 mt-0.5">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
