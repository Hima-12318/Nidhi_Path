'use strict';

const express = require('express');
const router  = express.Router();
const { supabaseAdmin } = require('../supabase/client');
const {
  verifyToken,
  requireAdmin,
  requireSelfOrAdmin,
} = require('../middleware/authMiddleware');

// All user-management routes require auth and admin role
// (verifyToken is applied globally in server.js; requireAdmin is per-route)

// ─── Helpers ────────────────────────────────────────────────────

// Rollback an auth user if profile creation fails
async function deleteAuthUser(authUserId) {
  try {
    await supabaseAdmin.auth.admin.deleteUser(authUserId);
  } catch (e) {
    console.error('[Users] Rollback deleteAuthUser failed:', e.message);
  }
}

// Create a Supabase auth user and return { authUserId, error }
async function createAuthUser(email, password, metadata = {}) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email.toLowerCase().trim(),
    password,
    email_confirm: true,        // skip email verification for admin-created users
    user_metadata: metadata,
  });
  if (error) return { authUserId: null, error };
  return { authUserId: data.user.id, error: null };
}

// Build a safe profile select for list endpoints
const PROFILE_SELECT_BASIC = `
  id, full_name, email, mobile, role, client_type, status,
  commission_percentage, commission_type, commission_fixed_amount,
  designation, department, company_name, city, state, website, notes,
  created_at, updated_at, created_by
`;

// ─── POST /api/users/student ────────────────────────────────────
// Create student: Supabase auth user → profiles row → student_details row
// Body: { full_name, email, temporaryPassword, mobile?,
//         university_applied?, country?, course?,
//         loan_amount_needed?, source_client_id?, assigned_employee_id?,
//         lead_status?, priority? }
router.post('/student', verifyToken, requireAdmin, async (req, res) => {
  const {
    full_name, email, temporaryPassword, mobile,
    university_applied, country, course,
    loan_amount_needed, source_client_id, assigned_employee_id,
    lead_status = 'New', priority = 'Normal', internal_notes,
  } = req.body;

  if (!full_name || !email || !temporaryPassword) {
    return res.status(400).json({
      success: false,
      error: 'full_name, email and temporaryPassword are required.',
    });
  }
  if (temporaryPassword.length < 8) {
    return res.status(400).json({ success: false, error: 'Password must be at least 8 characters.' });
  }

  // Step 1: Create Supabase auth user
  const { authUserId, error: authErr } = await createAuthUser(
    email, temporaryPassword,
    { full_name, role: 'student' }
  );
  if (authErr) {
    const msg = authErr.message || '';
    if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('registered')) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }
    return res.status(400).json({ success: false, error: authErr.message });
  }

  // Step 2: Insert profile row
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from('profiles')
    .insert({
      id:         authUserId,
      full_name:  full_name.trim(),
      email:      email.toLowerCase().trim(),
      mobile:     mobile || null,
      role:       'student',
      status:     'active',
      created_by: req.user.id,
    })
    .select(PROFILE_SELECT_BASIC)
    .single();

  if (profileErr) {
    await deleteAuthUser(authUserId);
    return res.status(500).json({ success: false, error: profileErr.message });
  }

  // Step 3: Generate application ID
  let application_id = null;
  try {
    const { data: appId } = await supabaseAdmin.rpc('generate_application_id');
    application_id = appId;
  } catch {}

  // Step 4: Insert student_details row
  const { data: studentDetails, error: sdErr } = await supabaseAdmin
    .from('student_details')
    .insert({
      student_id:           authUserId,
      university_applied:   university_applied    || null,
      country:              country               || null,
      course:               course                || null,
      loan_amount_needed:   loan_amount_needed    ? Number(loan_amount_needed) : 0,
      source_client_id:     source_client_id      || null,
      assigned_employee_id: assigned_employee_id  || null,
      lead_status,
      student_visible_status: 'New',
      priority,
      internal_notes:       internal_notes        || null,
      application_id,
    })
    .select()
    .single();

  if (sdErr) {
    // Profile was created — don't rollback, just warn
    console.error('[Users] student_details insert failed:', sdErr.message);
  }

  // Step 5: Auto-create commission record if source_client_id present
  if (source_client_id && studentDetails) {
    const { data: clientProfile } = await supabaseAdmin
      .from('profiles')
      .select('client_type, commission_type, commission_percentage, commission_fixed_amount')
      .eq('id', source_client_id)
      .maybeSingle();

    if (clientProfile && !['self_own', 'online_reference'].includes(clientProfile.client_type)) {
      await supabaseAdmin.from('commissions').insert({
        student_id:            authUserId,
        client_id:             source_client_id,
        commission_type:       clientProfile.commission_type       || 'not_applicable',
        commission_percentage: clientProfile.commission_percentage || 0,
        commission_fixed_amount: clientProfile.commission_fixed_amount || 0,
        commission_status:     clientProfile.commission_type !== 'not_applicable' ? 'Due' : 'Not Applicable',
      });
    }

    // Employee reference incentive
    if (clientProfile?.client_type === 'employee_reference' && assigned_employee_id) {
      await supabaseAdmin.from('employee_incentives').insert({
        employee_id:      assigned_employee_id,
        student_id:       authUserId,
        incentive_amount: 5000,
        incentive_status: 'Pending',
      });
    }
  }

  return res.status(201).json({
    success: true,
    message: `Student account created for ${full_name}. Share the temporary password securely.`,
    user:    profile,
    student_details: studentDetails,
  });
});

