# Deployment Guide

The backend serves the static frontend and all APIs from one Node service.

## Render

1. Push the repository to GitHub.
2. Create a new Render Web Service.
3. Root directory: `backend`
4. Build command:

```bash
npm install
```

5. Start command:

```bash
npm start
```

6. Add production environment variables.

## Railway

1. Create a Railway project from GitHub.
2. Set service root to `backend` if needed.
3. Add environment variables.
4. Start command:

```bash
npm start
```

## Production Notes

- Set `NODE_ENV=production`.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or WhatsApp tokens to frontend code.
- Configure `FRONTEND_ORIGIN` to the production URL.
- Run Supabase SQL before production traffic.
- Confirm user/CRM SQL files `007`, `008`, and verification file `009` have run.
- Create the first admin in Supabase Auth and link it in `admin_profiles`.
- Test user signup, user login, admin CRM, and Application ID generation before launch.

## Production Smoke Test

After deployment:

1. Open `/api/health`.
2. Open `/login.html`.
3. Confirm user signup creates a Supabase Auth user and CRM row.
4. Confirm verified users can login and see `/user-dashboard.html`.
5. Login as admin and open Users, CRM, Enquiries, Chats, and Website Control.
6. Mark one test CRM record as Work Started and confirm an ID like `NP-APP-YYYYMMDD-0001`.
7. Remove test customer data before going live.

## Static Frontend

The backend serves `../frontend`.

Open:

```text
https://your-domain.com
```

APIs live under:

```text
https://your-domain.com/api
```
