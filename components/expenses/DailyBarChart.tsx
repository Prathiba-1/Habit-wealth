"use client";

interface Props {
  byDateLabel: Record<string, number>;
}

// Last 7 display slots
const SLOTS = ["Jun 17", "Jun 18", "Jun 19", "Jun 20", "Yesterday", "Today", ""];

export function DailyBarChart({ byDateLabel }: Props) {
  const values = SLOTS.map((s) => (s ? byDateLabel[s] || 0 : 0));
  const maxVal = Math.max(...values, 1);
  const MAX_H = 72;

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      <div className="text-[10px] font-medium uppercase tracking-widest text-ink-2 mb-3">
        Daily spend — this week
      </div>

      {/* Bars */}
      <div className="flex items-flex-end gap-1.5 h-[80px] mb-2">
        {SLOTS.map((slot, i) => {
          const h = slot ? Math.max(4, Math.round((values[i] / maxVal) * MAX_H)) : 0;
          const isToday = slot === "Today";
          return (
            <div
              key={i}
              className="flex-1 flex flex-col justify-end items-center gap-1"
            >
              {slot && values[i] > 0 && (
                <span className="font-mono text-[10px] text-ink-2">
                  ₹{values[i] >= 1000 ? `${(values[i] / 1000).toFixed(1)}K` : values[i]}
                </span>
              )}
              <div
                className="w-full rounded-sm transition-all"
                style={{
                  height: slot ? `${h}px` : "0px",
                  background: isToday ? "var(--teal)" : "var(--bg3)",
                  minHeight: slot && values[i] > 0 ? "4px" : "0px",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex gap-1.5">
        {SLOTS.map((slot, i) => (
          <div
            key={i}
            className={`flex-1 text-center font-mono text-[10px] ${
              slot === "Today" ? "text-teal" : "text-ink-2"
            }`}
          >
            {slot === "Today" ? "Today" : slot === "Yesterday" ? "Yest" : slot.split(" ")[1] || ""}
          </div>
        ))}
      </div>
    </div>
  );
}
