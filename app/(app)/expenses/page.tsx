"use client";

import { useExpenses } from "@/hooks/useExpenses";
import { QuickAdd }       from "@/components/expenses/QuickAdd";
import { DailyBarChart }  from "@/components/expenses/DailyBarChart";
import { CategoryDonut }  from "@/components/expenses/CategoryDonut";
import { LoggingStreak }  from "@/components/expenses/LoggingStreak";
import { MonthlyBudget }  from "@/components/expenses/MonthlyBudget";
import { ExpenseLog }     from "@/components/expenses/ExpenseLog";

export default function ExpensesPage() {
  const {
    expenses,
    addExpense,
    deleteExpense,
    byCategory,
    totalThisMonth,
    byDateLabel,
  } = useExpenses();

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Quick add */}
      <QuickAdd onAdd={addExpense} />

      {/* 2×2 analytics grid */}
      <div className="grid grid-cols-2 gap-3">
        <DailyBarChart byDateLabel={byDateLabel()} />
        <CategoryDonut byCategory={byCategory()} />
        <LoggingStreak />
        <MonthlyBudget totalSpent={totalThisMonth()} />
      </div>

      {/* Full log */}
      <ExpenseLog expenses={expenses} onDelete={deleteExpense} />
    </div>
  );
}
