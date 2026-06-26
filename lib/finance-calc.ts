import type { FinancialProfile, ScenarioType, ScenarioResult } from "./types";

// ── helpers ────────────────────────────────────────────────────────────────

function totalExpenses(profile: FinancialProfile): number {
  return Object.values(profile.expenses_json).reduce((a, b) => a + b, 0);
}

function baselineSavings(profile: FinancialProfile): number {
  return profile.income_monthly - totalExpenses(profile);
}

function monthsToSave(remaining: number, monthlySavings: number): number {
  if (monthlySavings <= 0) return 999;
  return Math.ceil(remaining / monthlySavings);
}

// Primary goal remaining: ₹20L target − ₹7.6L saved = ₹12.4L
const GOAL_REMAINING = 1240000;

// ── health score ────────────────────────────────────────────────────────────

export function calculateHealthScore(profile: FinancialProfile): number {
  const savingsRate =
    Math.min(baselineSavings(profile) / profile.income_monthly, 0.4) / 0.4;

  const emergencyTarget = profile.income_monthly * 6;
  const emergencyStatus = Math.min(profile.emergency_fund / emergencyTarget, 1);

  const debtToIncome =
    profile.debt_amount > 0
      ? Math.max(0, 1 - profile.debt_amount / (profile.income_monthly * 12) / 0.5)
      : 1;

  const goalFeasibility =
    monthsToSave(GOAL_REMAINING, baselineSavings(profile)) <= 18 ? 1 : 0.5;

  const raw =
    savingsRate * 0.3 +
    emergencyStatus * 0.3 +
    debtToIncome * 0.2 +
    goalFeasibility * 0.2;

  return Math.round(raw * 100);
}

// ── scenario engine ─────────────────────────────────────────────────────────

export function runScenario(
  profile: FinancialProfile,
  type: ScenarioType,
  value: number
): ScenarioResult {
  const base = baselineSavings(profile);
  const baseMonths = monthsToSave(GOAL_REMAINING, base);

  let newSavings = base;

  if (type === "income_change") {
    // value = % raise e.g. 20 → +20%
    newSavings += profile.income_monthly * (value / 100);
  }
  if (type === "expense_reduction") {
    // value = monthly ₹ reduction
    newSavings += value;
  }
  if (type === "one_time_purchase") {
    // approximate 9% p.a. 5-year EMI factor
    const emi = value * 0.02074;
    newSavings -= emi;
  }

  newSavings = Math.max(500, Math.round(newSavings));
  const newMonths = monthsToSave(GOAL_REMAINING, newSavings);
  const impact = baseMonths - newMonths; // positive = closer, negative = further

  return {
    baselineMonthlySavings: Math.round(base),
    baselineMonthsToGoal: baseMonths,
    newMonthlySavings: newSavings,
    newMonthsToGoal: newMonths,
    impactMonths: impact,
  };
}

// ── display helpers ─────────────────────────────────────────────────────────

export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

export function impactLabel(months: number): string {
  if (months === 0) return "No change to your goal timeline";
  const abs = Math.abs(months);
  const dir = months > 0 ? "closer" : "further away";
  return `Goal moves ${abs} month${abs > 1 ? "s" : ""} ${dir}`;
}

export function impactSub(months: number, baselineMonths: number): string {
  if (months === 0) return "This change has no effect on your goal";
  const baseDate = new Date(2026, 5, 1);
  baseDate.setMonth(baseDate.getMonth() + baselineMonths);
  const newDate = new Date(2026, 5, 1);
  newDate.setMonth(newDate.getMonth() + (baselineMonths - months));
  const fmt = (d: Date) =>
    d.toLocaleString("en-IN", { month: "short", year: "numeric" });
  return months > 0
    ? `Hit goal by ${fmt(newDate)} instead of ${fmt(baseDate)}`
    : `Goal pushed to ${fmt(newDate)} from ${fmt(baseDate)}`;
}
