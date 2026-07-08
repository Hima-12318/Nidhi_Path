const { env } = require("../config/env");
const { serviceSupabase } = require("../config/supabase");
const { AppError } = require("../middleware/errorMiddleware");
const adminAuditLogService = require("./adminAuditLogService");
const applicationIdService = require("./applicationIdService");
const {
  buildCustomerKey,
  normalizeEmail,
  normalizePhone,
  samePerson
} = require("./customerIdentityService");
const mockDb = require("./mockDatabaseService");

const crmEditableRoles = ["super_admin", "admin", "ceo", "manager"];
const crmUpdateRoles = ["super_admin", "admin", "ceo", "manager", "support_agent"];
const crmClientRoles = ["connector", "client_consultant", "own_self", "online_reference", "banker_reference", "employee_reference"];

function read(row, snake, camel, fallback = undefined) {
  return row?.[snake] ?? row?.[camel] ?? fallback;
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}

function dbError(action, error) {
  const message = error?.message || "Unknown database error";
  if (message.includes("Could not find the table") || message.includes("schema cache") || message.includes("column")) {
    return new AppError("CRM database tables are not ready. Please run backend/sql/007_user_crm_schema.sql, backend/sql/013_smartcrm_role_intelligence.sql, and backend/sql/016_users_module_role_flows.sql in Supabase.", 503, "CRM_SCHEMA_NOT_READY");
  }
  return new Error(`${action}: ${message}`);
}

function mapUserProfile(row) {
  if (!row) return null;
  const clientType = read(row, "client_type", "clientType", "regular");
  const role = read(row, "role", "role", clientType === "b2b" ? "client_consultant" : "student");
  return {
    id: row.id,
    authUserId: read(row, "auth_user_id", "authUserId"),
    fullName: read(row, "full_name", "fullName"),
    name: read(row, "full_name", "fullName"),
    email: row.email,
    phone: row.phone || "",
    mobile: read(row, "mobile", "mobile", row.phone || ""),
    clientType,
    userType: read(row, "user_type", "userType", clientType === "b2b" ? "client" : "student"),
    role,
    status: row.status || "pending",
    createdBy: read(row, "created_by", "createdBy", ""),
    commissionVisibilityEnabled: read(row, "commission_visibility_enabled", "commissionVisibilityEnabled", false),
    metadata: row.metadata || {},
    createdAt: read(row, "created_at", "createdAt"),
    updatedAt: read(row, "updated_at", "updatedAt")
  };
}

function mapApplication(row) {
  if (!row) return null;
  return {
    id: row.id,
    applicationId: read(row, "application_id", "applicationId", ""),
    userProfileId: read(row, "user_profile_id", "userProfileId", ""),
    authUserId: read(row, "auth_user_id", "authUserId", ""),
    customerName: read(row, "customer_name", "customerName", ""),
    customerEmail: read(row, "customer_email", "customerEmail", ""),
    customerPhone: read(row, "customer_phone", "customerPhone", ""),
    service: row.service || "",
    clientType: read(row, "client_type", "clientType", "regular"),
    applicationStatus: read(row, "application_status", "applicationStatus", "new_user"),
    workflowStage: read(row, "workflow_stage", "workflowStage", read(row, "application_status", "applicationStatus", "new_user")),
    documentStatus: read(row, "document_status", "documentStatus", "not_started"),
    bankName: read(row, "bank_name", "bankName", ""),
    loanAmountRequired: read(row, "loan_amount_required", "loanAmountRequired", null),
    loanAmountApproved: read(row, "loan_amount_approved", "loanAmountApproved", null),
    sanctionStatus: read(row, "sanction_status", "sanctionStatus", "not_started"),
    disbursementStatus: read(row, "disbursement_status", "disbursementStatus", "not_started"),
    commissionStatus: read(row, "commission_status", "commissionStatus", "not_applicable"),
    priority: row.priority || "normal",
    nextFollowupDate: read(row, "next_followup_date", "nextFollowupDate", ""),
    adminStatus: read(row, "admin_status", "adminStatus", "registered"),
    assignedAdminName: read(row, "assigned_admin_name", "assignedAdminName", read(row, "assigned_admin", "assignedAdmin", "")),
    documentsPending: read(row, "documents_pending", "documentsPending", ""),
    documentsReceived: read(row, "documents_received", "documentsReceived", ""),
    workStartedAt: read(row, "work_started_at", "workStartedAt", ""),
    approvedAt: read(row, "approved_at", "approvedAt", ""),
    assignedTo: read(row, "assigned_to", "assignedTo", ""),
    notes: row.notes || "",
    metadata: row.metadata || {},
    studentName: read(row, "student_name", "studentName", read(row, "customer_name", "customerName", "")),
    studentEmail: read(row, "student_email", "studentEmail", read(row, "customer_email", "customerEmail", "")),
    studentMobile: read(row, "student_mobile", "studentMobile", read(row, "customer_phone", "customerPhone", "")),
    universityApplied: read(row, "university_applied", "universityApplied", ""),
    universityAppliedFor: read(row, "university_applied_for", "universityAppliedFor", read(row, "university_applied", "universityApplied", "")),
    country: read(row, "country", "country", ""),
    course: row.course || "",
    loanAmount: read(row, "loan_amount", "loanAmount", read(row, "loan_amount_required", "loanAmountRequired", null)),
    loanAmountNeeded: read(row, "loan_amount_needed", "loanAmountNeeded", read(row, "loan_amount", "loanAmount", read(row, "loan_amount_required", "loanAmountRequired", null))),
    loanAmountSanctioned: read(row, "loan_amount_sanctioned", "loanAmountSanctioned", read(row, "sanctioned_amount", "sanctionedAmount", read(row, "loan_amount_approved", "loanAmountApproved", null))),
    loanAmountDisbursed: read(row, "loan_amount_disbursed", "loanAmountDisbursed", read(row, "disbursed_amount", "disbursedAmount", null)),
    bankApplied: read(row, "bank_applied", "bankApplied", read(row, "bank_name", "bankName", "")),
    consultantClientId: read(row, "consultant_client_id", "consultantClientId", ""),
    referenceSourceType: read(row, "reference_source_type", "referenceSourceType", ""),
    referencePartnerId: read(row, "reference_partner_id", "referencePartnerId", ""),
    clientId: read(row, "client_id", "clientId", read(row, "reference_partner_id", "referencePartnerId", "")),
    leadSourceType: read(row, "lead_source_type", "leadSourceType", read(row, "reference_source_type", "referenceSourceType", "")),
    referenceOwnerId: read(row, "reference_owner_id", "referenceOwnerId", read(row, "reference_partner_id", "referencePartnerId", "")),
    linkedEmployeeId: read(row, "linked_employee_id", "linkedEmployeeId", ""),
    assignedEmployeeId: read(row, "assigned_employee_id", "assignedEmployeeId", read(row, "assigned_to", "assignedTo", "")),
    createdBy: read(row, "created_by", "createdBy", ""),
    studentVisibleStatus: read(row, "student_visible_status", "studentVisibleStatus", read(row, "status", "status", read(row, "application_status", "applicationStatus", "new_user"))),
    status: read(row, "status", "status", read(row, "application_status", "applicationStatus", "new_user")),
    interestedStatus: read(row, "interested_status", "interestedStatus", ""),
    documentsStatus: read(row, "documents_status", "documentsStatus", read(row, "document_status", "documentStatus", "not_started")),
    loanLoginStatus: read(row, "loan_login_status", "loanLoginStatus", ""),
    verificationStatus: read(row, "verification_status", "verificationStatus", ""),
    sanctionedAmount: read(row, "sanctioned_amount", "sanctionedAmount", read(row, "loan_amount_approved", "loanAmountApproved", null)),
    sanctionRejectionReason: read(row, "sanction_rejection_reason", "sanctionRejectionReason", ""),
    disbursedAmount: read(row, "disbursed_amount", "disbursedAmount", null),
    disbursementRejectionReason: read(row, "disbursement_rejection_reason", "disbursementRejectionReason", ""),
    closedStatus: read(row, "closed_status", "closedStatus", ""),
    createdAt: read(row, "created_at", "createdAt"),
    updatedAt: read(row, "updated_at", "updatedAt")
  };
}

