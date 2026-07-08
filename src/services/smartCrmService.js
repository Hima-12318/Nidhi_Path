const crypto = require("crypto");
const { env } = require("../config/env");
const { serviceSupabase, supabaseAdminClient } = require("../config/supabase");
const { AppError } = require("../middleware/errorMiddleware");
const adminAuditLogService = require("./adminAuditLogService");
const crmService = require("./crmService");
const mockDb = require("./mockDatabaseService");
const { normalizeEmail, normalizePhone } = require("./customerIdentityService");

const ADMIN_ROLES = new Set(["super_admin", "admin", "ceo"]);
const BOARD_ROLES = new Set(["board", "board_member"]);
const EMPLOYEE_ROLES = new Set(["employee"]);
const STUDENT_ROLES = new Set(["student"]);
const PARTNER_ROLES = new Set(["connector", "client_consultant", "own_self", "online_reference", "banker_reference", "employee_reference"]);
const COMMISSION_VISIBLE_BY_DEFAULT = new Set(["connector", "client_consultant"]);

function businessDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${byType.year}-${byType.month}-${byType.day}`;
}

function dateKey(date = new Date()) {
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return businessDateKey();
  return value.toISOString().slice(0, 10);
}

function addDays(dateText, days) {
  const value = new Date(`${dateText}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return dateKey(value);
}

function monthName(monthNumber) {
  const date = new Date(Date.UTC(2026, Number(monthNumber || 1) - 1, 1));
  return date.toLocaleString("en-IN", { month: "long", timeZone: "UTC" });
}

function read(row, snake, camel, fallback = undefined) {
  return row?.[snake] ?? row?.[camel] ?? fallback;
}

function dbError(action, error) {
  const message = error?.message || "Unknown database error";
  if (message.includes("Could not find the table") || message.includes("schema cache") || message.includes("column")) {
    return new AppError("SmartCRM database tables are not ready. Please run backend/sql/013_smartcrm_role_intelligence.sql and backend/sql/016_users_module_role_flows.sql in Supabase.", 503, "SMARTCRM_SCHEMA_NOT_READY");
  }
  return new Error(`${action}: ${message}`);
}

function roleOf(profile = {}) {
  return String(profile.role || profile.adminRole || "").trim().toLowerCase();
}

function userTypeOf(profile = {}) {
  return String(profile.userType || profile.user_type || "").trim().toLowerCase();
}

function isAdminRole(profile = {}) {
  return ADMIN_ROLES.has(roleOf(profile));
}

function isBoardRole(profile = {}) {
  return BOARD_ROLES.has(roleOf(profile));
}

function isEmployeeRole(profile = {}) {
  return EMPLOYEE_ROLES.has(roleOf(profile));
}

function isStudentRole(profile = {}) {
  return STUDENT_ROLES.has(roleOf(profile));
}

function isPartnerRole(profile = {}) {
  return PARTNER_ROLES.has(roleOf(profile));
}

function assertActiveProfile(profile) {
  if (!profile) {
    throw new AppError("Profile not found", 403, "PROFILE_NOT_FOUND");
  }
  if (["inactive", "suspended"].includes(String(profile.status || "").toLowerCase())) {
    throw new AppError("Account is inactive", 403, "ACCOUNT_INACTIVE");
  }
}

function assertAdminCanWrite(admin) {
  if (!admin || !ADMIN_ROLES.has(roleOf(admin))) {
    throw new AppError("Only Admin / CEO can perform this action", 403, "ADMIN_WRITE_REQUIRED");
  }
}

function assertUserRole(profile, allowedRoles = []) {
  assertActiveProfile(profile);
  if (!allowedRoles.includes(roleOf(profile))) {
    throw new AppError("Unauthorized role", 403, "UNAUTHORIZED_ROLE");
  }
}

function getRedirectForProfile(profile = {}) {
  const role = roleOf(profile);
  if (role === "student") return "student-dashboard.html";
  if (role === "admin" || role === "ceo" || role === "super_admin") return "admin-dashboard.html";
  if (role === "board" || role === "board_member") return "board-dashboard.html";
  if (role === "employee") return "employee-dashboard.html";
  if (isPartnerRole(profile)) return "client-dashboard.html";
  return "student-dashboard.html";
}

function canSeeCommission(profileOrPartner = {}) {
  const role = roleOf(profileOrPartner) || read(profileOrPartner, "reference_type", "referenceType", "");
  if (role === "own_self" || role === "employee_reference") return false;
  return Boolean(profileOrPartner.commissionVisibilityEnabled ?? profileOrPartner.commission_visibility_enabled ?? COMMISSION_VISIBLE_BY_DEFAULT.has(role));
}

function mapProfile(row) {
  const mapped = crmService.mapUserProfile(row);
  if (!mapped) return null;
  return {
    ...mapped,
    name: mapped.fullName,
    mobile: read(row, "mobile", "mobile", mapped.phone || ""),
    userType: read(row, "user_type", "userType", mapped.clientType === "b2b" ? "client" : "student"),
    role: read(row, "role", "role", mapped.clientType === "b2b" ? "client_consultant" : "student"),
    createdBy: read(row, "created_by", "createdBy", ""),
    commissionVisibilityEnabled: read(row, "commission_visibility_enabled", "commissionVisibilityEnabled", false),
    metadata: row?.metadata || {}
  };
}

function mapReferencePartner(row = {}) {
  if (!row) return null;
  return {
    id: row.id,
    profileUserId: read(row, "profile_user_id", "profileUserId", ""),
    referenceType: read(row, "reference_type", "referenceType", ""),
    role: read(row, "reference_type", "referenceType", ""),
    name: row.name || "",
    email: row.email || "",
    mobile: row.mobile || "",
    companyName: read(row, "company_name", "companyName", ""),
    contactPerson: read(row, "contact_person", "contactPerson", ""),
    commissionDefaultPercentage: Number(read(row, "commission_default_percentage", "commissionDefaultPercentage", 0) || 0),
    commissionVisibilityEnabled: read(row, "commission_visibility_enabled", "commissionVisibilityEnabled", false),
    commissionType: read(row, "commission_type", "commissionType", "percentage"),
    commissionFixedAmount: Number(read(row, "commission_fixed_amount", "commissionFixedAmount", 0) || 0),
    city: row.city || "",
    state: row.state || "",
    officeAddress: read(row, "office_address", "officeAddress", ""),
    website: row.website || "",
    gstNumber: read(row, "gst_number", "gstNumber", ""),
    agreementStatus: read(row, "agreement_status", "agreementStatus", ""),
    sourceUrl: read(row, "source_url", "sourceUrl", ""),
    linkedEmployeeId: read(row, "linked_employee_id", "linkedEmployeeId", ""),
    incentiveAmount: Number(read(row, "incentive_amount", "incentiveAmount", 5000) || 0),
    incentiveStatus: read(row, "incentive_status", "incentiveStatus", "due"),
    bankAccountName: read(row, "bank_account_name", "bankAccountName", ""),
    bankAccountNumber: read(row, "bank_account_number", "bankAccountNumber", ""),
    bankIfsc: read(row, "bank_ifsc", "bankIfsc", ""),
    upiId: read(row, "upi_id", "upiId", ""),
    notes: row.notes || "",
    metadata: row.metadata || {},
    status: row.status || "active",
    createdAt: read(row, "created_at", "createdAt"),
    updatedAt: read(row, "updated_at", "updatedAt")
  };
}

function mapApplication(row = {}) {
  const legacy = crmService.mapApplication(row) || {};
  return {
    ...legacy,
    studentName: read(row, "student_name", "studentName", legacy.customerName || ""),
    studentEmail: read(row, "student_email", "studentEmail", legacy.customerEmail || ""),
    studentMobile: read(row, "student_mobile", "studentMobile", legacy.customerPhone || ""),
    universityApplied: read(row, "university_applied", "universityApplied", ""),
    course: row.course || "",
    loanAmount: Number(read(row, "loan_amount", "loanAmount", legacy.loanAmountRequired || 0) || 0),
    country: read(row, "country", "country", ""),
    universityAppliedFor: read(row, "university_applied_for", "universityAppliedFor", read(row, "university_applied", "universityApplied", "")),
    loanAmountNeeded: Number(read(row, "loan_amount_needed", "loanAmountNeeded", read(row, "loan_amount", "loanAmount", legacy.loanAmountRequired || 0)) || 0),
    loanAmountSanctioned: Number(read(row, "loan_amount_sanctioned", "loanAmountSanctioned", read(row, "sanctioned_amount", "sanctionedAmount", legacy.loanAmountApproved || 0)) || 0),
    loanAmountDisbursed: Number(read(row, "loan_amount_disbursed", "loanAmountDisbursed", read(row, "disbursed_amount", "disbursedAmount", 0)) || 0),
    bankApplied: read(row, "bank_applied", "bankApplied", legacy.bankName || ""),
    consultantClientId: read(row, "consultant_client_id", "consultantClientId", ""),
    referenceSourceType: read(row, "reference_source_type", "referenceSourceType", legacy.clientType === "b2b" ? "client_consultant" : ""),
    referencePartnerId: read(row, "reference_partner_id", "referencePartnerId", ""),
    clientId: read(row, "client_id", "clientId", read(row, "reference_partner_id", "referencePartnerId", "")),
    leadSourceType: read(row, "lead_source_type", "leadSourceType", read(row, "reference_source_type", "referenceSourceType", "")),
    referenceOwnerId: read(row, "reference_owner_id", "referenceOwnerId", read(row, "reference_partner_id", "referencePartnerId", "")),
    linkedEmployeeId: read(row, "linked_employee_id", "linkedEmployeeId", ""),
    assignedEmployeeId: read(row, "assigned_employee_id", "assignedEmployeeId", legacy.assignedTo || ""),
    createdBy: read(row, "created_by", "createdBy", ""),
    studentVisibleStatus: read(row, "student_visible_status", "studentVisibleStatus", read(row, "status", "status", legacy.applicationStatus || "new_user")),
    status: read(row, "status", "status", legacy.applicationStatus || "new_user"),
    interestedStatus: read(row, "interested_status", "interestedStatus", ""),
    documentsStatus: read(row, "documents_status", "documentsStatus", legacy.documentStatus || ""),
    loanLoginStatus: read(row, "loan_login_status", "loanLoginStatus", ""),
    verificationStatus: read(row, "verification_status", "verificationStatus", ""),
    sanctionedAmount: Number(read(row, "sanctioned_amount", "sanctionedAmount", legacy.loanAmountApproved || 0) || 0),
    sanctionRejectionReason: read(row, "sanction_rejection_reason", "sanctionRejectionReason", ""),
    disbursedAmount: Number(read(row, "disbursed_amount", "disbursedAmount", 0) || 0),
    disbursementRejectionReason: read(row, "disbursement_rejection_reason", "disbursementRejectionReason", ""),
    closedStatus: read(row, "closed_status", "closedStatus", "")
  };
}

