/*
  Employee daily update history/reporting hardening.

  Production-safe and additive only:
  - Keeps existing employee_daily_updates data.
  - Reinforces one editable record per employee per work_date.
  - Adds optional metadata columns used by report exports.
*/

alter table if exists public.employee_daily_updates
  add column if not exists employee_name text,
  add column if not exists submitted_by uuid references public.user_profiles(id) on delete set null,
  add column if not exists files_approved integer not null default 0,
  add column if not exists files_rejected integer not null default 0,
  add column if not exists rejection_reason text;

update public.employee_daily_updates edu
set submitted_by = coalesce(edu.submitted_by, edu.employee_id)
where edu.submitted_by is null;

update public.employee_daily_updates edu
set employee_name = coalesce(edu.employee_name, up.full_name, up.email)
from public.user_profiles up
where edu.employee_id = up.id
  and edu.employee_name is null;

create unique index if not exists employee_daily_updates_employee_date_unique
on public.employee_daily_updates(employee_id, work_date);

create index if not exists idx_employee_daily_updates_work_date
on public.employee_daily_updates(work_date desc);
