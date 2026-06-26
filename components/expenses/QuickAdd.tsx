"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { ExpenseCategory } from "@/lib/types";

const CATEGORIES: ExpenseCategory[] = [
  "Food", "Transport", "Shopping", "Entertainment", "Health", "Utilities", "Other",
];

interface Props {
  onAdd: (desc: string, amount: number, category: ExpenseCategory) => void;
}

export function QuickAdd({ onAdd }: Props) {
  const [desc, setDesc]       = useState("");
  const [amount, setAmount]   = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");
  const [errors, setErrors]   = useState<{ desc?: string; amount?: string }>({});

  function handleAdd() {
    const newErrors: { desc?: string; amount?: string } = {};
    if (!desc.trim()) newErrors.desc = "Enter a description";
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) newErrors.amount = "Enter a valid amount";
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    onAdd(desc.trim(), parsed, category);
    setDesc("");
    setAmount("");
    setErrors({});
  }

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      <div className="text-[10px] font-medium uppercase tracking-widest text-ink-2 mb-3">
        Quick add
      </div>

      {/* Inputs row */}
      <div className="flex gap-2 mb-2.5">
        <div className="flex-1 flex flex-col gap-1">
          <input
            value={desc}
            onChange={(e) => { setDesc(e.target.value); setErrors((p) => ({ ...p, desc: undefined })); }}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="What did you spend on?"
            className={`w-full bg-bg-2 border rounded-md px-3 py-2 text-[13px] text-ink-0 placeholder:text-ink-2 outline-none transition-colors ${
              errors.desc ? "border-[var(--red)]" : "border-[var(--border)] focus:border-teal"
            }`}
          />
          {errors.desc && <span className="text-[11px] text-red">{errors.desc}</span>}
        </div>
        <div className="w-28 flex flex-col gap-1">
          <input
            type="number"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setErrors((p) => ({ ...p, amount: undefined })); }}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="₹ 0"
            className={`w-full bg-bg-2 border rounded-md px-3 py-2 text-[13px] font-mono text-teal placeholder:text-ink-2 outline-none transition-colors ${
              errors.amount ? "border-[var(--red)]" : "border-[var(--border)] focus:border-teal"
            }`}
          />
          {errors.amount && <span className="text-[11px] text-red">{errors.amount}</span>}
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-2.5 py-1 rounded-full text-[12px] border transition-colors ${
              category === cat
                ? "bg-teal-ghost border-teal text-teal"
                : "bg-bg-2 border-[var(--border)] text-ink-1 hover:border-[var(--border2)] hover:text-ink-0"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add button */}
      <button
        onClick={handleAdd}
        className="flex items-center gap-1.5 bg-teal text-black text-[13px] font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
      >
        <Plus size={14} />
        Add expense
      </button>
    </div>
  );
}
