const { env } = require("../config/env");
const { supabaseAdminClient, supabaseAuthClient } = require("../config/supabase");
const { AppError } = require("../middleware/errorMiddleware");
const { allowedAdminRoles } = require("./validationService");
const { mapAdminProfile } = require("./recordMapperService");
const crmService = require("./crmService");
const enquiryService = require("./enquiryService");
const chatService = require("./chatService");
const mockDb = require("./mockDatabaseService");

const OFFICIAL_ADMIN_EMAIL = "info@nidhipath.in";
const fullDashboardRoles = ["super_admin", "admin", "ceo"];

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function profileIsAuthorized(profile) {
  return Boolean(profile && profile.status === "active" && allowedAdminRoles.includes(profile.role));
}

function hasFullDashboardAccess(profile) {
  return Boolean(profile && profile.status === "active" && fullDashboardRoles.includes(profile.role));
}

function logAdminLoginDebug(message) {
  if (env.nodeEnv === "development") {
    console.log(message);
  }
}

function throwProfileError(profile) {
  if (!profile) {
    throw new AppError("Admin profile not found", 403, "ADMIN_PROFILE_NOT_FOUND");
  }
  if (profile.status !== "active") {
    throw new AppError("Admin account inactive", 403, "ADMIN_INACTIVE");
  }
  if (!allowedAdminRoles.includes(profile.role)) {
    throw new AppError("Unauthorized role", 403, "UNAUTHORIZED_ROLE");
  }
}

function mapUserProfileAdminAccess(profile) {
  if (!profile || !allowedAdminRoles.includes(profile.role)) return null;
  return {
    id: profile.id,
    authUserId: profile.authUserId,
    fullName: profile.fullName || profile.name || profile.email,
    email: profile.email,
    phone: profile.phone || profile.mobile || "",
    role: profile.role,
    status: profile.status === "verified" || profile.status === "approved" ? "active" : profile.status,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt
  };
}

async function findProfileByAuthUserId(authUserId) {
  if (env.mockDatabaseMode) {
    return mapAdminProfile(mockDb.findRecord("adminProfiles", (item) => item.authUserId === authUserId));
  }

  const { data, error } = await supabaseAdminClient
    .from("admin_profiles")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load admin profile by auth user id: ${error.message}`);
  }

  return mapAdminProfile(data);
}

async function findProfileByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  if (env.mockDatabaseMode) {
    return mapAdminProfile(mockDb.findRecord("adminProfiles", (item) => normalizeEmail(item.email) === normalizedEmail));
  }

  const { data, error } = await supabaseAdminClient
    .from("admin_profiles")
    .select("*")
    .ilike("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load admin profile by email: ${error.message}`);
  }

  return mapAdminProfile(data);
}

async function updateProfileAuthUserId(profile, authUserId) {
  if (!profile || profile.authUserId === authUserId) {
    return profile;
  }

  if (env.mockDatabaseMode) {
    return mapAdminProfile(mockDb.updateRecord("adminProfiles", (item) => item.id === profile.id, {
      authUserId
    }));
  }

  const { data, error } = await supabaseAdminClient
    .from("admin_profiles")
    .update({ auth_user_id: authUserId })
    .eq("id", profile.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to repair admin profile auth user id: ${error.message}`);
  }

  return mapAdminProfile(data);
}

async function upsertOfficialAdminProfile({ authUserId, email }) {
  const normalizedEmail = normalizeEmail(email);
  if (normalizedEmail !== OFFICIAL_ADMIN_EMAIL) {
    return null;
  }

  const payload = {
    auth_user_id: authUserId,
    full_name: "Nidhi Path Admin",
    email: OFFICIAL_ADMIN_EMAIL,
    role: "super_admin",
    status: "active"
  };

  if (env.mockDatabaseMode) {
    const existing = mockDb.findRecord("adminProfiles", (item) => normalizeEmail(item.email) === OFFICIAL_ADMIN_EMAIL);
    if (existing) {
      return mapAdminProfile(mockDb.updateRecord("adminProfiles", (item) => item.id === existing.id, {
        authUserId,
        fullName: payload.full_name,
        email: payload.email,
        role: payload.role,
        status: payload.status
      }));
    }
    return mapAdminProfile(mockDb.createRecord("adminProfiles", {
      authUserId,
      fullName: payload.full_name,
      email: payload.email,
      role: payload.role,
      status: payload.status
    }));
  }

  const { data, error } = await supabaseAdminClient
    .from("admin_profiles")
    .upsert(payload, { onConflict: "email" })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to auto-repair official admin profile: ${error.message}`);
  }

  return mapAdminProfile(data);
}

