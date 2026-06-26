"use client";

import { useSettings } from "@/hooks/useSettings";

export function MetricGrid() {
  const { settings, loading } = useSettings();

  const totalExpenses  = 0; // expenses come from useExpenses, not profile
  const monthlySavings = settings.income_monthly - (settings.monthly_budget || 0);
  const savingsRate    = settings.income_monthly > 0
    ? Math.round((monthlySavings / settings.income_monthly) * 100)
    : 0;

  const metrics = [
    {
      label:     "Monthly income",
      value:     loading ? "—" : `₹${(settings.income_monthly / 1000).toFixed(0)}K`,
      delta:     "Fixed salary",
      deltaType: "neutral",
    },
    {
      label:     "Monthly savings",
      value:     loading ? "—" : `₹${(monthlySavings / 1000).toFixed(1)}K`,
      delta:     `${savingsRate}% savings rate`,
      deltaType: savingsRate >= settings.savings_target_pct ? "pos" : "warn",
    },
    {
      label:     "Emergency fund target",
      value:     loading ? "—" : `${settings.emergency_fund_target_months} mo`,
      delta:     "Target coverage",
      deltaType: "warn",
    },
    {
      label:     "Debt remaining",
      value:     loading ? "—" : settings.debt_amount > 0
        ? `₹${(settings.debt_amount / 100000).toFixed(1)}L`
        : "None",
      delta:     settings.debt_amount > 0 ? `${settings.debt_interest_rate}% p.a.` : "Debt free 🎉",
      deltaType: settings.debt_amount > 0 ? "neg" : "pos",
    },
  ];

  const deltaClass: Record<string, string> = {
    pos:     "text-green font-mono",
    warn:    "text-amber font-mono",
    neg:     "text-red font-mono",
    neutral: "text-ink-2 font-mono",
  };

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {metrics.map((m, i) => (
        <div key={i} className="bg-bg-2 border border-[var(--border)] rounded-md px-4 py-3">
          <div className="text-[11px] text-ink-2 mb-2">{m.label}</div>
          <div className="font-mono text-[22px] font-medium text-ink-0 leading-none mb-2">
            {m.value}
          </div>
          <div className={`text-[11px] ${deltaClass[m.deltaType]}`}>{m.delta}</div>
        </div>
      ))}
    </div>
  );
}
