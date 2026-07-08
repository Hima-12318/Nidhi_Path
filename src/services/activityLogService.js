const { env } = require("../config/env");
const { serviceSupabase } = require("../config/supabase");
const mockDb = require("./mockDatabaseService");

async function createActivityLog({ userId = null, action, module = "", recordId = null, details = {} }) {
  const payload = {
    user_id: userId,
    action,
    module,
    record_id: recordId,
    details
  };

  if (env.mockDatabaseMode) {
    return mockDb.createRecord("activityLogs", {
      userId,
      action,
      module,
      recordId,
      details
    });
  }

  const { data, error } = await serviceSupabase
    .from("activity_logs")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    console.error("Failed to write activity log:", error.message);
    return null;
  }

  return data;
}

module.exports = {
  createActivityLog
};
