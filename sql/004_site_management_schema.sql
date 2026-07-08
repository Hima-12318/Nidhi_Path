/*
  Future website control foundation.

  These tables are intentionally not wired into the public static pages yet.
  They allow future admin-dashboard controls for site settings, sections,
  navigation, service catalog entries, media, and audit history.
*/

create extension if not exists pgcrypto;

alter table public.admin_profiles
drop constraint if exists admin_profiles_role_check;

alter table public.admin_profiles
add constraint admin_profiles_role_check
check (role in ('super_admin', 'admin', 'manager', 'support_agent'));

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text unique not null,
  setting_value jsonb not null default '{}'::jsonb,
  status text default 'active',
  updated_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint site_settings_status_check check (status in ('active', 'inactive', 'archived'))
);

create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  section_key text not null,
  section_title text,
  section_subtitle text,
  section_content jsonb default '{}'::jsonb,
  display_order int default 0,
  is_visible boolean default true,
  updated_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(page_key, section_key)
);

create table if not exists public.site_content_blocks (
  id uuid primary key default gen_random_uuid(),
  block_key text unique not null,
  block_type text not null,
  title text,
  subtitle text,
  content text,
  metadata jsonb default '{}'::jsonb,
  is_visible boolean default true,
  updated_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_navigation (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  nav_group text default 'main',
  display_order int default 0,
  is_visible boolean default true,
  updated_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.service_catalog (
  id uuid primary key default gen_random_uuid(),
  service_key text unique not null,
  service_name text not null,
  short_description text,
  long_description text,
  icon text,
  page_url text,
  display_order int default 0,
  is_active boolean default true,
  metadata jsonb default '{}'::jsonb,
  updated_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.homepage_blocks (
  id uuid primary key default gen_random_uuid(),
  block_key text unique not null,
  block_type text not null,
  title text,
  subtitle text,
  content jsonb default '{}'::jsonb,
  display_order int default 0,
  is_visible boolean default true,
  updated_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  file_type text,
  alt_text text,
  usage_context text,
  uploaded_by uuid,
  created_at timestamptz default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid,
  action text not null,
  module text not null,
  record_id uuid,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_site_settings_key on public.site_settings(setting_key);
create index if not exists idx_site_sections_page_key on public.site_sections(page_key);
create index if not exists idx_site_sections_order on public.site_sections(page_key, display_order);
create index if not exists idx_site_content_blocks_key on public.site_content_blocks(block_key);
create index if not exists idx_site_navigation_group_order on public.site_navigation(nav_group, display_order);
create index if not exists idx_service_catalog_key on public.service_catalog(service_key);
create index if not exists idx_service_catalog_order on public.service_catalog(display_order);
create index if not exists idx_homepage_blocks_key on public.homepage_blocks(block_key);
create index if not exists idx_homepage_blocks_order on public.homepage_blocks(display_order);
create index if not exists idx_media_library_usage_context on public.media_library(usage_context);
create index if not exists idx_admin_audit_logs_admin_user_id on public.admin_audit_logs(admin_user_id);
create index if not exists idx_admin_audit_logs_module on public.admin_audit_logs(module);
create index if not exists idx_admin_audit_logs_created_at on public.admin_audit_logs(created_at desc);

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_site_sections_updated_at on public.site_sections;
create trigger set_site_sections_updated_at
before update on public.site_sections
for each row execute function public.set_updated_at();

drop trigger if exists set_site_content_blocks_updated_at on public.site_content_blocks;
create trigger set_site_content_blocks_updated_at
before update on public.site_content_blocks
for each row execute function public.set_updated_at();

drop trigger if exists set_site_navigation_updated_at on public.site_navigation;
create trigger set_site_navigation_updated_at
before update on public.site_navigation
for each row execute function public.set_updated_at();

drop trigger if exists set_service_catalog_updated_at on public.service_catalog;
create trigger set_service_catalog_updated_at
before update on public.service_catalog
for each row execute function public.set_updated_at();

drop trigger if exists set_homepage_blocks_updated_at on public.homepage_blocks;
create trigger set_homepage_blocks_updated_at
before update on public.homepage_blocks
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;
alter table public.site_sections enable row level security;
alter table public.site_content_blocks enable row level security;
alter table public.site_navigation enable row level security;
alter table public.service_catalog enable row level security;
alter table public.homepage_blocks enable row level security;
alter table public.media_library enable row level security;
alter table public.admin_audit_logs enable row level security;

grant usage on schema public to service_role;
grant all privileges on table public.site_settings to service_role;
grant all privileges on table public.site_sections to service_role;
grant all privileges on table public.site_content_blocks to service_role;
grant all privileges on table public.site_navigation to service_role;
grant all privileges on table public.service_catalog to service_role;
grant all privileges on table public.homepage_blocks to service_role;
grant all privileges on table public.media_library to service_role;
grant all privileges on table public.admin_audit_logs to service_role;
