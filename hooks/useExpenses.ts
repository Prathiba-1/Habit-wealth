"use client";

import { useState, useCallback, useEffect } from "react";
import { mockExpenses } from "@/lib/mock-data";
import type { Expense, ExpenseCategory } from "@/lib/types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// ─── mock version ─────────────────────────────────────────────────────────────

function useMockExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);

  const addExpense = useCallback(
    (desc: string, amount: number, category: ExpenseCategory) => {
      const today = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const dateStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
      setExpenses((prev) => [
        { id: crypto.randomUUID(), description: desc, amount, category, expense_date: dateStr, date: "Today" },
        ...prev,
      ]);
    }, []
  );

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const byCategory = useCallback(
    () => expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {} as Record<string, number>),
    [expenses]
  );

  const totalThisMonth = useCallback(
    () => expenses.reduce((s, e) => s + e.amount, 0), [expenses]
  );

  const byDateLabel = useCallback(
    () => expenses.reduce((acc, e) => { const l = e.date || e.expense_date; acc[l] = (acc[l] || 0) + e.amount; return acc; }, {} as Record<string, number>),
    [expenses]
  );

  return { expenses, addExpense, deleteExpense, byCategory, totalThisMonth, byDateLabel };
}

// ─── supabase version ─────────────────────────────────────────────────────────

function useSupabaseExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  function labelFromDate(dateStr: string): string {
    const today = new Date();
    const d = new Date(dateStr);
    const diffDays = Math.round((today.setHours(0,0,0,0) - d.setHours(0,0,0,0)) / 86400000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  }

  useEffect(() => {
    async function load() {
      const { getSupabase } = await import("@/lib/supabase");
      const { data } = await getSupabase()
        .from("expenses")
        .select("*")
        .order("expense_date", { ascending: false })
        .limit(100);
      if (data) setExpenses(data.map((e) => ({ ...e, date: labelFromDate(e.expense_date) })));
    }
    load();
  }, []);

  const addExpense = useCallback(async (desc: string, amount: number, category: ExpenseCategory) => {
    const { getSupabase } = await import("@/lib/supabase");
    const sb = getSupabase();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    const today = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const { data, error } = await sb.from("expenses")
      .insert({ user_id: user.id, description: desc, amount, category, expense_date: dateStr })
      .select().single();
    if (!error && data) setExpenses((prev) => [{ ...data, date: "Today" }, ...prev]);
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    const { getSupabase } = await import("@/lib/supabase");
    await getSupabase().from("expenses").delete().eq("id", id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const byCategory = useCallback(
    () => expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {} as Record<string, number>),
    [expenses]
  );

  const totalThisMonth = useCallback(
    () => expenses.reduce((s, e) => s + e.amount, 0), [expenses]
  );

  const byDateLabel = useCallback(
    () => expenses.reduce((acc, e) => { const l = e.date || e.expense_date; acc[l] = (acc[l] || 0) + e.amount; return acc; }, {} as Record<string, number>),
    [expenses]
  );

  return { expenses, addExpense, deleteExpense, byCategory, totalThisMonth, byDateLabel };
}

// ─── public API ──────────────────────────────────────────────────────────────

export function useExpenses() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (USE_MOCK) return useMockExpenses();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSupabaseExpenses();
}
