# Testing Checklist

## Local Startup

```bash
cd backend
npm install
npm run check
npm run dev
```

Open `http://localhost:3000`.

For real Supabase mode, startup should show:

```text
Environment loaded:
- NODE_ENV: development
- DATABASE_MODE: supabase
- SUPABASE_URL loaded: yes
- SUPABASE_SERVICE_ROLE_KEY loaded: yes
Nidhi Path backend listening on http://localhost:3000 (Supabase database mode)
```

## Public API Tests

Health:

```bash
curl http://localhost:3000/api/health
```

Valid enquiry:

```bash
curl -X POST http://localhost:3000/api/enquiries \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Rahul Kumar\",\"phone\":\"9876543210\",\"service\":\"Education Loan\",\"message\":\"Need education loan guidance\"}"
```

Invalid phone:

```bash
curl -X POST http://localhost:3000/api/enquiries \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Rahul Kumar\",\"phone\":\"123\",\"service\":\"Education Loan\",\"message\":\"Need education loan guidance\"}"
```

Start chat:

```bash
curl -X POST http://localhost:3000/api/chat/start \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Rahul Kumar\",\"phone\":\"9876543210\",\"service\":\"Education Loan\",\"message\":\"I want to speak with an agent\"}"
```

Send chat message:

```bash
curl -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d "{\"chatId\":\"PASTE_CHAT_ID\",\"message\":\"Can you explain eligibility?\"}"
```

Fetch messages:

```bash
curl http://localhost:3000/api/chat/messages/PASTE_CHAT_ID
```

## Admin Tests

Production/Supabase admin login works only after:

- Supabase Auth admin user exists.
- `admin_profiles` row exists.
- `002_rls_policies.sql` has been rerun after the service-role grants were added.
- Supabase env variables are configured.

Protected route without token should return unauthorized:

```bash
curl http://localhost:3000/api/admin/dashboard
```

## User And CRM Tests

Run `backend/sql/007_user_crm_schema.sql` and `backend/sql/008_seed_crm_defaults.sql`
in Supabase before testing these in real mode.

User signup:

```bash
curl -X POST http://localhost:3000/api/user/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Customer\",\"email\":\"customer@example.com\",\"phone\":\"+918520846598\",\"password\":\"Customer@1234\"}"
```

User login after email verification:

```bash
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"customer@example.com\",\"password\":\"Customer@1234\"}"
```

User dashboard:

```bash
curl http://localhost:3000/api/user/dashboard \
  -H "Authorization: Bearer USER_TOKEN"
```

Admin CRM:

```bash
curl http://localhost:3000/api/admin/users -H "Authorization: Bearer ADMIN_TOKEN"
curl http://localhost:3000/api/admin/crm/applications -H "Authorization: Bearer ADMIN_TOKEN"
curl -X POST http://localhost:3000/api/admin/crm/applications/APPLICATION_UUID/work-started -H "Authorization: Bearer ADMIN_TOKEN"
```

Expected Application ID format:

```text
NP-APP-YYYYMMDD-0001
```

## Browser Checks

- `login.html` shows user sign in, user sign up, and admin sign in.
- Signup button text is `Create Account`.
- User login redirects to `user-dashboard.html`.
- Admin login redirects to `admin-dashboard.html`.
- `admin-users.html` and `admin-crm.html` load real protected data.
- Login page only shows the BDITS developer credit.
- Homepage, services, admin dashboard, and user dashboard do not show that credit.
