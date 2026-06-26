-- ─── Run this entire file in Supabase → SQL Editor ─────────────────────────
-- habit-wealth schema · Phase 8

-- Financial profile (one row per user)
CREATE TABLE financial_profiles (
  id                            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                       UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  income_monthly                NUMERIC NOT NULL DEFAULT 0,
  expenses_json                 JSONB NOT NULL DEFAULT '{}',
  savings_amount                NUMERIC DEFAULT 0,
  emergency_fund                NUMERIC DEFAULT 0,
  debt_amount                   NUMERIC DEFAULT 0,
  debt_interest_rate            NUMERIC DEFAULT 0,
  monthly_budget                NUMERIC DEFAULT 20000,
  savings_target_pct            NUMERIC DEFAULT 20,
  emergency_fund_target_months  NUMERIC DEFAULT 6,
  created_at                    TIMESTAMPTZ DEFAULT now(),
  updated_at                    TIMESTAMPTZ DEFAULT now()
);

-- UI preferences + assistant rename (one row per user)
CREATE TABLE user_preferences (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name       TEXT,
  assistant_name  TEXT NOT NULL DEFAULT 'Clara',
  currency        TEXT NOT NULL DEFAULT 'INR',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Goals
CREATE TABLE goals (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  target_amount  NUMERIC NOT NULL,
  saved_amount   NUMERIC NOT NULL DEFAULT 0,
  target_date    TEXT,
  status         TEXT NOT NULL DEFAULT 'no_plan'
                   CHECK (status IN ('on_track','needs_attention','no_plan')),
  priority       INTEGER NOT NULL DEFAULT 1,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- Expenses
CREATE TABLE expenses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  description   TEXT NOT NULL,
  amount        NUMERIC NOT NULL,
  category      TEXT NOT NULL,
  expense_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Chat history
CREATE TABLE conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Row Level Security ──────────────────────────────────────────────────────

ALTER TABLE financial_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences    ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals               ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses            ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations       ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own" ON financial_profiles  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own" ON user_preferences    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own" ON goals               FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own" ON expenses            FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own" ON conversations       FOR ALL USING (auth.uid() = user_id);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX ON financial_profiles (user_id);
CREATE INDEX ON user_preferences   (user_id);
CREATE INDEX ON goals              (user_id);
CREATE INDEX ON expenses           (user_id, expense_date DESC);
CREATE INDEX ON conversations      (user_id, created_at ASC);
