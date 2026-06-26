"use client";

interface AddGoalButtonProps {
  onClick?: () => void;
}

export function AddGoalButton({ onClick }: AddGoalButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 rounded-md text-[13px] text-ink-2
        border border-dashed border-[var(--border2)]
        hover:border-teal hover:text-teal transition-colors"
    >
      + Add a goal
    </button>
  );
}
