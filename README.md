# Nidhi Path Loan Ventures

Static website, Express API, Supabase Auth/Postgres, SmartCRM dashboards, admin reporting, enquiry handling, live chat, user dashboards, and optional WhatsApp admin alerts for **Nidhi Path Loan Ventures**.

Tagline: **Way to Money**

## Current Status

Status: **deployment-ready after Supabase SQL setup, production environment variables, and final browser verification**.

The active app in this project uses:

- Frontend: plain HTML, CSS, and JavaScript in `frontend/`
- Backend: Node.js and Express in `backend/`
- Database/Auth: Supabase Auth and Supabase Postgres
- Notifications: optional WhatsApp Business Cloud API admin alerts
- Local app URL: `http://localhost:3000`
- API base path: `/api`

There is no React, Next.js, Vite, Tailwind, or frontend build step.

## Data Storage

Application data is stored in **Supabase**, not inside code files.

Examples of data stored in Supabase:

- users and role profiles
- employee records
- daily employee updates
- CRM applications
- enquiries
- chat sessions and messages
- site settings
- reports source data
- commissions

The code contains layouts, styling, API calls, validation, and business logic. Browser storage may temporarily hold login/session tokens, but permanent business data belongs in Supabase.

`MOCK_DATABASE_MODE` is no longer supported. The backend requires Supabase credentials.

## Recent UI Updates

Recent admin UI cleanup includes:

- Employee Performance report filters are hidden by default on Admin Reports.
- Top report toolbar buttons open the employee report filter panel:
  - `Export PDF`
  - `Download PDF`
  - `Export CSV`
- Clicking the same toolbar export button again closes the filter panel.
- Employee reports support daily, weekly, and monthly filtering.
- Employee report exports use the selected filter values.
- Employee report tables support search, page size, and pagination.
- Admin Dashboard empty Employee Performance chart space collapses when there is no data.
- Admin Dashboard Weekly Business Trend card was made compact to reduce unused white space.
- Admin dashboard CSS cache version was bumped to load the latest dashboard styling.

## Project Structure

```text
project-root/
  frontend/
    *.html              Public, login, admin, CRM, and dashboard pages
    style.css           Shared styling
    script.js           Public site/shared frontend behavior
    admin.js            Admin, users, CRM, enquiries, chats, site management
    smartcrm.js         SmartCRM dashboards, reports, exports, charts
    user.js             User dashboard behavior
    logo.jpg            Brand logo

  backend/
    server.js           Server entry point
    package.json        Backend scripts and dependencies
    src/
      app.js            Express app setup and route mounting
      config/           Environment and Supabase configuration
      controllers/      Route handlers
      middleware/       Auth, rate limits, errors, request logging
      routes/           API route definitions
      services/         Business logic and Supabase access
      data/             Chatbot FAQs
      scripts/          Dev/check scripts
      utils/            Shared helpers
    sql/                Supabase migrations and maintenance SQL
```

## Run Locally

```bash
cd backend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Useful commands:

```bash
cd backend
npm run check
npm run dev
npm start
```

## Environment Variables

Create `backend/.env` from the example:

```bash
cd backend
copy .env.example .env
```

Required:

```text
PORT=3000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:3000
ALLOWED_ORIGINS=
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Optional WhatsApp alerts:

```text
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_AGENT_NUMBER=...
WHATSAPP_API_VERSION=v20.0
```

Never commit real `.env` files, service role keys, passwords, tokens, or production secrets.

## Main Pages

Public:

- `index.html`
- `services.html`
- `about.html`
- `eligibility.html`
- `contact.html`
- `login.html`

Role dashboards:

- `student-dashboard.html`
- `employee-dashboard.html`
- `client-dashboard.html`
- `board-dashboard.html`

Admin:

- `admin-dashboard.html`
- `admin-reports.html`
- `admin-users.html`
- `admin-crm.html`
- `admin-commissions.html`
- `admin-enquiries.html`
- `admin-chats.html`
- `admin-website-control.html`
- `admin-site-settings.html`
- `admin-services.html`
- `admin-content-sections.html`
- `admin-navigation.html`
- `admin-media-library.html`

## Login Roles

- Student Login: `student`
- Client Login: `connector`, `client_consultant`, `own_self`, `online_reference`, `banker_reference`, `employee_reference`
- Employee Login: `admin`, `super_admin`, `ceo`, `board`, `board_member`, `employee`

Redirect mapping:

- `admin`, `super_admin`, `ceo` -> `admin-dashboard.html`
- `board`, `board_member` -> `board-dashboard.html`
- `employee` -> `employee-dashboard.html`
- `student` -> `student-dashboard.html`
- client/reference roles -> `client-dashboard.html`

