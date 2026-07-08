/*
  016_users_module_role_flows.sql
  Nidhi Path SmartCRM Intelligence

  Additive migration. Safe to re-run. Extends the existing schema with all
  columns and tables that the SmartCRM role-intelligence layer expects but
  that were not present in migrations 007 and 013.

  Run after:
    001_schema.sql
    007_user_crm_schema.sql
    013_smartcrm_role_intelligence.sql
*/

-- ============================================================
-- 1. crm_updates — add visibility columns expected by the backend
-- ============================================================
alter table if exists public.crm_updates
  add column if not exists client_visible   boolean not null default true,
  add column if not exists student_visible  boolean not null default true,
  add column if not exists board_visible    boolean not null default false,
  add column if not exists internal_only    boolean not null default false,
  add column if not exists parent_update_id uuid,
  add column if not exists created_by_role  text,
  add column if not exists source           text default 'admin',
  add column if not exists client_mutation_id text;

-- Back-fill existing rows: if visible_to_user is true treat as all-visible,
-- if false treat as internal-only.
update public.crm_updates
set
  client_visible  = coalesce(client_visible,  visible_to_user),
  student_visible = coalesce(student_visible, visible_to_user),
  board_visible   = coalesce(board_visible,   false),
  internal_only   = coalesce(internal_only,   not visible_to_user)
where client_visible is null;

-- ============================================================
-- 2. crm_applications — add SmartCRM extended columns
-- ============================================================
alter table if exists public.crm_applications
  add column if not exists university_applied_for text,
  add column if not exists loan_amount_needed      numeric,
  add column if not exists loan_amount_sanctioned  numeric,
  add column if not exists loan_amount_disbursed   numeric,
  add column if not exists client_id               uuid,
  add column if not exists lead_source_type        text,
  add column if not exists reference_owner_id      uuid,
  add column if not exists linked_employee_id      uuid,
  add column if not exists student_visible_status  text,
  add column if not exists country                 text,
  add column if not exists workflow_stage          text;

-- Back-fill sensible defaults for existing records.
update public.crm_applications
set
  university_applied_for = coalesce(university_applied_for, university_applied),
  loan_amount_needed     = coalesce(loan_amount_needed,     loan_amount, loan_amount_required),
  loan_amount_sanctioned = coalesce(loan_amount_sanctioned, sanctioned_amount, loan_amount_approved),
  client_id              = coalesce(client_id,              reference_partner_id),
  lead_source_type       = coalesce(lead_source_type,       reference_source_type),
  reference_owner_id     = coalesce(reference_owner_id,     reference_partner_id),
  student_visible_status = coalesce(student_visible_status, status, application_status),
  workflow_stage         = coalesce(workflow_stage,         application_status)
where university_applied_for is null
   or loan_amount_needed is null
   or student_visible_status is null;

-- ============================================================
-- 3. reference_partners — add commission and contact columns
-- ============================================================
alter table if exists public.reference_partners
  add column if not exists commission_type              text default 'percentage',
  add column if not exists commission_fixed_amount      numeric default 0,
  add column if not exists city                         text,
  add column if not exists state                        text,
  add column if not exists office_address               text,
  add column if not exists website                      text,
  add column if not exists gst_number                   text,
  add column if not exists agreement_status             text,
  add column if not exists source_url                   text,
  add column if not exists linked_employee_id           uuid,
  add column if not exists incentive_amount             numeric default 0,
  add column if not exists incentive_status             text default 'not_applicable',
  add column if not exists bank_account_name            text,
  add column if not exists bank_account_number          text,
  add column if not exists bank_ifsc                    text,
  add column if not exists upi_id                       text,
  add column if not exists notes                        text,
  add column if not exists metadata                     jsonb default '{}'::jsonb;

-- ============================================================
-- 4. application_commissions — add missing financial columns
-- ============================================================
alter table if exists public.application_commissions
  add column if not exists commission_type        text default 'percentage',
  add column if not exists commission_fixed_amount numeric default 0,
  add column if not exists commission_earned       numeric default 0,
  add column if not exists commission_due          numeric default 0,
  add column if not exists commission_paid         numeric default 0,
  add column if not exists commission_payment_date date,
  add column if not exists client_id              uuid,
  add column if not exists lead_id               uuid;

-- Back-fill earned / due from commission_amount.
update public.application_commissions
set
  commission_earned = coalesce(commission_earned, commission_amount, 0),
  commission_due    = coalesce(commission_due,    case when commission_status = 'due' then commission_amount else 0 end, 0),
  commission_paid   = coalesce(commission_paid,   case when commission_status = 'paid' then commission_amount else 0 end, 0),
  client_id         = coalesce(client_id,         reference_partner_id),
  lead_id           = coalesce(lead_id,           application_id)
