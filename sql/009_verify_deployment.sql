/*
  Quick deployment verification checks.
  These should all run without errors after the SQL migration files are applied.
*/

select count(*) as admin_profiles_count from public.admin_profiles;
select count(*) as user_profiles_count from public.user_profiles;
select count(*) as crm_applications_count from public.crm_applications;
select count(*) as crm_updates_count from public.crm_updates;
select count(*) as crm_status_history_count from public.crm_status_history;
select count(*) as site_settings_count from public.site_settings;
select count(*) as service_catalog_count from public.service_catalog;
select exists (
  select 1
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'generate_nidhi_application_id'
) as application_id_function_ready;
