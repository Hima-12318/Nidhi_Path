const { z } = require("zod");
const { AppError } = require("../middleware/errorMiddleware");
const { normalizeIndianPhone } = require("../utils/phoneUtils");

const userTypes = ["student", "employee", "client", "board"];
const employeeRoles = ["super_admin", "admin", "ceo", "board", "board_member", "employee"];
const clientRoles = ["connector", "client_consultant", "own_self", "online_reference", "banker_reference", "employee_reference"];
const allSmartRoles = ["student", ...employeeRoles, ...clientRoles];
const activeStatuses = ["active", "inactive"];
const profileStatuses = ["pending", "verified", "approved", "active", "inactive", "suspended"];
const commissionBaseTypes = ["sanctioned_amount", "disbursed_amount", "fixed_amount", "not_applicable"];
const commissionStatuses = ["due", "paid", "hold", "not_applicable"];

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

const cleanString = (max = 3000) =>
  z.preprocess(
    (value) => (value === undefined || value === null ? "" : value),
    z.coerce.string().trim().max(max)
  );

const optionalCleanString = (max = 3000) =>
  z.preprocess(
    (value) => {
      if (value === undefined || value === null) return "";
      return typeof value === "string" ? value.trim() : value;
    },
    z.string().max(max).optional().default("")
  );

const emailSchema = cleanString(254)
  .pipe(z.string().email("Please enter a valid email address"))
  .transform((value) => value.toLowerCase());

const mobileSchema = cleanString(40)
  .pipe(z.string().min(1, "Please enter a valid mobile number"))
  .transform((value) => normalizeIndianPhone(value))
  .refine(Boolean, "Please enter a valid mobile number");

const passwordSchema = cleanString(200)
  .pipe(z.string().min(8, "Temporary password must be at least 8 characters"));

const optionalEmailSchema = optionalCleanString(254)
  .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Please enter a valid email address")
  .transform((value) => value.toLowerCase());

const optionalMobileSchema = optionalCleanString(40)
  .refine((value) => !value || Boolean(normalizeIndianPhone(value)), "Please enter a valid mobile number")
  .transform((value) => (value ? normalizeIndianPhone(value) : ""));

const optionalPasswordSchema = optionalCleanString(200)
  .refine((value) => !value || value.length >= 8, "Temporary password must be at least 8 characters");

function toNumber(value, fieldLabel, { integer = false } = {}) {
  if (value === undefined || value === null || value === "") return 0;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${fieldLabel} must be a valid non-negative number`);
  }
  return integer ? Math.floor(number) : number;
}

function optionalDate(value, fieldLabel) {
  if (value === undefined || value === null || value === "") return null;
  const raw = String(value).trim();
  const date = new Date(`${raw}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== raw) {
    throw new Error(`${fieldLabel} must be a valid date`);
  }
  return raw;
}

