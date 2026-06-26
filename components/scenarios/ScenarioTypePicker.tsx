"use client";

import { TrendingUp, Scissors, ShoppingCart } from "lucide-react";
import type { ScenarioType } from "@/lib/types";

const TYPES: {
  type: ScenarioType;
  label: string;
  sublabel: string;
  Icon: React.ElementType;
}[] = [
  { type: "income_change",     label: "Income change", sublabel: "Raise, bonus, new job",       Icon: TrendingUp },
  { type: "expense_reduction", label: "Expense cut",   sublabel: "Reduce a spending category",  Icon: Scissors },
  { type: "one_time_purchase", label: "Big purchase",  sublabel: "Car, appliance, loan",         Icon: ShoppingCart },
];

interface Props {
  selected: ScenarioType;
  onChange: (t: ScenarioType) => void;
}

export function ScenarioTypePicker({ selected, onChange }: Props) {
  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      <div className="text-[10px] font-medium uppercase tracking-widest text-ink-2 mb-3">
        Scenario type
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {TYPES.map(({ type, label, sublabel, Icon }) => {
          const active = selected === type;
          return (
            <button
              key={type}
              onClick={() => onChange(type)}
              className={`flex flex-col items-center gap-2 py-4 px-3 rounded-lg border text-center transition-all ${
                active
                  ? "border-teal bg-teal-ghost2"
                  : "border-[var(--border)] bg-bg-2 hover:border-[var(--border2)] hover:bg-bg-3"
              }`}
            >
              <Icon size={20} style={{ color: active ? "var(--teal)" : "var(--text2)" }} />
              <div>
                <div
                  className="text-[13px] font-medium leading-tight"
                  style={{ color: active ? "var(--teal)" : "var(--text0)" }}
                >
                  {label}
                </div>
                <div className="text-[11px] text-ink-2 mt-0.5 leading-tight">{sublabel}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
