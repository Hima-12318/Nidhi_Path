/*
  Promote info@nidhipath.in to admin access.

  Run once in Supabase SQL Editor after the Auth user exists.
  Safe to re-run.
*/

begin;

update public.admin_profiles
set
  full_name = 'Nidhi Path Admin',
  email = 'info@nidhipath.in',
  role = 'super_admin',
  status = 'active',
  updated_at = now()
where auth_user_id = 'eaed727c-9823-4946-8670-47c9de5b2164';

insert into public.admin_profiles (auth_user_id, full_name, email, role, status)
select
  'eaed727c-9823-4946-8670-47c9de5b2164',
  'Nidhi Path Admin',
  'info@nidhipath.in',
  'super_admin',
  'active'
where not exists (
  select 1
  from public.admin_profiles
  where auth_user_id = 'eaed727c-9823-4946-8670-47c9de5b2164'
     or lower(email) = 'info@nidhipath.in'
)
on conflict (email)
do update set
  auth_user_id = excluded.auth_user_id,
  full_name = excluded.full_name,
  role = excluded.role,
  status = excluded.status,
  updated_at = now();

update public.admin_profiles
set
  auth_user_id = 'eaed727c-9823-4946-8670-47c9de5b2164',
  full_name = 'Nidhi Path Admin',
  role = 'super_admin',
  status = 'active',
  updated_at = now()
where lower(email) = 'info@nidhipath.in';

do $$
declare
  v_set_user_type text := '';
  v_status text := 'verified';
begin
  if to_regclass('public.user_profiles') is not null
     and exists (
       select 1
       from information_schema.columns
       where table_schema = 'public'
         and table_name = 'user_profiles'
         and column_name = 'role'
     ) then
    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'user_profiles'
        and column_name = 'user_type'
    ) then
      v_set_user_type := ', user_type = ''employee''';
    end if;

    if exists (
      select 1
      from pg_constraint
      where conname = 'user_profiles_status_check'
        and pg_get_constraintdef(oid) like '%active%'
    ) then
      v_status := 'active';
    end if;

    execute format(
      'update public.user_profiles
       set role = %L,
           status = %L,
           updated_at = now()
           %s
       where auth_user_id = %L
          or lower(email) = %L',
      'super_admin',
      v_status,
      v_set_user_type,
      'eaed727c-9823-4946-8670-47c9de5b2164',
      'info@nidhipath.in'
    );
  end if;
end $$;

commit;
