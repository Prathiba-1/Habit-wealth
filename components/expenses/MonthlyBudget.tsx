"use client";

import { mockProfile } from "@/lib/mock-data";

interface Props {
  totalSpent: number;
}

export function MonthlyBudget({ totalSpent }: Props) {
  const budget    = mockProfile.monthly_budget;
  const remaining = Math.max(0, budget - totalSpent);
  const pct       = Math.min(100, Math.round((totalSpent / budget) * 100));

  const barColor =
    pct > 80 ? "var(--red)" : pct > 60 ? "var(--amber)" : "var(--teal)";
  const remColor =
    pct > 80 ? "var(--red)" : pct > 60 ? "var(--amber)" : "var(--green)";

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      <div className="text-[10px] font-medium uppercase tracking-widest text-ink-2 mb-3">
        Monthly budget
      </div>

      <div className="flex justify-between items-end mb-3">
        <div>
          <div className="text-[11px] text-ink-2 mb-1">Spent so far</div>
          <div className="font-mono text-[22px] font-medium text-ink-0 leading-none">
            ₹{totalSpent.toLocaleString("en-IN")}
          </div>
          <div className="font-mono text-[11px] text-ink-2 mt-1">
            {pct}% of ₹{budget.toLocaleString("en-IN")} budget
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-ink-2 mb-1">Remaining</div>
          <div
            className="font-mono text-[22px] font-medium leading-none"
            style={{ color: remColor }}
          >
            ₹{remaining.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[5px] bg-bg-3 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
    </div>
  );
}