function mapUpdate(row) {
  if (!row) return null;
  return {
    id: row.id,
    applicationRecordId: read(row, "application_id", "applicationRecordId", ""),
    userProfileId: read(row, "user_profile_id", "userProfileId", ""),
    createdByAdmin: read(row, "created_by_admin", "createdByAdmin", ""),
    updateType: read(row, "update_type", "updateType", "message"),
    title: row.title || "",
    message: row.message || "",
    visibleToUser: read(row, "visible_to_user", "visibleToUser", true),
    clientVisible: read(row, "client_visible", "clientVisible", read(row, "visible_to_user", "visibleToUser", true)),
    studentVisible: read(row, "student_visible", "studentVisible", read(row, "visible_to_user", "visibleToUser", true)),
    boardVisible: read(row, "board_visible", "boardVisible", false),
    internalOnly: read(row, "internal_only", "internalOnly", false),
    parentUpdateId: read(row, "parent_update_id", "parentUpdateId", ""),
    createdByRole: read(row, "created_by_role", "createdByRole", ""),
    source: row.source || "admin",
    clientMutationId: read(row, "client_mutation_id", "clientMutationId", ""),
    createdAt: read(row, "created_at", "createdAt")
  };
}

function toProfileRow(profile) {
  return {
    auth_user_id: profile.authUserId,
    full_name: profile.fullName,
    email: normalizeEmail(profile.email),
    phone: normalizePhone(profile.phone) || profile.phone || "",
    mobile: normalizePhone(profile.mobile || profile.phone) || profile.mobile || profile.phone || "",
    client_type: profile.clientType || (profile.userType === "client" ? "b2b" : "regular"),
    user_type: profile.userType || (profile.clientType === "b2b" ? "client" : "student"),
    role: profile.role || (profile.clientType === "b2b" ? "client_consultant" : "student"),
    status: profile.status || "pending",
    created_by: profile.createdBy || null,
    commission_visibility_enabled: profile.commissionVisibilityEnabled || false,
    metadata: profile.metadata || {}
  };
}

function toApplicationRow(application) {
  return {
    application_id: application.applicationId || null,
    user_profile_id: application.userProfileId,
    auth_user_id: application.authUserId,
    customer_name: application.customerName,
    customer_email: normalizeEmail(application.customerEmail),
    customer_phone: normalizePhone(application.customerPhone) || application.customerPhone || "",
    service: application.service || "Other",
    client_type: application.clientType || "regular",
    application_status: application.applicationStatus || "new_user",
    workflow_stage: application.workflowStage || application.applicationStatus || "new_user",
    document_status: application.documentStatus || "not_started",
    bank_name: application.bankName || null,
    loan_amount_required: application.loanAmountRequired ?? null,
    loan_amount_approved: application.loanAmountApproved ?? null,
    sanction_status: application.sanctionStatus || "not_started",
    disbursement_status: application.disbursementStatus || "not_started",
    commission_status: application.commissionStatus || (application.clientType === "b2b" ? "pending" : "not_applicable"),
    priority: application.priority || "normal",
    next_followup_date: application.nextFollowupDate || null,
    admin_status: application.adminStatus || "registered",
    assigned_admin_name: application.assignedAdminName || application.assignedToName || null,
    documents_pending: application.documentsPending || null,
    documents_received: application.documentsReceived || null,
    work_started_at: application.workStartedAt || null,
    approved_at: application.approvedAt || null,
    assigned_to: application.assignedTo || null,
    notes: application.notes || "",
    metadata: application.metadata || {},
    student_name: application.studentName || application.customerName || null,
    student_email: application.studentEmail || normalizeEmail(application.customerEmail) || null,
    student_mobile: application.studentMobile || normalizePhone(application.customerPhone) || application.customerPhone || null,
    university_applied: application.universityApplied || null,
    university_applied_for: application.universityAppliedFor || application.universityApplied || null,
    country: application.country || null,
    course: application.course || null,
    loan_amount: application.loanAmount ?? application.loanAmountRequired ?? null,
    loan_amount_needed: application.loanAmountNeeded ?? application.loanAmount ?? application.loanAmountRequired ?? null,
    loan_amount_sanctioned: application.loanAmountSanctioned ?? application.sanctionedAmount ?? application.loanAmountApproved ?? null,
    loan_amount_disbursed: application.loanAmountDisbursed ?? application.disbursedAmount ?? null,
    bank_applied: application.bankApplied || application.bankName || null,
    consultant_client_id: application.consultantClientId || null,
    reference_source_type: application.referenceSourceType || null,
    reference_partner_id: application.referencePartnerId || null,
    client_id: application.clientId || application.referencePartnerId || null,
    lead_source_type: application.leadSourceType || application.referenceSourceType || null,
    reference_owner_id: application.referenceOwnerId || application.referencePartnerId || application.clientId || null,
    linked_employee_id: application.linkedEmployeeId || null,
    assigned_employee_id: application.assignedEmployeeId || null,
    student_visible_status: application.studentVisibleStatus || application.status || application.applicationStatus || "new_user",
    status: application.status || application.applicationStatus || "new_user",
    interested_status: application.interestedStatus || null,
    documents_status: application.documentsStatus || application.documentStatus || "not_started",
    loan_login_status: application.loanLoginStatus || null,
    verification_status: application.verificationStatus || null,
    sanctioned_amount: application.sanctionedAmount ?? application.loanAmountSanctioned ?? application.loanAmountApproved ?? null,
    sanction_rejection_reason: application.sanctionRejectionReason || null,
    disbursed_amount: application.disbursedAmount ?? application.loanAmountDisbursed ?? null,
    disbursement_rejection_reason: application.disbursementRejectionReason || null,
    closed_status: application.closedStatus || null
  };
}

