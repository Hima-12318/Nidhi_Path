const { z } = require("zod");
const { AppError } = require("../middleware/errorMiddleware");
const { allowedServices } = require("./validationService");

const allowedUserStatuses = ["pending", "verified", "approved", "active", "inactive", "suspended"];
const allowedClientTypes = [
  "regular",
  "b2b"
];
const allowedApplicationStatuses = [
  "new_user",
  "registered",
  "verified",
  "approved",
  "approved_partner",
  "documents_pending",
  "documents_received",
  "work_started",
  "in_progress",
  "bank_review",
  "sanction_in_progress",
  "sanctioned",
  "disbursement_pending",
  "disbursed",
  "referral_received",
  "client_contacted",
  "loan_processing",
  "commission_pending",
  "commission_paid",
  "submitted",
  "on_hold",
  "completed",
  "rejected",
  "closed"
];
const allowedUpdateTypes = ["message", "status_update", "document_request", "internal_note", "system"];
const allowedDocumentStatuses = ["not_started", "pending", "requested", "received", "verified", "incomplete", "not_required"];
const allowedPriorities = ["low", "normal", "high", "urgent"];
const allowedSanctionStatuses = ["not_started", "pending", "in_progress", "sanctioned", "rejected", "not_required"];
const allowedDisbursementStatuses = ["not_started", "pending", "partial", "disbursed", "not_required"];
const allowedCommissionStatuses = ["not_applicable", "pending", "approved", "paid", "due", "hold", "closed"];

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

function optionalNumber(value, fieldLabel) {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${fieldLabel} must be a valid non-negative number`);
  }
  return number;
}

function optionalDate(value, fieldLabel) {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const raw = String(value).trim();
  const dmy = raw.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  const normalized = dmy ? `${dmy[3]}-${dmy[2]}-${dmy[1]}` : raw;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    throw new Error(`${fieldLabel} must be a valid date`);
  }
  const date = new Date(`${normalized}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== normalized) {
    throw new Error(`${fieldLabel} must be a valid date`);
  }
  return normalized;
}

const metadataSchema = z.record(z.unknown()).optional().default({});

const userStatusPatchSchema = z.object({
  status: z.enum(allowedUserStatuses).optional(),
  clientType: z.enum(allowedClientTypes).optional(),
  client_type: z.enum(allowedClientTypes).optional()
}).transform((value) => ({
  status: value.status,
  clientType: value.clientType || value.client_type
})).refine((value) => value.status || value.clientType, {
  message: "No update fields provided"
});

