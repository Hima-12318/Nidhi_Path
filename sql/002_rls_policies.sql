alter table public.admin_profiles enable row level security;
alter table public.enquiries enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.whatsapp_logs enable row level security;
alter table public.activity_logs enable row level security;

/*
  Security model for this MVP:

  - The browser never reads or writes Supabase tables directly.
  - Public website forms call the Express backend under /api.
  - The backend uses SUPABASE_SERVICE_ROLE_KEY only on the server.
  - Supabase service role bypasses RLS and performs all trusted data access.
  - Admin users authenticate with Supabase Auth, then the backend verifies that
    the auth user exists in admin_profiles before allowing protected API access.

  For that reason, this file intentionally creates no anon/public select,
  insert, update, or delete policies. Keep it that way unless the architecture
  changes to direct browser-to-Supabase access.

  Important: RLS bypass does not replace SQL privileges. The backend service
  role still needs GRANT access to the tables.
*/

grant usage on schema public to service_role;
grant all privileges on table public.admin_profiles to service_role;
grant all privileges on table public.enquiries to service_role;
grant all privileges on table public.chat_sessions to service_role;
grant all privileges on table public.chat_messages to service_role;
grant all privileges on table public.whatsapp_logs to service_role;
grant all privileges on table public.activity_logs to service_role;

drop policy if exists "No public admin profile access" on public.admin_profiles;
drop policy if exists "No public enquiries access" on public.enquiries;
drop policy if exists "No public chat session access" on public.chat_sessions;
drop policy if exists "No public chat message access" on public.chat_messages;
drop policy if exists "No public whatsapp log access" on public.whatsapp_logs;
drop policy if exists "No public activity log access" on public.activity_logs;
