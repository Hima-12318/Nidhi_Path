const crypto = require("crypto");
const { env } = require("../config/env");
const { supabaseAuthClient } = require("../config/supabase");
const { AppError } = require("../middleware/errorMiddleware");
const adminService = require("./adminService");
const crmService = require("./crmService");
const smartCrmService = require("./smartCrmService");
const { normalizeEmail, normalizePhone } = require("./customerIdentityService");
const mockDb = require("./mockDatabaseService");

const OFFICIAL_ADMIN_EMAIL = "info@nidhipath.in";

function isOfficialAdminEmail(email) {
  return normalizeEmail(email) === OFFICIAL_ADMIN_EMAIL;
}

function authUserIsVerified(user) {
  return Boolean(user?.email_confirmed_at || user?.confirmed_at);
}

function profileStatusFromAuthUser(user, fallback = "pending") {
  if (authUserIsVerified(user)) {
    return ["active", "approved", "verified"].includes(fallback) ? fallback : "verified";
  }
  return fallback || "pending";
}

function safeAuthMetadata(user) {
  return user?.user_metadata || user?.raw_user_meta_data || {};
}

function safeStudentApplication(application) {
  if (!application) return null;
  return {
    id: application.id,
    applicationId: application.applicationId,
    name: application.studentName || application.customerName,
    mobile: application.studentMobile || application.customerPhone,
    email: application.studentEmail || application.customerEmail,
    universityApplied: application.universityApplied,
    course: application.course,
    loanAmount: application.loanAmount || application.loanAmountRequired,
    consultantClient: application.assignedAdminName || "",
    status: application.status || application.applicationStatus || application.workflowStage || "new_user"
  };
}

function normalizeRole(role) {
  return String(role || "").trim().toLowerCase();
}

function roleLoginGroup(profile = {}) {
  const role = normalizeRole(profile.role || profile.adminRole);
  if (["super_admin", "admin", "ceo", "board", "board_member", "employee"].includes(role)) return "employee";
  if (role === "student") return "student";
  if (smartCrmService.PARTNER_ROLES.has(role)) return "client";
  return "student";
}

function assertLoginRoleMatches(profile, requestedLoginRole = "student") {
  const actualGroup = roleLoginGroup(profile);
  if (actualGroup === requestedLoginRole) return;
  if (actualGroup === "student") {
    throw new AppError("Please use Student Login.", 403, "WRONG_LOGIN_TYPE");
  }
  if (actualGroup === "client") {
    throw new AppError("Please use Client Login.", 403, "WRONG_LOGIN_TYPE");
  }
  throw new AppError("Please use Employee Login.", 403, "WRONG_LOGIN_TYPE");
}

async function repairProfileForAuthUser(user, defaults = {}) {
  const email = normalizeEmail(user?.email || defaults.email);
  if (!user?.id || !email) {
    throw new AppError("User account could not be loaded", 401, "USER_AUTH_NOT_FOUND");
  }

  let profile = await crmService.findUserProfileByAuthUserId(user.id);
  if (!profile) {
    profile = await crmService.findUserProfileByEmail(email);
  }

  const metadata = safeAuthMetadata(user);
  const nextStatus = profileStatusFromAuthUser(user, profile?.status || defaults.status || "pending");
  const defaultRole = normalizeRole(defaults.role);
  const defaultIsEmployeeLoginRole = ["super_admin", "admin", "ceo", "board", "board_member", "employee"].includes(defaultRole);
  const profilePayload = {
    authUserId: user.id,
    fullName: profile?.fullName || defaults.name || metadata.full_name || metadata.name || email.split("@")[0],
    email,
    phone: normalizePhone(profile?.phone || defaults.phone || metadata.phone) || profile?.phone || defaults.phone || metadata.phone || "",
    mobile: normalizePhone(profile?.mobile || profile?.phone || defaults.phone || metadata.phone) || profile?.mobile || profile?.phone || defaults.phone || metadata.phone || "",
    clientType: defaultIsEmployeeLoginRole ? "regular" : (profile?.clientType || defaults.clientType || (defaults.userType === "client" ? "b2b" : "regular")),
    userType: defaultIsEmployeeLoginRole ? "employee" : (profile?.userType || defaults.userType || metadata.user_type || "student"),
    role: defaultIsEmployeeLoginRole ? defaultRole : (profile?.role || defaults.role || metadata.role || "student"),
    status: nextStatus,
    commissionVisibilityEnabled: profile?.commissionVisibilityEnabled || defaults.commissionVisibilityEnabled || false,
    metadata: profile?.metadata || {}
  };

  profile = await crmService.upsertUserProfile(profilePayload);
  const application = profile.role === "student"
    ? await crmService.ensureApplicationForUser(profile)
    : await crmService.findApplicationByUserProfileId(profile.id);
  return { profile, application };
}

