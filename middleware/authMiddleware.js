'use strict';

const { supabaseAdmin } = require('../supabase/client');

// ─── Helpers ───────────────────────────────────────────────────

function unauthorized(res, message = 'Authentication required.') {
  return res.status(401).json({ success: false, error: message });
}

function forbidden(res, message = 'Access denied.') {
  return res.status(403).json({ success: false, error: message });
}

// ─── extractToken ──────────────────────────────────────────────
// Reads the Bearer JWT from the Authorization header.
function extractToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7).trim();
  return null;
}

// ─── verifyToken ───────────────────────────────────────────────
// Verifies the JWT with Supabase and fetches the matching profile.
// Attaches req.user = { id, email, role, client_type, full_name, status }
// This is the base middleware — use role guards on top of it.
async function verifyToken(req, res, next) {
  const token = extractToken(req);
  if (!token) return unauthorized(res, 'No authentication token provided.');

  try {
    // 1. Verify the JWT with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authData?.user?.id) {
      return unauthorized(res, 'Invalid or expired session. Please log in again.');
    }

    const authUser = authData.user;

    // 2. Fetch the user's profile row (contains role, client_type, status)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, mobile, role, client_type, status')
      .eq('id', authUser.id)
      .maybeSingle();

    if (profileError) {
      console.error('[Auth] Profile fetch error:', profileError.message);
      return res.status(500).json({ success: false, error: 'Could not load user profile.' });
    }

    if (!profile) {
      return unauthorized(res, 'User profile not found. Please contact your administrator.');
    }

    // 3. Block inactive / suspended accounts
    if (profile.status === 'inactive') {
      return forbidden(res, 'Your account is inactive. Please contact your administrator.');
    }
    if (profile.status === 'suspended') {
      return forbidden(res, 'Your account has been suspended. Please contact your administrator.');
    }

    // 4. Attach to request for downstream handlers
    req.user = {
      id:          profile.id,
      email:       profile.email,
      full_name:   profile.full_name,
      mobile:      profile.mobile,
      role:        profile.role,
      client_type: profile.client_type,
      status:      profile.status,
    };
    req.token = token;

    return next();
  } catch (err) {
    console.error('[Auth] verifyToken unexpected error:', err.message);
    return res.status(500).json({ success: false, error: 'Authentication check failed.' });
  }
}

// ─── Role guard factory ────────────────────────────────────────
// Creates a middleware that allows only the specified roles.
// Must be used AFTER verifyToken.
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorized(res, 'Not authenticated.');
    }
    if (!allowedRoles.includes(req.user.role)) {
      return forbidden(
        res,
        `Access denied. This action requires role: ${allowedRoles.join(' or ')}.`
      );
    }
    return next();
  };
}

// ─── Named role guards ─────────────────────────────────────────
// admin: full platform access
const requireAdmin = requireRole('admin');

// employee: CRM-level access (admin also passes)
const requireEmployee = requireRole('admin', 'employee');

// client: reference partner portal access
const requireClient = requireRole('admin', 'client');

// student: student portal access (very restricted)
const requireStudent = requireRole('admin', 'student');

// board: read-only intelligence access
const requireBoard = requireRole('admin', 'board_member');

// Any authenticated user (all roles)
const requireAnyRole = (req, res, next) => {
  if (!req.user) return unauthorized(res);
  return next();
};

// ─── Ownership guard ───────────────────────────────────────────
// Verifies that req.user.id matches the requested resource ID,
// OR the user is an admin. Use for user-specific GET/PATCH routes.
function requireSelfOrAdmin(paramName = 'id') {
  return (req, res, next) => {
    if (!req.user) return unauthorized(res);
    const resourceId = req.params[paramName];
    if (req.user.role === 'admin' || req.user.id === resourceId) {
      return next();
    }
    return forbidden(res, 'You can only access your own data.');
  };
}

module.exports = {
  verifyToken,
  requireRole,
  requireAdmin,
  requireEmployee,
  requireClient,
  requireStudent,
  requireBoard,
  requireAnyRole,
  requireSelfOrAdmin,
};