// ─── POST /api/users/client ─────────────────────────────────────
// Body: { full_name, email, temporaryPassword, mobile?,
//         client_type*, commission_type?, commission_percentage?,
//         commission_fixed_amount?, company_name?, city?, state?, website?,
//         bank_account_name?, bank_account_number?, bank_ifsc?, upi_id? }
router.post('/client', verifyToken, requireAdmin, async (req, res) => {
  const {
    full_name, email, temporaryPassword, mobile,
    client_type, commission_type = 'not_applicable',
    commission_percentage = 0, commission_fixed_amount = 0,
    company_name, designation, city, state, website, notes,
    bank_account_name, bank_account_number, bank_ifsc, upi_id,
  } = req.body;

  const VALID_CLIENT_TYPES = ['connector','consultant','self_own','employee_reference','online_reference','banker_reference'];

  if (!full_name || !email || !client_type) {
    return res.status(400).json({
      success: false,
      error: 'full_name, email and client_type are required.',
    });
  }
  if (!VALID_CLIENT_TYPES.includes(client_type)) {
    return res.status(400).json({
      success: false,
      error: `Invalid client_type. Must be one of: ${VALID_CLIENT_TYPES.join(', ')}`,
    });
  }

  // Source-only clients (self_own, online_reference) may not need a login
  const needsLogin = !['self_own', 'online_reference'].includes(client_type);
  if (needsLogin && !temporaryPassword) {
    return res.status(400).json({ success: false, error: 'temporaryPassword is required for this client type.' });
  }
  if (temporaryPassword && temporaryPassword.length < 8) {
    return res.status(400).json({ success: false, error: 'Password must be at least 8 characters.' });
  }

  let authUserId = null;

  if (needsLogin) {
    const { authUserId: uid, error: authErr } = await createAuthUser(
      email, temporaryPassword,
      { full_name, role: 'client', client_type }
    );
    if (authErr) {
      const msg = authErr.message || '';
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('registered')) {
        return res.status(409).json({ success: false, error: 'Email already registered.' });
      }
      return res.status(400).json({ success: false, error: authErr.message });
    }
    authUserId = uid;
  }

  // If no login, generate a deterministic UUID placeholder linked to the email
  // (We still insert a profiles row for FK references)
  if (!authUserId) {
    // Create a passwordless auth user (email confirmed, no password needed)
    const { data, error: anonErr } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      email_confirm: true,
      user_metadata: { full_name, role: 'client', client_type, source_only: true },
    });
    if (anonErr) {
      const msg = anonErr.message || '';
      if (msg.toLowerCase().includes('already')) {
        return res.status(409).json({ success: false, error: 'Email already registered.' });
      }
      return res.status(400).json({ success: false, error: anonErr.message });
    }
    authUserId = data.user.id;
  }

  const { data: profile, error: profileErr } = await supabaseAdmin
    .from('profiles')
    .insert({
      id:                       authUserId,
      full_name:                full_name.trim(),
      email:                    email.toLowerCase().trim(),
      mobile:                   mobile              || null,
      role:                     'client',
      client_type,
      status:                   'active',
      commission_type,
      commission_percentage:    Number(commission_percentage) || 0,
      commission_fixed_amount:  Number(commission_fixed_amount) || 0,
      company_name:             company_name        || null,
      designation:              designation         || null,
      city:                     city                || null,
      state:                    state               || null,
      website:                  website             || null,
      notes:                    notes               || null,
      bank_account_name:        bank_account_name   || null,
      bank_account_number:      bank_account_number || null,
      bank_ifsc:                bank_ifsc           || null,
      upi_id:                   upi_id              || null,
      created_by:               req.user.id,
    })
    .select(PROFILE_SELECT_BASIC)
    .single();

  if (profileErr) {
    await deleteAuthUser(authUserId);
    return res.status(500).json({ success: false, error: profileErr.message });
  }

  return res.status(201).json({
    success: true,
    message: `Client "${full_name}" (${client_type}) created successfully.`,
    user:    profile,
  });
});

