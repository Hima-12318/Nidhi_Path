/*
  Duplicate handling support and dashboard polish fields.

  Safe to run multiple times after the existing schema migrations.
*/

alter table if exists public.user_profiles
  add column if not exists normalized_email text,
  add column if not exists normalized_phone text,
  add column if not exists client_type text default 'regular';

alter table if exists public.crm_applications
  add column if not exists normalized_email text,
  add column if not exists normalized_phone text,
  add column if not exists customer_key text,
  add column if not exists bank_name text,
  add column if not exists loan_amount_required numeric,
  add column if not exists loan_amount_approved numeric,
  add column if not exists assigned_admin_name text,
  add column if not exists next_followup_date date,
  add column if not exists admin_status text default 'registered',
  add column if not exists document_status text default 'not_started';

alter table if exists public.enquiries
  add column if not exists normalized_email text,
  add column if not exists normalized_phone text,
  add column if not exists customer_key text,
  add column if not exists linked_user_profile_id uuid,
  add column if not exists linked_application_id uuid;

alter table if exists public.chat_sessions
  add column if not exists normalized_email text,
  add column if not exists normalized_phone text,
  add column if not exists customer_key text;

update public.user_profiles
set
  normalized_email = lower(trim(email)),
  normalized_phone = right(regexp_replace(coalesce(phone, ''), '\D', '', 'g'), 10)
where normalized_email is null or normalized_phone is null;

update public.crm_applications
set
  normalized_email = lower(trim(customer_email)),
  normalized_phone = right(regexp_replace(coalesce(customer_phone, ''), '\D', '', 'g'), 10),
  customer_key = coalesce(customer_key, lower(trim(customer_email)) || '|' || right(regexp_replace(coalesce(customer_phone, ''), '\D', '', 'g'), 10))
where normalized_email is null or normalized_phone is null or customer_key is null;

update public.enquiries
set
  normalized_email = lower(trim(email)),
  normalized_phone = right(regexp_replace(coalesce(phone, ''), '\D', '', 'g'), 10),
  customer_key = coalesce(customer_key, lower(trim(coalesce(email, ''))) || '|' || right(regexp_replace(coalesce(phone, ''), '\D', '', 'g'), 10))
where normalized_email is null or normalized_phone is null or customer_key is null;

update public.chat_sessions
set
  normalized_email = lower(trim(customer_email)),
  normalized_phone = right(regexp_replace(coalesce(customer_phone, ''), '\D', '', 'g'), 10),
  customer_key = coalesce(customer_key, lower(trim(coalesce(customer_email, ''))) || '|' || right(regexp_replace(coalesce(customer_phone, ''), '\D', '', 'g'), 10))
where normalized_email is null or normalized_phone is null or customer_key is null;

create index if not exists idx_user_profiles_normalized_email on public.user_profiles(normalized_email);
create index if not exists idx_user_profiles_normalized_phone on public.user_profiles(normalized_phone);
create index if not exists idx_crm_applications_customer_key on public.crm_applications(customer_key);
create index if not exists idx_crm_applications_normalized_identity on public.crm_applications(normalized_email, normalized_phone);
create index if not exists idx_enquiries_customer_key on public.enquiries(customer_key);
create index if not exists idx_enquiries_normalized_identity on public.enquiries(normalized_email, normalized_phone);
create index if not exists idx_chat_sessions_customer_key on public.chat_sessions(customer_key);
create index if not exists idx_chat_sessions_normalized_identity on public.chat_sessions(normalized_email, normalized_phone);

grant all privileges on table public.user_profiles to service_role;
grant all privileges on table public.crm_applications to service_role;
grant all privileges on table public.enquiries to service_role;
grant all privileges on table public.chat_sessions to service_role;
