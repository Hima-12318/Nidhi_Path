-- =============================================================
-- Nidhi Path SmartCRM Intelligence — Initial Schema
-- Run this in your Supabase SQL Editor
-- =============================================================

-- ─── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── updated_at trigger function ──────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

-- =============================================================
-- TABLE: profiles
-- Central user registry. One row per Supabase auth user.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  mobile          TEXT,
  role            TEXT NOT NULL CHECK (role IN ('admin','employee','board_member','client','student')),
  client_type     TEXT CHECK (client_type IN (
                    'connector','consultant','self_own',
                    'employee_reference','online_reference','banker_reference'
                  )),
  status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','inactive','suspended')),
  -- Client commission defaults (for connector/consultant/banker)
  commission_percentage NUMERIC(5,2) DEFAULT 0,
  commission_type TEXT DEFAULT 'not_applicable'
                    CHECK (commission_type IN ('percentage','fixed','not_applicable')),
  commission_fixed_amount NUMERIC(15,2) DEFAULT 0,
  -- Bank details for commission payout
  bank_account_name   TEXT,
  bank_account_number TEXT,
  bank_ifsc           TEXT,
  upi_id              TEXT,
  -- Metadata
  designation         TEXT,
  department          TEXT,
  company_name        TEXT,
  city                TEXT,
  state               TEXT,
  website             TEXT,
  notes               TEXT,
  created_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_profiles_role   ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_email  ON public.profiles(email);

