/*
  SmartCRM Intelligence role, commission, reporting, and visibility foundation.

  Safe to run after the existing migrations. This migration is additive: it
  extends the current user_profiles/crm_applications CRM foundation and adds
  companion tables for reference partners, commissions, daily updates, income,
  and internal audit logs.
*/

create extension if not exists pgcrypto;

alter table if exists public.admin_profiles
  drop constraint if exists admin_profiles_role_check;

alter table if exists public.admin_profiles
  add constraint admin_profiles_role_check
  check (role in ('super_admin', 'admin', 'ceo', 'board', 'board_member', 'manager', 'support_agent'));

alter table if exists public.user_profiles
  add column if not exists mobile text,
  add column if not exists user_type text not null default 'student',
  add column if not exists role text not null default 'student',
  add column if not exists created_by uuid,
  add column if not exists commission_visibility_enabled boolean not null default false,
  add column if not exists metadata jsonb default '{}'::jsonb;

update public.user_profiles
set mobile = coalesce(mobile, phone)
where mobile is null;

alter table if exists public.user_profiles
  drop constraint if exists user_profiles_status_check;

alter table if exists public.user_profiles
  add constraint user_profiles_status_check
  check (status in ('pending', 'verified', 'approved', 'active', 'inactive', 'suspended'));

alter table if exists public.user_profiles
  drop constraint if exists user_profiles_user_type_check;

alter table if exists public.user_profiles
  add constraint user_profiles_user_type_check
  check (user_type in ('student', 'employee', 'client'));

alter table if exists public.user_profiles
  drop constraint if exists user_profiles_role_check;

alter table if exists public.user_profiles
  add constraint user_profiles_role_check
  check (role in (
    'student',
    'super_admin',
    'admin',
    'ceo',
    'board',
    'board_member',
    'employee',
    'connector',
    'client_consultant',
    'own_self',
    'online_reference',
    'banker_reference',
    'employee_reference'
  ));

alter table if exists public.crm_applications
  add column if not exists student_name text,
  add column if not exists student_email text,
  add column if not exists student_mobile text,
  add column if not exists university_applied text,
  add column if not exists course text,
  add column if not exists loan_amount numeric,
  add column if not exists bank_applied text,
  add column if not exists consultant_client_id uuid,
  add column if not exists reference_source_type text,
  add column if not exists reference_partner_id uuid,
  add column if not exists assigned_employee_id uuid,
  add column if not exists status text,
  add column if not exists interested_status text,
  add column if not exists documents_status text,
  add column if not exists loan_login_status text,
  add column if not exists verification_status text,
  add column if not exists sanctioned_amount numeric,
  add column if not exists sanction_rejection_reason text,
  add column if not exists disbursed_amount numeric,
  add column if not exists disbursement_rejection_reason text,
  add column if not exists closed_status text;

update public.crm_applications
set
  student_name = coalesce(student_name, customer_name),
  student_email = coalesce(student_email, customer_email),
  student_mobile = coalesce(student_mobile, customer_phone),
  loan_amount = coalesce(loan_amount, loan_amount_required),
  bank_applied = coalesce(bank_applied, bank_name),
  sanctioned_amount = coalesce(sanctioned_amount, loan_amount_approved),
  status = coalesce(status, application_status),
  documents_status = coalesce(documents_status, document_status)
where
  student_name is null
  or student_email is null
  or student_mobile is null
  or loan_amount is null
  or bank_applied is null
  or sanctioned_amount is null
  or status is null
  or documents_status is null;

create table if not exists public.reference_partners (
  id uuid primary key default gen_random_uuid(),
  profile_user_id uuid references public.user_profiles(id) on delete set null,
  reference_type text not null,
  name text not null,
  email text,
  mobile text,
  company_name text,
  contact_person text,
  commission_default_percentage numeric default 0,
  commission_visibility_enabled boolean not null default false,
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint reference_partners_type_check check (reference_type in (
    'connector',
    'client_consultant',
    'own_self',
    'online_reference',
    'banker_reference',
    'employee_reference'
  )),
  constraint reference_partners_status_check check (status in ('active', 'inactive', 'suspended'))
);

alter table if exists public.reference_partners
  drop constraint if exists reference_partners_profile_user_unique;

alter table if exists public.reference_partners
  add constraint reference_partners_profile_user_unique unique (profile_user_id);

alter table if exists public.crm_applications
  drop constraint if exists crm_applications_reference_partner_fk;

alter table if exists public.crm_applications
  add constraint crm_applications_reference_partner_fk
  foreign key (reference_partner_id) references public.reference_partners(id) on delete set null;

create table if not exists public.application_commissions (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.crm_applications(id) on delete cascade,
  reference_partner_id uuid references public.reference_partners(id) on delete set null,
  commission_percentage numeric default 0,
  commission_base_type text not null default 'not_applicable',
  commission_base_amount numeric default 0,
  commission_amount numeric default 0,
  commission_status text not null default 'not_applicable',
  paid_date date,
  payment_reference text,
  commission_notes text,
  manual_override boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint application_commissions_base_check check (commission_base_type in (
    'sanctioned_amount',
    'disbursed_amount',
    'fixed_amount',
    'not_applicable'
  )),
  constraint application_commissions_status_check check (commission_status in (
    'due',
    'paid',
    'hold',
    'not_applicable'
  ))
);

