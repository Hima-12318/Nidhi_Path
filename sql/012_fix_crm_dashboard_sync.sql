/*
  Fix CRM application save/dashboard sync columns.

  Safe to run multiple times. Does not drop tables or overwrite data.
*/

alter table if exists public.crm_applications
  add column if not exists bank_name text,
  add column if not exists loan_amount_required numeric,
  add column if not exists loan_amount_approved numeric,
  add column if not exists sanction_status text default 'not_started',
  add column if not exists disbursement_status text default 'not_started',
  add column if not exists next_followup_date date,
  add column if not exists assigned_admin_name text,
  add column if not exists admin_status text default 'registered',
  add column if not exists priority text default 'normal',
  add column if not exists document_status text default 'not_started',
  add column if not exists documents_pending text,
  add column if not exists documents_received text,
  add column if not exists workflow_stage text,
  add column if not exists application_status text default 'new_user',
  add column if not exists service text,
  add column if not exists notes text,
  add column if not exists client_type text default 'regular',
  add column if not exists commission_status text default 'not_applicable',
  add column if not exists updated_at timestamptz default now();

update public.crm_applications
set workflow_stage = coalesce(workflow_stage, application_status, 'new_user')
where workflow_stage is null;

update public.crm_applications
set
  application_status = coalesce(application_status, 'new_user'),
  priority = coalesce(priority, 'normal'),
  client_type = coalesce(client_type, 'regular')
where application_status is null or priority is null or client_type is null;

do $$
begin
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

  alter table public.crm_applications
    drop constraint if exists crm_applications_priority_check;
  alter table public.crm_applications
    add constraint crm_applications_priority_check check (priority in ('low', 'normal', 'high', 'urgent'));

  alter table public.crm_applications
    drop constraint if exists crm_applications_client_type_check;
  alter table public.crm_applications
    add constraint crm_applications_client_type_check check (client_type in ('regular', 'b2b'));
end $$;

create index if not exists idx_crm_applications_user_profile_id on public.crm_applications(user_profile_id);
create index if not exists idx_crm_applications_auth_user_id on public.crm_applications(auth_user_id);
create index if not exists idx_crm_applications_application_id on public.crm_applications(application_id);
create index if not exists idx_crm_applications_updated_at on public.crm_applications(updated_at desc);

grant all privileges on table public.crm_applications to service_role;