-- =============================================================
-- TABLE: student_details
-- One row per student/lead. Core CRM record.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.student_details (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Education info
  university_applied   TEXT,
  country              TEXT,
  course               TEXT,
  -- Loan info
  loan_amount_needed   NUMERIC(15,2) DEFAULT 0,
  loan_amount_sanctioned NUMERIC(15,2) DEFAULT 0,
  bank_applied         TEXT,
  -- Relationships
  source_client_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_employee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  -- Lead lifecycle
  lead_status          TEXT NOT NULL DEFAULT 'New' CHECK (lead_status IN (
    'New','Registered','Assigned','Verified',
    'Documents Pending','Documents Received','Work Started','In Progress',
    'Follow Up','Bank Review','Sanction In Progress','Sanctioned',
    'Disbursed','Approved','Rejected','Closed'
  )),
  student_visible_status TEXT DEFAULT 'New',
  priority             TEXT NOT NULL DEFAULT 'Normal'
                         CHECK (priority IN ('Low','Normal','High','Urgent')),
  next_follow_up       DATE,
  rejection_reason     TEXT,
  internal_notes       TEXT,
  -- Application ID (generated)
  application_id       TEXT UNIQUE,
  work_started_at      TIMESTAMPTZ,
  approved_at          TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_student_details_updated_at
  BEFORE UPDATE ON public.student_details
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_sd_student_id           ON public.student_details(student_id);
CREATE INDEX IF NOT EXISTS idx_sd_source_client        ON public.student_details(source_client_id);
CREATE INDEX IF NOT EXISTS idx_sd_assigned_employee    ON public.student_details(assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_sd_lead_status          ON public.student_details(lead_status);
CREATE INDEX IF NOT EXISTS idx_sd_created_at           ON public.student_details(created_at DESC);

-- Application ID counter
CREATE TABLE IF NOT EXISTS public.application_id_seq (
  date_key   TEXT PRIMARY KEY,
  next_val   INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.generate_application_id()
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_date TEXT := TO_CHAR(NOW() AT TIME ZONE 'Asia/Kolkata', 'YYYYMMDD');
  v_seq  INTEGER;
BEGIN
  INSERT INTO public.application_id_seq(date_key, next_val)
  VALUES (v_date, 1)
  ON CONFLICT (date_key)
  DO UPDATE SET next_val = application_id_seq.next_val + 1,
                updated_at = NOW()
  RETURNING next_val INTO v_seq;
  RETURN 'NP-' || v_date || '-' || LPAD(v_seq::TEXT, 4, '0');
END;
$$;

-- =============================================================
-- TABLE: crm_updates
-- Activity log / notification per student lead.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.crm_updates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  posted_by   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  update_text TEXT NOT NULL,
  visibility  TEXT NOT NULL CHECK (visibility IN (
    'internal_only','client_visible','student_visible','board_visible'
  )),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_updates_student ON public.crm_updates(student_id);
CREATE INDEX IF NOT EXISTS idx_crm_updates_created ON public.crm_updates(created_at DESC);

-- =============================================================
-- TABLE: client_replies
-- Clients can reply to client_visible updates.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.client_replies (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id  UUID NOT NULL REFERENCES public.crm_updates(id) ON DELETE CASCADE,
  client_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  reply_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_replies_update ON public.client_replies(update_id);

-- =============================================================
-- TABLE: commissions
-- Tracks commission per student-client pair.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.commissions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  commission_type       TEXT NOT NULL DEFAULT 'not_applicable'
                          CHECK (commission_type IN ('percentage','fixed','not_applicable')),
  commission_percentage NUMERIC(5,2) DEFAULT 0,
  commission_fixed_amount NUMERIC(15,2) DEFAULT 0,
  commission_earned     NUMERIC(15,2) DEFAULT 0,
  commission_due        NUMERIC(15,2) DEFAULT 0,
  commission_paid       NUMERIC(15,2) DEFAULT 0,
  commission_status     TEXT NOT NULL DEFAULT 'Not Applicable'
                          CHECK (commission_status IN ('Due','Paid','Hold','Not Applicable')),
  payment_date          DATE,
  payment_reference     TEXT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_commissions_updated_at
  BEFORE UPDATE ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_comm_student ON public.commissions(student_id);
CREATE INDEX IF NOT EXISTS idx_comm_client  ON public.commissions(client_id);
CREATE INDEX IF NOT EXISTS idx_comm_status  ON public.commissions(commission_status);

-- =============================================================
-- TABLE: employee_incentives
-- ₹5,000 incentive when employee refers a successful lead.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.employee_incentives (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  incentive_amount NUMERIC(15,2) NOT NULL DEFAULT 5000,
  incentive_status TEXT NOT NULL DEFAULT 'Pending'
                     CHECK (incentive_status IN ('Pending','Paid')),
  payment_date     DATE,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incentives_employee ON public.employee_incentives(employee_id);
CREATE INDEX IF NOT EXISTS idx_incentives_student  ON public.employee_incentives(student_id);

-- =============================================================
-- TABLE: site_settings
-- Key-value store for site configuration.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key   TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Default site settings
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
  ('business_name', 'Nidhi Path Loan Ventures'),
  ('tagline', 'Way to Money'),
  ('official_phone', '+91 97056 82595'),
  ('official_email', 'info@nidhipath.in'),
  ('official_website', 'www.nidhipath.in'),
  ('address', 'Vijayawada, Andhra Pradesh'),
  ('working_hours', 'Monday to Saturday, 10:00 AM to 6:00 PM')
ON CONFLICT (setting_key) DO NOTHING;

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_details     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_updates         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_replies      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_incentives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_id_seq  ENABLE ROW LEVEL SECURITY;

-- ─── Helper: get caller role ──────────────────────────────────
-- SECURITY DEFINER is intentional and safe here. The function is owned by
-- the role that runs this migration (postgres / table owner), and table
-- owners bypass RLS (no FORCE ROW LEVEL SECURITY is set). So reading
-- public.profiles from inside this function does NOT re-trigger the
-- profiles RLS policies — it avoids the classic infinite-recursion trap.
-- This is the canonical Supabase pattern for role-based RLS.
-- (Note: the backend uses the service_role key, which bypasses RLS entirely,
--  so these policies are defense-in-depth for any direct client access.)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- ─── profiles policies ────────────────────────────────────────
CREATE POLICY "Admin full access on profiles"
  ON public.profiles FOR ALL
  USING (get_my_role() = 'admin')
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Board read all profiles"
  ON public.profiles FOR SELECT
  USING (get_my_role() = 'board_member');

CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Employee read own + assigned students"
  ON public.profiles FOR SELECT
  USING (
    get_my_role() = 'employee'
    AND (
      id = auth.uid()
      OR id IN (
        SELECT student_id FROM public.student_details
        WHERE assigned_employee_id = auth.uid()
      )
    )
  );

CREATE POLICY "Client read own + referred students"
  ON public.profiles FOR SELECT
  USING (
    get_my_role() = 'client'
    AND (
      id = auth.uid()
      OR id IN (
        SELECT student_id FROM public.student_details
        WHERE source_client_id = auth.uid()
      )
    )
  );

-- ─── student_details policies ─────────────────────────────────
CREATE POLICY "Admin full access on student_details"
  ON public.student_details FOR ALL
  USING (get_my_role() = 'admin')
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Board read all student_details"
  ON public.student_details FOR SELECT
  USING (get_my_role() = 'board_member');

CREATE POLICY "Employee read+update assigned"
  ON public.student_details FOR SELECT
  USING (get_my_role() = 'employee' AND assigned_employee_id = auth.uid());

CREATE POLICY "Employee update assigned"
  ON public.student_details FOR UPDATE
  USING (get_my_role() = 'employee' AND assigned_employee_id = auth.uid())
  WITH CHECK (get_my_role() = 'employee' AND assigned_employee_id = auth.uid());

CREATE POLICY "Client read referred"
  ON public.student_details FOR SELECT
  USING (get_my_role() = 'client' AND source_client_id = auth.uid());

CREATE POLICY "Student read own"
  ON public.student_details FOR SELECT
  USING (get_my_role() = 'student' AND student_id = auth.uid());

-- ─── crm_updates policies ─────────────────────────────────────
CREATE POLICY "Admin full access on crm_updates"
  ON public.crm_updates FOR ALL
  USING (get_my_role() = 'admin')
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Employee insert + read own assigned"
  ON public.crm_updates FOR ALL
  USING (
    get_my_role() = 'employee'
    AND student_id IN (
      SELECT student_id FROM public.student_details
      WHERE assigned_employee_id = auth.uid()
    )
  )
  WITH CHECK (
    get_my_role() = 'employee'
    AND student_id IN (
      SELECT student_id FROM public.student_details
      WHERE assigned_employee_id = auth.uid()
    )
  );

CREATE POLICY "Client read client_visible updates"
  ON public.crm_updates FOR SELECT
  USING (
    get_my_role() = 'client'
    AND visibility = 'client_visible'
    AND student_id IN (
      SELECT student_id FROM public.student_details
      WHERE source_client_id = auth.uid()
    )
  );

CREATE POLICY "Student read student_visible updates"
  ON public.crm_updates FOR SELECT
  USING (
    get_my_role() = 'student'
    AND visibility = 'student_visible'
    AND student_id = auth.uid()
  );

CREATE POLICY "Board read all updates"
  ON public.crm_updates FOR SELECT
  USING (get_my_role() = 'board_member');

-- ─── client_replies policies ──────────────────────────────────
CREATE POLICY "Admin full on client_replies"
  ON public.client_replies FOR ALL
  USING (get_my_role() = 'admin')
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Client insert own replies"
  ON public.client_replies FOR INSERT
  WITH CHECK (get_my_role() = 'client' AND client_id = auth.uid());

CREATE POLICY "Client + employee read replies"
  ON public.client_replies FOR SELECT
  USING (
    get_my_role() IN ('admin','employee','board_member')
    OR (get_my_role() = 'client' AND client_id = auth.uid())
  );

-- ─── commissions policies ─────────────────────────────────────
CREATE POLICY "Admin full on commissions"
  ON public.commissions FOR ALL
  USING (get_my_role() = 'admin')
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Board read all commissions"
  ON public.commissions FOR SELECT
  USING (get_my_role() = 'board_member');

CREATE POLICY "Client read own commissions"
  ON public.commissions FOR SELECT
  USING (get_my_role() = 'client' AND client_id = auth.uid());

-- ─── employee_incentives policies ─────────────────────────────
CREATE POLICY "Admin full on incentives"
  ON public.employee_incentives FOR ALL
  USING (get_my_role() = 'admin')
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Board read incentives"
  ON public.employee_incentives FOR SELECT
  USING (get_my_role() = 'board_member');

CREATE POLICY "Employee read own incentives"
  ON public.employee_incentives FOR SELECT
  USING (get_my_role() = 'employee' AND employee_id = auth.uid());

-- ─── site_settings policies ───────────────────────────────────
CREATE POLICY "Admin full on site_settings"
  ON public.site_settings FOR ALL
  USING (get_my_role() = 'admin')
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "All read site_settings"
  ON public.site_settings FOR SELECT
  USING (TRUE);

-- ─── application_id_seq policies ──────────────────────────────
CREATE POLICY "Admin full on app_id_seq"
  ON public.application_id_seq FOR ALL
  USING (get_my_role() = 'admin')
  WITH CHECK (get_my_role() = 'admin');

-- =============================================================
-- GRANTS — service_role can bypass RLS
-- =============================================================
GRANT USAGE ON SCHEMA public TO service_role, anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_application_id() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;
