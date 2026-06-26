"use client";

import { mockExpenses } from "@/lib/mock-data";

// Build a 14-day streak map from today backwards
function buildStreak(): { label: string; letter: string; filled: boolean; isToday: boolean }[] {
  const today = new Date(2026, 5, 22); // June 22 2026 — matches mock data
  const days: { label: string; letter: string; filled: boolean; isToday: boolean }[] = [];
  const letters = ["S", "M", "T", "W", "T", "F", "S"];

  // Dates with logged expenses
  const loggedDates = new Set(mockExpenses.map((e) => e.expense_date));

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    days.push({
      label: dateStr,
      letter: letters[d.getDay()],
      filled: loggedDates.has(dateStr),
      isToday: i === 0,
    });
  }
  return days;
}

export function LoggingStreak() {
  const days   = buildStreak();
  const streak = [...days].reverse().findIndex((d) => !d.filled && !d.isToday);
  const streakCount = streak === -1 ? days.length : streak;

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      <div className="text-[10px] font-medium uppercase tracking-widest text-ink-2 mb-3">
        Logging streak
      </div>

      <div className="flex gap-1 flex-wrap mb-3">
        {days.map((d, i) => (
          <div
            key={i}
            className="w-[22px] h-[22px] rounded flex items-center justify-center text-[10px] font-mono transition-colors"
            style={{
              background: d.isToday
                ? "var(--teal-ghost)"
                : d.filled
                ? "var(--teal)"
                : "var(--bg3)",
              border: d.isToday ? "1px solid var(--teal)" : "none",
              color: d.isToday
                ? "var(--teal)"
                : d.filled
                ? "#000"
                : "var(--text2)",
            }}
          >
            {d.letter}
          </div>
        ))}
      </div>

      <div className="text-[12px] text-ink-2">
        {streakCount > 0 ? (
          <>
            <span className="font-mono text-teal font-medium">{streakCount}-day</span>
            {" streak — keep it going"}
          </>
        ) : (
          "Log your first expense to start a streak"
        )}
      </div>
    </div>
  );
}
