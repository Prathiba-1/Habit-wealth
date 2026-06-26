"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { ScenarioType } from "@/lib/types";
import { SLIDER_CONFIGS } from "./ScenarioSlider";

function parseWhatIf(text: string): { type: ScenarioType; value: number } | null {
  const t = text.toLowerCase();

  // Income: "20% raise", "get a raise of 20%", "salary hike 15%"
  const m1 = t.match(/(\d+)\s*%\s*(raise|salary|hike|increase|increment)/);
  const m2 = t.match(/(raise|hike|increment|increase|salary).*?(\d+)\s*%/);
  if (m1 || m2) {
    const pct = parseInt(m1 ? m1[1] : m2![2]);
    if (pct > 0 && pct <= 100) return { type: "income_change", value: pct };
  }

  // Expense cut: "reduce dining by 5000", "cut spending 3000"
  const cut = t.match(/(reduce|cut|save|lower|decrease).*?[₹rs\s](\d[\d,]*)/);
  if (cut) {
    const amt = parseInt(cut[2].replace(/,/g, ""));
    if (amt >= 500 && amt <= 15000) return { type: "expense_reduction", value: amt };
  }

  // Purchase: "50L car", "10 lakh", "5,00,000"
  const lakh = t.match(/(\d+(?:\.\d+)?)\s*l(?:akh)?/);
  if (lakh) {
    const amt = parseFloat(lakh[1]) * 100000;
    if (amt >= 100000 && amt <= 5000000) return { type: "one_time_purchase", value: amt };
  }
  const bigNum = t.match(/[₹rs\s](\d[\d,]{4,})/);
  if (bigNum) {
    const amt = parseInt(bigNum[1].replace(/,/g, ""));
    if (amt >= 100000 && amt <= 5000000) return { type: "one_time_purchase", value: amt };
  }

  return null;
}

const EXAMPLES = [
  "What if I get a 20% raise?",
  "What if I reduce dining by ₹4,000?",
  "Can I afford a ₹30L car?",
  "What if I cut subscriptions by ₹2,000?",
];

interface Props {
  onParse: (type: ScenarioType, value: number) => void;
}

export function WhatIfInput({ onParse }: Props) {
  const [text, setText]     = useState("");
  const [error, setError]   = useState("");
  const [parsed, setParsed] = useState<string | null>(null);

  function handleSubmit() {
    setError(""); setParsed(null);
    if (!text.trim()) { setError("Type a question first"); return; }
    const result = parseWhatIf(text);
    if (!result) {
      setError(`Couldn't parse that — try: "What if I get a 20% raise?" or "Can I afford a ₹50L car?"`);
      return;
    }
    const cfg = SLIDER_CONFIGS[result.type];
    setParsed(`Interpreted as: ${cfg.label} — ${cfg.dispFn(result.value)}`);
    onParse(result.type, result.value);
  }

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      <div className="text-[10px] font-medium uppercase tracking-widest text-ink-2 mb-3">
        Ask in plain English
      </div>

      <div className="flex gap-2 mb-2">
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); setError(""); setParsed(null); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder='"What if I get a 20% raise?"'
          className={`flex-1 bg-bg-2 border rounded-md px-3 py-2 text-[13px] text-ink-0 placeholder:text-ink-2 outline-none transition-colors ${
            error ? "border-[var(--red)]" : "border-[var(--border)] focus:border-teal"
          }`}
        />
        <button
          onClick={handleSubmit}
          className="flex items-center gap-1.5 bg-teal text-black text-[13px] font-medium px-3 py-2 rounded-md hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <Sparkles size={14} />
          Run
        </button>
      </div>

      {error  && <p className="text-[11px] text-red mb-2">{error}</p>}
      {parsed && !error && <p className="text-[11px] text-teal mb-2">{parsed}</p>}

      <div className="flex flex-wrap gap-1.5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => { setText(ex); setError(""); setParsed(null); }}
            className="text-[11px] text-ink-2 bg-bg-2 border border-[var(--border)] px-2.5 py-1 rounded-full hover:border-[var(--border2)] hover:text-ink-1 transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
