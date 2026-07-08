# Nidhi Path Backend

Express backend for Nidhi Path Loan Ventures.

## Local Development

```bash
cd backend
npm install
npm run dev
```

Open `http://localhost:3000`.

`npm run dev` reads `backend/.env`. The backend always uses Supabase for auth and database persistence; mock database mode is no longer supported.

## Scripts

```bash
npm run dev      # nodemon, reads backend/.env
npm start        # production-style node server.js
npm run check    # syntax-check all backend JS files
```

## Required Production Environment

- `PORT`
- `NODE_ENV=production`
- `FRONTEND_ORIGIN`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

WhatsApp variables are optional. If missing, enquiries and chats are still saved and `whatsappStatus` returns `not_configured`.

## Main API Groups

- Public: `/api/health`, `/api/enquiries`, `/api/chat/start`, `/api/chat/message`, `/api/chat/messages/:chatId`
- User: `/api/user/signup`, `/api/user/login`, `/api/user/me`, `/api/user/dashboard`, `/api/user/application`
- Admin: `/api/admin/login`, `/api/admin/dashboard`, `/api/admin/enquiries`, `/api/admin/chats`
- CRM: `/api/admin/users`, `/api/admin/crm/applications`, `/api/admin/crm/stats`
- Backward compatibility: `/api/agent-handoff`, `/api/live-chat`, `/api/live-chat/:chatId/messages`

## CRM Setup

Run these SQL files after the base schema and site-management schema:

```text
backend/sql/007_user_crm_schema.sql
backend/sql/008_seed_crm_defaults.sql
backend/sql/009_verify_deployment.sql
```

Application IDs are generated only when an admin marks an application as
`work_started`. Format: `NP-APP-YYYYMMDD-0001`.

## Manual Client Setup Still Required

- Supabase project
- Supabase SQL execution
- Supabase Auth admin user
- `admin_profiles` super-admin row
- WhatsApp Business Cloud API credentials
- Hosting account and production environment variables