// ─── POST /api/users/employee ───────────────────────────────────
// Body: { full_name, email, temporaryPassword, mobile?,
//         designation?, department? }
router.post('/employee', verifyToken, requireAdmin, async (req, res) => {
  const { full_name, email, temporaryPassword, mobile, designation, department } = req.body;

  if (!full_name || !email || !temporaryPassword) {
    return res.status(400).json({
      success: false,
      error: 'full_name, email and temporaryPassword are required.',
    });
  }
  if (temporaryPassword.length < 8) {
    return res.status(400).json({ success: false, error: 'Password must be at least 8 characters.' });
  }

  const { authUserId, error: authErr } = await createAuthUser(
    email, temporaryPassword,
    { full_name, role: 'employee' }
  );
  if (authErr) {
    const msg = authErr.message || '';
    if (msg.toLowerCase().includes('already')) {
      return res.status(409).json({ success: false, error: 'Email already registered.' });
    }
    return res.status(400).json({ success: false, error: authErr.message });
  }

  const { data: profile, error: profileErr } = await supabaseAdmin
    .from('profiles')
    .insert({
      id:          authUserId,
      full_name:   full_name.trim(),
      email:       email.toLowerCase().trim(),
      mobile:      mobile      || null,
      role:        'employee',
      status:      'active',
      designation: designation || null,
      department:  department  || null,
      created_by:  req.user.id,
    })
    .select(PROFILE_SELECT_BASIC)
    .single();

  if (profileErr) {
    await deleteAuthUser(authUserId);
    return res.status(500).json({ success: false, error: profileErr.message });
  }

  return res.status(201).json({
    success: true,
    message: `Employee "${full_name}" created successfully. Share the temporary password securely.`,
    user:    profile,
  });
});

// ─── POST /api/users/board ──────────────────────────────────────
// Body: { full_name, email, temporaryPassword, mobile?, designation? }
router.post('/board', verifyToken, requireAdmin, async (req, res) => {
  const { full_name, email, temporaryPassword, mobile, designation } = req.body;

  if (!full_name || !email || !temporaryPassword) {
    return res.status(400).json({
      success: false,
      error: 'full_name, email and temporaryPassword are required.',
    });
  }
  if (temporaryPassword.length < 8) {
    return res.status(400).json({ success: false, error: 'Password must be at least 8 characters.' });
  }

  const { authUserId, error: authErr } = await createAuthUser(
    email, temporaryPassword,
    { full_name, role: 'board_member' }
  );
  if (authErr) {
    const msg = authErr.message || '';
    if (msg.toLowerCase().includes('already')) {
      return res.status(409).json({ success: false, error: 'Email already registered.' });
    }
    return res.status(400).json({ success: false, error: authErr.message });
  }

  const { data: profile, error: profileErr } = await supabaseAdmin
    .from('profiles')
    .insert({
      id:          authUserId,
      full_name:   full_name.trim(),
      email:       email.toLowerCase().trim(),
      mobile:      mobile      || null,
      role:        'board_member',
      status:      'active',
      designation: designation || null,
      created_by:  req.user.id,
    })
    .select(PROFILE_SELECT_BASIC)
    .single();

  if (profileErr) {
    await deleteAuthUser(authUserId);
    return res.status(500).json({ success: false, error: profileErr.message });
  }

  return res.status(201).json({
    success: true,
    message: `Board member "${full_name}" created successfully.`,
    user:    profile,
  });
});

