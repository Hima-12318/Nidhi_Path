const { z } = require("zod");

const keySchema = z.string().trim().min(1).max(120).regex(/^[a-z0-9_.-]+$/i, "Use only letters, numbers, dots, dashes, and underscores for keys");
const idSchema = z.string().trim().min(1).max(120);

function hasUnsafeContent(value) {
  if (typeof value === "string") {
    return /<\s*script|javascript\s*:|on[a-z]+\s*=/i.test(value);
  }
  if (Array.isArray(value)) {
    return value.some(hasUnsafeContent);
  }
  if (value && typeof value === "object") {
    return Object.values(value).some(hasUnsafeContent);
  }
  return false;
}

const safeJsonSchema = z.unknown().refine((value) => !hasUnsafeContent(value), "Content contains unsafe script-like input");

function safeString(max = 500) {
  return z.preprocess(
    (value) => (value === undefined || value === null ? undefined : String(value).trim()),
    z.string().max(max).refine((value) => !hasUnsafeContent(value), "Content contains unsafe script-like input").optional()
  );
}

function optionalBoolean() {
  return z.preprocess((value) => {
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value === "boolean") return value;
    return String(value).toLowerCase() === "true";
  }, z.boolean().optional());
}

function optionalInteger() {
  return z.preprocess((value) => {
    if (value === undefined || value === null || value === "") return undefined;
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : value;
  }, z.number().int().min(-10000).max(10000).optional());
}

const settingStatusSchema = z.enum(["active", "inactive", "archived"]).optional();

const settingItemSchema = z.object({
  settingKey: keySchema,
  settingValue: safeJsonSchema.default({}),
  status: settingStatusSchema
});

function parseSiteSettingsPatch(payload) {
  let items;
  if (Array.isArray(payload?.settings)) {
    items = payload.settings;
  } else if (payload?.settingKey) {
    items = [payload];
  } else if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    items = Object.entries(payload).map(([settingKey, settingValue]) => ({ settingKey, settingValue }));
  }

  return z.array(settingItemSchema).min(1, "At least one setting is required").parse(items || []);
}

const sectionPatchSchema = z.object({
  sectionTitle: safeString(300),
  sectionSubtitle: safeString(500),
  sectionContent: safeJsonSchema.optional(),
  displayOrder: optionalInteger(),
  isVisible: optionalBoolean()
}).refine((value) => Object.values(value).some((entry) => entry !== undefined), "No update fields provided");

const serviceCreateSchema = z.object({
  serviceKey: keySchema,
  serviceName: safeString(160).pipe(z.string().min(1, "Service name is required")),
  shortDescription: safeString(500),
  longDescription: safeString(3000),
  icon: safeString(120),
  pageUrl: safeString(300),
  displayOrder: optionalInteger(),
  isActive: optionalBoolean(),
  metadata: safeJsonSchema.optional()
});

const servicePatchSchema = serviceCreateSchema.partial().refine(
  (value) => Object.values(value).some((entry) => entry !== undefined),
  "No update fields provided"
);

const navigationPatchSchema = z.object({
  label: safeString(120),
  href: safeString(300),
  navGroup: safeString(80),
  displayOrder: optionalInteger(),
  isVisible: optionalBoolean()
}).refine((value) => Object.values(value).some((entry) => entry !== undefined), "No update fields provided");

const navigationCreateSchema = z.object({
  label: safeString(120).pipe(z.string().min(1, "Navigation label is required")),
  href: safeString(300).pipe(z.string().min(1, "Navigation href is required")),
  navGroup: safeString(80),
  displayOrder: optionalInteger(),
  isVisible: optionalBoolean()
});

const contentBlockPatchSchema = z.object({
  blockType: safeString(80),
  title: safeString(300),
  subtitle: safeString(500),
  content: safeString(5000),
  metadata: safeJsonSchema.optional(),
  isVisible: optionalBoolean()
}).refine((value) => Object.values(value).some((entry) => entry !== undefined), "No update fields provided");

const mediaCreateSchema = z.object({
  fileName: safeString(240).pipe(z.string().min(1, "File name is required")),
  fileUrl: safeString(1000).pipe(z.string().min(1, "File URL is required")),
  fileType: safeString(120),
  altText: safeString(300),
  usageContext: safeString(160)
});

const mediaPatchSchema = mediaCreateSchema.partial().refine(
  (value) => Object.values(value).some((entry) => entry !== undefined),
  "No update fields provided"
);

function parseId(value) {
  return idSchema.parse(value);
}

module.exports = {
  parseContentBlockPatch: (payload) => contentBlockPatchSchema.parse(payload),
  parseId,
  parseMediaCreate: (payload) => mediaCreateSchema.parse(payload),
  parseMediaPatch: (payload) => mediaPatchSchema.parse(payload),
  parseNavigationCreate: (payload) => navigationCreateSchema.parse(payload),
  parseNavigationPatch: (payload) => navigationPatchSchema.parse(payload),
  parseServiceCreate: (payload) => serviceCreateSchema.parse(payload),
  parseServicePatch: (payload) => servicePatchSchema.parse(payload),
  parseSiteSectionPatch: (payload) => sectionPatchSchema.parse(payload),
  parseSiteSettingsPatch
};
