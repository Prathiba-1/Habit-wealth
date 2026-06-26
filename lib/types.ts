export interface FinancialProfile {
  id: string;
  user_id: string;
  income_monthly: number;
  expenses_json: Record<string, number>;
  savings_amount: number;
  emergency_fund: number;
  debt_amount: number;
  debt_interest_rate: number;
  monthly_budget: number;
}

export interface Goal {
  id: string;
  user_id?: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  target_date: string | null;
  status: "on_track" | "needs_attention" | "no_plan";
  priority: number;
}

export interface Expense {
  id: string;
  user_id?: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  expense_date: string;
  date?: string;
}

export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Utilities"
  | "Other";

export interface Assessment {
  health_score: number;
  score_delta: number;
  strengths: { title: string; desc: string }[];
  risks: { title: string; desc: string; severity: "high" | "medium" | "low" }[];
  top_action: { title: string; desc: string };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export type ScenarioType =
  | "income_change"
  | "expense_reduction"
  | "one_time_purchase";

export interface ScenarioResult {
  newMonthlySavings: number;
  newMonthsToGoal: number;
  baselineMonthlySavings: number;
  baselineMonthsToGoal: number;
  impactMonths: number;
  recommendation?: string;
}
