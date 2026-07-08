const { env } = require("../config/env");
const { serviceSupabase } = require("../config/supabase");
const mockDb = require("./mockDatabaseService");

function mapAuditLog(row = {}) {
  return {
    id: row.id,
    adminUserId: row.admin_user_id || row.adminUserId || "",
    action: row.action,
    module: row.module,
    recordId: row.record_id || row.recordId || "",
    oldValue: row.old_value || row.oldValue || null,
    newValue: row.new_value || row.newValue || null,
    createdAt: row.created_at || row.createdAt
  };
}

async function createAdminAuditLog({ adminUserId = null, action, module, recordId = null, oldValue = null, newValue = null }) {
  if (env.mockDatabaseMode) {
    return mockDb.createRecord("adminAuditLogs", {
      adminUserId,
      action,
      module,
      recordId,
      oldValue,
      newValue
    });
  }

  const { data, error } = await serviceSupabase
    .from("admin_audit_logs")
    .insert({
      admin_user_id: adminUserId,
      action,
      module,
      record_id: recordId,
      old_value: oldValue,
      new_value: newValue
    })
    .select("*")
    .single();

  if (error) {
    console.error("Failed to write admin audit log:", error.message);
    return null;
  }

  return mapAuditLog(data);
}

async function listAdminAuditLogs({ limit = 50, page = 1, module = "" } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);

  if (env.mockDatabaseMode) {
    let rows = mockDb.listRecords("adminAuditLogs").map(mapAuditLog);
    if (module) {
      rows = rows.filter((item) => item.module === module);
    }
    rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return {
      auditLogs: rows.slice((safePage - 1) * safeLimit, safePage * safeLimit),
      total: rows.length,
      page: safePage,
      limit: safeLimit
    };
  }

  let query = serviceSupabase
    .from("admin_audit_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((safePage - 1) * safeLimit, safePage * safeLimit - 1);

  if (module) {
    query = query.eq("module", module);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error(`Failed to list admin audit logs: ${error.message}`);
  }

  return {
    auditLogs: (data || []).map(mapAuditLog),
    total: count || 0,
    page: safePage,
    limit: safeLimit
  };
}

module.exports = {
  createAdminAuditLog,
  listAdminAuditLogs
};
