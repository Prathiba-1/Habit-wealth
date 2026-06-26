"use client";

import { GoalCard } from "@/components/goals/GoalCard";
import { AddGoalButton } from "@/components/goals/AddGoalButton";
import { mockGoals, mockProfile } from "@/lib/mock-data";

function formatINR(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000)   return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}

export default function GoalsPage() {
  const totalTargeted = mockGoals.reduce((s, g) => s + g.target_amount, 0);
  const totalSaved    = mockGoals.reduce((s, g) => s + g.saved_amount, 0);
  const onTrackCount  = mockGoals.filter((g) => g.status === "on_track").length;

  // Monthly savings available for goals
  const totalExp = Object.values(mockProfile.expenses_json).reduce((a, b) => a + b, 0);
  const monthlySavings = mockProfile.income_monthly - totalExp;

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div>
        <h1 className="text-[15px] font-medium text-ink-0">Goals</h1>
        <p className="text-[12px] text-ink-2 mt-0.5">
          Track your financial milestones
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-3">
          <div className="text-[11px] text-ink-2 mb-1">Total goals</div>
          <div className="font-mono text-[20px] text-ink-0 leading-none">
            {mockGoals.length}
          </div>
        </div>
        <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-3">
          <div className="text-[11px] text-ink-2 mb-1">On track</div>
          <div className="font-mono text-[20px] text-teal leading-none">
            {onTrackCount}
          </div>
        </div>
        <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-3">
          <div className="text-[11px] text-ink-2 mb-1">Total saved</div>
          <div className="font-mono text-[20px] text-ink-0 leading-none">
            {formatINR(totalSaved)}
          </div>
          <div className="font-mono text-[11px] text-ink-2 mt-0.5">
            of {formatINR(totalTargeted)}
          </div>
        </div>
        <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-3">
          <div className="text-[11px] text-ink-2 mb-1">Monthly savings</div>
          <div className="font-mono text-[20px] text-green leading-none">
            {formatINR(monthlySavings)}
          </div>
          <div className="text-[11px] text-ink-2 mt-0.5">available</div>
        </div>
      </div>

      {/* Goal cards */}
      <div className="flex flex-col gap-3">
        {mockGoals
          .sort((a, b) => a.priority - b.priority)
          .map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        <AddGoalButton />
      </div>
    </div>
  );
}
