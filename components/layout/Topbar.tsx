"use client";

import { usePathname } from "next/navigation";
import { Bell, RefreshCw } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

export function Topbar() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const name = settings.assistant_name || "Clara";

  const pageNames: Record<string, string> = {
    "/overview":  "Overview",
    "/chat":      `Ask ${name}`,
    "/expenses":  "Expenses",
    "/scenarios": "Scenarios",
    "/goals":     "Goals",
    "/settings":  "Settings",
  };

  const title = pageNames[pathname] || "Dashboard";

  return (
    <header className="fixed left-48 right-0 top-0 h-[52px] bg-bg-1 border-b border-[var(--border)] flex items-center justify-between px-5 z-10">
      <h1 className="text-sm font-medium text-ink-0">{title}</h1>
      <div className="flex items-center gap-1.5">
        <button className="w-[30px] h-[30px] flex items-center justify-center rounded-md border border-[var(--border)] hover:bg-bg-2 transition-colors">
          <Bell size={14} className="text-ink-1" />
        </button>
        <button className="w-[30px] h-[30px] flex items-center justify-center rounded-md border border-[var(--border)] hover:bg-bg-2 transition-colors">
          <RefreshCw size={14} className="text-ink-1" />
        </button>
      </div>
    </header>
  );
}
