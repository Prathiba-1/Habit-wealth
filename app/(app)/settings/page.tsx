"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Check, X, User, Wallet, ShieldCheck, CreditCard, Bot } from "lucide-react";
import { useSettings, type ProfileSettings } from "@/hooks/useSettings";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatINR(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000)   return `₹${(v / 1000).toFixed(0)}K`;
  return `₹${v}`;
}

// ─── primitives ─────────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  editing,
  onEdit,
  onSave,
  onCancel,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-teal-ghost border border-teal/20 flex items-center justify-center flex-shrink-0">
          <Icon size={14} className="text-teal" />
        </div>
        <div>
          <div className="text-[13px] font-medium text-ink-0">{title}</div>
          <div className="text-[11px] text-ink-2">{subtitle}</div>
        </div>
      </div>
      {!editing ? (
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-[12px] text-ink-2 hover:text-teal transition-colors px-2.5 py-1 rounded-md hover:bg-teal-ghost"
        >
          <Pencil size={12} /> Edit
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="flex items-center gap-1 text-[12px] text-ink-2 hover:text-ink-0 transition-colors px-2 py-1 rounded-md hover:bg-bg-3"
          >
            <X size={12} /> Cancel
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-1 text-[12px] text-black font-medium bg-teal hover:opacity-90 transition-opacity px-2.5 py-1 rounded-md"
          >
            <Check size={12} /> Save
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-[11px] text-ink-2">{label}</div>
      <div className="font-mono text-[13px] text-ink-0">{value}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  prefix,
  suffix,
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] text-ink-2">{label}</label>
      <div className="flex items-center bg-bg-2 border border-[var(--border)] rounded-md overflow-hidden focus-within:border-teal transition-colors">
        {prefix && (
          <span className="px-2.5 text-[12px] text-ink-2 border-r border-[var(--border)] font-mono">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent px-3 py-1.5 text-[13px] text-ink-0 font-mono outline-none placeholder:text-ink-2 placeholder:font-sans"
        />
        {suffix && (
          <span className="px-2.5 text-[12px] text-ink-2 border-l border-[var(--border)] font-mono">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── sections ───────────────────────────────────────────────────────────────

function ProfileSection({
  settings,
  onSave,
}: {
  settings: ProfileSettings;
  onSave: (patch: Partial<ProfileSettings>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ full_name: settings.full_name, email: settings.email });

  function handleEdit() {
    setDraft({ full_name: settings.full_name, email: settings.email });
    setEditing(true);
  }
  function handleSave() {
    onSave(draft);
    setEditing(false);
  }
  function handleCancel() {
    setEditing(false);
  }

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      <SectionHeader
        icon={User}
        title="Profile"
        subtitle="Your account identity"
        editing={editing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      {!editing ? (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full name" value={settings.full_name} />
          <Field label="Email" value={settings.email} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Full name"
            value={draft.full_name}
            onChange={(v) => setDraft((d) => ({ ...d, full_name: v }))}
            placeholder="Your name"
          />
          <div className="flex flex-col gap-1">
            <Input
              label="Email"
              value={draft.email}
              onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
              placeholder="you@example.com"
            />
            {draft.email !== settings.email && draft.email.length > 0 && (
              <p className="text-[11px] text-amber">
                Changing your email sends a confirmation link to the new address — the change is not applied until you click it.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function IncomeSection({
  settings,
  onSave,
}: {
  settings: ProfileSettings;
  onSave: (patch: Partial<ProfileSettings>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    income_monthly: settings.income_monthly,
    monthly_budget: settings.monthly_budget,
    savings_target_pct: settings.savings_target_pct,
  });

  function handleEdit() {
    setDraft({
      income_monthly: settings.income_monthly,
      monthly_budget: settings.monthly_budget,
      savings_target_pct: settings.savings_target_pct,
    });
    setEditing(true);
  }
  function handleSave() {
    onSave({
      income_monthly:     Number(draft.income_monthly),
      monthly_budget:     Number(draft.monthly_budget),
      savings_target_pct: Number(draft.savings_target_pct),
    });
    setEditing(false);
  }

  // derived
  const savingsAmt  = Math.round(settings.income_monthly * (settings.savings_target_pct / 100));
  const budgetUsed  = Math.round((settings.monthly_budget / settings.income_monthly) * 100);

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      <SectionHeader
        icon={Wallet}
        title="Income & Budget"
        subtitle="Your monthly money flow"
        editing={editing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
      {!editing ? (
        <div className="grid grid-cols-3 gap-4">
          <Field label="Monthly income"   value={formatINR(settings.income_monthly)} />
          <Field label="Discretionary cap" value={`${formatINR(settings.monthly_budget)} / mo`} />
          <Field label="Savings target"   value={`${settings.savings_target_pct}% · ${formatINR(savingsAmt)}/mo`} />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Monthly income (₹)"
            value={draft.income_monthly}
            onChange={(v) => setDraft((d) => ({ ...d, income_monthly: +v }))}
            type="number"
            prefix="₹"
          />
          <Input
            label="Monthly spend cap (₹)"
            value={draft.monthly_budget}
            onChange={(v) => setDraft((d) => ({ ...d, monthly_budget: +v }))}
            type="number"
            prefix="₹"
          />
          <Input
            label="Savings target"
            value={draft.savings_target_pct}
            onChange={(v) => setDraft((d) => ({ ...d, savings_target_pct: +v }))}
            type="number"
            suffix="%"
          />
        </div>
      )}
      {!editing && (
        <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center gap-1.5 text-[11px] text-ink-2">
          <span>Discretionary budget is</span>
          <span className="font-mono text-ink-1">{budgetUsed}%</span>
          <span>of income</span>
          <span className="mx-1">·</span>
          <span>Savings rate target</span>
          <span className="font-mono text-teal">{settings.savings_target_pct}%</span>
        </div>
      )}
    </div>
  );
}

function EmergencySection({
  settings,
  onSave,
}: {
  settings: ProfileSettings;
  onSave: (patch: Partial<ProfileSettings>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ emergency_fund_target_months: settings.emergency_fund_target_months });

  function handleSave() {
    onSave({ emergency_fund_target_months: Number(draft.emergency_fund_target_months) });
    setEditing(false);
  }

  const targetAmt = settings.income_monthly * settings.emergency_fund_target_months;

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      <SectionHeader
        icon={ShieldCheck}
        title="Emergency Fund"
        subtitle="Your safety net target"
        editing={editing}
        onEdit={() => {
          setDraft({ emergency_fund_target_months: settings.emergency_fund_target_months });
          setEditing(true);
        }}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
      {!editing ? (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Target coverage" value={`${settings.emergency_fund_target_months} months`} />
          <Field label="Target amount"   value={formatINR(targetAmt)} />
        </div>
      ) : (
        <div className="max-w-xs">
          <Input
            label="Target months of expenses"
            value={draft.emergency_fund_target_months}
            onChange={(v) => setDraft({ emergency_fund_target_months: +v })}
            type="number"
            suffix="months"
          />
          <p className="text-[11px] text-ink-2 mt-2">
            Most advisors recommend 3–6 months. 6+ if you are self-employed.
          </p>
        </div>
      )}
    </div>
  );
}

function DebtSection({
  settings,
  onSave,
}: {
  settings: ProfileSettings;
  onSave: (patch: Partial<ProfileSettings>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    debt_amount:        settings.debt_amount,
    debt_interest_rate: settings.debt_interest_rate,
  });

  function handleSave() {
    onSave({
      debt_amount:        Number(draft.debt_amount),
      debt_interest_rate: Number(draft.debt_interest_rate),
    });
    setEditing(false);
  }

  const monthlyInterest = Math.round((settings.debt_amount * (settings.debt_interest_rate / 100)) / 12);

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      <SectionHeader
        icon={CreditCard}
        title="Debt"
        subtitle="Loans and liabilities"
        editing={editing}
        onEdit={() => {
          setDraft({ debt_amount: settings.debt_amount, debt_interest_rate: settings.debt_interest_rate });
          setEditing(true);
        }}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
      {!editing ? (
        <div className="grid grid-cols-3 gap-4">
          <Field label="Total debt"      value={settings.debt_amount > 0 ? formatINR(settings.debt_amount) : "None"} />
          <Field label="Interest rate"   value={settings.debt_amount > 0 ? `${settings.debt_interest_rate}% p.a.` : "—"} />
          <Field label="Monthly interest" value={settings.debt_amount > 0 ? `${formatINR(monthlyInterest)}/mo` : "—"} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <Input
            label="Total outstanding (₹)"
            value={draft.debt_amount}
            onChange={(v) => setDraft((d) => ({ ...d, debt_amount: +v }))}
            type="number"
            prefix="₹"
          />
          <Input
            label="Interest rate"
            value={draft.debt_interest_rate}
            onChange={(v) => setDraft((d) => ({ ...d, debt_interest_rate: +v }))}
            type="number"
            suffix="% p.a."
          />
        </div>
      )}
    </div>
  );
}

function AssistantSection({
  settings,
  onSave,
}: {
  settings: ProfileSettings;
  onSave: (patch: Partial<ProfileSettings>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ assistant_name: settings.assistant_name });

  function handleSave() {
    const name = draft.assistant_name.trim() || "Clara";
    onSave({ assistant_name: name });
    setEditing(false);
  }

  return (
    <div className="bg-bg-1 border border-[var(--border)] rounded-lg p-4">
      <SectionHeader
        icon={Bot}
        title="AI Assistant"
        subtitle="Personalise your finance mentor"
        editing={editing}
        onEdit={() => {
          setDraft({ assistant_name: settings.assistant_name });
          setEditing(true);
        }}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
      {!editing ? (
        <div className="flex items-center gap-4">
          {/* Avatar preview */}
          <div className="w-10 h-10 rounded-xl bg-teal-ghost border border-teal/20 flex items-center justify-center flex-shrink-0">
            <span className="font-mono text-[11px] text-teal font-medium">
              {settings.assistant_name.slice(0, 2).toLowerCase()}
            </span>
          </div>
          <div>
            <div className="text-[13px] font-medium text-ink-0">{settings.assistant_name}</div>
            <div className="text-[11px] text-ink-2">Your personal finance AI · only visible to you</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-w-xs">
          <Input
            label="Assistant name"
            value={draft.assistant_name}
            onChange={(v) => setDraft({ assistant_name: v })}
            placeholder="Clara"
          />
          {/* Live preview */}
          <div className="flex items-center gap-2.5 bg-bg-2 rounded-lg px-3 py-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-ghost border border-teal/20 flex items-center justify-center flex-shrink-0">
              <span className="font-mono text-[10px] text-teal">
                {(draft.assistant_name || "Clara").slice(0, 2).toLowerCase()}
              </span>
            </div>
            <div className="text-[12px] text-ink-1">
              Hi, I am{" "}
              <span className="text-teal font-medium">
                {draft.assistant_name.trim() || "Clara"}
              </span>
              . How can I help with your finances?
            </div>
          </div>
          <p className="text-[11px] text-ink-2">
            Defaults to Clara if left blank. Change anytime.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── page ───────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { settings, updateSettings, loading } = useSettings();
  const router = useRouter();

  async function handleSignOut() {
    if (!USE_MOCK) {
      const { getSupabase } = await import("@/lib/supabase");
      await getSupabase().auth.signOut();
    }
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-[13px] text-ink-2">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div>
        <h1 className="text-[15px] font-medium text-ink-0">Settings</h1>
        <p className="text-[12px] text-ink-2 mt-0.5">
          Your financial profile · used by {settings.assistant_name} to give you accurate advice
        </p>
      </div>

      <ProfileSection   settings={settings} onSave={updateSettings} />
      <IncomeSection    settings={settings} onSave={updateSettings} />
      <EmergencySection settings={settings} onSave={updateSettings} />
      <DebtSection      settings={settings} onSave={updateSettings} />
      <AssistantSection settings={settings} onSave={updateSettings} />

      {/* Sign out */}
      <div className="pt-2 border-t border-[var(--border)]">
        <button
          onClick={handleSignOut}
          className="text-[12px] text-ink-2 hover:text-red transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
