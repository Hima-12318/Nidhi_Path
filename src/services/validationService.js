const { z } = require("zod");
const { normalizeIndianPhone } = require("../utils/phoneUtils");

const allowedServices = [
  "Education Loan",
  "Personal Loan",
  "Business Loan",
  "Home Loan",
  "Mutual Funds",
  "Insurance",
  "All Types of Loans",
  "Loan Comparison Assistance",
  "Documentation Support",
  "Loan Consultation",
  "Other"
];

const allowedEnquiryStatuses = ["new", "contacted", "in_progress", "closed", "rejected"];
const allowedChatStatuses = ["open", "waiting_for_agent", "customer_waiting", "live_agent_requested", "agent_joined", "agent_replied", "closed"];
const allowedAdminRoles = ["super_admin", "admin", "ceo", "board", "board_member", "manager", "support_agent"];

const cleanString = (max = 2000) =>
  z.preprocess(
    (value) => (value === undefined || value === null ? "" : value),
    z.coerce.string().trim().max(max)
  );

const optionalCleanString = (max = 2000) =>
  z.preprocess(
    (value) => {
      if (value === undefined || value === null) return "";
      return typeof value === "string" ? value.trim() : value;
    },
    z.string().max(max).optional().default("")
  );

const nameSchema = cleanString(100)
  .pipe(z.string().min(2, "Please enter your name"))
  .refine((value) => !/^\d+$/.test(value), "Name cannot contain only numbers");

const phoneSchema = cleanString(40)
  .pipe(z.string().min(1, "Please enter a valid mobile number"))
  .transform((value) => normalizeIndianPhone(value))
  .refine(Boolean, "Please enter a valid mobile number");

const emailSchema = optionalCleanString(254)
  .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value), "Please enter a valid email address");

const serviceAliases = {
  [String(["Mutual", "Loans"].join(" "))]: "Mutual Funds",
  "All Loans": "All Types of Loans",
  "All Loan": "All Types of Loans"
};

const serviceSchema = cleanString(80)
  .pipe(z.string().min(1, "Please select a service"))
  .transform((value) => serviceAliases[value] || value)
  .refine((value) => allowedServices.includes(value), "Please select a valid service");

const messageSchema = cleanString(2000)
  .transform((value) => value || "No message provided.")
  .pipe(z.string().min(5, "Please enter a message with at least 5 characters"));

const metadataSchema = z.record(z.unknown()).optional().default({});

const enquirySchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  service: serviceSchema,
  message: messageSchema,
  sourcePage: optionalCleanString(200),
  sourceForm: optionalCleanString(80),
  preferredLanguage: optionalCleanString(12).default("en"),
  createdFrom: optionalCleanString(80).default("website"),
  metadata: metadataSchema,
  city: optionalCleanString(120),
  loanAmount: optionalCleanString(80),
  employmentType: optionalCleanString(80),
  monthlyIncome: optionalCleanString(80),
  preferredContactTime: optionalCleanString(120),
  educationLevel: optionalCleanString(120),
  countryPreference: optionalCleanString(120),
  loanType: optionalCleanString(120),
  tenure: optionalCleanString(80),
  companyWebsite: optionalCleanString(200)
}).superRefine((value, context) => {
  if (value.companyWebsite) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["companyWebsite"],
      message: "Something went wrong. Please try again."
    });
  }
});

const chatMessageSchema = z.object({
  chatId: cleanString(80).pipe(z.string().min(1, "Chat ID is required")),
  message: messageSchema
});

const adminLoginSchema = z.object({
  email: cleanString(254).pipe(z.string().email("Please enter a valid email address")),
  password: cleanString(200).pipe(z.string().min(1, "Password is required"))
});

const enquiryUpdateSchema = z.object({
  status: z.enum(allowedEnquiryStatuses).optional(),
  assigned_to: optionalCleanString(80),
  assignedTo: optionalCleanString(80),
  metadata: metadataSchema.optional()
}).refine((value) => value.status || value.assigned_to || value.assignedTo || value.metadata, {
  message: "No update fields provided"
});

const chatUpdateSchema = z.object({
  status: z.enum(allowedChatStatuses).optional(),
  assigned_to: optionalCleanString(80),
  assignedTo: optionalCleanString(80)
}).refine((value) => value.status || value.assigned_to || value.assignedTo, {
  message: "No update fields provided"
});

const adminReplySchema = z.object({
  message: messageSchema
});

function firstFilled(...values) {
  return values.find((value) => String(value ?? "").trim()) ?? "";
}

function normalizeEnquiryAliases(payload = {}) {
  return {
    ...payload,
    name: firstFilled(payload.name, payload.fullName),
    phone: firstFilled(payload.phone, payload.mobile, payload.mobileNumber),
    email: firstFilled(payload.email, payload.emailAddress),
    city: firstFilled(payload.city, payload.location),
    service: firstFilled(payload.service, payload.serviceNeeded, payload.loanType),
    loanAmount: firstFilled(payload.loanAmount, payload.approxLoanAmount, payload.amount),
    message: firstFilled(payload.message, payload.notes, payload.requirementNotes)
  };
}

function parseEnquiryPayload(payload) {
  const parsed = enquirySchema.parse(normalizeEnquiryAliases(payload));
  return {
    ...parsed,
    preferredLanguage: parsed.preferredLanguage || "en",
    createdFrom: parsed.createdFrom || "website",
    metadata: {
      ...(parsed.metadata || {}),
      city: parsed.city,
      loanAmount: parsed.loanAmount,
      employmentType: parsed.employmentType,
      monthlyIncome: parsed.monthlyIncome,
      preferredContactTime: parsed.preferredContactTime,
      educationLevel: parsed.educationLevel,
      countryPreference: parsed.countryPreference,
      loanType: parsed.loanType,
      tenure: parsed.tenure
    }
  };
}

function parseChatStartPayload(payload) {
  return {
    ...parseEnquiryPayload({
      ...payload,
      sourceForm: payload?.sourceForm || "live_chat_start"
    }),
    sourceForm: payload?.sourceForm || "live_chat_start"
  };
}

module.exports = {
  allowedAdminRoles,
  allowedChatStatuses,
  allowedEnquiryStatuses,
  allowedServices,
  parseAdminLoginPayload: (payload) => adminLoginSchema.parse(payload),
  parseAdminReplyPayload: (payload) => adminReplySchema.parse(payload),
  parseChatMessagePayload: (payload) => chatMessageSchema.parse(payload),
  parseChatStartPayload,
  parseChatUpdatePayload: (payload) => chatUpdateSchema.parse(payload),
  parseEnquiryPayload,
  parseEnquiryUpdatePayload: (payload) => enquiryUpdateSchema.parse(payload)
};
