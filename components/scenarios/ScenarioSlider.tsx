"use client";

import type { ScenarioType } from "@/lib/types";

interface SliderConfig {
  min: number;
  max: number;
  step: number;
  default: number;
  label: string;
  rangeLabel: string;
  dispFn: (v: number) => string;
  descFn: (v: number) => string;
}

export const SLIDER_CONFIGS: Record<ScenarioType, SliderConfig> = {
  income_change: {
    min: 5, max: 100, step: 5, default: 20,
    label: "Salary change",
    rangeLabel: "Raise amount",
    dispFn: (v) => `+${v}%`,
    descFn: (v) =>
      `A ${v}% raise adds ₹${Math.round(92000 * v / 100).toLocaleString("en-IN")}/mo to your take-home.`,
  },
  expense_reduction: {
    min: 500, max: 15000, step: 500, default: 5000,
    label: "Expense reduction",
    rangeLabel: "Monthly cut",
    dispFn: (v) => `-₹${v.toLocaleString("en-IN")}`,
    descFn: (v) =>
      `Cutting ₹${v.toLocaleString("en-IN")}/mo frees up savings immediately.`,
  },
  one_time_purchase: {
    min: 100000, max: 5000000, step: 100000, default: 500000,
    label: "One-time purchase",
    rangeLabel: "Purchase cost",
    dispFn: (v) => `₹${(v / 100000).toFixed(0)}L`,
    descFn: (v) =>
      `A ₹${(v / 100000).toFixed(0)}L purchase on EMI adds ~₹${Math.round(v * 0.02074).toLocaleString("en-IN")}/mo.`,
  },
};

interface Props {
  type: ScenarioType;
  value: number;
  onChange: (v: number) => void;
}

export function ScenarioSlider({ type, value, onChange }: Props) {
  const cfg = SLIDER_CONFIGS[type];

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      <div className="text-[10px] font-medium uppercase tracking-widest text-ink-2 mb-3">
        {cfg.label}
      </div>

      <div className="flex items-center gap-3 mb-2.5">
        <span className="text-[12px] text-ink-1 w-28 flex-shrink-0">{cfg.rangeLabel}</span>
        <input
          type="range"
          min={cfg.min}
          max={cfg.max}
          step={cfg.step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: "var(--teal)" }}
        />
        <span className="font-mono text-[14px] font-medium text-teal w-16 text-right flex-shrink-0">
          {cfg.dispFn(value)}
        </span>
      </div>

      <p className="text-[12px] text-ink-2 leading-relaxed">{cfg.descFn(value)}</p>
    </div>
  );
}
