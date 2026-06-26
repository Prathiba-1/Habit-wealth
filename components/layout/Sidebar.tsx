"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, MessageSquare, Receipt,
  ArrowLeftRight, Target, Settings, LogOut,
} from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const navGroups = [
  {
    label: "Dashboard",
    items: [
      { name: "Overview",  href: "/overview",  icon: LayoutDashboard },
      { name: "Ask Clara", href: "/chat",       icon: MessageSquare },
    ],
  },
  {
    label: "Planning",
    items: [
      { name: "Expenses",  href: "/expenses",  icon: Receipt },
      { name: "Scenarios", href: "/scenarios", icon: ArrowLeftRight },
      { name: "Goals",     href: "/goals",     icon: Target },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { settings } = useSettings();

  const fullName = settings.full_name || "—";
  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleSignOut() {
    if (!USE_MOCK) {
      const { getSupabase } = await import("@/lib/supabase");
      await getSupabase().auth.signOut();
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-48 bg-bg-1 border-r border-[var(--border)] flex flex-col z-20">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-[18px] border-b border-[var(--border)]">
        <div className="w-7 h-7 rounded-lg bg-teal flex items-center justify-center flex-shrink-0">
          <span className="font-mono text-xs font-medium text-black leading-none">hw</span>
        </div>
        <div>
          <div className="text-sm font-medium text-ink-0 leading-tight">Habit Wealth</div>
          <div className="text-[10px] text-ink-2 leading-tight">Finance mentor</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            <div className="text-[10px] font-medium text-ink-2 uppercase tracking-widest px-2 py-1 mt-3 mb-1">
              {group.label}
            </div>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] transition-colors mb-0.5 ${
                    isActive ? "bg-teal-ghost text-teal" : "text-ink-1 hover:bg-bg-2 hover:text-ink-0"
                  }`}>
                  <Icon size={15} className={isActive ? "text-teal" : "text-ink-2"} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-[30px] h-[30px] rounded-full bg-teal-ghost border border-teal/20 flex items-center justify-center flex-shrink-0">
            <span className="font-mono text-[11px] text-teal font-medium">{initials}</span>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-ink-0 truncate">{fullName}</div>
            <div className="text-[11px] text-ink-2">Free plan</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] text-ink-2 hover:text-red hover:bg-red/5 transition-colors"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  );
}