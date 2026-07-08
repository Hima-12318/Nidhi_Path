const { env } = require("../config/env");
const { serviceSupabase } = require("../config/supabase");
const { AppError } = require("../middleware/errorMiddleware");
const mockDb = require("./mockDatabaseService");

function formatDateKey(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  return formatter.format(date).replace(/-/g, "");
}

async function generateApplicationId() {
  if (env.mockDatabaseMode) {
    const dateKey = formatDateKey();
    const current = mockDb.store.applicationIdCounters.get(dateKey) || 0;
    const next = current + 1;
    mockDb.store.applicationIdCounters.set(dateKey, next);
    return `NP-APP-${dateKey}-${String(next).padStart(4, "0")}`;
  }

  const { data, error } = await serviceSupabase.rpc("generate_nidhi_application_id");
  if (error) {
    if (String(error.message || "").includes("Could not find the function")) {
      throw new AppError("Application ID generator is not ready. Please run backend/sql/007_user_crm_schema.sql in Supabase.", 503, "CRM_SCHEMA_NOT_READY");
    }
    throw new Error(`Failed to generate application ID: ${error.message}`);
  }

  return data;
}

module.exports = {
  generateApplicationId
};
