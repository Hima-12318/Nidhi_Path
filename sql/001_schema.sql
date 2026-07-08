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

create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  full_name text not null,
  email text not null unique,
  phone text,
  role text not null default 'admin',
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint admin_profiles_role_check check (role in ('super_admin', 'admin', 'manager', 'support_agent')),
  constraint admin_profiles_status_check check (status in ('active', 'inactive', 'suspended'))
);

alter table public.admin_profiles
drop constraint if exists admin_profiles_role_check;

alter table public.admin_profiles
add constraint admin_profiles_role_check
check (role in ('super_admin', 'admin', 'manager', 'support_agent'));

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null unique,
  name text not null,
  phone text not null,
  email text,
  service text not null,
  message text not null,
  source_page text,
  source_form text,
  preferred_language text default 'en',
  status text not null default 'new',
  assigned_to uuid,
  whatsapp_status text default 'not_sent',
  created_from text default 'website',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint enquiries_status_check check (status in ('new', 'contacted', 'in_progress', 'closed', 'rejected'))
);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  chat_reference_id text not null unique,
  enquiry_id uuid references public.enquiries(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  service text,
  initial_message text,
  status text not null default 'open',
  assigned_to uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint chat_sessions_status_check check (status in ('open', 'waiting_for_agent', 'agent_joined', 'closed'))
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_session_id uuid references public.chat_sessions(id) on delete cascade,
  sender_type text not null,
  sender_id text,
  message text not null,
  message_type text default 'text',
  delivery_status text default 'sent',
  created_at timestamptz default now(),
  constraint chat_messages_sender_type_check check (sender_type in ('customer', 'agent', 'system')),
  constraint chat_messages_type_check check (message_type in ('text')),
  constraint chat_messages_delivery_check check (delivery_status in ('sent', 'delivered', 'read', 'failed'))
);

create table if not exists public.whatsapp_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  related_table text,
  related_id uuid,
  recipient_number text,
  message_preview text,
  whatsapp_message_id text,
  status text not null,
  error_message text,
  created_at timestamptz default now(),
  constraint whatsapp_logs_status_check check (status in ('sent', 'failed', 'not_configured'))
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  module text,
  record_id uuid,
  details jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_enquiries_reference_id on public.enquiries(reference_id);
create index if not exists idx_enquiries_phone on public.enquiries(phone);
create index if not exists idx_enquiries_status on public.enquiries(status);
create index if not exists idx_enquiries_created_at on public.enquiries(created_at desc);
create index if not exists idx_chat_sessions_chat_reference_id on public.chat_sessions(chat_reference_id);
create index if not exists idx_chat_sessions_status on public.chat_sessions(status);
create index if not exists idx_chat_messages_chat_session_id on public.chat_messages(chat_session_id);
create index if not exists idx_whatsapp_logs_related_id on public.whatsapp_logs(related_id);
create index if not exists idx_admin_profiles_auth_user_id on public.admin_profiles(auth_user_id);
create index if not exists idx_admin_profiles_email on public.admin_profiles(email);

drop trigger if exists set_admin_profiles_updated_at on public.admin_profiles;
create trigger set_admin_profiles_updated_at
before update on public.admin_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_enquiries_updated_at on public.enquiries;
create trigger set_enquiries_updated_at
before update on public.enquiries
for each row execute function public.set_updated_at();

drop trigger if exists set_chat_sessions_updated_at on public.chat_sessions;
create trigger set_chat_sessions_updated_at
before update on public.chat_sessions
for each row execute function public.set_updated_at();

/*
  The Express backend uses Supabase's service_role key for trusted server-side
  access. RLS still remains enabled in 002_rls_policies.sql, but the
  service_role must also have SQL table privileges.
*/
grant usage on schema public to service_role;
grant all privileges on table public.admin_profiles to service_role;
grant all privileges on table public.enquiries to service_role;
grant all privileges on table public.chat_sessions to service_role;
grant all privileges on table public.chat_messages to service_role;
grant all privileges on table public.whatsapp_logs to service_role;
grant all privileges on table public.activity_logs to service_role;
grant execute on function public.set_updated_at() to service_role;
