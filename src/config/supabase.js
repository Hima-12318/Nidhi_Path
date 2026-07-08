const { createClient } = require("@supabase/supabase-js");
const { env } = require("./env");

const supabaseAuthClient = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

const supabaseAdminClient = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Backward-compatible aliases for existing backend services.
const anonSupabase = supabaseAuthClient;
const serviceSupabase = supabaseAdminClient;

module.exports = {
  anonSupabase,
  serviceSupabase,
  supabaseAdminClient,
  supabaseAuthClient
};