function mapCommission(row = {}) {
  if (!row) return null;
  return {
    id: row.id,
    applicationId: read(row, "application_id", "applicationId", ""),
    referencePartnerId: read(row, "reference_partner_id", "referencePartnerId", ""),
    clientId: read(row, "client_id", "clientId", read(row, "reference_partner_id", "referencePartnerId", "")),
    leadId: read(row, "lead_id", "leadId", read(row, "application_id", "applicationId", "")),
    commissionPercentage: Number(read(row, "commission_percentage", "commissionPercentage", 0) || 0),
    commissionBaseType: read(row, "commission_base_type", "commissionBaseType", "not_applicable"),
    commissionBaseAmount: Number(read(row, "commission_base_amount", "commissionBaseAmount", 0) || 0),
    commissionAmount: Number(read(row, "commission_amount", "commissionAmount", 0) || 0),
    commissionType: read(row, "commission_type", "commissionType", "percentage"),
    commissionFixedAmount: Number(read(row, "commission_fixed_amount", "commissionFixedAmount", 0) || 0),
    commissionEarned: Number(read(row, "commission_earned", "commissionEarned", read(row, "commission_amount", "commissionAmount", 0)) || 0),
    commissionDue: Number(read(row, "commission_due", "commissionDue", 0) || 0),
    commissionPaid: Number(read(row, "commission_paid", "commissionPaid", 0) || 0),
    commissionPaymentDate: read(row, "commission_payment_date", "commissionPaymentDate", read(row, "paid_date", "paidDate", "")),
    commissionStatus: read(row, "commission_status", "commissionStatus", "not_applicable"),
    paidDate: read(row, "paid_date", "paidDate", ""),
    paymentReference: read(row, "payment_reference", "paymentReference", ""),
    commissionNotes: read(row, "commission_notes", "commissionNotes", ""),
    manualOverride: read(row, "manual_override", "manualOverride", false),
    createdAt: read(row, "created_at", "createdAt"),
    updatedAt: read(row, "updated_at", "updatedAt")
  };
}

function mapDailyUpdate(row = {}) {
  if (!row) return null;
  return {
    id: row.id,
    employeeId: read(row, "employee_id", "employeeId", ""),
    employeeName: read(row, "employee_name", "employeeName", ""),
    workDate: read(row, "work_date", "workDate", ""),
    totalLeadsHandled: Number(read(row, "total_leads_handled", "totalLeadsHandled", 0) || 0),
    newLeadsContacted: Number(read(row, "new_leads_contacted", "newLeadsContacted", 0) || 0),
    followupsDone: Number(read(row, "followups_done", "followupsDone", 0) || 0),
    documentsCollected: Number(read(row, "documents_collected", "documentsCollected", 0) || 0),
    bankLoginsDone: Number(read(row, "bank_logins_done", "bankLoginsDone", 0) || 0),
    filesApproved: Number(read(row, "files_approved", "filesApproved", 0) || 0),
    filesRejected: Number(read(row, "files_rejected", "filesRejected", read(row, "rejected_count", "rejectedCount", 0)) || 0),
    rejectionReason: read(row, "rejection_reason", "rejectionReason", ""),
    verificationUpdates: Number(read(row, "verification_updates", "verificationUpdates", 0) || 0),
    sanctionUpdates: Number(read(row, "sanction_updates", "sanctionUpdates", 0) || 0),
    disbursementUpdates: Number(read(row, "disbursement_updates", "disbursementUpdates", 0) || 0),
    rejectedCount: Number(read(row, "rejected_count", "rejectedCount", 0) || 0),
    notInterestedCount: Number(read(row, "not_interested_count", "notInterestedCount", 0) || 0),
    pendingIssues: read(row, "pending_issues", "pendingIssues", ""),
    tomorrowPlan: read(row, "tomorrow_plan", "tomorrowPlan", ""),
    remarks: row.remarks || "",
    submittedBy: read(row, "submitted_by", "submittedBy", read(row, "employee_id", "employeeId", "")),
    submittedAt: read(row, "submitted_at", "submittedAt", ""),
    createdAt: read(row, "created_at", "createdAt"),
    updatedAt: read(row, "updated_at", "updatedAt")
  };
}

function mapIncome(row = {}) {
  if (!row) return null;
  const serviceCharge = Number(read(row, "service_charge", "serviceCharge", 0) || 0);
  const commissionReceived = Number(read(row, "commission_received", "commissionReceived", 0) || 0);
  const otherIncome = Number(read(row, "other_income", "otherIncome", 0) || 0);
  const partnerCommissionPaid = Number(read(row, "partner_commission_paid", "partnerCommissionPaid", 0) || 0);
  const employeeIncentive = Number(read(row, "employee_incentive", "employeeIncentive", 0) || 0);
  const otherExpense = Number(read(row, "other_expense", "otherExpense", 0) || 0);
  return {
    id: row.id,
    applicationId: read(row, "application_id", "applicationId", ""),
    incomeType: read(row, "income_type", "incomeType", ""),
    serviceCharge,
    commissionReceived,
    otherIncome,
    partnerCommissionPayable: Number(read(row, "partner_commission_payable", "partnerCommissionPayable", 0) || 0),
    partnerCommissionPaid,
    employeeIncentive,
    otherExpense,
    grossIncome: Number(read(row, "gross_income", "grossIncome", serviceCharge + commissionReceived + otherIncome) || 0),
    netIncome: Number(read(row, "net_income", "netIncome", serviceCharge + commissionReceived + otherIncome - partnerCommissionPaid - employeeIncentive - otherExpense) || 0),
    paymentStatus: read(row, "payment_status", "paymentStatus", "pending"),
    receivedDate: read(row, "received_date", "receivedDate", ""),
    notes: row.notes || ""
  };
}

function statusLabel(application) {
  return application.status || application.applicationStatus || application.workflowStage || "new_user";
}

function studentView(application) {
  if (!application) return null;
  return {
    id: application.id,
    applicationId: application.applicationId,
    name: application.studentName || application.customerName,
    clientName: application.clientName || application.referencePartnerName || application.consultantClient || "",
    email: application.studentEmail || application.customerEmail,
    mobile: application.studentMobile || application.customerPhone,
    universityApplied: application.universityAppliedFor || application.universityApplied,
    country: application.country || "",
    loanAmountNeeded: application.loanAmountNeeded || application.loanAmount || application.loanAmountRequired || 0,
    loanAmountSanctioned: application.loanAmountSanctioned || application.sanctionedAmount || application.loanAmountApproved || 0,
    status: application.studentVisibleStatus || statusLabel(application),
    createdAt: application.createdAt,
    updatedAt: application.updatedAt
  };
}

function employeeView(application) {
  if (!application) return null;
  return {
    id: application.id,
    applicationId: application.applicationId,
    name: application.studentName || application.customerName,
    mobile: application.studentMobile || application.customerPhone,
    email: application.studentEmail || application.customerEmail,
    universityApplied: application.universityAppliedFor || application.universityApplied,
    country: application.country || "",
    course: application.course,
    loanAmount: application.loanAmountNeeded || application.loanAmount || application.loanAmountRequired,
    bankApplied: application.bankApplied || application.bankName,
    consultantClientName: application.assignedAdminName || "",
    clientId: application.clientId || application.referencePartnerId || "",
    referencePartnerId: application.referencePartnerId,
    leadSourceType: application.leadSourceType || application.referenceSourceType || "",
    linkedEmployeeId: application.linkedEmployeeId || "",
    status: statusLabel(application),
    interestedStatus: application.interestedStatus,
    documentsStatus: application.documentsStatus || application.documentStatus,
    loanLoginStatus: application.loanLoginStatus,
    verificationStatus: application.verificationStatus,
    sanctionStatus: application.sanctionStatus,
    sanctionedAmount: application.sanctionedAmount || application.loanAmountApproved,
    sanctionRejectionReason: application.sanctionRejectionReason,
    disbursementStatus: application.disbursementStatus,
    disbursedAmount: application.disbursedAmount,
    disbursementRejectionReason: application.disbursementRejectionReason,
    nextFollowupDate: application.nextFollowupDate,
    priority: application.priority,
    updatedAt: application.updatedAt
  };
}

