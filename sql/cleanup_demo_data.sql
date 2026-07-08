/*
  Exact-match cleanup for accidental SmartCRM demo/sample records.

  This script deletes only records tied to the listed sample emails, phone
  numbers, names, or known fake auth IDs. It intentionally does not match real
  Nidhi Path users such as karishma@gmail.com, praneethamahavadi@gmail.com,
  himarikoli@bdits.in, info@nidhipath.in, or dindi288@gmail.com.

  In Supabase SQL Editor, run the whole script from the top. Running only a
  lower highlighted block will fail because the temp helper tables are created
  at the start of this transaction.
*/

begin;

set local search_path = pg_temp, public, auth;

create temp table if not exists _demo_emails (email text primary key) on commit drop;
insert into _demo_emails (email) values
  ('student@example.com'),
  ('student2@example.com'),
  ('student3@example.com'),
  ('student4@example.com'),
  ('student5@example.com'),
  ('employee@example.com'),
  ('employee2@example.com'),
  ('employee3@example.com'),
  ('client@example.com'),
  ('consultant@example.com')
on conflict do nothing;

create temp table if not exists _demo_phone_digits (phone text primary key) on commit drop;
insert into _demo_phone_digits (phone) values
  ('9000000201'),
  ('9000000202'),
  ('9000000203'),
  ('9000000204'),
  ('9000000205'),
  ('9000000101'),
  ('9000000102'),
  ('9000000103'),
  ('9000000001'),
  ('9000000002')
on conflict do nothing;

create temp table if not exists _demo_names (name text primary key) on commit drop;
insert into _demo_names (name) values
  ('Student One'),
  ('Student Two'),
  ('Student Three'),
  ('Student Four'),
  ('Student Five'),
  ('Employee One'),
  ('Employee Two'),
  ('Employee Three'),
  ('Asha Connector'),
  ('Meridian Consultants')
on conflict do nothing;

create temp table if not exists _demo_auth_user_ids (id uuid primary key) on commit drop;
insert into _demo_auth_user_ids (id) values
  ('00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000201'),
  ('00000000-0000-0000-0000-000000000202'),
  ('00000000-0000-0000-0000-000000000203'),
  ('00000000-0000-0000-0000-000000000301'),
  ('00000000-0000-0000-0000-000000000302'),
  ('00000000-0000-0000-0000-000000000303'),
  ('00000000-0000-0000-0000-000000000304'),
  ('00000000-0000-0000-0000-000000000305')
on conflict do nothing;

create temp table if not exists _demo_admin_profiles (id uuid primary key, auth_user_id uuid) on commit drop;
create temp table if not exists _demo_user_profiles (id uuid primary key, auth_user_id uuid) on commit drop;
create temp table if not exists _demo_reference_partners (id uuid primary key) on commit drop;
create temp table if not exists _demo_crm_applications (id uuid primary key) on commit drop;
create temp table if not exists _demo_enquiries (id uuid primary key) on commit drop;
create temp table if not exists _demo_chat_sessions (id uuid primary key) on commit drop;
create temp table if not exists _demo_record_ids (id uuid primary key) on commit drop;

do $$
begin
  if to_regclass('public.admin_profiles') is not null then
    execute $sql$
      insert into _demo_admin_profiles (id, auth_user_id)
      select ap.id, ap.auth_user_id
      from public.admin_profiles ap
      where lower(trim(ap.email)) in (select email from _demo_emails)
         or right(regexp_replace(coalesce(ap.phone, ''), '\D', '', 'g'), 10) in (select phone from _demo_phone_digits)
         or ap.full_name in (select name from _demo_names)
         or ap.auth_user_id in (select id from _demo_auth_user_ids)
      on conflict (id) do nothing
    $sql$;
  end if;
end $$;

do $$
begin
  if to_regclass('public.user_profiles') is not null then
    execute $sql$
      insert into _demo_user_profiles (id, auth_user_id)
      select up.id, up.auth_user_id
      from public.user_profiles up
      where lower(trim(up.email)) in (select email from _demo_emails)
         or right(regexp_replace(coalesce(up.phone, ''), '\D', '', 'g'), 10) in (select phone from _demo_phone_digits)
         or right(regexp_replace(coalesce(to_jsonb(up)->>'mobile', ''), '\D', '', 'g'), 10) in (select phone from _demo_phone_digits)
         or up.full_name in (select name from _demo_names)
         or up.auth_user_id in (select id from _demo_auth_user_ids)
      on conflict (id) do nothing
    $sql$;
  end if;
