/*
  Idempotent default data for future website control screens.

  This stores admin-editable defaults without changing the current static
  public website. Re-running this file will not overwrite existing rows.
*/

insert into public.site_settings (setting_key, setting_value, status)
values
  ('business_name', '{"value":"Nidhi Path Loan Ventures"}'::jsonb, 'active'),
  ('tagline', '{"value":"Way to Money"}'::jsonb, 'active'),
  ('official_email', '{"value":"info@nidhipath.in"}'::jsonb, 'active'),
  ('official_website', '{"value":"www.nidhipath.in"}'::jsonb, 'active'),
  ('official_phone', '{"value":"+91 97056 82595"}'::jsonb, 'active'),
  ('whatsapp_number', '{"value":"+91 97056 82595"}'::jsonb, 'active'),
  ('address', '{"value":"Vijayawada, Andhra Pradesh"}'::jsonb, 'active'),
  ('city', '{"value":"Vijayawada"}'::jsonb, 'active'),
  ('state', '{"value":"Andhra Pradesh"}'::jsonb, 'active'),
  ('working_hours', '{"value":"Monday to Saturday, 10:00 AM to 6:00 PM"}'::jsonb, 'active'),
  ('support_message', '{"value":"Our team will contact you regarding your enquiry."}'::jsonb, 'active'),
  ('footer_text', '{"value":"Terms & Conditions Apply. Loan approval is subject to bank policies, eligibility, verification, documentation, and credit assessment."}'::jsonb, 'active'),
  ('consent_text', '{"value":"By submitting this form, you agree that Nidhi Path Loan Ventures may contact you regarding your enquiry."}'::jsonb, 'active'),
  ('seo_title', '{"value":"Nidhi Path Loan Ventures"}'::jsonb, 'active'),
  ('seo_description', '{"value":"Loan consultation, education loan guidance, and financial services."}'::jsonb, 'active')
on conflict (setting_key) do nothing;

insert into public.service_catalog (service_key, service_name, short_description, page_url, display_order, is_active)
values
  ('education-loan', 'Education Loan', 'Education loan guidance', 'education-loan.html', 1, true),
  ('personal-loan', 'Personal Loan', 'Personal loan consultation', 'personal-loan.html', 2, true),
  ('business-loan', 'Business Loan', 'Business loan consultation', 'business-loan.html', 3, true),
  ('home-loan', 'Home Loan', 'Home loan consultation', 'home-loan.html', 4, true),
  ('mutual-funds', 'Mutual Funds', 'Mutual funds guidance', 'mutual-funds.html', 5, true),
  ('insurance', 'Insurance', 'Insurance guidance', 'insurance.html', 6, true),
  ('all-loans', 'All Types of Loans', 'Loan requirement review across categories', 'all-loans.html', 7, true),
  ('loan-consultation', 'Loan Consultation', 'Loan consultation support', 'loan-consultation.html', 8, true),
  ('other', 'Other', 'General financial service enquiry', 'contact.html', 9, true)
on conflict (service_key) do nothing;

insert into public.site_sections (page_key, section_key, section_title, section_subtitle, section_content, display_order, is_visible)
values
  ('home', 'hero', 'Home Hero', '', '{}'::jsonb, 1, true),
  ('home', 'services', 'Home Services', '', '{}'::jsonb, 2, true),
  ('home', 'why_choose_us', 'Why Choose Us', '', '{}'::jsonb, 3, true),
  ('home', 'contact_cta', 'Contact CTA', '', '{}'::jsonb, 4, true),
  ('footer', 'main', 'Footer Main', '', '{}'::jsonb, 1, true),
  ('contact', 'main', 'Contact Main', '', '{}'::jsonb, 1, true),
  ('eligibility', 'main', 'Eligibility Main', '', '{}'::jsonb, 1, true)
on conflict (page_key, section_key) do nothing;

insert into public.site_navigation (label, href, nav_group, display_order, is_visible)
select item.label, item.href, item.nav_group, item.display_order, true
from (
  values
    ('Home', 'index.html', 'main', 1),
    ('Services', 'services.html', 'main', 2),
    ('About Us', 'about.html', 'main', 3),
    ('Eligibility', 'eligibility.html', 'main', 4),
    ('Contact Us', 'contact.html', 'main', 5),
    ('Login', 'login.html', 'main', 6)
) as item(label, href, nav_group, display_order)
where not exists (
  select 1
  from public.site_navigation existing
  where existing.href = item.href
    and existing.nav_group = item.nav_group
);