function clientView(application, commission = null, showCommission = false) {
  const base = {
    ...employeeView(application),
    bankApplied: application?.bankApplied || application?.bankName || ""
  };
  if (!showCommission) {
    return {
      ...base,
      commissionVisible: false,
      commissionStatus: application?.referenceSourceType === "own_self" ? "not_applicable" : "hidden"
    };
  }
  return {
    ...base,
    commissionVisible: true,
    commissionPercentage: commission?.commissionPercentage || 0,
    commissionAmount: commission?.commissionAmount || 0,
    commissionStatus: commission?.commissionStatus || "not_applicable",
    commissionNotes: commission?.commissionNotes || ""
  };
}

async function upsertSmartProfile(profile) {
  if (env.mockDatabaseMode) {
    const existing = mockDb.findRecord("userProfiles", (item) => normalizeEmail(item.email) === normalizeEmail(profile.email));
    const payload = {
      authUserId: profile.authUserId,
      fullName: profile.name,
      email: normalizeEmail(profile.email),
      phone: normalizePhone(profile.mobile) || profile.mobile || "",
      mobile: normalizePhone(profile.mobile) || profile.mobile || "",
      clientType: profile.userType === "client" ? "b2b" : "regular",
      userType: profile.userType,
      role: profile.role,
      status: profile.status,
      createdBy: profile.createdBy || "",
      commissionVisibilityEnabled: profile.commissionVisibilityEnabled,
      metadata: profile.metadata || {}
    };
    return mapProfile(existing
      ? mockDb.updateRecord("userProfiles", (item) => item.id === existing.id, payload)
      : mockDb.createRecord("userProfiles", payload));
  }

  const row = {
    auth_user_id: profile.authUserId,
    full_name: profile.name,
    email: normalizeEmail(profile.email),
    phone: normalizePhone(profile.mobile) || profile.mobile || "",
    mobile: normalizePhone(profile.mobile) || profile.mobile || "",
    client_type: profile.userType === "client" ? "b2b" : "regular",
    user_type: profile.userType,
    role: profile.role,
    status: profile.status,
    created_by: profile.createdBy || null,
    commission_visibility_enabled: profile.commissionVisibilityEnabled,
    metadata: profile.metadata || {}
  };

  const { data, error } = await serviceSupabase
    .from("user_profiles")
    .upsert(row, { onConflict: "email" })
    .select("*")
    .single();

  if (error) throw dbError("Failed to save SmartCRM profile", error);
  return mapProfile(data);
}

async function ensureAdminProfileForSmartRole({ authUserId, name, email, mobile, role, status }) {
  if (!["super_admin", "admin", "ceo", "board", "board_member"].includes(role)) return null;
  const adminRole = role === "ceo" ? "ceo" : role;
  if (env.mockDatabaseMode) {
    const existing = mockDb.findRecord("adminProfiles", (item) => normalizeEmail(item.email) === normalizeEmail(email));
    const payload = {
      authUserId,
      fullName: name,
      email: normalizeEmail(email),
      phone: mobile || "",
      role: adminRole,
      status: status === "active" ? "active" : "inactive"
    };
    return existing
      ? mockDb.updateRecord("adminProfiles", (item) => item.id === existing.id, payload)
      : mockDb.createRecord("adminProfiles", payload);
  }

  const { data, error } = await serviceSupabase
    .from("admin_profiles")
    .upsert({
      auth_user_id: authUserId,
      full_name: name,
      email: normalizeEmail(email),
      phone: mobile || null,
      role: adminRole,
      status: status === "active" ? "active" : "inactive"
    }, { onConflict: "email" })
    .select("*")
    .single();

  if (error) throw dbError("Failed to save admin profile for SmartCRM user", error);
  return data;
}

async function upsertReferencePartner(profile, payload) {
  if (!payload.userType || payload.userType !== "client") return null;
  const profileUserId = profile?.id || null;
  const partnerPayload = {
    profileUserId,
    referenceType: payload.role,
    name: payload.name,
    email: normalizeEmail(payload.email),
    mobile: payload.mobile || "",
    companyName: payload.companyName || "",
    contactPerson: payload.contactPerson || payload.name,
    commissionDefaultPercentage: payload.commissionDefaultPercentage || 0,
    commissionVisibilityEnabled: payload.commissionVisibilityEnabled,
    commissionType: payload.commissionType || "percentage",
    commissionFixedAmount: payload.commissionFixedAmount || 0,
    city: payload.city || "",
    state: payload.state || "",
    officeAddress: payload.officeAddress || "",
    website: payload.website || "",
    gstNumber: payload.gstNumber || "",
    agreementStatus: payload.agreementStatus || "",
    sourceUrl: payload.sourceUrl || "",
    linkedEmployeeId: payload.linkedEmployeeId || "",
    incentiveAmount: payload.role === "employee_reference" ? 5000 : 0,
    incentiveStatus: payload.role === "employee_reference" ? "due" : "not_applicable",
    bankAccountName: payload.bankAccountName || "",
    bankAccountNumber: payload.bankAccountNumber || "",
    bankIfsc: payload.bankIfsc || "",
    upiId: payload.upiId || "",
    notes: payload.notes || "",
    metadata: {
      sourceOnly: Boolean(payload.sourceOnly),
      createdFromUsersModule: true
    },
    status: payload.status
  };

  if (env.mockDatabaseMode) {
    const existing = profileUserId
      ? mockDb.findRecord("referencePartners", (item) => item.profileUserId === profileUserId)
      : null;
    return mapReferencePartner(existing
      ? mockDb.updateRecord("referencePartners", (item) => item.id === existing.id, partnerPayload)
      : mockDb.createRecord("referencePartners", partnerPayload));
  }

  const row = {
    profile_user_id: profileUserId,
    reference_type: payload.role,
    name: payload.name,
    email: normalizeEmail(payload.email) || null,
    mobile: payload.mobile || null,
    company_name: payload.companyName || null,
    contact_person: payload.contactPerson || payload.name,
    commission_default_percentage: payload.commissionDefaultPercentage || 0,
    commission_visibility_enabled: payload.commissionVisibilityEnabled,
    commission_type: payload.commissionType || "percentage",
    commission_fixed_amount: payload.commissionFixedAmount || 0,
    city: payload.city || null,
    state: payload.state || null,
    office_address: payload.officeAddress || null,
    website: payload.website || null,
    gst_number: payload.gstNumber || null,
    agreement_status: payload.agreementStatus || null,
    source_url: payload.sourceUrl || null,
    linked_employee_id: payload.linkedEmployeeId || null,
    incentive_amount: payload.role === "employee_reference" ? 5000 : 0,
    incentive_status: payload.role === "employee_reference" ? "due" : "not_applicable",
    bank_account_name: payload.bankAccountName || null,
    bank_account_number: payload.bankAccountNumber || null,
    bank_ifsc: payload.bankIfsc || null,
    upi_id: payload.upiId || null,
    notes: payload.notes || null,
    metadata: {
      sourceOnly: Boolean(payload.sourceOnly),
      createdFromUsersModule: true
    },
    status: payload.status
  };
  const writer = profileUserId
    ? serviceSupabase.from("reference_partners").upsert(row, { onConflict: "profile_user_id" })
    : serviceSupabase.from("reference_partners").insert(row);
  const { data, error } = await writer
    .select("*")
    .single();

  if (error) throw dbError("Failed to save reference partner", error);
  return mapReferencePartner(data);
}

async function findReferencePartnerById(id) {
  if (!id) return null;
  if (env.mockDatabaseMode) {
    return mapReferencePartner(mockDb.findRecord("referencePartners", (item) => item.id === id));
  }
  const { data, error } = await serviceSupabase
    .from("reference_partners")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw dbError("Failed to load reference partner", error);
  return mapReferencePartner(data);
}

async function createApplicationCommission(application, partner) {
  if (!application || !partner || !canSeeCommission(partner)) return null;
  if (partner.referenceType === "own_self" || partner.referenceType === "employee_reference") return null;
  const baseType = partner.commissionType === "fixed" ? "fixed_amount" : "sanctioned_amount";
  const baseAmount = baseType === "fixed_amount"
    ? partner.commissionFixedAmount
    : application.loanAmountSanctioned || application.sanctionedAmount || application.loanAmountApproved || 0;
  const commissionAmount = baseType === "fixed_amount"
    ? Number(partner.commissionFixedAmount || 0)
    : (Number(baseAmount || 0) * Number(partner.commissionDefaultPercentage || 0) / 100);
  const row = {
    applicationId: application.id,
    referencePartnerId: partner.id,
    clientId: partner.id,
    leadId: application.id,
    commissionPercentage: partner.commissionDefaultPercentage || 0,
    commissionBaseType: baseType,
    commissionBaseAmount: baseAmount || 0,
    commissionAmount,
    commissionType: partner.commissionType || "percentage",
    commissionFixedAmount: partner.commissionFixedAmount || 0,
    commissionEarned: commissionAmount,
    commissionDue: commissionAmount,
    commissionPaid: 0,
    commissionStatus: commissionAmount ? "due" : "not_applicable",
    manualOverride: false
  };
  if (env.mockDatabaseMode) {
    return mapCommission(mockDb.createRecord("applicationCommissions", row));
  }
  const { data, error } = await serviceSupabase
    .from("application_commissions")
    .insert({
      application_id: row.applicationId,
      reference_partner_id: row.referencePartnerId,
      client_id: row.clientId,
      lead_id: row.leadId,
      commission_percentage: row.commissionPercentage,
      commission_base_type: row.commissionBaseType,
      commission_base_amount: row.commissionBaseAmount,
      commission_amount: row.commissionAmount,
      commission_type: row.commissionType,
      commission_fixed_amount: row.commissionFixedAmount,
      commission_earned: row.commissionEarned,
      commission_due: row.commissionDue,
      commission_paid: row.commissionPaid,
      commission_status: row.commissionStatus,
      manual_override: row.manualOverride
    })
    .select("*")
    .single();
  if (error) throw dbError("Failed to create application commission", error);
  return mapCommission(data);
}