const createUserSchema = z.object({
  userType: z.enum(userTypes).optional(),
  user_type: z.enum(userTypes).optional(),
  name: cleanString(120).pipe(z.string().min(2, "Name is required")),
  email: optionalEmailSchema,
  mobile: optionalMobileSchema,
  phone: optionalMobileSchema,
  password: optionalPasswordSchema,
  temporaryPassword: optionalPasswordSchema,
  temporary_password: optionalPasswordSchema,
  status: z.enum(activeStatuses).optional().default("active"),
  employeeRole: z.enum(employeeRoles).optional(),
  employee_role: z.enum(employeeRoles).optional(),
  clientCategory: z.enum(clientRoles).optional(),
  client_category: z.enum(clientRoles).optional(),
  commissionVisibilityEnabled: z.boolean().optional(),
  commission_visibility_enabled: z.boolean().optional(),
  companyName: optionalCleanString(160),
  company_name: optionalCleanString(160),
  commissionDefaultPercentage: z.unknown().optional(),
  commission_default_percentage: z.unknown().optional(),
  commissionType: optionalCleanString(40),
  commission_type: optionalCleanString(40),
  commissionFixedAmount: z.unknown().optional(),
  commission_fixed_amount: z.unknown().optional(),
  universityApplied: optionalCleanString(180),
  university_applied: optionalCleanString(180),
  universityAppliedFor: optionalCleanString(180),
  university_applied_for: optionalCleanString(180),
  country: optionalCleanString(120),
  course: optionalCleanString(180),
  loanAmount: z.unknown().optional(),
  loan_amount: z.unknown().optional(),
  loanAmountNeeded: z.unknown().optional(),
  loan_amount_needed: z.unknown().optional(),
  loanAmountSanctioned: z.unknown().optional(),
  loan_amount_sanctioned: z.unknown().optional(),
  consultantClient: optionalCleanString(180),
  consultant_client: optionalCleanString(180),
  clientId: optionalCleanString(80),
  client_id: optionalCleanString(80),
  existingClientId: optionalCleanString(80),
  existing_client_id: optionalCleanString(80),
  referenceOwnerId: optionalCleanString(80),
  reference_owner_id: optionalCleanString(80),
  leadSourceType: z.enum(clientRoles).optional(),
  lead_source_type: z.enum(clientRoles).optional(),
  assignedEmployeeId: optionalCleanString(80),
  assigned_employee_id: optionalCleanString(80),
  linkedEmployeeId: optionalCleanString(80),
  linked_employee_id: optionalCleanString(80),
  studentStatus: optionalCleanString(80),
  student_status: optionalCleanString(80),
  applicationStatus: optionalCleanString(80),
  application_status: optionalCleanString(80),
  contactPerson: optionalCleanString(160),
  contact_person: optionalCleanString(160),
  city: optionalCleanString(120),
  state: optionalCleanString(120),
  officeAddress: optionalCleanString(1000),
  office_address: optionalCleanString(1000),
  website: optionalCleanString(300),
  gstNumber: optionalCleanString(80),
  gst_number: optionalCleanString(80),
  agreementStatus: optionalCleanString(80),
  agreement_status: optionalCleanString(80),
  sourceUrl: optionalCleanString(500),
  source_url: optionalCleanString(500),
  bankAccountName: optionalCleanString(160),
  bank_account_name: optionalCleanString(160),
  bankAccountNumber: optionalCleanString(80),
  bank_account_number: optionalCleanString(80),
  bankIfsc: optionalCleanString(40),
  bank_ifsc: optionalCleanString(40),
  upiId: optionalCleanString(120),
  upi_id: optionalCleanString(120),
  notes: optionalCleanString(2000),
  designation: optionalCleanString(120),
  department: optionalCleanString(120),
  accessLevel: optionalCleanString(80),
  access_level: optionalCleanString(80)
}).transform((value) => {
  const requestedUserType = value.userType || value.user_type || "student";
  const userType = requestedUserType === "board" ? "employee" : requestedUserType;
  let role = "student";
  if (requestedUserType === "board") {
    role = value.employeeRole || value.employee_role || "board_member";
  } else if (userType === "employee") {
    role = value.employeeRole || value.employee_role || "employee";
  }
  if (userType === "client") {
    role = value.clientCategory || value.client_category || "client_consultant";
  }
  const temporaryPassword = value.temporaryPassword || value.temporary_password || value.password || "";
  const referenceOwnerId = value.referenceOwnerId || value.reference_owner_id || value.existingClientId || value.existing_client_id || value.clientId || value.client_id || "";
  const leadSourceType = value.leadSourceType || value.lead_source_type || role;
  const mobile = value.mobile || value.phone || "";
  const commissionType = value.commissionType || value.commission_type || (role === "employee_reference" ? "none" : "percentage");
  const sourceOnly = userType === "client" && (!value.email || !temporaryPassword);
  return {
    requestedUserType,
    userType,
    role,
    name: value.name,
    email: value.email,
    mobile,
    temporaryPassword,
    sourceOnly,
    status: value.status || "active",
    commissionVisibilityEnabled: value.commissionVisibilityEnabled ?? value.commission_visibility_enabled ?? ["connector", "client_consultant"].includes(role),
    companyName: value.companyName || value.company_name || "",
    contactPerson: value.contactPerson || value.contact_person || "",
    commissionType,
    commissionFixedAmount: toNumber(value.commissionFixedAmount ?? value.commission_fixed_amount, "Fixed commission amount"),
    commissionDefaultPercentage: toNumber(value.commissionDefaultPercentage ?? value.commission_default_percentage, "Commission percentage"),
    city: value.city || "",
    state: value.state || "",
    officeAddress: value.officeAddress || value.office_address || "",
    website: value.website || "",
    gstNumber: value.gstNumber || value.gst_number || "",
    agreementStatus: value.agreementStatus || value.agreement_status || "",
    sourceUrl: value.sourceUrl || value.source_url || "",
    linkedEmployeeId: value.linkedEmployeeId || value.linked_employee_id || value.assignedEmployeeId || value.assigned_employee_id || "",
    bankAccountName: value.bankAccountName || value.bank_account_name || "",
    bankAccountNumber: value.bankAccountNumber || value.bank_account_number || "",
    bankIfsc: value.bankIfsc || value.bank_ifsc || "",
    upiId: value.upiId || value.upi_id || "",
    notes: value.notes || "",
    designation: value.designation || "",
    department: value.department || "",
    accessLevel: value.accessLevel || value.access_level || "",
    studentApplication: userType === "student" ? {
      universityApplied: value.universityApplied || value.university_applied || value.universityAppliedFor || value.university_applied_for || "",
      country: value.country || "",
      course: value.course || "",
      loanAmount: toNumber(value.loanAmountNeeded ?? value.loan_amount_needed ?? value.loanAmount ?? value.loan_amount, "Loan amount needed"),
      loanAmountNeeded: toNumber(value.loanAmountNeeded ?? value.loan_amount_needed ?? value.loanAmount ?? value.loan_amount, "Loan amount needed"),
      loanAmountSanctioned: toNumber(value.loanAmountSanctioned ?? value.loan_amount_sanctioned, "Loan amount sanctioned"),
      consultantClient: value.consultantClient || value.consultant_client || "",
      clientId: value.clientId || value.client_id || referenceOwnerId,
      referenceOwnerId,
      leadSourceType,
      assignedEmployeeId: value.assignedEmployeeId || value.assigned_employee_id || "",
      linkedEmployeeId: value.linkedEmployeeId || value.linked_employee_id || value.assignedEmployeeId || value.assigned_employee_id || "",
      status: value.studentStatus || value.student_status || value.applicationStatus || value.application_status || "new_user"
    } : null
  };
}).refine((value) => value.sourceOnly || Boolean(value.email), {
  message: "Email is required for login users",
  path: ["email"]
}).refine((value) => value.sourceOnly || Boolean(value.temporaryPassword), {
  message: "Temporary password is required",
  path: ["temporaryPassword"]
}).refine((value) => value.userType !== "student" || Boolean(value.mobile), {
  message: "Mobile number is required for students",
  path: ["mobile"]
});

