# Deploying Nidhi Path SmartCRM

One repo, one Render web service. The Express backend serves **both** the
`/api/*` routes and the static frontend, so you only deploy this single folder.

> **Important:** the *contents of this folder* are the root of the GitHub repo
> (so `render.yaml` sits at the top level). Do **not** upload any of the older
> nested copies.

---

## 1. Database — Supabase

1. Create a project at [supabase.com](https://supabase.com).
   *(A brand-new project is the cleanest start — it has no leftover tables.)*
2. Open **SQL Editor**, paste all of
   `supabase/migrations/001_initial_schema.sql`, and click **Run**.
   - **If you reused an existing project** and get
     `ERROR: 42703: column "..." does not exist`, the project already has
     older CRM tables. Run `supabase/RESET_clean_slate.sql` once first, then
     re-run `001_initial_schema.sql`. (See Troubleshooting.)
3. Go to **Project Settings → API** and copy three values:
   - **Project URL** → `SUPABASE_URL`
   - **anon** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` *(secret — server only)*

## 2. Push to GitHub

Create an empty repo and upload the contents of this folder so that
`render.yaml`, `.nvmrc`, `backend/`, `frontend/`, and `supabase/` are at the
repo root.

## 3. Deploy on Render

1. [render.com](https://render.com) → **New + → Blueprint** → pick the repo
   (it reads `render.yaml` automatically).
2. Fill in the four secrets when prompted (`NODE_ENV=production` is preset):

   | Variable | Value |
   |---|---|
   | `SUPABASE_URL` | your Project URL |
   | `SUPABASE_ANON_KEY` | anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role key |
   | `ALLOWED_ORIGINS` | your Render URL, e.g. `https://nidhipath-crm.onrender.com` |

3. Deploy. Health check is `/api/health`.

> You won't know the exact Render URL until the service exists. Deploy first,
> then set `ALLOWED_ORIGINS` to the real URL and let it redeploy.

## 4. Create the first admin

The user-creation API needs an existing admin, so bootstrap one once.
In Render → your service → **Shell**:

```bash
node scripts/create-admin.js you@nidhipath.in "YourStrongPassword123!" "Your Name"
```

## 5. Log in

Open your Render URL → **Login → Employee Login** → sign in with the admin
credentials. From the admin dashboard you can create employees, clients,
students, and board members.

---

## Local development (optional)

```bash
cd backend
cp .env.example .env      # fill in your Supabase values, set NODE_ENV=development
npm install
npm run dev               # http://localhost:3000
```

## Troubleshooting

- **Server exits on boot** — a `SUPABASE_*` env var is missing; check all three.
- **`ERROR: 42703: column "..." does not exist` when running the migration** —
  the Supabase project already contains older CRM tables, so
  `CREATE TABLE IF NOT EXISTS` skipped them and a later line hit a missing
  column. Fix: run `supabase/RESET_clean_slate.sql` once (it drops the old CRM
  tables — safe before go-live), then re-run `001_initial_schema.sql`. Or just
  create a fresh Supabase project.
- **Login fails for every user** — run step 4 to create an admin, and confirm
  the SQL migration ran.
- **CORS error in the browser** — `ALLOWED_ORIGINS` must include your exact
  Render URL (no trailing slash).
- **Logo not showing** — optional; drop a `logo.jpg` into
  `frontend/assets/img/`. The UI hides it gracefully if absent.
