"use client";

import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { impactLabel, impactSub } from "@/lib/finance-calc";
import type { ScenarioResult } from "@/lib/types";

interface Props {
  result: ScenarioResult;
}

export function ImpactBanner({ result }: Props) {
  const { impactMonths, baselineMonthsToGoal } = result;

  const positive = impactMonths > 0;
  const neutral  = impactMonths === 0;

  const colors = neutral
    ? { bg: "var(--bg2)", border: "var(--border)", text: "var(--text1)", iconBg: "var(--bg3)" }
    : positive
    ? { bg: "rgba(76,187,138,.08)", border: "rgba(76,187,138,.20)", text: "var(--green)", iconBg: "rgba(76,187,138,.15)" }
    : { bg: "rgba(224,90,90,.08)",  border: "rgba(224,90,90,.20)",  text: "var(--red)",   iconBg: "rgba(224,90,90,.15)" };

  const Icon = neutral ? Minus : positive ? ArrowUp : ArrowDown;

  return (
    <div
      className="rounded-lg p-4 flex items-center gap-3"
      style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: colors.iconBg }}
      >
        <Icon size={15} style={{ color: colors.text }} />
      </div>
      <div>
        <div className="text-[13px] font-medium" style={{ color: colors.text }}>
          {impactLabel(impactMonths)}
        </div>
        <div className="text-[12px] mt-0.5" style={{ color: colors.text, opacity: 0.75 }}>
          {impactSub(impactMonths, baselineMonthsToGoal)}
        </div>
      </div>
    </div>
  );
}
