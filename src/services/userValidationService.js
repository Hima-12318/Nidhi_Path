const { z } = require("zod");
const { normalizeIndianPhone } = require("../utils/phoneUtils");

const cleanString = (max = 3000) =>
  z.preprocess(
    (value) => (value === undefined || value === null ? "" : value),
    z.coerce.string().trim().max(max)
  );

const nameSchema = cleanString(100)
  .pipe(z.string().min(2, "Please enter your name"));

const emailSchema = cleanString(254)
  .pipe(z.string().email("Please enter a valid email address"))
  .transform((value) => value.toLowerCase());

const phoneSchema = cleanString(40)
  .pipe(z.string().min(1, "Please enter a valid mobile number"))
  .transform((value) => normalizeIndianPhone(value))
  .refine(Boolean, "Please enter a valid mobile number");

const passwordSchema = cleanString(200)
  .pipe(z.string().min(8, "Password must be at least 8 characters"));

const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  preferredLanguage: cleanString(12).optional().default("en"),
  sourcePage: cleanString(200).optional().default("login.html"),
  createdFrom: cleanString(80).optional().default("website")
});

const loginSchema = z.object({
  email: emailSchema,
  password: cleanString(200).pipe(z.string().min(1, "Password is required")),
  loginRole: z.enum(["student", "client", "employee"]).optional().default("student"),
  login_role: z.enum(["student", "client", "employee"]).optional()
}).transform((value) => ({
  email: value.email,
  password: value.password,
  loginRole: value.loginRole || value.login_role || "student"
}));

function parseUserSignupPayload(payload) {
  return signupSchema.parse(payload);
}

function parseUserLoginPayload(payload) {
  return loginSchema.parse(payload);
}

module.exports = {
  parseUserLoginPayload,
  parseUserSignupPayload
};