// ─── GET /api/users/students ─────────────────────────────────────
// Returns all student profiles joined with their student_details row.
// Query params: ?status=active&search=&limit=50&offset=0
router.get('/students', verifyToken, requireAdmin, async (req, res) => {
  const { status, search, limit = 50, offset = 0 } = req.query;

  try {
    let query = supabaseAdmin
      .from('profiles')
      .select(`
        ${PROFILE_SELECT_BASIC},
        student_details (
          id, university_applied, country, course,
          loan_amount_needed, loan_amount_sanctioned, bank_applied,
          lead_status, student_visible_status, priority,
          next_follow_up, application_id,
          source_client:source_client_id(id, full_name, client_type),
          assigned_employee:assigned_employee_id(id, full_name)
        )
      `)
      .eq('role', 'student')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (status) query = query.eq('status', status);
    if (search) {
      const term = search.trim().replace(/[%_]/g, '');
      query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%,mobile.ilike.%${term}%`);
    }

    const { data, error, count } = await query;
    if (error) return res.status(500).json({ success: false, error: error.message });

    return res.status(200).json({
      success: true,
      students: data,
      total:    count ?? data.length,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/users/clients ──────────────────────────────────────
// Query params: ?type=connector&status=active&search=&limit=50&offset=0
router.get('/clients', verifyToken, requireAdmin, async (req, res) => {
  const { type, status, search, limit = 100, offset = 0 } = req.query;

  try {
    let query = supabaseAdmin
      .from('profiles')
      .select(PROFILE_SELECT_BASIC, { count: 'exact' })
      .eq('role', 'client')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (type)   query = query.eq('client_type', type);
    if (status) query = query.eq('status', status);
    if (search) {
      const term = search.trim().replace(/[%_]/g, '');
      query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%,company_name.ilike.%${term}%`);
    }

    const { data, error, count } = await query;
    if (error) return res.status(500).json({ success: false, error: error.message });

    // Enrich with lead count per client
    const clientIds = (data || []).map(c => c.id);
    let leadCounts = {};
    if (clientIds.length) {
      const { data: leads } = await supabaseAdmin
        .from('student_details')
        .select('source_client_id')
        .in('source_client_id', clientIds);
      (leads || []).forEach(l => {
        leadCounts[l.source_client_id] = (leadCounts[l.source_client_id] || 0) + 1;
      });
    }

    const enriched = (data || []).map(c => ({
      ...c,
      total_leads: leadCounts[c.id] || 0,
    }));

    return res.status(200).json({
      success: true,
      clients: enriched,
      total:   count ?? data.length,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/users/employees ────────────────────────────────────
// Query params: ?status=active&search=&limit=100&offset=0
router.get('/employees', verifyToken, requireAdmin, async (req, res) => {
  const { status, search, limit = 100, offset = 0 } = req.query;

  try {
    let query = supabaseAdmin
      .from('profiles')
      .select(PROFILE_SELECT_BASIC, { count: 'exact' })
      .eq('role', 'employee')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (status) query = query.eq('status', status);
    if (search) {
      const term = search.trim().replace(/[%_]/g, '');
      query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
    }

    const { data, error, count } = await query;
    if (error) return res.status(500).json({ success: false, error: error.message });

    // Enrich with assigned lead count
    const empIds = (data || []).map(e => e.id);
    let assignedCounts = {};
    if (empIds.length) {
      const { data: leads } = await supabaseAdmin
        .from('student_details')
        .select('assigned_employee_id')
        .in('assigned_employee_id', empIds);
      (leads || []).forEach(l => {
        assignedCounts[l.assigned_employee_id] = (assignedCounts[l.assigned_employee_id] || 0) + 1;
      });
    }

    return res.status(200).json({
      success:   true,
      employees: (data || []).map(e => ({ ...e, assigned_leads: assignedCounts[e.id] || 0 })),
      total:     count ?? data.length,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/users/board ────────────────────────────────────────
router.get('/board', verifyToken, requireAdmin, async (req, res) => {
  const { status, limit = 50, offset = 0 } = req.query;

  try {
    let query = supabaseAdmin
      .from('profiles')
      .select(PROFILE_SELECT_BASIC, { count: 'exact' })
      .eq('role', 'board_member')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;
    if (error) return res.status(500).json({ success: false, error: error.message });

    return res.status(200).json({
      success:       true,
      board_members: data,
      total:         count ?? data.length,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/users/:id ──────────────────────────────────────────
// Admin can fetch any user; others can only fetch themselves.
router.get('/:id', verifyToken, requireSelfOrAdmin('id'), async (req, res) => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select(`${PROFILE_SELECT_BASIC}, bank_account_name, bank_account_number, bank_ifsc, upi_id`)
      .eq('id', req.params.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    // Fetch related records based on role
    let extra = {};
    if (profile.role === 'student') {
      const { data: sd } = await supabaseAdmin
        .from('student_details')
        .select(`
          *, source_client:source_client_id(id, full_name, client_type),
          assigned_employee:assigned_employee_id(id, full_name)
        `)
        .eq('student_id', profile.id)
        .maybeSingle();
      extra.student_details = sd;
    }
    if (profile.role === 'client') {
      const { data: comms } = await supabaseAdmin
        .from('commissions')
        .select('commission_status, commission_earned, commission_due, commission_paid')
        .eq('client_id', profile.id);
      const summary = (comms || []).reduce((acc, c) => {
        acc.total_earned += Number(c.commission_earned || 0);
        acc.total_due    += Number(c.commission_due    || 0);
        acc.total_paid   += Number(c.commission_paid   || 0);
        return acc;
      }, { total_earned: 0, total_due: 0, total_paid: 0 });
      extra.commission_summary = summary;
    }

    return res.status(200).json({ success: true, user: profile, ...extra });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── PATCH /api/users/:id ─────────────────────────────────────────
// Admin can update any profile field.
// Users can update limited fields on their own profile.
router.patch('/:id', verifyToken, requireSelfOrAdmin('id'), async (req, res) => {
  const isAdmin     = req.user.role === 'admin';
  const isSelfPatch = req.user.id === req.params.id;

  // Fields admin can update
  const adminFields = [
    'full_name', 'mobile', 'status', 'client_type',
    'commission_type', 'commission_percentage', 'commission_fixed_amount',
    'bank_account_name', 'bank_account_number', 'bank_ifsc', 'upi_id',
    'designation', 'department', 'company_name', 'city', 'state',
    'website', 'notes', 'assigned_employee_id',
  ];
  // Fields any user can update on their own profile
  const selfFields = ['mobile', 'city', 'state', 'website'];

  const allowedFields = isAdmin ? adminFields : selfFields;
  const payload       = {};

  allowedFields.forEach(key => {
    if (req.body[key] !== undefined) {
      payload[key] = req.body[key] === '' ? null : req.body[key];
    }
  });

  if (Object.keys(payload).length === 0) {
    return res.status(400).json({ success: false, error: 'No valid fields provided to update.' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(payload)
      .eq('id', req.params.id)
      .select(PROFILE_SELECT_BASIC)
      .single();

    if (error) return res.status(500).json({ success: false, error: error.message });
    return res.status(200).json({ success: true, user: data, message: 'Profile updated.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── DELETE /api/users/:id ────────────────────────────────────────
// Soft delete: sets status='inactive'. Preserves all data.
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  // Don't let admin delete themselves
  if (req.params.id === req.user.id) {
    return res.status(400).json({ success: false, error: 'You cannot deactivate your own account.' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ status: 'inactive' })
      .eq('id', req.params.id)
      .select('id, full_name, email, role, status')
      .single();

    if (error) return res.status(500).json({ success: false, error: error.message });
    if (!data)  return res.status(404).json({ success: false, error: 'User not found.' });

    return res.status(200).json({
      success: true,
      message: `User "${data.full_name}" has been deactivated.`,
      user:    data,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/users/dropdown/clients ────────────────────────────
// Minimal client list for select dropdowns in the admin forms
router.get('/dropdown/clients', verifyToken, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email, client_type, commission_type, commission_percentage, commission_fixed_amount')
    .eq('role', 'client')
    .eq('status', 'active')
    .order('full_name');

  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.status(200).json({ success: true, clients: data });
});

// ─── GET /api/users/dropdown/employees ──────────────────────────
// Minimal employee list for select dropdowns
router.get('/dropdown/employees', verifyToken, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email, mobile')
    .eq('role', 'employee')
    .eq('status', 'active')
    .order('full_name');

  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.status(200).json({ success: true, employees: data });
});

module.exports = router;
