'use strict';

const express  = require('express');
const router   = express.Router();
const rateLimit = require('express-rate-limit');
const { supabaseAdmin, supabasePublic } = require('../supabase/client');
const { verifyToken } = require('../middleware/authMiddleware');

// ─── Login brute-force protection ──────────────────────────────
// Limits FAILED login attempts per IP. Successful logins don't count
// (skipSuccessfulRequests), so a busy office behind one NAT IP is not
// locked out during normal use. Relies on app.set('trust proxy', 1).
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                  // 10 failed attempts per IP per window
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many login attempts. Please wait 15 minutes and try again.',
  },
});

// ─── Role → dashboard redirect map ────────────────────────────
const DASHBOARD_REDIRECTS = {
  admin:        '/admin/dashboard.html',
  employee:     '/employee/dashboard.html',
  board_member: '/board/dashboard.html',
  client:       '/client/dashboard.html',
  student:      '/student/dashboard.html',
};

// ─── POST /api/auth/login ──────────────────────────────────────
// Body: { email: string, password: string }
// Returns: { success, token, user: { id, email, full_name, role, client_type, mobile }, redirectTo }
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required.',
    });
  }

  try {
    // 1. Authenticate with Supabase
    const { data: authData, error: authError } =
      await supabasePublic.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

    if (authError || !authData?.session?.access_token) {
      // Supabase returns a generic error for invalid credentials
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const session  = authData.session;
    const authUser = authData.user;

    // 2. Fetch user profile (role, status, client_type, etc.)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, mobile, role, client_type, status, commission_percentage')
      .eq('id', authUser.id)
      .maybeSingle();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found. Please contact your administrator.',
      });
    }

    // 3. Block inactive/suspended accounts
    if (profile.status === 'inactive') {
      return res.status(403).json({
        success: false,
        error: 'Your account is inactive. Please contact your administrator.',
      });
    }
    if (profile.status === 'suspended') {
      return res.status(403).json({
        success: false,
        error: 'Your account has been suspended. Please contact your administrator.',
      });
    }

    // 4. Return token + profile + redirect
    return res.status(200).json({
      success:    true,
      token:      session.access_token,
      expires_at: session.expires_at,
      user: {
        id:                   profile.id,
        email:                profile.email,
        full_name:            profile.full_name,
        mobile:               profile.mobile,
        role:                 profile.role,
        client_type:          profile.client_type,
        status:               profile.status,
        commission_percentage: profile.commission_percentage,
      },
      redirectTo: DASHBOARD_REDIRECTS[profile.role] || '/',
    });

  } catch (err) {
    console.error('[Auth] Login error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.',
    });
  }
});

// ─── POST /api/auth/logout ─────────────────────────────────────
// Invalidates the current session.
// Requires a valid Bearer token.
router.post('/logout', verifyToken, async (req, res) => {
  try {
    // Sign out using the admin client so the session is revoked server-side
    await supabaseAdmin.auth.admin.signOut(req.token);
    return res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    // Even if revocation fails, the client should clear its local token
    console.error('[Auth] Logout error:', err.message);
    return res.status(200).json({ success: true, message: 'Logged out.' });
  }
});

// ─── GET /api/auth/me ──────────────────────────────────────────
// Returns the current user's profile from the verified token.
// Includes student_details if the user is a student.
router.get('/me', verifyToken, async (req, res) => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        id, full_name, email, mobile, role, client_type, status,
        commission_percentage, commission_type, commission_fixed_amount,
        designation, company_name, city, state, website,
        created_at, updated_at
      `)
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ success: false, error: 'Profile not found.' });
    }

    // If student, attach their student_details record
    let studentDetails = null;
    if (profile.role === 'student') {
      const { data: sd } = await supabaseAdmin
        .from('student_details')
        .select(`
          id, university_applied, country, course,
          loan_amount_needed, loan_amount_sanctioned, bank_applied,
          lead_status, student_visible_status, priority,
          next_follow_up, application_id,
          source_client:source_client_id(id, full_name, client_type),
          assigned_employee:assigned_employee_id(id, full_name)
        `)
        .eq('student_id', profile.id)
        .maybeSingle();
      studentDetails = sd;
    }

    return res.status(200).json({
      success: true,
      user:    profile,
      student_details: studentDetails,
      redirectTo: DASHBOARD_REDIRECTS[profile.role] || '/',
    });

  } catch (err) {
    console.error('[Auth] /me error:', err.message);
    return res.status(500).json({ success: false, error: 'Could not fetch profile.' });
  }
});

module.exports = router;
