"use client";

import { useExpenses } from "@/hooks/useExpenses";

export function ExpenseBarCard() {
  const { byCategory, totalThisMonth } = useExpenses();
  const expenses = byCategory();
  const total    = totalThisMonth();

  if (total === 0) {
    return (
      <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4 flex items-center justify-center">
        <p className="text-[12px] text-ink-2">No expenses logged yet</p>
      </div>
    );
  }

  const maxVal = Math.max(...Object.values(expenses));
  const categories = Object.entries(expenses)
    .sort(([, a], [, b]) => b - a)
    .map(([key, amount]) => ({
      label:  key.charAt(0).toUpperCase() + key.slice(1),
      amount,
      pct:    Math.round((amount / maxVal) * 100),
    }));

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      <div className="text-[10px] font-medium uppercase tracking-widest text-ink-2 mb-3">
        Spending by category
      </div>
      <div className="flex flex-col gap-2.5">
        {categories.map((c) => (
          <div key={c.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] text-ink-1">{c.label}</span>
              <span className="font-mono text-[12px] text-ink-0">
                ₹{c.amount.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="h-[4px] bg-bg-3 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-teal transition-all duration-500"
                style={{ width: `${c.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
