-- Client final review CRM/chat updates. Safe to run more than once.

alter table if exists public.user_profiles
  add column if not exists client_type text not null default 'regular';

alter table if exists public.crm_applications
  add column if not exists client_type text not null default 'regular',
  add column if not exists workflow_stage text,
  add column if not exists document_status text not null default 'not_started',
  add column if not exists bank_name text,
  add column if not exists loan_amount_required numeric,
  add column if not exists loan_amount_approved numeric,
  add column if not exists sanction_status text not null default 'not_started',
  add column if not exists disbursement_status text not null default 'not_started',
  add column if not exists commission_status text not null default 'not_applicable',
  add column if not exists assigned_admin text,
  add column if not exists priority text not null default 'normal',
  add column if not exists next_followup_date date;

alter table if exists public.crm_updates
  add column if not exists client_visible boolean not null default true,
  add column if not exists source text not null default 'admin',
  add column if not exists client_mutation_id text;

alter table if exists public.chat_sessions
  add column if not exists bot_answer_count int not null default 0,
  add column if not exists live_agent_requested boolean not null default false,
  add column if not exists service_category text,
  add column if not exists last_polled_at timestamptz;

do $$
begin
  alter table public.user_profiles
    drop constraint if exists user_profiles_client_type_check;
  alter table public.user_profiles
    add constraint user_profiles_client_type_check check (client_type in ('regular', 'b2b'));

  alter table public.crm_applications
    drop constraint if exists crm_applications_client_type_check;
  alter table public.crm_applications
    add constraint crm_applications_client_type_check check (client_type in ('regular', 'b2b'));

  alter table public.crm_applications
    drop constraint if exists crm_applications_priority_check;
  alter table public.crm_applications
    add constraint crm_applications_priority_check check (priority in ('low', 'normal', 'high', 'urgent'));

  alter table public.crm_applications
    drop constraint if exists crm_applications_status_check;
  alter table public.crm_applications
    add constraint crm_applications_status_check check (
      application_status in (
        'new_user', 'registered', 'verified', 'approved', 'approved_partner',
        'documents_pending', 'documents_received', 'work_started', 'in_progress',
        'bank_review', 'sanction_in_progress', 'sanctioned', 'disbursement_pending',
        'disbursed', 'referral_received', 'client_contacted', 'loan_processing',
        'commission_pending', 'commission_paid', 'submitted', 'on_hold',
        'completed', 'rejected', 'closed'
      )
    );

  alter table public.chat_sessions
    drop constraint if exists chat_sessions_status_check;
  alter table public.chat_sessions
    add constraint chat_sessions_status_check check (
      status in ('open', 'waiting_for_agent', 'customer_waiting', 'live_agent_requested', 'agent_joined', 'agent_replied', 'closed')
    );
end $$;

update public.crm_applications
set workflow_stage = coalesce(workflow_stage, application_status)
where workflow_stage is null;

create index if not exists idx_user_profiles_client_type on public.user_profiles(client_type);
create index if not exists idx_crm_applications_client_type on public.crm_applications(client_type);
create index if not exists idx_crm_applications_workflow_stage on public.crm_applications(workflow_stage);
create index if not exists idx_crm_applications_next_followup_date on public.crm_applications(next_followup_date);
create index if not exists idx_crm_updates_client_mutation_id on public.crm_updates(client_mutation_id);
create index if not exists idx_chat_sessions_live_agent_requested on public.chat_sessions(live_agent_requested);

alter table if exists public.user_profiles enable row level security;
alter table if exists public.crm_applications enable row level security;
alter table if exists public.crm_updates enable row level security;
alter table if exists public.chat_sessions enable row level security;

grant all privileges on table public.user_profiles to service_role;
grant all privileges on table public.crm_applications to service_role;
grant all privileges on table public.crm_updates to service_role;
grant all privileges on table public.chat_sessions to service_role;
