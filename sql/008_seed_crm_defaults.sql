/*
  Optional CRM defaults.
  Run after 004_site_management_schema.sql and 007_user_crm_schema.sql.
*/

insert into public.site_settings (setting_key, setting_value, status)
values
  (
    'crm_application_statuses',
    '["new_user","registered","verified","approved","documents_pending","work_started","in_progress","submitted","on_hold","completed","rejected","closed"]'::jsonb,
    'active'
  ),
  (
    'crm_update_types',
    '["message","status_update","document_request","internal_note","system"]'::jsonb,
    'active'
  ),
  (
    'crm_application_id_format',
    '{"format":"NP-APP-YYYYMMDD-0001","generatedWhen":"work_started"}'::jsonb,
    'active'
  )
on conflict (setting_key) do nothing;
