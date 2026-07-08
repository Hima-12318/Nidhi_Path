/*
  One-time SQL for the current Nidhi Path Supabase project.

  Why this exists:
  - The Auth user for info@nidhipath.in has been created and email-confirmed.
  - PostgREST is currently returning permission denied for service_role table
    access, so these GRANT statements must be run in the Supabase SQL Editor.
  - Passwords are never stored here; the password belongs only to Supabase Auth.
*/

grant usage on schema public to service_role;
grant all privileges on table public.admin_profiles to service_role;
grant all privileges on table public.enquiries to service_role;
grant all privileges on table public.chat_sessions to service_role;
grant all privileges on table public.chat_messages to service_role;
grant all privileges on table public.whatsapp_logs to service_role;
grant all privileges on table public.activity_logs to service_role;

insert into public.admin_profiles (auth_user_id, full_name, email, role, status)
values (
  '00c260ed-7fab-4a4f-ba17-eb3436abfcfa',
  'Nidhi Path Admin',
  'info@nidhipath.in',
  'super_admin',
  'active'
)
on conflict (email)
do update set
  auth_user_id = excluded.auth_user_id,
  full_name = excluded.full_name,
  role = excluded.role,
  status = excluded.status,
  updated_at = now();