async function createEmployeeIncentive(application, employeeId, partnerId = null) {
  if (!application || !employeeId) return null;
  const row = {
    employeeId,
    applicationId: application.id,
    referencePartnerId: partnerId,
    incentiveAmount: 5000,
    incentiveStatus: "due",
    notes: "Employee reference incentive"
  };
  if (env.mockDatabaseMode) {
    return mockDb.createRecord("employeeIncentives", row);
  }
  const { data, error } = await serviceSupabase
    .from("employee_incentives")
    .insert({
      employee_id: employeeId,
      application_id: application.id,
      reference_partner_id: partnerId,
      incentive_amount: 5000,
      incentive_status: "due",
      notes: "Employee reference incentive"
    })
    .select("*")
    .single();
  if (error) throw dbError("Failed to create employee incentive", error);
  return data;
}

async function createAuthUser(payload) {
  if (env.mockDatabaseMode) {
    return {
      id: `mock-smartcrm-${crypto.randomUUID()}`,
      email: normalizeEmail(payload.email)
    };
  }

  const { data, error } = await supabaseAdminClient.auth.admin.createUser({
    email: normalizeEmail(payload.email),
    password: payload.temporaryPassword,
    email_confirm: true,
    user_metadata: {
      full_name: payload.name,
      phone: payload.mobile,
      user_type: payload.userType,
      role: payload.role,
      created_from: "admin_dashboard"
    }
  });

  if (error || !data?.user?.id) {
    const message = String(error?.message || "").toLowerCase();
    if (message.includes("already") || message.includes("registered")) {
      throw new AppError("An auth user already exists with this email.", 409, "AUTH_USER_ALREADY_EXISTS");
    }
    throw new AppError(error?.message || "Unable to create auth user", 400, "AUTH_USER_CREATE_FAILED");
  }
  return data.user;
}

async function createSmartCrmUser(admin, payload) {
  assertAdminCanWrite(admin);
  const authUser = payload.sourceOnly ? null : await createAuthUser(payload);
  const profile = authUser ? await upsertSmartProfile({
    ...payload,
    authUserId: authUser.id,
    createdBy: admin.id,
    metadata: {
      adminCreated: true,
      temporaryPasswordIssued: Boolean(payload.temporaryPassword),
      requestedUserType: payload.requestedUserType || payload.userType,
      designation: payload.designation || "",
      department: payload.department || "",
      accessLevel: payload.accessLevel || "",
      notes: payload.notes || ""
    }
  }) : null;
  const adminProfile = authUser ? await ensureAdminProfileForSmartRole({
    authUserId: authUser.id,
    name: payload.name,
    email: payload.email,
    mobile: payload.mobile,
    role: payload.role,
    status: payload.status
  }) : null;
  const referencePartner = await upsertReferencePartner(profile, payload);
  const selectedPartner = payload.studentApplication?.referenceOwnerId
    ? await findReferencePartnerById(payload.studentApplication.referenceOwnerId)
    : null;
  const studentReferencePartner = selectedPartner || referencePartner;
  const leadSourceType = payload.studentApplication?.leadSourceType || studentReferencePartner?.referenceType || "";
  const linkedEmployeeId = payload.studentApplication?.linkedEmployeeId ||
    payload.studentApplication?.assignedEmployeeId ||
    studentReferencePartner?.linkedEmployeeId ||
    "";
  const assignedEmployee = payload.studentApplication?.assignedEmployeeId
    ? await crmService.findUserProfileById(payload.studentApplication.assignedEmployeeId)
    : null;
  const studentApplication = payload.userType === "student" && profile
    ? await crmService.createApplicationForUser(profile, {
      service: "Education Loan",
      applicationStatus: payload.studentApplication?.status || "new_user",
      workflowStage: payload.studentApplication?.status || "new_user",
      status: payload.studentApplication?.status || "new_user",
      studentVisibleStatus: payload.studentApplication?.status || "new_user",
      studentName: payload.name,
      studentEmail: payload.email,
      studentMobile: payload.mobile,
      universityApplied: payload.studentApplication?.universityApplied || "",
      universityAppliedFor: payload.studentApplication?.universityApplied || "",
      country: payload.studentApplication?.country || "",
      course: payload.studentApplication?.course || "",
      loanAmount: payload.studentApplication?.loanAmount || null,
      loanAmountRequired: payload.studentApplication?.loanAmount || null,
      loanAmountNeeded: payload.studentApplication?.loanAmountNeeded || payload.studentApplication?.loanAmount || null,
      loanAmountApproved: payload.studentApplication?.loanAmountSanctioned || null,
      loanAmountSanctioned: payload.studentApplication?.loanAmountSanctioned || null,
      assignedAdminName: assignedEmployee?.fullName || assignedEmployee?.name || payload.studentApplication?.consultantClient || studentReferencePartner?.name || "",
      consultantClientId: studentReferencePartner?.profileUserId || null,
      referencePartnerId: studentReferencePartner?.id || null,
      referenceSourceType: leadSourceType || null,
      clientId: studentReferencePartner?.id || null,
      referenceOwnerId: studentReferencePartner?.id || null,
      leadSourceType: leadSourceType || null,
      assignedEmployeeId: payload.studentApplication?.assignedEmployeeId || null,
      assignedTo: payload.studentApplication?.assignedEmployeeId || null,
      linkedEmployeeId: linkedEmployeeId || null,
      createdBy: admin.id,
      metadata: {
        sourceOwnerName: studentReferencePartner?.name || "",
        sourceOwnerType: leadSourceType || "",
        createdFromUsersModule: true
      }
    })
    : null;
  const commission = studentApplication && studentReferencePartner
    ? await createApplicationCommission(studentApplication, studentReferencePartner)
    : null;
  const employeeIncentive = studentApplication && leadSourceType === "employee_reference"
    ? await createEmployeeIncentive(studentApplication, linkedEmployeeId, studentReferencePartner?.id || null)
    : null;

  await adminAuditLogService.createAdminAuditLog({
    adminUserId: admin.id,
    action: "create_smartcrm_user",
    module: "user_profiles",
    recordId: profile?.id || referencePartner?.id || studentApplication?.id || null,
    newValue: {
      profile,
      adminProfileId: adminProfile?.id || null,
      referencePartnerId: referencePartner?.id || null,
      sourcePartnerId: studentReferencePartner?.id || null,
      applicationId: studentApplication?.id || null,
      commissionId: commission?.id || null,
      employeeIncentiveId: employeeIncentive?.id || null
    }
  });

  return {
    profile,
    adminProfile,
    referencePartner,
    application: studentApplication,
    commission,
    employeeIncentive,
    redirectTo: profile ? getRedirectForProfile(profile) : "admin-users.html?mode=view&type=client"
  };
}

async function findReferencePartnerByProfileId(profileId) {
  if (env.mockDatabaseMode) {
    return mapReferencePartner(mockDb.findRecord("referencePartners", (item) => item.profileUserId === profileId));
  }
  const { data, error } = await serviceSupabase
    .from("reference_partners")
    .select("*")
    .eq("profile_user_id", profileId)
    .maybeSingle();
  if (error) throw dbError("Failed to load reference partner", error);
  return mapReferencePartner(data);
}

