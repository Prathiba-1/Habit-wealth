"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Expense, ExpenseCategory } from "@/lib/types";

const CAT_COLORS: Record<string, string> = {
  Food:          "var(--teal)",
  Transport:     "var(--red)",
  Shopping:      "var(--amber)",
  Entertainment: "#a78bfa",
  Health:        "var(--green)",
  Utilities:     "#60a5fa",
  Other:         "var(--text2)",
};

const FILTERS: (ExpenseCategory | "All")[] = [
  "All", "Food", "Transport", "Shopping", "Entertainment", "Health", "Utilities", "Other",
];

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseLog({ expenses, onDelete }: Props) {
  const [filter, setFilter] = useState<ExpenseCategory | "All">("All");

  const filtered =
    filter === "All" ? expenses : expenses.filter((e) => e.category === filter);

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] font-medium uppercase tracking-widest text-ink-2">
          Recent expenses
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] border transition-colors ${
                filter === f
                  ? "bg-teal-ghost border-teal text-teal"
                  : "bg-transparent border-[var(--border)] text-ink-2 hover:border-[var(--border2)] hover:text-ink-1"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-8 text-center text-[13px] text-ink-2">
          No expenses yet — add your first one above
        </div>
      ) : (
        <div>
          {filtered.map((e, i) => (
            <div
              key={e.id}
              className={`flex items-center gap-3 py-2.5 ${
                i < filtered.length - 1 ? "border-b border-[var(--border)]" : ""
              }`}
            >
              {/* Category dot */}
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: CAT_COLORS[e.category] || "var(--text2)" }}
              />

              {/* Description + meta */}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-ink-0 truncate">{e.description}</div>
                <div className="text-[11px] text-ink-2">
                  {e.category} · {e.date || e.expense_date}
                </div>
              </div>

              {/* Amount */}
              <div className="font-mono text-[13px] font-medium text-ink-0 flex-shrink-0">
                ₹{e.amount.toLocaleString("en-IN")}
              </div>

              {/* Delete */}
              <button
                onClick={() => onDelete(e.id)}
                className="w-6 h-6 flex items-center justify-center rounded text-ink-2 hover:bg-bg-2 hover:text-red transition-colors flex-shrink-0"
                aria-label="Delete expense"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
