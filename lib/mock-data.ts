import type {
  FinancialProfile,
  Goal,
  Expense,
  Assessment,
} from "./types";

export const mockProfile: FinancialProfile = {
  id: "profile-1",
  user_id: "user-1",
  income_monthly: 92000,
  expenses_json: {
    rent: 28000,
    dining: 9200,
    transport: 4500,
    utilities: 3100,
    other: 5400,
  },
  savings_amount: 76000,
  emergency_fund: 294400,
  debt_amount: 240000,
  debt_interest_rate: 14,
  monthly_budget: 20000,
};

export const mockAssessment: Assessment = {
  health_score: 72,
  score_delta: 4,
  strengths: [
    { title: "Savings rate 20%", desc: "Well above the 15% benchmark" },
    { title: "Debt-to-income OK", desc: "2.6% monthly — below 5% threshold" },
    { title: "Goal on track", desc: "14 months to down payment" },
  ],
  risks: [
    {
      title: "Emergency fund low",
      desc: "3.2 months — target is 6",
      severity: "high",
    },
    {
      title: "Dining overspend",
      desc: "₹9,200/mo, up 18% this quarter",
      severity: "medium",
    },
    {
      title: "No debt payoff plan",
      desc: "₹2.4L at 14% — costs ₹2,800/mo",
      severity: "low",
    },
  ],
  top_action: {
    title: "Automate ₹5,000/mo to emergency fund",
    desc: "At this rate you'll reach 6-month coverage by March 2026 — 2 months before your house goal.",
  },
};

export const mockGoals: Goal[] = [
  {
    id: "1",
    title: "House down payment",
    target_amount: 2000000,
    saved_amount: 760000,
    target_date: "Dec 2026",
    status: "on_track",
    priority: 1,
  },
  {
    id: "2",
    title: "Emergency fund",
    target_amount: 552000,
    saved_amount: 296000,
    target_date: "Mar 2026",
    status: "needs_attention",
    priority: 2,
  },
  {
    id: "3",
    title: "Debt clearance",
    target_amount: 240000,
    saved_amount: 0,
    target_date: null,
    status: "no_plan",
    priority: 3,
  },
];

export const mockExpenses: Expense[] = [
  {
    id: "1",
    description: "Lunch at Truffles",
    category: "Food",
    amount: 420,
    expense_date: "2026-06-22",
    date: "Today",
  },
  {
    id: "2",
    description: "Ola cab to office",
    category: "Transport",
    amount: 180,
    expense_date: "2026-06-22",
    date: "Today",
  },
  {
    id: "3",
    description: "Amazon order",
    category: "Shopping",
    amount: 1250,
    expense_date: "2026-06-21",
    date: "Yesterday",
  },
  {
    id: "4",
    description: "Swiggy dinner",
    category: "Food",
    amount: 380,
    expense_date: "2026-06-21",
    date: "Yesterday",
  },
  {
    id: "5",
    description: "Metro card recharge",
    category: "Transport",
    amount: 200,
    expense_date: "2026-06-20",
    date: "Jun 20",
  },
  {
    id: "6",
    description: "Coffee + snacks",
    category: "Food",
    amount: 160,
    expense_date: "2026-06-20",
    date: "Jun 20",
  },
];
