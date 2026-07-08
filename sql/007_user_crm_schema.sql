/*
  User account and basic CRM foundation for Nidhi Path Loan Ventures.

  Run this after:
  - 001_schema.sql
  - 002_rls_policies.sql
  - 004_site_management_schema.sql
*/

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  full_name text not null,
  email text not null unique,
  phone text,
  status text not null default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint user_profiles_status_check check (status in ('pending', 'verified', 'approved', 'inactive', 'suspended'))
);

create table if not exists public.crm_applications (
  id uuid primary key default gen_random_uuid(),
  application_id text unique,
  user_profile_id uuid references public.user_profiles(id) on delete cascade,
  auth_user_id uuid,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  service text,
  application_status text not null default 'new_user',
  admin_status text not null default 'registered',
  work_started_at timestamptz,
  approved_at timestamptz,
  assigned_to uuid,
  notes text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint crm_applications_status_check check (
    application_status in (
      'new_user',
      'registered',
      'verified',
      'approved',
      'documents_pending',
      'work_started',
      'in_progress',
      'submitted',
      'on_hold',
      'completed',
      'rejected',
      'closed'
    )
  )
);

create table if not exists public.crm_updates (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.crm_applications(id) on delete cascade,
  user_profile_id uuid references public.user_profiles(id) on delete cascade,
  created_by_admin uuid,
  update_type text not null default 'message',
  title text,
  message text not null,
  visible_to_user boolean not null default true,
  created_at timestamptz default now(),
  constraint crm_updates_type_check check (
    update_type in ('message', 'status_update', 'document_request', 'internal_note', 'system')
  )
);

create table if not exists public.crm_status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.crm_applications(id) on delete cascade,
  old_status text,
  new_status text not null,
  changed_by uuid,
  change_reason text,
  created_at timestamptz default now()
);

create table if not exists public.application_id_counters (
  date_key text primary key,
  next_value integer not null default 0,
  updated_at timestamptz default now()
);

create or replace function public.generate_nidhi_application_id()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_date_key text := to_char((now() at time zone 'Asia/Kolkata'), 'YYYYMMDD');
  v_next integer;
begin
  insert into public.application_id_counters (date_key, next_value)
  values (v_date_key, 1)
  on conflict (date_key)
  do update set
    next_value = public.application_id_counters.next_value + 1,
    updated_at = now()
  returning next_value into v_next;

  return 'NP-APP-' || v_date_key || '-' || lpad(v_next::text, 4, '0');
end;
$$;

create index if not exists idx_user_profiles_auth_user_id on public.user_profiles(auth_user_id);
create index if not exists idx_user_profiles_email on public.user_profiles(email);
create index if not exists idx_user_profiles_status on public.user_profiles(status);
create index if not exists idx_crm_applications_application_id on public.crm_applications(application_id);
create index if not exists idx_crm_applications_user_profile_id on public.crm_applications(user_profile_id);
create index if not exists idx_crm_applications_auth_user_id on public.crm_applications(auth_user_id);
create index if not exists idx_crm_applications_status on public.crm_applications(application_status);
create index if not exists idx_crm_applications_created_at on public.crm_applications(created_at desc);
create index if not exists idx_crm_updates_application_id on public.crm_updates(application_id);
create index if not exists idx_crm_updates_user_profile_id on public.crm_updates(user_profile_id);
create index if not exists idx_crm_updates_created_at on public.crm_updates(created_at desc);
create index if not exists idx_crm_status_history_application_id on public.crm_status_history(application_id);

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_crm_applications_updated_at on public.crm_applications;
create trigger set_crm_applications_updated_at
before update on public.crm_applications
for each row execute function public.set_updated_at();

alter table public.user_profiles enable row level security;
alter table public.crm_applications enable row level security;
alter table public.crm_updates enable row level security;
alter table public.crm_status_history enable row level security;
alter table public.application_id_counters enable row level security;

/*
  Public browser code must not query these tables directly.
  The Express backend verifies user/admin tokens and uses the service_role key.
*/
grant usage on schema public to service_role;
grant all privileges on table public.user_profiles to service_role;
grant all privileges on table public.crm_applications to service_role;
grant all privileges on table public.crm_updates to service_role;
grant all privileges on table public.crm_status_history to service_role;
grant all privileges on table public.application_id_counters to service_role;
grant execute on function public.generate_nidhi_application_id() to service_role;