end $$;

insert into _demo_auth_user_ids (id)
select auth_user_id from _demo_admin_profiles where auth_user_id is not null
union
select auth_user_id from _demo_user_profiles where auth_user_id is not null
on conflict do nothing;

do $$
begin
  if to_regclass('public.reference_partners') is not null then
    execute $sql$
      insert into _demo_reference_partners (id)
      select id
      from public.reference_partners rp
      where to_jsonb(rp)->>'profile_user_id' in (select id::text from _demo_user_profiles)
         or lower(trim(coalesce(to_jsonb(rp)->>'email', ''))) in (select email from _demo_emails)
         or right(regexp_replace(coalesce(to_jsonb(rp)->>'mobile', ''), '\D', '', 'g'), 10) in (select phone from _demo_phone_digits)
         or to_jsonb(rp)->>'name' in (select name from _demo_names)
         or to_jsonb(rp)->>'company_name' in (select name from _demo_names)
         or to_jsonb(rp)->>'contact_person' in (select name from _demo_names)
      on conflict (id) do nothing
    $sql$;
  end if;
end $$;

do $$
begin
  if to_regclass('public.crm_applications') is not null then
    execute $sql$
      insert into _demo_crm_applications (id)
      select id
      from public.crm_applications app
      where to_jsonb(app)->>'user_profile_id' in (select id::text from _demo_user_profiles)
         or to_jsonb(app)->>'auth_user_id' in (select id::text from _demo_auth_user_ids)
         or to_jsonb(app)->>'consultant_client_id' in (select id::text from _demo_user_profiles)
         or to_jsonb(app)->>'assigned_employee_id' in (select id::text from _demo_user_profiles)
         or to_jsonb(app)->>'assigned_to' in (select id::text from _demo_user_profiles)
         or to_jsonb(app)->>'reference_partner_id' in (select id::text from _demo_reference_partners)
         or lower(trim(coalesce(to_jsonb(app)->>'customer_email', ''))) in (select email from _demo_emails)
         or lower(trim(coalesce(to_jsonb(app)->>'student_email', ''))) in (select email from _demo_emails)
         or right(regexp_replace(coalesce(to_jsonb(app)->>'customer_phone', ''), '\D', '', 'g'), 10) in (select phone from _demo_phone_digits)
         or right(regexp_replace(coalesce(to_jsonb(app)->>'student_mobile', ''), '\D', '', 'g'), 10) in (select phone from _demo_phone_digits)
         or to_jsonb(app)->>'customer_name' in (select name from _demo_names)
         or to_jsonb(app)->>'student_name' in (select name from _demo_names)
      on conflict (id) do nothing
    $sql$;
  end if;
end $$;

do $$
begin
  if to_regclass('public.enquiries') is not null then
    execute $sql$
      insert into _demo_enquiries (id)
      select id
      from public.enquiries enq
      where lower(trim(coalesce(to_jsonb(enq)->>'email', ''))) in (select email from _demo_emails)
         or right(regexp_replace(coalesce(to_jsonb(enq)->>'phone', ''), '\D', '', 'g'), 10) in (select phone from _demo_phone_digits)
         or to_jsonb(enq)->>'name' in (select name from _demo_names)
         or to_jsonb(enq)->>'linked_user_profile_id' in (select id::text from _demo_user_profiles)
         or to_jsonb(enq)->>'linked_application_id' in (select id::text from _demo_crm_applications)
      on conflict (id) do nothing
    $sql$;
  end if;
end $$;

do $$
begin
  if to_regclass('public.chat_sessions') is not null then
    execute $sql$
      insert into _demo_chat_sessions (id)
      select id
      from public.chat_sessions chat
      where to_jsonb(chat)->>'enquiry_id' in (select id::text from _demo_enquiries)
         or lower(trim(coalesce(to_jsonb(chat)->>'customer_email', ''))) in (select email from _demo_emails)
         or right(regexp_replace(coalesce(to_jsonb(chat)->>'customer_phone', ''), '\D', '', 'g'), 10) in (select phone from _demo_phone_digits)
         or to_jsonb(chat)->>'customer_name' in (select name from _demo_names)
      on conflict (id) do nothing
    $sql$;
  end if;
end $$;

insert into _demo_record_ids (id)
select id from _demo_admin_profiles
union
select id from _demo_user_profiles
union
select id from _demo_reference_partners
union
select id from _demo_crm_applications
union
select id from _demo_enquiries
union
select id from _demo_chat_sessions
on conflict do nothing;