async function loadAdminProfileForAuthUser({ authUserId, email, allowOfficialAutoRepair = false, logDebug = false }) {
  const normalizedEmail = normalizeEmail(email);
  if (logDebug) {
    logAdminLoginDebug("Admin profile lookup using service role: yes");
  }

  let profile = await findProfileByAuthUserId(authUserId);
  if (logDebug) {
    logAdminLoginDebug(`Lookup by auth_user_id found: ${profile ? "yes" : "no"}`);
  }

  if (!profile && normalizedEmail) {
    profile = await findProfileByEmail(normalizedEmail);
    if (logDebug) {
      logAdminLoginDebug(`Lookup by email found: ${profile ? "yes" : "no"}`);
    }
    if (profile && profile.authUserId !== authUserId) {
      profile = await updateProfileAuthUserId(profile, authUserId);
    }
  }

  let autoRepairUsed = false;
  if (!profile && allowOfficialAutoRepair && normalizedEmail === OFFICIAL_ADMIN_EMAIL) {
    profile = await upsertOfficialAdminProfile({ authUserId, email: normalizedEmail });
    autoRepairUsed = Boolean(profile);
  }

  if (logDebug) {
    logAdminLoginDebug(`Admin profile auto-repair: ${autoRepairUsed ? "yes" : "no"}`);
    logAdminLoginDebug(`Admin profile found: ${profile ? "yes" : "no"}`);
    logAdminLoginDebug(`Admin role: ${profile?.role || ""}`);
    logAdminLoginDebug(`Admin status: ${profile?.status || ""}`);
  }

  return profile;
}

async function loginAdmin({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  logAdminLoginDebug(`Admin login attempt: ${normalizedEmail}`);
  logAdminLoginDebug(`Password field exists: ${password ? "yes" : "no"}`);

  if (env.mockDatabaseMode) {
    logAdminLoginDebug("Login response: 503");
    throw new AppError("Mock admin login is disabled. Use Supabase Auth and admin_profiles.", 503, "MOCK_ADMIN_DISABLED");
  }

  const { data: signInData, error: signInError } = await supabaseAuthClient.auth.signInWithPassword({
    email: normalizedEmail,
    password
  });

  if (signInError || !signInData?.session?.access_token || !signInData?.user?.id) {
    logAdminLoginDebug("Supabase auth success: no");
    logAdminLoginDebug("Login response: 401");
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const authUserId = signInData.user.id;
  const authEmail = normalizeEmail(signInData.user.email || normalizedEmail);
  logAdminLoginDebug("Supabase auth success: yes");
  logAdminLoginDebug(`Supabase user id: ${authUserId}`);

  let profile;
  try {
    profile = await loadAdminProfileForAuthUser({
      authUserId,
      email: authEmail,
      allowOfficialAutoRepair: authEmail === OFFICIAL_ADMIN_EMAIL,
      logDebug: true
    });
    throwProfileError(profile);
  } catch (error) {
    if (!(error instanceof AppError) && env.nodeEnv === "development") {
      console.log(`Admin profile lookup failed: ${error.message}`);
    }
    const safeError = error instanceof AppError
      ? error
      : new AppError("Admin profile not found", 403, "ADMIN_PROFILE_NOT_FOUND");
    logAdminLoginDebug(`Login response: ${safeError.statusCode || 403}`);
    throw safeError;
  }

  logAdminLoginDebug("Login response: 200");
  return {
    token: signInData.session.access_token,
    profile
  };
}

async function verifyAdminToken(token) {
  if (!token) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (env.mockDatabaseMode) {
    const session = mockDb.store.mockTokens.get(token);
    if (!session) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    throwProfileError(session.profile);
    return session.profile;
  }

  const { data, error } = await supabaseAuthClient.auth.getUser(token);
  if (error || !data?.user?.id) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  let profile;
  try {
    profile = await loadAdminProfileForAuthUser({
      authUserId: data.user.id,
      email: data.user.email,
      allowOfficialAutoRepair: false,
      logDebug: false
    });
  } catch (error) {
    const userProfile = await crmService.findUserProfileByAuthUserId(data.user.id)
      || await crmService.findUserProfileByEmail(data.user.email);
    profile = mapUserProfileAdminAccess(userProfile);
    if (!profile) {
      throw new AppError("Admin profile not found", 403, "ADMIN_PROFILE_NOT_FOUND");
    }
  }

  throwProfileError(profile);
  return profile;
}

async function getDashboard() {
  const [{ enquiries }, { chats }] = await Promise.all([
    enquiryService.listEnquiries({ limit: 100 }),
    chatService.listChats({ limit: 100 })
  ]);

  return {
    stats: {
      totalEnquiries: enquiries.length,
      newEnquiries: enquiries.filter((item) => item.status === "new").length,
      openChats: chats.filter((item) => item.status !== "closed").length,
      closedChats: chats.filter((item) => item.status === "closed").length
    },
    recentEnquiries: enquiries.slice(0, 6),
    recentChats: chats.slice(0, 6)
  };
}

module.exports = {
  fullDashboardRoles,
  getDashboard,
  hasFullDashboardAccess,
  loadAdminProfileForAuthUser,
  loginAdmin,
  profileIsAuthorized,
  verifyAdminToken
};
