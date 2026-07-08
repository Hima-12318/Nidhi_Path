-- =============================================================
--  RESET — Clean slate for Nidhi Path SmartCRM
--  -----------------------------------------------------------
--  Run this ONCE in the Supabase SQL Editor BEFORE running
--  migrations/001_initial_schema.sql, but ONLY if the project
--  already contains older/partial CRM tables (the usual cause of
--  "ERROR: 42703: column ... does not exist").
--
--  ⚠ WARNING: this DELETES these tables and all rows in them.
--    It is safe BEFORE go-live (you have no real data yet).
--    NEVER run it on a database that holds real customer data.
--
--  After this finishes with no error, run 001_initial_schema.sql.
-- =============================================================

-- Drop tables (CASCADE also removes their triggers, indexes,
-- policies, and any foreign keys pointing at them).
DROP TABLE IF EXISTS public.client_replies      CASCADE;
DROP TABLE IF EXISTS public.crm_updates         CASCADE;
DROP TABLE IF EXISTS public.commissions         CASCADE;
DROP TABLE IF EXISTS public.employee_incentives CASCADE;
DROP TABLE IF EXISTS public.student_details     CASCADE;
DROP TABLE IF EXISTS public.application_id_seq  CASCADE;
DROP TABLE IF EXISTS public.site_settings       CASCADE;
DROP TABLE IF EXISTS public.profiles            CASCADE;

-- Drop helper functions so 001 can recreate them cleanly
-- (prevents "cannot change return type of existing function").
DROP FUNCTION IF EXISTS public.get_my_role()             CASCADE;
DROP FUNCTION IF EXISTS public.generate_application_id() CASCADE;
DROP FUNCTION IF EXISTS public.set_updated_at()          CASCADE;

-- Note: this does NOT touch auth.users (your login accounts) or
-- any other Supabase-managed schema. Only the CRM tables above.