async function signupUser(payload) {
  const email = normalizeEmail(payload.email);
  if (isOfficialAdminEmail(email)) {
    throw new AppError("Please use Employee Login.", 403, "EMPLOYEE_LOGIN_REQUIRED");
  }

  const existingProfile = await crmService.findUserProfileByEmailPhone({
    email,
    phone: payload.phone,
    name: payload.name
  });
  if (existingProfile) {
    throw new AppError("An account already exists with this email. Please sign in.", 409, "USER_ALREADY_EXISTS");
  }

  if (env.mockDatabaseMode) {
    const user = {
      id: `mock-user-${crypto.randomUUID()}`,
      email,
      email_confirmed_at: null,
      user_metadata: {
        full_name: payload.name,
      phone: normalizePhone(payload.phone)
      }
    };
    const { profile, application } = await repairProfileForAuthUser(user, {
      name: payload.name,
      phone: normalizePhone(payload.phone),
      status: "pending",
      userType: "student",
      role: "student"
    });
    const token = `mock-user-token-${crypto.randomUUID()}`;
    mockDb.store.mockTokens.set(token, {
      userType: "user",
      authUserId: user.id,
      profile,
      createdAt: new Date().toISOString()
    });
    return {
      profile,
      application: safeStudentApplication(application),
      token,
      message: "Account created successfully. Please verify your email before signing in."
    };
  }

  const { data, error } = await supabaseAuthClient.auth.signUp({
    email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.name,
        phone: payload.phone,
        preferred_language: payload.preferredLanguage || "en",
        source_page: payload.sourcePage || "login.html",
        created_from: payload.createdFrom || "website"
      }
    }
  });

  if (error) {
    const message = String(error.message || "").toLowerCase();
    if (message.includes("already") || message.includes("registered")) {
      throw new AppError("An account already exists with this email. Please sign in.", 409, "USER_ALREADY_EXISTS");
    }
    throw new AppError(error.message || "Unable to create account", 400, "USER_SIGNUP_FAILED");
  }

  if (Array.isArray(data?.user?.identities) && data.user.identities.length === 0) {
    throw new AppError("An account already exists with this email. Please sign in.", 409, "USER_ALREADY_EXISTS");
  }

  if (!data?.user?.id) {
    throw new AppError("Unable to create account. Please try again.", 400, "USER_SIGNUP_FAILED");
  }

  const { profile, application } = await repairProfileForAuthUser(data.user, {
    name: payload.name,
    phone: payload.phone,
    status: profileStatusFromAuthUser(data.user, "pending"),
    userType: "student",
    role: "student"
  });

  return {
    profile,
    application: safeStudentApplication(application),
    message: "Account created successfully. Please verify your email before signing in."
  };
}

