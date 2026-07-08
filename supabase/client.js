'use strict';

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL              = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY         = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ─── Guard: fail fast if env is incomplete ─────────────────────
const missing = [];
if (!SUPABASE_URL)              missing.push('SUPABASE_URL');
if (!SUPABASE_ANON_KEY)         missing.push('SUPABASE_ANON_KEY');
if (!SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');

if (missing.length) {
  console.error(`[Supabase] Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

// ─── supabaseAdmin ─────────────────────────────────────────────
// Uses the service_role key — bypasses Row Level Security.
// NEVER expose this key on the frontend.
// Use for: admin operations, auth user management, trusted server code.
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession:   false,
    detectSessionInUrl: false,
  },
  global: {
    headers: { 'x-client-info': 'nidhipath-crm-backend' },
  },
});

// ─── supabasePublic ────────────────────────────────────────────
// Uses the anon key — respects Row Level Security.
// Can be used for verifying JWTs and reading public data.
const supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession:   false,
    detectSessionInUrl: false,
  },
});

// ─── createUserClient ──────────────────────────────────────────
// Returns a Supabase client scoped to a specific user JWT.
// Useful when you want RLS to apply for a specific user's actions.
function createUserClient(jwt) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: { Authorization: `Bearer ${jwt}` },
    },
    auth: {
      autoRefreshToken:   false,
      persistSession:     false,
      detectSessionInUrl: false,
    },
  });
}

module.exports = { supabaseAdmin, supabasePublic, createUserClient };