const employeeApplicationPatchSchema = z.object({
  status: optionalCleanString(80),
  applicationStatus: optionalCleanString(80),
  interestedStatus: optionalCleanString(80),
  interested_status: optionalCleanString(80),
  documentsStatus: optionalCleanString(80),
  documents_status: optionalCleanString(80),
  loanLoginStatus: optionalCleanString(120),
  loan_login_status: optionalCleanString(120),
  verificationStatus: optionalCleanString(120),
  verification_status: optionalCleanString(120),
  bankApplied: optionalCleanString(160),
  bank_applied: optionalCleanString(160),
  sanctionStatus: optionalCleanString(80),
  sanction_status: optionalCleanString(80),
  sanctionedAmount: z.unknown().optional(),
  sanctioned_amount: z.unknown().optional(),
  sanctionRejectionReason: optionalCleanString(1000),
  sanction_rejection_reason: optionalCleanString(1000),
  disbursementStatus: optionalCleanString(80),
  disbursement_status: optionalCleanString(80),
  disbursedAmount: z.unknown().optional(),
  disbursed_amount: z.unknown().optional(),
  disbursementRejectionReason: optionalCleanString(1000),
  disbursement_rejection_reason: optionalCleanString(1000),
  nextFollowupDate: optionalCleanString(40),
  next_followup_date: optionalCleanString(40),
  note: optionalCleanString(2000),
  message: optionalCleanString(2000)
}).transform((value) => ({
  status: value.status || value.applicationStatus || undefined,
  interestedStatus: value.interestedStatus || value.interested_status || undefined,
  documentsStatus: value.documentsStatus || value.documents_status || undefined,
  loanLoginStatus: value.loanLoginStatus || value.loan_login_status || undefined,
  verificationStatus: value.verificationStatus || value.verification_status || undefined,
  bankApplied: value.bankApplied || value.bank_applied || undefined,
  sanctionStatus: value.sanctionStatus || value.sanction_status || undefined,
  sanctionedAmount: value.sanctionedAmount ?? value.sanctioned_amount,
  sanctionRejectionReason: value.sanctionRejectionReason || value.sanction_rejection_reason || undefined,
  disbursementStatus: value.disbursementStatus || value.disbursement_status || undefined,
  disbursedAmount: value.disbursedAmount ?? value.disbursed_amount,
  disbursementRejectionReason: value.disbursementRejectionReason || value.disbursement_rejection_reason || undefined,
  nextFollowupDate: value.nextFollowupDate || value.next_followup_date || undefined,
  note: value.note || value.message || ""
})).transform((value) => ({
  ...value,
  sanctionedAmount: value.sanctionedAmount === undefined ? undefined : toNumber(value.sanctionedAmount, "Sanctioned amount"),
  disbursedAmount: value.disbursedAmount === undefined ? undefined : toNumber(value.disbursedAmount, "Disbursed amount"),
  nextFollowupDate: value.nextFollowupDate === undefined ? undefined : optionalDate(value.nextFollowupDate, "Next follow-up")
})).refine((value) => Object.values(value).some((item) => item !== undefined && item !== ""), {
  message: "No update fields provided"
});