async function listReferencePartnersRaw(queryParams = {}) {
  if (env.mockDatabaseMode) {
    let rows = mockDb.listRecords("referencePartners").map(mapReferencePartner);
    if (queryParams.referenceType) rows = rows.filter((item) => item.referenceType === queryParams.referenceType);
    if (queryParams.status) rows = rows.filter((item) => item.status === queryParams.status);
    if (queryParams.linkedEmployeeId) rows = rows.filter((item) => item.linkedEmployeeId === queryParams.linkedEmployeeId);
    if (queryParams.search) {
      const needle = String(queryParams.search).toLowerCase();
      rows = rows.filter((item) => [item.name, item.email, item.mobile, item.companyName].some((value) => String(value || "").toLowerCase().includes(needle)));
    }
    return rows;
  }
  let query = serviceSupabase
    .from("reference_partners")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(Math.min(Math.max(Number(queryParams.limit) || 1000, 1), 1000));
  if (queryParams.referenceType) query = query.eq("reference_type", queryParams.referenceType);
  if (queryParams.status) query = query.eq("status", queryParams.status);
  if (queryParams.linkedEmployeeId) query = query.eq("linked_employee_id", queryParams.linkedEmployeeId);
  if (queryParams.search) {
    const term = String(queryParams.search).replace(/[%_,]/g, "");
    query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%,mobile.ilike.%${term}%,company_name.ilike.%${term}%`);
  }
  const { data, error } = await query;
  if (error) throw dbError("Failed to list reference partners", error);
  return (data || []).map(mapReferencePartner);
}

async function listApplicationsRaw(queryParams = {}) {
  const limit = Math.min(Math.max(Number(queryParams.limit) || 500, 1), 1000);
  if (env.mockDatabaseMode) {
    let rows = mockDb
      .listRecords("crmApplications")
      .map(mapApplication)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
    if (queryParams.assignedEmployeeId) rows = rows.filter((item) => item.assignedEmployeeId === queryParams.assignedEmployeeId || item.assignedTo === queryParams.assignedEmployeeId);
    if (queryParams.referencePartnerId) rows = rows.filter((item) => item.referencePartnerId === queryParams.referencePartnerId);
    if (queryParams.clientId) rows = rows.filter((item) => item.clientId === queryParams.clientId || item.referencePartnerId === queryParams.clientId);
    if (queryParams.linkedEmployeeId) rows = rows.filter((item) => item.linkedEmployeeId === queryParams.linkedEmployeeId);
    if (queryParams.userProfileId) rows = rows.filter((item) => item.userProfileId === queryParams.userProfileId);
    return rows.slice(0, limit);
  }

  let query = serviceSupabase
    .from("crm_applications")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (queryParams.assignedEmployeeId) {
    query = query.or(`assigned_employee_id.eq.${queryParams.assignedEmployeeId},assigned_to.eq.${queryParams.assignedEmployeeId}`);
  }
  if (queryParams.referencePartnerId) query = query.eq("reference_partner_id", queryParams.referencePartnerId);
  if (queryParams.clientId) query = query.or(`client_id.eq.${queryParams.clientId},reference_partner_id.eq.${queryParams.clientId}`);
  if (queryParams.linkedEmployeeId) query = query.eq("linked_employee_id", queryParams.linkedEmployeeId);
  if (queryParams.userProfileId) query = query.eq("user_profile_id", queryParams.userProfileId);
  const { data, error } = await query;
  if (error) throw dbError("Failed to list SmartCRM applications", error);
  return (data || []).map(mapApplication);
}

async function listCommissionsRaw(queryParams = {}) {
  if (env.mockDatabaseMode) {
    let rows = mockDb.listRecords("applicationCommissions").map(mapCommission);
    if (queryParams.applicationId) rows = rows.filter((item) => item.applicationId === queryParams.applicationId);
    if (queryParams.referencePartnerId) rows = rows.filter((item) => item.referencePartnerId === queryParams.referencePartnerId);
    return rows;
  }

  let query = serviceSupabase.from("application_commissions").select("*").order("created_at", { ascending: false });
  if (queryParams.applicationId) query = query.eq("application_id", queryParams.applicationId);
  if (queryParams.referencePartnerId) query = query.eq("reference_partner_id", queryParams.referencePartnerId);
  const { data, error } = await query;
  if (error) throw dbError("Failed to list commissions", error);
  return (data || []).map(mapCommission);
}

async function listDailyUpdatesRaw(queryParams = {}) {
  if (env.mockDatabaseMode) {
    let rows = mockDb.listRecords("employeeDailyUpdates").map(mapDailyUpdate);
    if (queryParams.employeeId) rows = rows.filter((item) => item.employeeId === queryParams.employeeId);
    if (queryParams.startDate) rows = rows.filter((item) => item.workDate >= queryParams.startDate);
    if (queryParams.endDate) rows = rows.filter((item) => item.workDate <= queryParams.endDate);
    return rows.sort((a, b) => new Date(b.workDate || 0) - new Date(a.workDate || 0));
  }

  let query = serviceSupabase
    .from("employee_daily_updates")
    .select("*")
    .order("work_date", { ascending: false })
    .limit(Math.min(Math.max(Number(queryParams.limit) || 100, 1), 1000));
  if (queryParams.employeeId) query = query.eq("employee_id", queryParams.employeeId);
  if (queryParams.startDate) query = query.gte("work_date", queryParams.startDate);
  if (queryParams.endDate) query = query.lte("work_date", queryParams.endDate);
  const { data, error } = await query;
  if (error) throw dbError("Failed to list employee daily updates", error);
  return (data || []).map(mapDailyUpdate);
}

async function listIncomeRaw() {
  if (env.mockDatabaseMode) return mockDb.listRecords("businessIncomeRecords").map(mapIncome);
  const { data, error } = await serviceSupabase
    .from("business_income_records")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw dbError("Failed to list business income records", error);
  return (data || []).map(mapIncome);
}

async function listProfilesRaw(queryParams = {}) {
  if (env.mockDatabaseMode) {
    let rows = mockDb.listRecords("userProfiles").map(mapProfile);
    if (queryParams.role) rows = rows.filter((item) => item.role === queryParams.role);
    if (queryParams.userType) rows = rows.filter((item) => item.userType === queryParams.userType);
    return rows;
  }
  let query = serviceSupabase.from("user_profiles").select("*").order("created_at", { ascending: false }).limit(1000);
  if (queryParams.role) query = query.eq("role", queryParams.role);
  if (queryParams.userType) query = query.eq("user_type", queryParams.userType);
  const { data, error } = await query;
  if (error) throw dbError("Failed to list user profiles", error);
  return (data || []).map(mapProfile);
}

async function getStudentDashboard(profile) {
  assertUserRole(profile, ["student"]);
  const application = await crmService.findApplicationByUserProfileId(profile.id);
  const mapped = application ? mapApplication(application) : null;
  const partner = mapped?.clientId || mapped?.referencePartnerId
    ? await findReferencePartnerById(mapped.clientId || mapped.referencePartnerId)
    : null;
  if (mapped && partner) {
    mapped.clientName = partner.name;
    mapped.referencePartnerName = partner.name;
  }
  const updates = mapped
    ? await crmService.listUpdates(mapped.id, { audience: "student" })
    : [];
  return {
    user: profile,
    application: studentView(mapped),
    updates: updates || []
  };
}

async function getEmployeeDashboard(profile) {
  assertUserRole(profile, ["employee"]);
  const applications = await listApplicationsRaw({ assignedEmployeeId: profile.id });
  const referenceApplications = await listApplicationsRaw({ linkedEmployeeId: profile.id });
  const dailyUpdates = await listDailyUpdatesRaw({ employeeId: profile.id, limit: 30 });
  const pendingFollowups = applications.filter((item) => item.nextFollowupDate && new Date(item.nextFollowupDate) <= new Date());
  const updatesByApplication = await Promise.all(applications.map(async (application) => {
    const updates = await crmService.listUpdates(application.id, { visibleOnly: false });
    return {
      applicationId: application.id,
      applicationNumber: application.applicationId,
      studentName: application.studentName || application.customerName,
      clientReplies: (updates || []).filter((update) => update.source === "client" || update.createdByRole === "client"),
      employeeUpdates: (updates || []).filter((update) => update.source === "employee" || update.createdByRole === "employee")
    };
  }));
  return {
    user: profile,
    stats: {
      assignedApplications: applications.length,
      referenceApplications: referenceApplications.length,
      pendingFollowups: pendingFollowups.length,
      sanctioned: applications.filter((item) => item.sanctionStatus === "sanctioned" || statusLabel(item) === "sanctioned").length,
      disbursed: applications.filter((item) => item.disbursementStatus === "disbursed" || statusLabel(item) === "disbursed").length
    },
    applications: applications.map(employeeView),
    referenceApplications: referenceApplications.map(employeeView),
    pendingFollowups: pendingFollowups.map(employeeView),
    clientReplies: updatesByApplication.flatMap((item) => item.clientReplies.map((update) => ({
      ...update,
      applicationId: item.applicationId,
      applicationNumber: item.applicationNumber,
      studentName: item.studentName
    }))),
    employeeUpdates: updatesByApplication.flatMap((item) => item.employeeUpdates.map((update) => ({
      ...update,
      applicationId: item.applicationId,
      applicationNumber: item.applicationNumber,
      studentName: item.studentName
    }))),
    dailyUpdates
  };
}

async function getClientDashboard(profile) {
  assertActiveProfile(profile);
  if (!isPartnerRole(profile)) {
    throw new AppError("Client/reference partner role required", 403, "CLIENT_ROLE_REQUIRED");
  }
  const partner = await findReferencePartnerByProfileId(profile.id);
  const applications = partner ? await listApplicationsRaw({ clientId: partner.id }) : [];
  const commissions = partner ? await listCommissionsRaw({ referencePartnerId: partner.id }) : [];
  const commissionByApplication = new Map(commissions.map((item) => [item.applicationId, item]));
  const showCommission = canSeeCommission(profile) && canSeeCommission(partner || profile);
  const summary = {
    totalReferences: applications.length,
    approvedDisbursed: applications.filter((item) => ["approved", "sanctioned", "disbursed"].includes(statusLabel(item)) || item.disbursementStatus === "disbursed").length,
    ongoing: applications.filter((item) => ["new_user", "registered", "verified", "in_progress", "bank_review", "sanction_in_progress", "loan_processing"].includes(statusLabel(item))).length,
    rejected: applications.filter((item) => statusLabel(item) === "rejected").length,
    notInterested: applications.filter((item) => item.interestedStatus === "not_interested").length,
    closed: applications.filter((item) => ["closed", "completed"].includes(statusLabel(item))).length,
    commissionDue: showCommission ? commissions.filter((item) => item.commissionStatus === "due").reduce((sum, item) => sum + item.commissionAmount, 0) : 0,
    commissionPaid: showCommission ? commissions.filter((item) => item.commissionStatus === "paid").reduce((sum, item) => sum + item.commissionAmount, 0) : 0,
    totalCommissionValue: showCommission ? commissions.reduce((sum, item) => sum + item.commissionAmount, 0) : 0
  };
  const updatesByApplication = await Promise.all(applications.map(async (application) => {
    const updates = await crmService.listUpdates(application.id, { audience: "client" });
    return {
      applicationId: application.id,
      applicationNumber: application.applicationId,
      studentName: application.studentName || application.customerName,
      updates: updates || []
    };
  }));
  return {
    user: profile,
    partner,
    summary,
    commissionVisible: showCommission,
    updates: updatesByApplication.flatMap((item) => item.updates.map((update) => ({
      ...update,
      applicationId: item.applicationId,
      applicationNumber: item.applicationNumber,
      studentName: item.studentName
    }))),
    applications: applications.map((item) => clientView(item, commissionByApplication.get(item.id), showCommission))
  };
}

async function addClientReply(profile, applicationId, payload = {}) {
  assertActiveProfile(profile);
  if (!isPartnerRole(profile)) {
    throw new AppError("Client/reference partner role required", 403, "CLIENT_ROLE_REQUIRED");
  }
  const partner = await findReferencePartnerByProfileId(profile.id);
  if (!partner) throw new AppError("Reference partner not found", 404, "REFERENCE_PARTNER_NOT_FOUND");
  const applications = await listApplicationsRaw({ clientId: partner.id, limit: 1000 });
  const application = applications.find((item) => item.id === applicationId || item.applicationId === applicationId);
  if (!application) throw new AppError("Reference not found", 404, "REFERENCE_NOT_FOUND");
  const message = String(payload.message || "").trim();
  if (!message) throw new AppError("Reply message is required", 400, "CLIENT_REPLY_REQUIRED");
  const update = await crmService.addUpdate(application.id, {
    title: "Client Reply",
    message,
    updateType: "message",
    visibleToUser: false,
    clientVisible: true,
    studentVisible: false,
    internalOnly: false,
    parentUpdateId: payload.parentUpdateId || payload.parent_update_id || "",
    source: "client",
    createdByRole: "client"
  });
  return update;
}

async function listAdminClients(queryParams = {}) {
  const clientType = String(queryParams.client_type || queryParams.clientType || queryParams.type || "").trim();
  const referenceType = clientType && !["all", "client"].includes(clientType) ? clientType : "";
  const safeLimit = Math.min(Math.max(Number(queryParams.limit) || 100, 1), 1000);
  const safePage = Math.max(Number(queryParams.page) || 1, 1);
  const [partners, applications, commissions, profiles] = await Promise.all([
    listReferencePartnersRaw({
      referenceType,
      search: queryParams.search,
      status: queryParams.status,
      limit: 1000
    }),
    listApplicationsRaw({ limit: 1000 }),
    listCommissionsRaw(),
    listProfilesRaw()
  ]);
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const enriched = partners.map((partner) => {
    const linkedApplications = applications.filter((item) => (item.clientId || item.referencePartnerId) === partner.id || item.referencePartnerId === partner.id);
    const linkedCommissions = commissions.filter((item) => item.referencePartnerId === partner.id || item.clientId === partner.id);
    const linkedEmployee = partner.linkedEmployeeId ? profileById.get(partner.linkedEmployeeId) : null;
    return {
      ...partner,
      clientType: partner.referenceType,
      linkedEmployeeName: linkedEmployee?.fullName || linkedEmployee?.name || "",
      totalLeads: linkedApplications.length,
      activeLeads: linkedApplications.filter((item) => !["closed", "completed", "rejected"].includes(statusLabel(item))).length,
      commissionDue: sum(linkedCommissions.filter((item) => item.commissionStatus === "due"), (item) => item.commissionAmount),
      commissionPaid: sum(linkedCommissions.filter((item) => item.commissionStatus === "paid"), (item) => item.commissionAmount)
    };
  });
  return {
    clients: enriched.slice((safePage - 1) * safeLimit, safePage * safeLimit),
    total: enriched.length,
    page: safePage,
    limit: safeLimit
  };
}

async function getAdminClientDashboard(clientId) {
  const partner = await findReferencePartnerById(clientId);
  if (!partner) throw new AppError("Client/reference partner not found", 404, "REFERENCE_PARTNER_NOT_FOUND");
  const [applications, commissions] = await Promise.all([
    listApplicationsRaw({ clientId: partner.id, limit: 1000 }),
    listCommissionsRaw({ referencePartnerId: partner.id })
  ]);
  const commissionByApplication = new Map(commissions.map((item) => [item.applicationId, item]));
  const showCommission = canSeeCommission(partner);
  return {
    partner,
    summary: {
      totalReferences: applications.length,
      approvedDisbursed: applications.filter((item) => ["approved", "sanctioned", "disbursed"].includes(statusLabel(item)) || item.disbursementStatus === "disbursed").length,
      ongoing: applications.filter((item) => !["closed", "completed", "rejected"].includes(statusLabel(item))).length,
      rejected: applications.filter((item) => statusLabel(item) === "rejected").length,
      commissionDue: showCommission ? sum(commissions.filter((item) => item.commissionStatus === "due"), (item) => item.commissionAmount) : 0,
      commissionPaid: showCommission ? sum(commissions.filter((item) => item.commissionStatus === "paid"), (item) => item.commissionAmount) : 0
    },
    commissionVisible: showCommission,
    applications: applications.map((item) => clientView(item, commissionByApplication.get(item.id), showCommission))
  };
}

async function getBoardDashboard(profile) {
  assertUserRole(profile, ["board", "board_member"]);
  const report = await getReportsOverview({ role: "board", id: profile.id });
  return {
    ...report,
    user: profile
  };
}

function applicationUpdatesFromEmployeePatch(payload) {
  return {
    ...(payload.status !== undefined ? { application_status: payload.status, workflow_stage: payload.status, status: payload.status } : {}),
    ...(payload.interestedStatus !== undefined ? { interested_status: payload.interestedStatus } : {}),
    ...(payload.documentsStatus !== undefined ? { documents_status: payload.documentsStatus, document_status: payload.documentsStatus } : {}),
    ...(payload.loanLoginStatus !== undefined ? { loan_login_status: payload.loanLoginStatus } : {}),
    ...(payload.verificationStatus !== undefined ? { verification_status: payload.verificationStatus } : {}),
    ...(payload.bankApplied !== undefined ? { bank_applied: payload.bankApplied, bank_name: payload.bankApplied } : {}),
    ...(payload.sanctionStatus !== undefined ? { sanction_status: payload.sanctionStatus } : {}),
    ...(payload.sanctionedAmount !== undefined ? { sanctioned_amount: payload.sanctionedAmount, loan_amount_approved: payload.sanctionedAmount } : {}),
    ...(payload.sanctionRejectionReason !== undefined ? { sanction_rejection_reason: payload.sanctionRejectionReason } : {}),
    ...(payload.disbursementStatus !== undefined ? { disbursement_status: payload.disbursementStatus } : {}),
    ...(payload.disbursedAmount !== undefined ? { disbursed_amount: payload.disbursedAmount } : {}),
    ...(payload.disbursementRejectionReason !== undefined ? { disbursement_rejection_reason: payload.disbursementRejectionReason } : {}),
    ...(payload.nextFollowupDate !== undefined ? { next_followup_date: payload.nextFollowupDate } : {})
  };
}

async function updateAssignedApplication(profile, applicationId, payload) {
  assertUserRole(profile, ["employee"]);
  const existing = await crmService.findApplicationByIdOrApplicationId(applicationId);
  const application = existing ? mapApplication(existing) : null;
  if (!application) throw new AppError("Application not found", 404, "APPLICATION_NOT_FOUND");
  if (application.assignedEmployeeId !== profile.id) {
    throw new AppError("You can update assigned applications only", 403, "APPLICATION_NOT_ASSIGNED");
  }

  const updates = applicationUpdatesFromEmployeePatch(payload);
  let updated;
  if (env.mockDatabaseMode) {
    updated = mapApplication(mockDb.updateRecord("crmApplications", (item) => item.id === application.id, {
      applicationStatus: updates.application_status ?? application.applicationStatus,
      workflowStage: updates.workflow_stage ?? application.workflowStage,
      status: updates.status ?? application.status,
      interestedStatus: updates.interested_status ?? application.interestedStatus,
      documentsStatus: updates.documents_status ?? application.documentsStatus,
      documentStatus: updates.document_status ?? application.documentStatus,
      loanLoginStatus: updates.loan_login_status ?? application.loanLoginStatus,
      verificationStatus: updates.verification_status ?? application.verificationStatus,
      bankApplied: updates.bank_applied ?? application.bankApplied,
      bankName: updates.bank_name ?? application.bankName,
      sanctionStatus: updates.sanction_status ?? application.sanctionStatus,
      sanctionedAmount: updates.sanctioned_amount ?? application.sanctionedAmount,
      loanAmountApproved: updates.loan_amount_approved ?? application.loanAmountApproved,
      sanctionRejectionReason: updates.sanction_rejection_reason ?? application.sanctionRejectionReason,
      disbursementStatus: updates.disbursement_status ?? application.disbursementStatus,
      disbursedAmount: updates.disbursed_amount ?? application.disbursedAmount,
      disbursementRejectionReason: updates.disbursement_rejection_reason ?? application.disbursementRejectionReason,
      nextFollowupDate: updates.next_followup_date ?? application.nextFollowupDate
    }));
  } else {
    const { data, error } = await serviceSupabase
      .from("crm_applications")
      .update(updates)
      .eq("id", application.id)
      .select("*")
      .single();
    if (error) throw dbError("Failed to update assigned application", error);
    updated = mapApplication(data);
  }

  if (payload.note) {
    await createApplicationUpdate({
      applicationId: application.id,
      actorUserId: profile.id,
      title: "Employee Follow-up",
      message: payload.note,
      updateType: "follow_up",
      visibility: "internal"
    });
  }

  return employeeView(updated);
}

async function addEmployeeApplicationUpdate(profile, applicationId, payload = {}) {
  assertUserRole(profile, ["employee"]);
  const existing = await crmService.findApplicationByIdOrApplicationId(applicationId);
  const application = existing ? mapApplication(existing) : null;
  if (!application) throw new AppError("Application not found", 404, "APPLICATION_NOT_FOUND");
  if (application.assignedEmployeeId !== profile.id) {
    throw new AppError("You can update assigned applications only", 403, "APPLICATION_NOT_ASSIGNED");
  }
  return crmService.addUpdate(application.id, {
    ...payload,
    source: "employee",
    createdByRole: "employee",
    internalOnly: Boolean(payload.internalOnly),
    visibleToUser: Boolean(payload.studentVisible || payload.clientVisible)
  });
}

async function createApplicationUpdate({ applicationId, actorUserId, title, message, updateType = "message", visibility = "internal" }) {
  if (env.mockDatabaseMode) {
    return mockDb.createRecord("applicationUpdates", {
      applicationId,
      updatedByUserId: actorUserId,
      updateType,
      title,
      message,
      visibility
    });
  }
  const { data, error } = await serviceSupabase
    .from("application_updates")
    .insert({
      application_id: applicationId,
      updated_by_user_id: actorUserId,
      update_type: updateType,
      title,
      message,
      visibility
    })
    .select("*")
    .single();
  if (error) throw dbError("Failed to create application update", error);
  return data;
}

async function submitDailyUpdate(profile, payload) {
  assertUserRole(profile, ["employee"]);
  if (env.mockDatabaseMode) {
    const existing = mockDb.findRecord("employeeDailyUpdates", (item) => item.employeeId === profile.id && item.workDate === payload.workDate);
    const record = {
      employeeId: profile.id,
      workDate: payload.workDate,
      totalLeadsHandled: payload.totalLeadsHandled,
      newLeadsContacted: payload.newLeadsContacted,
      followupsDone: payload.followupsDone,
      documentsCollected: payload.documentsCollected,
      bankLoginsDone: payload.bankLoginsDone,
      verificationUpdates: payload.verificationUpdates,
      sanctionUpdates: payload.sanctionUpdates,
      disbursementUpdates: payload.disbursementUpdates,
      rejectedCount: payload.rejectedCount,
      notInterestedCount: payload.notInterestedCount,
      pendingIssues: payload.pendingIssues,
      tomorrowPlan: payload.tomorrowPlan,
      remarks: payload.remarks,
      submittedAt: new Date().toISOString()
    };
    return mapDailyUpdate(existing
      ? mockDb.updateRecord("employeeDailyUpdates", (item) => item.id === existing.id, record)
      : mockDb.createRecord("employeeDailyUpdates", record));
  }

  const { data, error } = await serviceSupabase
    .from("employee_daily_updates")
    .upsert({
      employee_id: profile.id,
      work_date: payload.workDate,
      total_leads_handled: payload.totalLeadsHandled,
      new_leads_contacted: payload.newLeadsContacted,
      followups_done: payload.followupsDone,
      documents_collected: payload.documentsCollected,
      bank_logins_done: payload.bankLoginsDone,
      verification_updates: payload.verificationUpdates,
      sanction_updates: payload.sanctionUpdates,
      disbursement_updates: payload.disbursementUpdates,
      rejected_count: payload.rejectedCount,
      not_interested_count: payload.notInterestedCount,
      pending_issues: payload.pendingIssues,
      tomorrow_plan: payload.tomorrowPlan,
      remarks: payload.remarks,
      submitted_at: new Date().toISOString()
    }, { onConflict: "employee_id,work_date" })
    .select("*")
    .single();
  if (error) throw dbError("Failed to submit employee daily update", error);
  return mapDailyUpdate(data);
}

function resolvePerformanceReportRange(query = {}) {
  const now = new Date();
  const reportType = ["daily", "weekly", "monthly"].includes(String(query.reportType || query.type || "").toLowerCase())
    ? String(query.reportType || query.type).toLowerCase()
    : "daily";
  const fallbackYear = now.getUTCFullYear();
  const fallbackMonth = now.getUTCMonth() + 1;

  if (reportType === "monthly") {
    const year = Number(query.year) || fallbackYear;
    const month = Math.min(Math.max(Number(query.month) || fallbackMonth, 1), 12);
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const nextMonthStart = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const endDate = addDays(nextMonthStart, -1);
    return {
      reportType,
      startDate,
      endDate,
      label: `${monthName(month)} ${year}`,
      filenamePart: `month-${monthName(month).toLowerCase()}-${year}`
    };
  }

  if (reportType === "weekly") {
    const year = Number(query.year) || fallbackYear;
    const month = Math.min(Math.max(Number(query.month) || fallbackMonth, 1), 12);
    const week = Math.min(Math.max(Number(query.week) || 1, 1), 5);
    const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
    const nextMonthStart = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const monthEnd = addDays(nextMonthStart, -1);
    const startDate = addDays(monthStart, (week - 1) * 7);
    const requestedEnd = addDays(startDate, 6);
    const endDate = requestedEnd > monthEnd ? monthEnd : requestedEnd;
    return {
      reportType,
      startDate,
      endDate,
      week,
      label: `${monthName(month)} ${year} Week ${week}`,
      filenamePart: `week-${week}-${monthName(month).toLowerCase()}-${year}`
    };
  }

  const selectedDate = dateKey(query.date || query.workDate || businessDateKey());
  return {
    reportType,
    startDate: selectedDate,
    endDate: selectedDate,
    label: formatReportDateLabel(selectedDate),
    filenamePart: `daily-${selectedDate}`
  };
}

function formatReportDateLabel(value) {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
}

async function getEmployeePerformanceReport(actor, query = {}) {
  assertUserRole(actor, ["super_admin", "admin", "ceo"]);
  const range = resolvePerformanceReportRange(query);
  const [updates, profiles] = await Promise.all([
    listDailyUpdatesRaw({
      employeeId: query.employeeId || "",
      startDate: range.startDate,
      endDate: range.endDate,
      limit: 1000
    }),
    listProfilesRaw({ role: "employee" })
  ]);
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const rows = updates.map((update) => {
    const employee = profileById.get(update.employeeId);
    return {
      ...update,
      employeeName: update.employeeName || employee?.fullName || employee?.name || employee?.email || "Employee",
      notes: update.remarks || update.pendingIssues || "",
      filesLoggedIntoBank: update.bankLoginsDone,
      sanctions: update.sanctionUpdates,
      disbursements: update.disbursementUpdates
    };
  }).sort((a, b) => {
    const byDate = String(a.workDate || "").localeCompare(String(b.workDate || ""));
    if (byDate !== 0) return byDate;
    return String(a.employeeName || "").localeCompare(String(b.employeeName || ""));
  });

  return {
    ...range,
    employeeId: query.employeeId || "",
    employees: profiles.map((profile) => ({
      employeeId: profile.id,
      employeeName: profile.fullName || profile.name || profile.email || "Employee"
    })).sort((a, b) => a.employeeName.localeCompare(b.employeeName)),
    rows,
    totals: {
      totalLeadsHandled: sum(rows, (item) => item.totalLeadsHandled),
      newLeadsContacted: sum(rows, (item) => item.newLeadsContacted),
      followupsDone: sum(rows, (item) => item.followupsDone),
      sanctions: sum(rows, (item) => item.sanctions),
      disbursements: sum(rows, (item) => item.disbursements),
      documentsCollected: sum(rows, (item) => item.documentsCollected),
      filesLoggedIntoBank: sum(rows, (item) => item.filesLoggedIntoBank),
      filesApproved: sum(rows, (item) => item.filesApproved),
      filesRejected: sum(rows, (item) => item.filesRejected)
    }
  };
}

function sum(rows, selector) {
  return rows.reduce((total, row) => total + Number(selector(row) || 0), 0);
}

function statusCount(applications, statuses) {
  const set = new Set(statuses);
  return applications.filter((item) => set.has(statusLabel(item)) || set.has(item.sanctionStatus) || set.has(item.disbursementStatus)).length;
}

function groupBy(rows, selector) {
  return rows.reduce((groups, row) => {
    const key = selector(row) || "Unassigned";
    groups.set(key, [...(groups.get(key) || []), row]);
    return groups;
  }, new Map());
}

function calculatePerformanceScore(update, applications = []) {
  const followup = Math.min((update?.followupsDone || 0) * 5, 25);
  const docs = Math.min((update?.documentsCollected || 0) * 5, 20);
  const bank = Math.min((update?.bankLoginsDone || 0) * 5, 15);
  const conversion = Math.min(((update?.sanctionUpdates || 0) + (update?.disbursementUpdates || 0) + statusCount(applications, ["sanctioned", "disbursed"])) * 5, 25);
  const reporting = update ? 15 : 0;
  return Math.min(Math.round(followup + docs + bank + conversion + reporting), 100);
}

async function getReportsOverview(actor = {}) {
  const [applications, profiles, commissions, referencePartners, dailyUpdates, incomeRows] = await Promise.all([
    listApplicationsRaw({ limit: 1000 }),
    listProfilesRaw(),
    listCommissionsRaw(),
    listReferencePartnersRaw(),
    listDailyUpdatesRaw({ limit: 500 }),
    listIncomeRaw()
  ]);

  const todayKey = businessDateKey();
  const employees = profiles.filter((item) => item.role === "employee");
  const dailyToday = dailyUpdates.filter((item) => item.workDate === todayKey);
  const latestDailyByEmployee = new Map();
  dailyUpdates.forEach((update) => {
    if (!latestDailyByEmployee.has(update.employeeId)) {
      latestDailyByEmployee.set(update.employeeId, update);
    }
  });
  const appsByEmployee = groupBy(applications, (item) => item.assignedEmployeeId);
  const employeePerformance = employees.map((employee) => {
    const update = latestDailyByEmployee.get(employee.id);
    const assigned = appsByEmployee.get(employee.id) || [];
    return {
      employeeId: employee.id,
      employeeName: employee.fullName || employee.name,
      leadsHandled: update?.totalLeadsHandled || assigned.length,
      followupsCompleted: update?.followupsDone || 0,
      filesLoggedIntoBank: update?.bankLoginsDone || 0,
      sanctionsAchieved: update?.sanctionUpdates || statusCount(assigned, ["sanctioned"]),
      disbursementsAchieved: update?.disbursementUpdates || statusCount(assigned, ["disbursed"]),
      dailyUpdateSubmitted: Boolean(dailyToday.find((item) => item.employeeId === employee.id)),
      performanceScore: calculatePerformanceScore(update, assigned)
    };
  }).sort((a, b) => b.performanceScore - a.performanceScore);

  const sourcePerformance = Array.from(groupBy(applications, (item) => item.referenceSourceType || item.clientType || "own_self").entries()).map(([source, rows]) => {
    const disbursedValue = sum(rows, (item) => item.disbursedAmount || (item.disbursementStatus === "disbursed" ? item.sanctionedAmount : 0));
    const sourceCommissions = commissions.filter((commission) => rows.some((app) => app.id === commission.applicationId));
    return {
      source,
      totalReferences: rows.length,
      conversionRate: rows.length ? Math.round((statusCount(rows, ["sanctioned", "disbursed"]) / rows.length) * 100) : 0,
      disbursedValue,
      revenueGenerated: sum(incomeRows.filter((income) => rows.some((app) => app.id === income.applicationId)), (item) => item.grossIncome),
      commissionPayable: sum(sourceCommissions, (item) => item.commissionAmount)
    };
  });

  const grossIncome = sum(incomeRows, (item) => item.grossIncome);
  const netIncome = sum(incomeRows, (item) => item.netIncome);
  const partnerById = new Map(referencePartners.map((partner) => [partner.id, partner]));
  const commissionRows = commissions.map((commission) => {
    const partner = partnerById.get(commission.referencePartnerId);
    return {
      ...commission,
      partnerName: partner?.name || commission.referencePartnerId || "",
      partnerType: partner?.referenceType || "not_applicable",
      companyName: partner?.companyName || "",
      paidDate: commission.paidDate || "",
      paymentReference: commission.paymentReference || "",
      notes: commission.commissionNotes || ""
    };
  });
  const commissionDue = sum(commissions.filter((item) => item.commissionStatus === "due"), (item) => item.commissionAmount);
  const commissionPaid = sum(commissions.filter((item) => item.commissionStatus === "paid"), (item) => item.commissionAmount);
  const followupsToday = applications.filter((item) => item.nextFollowupDate === todayKey);
  const staleApplications = applications.filter((item) => {
    const updated = new Date(item.updatedAt || item.createdAt || 0).getTime();
    return updated && Date.now() - updated > 3 * 24 * 60 * 60 * 1000 && !["closed", "completed", "rejected"].includes(statusLabel(item));
  });

  return {
    actorRole: roleOf(actor),
    stats: {
      totalLeads: applications.length,
      ongoingFiles: statusCount(applications, ["new_user", "registered", "verified", "in_progress", "bank_review", "sanction_in_progress", "loan_processing"]),
      sanctioned: statusCount(applications, ["sanctioned"]),
      disbursed: statusCount(applications, ["disbursed"]),
      weeklyIncome: grossIncome,
      monthlyNetIncome: netIncome,
      commissionDue,
      commissionPaid
    },
    employeePerformance,
    dailyUpdateCompliance: {
      submitted: dailyToday.length,
      pending: Math.max(employees.length - dailyToday.length, 0),
      submissionPercentage: employees.length ? Math.round((dailyToday.length / employees.length) * 100) : 100,
      employees: employees.map((employee) => ({
        employeeId: employee.id,
        employeeName: employee.fullName || employee.name,
        submitted: Boolean(dailyToday.find((item) => item.employeeId === employee.id))
      }))
    },
    weeklyBusinessTrend: [
      { label: "Leads", value: applications.length },
      { label: "Sanctions", value: statusCount(applications, ["sanctioned"]) },
      { label: "Disbursements", value: statusCount(applications, ["disbursed"]) }
    ],
    leadFunnel: [
      { label: "New Lead", value: statusCount(applications, ["new_user", "registered"]) },
      { label: "Interested", value: applications.filter((item) => item.interestedStatus !== "not_interested").length },
      { label: "Documents", value: applications.filter((item) => ["received", "verified", "yes"].includes(String(item.documentsStatus || item.documentStatus).toLowerCase())).length },
      { label: "Bank Login", value: applications.filter((item) => item.loanLoginStatus).length },
      { label: "Verification", value: applications.filter((item) => item.verificationStatus).length },
      { label: "Sanctioned", value: statusCount(applications, ["sanctioned"]) },
      { label: "Disbursed", value: statusCount(applications, ["disbursed"]) },
      { label: "Closed", value: statusCount(applications, ["closed", "completed"]) }
    ],
    sourcePerformance,
    commissionAnalytics: {
      totalDue: commissionDue,
      totalPaid: commissionPaid,
      rows: commissionRows
    },
    smartAlerts: [
      `${Math.max(employees.length - dailyToday.length, 0)} employees pending daily update`,
      `Rs. ${commissionDue.toLocaleString("en-IN")} commission due`,
      `${followupsToday.length} follow-ups pending today`,
      `${staleApplications.length} files have no update for 3 days`,
      `${applications.filter((item) => item.sanctionStatus === "sanctioned" && item.disbursementStatus !== "disbursed").length} sanctioned files pending disbursement`
    ],
    revenueSnapshot: {
      grossIncome,
      serviceCharges: sum(incomeRows, (item) => item.serviceCharge),
      commissionReceived: sum(incomeRows, (item) => item.commissionReceived),
      partnerCommissionPayable: sum(incomeRows, (item) => item.partnerCommissionPayable),
      employeeIncentives: sum(incomeRows, (item) => item.employeeIncentive),
      otherExpenses: sum(incomeRows, (item) => item.otherExpense),
      netIncome
    },
    recentCrmUpdates: applications.slice(0, 8).map(employeeView),
    applications: applications.slice(0, 100).map(employeeView)
  };
}

function calculateCommission({ application, commissionPercentage = 0, commissionBaseType = "not_applicable", commissionBaseAmount = 0, commissionAmount, manualOverride = false }) {
  if (manualOverride && commissionAmount !== undefined) return Number(commissionAmount || 0);
  if (commissionBaseType === "sanctioned_amount") {
    return Number(application?.sanctionedAmount || application?.loanAmountApproved || 0) * Number(commissionPercentage || 0) / 100;
  }
  if (commissionBaseType === "disbursed_amount") {
    return Number(application?.disbursedAmount || 0) * Number(commissionPercentage || 0) / 100;
  }
  if (commissionBaseType === "fixed_amount") {
    return Number(commissionBaseAmount || commissionAmount || 0);
  }
  return 0;
}

module.exports = {
  ADMIN_ROLES,
  BOARD_ROLES,
  EMPLOYEE_ROLES,
  PARTNER_ROLES,
  STUDENT_ROLES,
  addClientReply,
  addEmployeeApplicationUpdate,
  assertAdminCanWrite,
  assertUserRole,
  calculateCommission,
  canSeeCommission,
  createSmartCrmUser,
  getAdminClientDashboard,
  getBoardDashboard,
  getClientDashboard,
  getEmployeeDashboard,
  getEmployeePerformanceReport,
  getRedirectForProfile,
  getReportsOverview,
  getStudentDashboard,
  isAdminRole,
  isBoardRole,
  isEmployeeRole,
  isPartnerRole,
  isStudentRole,
  listAdminClients,
  listApplicationsRaw,
  listCommissionsRaw,
  listDailyUpdatesRaw,
  listReferencePartnersRaw,
  mapApplication,
  mapCommission,
  mapDailyUpdate,
  mapProfile,
  roleOf,
  submitDailyUpdate,
  updateAssignedApplication
};