function applicationUpdatesFromPatch(payload) {
  return {
    ...(payload.service !== undefined ? { service: payload.service } : {}),
    ...(payload.userProfileId !== undefined ? { user_profile_id: payload.userProfileId || null } : {}),
    ...(payload.authUserId !== undefined ? { auth_user_id: payload.authUserId || null } : {}),
    ...(payload.customerName !== undefined ? { customer_name: payload.customerName || null } : {}),
    ...(payload.customerEmail !== undefined ? { customer_email: normalizeEmail(payload.customerEmail) || null } : {}),
    ...(payload.customerPhone !== undefined ? { customer_phone: normalizePhone(payload.customerPhone) || payload.customerPhone || null } : {}),
    ...(payload.studentName !== undefined ? { student_name: payload.studentName || payload.customerName || null } : {}),
    ...(payload.studentEmail !== undefined ? { student_email: normalizeEmail(payload.studentEmail || payload.customerEmail) || null } : {}),
    ...(payload.studentMobile !== undefined ? { student_mobile: normalizePhone(payload.studentMobile || payload.customerPhone) || payload.studentMobile || payload.customerPhone || null } : {}),
    ...(payload.universityApplied ? { university_applied: payload.universityApplied } : {}),
    ...(payload.universityAppliedFor || payload.universityApplied ? { university_applied_for: payload.universityAppliedFor || payload.universityApplied } : {}),
    ...(payload.country ? { country: payload.country } : {}),
    ...(payload.course ? { course: payload.course } : {}),
    ...(payload.loanAmount !== undefined ? { loan_amount: payload.loanAmount || null } : {}),
    ...(payload.loanAmountNeeded !== undefined ? { loan_amount_needed: payload.loanAmountNeeded || payload.loanAmount || payload.loanAmountRequired || null } : {}),
    ...(payload.loanAmountSanctioned !== undefined ? {
      loan_amount_sanctioned: payload.loanAmountSanctioned || payload.sanctionedAmount || payload.loanAmountApproved || null,
      sanctioned_amount: payload.loanAmountSanctioned || payload.sanctionedAmount || payload.loanAmountApproved || null,
      loan_amount_approved: payload.loanAmountSanctioned || payload.sanctionedAmount || payload.loanAmountApproved || null
    } : {}),
    ...(payload.loanAmountDisbursed !== undefined ? {
      loan_amount_disbursed: payload.loanAmountDisbursed || payload.disbursedAmount || null,
      disbursed_amount: payload.loanAmountDisbursed || payload.disbursedAmount || null
    } : {}),
    ...(payload.clientType !== undefined ? { client_type: payload.clientType } : {}),
    ...(payload.applicationStatus !== undefined ? { application_status: payload.applicationStatus } : {}),
    ...(payload.workflowStage !== undefined ? { workflow_stage: payload.workflowStage } : {}),
    ...(payload.documentStatus !== undefined ? { document_status: payload.documentStatus } : {}),
    ...(payload.bankName !== undefined ? { bank_name: payload.bankName || null } : {}),
    ...(payload.loanAmountRequired !== undefined ? { loan_amount_required: payload.loanAmountRequired || null } : {}),
    ...(payload.loanAmountApproved !== undefined ? { loan_amount_approved: payload.loanAmountApproved || null } : {}),
    ...(payload.sanctionStatus !== undefined ? { sanction_status: payload.sanctionStatus } : {}),
    ...(payload.disbursementStatus !== undefined ? { disbursement_status: payload.disbursementStatus } : {}),
    ...(payload.commissionStatus !== undefined ? { commission_status: payload.commissionStatus } : {}),
    ...(payload.priority !== undefined ? { priority: payload.priority } : {}),
    ...(payload.nextFollowupDate !== undefined ? { next_followup_date: payload.nextFollowupDate || null } : {}),
    ...(payload.adminStatus !== undefined ? { admin_status: payload.adminStatus } : {}),
    ...(payload.assignedAdminName !== undefined ? { assigned_admin_name: payload.assignedAdminName || null } : {}),
    ...(payload.consultantClientId !== undefined ? { consultant_client_id: payload.consultantClientId || null } : {}),
    ...(payload.referenceSourceType !== undefined ? { reference_source_type: payload.referenceSourceType || null } : {}),
    ...(payload.referencePartnerId !== undefined ? { reference_partner_id: payload.referencePartnerId || null } : {}),
    ...(payload.clientId !== undefined ? { client_id: payload.clientId || payload.referencePartnerId || null } : {}),
    ...(payload.leadSourceType !== undefined ? { lead_source_type: payload.leadSourceType || payload.referenceSourceType || null } : {}),
    ...(payload.referenceOwnerId !== undefined ? { reference_owner_id: payload.referenceOwnerId || payload.referencePartnerId || payload.clientId || null } : {}),
    ...(payload.assignedEmployeeId !== undefined ? {
      assigned_employee_id: payload.assignedEmployeeId || null,
      assigned_to: payload.assignedEmployeeId || null
    } : {}),
    ...(payload.linkedEmployeeId !== undefined ? { linked_employee_id: payload.linkedEmployeeId || null } : {}),
    ...(payload.createdBy !== undefined ? { created_by: payload.createdBy || null } : {}),
    ...(payload.studentVisibleStatus !== undefined ? { student_visible_status: payload.studentVisibleStatus || null } : {}),
    ...(payload.documentsPending !== undefined ? { documents_pending: payload.documentsPending || null } : {}),
    ...(payload.documentsReceived !== undefined ? { documents_received: payload.documentsReceived || null } : {}),
    ...(payload.notes !== undefined ? { notes: payload.notes } : {}),
    ...(payload.assignedTo !== undefined ? { assigned_to: payload.assignedTo || null } : {}),
    ...(payload.metadata !== undefined ? { metadata: payload.metadata } : {})
  };
}

function mockSortByCreatedDesc(rows) {
  return rows.sort((a, b) => new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0));
}

function dedupeByIdentity(rows, identityFor) {
  const seen = new Set();
  return rows.filter((row) => {
    const identity = identityFor(row) || {};
    const key = [
      buildCustomerKey(identity) || row.id,
      identity.service || ""
    ].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function findUserProfileByAuthUserId(authUserId) {
  if (env.mockDatabaseMode) {
    return mapUserProfile(mockDb.findRecord("userProfiles", (item) => item.authUserId === authUserId));
  }

  const { data, error } = await serviceSupabase
    .from("user_profiles")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) throw dbError("Failed to load user profile", error);
  return mapUserProfile(data);
}

async function findUserProfileByEmail(email) {
  const normalized = normalizeEmail(email);
  if (env.mockDatabaseMode) {
    return mapUserProfile(mockDb.findRecord("userProfiles", (item) => normalizeEmail(item.email) === normalized));
  }

  const { data, error } = await serviceSupabase
    .from("user_profiles")
    .select("*")
    .ilike("email", normalized)
    .maybeSingle();

  if (error) throw dbError("Failed to load user profile by email", error);
  return mapUserProfile(data);
}

async function findUserProfileByEmailPhone({ email, phone, name } = {}) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);
  let profile = normalizedEmail ? await findUserProfileByEmail(normalizedEmail) : null;

  if (!profile && normalizedPhone) {
    if (env.mockDatabaseMode) {
      profile = mapUserProfile(mockDb.findRecord("userProfiles", (item) => normalizePhone(item.phone) === normalizedPhone));
    } else {
      const { data, error } = await serviceSupabase
        .from("user_profiles")
        .select("*")
        .in("phone", [normalizedPhone, `+91${normalizedPhone}`, `91${normalizedPhone}`])
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw dbError("Failed to load user profile by phone", error);
      profile = mapUserProfile(data);
    }
  }

  if (profile && !samePerson({ email, phone, name }, profile)) {
    profile = null;
  }
  return profile;
}