const dailyUpdateSchema = z.object({
  workDate: optionalCleanString(40),
  work_date: optionalCleanString(40),
  totalLeadsHandled: z.unknown().optional(),
  total_leads_handled: z.unknown().optional(),
  newLeadsContacted: z.unknown().optional(),
  new_leads_contacted: z.unknown().optional(),
  followupsDone: z.unknown().optional(),
  followups_done: z.unknown().optional(),
  documentsCollected: z.unknown().optional(),
  documents_collected: z.unknown().optional(),
  bankLoginsDone: z.unknown().optional(),
  bank_logins_done: z.unknown().optional(),
  verificationUpdates: z.unknown().optional(),
  verification_updates: z.unknown().optional(),
  sanctionUpdates: z.unknown().optional(),
  sanction_updates: z.unknown().optional(),
  disbursementUpdates: z.unknown().optional(),
  disbursement_updates: z.unknown().optional(),
  rejectedCount: z.unknown().optional(),
  rejected_count: z.unknown().optional(),
  notInterestedCount: z.unknown().optional(),
  not_interested_count: z.unknown().optional(),
  pendingIssues: optionalCleanString(2000),
  pending_issues: optionalCleanString(2000),
  tomorrowPlan: optionalCleanString(2000),
  tomorrow_plan: optionalCleanString(2000),
  remarks: optionalCleanString(2000)
}).transform((value) => ({
  workDate: optionalDate(value.workDate || value.work_date || businessDateKey(), "Work date"),
  totalLeadsHandled: toNumber(value.totalLeadsHandled ?? value.total_leads_handled, "Total leads handled", { integer: true }),
  newLeadsContacted: toNumber(value.newLeadsContacted ?? value.new_leads_contacted, "New leads contacted", { integer: true }),
  followupsDone: toNumber(value.followupsDone ?? value.followups_done, "Follow-ups done", { integer: true }),
  documentsCollected: toNumber(value.documentsCollected ?? value.documents_collected, "Documents collected", { integer: true }),
  bankLoginsDone: toNumber(value.bankLoginsDone ?? value.bank_logins_done, "Bank logins", { integer: true }),
  verificationUpdates: toNumber(value.verificationUpdates ?? value.verification_updates, "Verification updates", { integer: true }),
  sanctionUpdates: toNumber(value.sanctionUpdates ?? value.sanction_updates, "Sanction updates", { integer: true }),
  disbursementUpdates: toNumber(value.disbursementUpdates ?? value.disbursement_updates, "Disbursement updates", { integer: true }),
  rejectedCount: toNumber(value.rejectedCount ?? value.rejected_count, "Rejected cases", { integer: true }),
  notInterestedCount: toNumber(value.notInterestedCount ?? value.not_interested_count, "Not interested cases", { integer: true }),
  pendingIssues: value.pendingIssues || value.pending_issues || "",
  tomorrowPlan: value.tomorrowPlan || value.tomorrow_plan || "",
  remarks: value.remarks || ""
}));

