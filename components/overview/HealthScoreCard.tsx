"use client";

import { useSettings } from "@/hooks/useSettings";

export function HealthScoreCard() {
  const { settings, loading } = useSettings();

  // Derive a basic health score from real data
  const income = settings.income_monthly;
  const budget = settings.monthly_budget;
  const savingsRate  = income > 0 ? ((income - budget) / income) * 100 : 0;
  const debtRatio    = income > 0 ? (settings.debt_amount / income) : 0;
  const efMonths     = settings.emergency_fund_target_months;

  // Simple score: savings rate (40pts) + emergency fund (30pts) + no debt (30pts)
  const savingsScore  = Math.min(40, (savingsRate / settings.savings_target_pct) * 40);
  const efScore       = Math.min(30, (efMonths / 6) * 30);
  const debtScore     = Math.max(0, 30 - Math.min(30, debtRatio * 10));
  const score         = loading ? 0 : Math.round(savingsScore + efScore + debtScore);

  const radius        = 26;
  const circumference = 2 * Math.PI * radius;
  const dash          = (score / 100) * circumference;

  const tags = [];
  if (savingsRate >= settings.savings_target_pct) tags.push({ label: "Good savings", color: "teal" });
  else tags.push({ label: "Low savings", color: "amber" });
  if (efMonths >= 6) tags.push({ label: "Safe e-fund", color: "teal" });
  else tags.push({ label: "Low e-fund", color: "amber" });
  if (settings.debt_amount === 0) tags.push({ label: "Debt free", color: "teal" });
  else tags.push({ label: "Has debt", color: "red" });

  const tagClass: Record<string, string> = {
    teal:  "bg-teal-ghost text-teal",
    amber: "bg-amber/10 text-amber",
    red:   "bg-red/10 text-red",
  };

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      <div className="text-[10px] font-medium uppercase tracking-widest text-ink-2 mb-3">
        Health score
      </div>
      <div className="flex items-center gap-4">
        <svg width="68" height="68" viewBox="0 0 68 68" className="flex-shrink-0">
          <circle cx="34" cy="34" r={radius} fill="none" stroke="var(--bg3)" strokeWidth="6" />
          <circle cx="34" cy="34" r={radius} fill="none" stroke="var(--teal)" strokeWidth="6"
            strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round"
            transform="rotate(-90 34 34)" />
          <text x="34" y="39" textAnchor="middle" fontSize="15" fontWeight="500"
            fontFamily="var(--font-mono)" fill="var(--teal)">
            {loading ? "—" : score}
          </text>
        </svg>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-ink-2 mb-2">
            {loading ? "Loading…" : "Based on your profile"}
          </div>
          <div className="flex flex-wrap gap-1">
            {tags.map((t) => (
              <span key={t.label} className={`text-[11px] px-2 py-0.5 rounded-full ${tagClass[t.color]}`}>
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
