"use client";

import type { Goal } from "@/lib/types";

const BADGE: Record<Goal["status"], string> = {
  on_track:        "bg-teal-ghost text-teal border border-teal/20",
  needs_attention: "bg-amber/10 text-amber border border-amber/20",
  no_plan:         "bg-red/10 text-red border border-red/20",
};

const BADGE_LABEL: Record<Goal["status"], string> = {
  on_track:        "On track",
  needs_attention: "Needs attention",
  no_plan:         "No plan",
};

const BAR_COLOR: Record<Goal["status"], string> = {
  on_track:        "var(--teal)",
  needs_attention: "var(--amber)",
  no_plan:         "var(--red)",
};

function formatINR(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000)   return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000)     return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}

function monthsLeft(targetDate: string | null): number | null {
  if (!targetDate) return null;
  // Handle "Dec 2026" style dates
  const parsed = new Date(targetDate);
  if (isNaN(parsed.getTime())) {
    // Try parsing "Mon YYYY"
    const match = targetDate.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (match) {
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const m = months.indexOf(match[1]);
      if (m !== -1) {
        const target = new Date(parseInt(match[2]), m, 1);
        const now = new Date();
        const diff = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
        return Math.max(0, diff);
      }
    }
    return null;
  }
  const now = new Date();
  const diff = (parsed.getFullYear() - now.getFullYear()) * 12 + (parsed.getMonth() - now.getMonth());
  return Math.max(0, diff);
}

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const pct = goal.target_amount > 0
    ? Math.min(100, Math.round((goal.saved_amount / goal.target_amount) * 100))
    : 0;

  const mo = monthsLeft(goal.target_date);

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4 flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-[14px] font-medium text-ink-0 leading-snug">
          {goal.title}
        </span>
        <span className={`flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${BADGE[goal.status]}`}>
          {BADGE_LABEL[goal.status]}
        </span>
      </div>

      {/* Sub-row */}
      <div className="text-[12px] text-ink-2">
        Target: {formatINR(goal.target_amount)}
        {goal.target_date ? ` · ${goal.target_date}` : " · No date set"}
      </div>

      {/* Progress bar */}
      <div className="h-[5px] w-full bg-bg-3 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: BAR_COLOR[goal.status] }}
        />
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[12px] text-ink-1">
          {formatINR(goal.saved_amount)} of {formatINR(goal.target_amount)}
        </span>
        <span className="font-mono text-[12px] text-ink-2">
          {pct}%
          {mo !== null ? ` · ${mo} mo left` : ""}
        </span>
      </div>
    </div>
  );
}
