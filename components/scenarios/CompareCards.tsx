"use client";

import type { ScenarioResult } from "@/lib/types";
import { formatINR } from "@/lib/finance-calc";

interface Props {
  result: ScenarioResult;
}

export function CompareCards({ result }: Props) {
  const {
    baselineMonthlySavings,
    baselineMonthsToGoal,
    newMonthlySavings,
    newMonthsToGoal,
    impactMonths,
  } = result;

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Before */}
      <div className="bg-bg-2 border border-[var(--border)] rounded-lg p-4">
        <div className="text-[10px] font-medium uppercase tracking-widest text-ink-2 mb-3">
          Before
        </div>
        <div className="font-mono text-[26px] font-medium text-ink-0 leading-none mb-1">
          {baselineMonthsToGoal} mo
        </div>
        <div className="text-[12px] text-ink-2 mb-4">to house goal</div>
        <div className="border-t border-[var(--border)] pt-3 space-y-2">
          <div className="flex justify-between text-[12px]">
            <span className="text-ink-2">Monthly savings</span>
            <span className="font-mono text-ink-1">{formatINR(baselineMonthlySavings)}</span>
          </div>
          <div className="flex justify-between text-[12px]">
            <span className="text-ink-2">Goal remaining</span>
            <span className="font-mono text-ink-1">₹12.4L</span>
          </div>
        </div>
      </div>

      {/* After */}
      <div
        className="rounded-lg p-4"
        style={{ background: "var(--teal-ghost2)", border: "1px solid rgba(0,212,180,.18)" }}
      >
        <div
          className="text-[10px] font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--teal-dim)" }}
        >
          After
        </div>
        <div
          className="font-mono text-[26px] font-medium leading-none mb-1"
          style={{ color: "var(--teal)" }}
        >
          {newMonthsToGoal} mo
        </div>
        <div className="text-[12px] mb-4" style={{ color: "var(--teal-dim)" }}>
          to house goal
        </div>
        <div
          className="border-t pt-3 space-y-2"
          style={{ borderColor: "rgba(0,212,180,.15)" }}
        >
          <div className="flex justify-between text-[12px]">
            <span style={{ color: "var(--teal-dim)" }}>New monthly savings</span>
            <span className="font-mono font-medium" style={{ color: "var(--teal)" }}>
              {formatINR(newMonthlySavings)}
            </span>
          </div>
          <div className="flex justify-between text-[12px]">
            <span style={{ color: "var(--teal-dim)" }}>Difference</span>
            <span
              className="font-mono font-medium"
              style={{ color: impactMonths >= 0 ? "var(--green)" : "var(--red)" }}
            >
              {impactMonths >= 0 ? "−" : "+"}{Math.abs(impactMonths)} mo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