where commission_earned is null or commission_due is null;

-- ============================================================
-- 5. employee_incentives — new table for employee reference bonuses
-- ============================================================
create table if not exists public.employee_incentives (
  id                   uuid primary key default gen_random_uuid(),
  employee_id          uuid references public.user_profiles(id) on delete cascade,
  application_id       uuid references public.crm_applications(id) on delete cascade,
  reference_partner_id uuid references public.reference_partners(id) on delete set null,
  incentive_amount     numeric not null default 5000,
  incentive_status     text not null default 'due',
  incentive_paid_date  date,
  notes                text,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now(),
  constraint employee_incentives_status_check check (incentive_status in (
    'due', 'paid', 'hold', 'not_applicable'
  ))
);

drop trigger if exists set_employee_incentives_updated_at on public.employee_incentives;
create trigger set_employee_incentives_updated_at
before update on public.employee_incentives
for each row execute function public.set_updated_at();

alter table if exists public.employee_incentives enable row level security;
grant all privileges on table public.employee_incentives to service_role;

create index if not exists idx_employee_incentives_employee_id   on public.employee_incentives(employee_id);
create index if not exists idx_employee_incentives_application_id on public.employee_incentives(application_id);

-- ============================================================
-- 6. admin_audit_logs — new table for admin action tracking
-- ============================================================
create table if not exists public.admin_audit_logs (
  id             uuid primary key default gen_random_uuid(),
  admin_user_id  uuid,
  action         text not null,
  module         text,
  record_id      uuid,
  old_value      jsonb,
  new_value      jsonb,
  created_at     timestamptz default now()
);

alter table if exists public.admin_audit_logs enable row level security;
grant all privileges on table public.admin_audit_logs to service_role;

create index if not exists idx_admin_audit_logs_admin_user_id on public.admin_audit_logs(admin_user_id);
create index if not exists idx_admin_audit_logs_created_at    on public.admin_audit_logs(created_at desc);
create index if not exists idx_admin_audit_logs_module        on public.admin_audit_logs(module);

-- ============================================================
-- 7. New indexes for extended columns
-- ============================================================
create index if not exists idx_crm_applications_client_id         on public.crm_applications(client_id);
create index if not exists idx_crm_applications_lead_source_type  on public.crm_applications(lead_source_type);
create index if not exists idx_crm_applications_linked_employee   on public.crm_applications(linked_employee_id);
create index if not exists idx_crm_applications_workflow_stage    on public.crm_applications(workflow_stage);
create index if not exists idx_reference_partners_linked_employee on public.reference_partners(linked_employee_id);
create index if not exists idx_app_commissions_client_id          on public.application_commissions(client_id);

-- ============================================================
-- 8. Drop and re-create student_applications view with new columns
-- ============================================================
drop view if exists public.student_applications;

create or replace view public.student_applications as
select
  id,
  application_id,
  user_profile_id                                   as student_user_id,
  coalesce(student_name, customer_name)             as student_name,
  coalesce(student_email, customer_email)           as student_email,
  coalesce(student_mobile, customer_phone)          as student_mobile,
  university_applied,
  university_applied_for,
  country,
  course,
  coalesce(loan_amount_needed, loan_amount,
           loan_amount_required)                    as loan_amount_needed,
  coalesce(loan_amount_sanctioned, sanctioned_amount,
           loan_amount_approved)                    as loan_amount_sanctioned,
  coalesce(loan_amount_disbursed, disbursed_amount) as loan_amount_disbursed,
  coalesce(bank_applied, bank_name)                 as bank_applied,
  consultant_client_id,
  reference_source_type,
  lead_source_type,
  reference_partner_id,
  client_id,
  reference_owner_id,
  linked_employee_id,
  assigned_employee_id,
  coalesce(status, application_status)              as status,
  coalesce(student_visible_status, status,
           application_status)                      as student_visible_status,
  coalesce(workflow_stage, application_status)      as workflow_stage,
  interested_status,
  coalesce(documents_status, document_status)       as documents_status,
  loan_login_status,
  verification_status,
  sanction_status,
  coalesce(sanctioned_amount, loan_amount_approved) as sanctioned_amount,
  sanction_rejection_reason,
  disbursement_status,
  disbursed_amount,
  disbursement_rejection_reason,
  closed_status,
  created_at,
  updated_at
from public.crm_applications;

grant select on public.student_applications to service_role;