async function upsertUserProfile(profile) {
  if (env.mockDatabaseMode) {
    const existing = mockDb.findRecord(
      "userProfiles",
      (item) => item.authUserId === profile.authUserId ||
        normalizeEmail(item.email) === normalizeEmail(profile.email) ||
        (normalizePhone(item.phone) && normalizePhone(item.phone) === normalizePhone(profile.phone))
    );
    if (existing) {
      return mapUserProfile(mockDb.updateRecord("userProfiles", (item) => item.id === existing.id, {
        authUserId: profile.authUserId,
        fullName: profile.fullName,
        email: normalizeEmail(profile.email),
        phone: normalizePhone(profile.phone) || profile.phone || "",
        mobile: normalizePhone(profile.mobile || profile.phone) || profile.mobile || profile.phone || "",
        clientType: profile.clientType || (profile.userType === "client" ? "b2b" : existing.clientType) || "regular",
        userType: profile.userType || existing.userType || (profile.clientType === "b2b" ? "client" : "student"),
        role: profile.role || existing.role || (profile.clientType === "b2b" ? "client_consultant" : "student"),
        status: profile.status || existing.status || "pending",
        createdBy: profile.createdBy || existing.createdBy || "",
        commissionVisibilityEnabled: profile.commissionVisibilityEnabled ?? existing.commissionVisibilityEnabled ?? false,
        metadata: profile.metadata || existing.metadata || {}
      }));
    }
    return mapUserProfile(mockDb.createRecord("userProfiles", {
      authUserId: profile.authUserId,
      fullName: profile.fullName,
      email: normalizeEmail(profile.email),
      phone: normalizePhone(profile.phone) || profile.phone || "",
      mobile: normalizePhone(profile.mobile || profile.phone) || profile.mobile || profile.phone || "",
      clientType: profile.clientType || (profile.userType === "client" ? "b2b" : "regular"),
      userType: profile.userType || (profile.clientType === "b2b" ? "client" : "student"),
      role: profile.role || (profile.clientType === "b2b" ? "client_consultant" : "student"),
      status: profile.status || "pending",
      createdBy: profile.createdBy || "",
      commissionVisibilityEnabled: profile.commissionVisibilityEnabled || false,
      metadata: profile.metadata || {}
    }));
  }

  const { data, error } = await serviceSupabase
    .from("user_profiles")
    .upsert(toProfileRow({ ...profile, phone: normalizePhone(profile.phone) || profile.phone }), { onConflict: "email" })
    .select("*")
    .single();

  if (error) throw dbError("Failed to save user profile", error);
  return mapUserProfile(data);
}

async function updateUserProfileStatus(id, statusOrPatch, admin = null) {
  const existing = await findUserProfileById(id);
  if (!existing) return null;
  const patch = typeof statusOrPatch === "object" ? statusOrPatch : { status: statusOrPatch };
  const updates = {};
  if (patch.status) updates.status = patch.status;
  if (patch.clientType) updates.client_type = patch.clientType;
  const mockUpdates = {};
  if (patch.status) mockUpdates.status = patch.status;
  if (patch.clientType) mockUpdates.clientType = patch.clientType;

  if (env.mockDatabaseMode) {
    const updated = mapUserProfile(mockDb.updateRecord("userProfiles", (item) => item.id === id, mockUpdates));
    await adminAuditLogService.createAdminAuditLog({
      adminUserId: admin?.id || null,
      action: "update_user_status",
      module: "user_profiles",
      recordId: id,
      oldValue: existing,
      newValue: updated
    });
    const application = await findApplicationByUserProfileId(id);
    if (application && patch.clientType && application.clientType !== patch.clientType) {
      await updateApplication(application.id, {
        clientType: patch.clientType,
        workflowStage: patch.clientType === "b2b" ? "registered" : "new_user",
        commissionStatus: patch.clientType === "b2b" ? "pending" : "not_applicable"
      }, admin, `Client type changed to ${patch.clientType}`);
    }
    if (application && ["approved", "suspended", "inactive"].includes(patch.status)) {
      const nextStatus = patch.status === "approved" ? "approved" : "on_hold";
      await updateApplication(application.id, {
        applicationStatus: nextStatus,
        workflowStage: nextStatus,
        adminStatus: patch.status
      }, admin, `User status changed to ${patch.status}`);
    }
    return updated;
  }

  const { data, error } = await serviceSupabase
    .from("user_profiles")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw dbError("Failed to update user profile", error);
  const updated = mapUserProfile(data);
  await adminAuditLogService.createAdminAuditLog({
    adminUserId: admin?.id || null,
    action: "update_user_status",
    module: "user_profiles",
    recordId: id,
    oldValue: existing,
    newValue: updated
  });

  const application = await findApplicationByUserProfileId(id);
  if (application && patch.clientType && application.clientType !== patch.clientType) {
    await updateApplication(application.id, {
      clientType: patch.clientType,
      workflowStage: patch.clientType === "b2b" ? "registered" : "new_user",
      commissionStatus: patch.clientType === "b2b" ? "pending" : "not_applicable"
    }, admin, `Client type changed to ${patch.clientType}`);
  }

  if (application && ["approved", "suspended", "inactive"].includes(patch.status)) {
    const nextStatus = patch.status === "approved" ? "approved" : "on_hold";
    await updateApplication(application.id, {
      applicationStatus: nextStatus,
      workflowStage: nextStatus,
      adminStatus: patch.status
    }, admin, `User status changed to ${patch.status}`);
  }

  return updated;
}

