"use client";

import { useSettings } from "@/hooks/useSettings";
import Link from "next/link";
import { Zap } from "lucide-react";

export function ActionBanner() {
  const { settings, loading } = useSettings();

  if (loading) return null;

  const income      = settings.income_monthly;
  const budget      = settings.monthly_budget;
  const savingsRate = income > 0 ? Math.round(((income - budget) / income) * 100) : 0;
  const efMonths    = settings.emergency_fund_target_months;

  // Pick the most urgent action
  let title = "You're on track";
  let desc  = "Keep maintaining your savings rate and you'll hit your goals on schedule.";
  let href  = "/overview";

  if (income === 0) {
    title = "Complete your profile";
    desc  = "Add your income and budget in Settings so Clara can give you real advice.";
    href  = "/settings";
  } else if (efMonths < 3) {
    title = "Build your emergency fund first";
    desc  = `You're targeting ${efMonths} months of coverage. Aim for at least 3 before investing elsewhere.`;
    href  = "/goals";
  } else if (savingsRate < settings.savings_target_pct) {
    title = "Close the savings gap";
    desc  = `You're saving ${savingsRate}% but targeting ${settings.savings_target_pct}%. Log your expenses to find where to cut.`;
    href  = "/expenses";
  } else if (settings.debt_amount > 0 && settings.debt_interest_rate > 12) {
    title = "Pay down high-interest debt";
    desc  = `₹${(settings.debt_amount / 100000).toFixed(1)}L at ${settings.debt_interest_rate}% is costing you ₹${Math.round((settings.debt_amount * settings.debt_interest_rate) / 100 / 12).toLocaleString("en-IN")}/mo in interest.`;
    href  = "/scenarios";
  }

  return (
    <div className="rounded-lg p-4 flex gap-3"
      style={{ background: "var(--teal-ghost2)", border: "1px solid rgba(0,212,180,.18)" }}>
      <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "var(--teal-ghost)", border: "1px solid rgba(0,212,180,.2)" }}>
        <Zap size={14} style={{ color: "var(--teal)" }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium text-ink-0 mb-0.5">{title}</div>
        <div className="text-[11px] text-ink-2 leading-relaxed">{desc}</div>
      </div>
      <Link href={href}
        className="flex-shrink-0 self-center text-[11px] font-medium text-teal hover:opacity-80 transition-opacity">
        View →
      </Link>
    </div>
  );
}