const applicationPatchSchema = z.object({
  service: optionalCleanString(120).refine((value) => !value || allowedServices.includes(value), "Please select a valid service"),
  userProfileId: optionalCleanString(80),
  user_profile_id: optionalCleanString(80),
  authUserId: optionalCleanString(80),
  auth_user_id: optionalCleanString(80),
  customerName: optionalCleanString(160),
  customer_name: optionalCleanString(160),
  customerEmail: optionalCleanString(180),
  customer_email: optionalCleanString(180),
  customerPhone: optionalCleanString(40),
  customer_phone: optionalCleanString(40),
  studentName: optionalCleanString(160),
  student_name: optionalCleanString(160),
  studentEmail: optionalCleanString(180),
  student_email: optionalCleanString(180),
  studentMobile: optionalCleanString(40),
  student_mobile: optionalCleanString(40),
  universityApplied: optionalCleanString(180),
  university_applied: optionalCleanString(180),
  universityAppliedFor: optionalCleanString(180),
  university_applied_for: optionalCleanString(180),
  country: optionalCleanString(120),
  course: optionalCleanString(180),
  clientType: z.enum(allowedClientTypes).optional(),
  client_type: z.enum(allowedClientTypes).optional(),
  consultantClientId: optionalCleanString(80),
  consultant_client_id: optionalCleanString(80),
  referenceSourceType: optionalCleanString(80),
  reference_source_type: optionalCleanString(80),
  referencePartnerId: optionalCleanString(80),
  reference_partner_id: optionalCleanString(80),
  clientId: optionalCleanString(80),
  client_id: optionalCleanString(80),
  leadSourceType: optionalCleanString(80),
  lead_source_type: optionalCleanString(80),
  referenceOwnerId: optionalCleanString(80),
  reference_owner_id: optionalCleanString(80),
  applicationStatus: z.enum(allowedApplicationStatuses).optional(),
  application_status: z.enum(allowedApplicationStatuses).optional(),
  workflowStage: z.enum(allowedApplicationStatuses).optional(),
  workflow_stage: z.enum(allowedApplicationStatuses).optional(),
  documentStatus: z.enum(allowedDocumentStatuses).optional(),
  document_status: z.enum(allowedDocumentStatuses).optional(),
  bankName: optionalCleanString(160),
  bank_name: optionalCleanString(160),
  loanAmountRequired: z.unknown().optional(),
  loan_amount_required: z.unknown().optional(),
  loanAmountApproved: z.unknown().optional(),
  loan_amount_approved: z.unknown().optional(),
  sanctionStatus: z.enum(allowedSanctionStatuses).optional(),
  sanction_status: z.enum(allowedSanctionStatuses).optional(),
  disbursementStatus: z.enum(allowedDisbursementStatuses).optional(),
  disbursement_status: z.enum(allowedDisbursementStatuses).optional(),
  commissionStatus: z.enum(allowedCommissionStatuses).optional(),
  commission_status: z.enum(allowedCommissionStatuses).optional(),
  priority: z.enum(allowedPriorities).optional(),
  nextFollowupDate: optionalCleanString(40),
  next_followup_date: optionalCleanString(40),
  adminStatus: optionalCleanString(120),
  admin_status: optionalCleanString(120),
  notes: optionalCleanString(5000),
  assignedTo: optionalCleanString(80),
  assigned_to: optionalCleanString(80),
  assignedEmployeeId: optionalCleanString(80),
  assigned_employee_id: optionalCleanString(80),
  assignedAdminName: optionalCleanString(120),
  assigned_admin_name: optionalCleanString(120),
  documentsPending: optionalCleanString(1000),
  documents_pending: optionalCleanString(1000),
  documentsReceived: optionalCleanString(1000),
  documents_received: optionalCleanString(1000),
  metadata: metadataSchema.optional()
}).transform((value) => ({
  service: value.service || undefined,
  userProfileId: value.userProfileId || value.user_profile_id || undefined,
  authUserId: value.authUserId || value.auth_user_id || undefined,
  customerName: value.customerName || value.customer_name || undefined,
  customerEmail: value.customerEmail || value.customer_email || undefined,
  customerPhone: value.customerPhone || value.customer_phone || undefined,
  studentName: value.studentName || value.student_name || value.customerName || value.customer_name || undefined,
  studentEmail: value.studentEmail || value.student_email || value.customerEmail || value.customer_email || undefined,
  studentMobile: value.studentMobile || value.student_mobile || value.customerPhone || value.customer_phone || undefined,
  universityApplied: value.universityApplied || value.university_applied || value.universityAppliedFor || value.university_applied_for || undefined,
  universityAppliedFor: value.universityAppliedFor || value.university_applied_for || value.universityApplied || value.university_applied || undefined,
  country: value.country || undefined,
  course: value.course || undefined,
  clientType: value.clientType || value.client_type || undefined,
  consultantClientId: value.consultantClientId || value.consultant_client_id || undefined,
  referenceSourceType: value.referenceSourceType || value.reference_source_type || undefined,
  referencePartnerId: value.referencePartnerId || value.reference_partner_id || undefined,
  clientId: value.clientId || value.client_id || value.referencePartnerId || value.reference_partner_id || undefined,
  leadSourceType: value.leadSourceType || value.lead_source_type || value.referenceSourceType || value.reference_source_type || undefined,
  referenceOwnerId: value.referenceOwnerId || value.reference_owner_id || value.referencePartnerId || value.reference_partner_id || value.clientId || value.client_id || undefined,
  applicationStatus: value.applicationStatus || value.application_status || undefined,
  workflowStage: value.workflowStage || value.workflow_stage || value.applicationStatus || value.application_status || undefined,
  documentStatus: value.documentStatus || value.document_status || undefined,
  bankName: value.bankName || value.bank_name || undefined,
  loanAmountRequired: optionalNumber(value.loanAmountRequired ?? value.loan_amount_required, "Loan amount required"),
  loanAmountApproved: optionalNumber(value.loanAmountApproved ?? value.loan_amount_approved, "Sanction / approved amount"),
  sanctionStatus: value.sanctionStatus || value.sanction_status || undefined,
  disbursementStatus: value.disbursementStatus || value.disbursement_status || undefined,
  commissionStatus: value.commissionStatus || value.commission_status || undefined,
  priority: value.priority || undefined,
  nextFollowupDate: optionalDate(value.nextFollowupDate || value.next_followup_date, "Next follow-up"),
  adminStatus: value.adminStatus || value.admin_status || undefined,
  notes: value.notes || undefined,
  assignedTo: value.assignedTo || value.assigned_to || value.assignedEmployeeId || value.assigned_employee_id || undefined,
  assignedEmployeeId: value.assignedEmployeeId || value.assigned_employee_id || value.assignedTo || value.assigned_to || undefined,
  assignedAdminName: value.assignedAdminName || value.assigned_admin_name || undefined,
  documentsPending: value.documentsPending || value.documents_pending || undefined,
  documentsReceived: value.documentsReceived || value.documents_received || undefined,
  metadata: value.metadata
})).refine((value) => Object.values(value).some((item) => item !== undefined), {
  message: "No update fields provided"
});