async function loginUser(payload) {
  const email = normalizeEmail(payload.email);

  if (env.mockDatabaseMode) {
    let profile = await crmService.findUserProfileByEmail(email);
    if (!profile) {
      const adminProfile = mockDb.findRecord("adminProfiles", (item) => normalizeEmail(item.email) === email);
      if (adminProfile) {
        const user = {
          id: adminProfile.authUserId || `mock-admin-${crypto.randomUUID()}`,
          email,
          email_confirmed_at: new Date().toISOString(),
          user_metadata: {
            full_name: adminProfile.fullName,
            phone: adminProfile.phone,
            role: adminProfile.role
          }
        };
        profile = (await repairProfileForAuthUser(user, {
          name: adminProfile.fullName,
          phone: adminProfile.phone,
          status: "active",
          userType: "employee",
          role: adminProfile.role || "admin"
        })).profile;
      }
    }
    if (!profile) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }
    // Enforce that the account's role matches the login tab that was used
    // (Student / Client / Employee). Without this an admin could sign in
    // through the Student tab, etc.
    assertLoginRoleMatches(profile, payload.loginRole);
    if (["inactive", "suspended"].includes(profile.status)) {
      throw new AppError("Account is inactive", 403, "ACCOUNT_INACTIVE");
    }
    const token = `mock-user-token-${crypto.randomUUID()}`;
    const application = profile.role === "student" ? await crmService.ensureApplicationForUser(profile) : null;
    mockDb.store.mockTokens.set(token, {
      userType: "user",
      authUserId: profile.authUserId,
      profile,
      createdAt: new Date().toISOString()
    });
    return {
      token,
      profile,
      application: profile.role === "student" ? safeStudentApplication(application) : null,
      redirectTo: smartCrmService.getRedirectForProfile(profile),
      adminAccess: smartCrmService.isAdminRole(profile) || smartCrmService.isBoardRole(profile)
    };
  }

  const { data, error } = await supabaseAuthClient.auth.signInWithPassword({
    email,
    password: payload.password
  });

  if (error || !data?.session?.access_token || !data?.user?.id) {
    const message = String(error?.message || "").toLowerCase();
    if (message.includes("email") && (message.includes("confirm") || message.includes("verify"))) {
      throw new AppError("Please verify your email before signing in.", 403, "EMAIL_NOT_VERIFIED");
    }
    throw new AppError("Invalid email or password. If this client was created by admin, reset or reissue the temporary password from SmartCRM Users.", 401, "INVALID_CREDENTIALS");
  }

  const adminProfile = await adminService.verifyAdminToken(data.session.access_token).catch(() => null);
  const { profile, application } = await repairProfileForAuthUser(data.user, adminProfile ? {
    email,
    name: adminProfile.fullName,
    phone: adminProfile.phone,
    status: "active",
    userType: "employee",
    role: adminProfile.role
  } : { email });
  // Enforce that the account's role matches the login tab that was used
  // (Student / Client / Employee). This is the authoritative server-side
  // guard — the unused helper was the source of the "any account logs in
  // from any tab" bug.
  assertLoginRoleMatches(profile, payload.loginRole);
  if (["inactive", "suspended"].includes(profile.status)) {
    throw new AppError("Account is inactive", 403, "ACCOUNT_INACTIVE");
  }
  return {
    token: data.session.access_token,
    profile,
    application: profile.role === "student" ? safeStudentApplication(application) : null,
    redirectTo: smartCrmService.getRedirectForProfile(profile),
    adminAccess: smartCrmService.isAdminRole(profile) || smartCrmService.isBoardRole(profile)
  };
}

async function verifyUserToken(token) {
  if (!token) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (env.mockDatabaseMode) {
    const session = mockDb.store.mockTokens.get(token);
    if (!session || session.userType !== "user") {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const profile = await crmService.findUserProfileByAuthUserId(session.authUserId);
    if (!profile) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    if (["inactive", "suspended"].includes(profile.status)) {
      throw new AppError("Account is inactive", 403, "ACCOUNT_INACTIVE");
    }
    return profile;
  }

  const { data, error } = await supabaseAuthClient.auth.getUser(token);
  if (error || !data?.user?.id) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const { profile } = await repairProfileForAuthUser(data.user);
  if (["inactive", "suspended"].includes(profile.status)) {
    throw new AppError("Account is inactive", 403, "ACCOUNT_INACTIVE");
  }
  return profile;
}

async function getUserDashboard(profile) {
  const role = String(profile.role || "").toLowerCase();
  if (role === "student") return smartCrmService.getStudentDashboard(profile);
  if (role === "employee") return smartCrmService.getEmployeeDashboard(profile);
  if (role === "board" || role === "board_member") return smartCrmService.getBoardDashboard(profile);
  if (smartCrmService.PARTNER_ROLES.has(role)) return smartCrmService.getClientDashboard(profile);
  throw new AppError("Use the admin dashboard for this role.", 403, "ROLE_DASHBOARD_RESTRICTED");
}

async function addUserApplicationUpdate(profile, payload) {
  const application = await crmService.ensureApplicationForUser(profile);
  if (!application) {
    throw new AppError("Application not found", 404, "USER_APPLICATION_NOT_FOUND");
  }
  if ((application.clientType || profile.clientType || "regular") !== "b2b") {
    throw new AppError("Regular clients can view CRM updates but cannot post CRM messages.", 403, "REGULAR_CRM_VIEW_ONLY");
  }
  const update = await crmService.addUpdate(application.id, {
    title: payload.title || "Partner Update",
    message: payload.message,
    updateType: "message",
    visibleToUser: true,
    source: "b2b_user",
    clientMutationId: payload.clientMutationId || ""
  }, null);
  return { application, update };
}

module.exports = {
  addUserApplicationUpdate,
  getUserDashboard,
  loginUser,
  signupUser,
  verifyUserToken
};
