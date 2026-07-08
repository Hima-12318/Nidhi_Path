# Supabase Setup

The client still needs to create a Supabase project.

## Steps

1. Create a Supabase project.
2. Go to Project Settings > API.
3. Copy:
   - Project URL
   - anon public key or publishable key
   - service role key or secret key
4. Add them to backend environment variables:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## SQL

Run these files in the Supabase SQL editor in order:

1. `backend/sql/001_schema.sql`
2. `backend/sql/002_rls_policies.sql`
3. `backend/sql/003_seed_admin_profile_example.sql` after creating the Auth user
4. `backend/sql/004_site_management_schema.sql`
5. `backend/sql/006_seed_site_defaults.sql` when you want default website-control records
6. `backend/sql/007_user_crm_schema.sql`
7. `backend/sql/008_seed_crm_defaults.sql`
8. `backend/sql/009_verify_deployment.sql` to confirm table availability

For the current project admin account, run
`backend/sql/004_current_admin_grants_and_profile.sql` after the Auth user is
created. It links `info@nidhipath.in` as `super_admin`.

`007_user_crm_schema.sql` is required before normal user signup/login and CRM
pages can work. If the API returns `CRM database tables are not ready`, run that
file in Supabase SQL Editor and then retry.

If API requests return `permission denied for table ...`, rerun
`backend/sql/002_rls_policies.sql`. It includes the required service-role
`GRANT` statements while still keeping public browser access blocked.

## Admin User

1. Open Supabase Dashboard > Authentication > Users.
2. Create the first admin user manually.
3. Recommended email: `info@nidhipath.in`
4. Copy the Auth user UUID.
5. Replace `PASTE_AUTH_USER_ID_HERE` in `003_seed_admin_profile_example.sql`.
6. Run the upsert.

Passwords belong only in Supabase Auth. Do not insert or store passwords in `admin_profiles`.

## RLS Model

RLS is enabled on all tables. No public table access policies are created. The website talks to Express APIs, and Express uses the service role key server-side only.
