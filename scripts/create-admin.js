'use strict';

/* ============================================================
   create-admin.js — First-admin bootstrap
   ------------------------------------------------------------
   Creates (or repairs) the FIRST admin account so you can log
   in to the CRM after a fresh deploy. The normal user-creation
   API routes require an existing admin token, so this script
   solves that chicken-and-egg problem using the Supabase
   service-role key directly.

   Usage (from the backend/ directory):

     node scripts/create-admin.js <email> <password> "<Full Name>"

   Or via env vars (useful in CI / one-off Render shell):

     ADMIN_EMAIL=info@nidhipath.in \
     ADMIN_PASSWORD=ChangeMe123! \
     ADMIN_NAME="Nidhi Path Admin" \
     node scripts/create-admin.js

   Requires the same env vars as the server:
     SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
   (loaded from backend/.env or the deploy environment).

   Safe to re-run: if the auth user already exists it is reused,
   and the profile row is upserted to role=admin / status=active.
   ============================================================ */

require('dotenv').config();

const { supabaseAdmin } = require('../supabase/client');

// ─── Read inputs (CLI args take precedence over env vars) ──────
const email    = (process.argv[2] || process.env.ADMIN_EMAIL    || '').toLowerCase().trim();
const password =  process.argv[3] || process.env.ADMIN_PASSWORD || '';
const fullName = (process.argv[4] || process.env.ADMIN_NAME     || 'Administrator').trim();

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function usage() {
  console.log('\nUsage: node scripts/create-admin.js <email> <password> "<Full Name>"');
  console.log('   or: set ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME and run with no args.\n');
}

// ─── Validate ──────────────────────────────────────────────────
if (!email || !password) {
  usage();
  fail('Both an email and a password are required.');
}
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  fail(`"${email}" does not look like a valid email address.`);
}
if (password.length < 8) {
  fail('Password must be at least 8 characters long.');
}

// ─── Find an existing auth user by email (paginated) ───────────
async function findAuthUserByEmail(targetEmail) {
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`listUsers failed: ${error.message}`);
    const users = data?.users || [];
    const match = users.find(u => (u.email || '').toLowerCase() === targetEmail);
    if (match) return match;
    if (users.length < 1000) break; // last page
  }
  return null;
}

async function main() {
  console.log(`\nBootstrapping admin account for: ${email}`);

  // 1. Ensure an auth user exists
  let authUserId;
  const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: 'admin' },
  });

  if (createErr) {
    const msg = (createErr.message || '').toLowerCase();
    if (msg.includes('already') || msg.includes('registered') || msg.includes('exists')) {
      console.log('  • Auth user already exists — reusing it.');
      const existing = await findAuthUserByEmail(email);
      if (!existing) {
        fail('Auth user reportedly exists but could not be located via listUsers.');
      }
      authUserId = existing.id;
      // Reset the password so the operator knows the credentials.
      const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(authUserId, {
        password,
        email_confirm: true,
      });
      if (updErr) console.warn(`  ! Could not reset password: ${updErr.message}`);
      else console.log('  • Password reset to the value you provided.');
    } else {
      fail(`Failed to create auth user: ${createErr.message}`);
    }
  } else {
    authUserId = created.user.id;
    console.log('  • Auth user created.');
  }

  // 2. Upsert the profile row with admin role
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from('profiles')
    .upsert(
      {
        id:        authUserId,
        full_name: fullName,
        email,
        role:      'admin',
        status:    'active',
      },
      { onConflict: 'id' }
    )
    .select('id, full_name, email, role, status')
    .single();

  if (profileErr) {
    fail(`Auth user is ready but the profile row failed: ${profileErr.message}\n` +
         `  Make sure the SQL migration (supabase/migrations/001_initial_schema.sql) has been run.`);
  }

  console.log('\n✔ Admin ready. You can now sign in via the Employee Login.');
  console.log('  ─────────────────────────────────────────────');
  console.log(`  ID:    ${profile.id}`);
  console.log(`  Name:  ${profile.full_name}`);
  console.log(`  Email: ${profile.email}`);
  console.log(`  Role:  ${profile.role} (${profile.status})`);
  console.log('  ─────────────────────────────────────────────');
  console.log('  Login at: /login.html → Employee Login\n');
  process.exit(0);
}

main().catch(err => {
  fail(err.message || String(err));
});