do $$
begin
  if to_regclass('public.application_commissions') is not null then
    execute $sql$
      delete from public.application_commissions
      where application_id in (select id from _demo_crm_applications)
         or reference_partner_id in (select id from _demo_reference_partners)
    $sql$;
  end if;

  if to_regclass('public.business_income_records') is not null then
    execute $sql$
      delete from public.business_income_records
      where application_id in (select id from _demo_crm_applications)
    $sql$;
  end if;

  if to_regclass('public.application_updates') is not null then
    execute $sql$
      delete from public.application_updates
      where application_id in (select id from _demo_crm_applications)
         or updated_by_user_id in (select id from _demo_user_profiles)
    $sql$;
  end if;

  if to_regclass('public.crm_updates') is not null then
    execute $sql$
      delete from public.crm_updates
      where application_id in (select id from _demo_crm_applications)
         or user_profile_id in (select id from _demo_user_profiles)
         or created_by_admin in (select id from _demo_admin_profiles)
    $sql$;
  end if;

  if to_regclass('public.crm_status_history') is not null then
    execute $sql$
      delete from public.crm_status_history
      where application_id in (select id from _demo_crm_applications)
         or changed_by in (select id from _demo_record_ids)
    $sql$;
  end if;

  if to_regclass('public.employee_daily_updates') is not null then
    execute $sql$
      delete from public.employee_daily_updates
      where employee_id in (select id from _demo_user_profiles)
    $sql$;
  end if;

  if to_regclass('public.audit_logs') is not null then
    execute $sql$
      delete from public.audit_logs
      where actor_user_id in (select id from _demo_record_ids)
         or record_id in (select id from _demo_record_ids)
    $sql$;
  end if;

  if to_regclass('public.admin_audit_logs') is not null then
    execute $sql$
      delete from public.admin_audit_logs
      where admin_user_id in (select id from _demo_admin_profiles)
         or record_id in (select id from _demo_record_ids)
    $sql$;
  end if;

  if to_regclass('public.activity_logs') is not null then
    execute $sql$
      delete from public.activity_logs
      where user_id in (select id from _demo_record_ids)
         or record_id in (select id from _demo_record_ids)
    $sql$;
  end if;

  if to_regclass('public.whatsapp_logs') is not null then
    execute $sql$
      delete from public.whatsapp_logs
      where related_id in (select id from _demo_record_ids)
         or right(regexp_replace(coalesce(recipient_number, ''), '\D', '', 'g'), 10) in (select phone from _demo_phone_digits)
    $sql$;
  end if;

  if to_regclass('public.chat_messages') is not null then
    execute $sql$
      delete from public.chat_messages
      where chat_session_id in (select id from _demo_chat_sessions)
    $sql$;
  end if;

  if to_regclass('public.chat_sessions') is not null then
    execute $sql$
      delete from public.chat_sessions
      where id in (select id from _demo_chat_sessions)
    $sql$;
  end if;

  if to_regclass('public.enquiries') is not null then
    execute $sql$
      delete from public.enquiries
      where id in (select id from _demo_enquiries)
    $sql$;
  end if;

  if to_regclass('public.crm_applications') is not null then
    execute $sql$
      delete from public.crm_applications
      where id in (select id from _demo_crm_applications)
    $sql$;
  end if;

  if to_regclass('public.reference_partners') is not null then
    execute $sql$
      delete from public.reference_partners
      where id in (select id from _demo_reference_partners)
    $sql$;
  end if;

  if to_regclass('public.user_profiles') is not null then
    execute $sql$
      delete from public.user_profiles
      where id in (select id from _demo_user_profiles)
    $sql$;
  end if;

  if to_regclass('public.admin_profiles') is not null then
    execute $sql$
      delete from public.admin_profiles
      where id in (select id from _demo_admin_profiles)
    $sql$;
  end if;

  if to_regclass('auth.users') is not null then
    execute $sql$
      delete from auth.users au
      where au.id in (select id from _demo_auth_user_ids)
         or lower(trim(coalesce(to_jsonb(au)->>'email', ''))) in (select email from _demo_emails)
         or right(regexp_replace(coalesce(to_jsonb(au)->>'phone', ''), '\D', '', 'g'), 10) in (select phone from _demo_phone_digits)
    $sql$;
  end if;
end $$;

commit;