const commissionPayloadSchema = z.object({
  applicationId: optionalCleanString(80),
  application_id: optionalCleanString(80),
  referencePartnerId: optionalCleanString(80),
  reference_partner_id: optionalCleanString(80),
  commissionPercentage: z.unknown().optional(),
  commission_percentage: z.unknown().optional(),
  commissionBaseType: z.enum(commissionBaseTypes).optional(),
  commission_base_type: z.enum(commissionBaseTypes).optional(),
  commissionBaseAmount: z.unknown().optional(),
  commission_base_amount: z.unknown().optional(),
  commissionAmount: z.unknown().optional(),
  commission_amount: z.unknown().optional(),
  commissionStatus: z.enum(commissionStatuses).optional(),
  commission_status: z.enum(commissionStatuses).optional(),
  paidDate: optionalCleanString(40),
  paid_date: optionalCleanString(40),
  paymentReference: optionalCleanString(180),
  payment_reference: optionalCleanString(180),
  commissionNotes: optionalCleanString(2000),
  commission_notes: optionalCleanString(2000),
  manualOverride: z.boolean().optional(),
  manual_override: z.boolean().optional()
}).transform((value) => ({
  applicationId: value.applicationId || value.application_id,
  referencePartnerId: value.referencePartnerId || value.reference_partner_id || "",
  commissionPercentage: toNumber(value.commissionPercentage ?? value.commission_percentage, "Commission percentage"),
  commissionBaseType: value.commissionBaseType || value.commission_base_type || "not_applicable",
  commissionBaseAmount: toNumber(value.commissionBaseAmount ?? value.commission_base_amount, "Commission base amount"),
  commissionAmount: value.commissionAmount ?? value.commission_amount,
  commissionStatus: value.commissionStatus || value.commission_status || "not_applicable",
  paidDate: optionalDate(value.paidDate || value.paid_date, "Paid date"),
  paymentReference: value.paymentReference || value.payment_reference || "",
  commissionNotes: value.commissionNotes || value.commission_notes || "",
  manualOverride: value.manualOverride ?? value.manual_override ?? false
})).transform((value) => ({
  ...value,
  commissionAmount: value.commissionAmount === undefined || value.commissionAmount === ""
    ? undefined
    : toNumber(value.commissionAmount, "Commission amount")
})).refine((value) => Boolean(value.applicationId), {
  message: "Application ID is required",
  path: ["applicationId"]
});

function parseWithAppError(schema, payload, fallbackCode) {
  try {
    return schema.parse(payload);
  } catch (error) {
    if (error instanceof z.ZodError) throw error;
    throw new AppError(error.message || "Invalid request data", 400, fallbackCode);
  }
}

module.exports = {
  allSmartRoles,
  clientRoles,
  commissionBaseTypes,
  commissionStatuses,
  employeeRoles,
  profileStatuses,
  userTypes,
  parseAdminCreateUserPayload: (payload) => parseWithAppError(createUserSchema, payload, "SMARTCRM_CREATE_USER_VALIDATION_FAILED"),
  parseCommissionPayload: (payload) => parseWithAppError(commissionPayloadSchema, payload, "SMARTCRM_COMMISSION_VALIDATION_FAILED"),
  parseDailyUpdatePayload: (payload) => parseWithAppError(dailyUpdateSchema, payload, "SMARTCRM_DAILY_UPDATE_VALIDATION_FAILED"),
  parseEmployeeApplicationPatch: (payload) => parseWithAppError(employeeApplicationPatchSchema, payload, "SMARTCRM_APPLICATION_VALIDATION_FAILED")
};
