"use client";

const CAT_COLORS: Record<string, string> = {
  Food:          "var(--teal)",
  Transport:     "var(--red)",
  Shopping:      "var(--amber)",
  Entertainment: "#a78bfa",
  Health:        "var(--green)",
  Utilities:     "#60a5fa",
  Other:         "var(--text2)",
};

interface Props {
  byCategory: Record<string, number>;
}

export function CategoryDonut({ byCategory }: Props) {
  const entries = Object.entries(byCategory).filter(([, v]) => v > 0);
  const total   = entries.reduce((s, [, v]) => s + v, 0);

  // SVG donut: r=28, circumference ≈ 175.9
  const r = 28;
  const cx = 40;
  const cy = 40;
  const circ = 2 * Math.PI * r;

  let offset = 0;
  const slices = entries.map(([cat, val]) => {
    const pct   = val / (total || 1);
    const dash  = pct * circ;
    const slice = { cat, val, dash, offset };
    offset += dash;
    return slice;
  });

  // top 4 for legend
  const legend = [...entries]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      <div className="text-[10px] font-medium uppercase tracking-widest text-ink-2 mb-3">
        Spend by category
      </div>

      {total === 0 ? (
        <div className="text-[13px] text-ink-2 py-4 text-center">No expenses yet</div>
      ) : (
        <div className="flex items-center gap-4">
          {/* Donut */}
          <svg width="80" height="80" viewBox="0 0 80 80" className="flex-shrink-0">
            {slices.map(({ cat, dash, offset: off }) => (
              <circle
                key={cat}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={CAT_COLORS[cat] || "var(--text2)"}
                strokeWidth="12"
                strokeDasharray={`${dash} ${circ}`}
                strokeDashoffset={-off}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            ))}
            {/* center hole */}
            <circle cx={cx} cy={cy} r="16" fill="var(--bg1)" />
          </svg>

          {/* Legend */}
          <div className="flex-1 space-y-1.5">
            {legend.map(([cat, val]) => (
              <div key={cat} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: CAT_COLORS[cat] || "var(--text2)" }}
                />
                <span className="text-[12px] text-ink-1 flex-1">{cat}</span>
                <span className="font-mono text-[11px] text-ink-2">
                  ₹{val.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