create table if not exists public.application_updates (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.crm_applications(id) on delete cascade,
  updated_by_user_id uuid references public.user_profiles(id) on delete set null,
  update_type text not null default 'message',
  title text,
  message text not null,
  visibility text not null default 'internal',
  created_at timestamptz default now(),
  constraint application_updates_visibility_check check (visibility in (
    'internal',
    'student_visible',
    'client_visible',
    'all'
  ))
);

create table if not exists public.employee_daily_updates (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references public.user_profiles(id) on delete cascade,
  work_date date not null default ((now() at time zone 'Asia/Kolkata')::date),
  total_leads_handled integer not null default 0,
  new_leads_contacted integer not null default 0,
  followups_done integer not null default 0,
  documents_collected integer not null default 0,
  bank_logins_done integer not null default 0,
  verification_updates integer not null default 0,
  sanction_updates integer not null default 0,
  disbursement_updates integer not null default 0,
  rejected_count integer not null default 0,
  not_interested_count integer not null default 0,
  pending_issues text,
  tomorrow_plan text,
  remarks text,
  submitted_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (employee_id, work_date)
);

create table if not exists public.business_income_records (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.crm_applications(id) on delete cascade,
  income_type text,
  service_charge numeric default 0,
  commission_received numeric default 0,
  other_income numeric default 0,
  partner_commission_payable numeric default 0,
  partner_commission_paid numeric default 0,
  employee_incentive numeric default 0,
  other_expense numeric default 0,
  gross_income numeric default 0,
  net_income numeric default 0,
  payment_status text default 'pending',
  received_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint business_income_payment_status_check check (payment_status in (
    'pending',
    'partial',
    'received',
    'overdue',
    'cancelled'
  ))
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  actor_role text,
  action text not null,
  table_name text,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz default now()
);

create or replace view public.student_applications as
select
  id,
  application_id,
  user_profile_id as student_user_id,
  coalesce(student_name, customer_name) as student_name,
  coalesce(student_email, customer_email) as student_email,
  coalesce(student_mobile, customer_phone) as student_mobile,
  university_applied,
  course,
  coalesce(loan_amount, loan_amount_required) as loan_amount,
  coalesce(bank_applied, bank_name) as bank_applied,
  consultant_client_id,
  reference_source_type,
  reference_partner_id,
  assigned_employee_id,
  coalesce(status, application_status) as status,
  interested_status,
  coalesce(documents_status, document_status) as documents_status,
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

create index if not exists idx_user_profiles_user_type on public.user_profiles(user_type);
create index if not exists idx_user_profiles_role on public.user_profiles(role);
create index if not exists idx_user_profiles_created_by on public.user_profiles(created_by);
create index if not exists idx_crm_applications_assigned_employee_id on public.crm_applications(assigned_employee_id);
create index if not exists idx_crm_applications_reference_partner_id on public.crm_applications(reference_partner_id);
create index if not exists idx_crm_applications_reference_source_type on public.crm_applications(reference_source_type);
create index if not exists idx_reference_partners_profile_user_id on public.reference_partners(profile_user_id);
create index if not exists idx_reference_partners_reference_type on public.reference_partners(reference_type);
create index if not exists idx_application_commissions_application_id on public.application_commissions(application_id);
create index if not exists idx_application_commissions_partner_id on public.application_commissions(reference_partner_id);
create index if not exists idx_employee_daily_updates_employee_date on public.employee_daily_updates(employee_id, work_date desc);
create index if not exists idx_business_income_records_application_id on public.business_income_records(application_id);
create index if not exists idx_audit_logs_actor_user_id on public.audit_logs(actor_user_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);

drop trigger if exists set_reference_partners_updated_at on public.reference_partners;
create trigger set_reference_partners_updated_at
before update on public.reference_partners
for each row execute function public.set_updated_at();

drop trigger if exists set_application_commissions_updated_at on public.application_commissions;
create trigger set_application_commissions_updated_at
before update on public.application_commissions
for each row execute function public.set_updated_at();

drop trigger if exists set_employee_daily_updates_updated_at on public.employee_daily_updates;
create trigger set_employee_daily_updates_updated_at
before update on public.employee_daily_updates
for each row execute function public.set_updated_at();

drop trigger if exists set_business_income_records_updated_at on public.business_income_records;
create trigger set_business_income_records_updated_at
before update on public.business_income_records
for each row execute function public.set_updated_at();

alter table if exists public.reference_partners enable row level security;
alter table if exists public.application_commissions enable row level security;
alter table if exists public.application_updates enable row level security;
alter table if exists public.employee_daily_updates enable row level security;
alter table if exists public.business_income_records enable row level security;
alter table if exists public.audit_logs enable row level security;

grant usage on schema public to service_role;
grant all privileges on table public.admin_profiles to service_role;
grant all privileges on table public.user_profiles to service_role;
grant all privileges on table public.crm_applications to service_role;
grant all privileges on table public.reference_partners to service_role;
grant all privileges on table public.application_commissions to service_role;
grant all privileges on table public.application_updates to service_role;
grant all privileges on table public.employee_daily_updates to service_role;
grant all privileges on table public.business_income_records to service_role;
grant all privileges on table public.audit_logs to service_role;
grant select on public.student_applications to service_role;