async function findUserProfileById(id) {
  if (env.mockDatabaseMode) {
    return mapUserProfile(mockDb.findRecord("userProfiles", (item) => item.id === id));
  }

  const { data, error } = await serviceSupabase
    .from("user_profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw dbError("Failed to load user profile by id", error);
  return mapUserProfile(data);
}

async function listUsers(queryParams = {}) {
  const safeLimit = Math.min(Math.max(Number(queryParams.limit) || 25, 1), 100);
  const safePage = Math.max(Number(queryParams.page) || 1, 1);
  const search = String(queryParams.search || "").trim();
  const requestedType = String(queryParams.type || "").trim().toLowerCase();

  if (env.mockDatabaseMode) {
    let rows = mockDb.listRecords("userProfiles").map(mapUserProfile);
    if (requestedType === "student") rows = rows.filter((item) => item.userType === "student" || item.role === "student");
    if (requestedType === "employee") rows = rows.filter((item) => item.role === "employee");
    if (requestedType === "board") rows = rows.filter((item) => ["board", "board_member"].includes(item.role));
    if (requestedType === "client") rows = rows.filter((item) => item.userType === "client" || crmClientRoles.includes(item.role));
    if (queryParams.status) rows = rows.filter((item) => item.status === queryParams.status);
    if (queryParams.userType) rows = rows.filter((item) => item.userType === queryParams.userType);
    if (queryParams.role) rows = rows.filter((item) => item.role === queryParams.role);
    if (queryParams.clientType) rows = rows.filter((item) => item.clientType === queryParams.clientType);
    if (search) {
      const needle = search.toLowerCase();
      rows = rows.filter((item) => [item.fullName, item.email, item.phone].some((value) => String(value || "").toLowerCase().includes(needle)));
    }
    rows = dedupeByIdentity(mockSortByCreatedDesc(rows), (item) => item);
    return {
      users: rows.slice((safePage - 1) * safeLimit, safePage * safeLimit),
      total: rows.length,
      page: safePage,
      limit: safeLimit
    };
  }

  let query = serviceSupabase
    .from("user_profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((safePage - 1) * safeLimit, safePage * safeLimit - 1);

  if (requestedType === "student") query = query.eq("user_type", "student");
  if (requestedType === "employee") query = query.eq("role", "employee");
  if (requestedType === "board") query = query.in("role", ["board", "board_member"]);
  if (requestedType === "client") query = query.eq("user_type", "client");
  if (queryParams.status) query = query.eq("status", queryParams.status);
  if (queryParams.userType) query = query.eq("user_type", queryParams.userType);
  if (queryParams.role) query = query.eq("role", queryParams.role);
  if (queryParams.clientType) query = query.eq("client_type", queryParams.clientType);
  if (search) {
    const term = search.replace(/[%_,]/g, "");
    query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`);
  }

  const { data, error, count } = await query;
  if (error) throw dbError("Failed to list users", error);
  return {
    users: dedupeByIdentity((data || []).map(mapUserProfile), (item) => item),
    total: count || 0,
    page: safePage,
    limit: safeLimit
  };
}

async function createApplicationForUser(profile, overrides = {}) {
  const existing = await findApplicationByUserAndService(profile.id, overrides.service || "Other");
  if (existing) {
    return updateApplication(existing.id, {
      customerName: profile.fullName || existing.customerName,
      customerEmail: profile.email || existing.customerEmail,
      customerPhone: profile.phone || existing.customerPhone,
      studentName: overrides.studentName || profile.fullName || existing.studentName,
      studentEmail: overrides.studentEmail || profile.email || existing.studentEmail,
      studentMobile: overrides.studentMobile || profile.phone || existing.studentMobile,
      universityApplied: overrides.universityApplied ?? existing.universityApplied,
      universityAppliedFor: overrides.universityAppliedFor ?? overrides.universityApplied ?? existing.universityAppliedFor,
      country: overrides.country ?? existing.country,
      course: overrides.course ?? existing.course,
      loanAmount: overrides.loanAmount ?? existing.loanAmount,
      loanAmountNeeded: overrides.loanAmountNeeded ?? overrides.loanAmount ?? existing.loanAmountNeeded,
      loanAmountApproved: overrides.loanAmountApproved ?? existing.loanAmountApproved,
      loanAmountSanctioned: overrides.loanAmountSanctioned ?? overrides.loanAmountApproved ?? existing.loanAmountSanctioned,
      consultantClientId: overrides.consultantClientId ?? existing.consultantClientId,
      referenceSourceType: overrides.referenceSourceType ?? existing.referenceSourceType,
      referencePartnerId: overrides.referencePartnerId ?? existing.referencePartnerId,
      clientId: overrides.clientId ?? overrides.referencePartnerId ?? existing.clientId,
      leadSourceType: overrides.leadSourceType ?? overrides.referenceSourceType ?? existing.leadSourceType,
      referenceOwnerId: overrides.referenceOwnerId ?? overrides.referencePartnerId ?? overrides.clientId ?? existing.referenceOwnerId,
      assignedEmployeeId: overrides.assignedEmployeeId ?? existing.assignedEmployeeId,
      linkedEmployeeId: overrides.linkedEmployeeId ?? existing.linkedEmployeeId,
      studentVisibleStatus: overrides.studentVisibleStatus ?? overrides.status ?? existing.studentVisibleStatus,
      metadata: {
        ...(existing.metadata || {}),
        ...(overrides.metadata || {}),
        customerKey: buildCustomerKey({ email: profile.email, phone: profile.phone, name: profile.fullName })
      }
    });
  }
  const payload = {
    userProfileId: profile.id,
    authUserId: profile.authUserId,
    customerName: profile.fullName,
    customerEmail: profile.email,
    customerPhone: normalizePhone(profile.phone) || profile.phone || "",
    service: overrides.service || "Other",
    applicationStatus: overrides.applicationStatus || (profile.status === "verified" ? "verified" : "new_user"),
    adminStatus: overrides.adminStatus || "registered",
    assignedAdminName: overrides.assignedAdminName || "",
    studentName: overrides.studentName || profile.fullName,
    studentEmail: overrides.studentEmail || profile.email,
    studentMobile: overrides.studentMobile || normalizePhone(profile.phone) || profile.phone || "",
    universityApplied: overrides.universityApplied || "",
    universityAppliedFor: overrides.universityAppliedFor || overrides.universityApplied || "",
    country: overrides.country || "",
    course: overrides.course || "",
    loanAmount: overrides.loanAmount ?? overrides.loanAmountRequired ?? null,
    loanAmountRequired: overrides.loanAmountRequired ?? overrides.loanAmount ?? null,
    loanAmountNeeded: overrides.loanAmountNeeded ?? overrides.loanAmount ?? overrides.loanAmountRequired ?? null,
    loanAmountApproved: overrides.loanAmountApproved ?? null,
    loanAmountSanctioned: overrides.loanAmountSanctioned ?? overrides.loanAmountApproved ?? null,
    loanAmountDisbursed: overrides.loanAmountDisbursed ?? null,
    consultantClientId: overrides.consultantClientId || null,
    referenceSourceType: overrides.referenceSourceType || null,
    referencePartnerId: overrides.referencePartnerId || null,
    clientId: overrides.clientId || overrides.referencePartnerId || null,
    leadSourceType: overrides.leadSourceType || overrides.referenceSourceType || null,
    referenceOwnerId: overrides.referenceOwnerId || overrides.referencePartnerId || overrides.clientId || null,
    assignedEmployeeId: overrides.assignedEmployeeId || null,
    assignedTo: overrides.assignedTo || overrides.assignedEmployeeId || null,
    linkedEmployeeId: overrides.linkedEmployeeId || null,
    createdBy: overrides.createdBy || null,
    studentVisibleStatus: overrides.studentVisibleStatus || overrides.status || overrides.applicationStatus || (profile.status === "verified" ? "verified" : "new_user"),
    status: overrides.status || overrides.applicationStatus || (profile.status === "verified" ? "verified" : "new_user"),
    metadata: {
      ...(overrides.metadata || {}),
      customerKey: buildCustomerKey({ email: profile.email, phone: profile.phone, name: profile.fullName })
    },
    clientType: profile.clientType || "regular",
    workflowStage: overrides.workflowStage || (profile.clientType === "b2b" ? "registered" : (profile.status === "verified" ? "verified" : "new_user")),
    documentStatus: "not_started",
    sanctionStatus: "not_started",
    disbursementStatus: "not_started",
    commissionStatus: profile.clientType === "b2b" ? "pending" : "not_applicable",
    priority: "normal"
  };

  if (env.mockDatabaseMode) {
    return mapApplication(mockDb.createRecord("crmApplications", payload));
  }

  const { data, error } = await serviceSupabase
    .from("crm_applications")
    .insert(toApplicationRow(payload))
    .select("*")
    .single();

  if (error) throw dbError("Failed to create CRM application", error);
  return mapApplication(data);
}

async function ensureApplicationForUser(profile) {
  let application = await findApplicationByUserProfileId(profile.id);
  if (!application) {
    application = await createApplicationForUser(profile);
  } else if (profile.status === "verified" && ["new_user", "registered"].includes(application.applicationStatus)) {
    application = await updateApplication(application.id, {
      applicationStatus: "verified",
      adminStatus: application.adminStatus || "registered"
    }, null, "User email verified");
  }
  return application;
}

async function findApplicationByUserProfileId(userProfileId) {
  if (env.mockDatabaseMode) {
    const rows = mockDb
      .listRecords("crmApplications")
      .filter((item) => item.userProfileId === userProfileId);
    return selectPrimaryApplication(rows.map(mapApplication));
  }

  const { data, error } = await serviceSupabase
    .from("crm_applications")
    .select("*")
    .eq("user_profile_id", userProfileId)
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw dbError("Failed to load CRM application", error);
  return selectPrimaryApplication((data || []).map(mapApplication));
}

function selectPrimaryApplication(applications = []) {
  const sorted = applications
    .filter(Boolean)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
  return sorted.find((item) => !["closed", "rejected", "completed"].includes(item.applicationStatus)) || sorted[0] || null;
}

async function findApplicationByUserAndService(userProfileId, service) {
  const targetService = String(service || "Other").trim() || "Other";
  if (env.mockDatabaseMode) {
    const rows = mockDb
      .listRecords("crmApplications")
      .filter((item) => item.userProfileId === userProfileId && String(item.service || "Other") === targetService);
    return mapApplication(mockSortByCreatedDesc(rows)[0]);
  }

  const { data, error } = await serviceSupabase
    .from("crm_applications")
    .select("*")
    .eq("user_profile_id", userProfileId)
    .eq("service", targetService)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw dbError("Failed to load CRM application by user and service", error);
  return mapApplication(data);
}

async function findApplicationByIdOrApplicationId(idOrApplicationId) {
  if (env.mockDatabaseMode) {
    return mapApplication(mockDb.findRecord(
      "crmApplications",
      (item) => item.id === idOrApplicationId || item.applicationId === idOrApplicationId
    ));
  }

  const field = isUuid(idOrApplicationId) ? "id" : "application_id";
  const { data, error } = await serviceSupabase
    .from("crm_applications")
    .select("*")
    .eq(field, idOrApplicationId)
    .maybeSingle();

  if (error) throw dbError("Failed to load CRM application", error);
  return mapApplication(data);
}

async function listApplications(queryParams = {}) {
  const safeLimit = Math.min(Math.max(Number(queryParams.limit) || 25, 1), 100);
  const safePage = Math.max(Number(queryParams.page) || 1, 1);
  const search = String(queryParams.search || "").trim();

  if (env.mockDatabaseMode) {
    let rows = mockDb.listRecords("crmApplications").map(mapApplication);
    if (queryParams.status) rows = rows.filter((item) => item.applicationStatus === queryParams.status);
    if (queryParams.statFilter === "pending") rows = rows.filter((item) => ["new_user", "registered", "pending"].includes(item.applicationStatus || item.status));
    if (queryParams.service) rows = rows.filter((item) => item.service === queryParams.service);
    if (queryParams.clientId) {
      rows = rows.filter((item) => [
        item.clientId,
        item.referencePartnerId,
        item.referenceOwnerId,
        item.consultantClientId
      ].includes(queryParams.clientId));
    }
    if (search) {
      const needle = search.toLowerCase();
      rows = rows.filter((item) => [item.applicationId, item.customerName, item.customerEmail, item.customerPhone, item.service].some((value) => String(value || "").toLowerCase().includes(needle)));
    }
    rows = mockSortByCreatedDesc(rows);
    return {
      applications: rows.slice((safePage - 1) * safeLimit, safePage * safeLimit),
      total: rows.length,
      page: safePage,
      limit: safeLimit
    };
  }

  let query = serviceSupabase
    .from("crm_applications")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((safePage - 1) * safeLimit, safePage * safeLimit - 1);

  if (queryParams.status) query = query.eq("application_status", queryParams.status);
  if (queryParams.statFilter === "pending") query = query.in("application_status", ["new_user", "registered"]);
  if (queryParams.service) query = query.eq("service", queryParams.service);
  if (queryParams.clientId) {
    const clientId = String(queryParams.clientId).replace(/[%_,]/g, "");
    query = query.or(`client_id.eq.${clientId},reference_partner_id.eq.${clientId},reference_owner_id.eq.${clientId},consultant_client_id.eq.${clientId}`);
  }
  if (queryParams.fromDate) query = query.gte("created_at", queryParams.fromDate);
  if (queryParams.toDate) query = query.lte("created_at", queryParams.toDate);
  if (search) {
    const term = search.replace(/[%_,]/g, "");
    query = query.or(`application_id.ilike.%${term}%,customer_name.ilike.%${term}%,customer_email.ilike.%${term}%,customer_phone.ilike.%${term}%,service.ilike.%${term}%`);
  }

  const { data, error, count } = await query;
  if (error) throw dbError("Failed to list CRM applications", error);
  return {
    applications: (data || []).map(mapApplication),
    total: count || 0,
    page: safePage,
    limit: safeLimit
  };
}

async function createStatusHistory({ applicationId, oldStatus, newStatus, admin = null, reason = "" }) {
  const payload = {
    application_id: applicationId,
    old_status: oldStatus || null,
    new_status: newStatus,
    changed_by: admin?.id || null,
    change_reason: reason || ""
  };

  if (env.mockDatabaseMode) {
    return mockDb.createRecord("crmStatusHistory", {
      applicationId,
      oldStatus,
      newStatus,
      changedBy: admin?.id || "",
      changeReason: reason || ""
    });
  }

  const { error } = await serviceSupabase.from("crm_status_history").insert(payload);
  if (error) throw dbError("Failed to write CRM status history", error);
  return null;
}

function userStatusFromApplicationStatus(status) {
  if (status === "approved") return "approved";
  if (status === "verified") return "verified";
  if (["on_hold", "rejected", "closed"].includes(status)) return "inactive";
  return "";
}

async function syncUserProfileFromApplication(existing, updated, admin = null) {
  if (!updated?.userProfileId) return;
  const updates = {};
  const mockUpdates = {};
  if (updated.clientType && updated.clientType !== existing.clientType) {
    updates.client_type = updated.clientType;
    mockUpdates.clientType = updated.clientType;
  }
  const nextUserStatus = userStatusFromApplicationStatus(updated.applicationStatus);
  if (nextUserStatus && updated.applicationStatus !== existing.applicationStatus) {
    updates.status = nextUserStatus;
    mockUpdates.status = nextUserStatus;
  }
  if (!Object.keys(updates).length) return;

  const existingProfile = await findUserProfileById(updated.userProfileId);
  if (!existingProfile) return;

  if (env.mockDatabaseMode) {
    const syncedProfile = mapUserProfile(mockDb.updateRecord("userProfiles", (item) => item.id === updated.userProfileId, mockUpdates));
    await adminAuditLogService.createAdminAuditLog({
      adminUserId: admin?.id || null,
      action: "sync_user_profile_from_crm",
      module: "user_profiles",
      recordId: updated.userProfileId,
      oldValue: existingProfile,
      newValue: syncedProfile
    });
    return;
  }

  const { data, error } = await serviceSupabase
    .from("user_profiles")
    .update(updates)
    .eq("id", updated.userProfileId)
    .select("*")
    .single();

  if (error) throw dbError("Failed to sync user profile from CRM application", error);
  await adminAuditLogService.createAdminAuditLog({
    adminUserId: admin?.id || null,
    action: "sync_user_profile_from_crm",
    module: "user_profiles",
    recordId: updated.userProfileId,
    oldValue: existingProfile,
    newValue: mapUserProfile(data)
  });
}

async function updateApplication(id, payload, admin = null, reason = "") {
  const existing = await findApplicationByIdOrApplicationId(id);
  if (!existing) return null;

  if (payload.applicationStatus === "work_started") {
    return markWorkStarted(existing.id, admin);
  }

  const updates = applicationUpdatesFromPatch(payload);
  if (payload.applicationStatus === "approved" && !existing.approvedAt) {
    updates.approved_at = new Date().toISOString();
  }

  if (env.mockDatabaseMode) {
    const updated = mapApplication(mockDb.updateRecord("crmApplications", (item) => item.id === existing.id, {
      service: updates.service ?? existing.service,
      userProfileId: updates.user_profile_id ?? existing.userProfileId,
      authUserId: updates.auth_user_id ?? existing.authUserId,
      customerName: updates.customer_name ?? existing.customerName,
      customerEmail: updates.customer_email ?? existing.customerEmail,
      customerPhone: updates.customer_phone ?? existing.customerPhone,
      clientType: updates.client_type ?? existing.clientType,
      applicationStatus: updates.application_status ?? existing.applicationStatus,
      workflowStage: updates.workflow_stage ?? existing.workflowStage,
      documentStatus: updates.document_status ?? existing.documentStatus,
      bankName: updates.bank_name ?? existing.bankName,
      loanAmountRequired: updates.loan_amount_required ?? existing.loanAmountRequired,
      loanAmountApproved: updates.loan_amount_approved ?? existing.loanAmountApproved,
      sanctionStatus: updates.sanction_status ?? existing.sanctionStatus,
      disbursementStatus: updates.disbursement_status ?? existing.disbursementStatus,
      commissionStatus: updates.commission_status ?? existing.commissionStatus,
      priority: updates.priority ?? existing.priority,
      nextFollowupDate: updates.next_followup_date ?? existing.nextFollowupDate,
      adminStatus: updates.admin_status ?? existing.adminStatus,
      assignedAdminName: updates.assigned_admin_name ?? existing.assignedAdminName,
      documentsPending: updates.documents_pending ?? existing.documentsPending,
      documentsReceived: updates.documents_received ?? existing.documentsReceived,
      notes: updates.notes ?? existing.notes,
      assignedTo: updates.assigned_to ?? existing.assignedTo,
      metadata: updates.metadata ?? existing.metadata,
      studentName: updates.student_name ?? existing.studentName,
      studentEmail: updates.student_email ?? existing.studentEmail,
      studentMobile: updates.student_mobile ?? existing.studentMobile,
      universityApplied: updates.university_applied ?? existing.universityApplied,
      universityAppliedFor: updates.university_applied_for ?? existing.universityAppliedFor,
      country: updates.country ?? existing.country,
      course: updates.course ?? existing.course,
      loanAmount: updates.loan_amount ?? existing.loanAmount,
      loanAmountNeeded: updates.loan_amount_needed ?? existing.loanAmountNeeded,
      loanAmountSanctioned: updates.loan_amount_sanctioned ?? existing.loanAmountSanctioned,
      loanAmountDisbursed: updates.loan_amount_disbursed ?? existing.loanAmountDisbursed,
      consultantClientId: updates.consultant_client_id ?? existing.consultantClientId,
      referenceSourceType: updates.reference_source_type ?? existing.referenceSourceType,
      referencePartnerId: updates.reference_partner_id ?? existing.referencePartnerId,
      clientId: updates.client_id ?? existing.clientId,
      leadSourceType: updates.lead_source_type ?? existing.leadSourceType,
      referenceOwnerId: updates.reference_owner_id ?? existing.referenceOwnerId,
      assignedEmployeeId: updates.assigned_employee_id ?? existing.assignedEmployeeId,
      linkedEmployeeId: updates.linked_employee_id ?? existing.linkedEmployeeId,
      studentVisibleStatus: updates.student_visible_status ?? existing.studentVisibleStatus,
      approvedAt: updates.approved_at ?? existing.approvedAt
    }));
    if (updated.applicationStatus !== existing.applicationStatus) {
      await createStatusHistory({
        applicationId: existing.id,
        oldStatus: existing.applicationStatus,
        newStatus: updated.applicationStatus,
        admin,
        reason
      });
    }
    await adminAuditLogService.createAdminAuditLog({
      adminUserId: admin?.id || null,
      action: "update_crm_application",
      module: "crm_applications",
      recordId: existing.id,
      oldValue: existing,
      newValue: updated
    });
    await syncUserProfileFromApplication(existing, updated, admin);
    return updated;
  }

  const { data, error } = await serviceSupabase
    .from("crm_applications")
    .update(updates)
    .eq("id", existing.id)
    .select("*")
    .single();

  if (error) throw dbError("Failed to update CRM application", error);
  const updated = mapApplication(data);

  if (updated.applicationStatus !== existing.applicationStatus) {
    await createStatusHistory({
      applicationId: existing.id,
      oldStatus: existing.applicationStatus,
      newStatus: updated.applicationStatus,
      admin,
      reason
    });
  }

  await adminAuditLogService.createAdminAuditLog({
    adminUserId: admin?.id || null,
    action: "update_crm_application",
    module: "crm_applications",
    recordId: existing.id,
    oldValue: existing,
    newValue: updated
  });
  await syncUserProfileFromApplication(existing, updated, admin);
  return updated;
}

async function markWorkStarted(id, admin = null) {
  const existing = await findApplicationByIdOrApplicationId(id);
  if (!existing) return null;

  const applicationId = existing.applicationId || await applicationIdService.generateApplicationId();
  const now = new Date().toISOString();
  const updates = {
    application_id: applicationId,
    application_status: "work_started",
    workflow_stage: "work_started",
    admin_status: "work_started",
    work_started_at: existing.workStartedAt || now
  };

  let updated;
  if (env.mockDatabaseMode) {
    updated = mapApplication(mockDb.updateRecord("crmApplications", (item) => item.id === existing.id, {
      applicationId,
      applicationStatus: "work_started",
      workflowStage: "work_started",
      adminStatus: "work_started",
      workStartedAt: existing.workStartedAt || now
    }));
  } else {
    const { data, error } = await serviceSupabase
      .from("crm_applications")
      .update(updates)
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) throw dbError("Failed to mark work started", error);
    updated = mapApplication(data);
  }

  if (existing.applicationStatus !== "work_started") {
    await createStatusHistory({
      applicationId: existing.id,
      oldStatus: existing.applicationStatus,
      newStatus: "work_started",
      admin,
      reason: "Work started"
    });
  }

  if (!existing.applicationId || existing.applicationStatus !== "work_started") {
    await addUpdate(existing.id, {
      title: "Work Started",
      message: `Your application work has been started. Your Application ID is ${applicationId}.`,
      updateType: "status_update",
      visibleToUser: true
    }, admin);
  }

  await adminAuditLogService.createAdminAuditLog({
    adminUserId: admin?.id || null,
    action: "mark_work_started",
    module: "crm_applications",
    recordId: existing.id,
    oldValue: existing,
    newValue: updated
  });
  return updated;
}

async function addUpdate(id, payload, admin = null) {
  const application = await findApplicationByIdOrApplicationId(id);
  if (!application) return null;
  const cleanTitle = String(payload.title || "").trim();
  const cleanMessage = String(payload.message || "").trim();
  const now = Date.now();
  const existingUpdates = await listUpdates(application.id, { visibleOnly: false });
  const duplicate = (existingUpdates || []).find((item) => {
    const created = new Date(item.createdAt || 0).getTime();
    const sameMutation = payload.clientMutationId && item.clientMutationId === payload.clientMutationId;
    const sameRecentContent = item.title === cleanTitle && item.message === cleanMessage && Math.abs(now - created) < 8000;
    return sameMutation || sameRecentContent;
  });
  if (duplicate) return duplicate;

  if (env.mockDatabaseMode) {
    const update = mapUpdate(mockDb.createRecord("crmUpdates", {
      applicationId: application.id,
      userProfileId: application.userProfileId,
      createdByAdmin: admin?.id || "",
      updateType: payload.updateType || "message",
      title: cleanTitle,
      message: cleanMessage,
      visibleToUser: payload.visibleToUser !== false,
      clientVisible: payload.clientVisible ?? payload.visibleToUser !== false,
      studentVisible: payload.studentVisible ?? payload.visibleToUser !== false,
      boardVisible: payload.boardVisible ?? false,
      internalOnly: payload.internalOnly ?? payload.visibleToUser === false,
      parentUpdateId: payload.parentUpdateId || "",
      createdByRole: payload.createdByRole || admin?.role || "",
      source: payload.source || (admin ? "admin" : "user"),
      clientMutationId: payload.clientMutationId || ""
    }));
    await adminAuditLogService.createAdminAuditLog({
      adminUserId: admin?.id || null,
      action: "add_crm_update",
      module: "crm_updates",
      recordId: update.id,
      newValue: update
    });
    return update;
  }

  const { data, error } = await serviceSupabase
    .from("crm_updates")
    .insert({
      application_id: application.id,
      user_profile_id: application.userProfileId,
      created_by_admin: admin?.id || null,
      update_type: payload.updateType || "message",
      title: cleanTitle,
      message: cleanMessage,
      visible_to_user: payload.visibleToUser !== false,
      client_visible: payload.clientVisible ?? payload.visibleToUser !== false,
      student_visible: payload.studentVisible ?? payload.visibleToUser !== false,
      board_visible: payload.boardVisible ?? false,
      internal_only: payload.internalOnly ?? payload.visibleToUser === false,
      parent_update_id: payload.parentUpdateId || null,
      created_by_role: payload.createdByRole || admin?.role || null,
      source: payload.source || (admin ? "admin" : "user"),
      client_mutation_id: payload.clientMutationId || null
    })
    .select("*")
    .single();

  if (error) throw dbError("Failed to add CRM update", error);
  const update = mapUpdate(data);
  await adminAuditLogService.createAdminAuditLog({
    adminUserId: admin?.id || null,
    action: "add_crm_update",
    module: "crm_updates",
    recordId: update.id,
    newValue: update
  });
  return update;
}

async function listUpdates(id, { visibleOnly = false, audience = "" } = {}) {
  const application = await findApplicationByIdOrApplicationId(id);
  if (!application) return null;

  if (env.mockDatabaseMode) {
    let rows = mockDb
      .listRecords("crmUpdates")
      .filter((item) => item.applicationId === application.id)
      .map(mapUpdate);
    if (visibleOnly) rows = rows.filter((item) => item.visibleToUser);
    if (audience === "student") rows = rows.filter((item) => item.studentVisible && !item.internalOnly);
    if (audience === "client") rows = rows.filter((item) => item.clientVisible && !item.internalOnly);
    if (audience === "board") rows = rows.filter((item) => item.boardVisible && !item.internalOnly);
    rows.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    return rows;
  }

  let query = serviceSupabase
    .from("crm_updates")
    .select("*")
    .eq("application_id", application.id)
    .order("created_at", { ascending: true });

  if (visibleOnly) query = query.eq("visible_to_user", true);
  if (audience === "student") query = query.eq("student_visible", true).eq("internal_only", false);
  if (audience === "client") query = query.eq("client_visible", true).eq("internal_only", false);
  if (audience === "board") query = query.eq("board_visible", true).eq("internal_only", false);
  const { data, error } = await query;
  if (error) throw dbError("Failed to list CRM updates", error);
  return (data || []).map(mapUpdate);
}

async function getStats() {
  const [userResult, applicationResult] = await Promise.all([
    listUsers({ limit: 100 }),
    listApplications({ limit: 100 })
  ]);
  const users = userResult.users || [];
  const applications = applicationResult.applications || [];

  return {
    totalUsers: userResult.total ?? users.length,
    pendingUsers: users.filter((item) => item.status === "pending").length,
    totalApplications: applicationResult.total ?? applications.length,
    workStarted: applications.filter((item) => item.applicationStatus === "work_started").length,
    completed: applications.filter((item) => item.applicationStatus === "completed").length
  };
}

function assertCanEditCrm(admin) {
  if (!admin || !crmEditableRoles.includes(admin.role)) {
    throw new AppError("Unauthorized role", 403, "UNAUTHORIZED_ROLE");
  }
}

function assertCanAddCrmUpdate(admin) {
  if (!admin || !crmUpdateRoles.includes(admin.role)) {
    throw new AppError("Unauthorized role", 403, "UNAUTHORIZED_ROLE");
  }
}

module.exports = {
  assertCanAddCrmUpdate,
  assertCanEditCrm,
  createApplicationForUser,
  ensureApplicationForUser,
  findApplicationByIdOrApplicationId,
  findApplicationByUserAndService,
  findApplicationByUserProfileId,
  findUserProfileByAuthUserId,
  findUserProfileByEmail,
  findUserProfileByEmailPhone,
  findUserProfileById,
  getStats,
  listApplications,
  listUpdates,
  listUsers,
  mapApplication,
  mapUpdate,
  mapUserProfile,
  markWorkStarted,
  addUpdate,
  updateApplication,
  updateUserProfileStatus,
  upsertUserProfile
};
