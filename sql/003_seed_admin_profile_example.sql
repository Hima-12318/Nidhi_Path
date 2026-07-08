/*
  Admin setup steps:

  1. Open Supabase Dashboard > Authentication > Users.
  2. Create an admin user manually with email/password.
     Recommended first admin email: info@nidhipath.in
  3. Copy the new Auth user UUID.
  4. Replace PASTE_AUTH_USER_ID_HERE below and run this upsert.

  Do not store passwords in admin_profiles.
*/

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
