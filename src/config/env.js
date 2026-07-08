const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";
const defaultFrontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const allowedOrigins = [...new Set([
  defaultFrontendOrigin,
  "https://www.nidhipath.in",
  "https://nidhipath.in",
  "https://nidhi-path-loan-ventures.onrender.com",
  ...toList(process.env.ALLOWED_ORIGINS)
])];

const env = {
  nodeEnv: NODE_ENV,
  port: toNumber(process.env.PORT, 3000),
  frontendOrigin: defaultFrontendOrigin,
  allowedOrigins,
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
  whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
  whatsappAgentNumber: process.env.WHATSAPP_AGENT_NUMBER || "",
  whatsappApiVersion: process.env.WHATSAPP_API_VERSION || "v20.0",
  rateLimitWindowMs: toNumber(process.env.RATE_LIMIT_WINDOW_MS, 60000),
  rateLimitMaxPublic: toNumber(process.env.RATE_LIMIT_MAX_PUBLIC, isProduction ? 200 : 1000),
  rateLimitMaxAdmin: toNumber(process.env.RATE_LIMIT_MAX_ADMIN, isProduction ? 500 : 2000),
  rateLimitMaxAuth: toNumber(process.env.RATE_LIMIT_MAX_AUTH, isProduction ? 20 : 100),
  mockDatabaseMode: false
};

function logEnvironmentSummary() {
  console.log("Environment loaded:");
  console.log(`- NODE_ENV: ${env.nodeEnv}`);
  console.log("- DATABASE_MODE: supabase");
  console.log(`- SUPABASE_URL loaded: ${env.supabaseUrl ? "yes" : "no"}`);
  console.log(`- SUPABASE_SERVICE_ROLE_KEY loaded: ${env.supabaseServiceRoleKey ? "yes" : "no"}`);
}

if (String(process.env.MOCK_DATABASE_MODE || "false").toLowerCase() === "true") {
  throw new Error("MOCK_DATABASE_MODE is no longer supported. Configure Supabase credentials instead.");
}

const missing = [];
if (!env.supabaseUrl) missing.push("SUPABASE_URL");
if (!env.supabaseServiceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
if (!env.supabaseAnonKey) missing.push("SUPABASE_ANON_KEY");

if (missing.length) {
  throw new Error(`Missing required Supabase environment variables: ${missing.join(", ")}`);
}

module.exports = {
  env,
  envPath,
  logEnvironmentSummary
};