## Main API Areas

Health:

- `GET /api/health`

Public:

- `POST /api/enquiries`
- `POST /api/chat/start`
- `POST /api/chat/message`
- `GET /api/chat/messages/:chatId`
- `POST /api/chatbot/answer`
- `GET /api/site/settings`

User:

- `POST /api/user/signup`
- `POST /api/user/login`
- `GET /api/user/me`
- `GET /api/user/dashboard`
- `GET /api/user/application`
- `GET /api/user/application/updates`

Admin:

- `POST /api/admin/login`
- `GET /api/admin/me`
- `GET /api/admin/dashboard`
- `GET /api/admin/reports/overview`
- `GET /api/admin/reports/employee-performance/history`
- `GET /api/admin/enquiries`
- `GET /api/admin/chats`
- `GET /api/admin/users`
- `GET /api/admin/crm/applications`
- `GET /api/admin/site/settings`

## Supabase SQL Order

Run migrations in Supabase SQL Editor in this order:

```text
backend/sql/001_schema.sql
backend/sql/002_rls_policies.sql
backend/sql/003_seed_admin_profile_example.sql
backend/sql/004_current_admin_grants_and_profile.sql
backend/sql/004_site_management_schema.sql
backend/sql/006_seed_site_defaults.sql
backend/sql/007_user_crm_schema.sql
backend/sql/008_seed_crm_defaults.sql
backend/sql/009_verify_deployment.sql
backend/sql/010_client_review_crm_chatbot_updates.sql
backend/sql/011_duplicate_handling_and_dashboard_polish.sql
backend/sql/012_fix_crm_dashboard_sync.sql
backend/sql/013_smartcrm_role_intelligence.sql
backend/sql/015_cleanup_demo_crm_records.sql
backend/sql/016_users_module_role_flows.sql
backend/sql/017_promote_info_admin.sql
backend/sql/018_employee_daily_update_history_reports.sql
```

Maintenance SQL:

```text
backend/sql/cleanup_demo_data.sql
```

Review maintenance SQL before running it in production.

## Important Tables

Core:

- `admin_profiles`
- `user_profiles`
- `enquiries`
- `chat_sessions`
- `chat_messages`
- `activity_logs`
- `whatsapp_logs`

CRM:

- `crm_applications`
- `crm_updates`
- `crm_status_history`
- `application_id_counters`

SmartCRM/reporting:

- employee daily update/history tables from the latest SQL migrations
- commissions/reference partner tables from the SmartCRM migrations

Site management:

- `site_settings`
- `site_sections`
- `site_content_blocks`
- `site_navigation`
- `service_catalog`
- `homepage_blocks`
- `media_library`
- `admin_audit_logs`

## Verification

Backend syntax check:

```bash
cd backend
npm run check
```

Frontend syntax checks:

```bash
node --check frontend/script.js
node --check frontend/admin.js
node --check frontend/user.js
node --check frontend/smartcrm.js
```

Browser checks:

1. Public pages load.
2. Student, Client, and Employee login paths work.
3. Admin dashboard loads after auth.
4. Admin users can create users and role profiles.
5. Employee daily updates save into Supabase.
6. Admin Reports export buttons open and close the employee report filter panel.
7. Daily, weekly, and monthly employee reports load.
8. CSV/PDF employee exports use selected filters.
9. Admin Dashboard charts render without large empty spaces.
10. Browser console has no JavaScript errors.
11. Backend terminal has no crashes.

## Deployment Notes

- Deploy the backend from `backend/`.
- Do not commit `backend/node_modules/`.
- Render or the hosting platform should install from `backend/package-lock.json`.
- Set all production Supabase environment variables before deployment.
- Configure WhatsApp variables only if admin alerts are needed.
- Hard refresh the browser after frontend CSS/JS changes if a cached version is visible.

Production environment example:

```text
NODE_ENV=production
PORT=3000
FRONTEND_ORIGIN=https://www.nidhipath.in
ALLOWED_ORIGINS=https://nidhipath.in,https://www.nidhipath.in
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Manual Final Checklist

Before production handoff:

1. Run all required Supabase SQL migrations.
2. Verify the Supabase Auth admin user exists.
3. Verify `admin_profiles` has the correct active admin/super admin row.
4. Confirm public enquiries save into Supabase.
5. Confirm user creation saves into Supabase.
6. Confirm employee updates save into Supabase.
7. Confirm CRM application updates persist after refresh.
8. Confirm reports and exports use the latest Supabase data.
9. Confirm RLS and service-role backend access are working as expected.
10. Confirm production environment variables are set.