const crmUpdateSchema = z.object({
  title: optionalCleanString(160),
  message: cleanString(3000).pipe(z.string().min(1, "Message is required")),
  updateType: z.enum(allowedUpdateTypes).optional(),
  update_type: z.enum(allowedUpdateTypes).optional(),
  visibleToUser: z.boolean().optional(),
  visible_to_user: z.boolean().optional(),
  clientVisible: z.boolean().optional(),
  client_visible: z.boolean().optional(),
  studentVisible: z.boolean().optional(),
  student_visible: z.boolean().optional(),
  boardVisible: z.boolean().optional(),
  board_visible: z.boolean().optional(),
  internalOnly: z.boolean().optional(),
  internal_only: z.boolean().optional(),
  parentUpdateId: optionalCleanString(80),
  parent_update_id: optionalCleanString(80),
  createdByRole: optionalCleanString(80),
  created_by_role: optionalCleanString(80),
  clientMutationId: optionalCleanString(120),
  client_mutation_id: optionalCleanString(120),
  source: optionalCleanString(40)
}).transform((value) => ({
  title: value.title || "",
  message: value.message,
  updateType: value.updateType || value.update_type || "message",
  visibleToUser: value.visibleToUser ?? value.visible_to_user ?? true,
  clientVisible: value.clientVisible ?? value.client_visible ?? value.visibleToUser ?? value.visible_to_user ?? true,
  studentVisible: value.studentVisible ?? value.student_visible ?? value.visibleToUser ?? value.visible_to_user ?? true,
  boardVisible: value.boardVisible ?? value.board_visible ?? false,
  internalOnly: value.internalOnly ?? value.internal_only ?? false,
  parentUpdateId: value.parentUpdateId || value.parent_update_id || "",
  createdByRole: value.createdByRole || value.created_by_role || "",
  clientMutationId: value.clientMutationId || value.client_mutation_id || "",
  source: value.source || "admin"
}));

function parseApplicationPatch(payload) {
  try {
    return applicationPatchSchema.parse(payload);
  } catch (error) {
    if (!(error instanceof z.ZodError)) {
      throw new AppError(error.message || "Invalid CRM update data", 400, "CRM_VALIDATION_FAILED");
    }
    throw error;
  }
}

function parseCrmUpdate(payload) {
  return crmUpdateSchema.parse(payload);
}

function parseUserStatusPatch(payload) {
  return userStatusPatchSchema.parse(payload);
}

module.exports = {
  allowedApplicationStatuses,
  allowedClientTypes,
  allowedUpdateTypes,
  allowedUserStatuses,
  parseApplicationPatch,
  parseCrmUpdate,
  parseUserStatusPatch
};
