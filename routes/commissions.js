'use strict';

const express = require('express');
const router  = express.Router();
const { supabaseAdmin } = require('../supabase/client');
const {
  verifyToken,
  requireAdmin,
} = require('../middleware/authMiddleware');

// Full commission select with joined student and client names
const COMM_SELECT = `
  id, commission_type, commission_percentage, commission_fixed_amount,
  commission_earned, commission_due, commission_paid, commission_status,
  payment_date, payment_reference, notes,
  created_at, updated_at,
  student:student_id(id, full_name, email),
  client:client_id(id, full_name, email, client_type)
`;

// ─── GET /api/commissions ───────────────────────────────────────
// admin       → all commission records (filterable)
// client      → only commissions where client_id = their id
// others      → 403
//
// Query params: ?status=Due&client_id=&student_id=&limit=100&offset=0
router.get('/', verifyToken, async (req, res) => {
  const caller = req.user;

  if (!['admin', 'client', 'board_member'].includes(caller.role)) {
    return res.status(403).json({ success: false, error: 'Access denied.' });
  }

  const { status, client_id, student_id, limit = 100, offset = 0 } = req.query;

  try {
    let query = supabaseAdmin
      .from('commissions')
      .select(COMM_SELECT, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    // Scope to the client's own records
    if (caller.role === 'client') {
      query = query.eq('client_id', caller.id);
    } else {
      // Admin / board can filter optionally
      if (client_id)  query = query.eq('client_id', client_id);
      if (student_id) query = query.eq('student_id', student_id);
    }

    if (status) query = query.eq('commission_status', status);

    const { data, error, count } = await query;
    if (error) return res.status(500).json({ success: false, error: error.message });

    return res.status(200).json({
      success:     true,
      commissions: data || [],
      total:       count ?? (data || []).length,
    });

  } catch (err) {
    console.error('[Commissions] GET / error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/commissions ──────────────────────────────────────
// Create a commission record linked to a student + client.
// Admin only. Usually auto-created when a lead is created, but can be
// created manually for adjustments.
// Body: { student_id, client_id, commission_type, commission_percentage?,
//         commission_fixed_amount?, notes? }
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  const {
    student_id, client_id,
    commission_type = 'not_applicable',
    commission_percentage  = 0,
    commission_fixed_amount = 0,
    notes,
  } = req.body;

  if (!student_id || !client_id) {
    return res.status(400).json({
      success: false,
      error: 'student_id and client_id are required.',
    });
  }

  const VALID_TYPES = ['percentage', 'fixed', 'not_applicable'];
  if (!VALID_TYPES.includes(commission_type)) {
    return res.status(400).json({
      success: false,
      error: `commission_type must be one of: ${VALID_TYPES.join(', ')}`,
    });
  }

  // Check for duplicate
  const { data: existing } = await supabaseAdmin
    .from('commissions')
    .select('id')
    .eq('student_id', student_id)
    .eq('client_id', client_id)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({
      success: false,
      error: 'A commission record already exists for this student-client pair.',
    });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('commissions')
      .insert({
        student_id,
        client_id,
        commission_type,
        commission_percentage:   Number(commission_percentage)   || 0,
        commission_fixed_amount: Number(commission_fixed_amount) || 0,
        commission_earned:       0,
        commission_due:          0,
        commission_paid:         0,
        commission_status:       commission_type !== 'not_applicable' ? 'Due' : 'Not Applicable',
        notes: notes || null,
      })
      .select(COMM_SELECT)
      .single();

    if (error) return res.status(500).json({ success: false, error: error.message });

    return res.status(201).json({
      success:    true,
      message:    'Commission record created.',
      commission: data,
    });

  } catch (err) {
    console.error('[Commissions] POST / error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── PATCH /api/commissions/:id ─────────────────────────────────
// Update commission payment status, paid amount, payment date.
// Admin only.
// Body: { commission_status?, commission_paid?, payment_date?,
//         payment_reference?, notes?, commission_earned? }
router.patch('/:id', verifyToken, requireAdmin, async (req, res) => {
  const VALID_STATUSES = ['Due', 'Paid', 'Hold', 'Not Applicable'];
  const {
    commission_status, commission_paid, payment_date,
    payment_reference, notes, commission_earned,
  } = req.body;

  // Fetch existing to recalculate due
  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from('commissions')
    .select('id, commission_earned, commission_paid, commission_status')
    .eq('id', req.params.id)
    .maybeSingle();

  if (fetchErr || !existing) {
    return res.status(404).json({ success: false, error: 'Commission record not found.' });
  }

  if (commission_status && !VALID_STATUSES.includes(commission_status)) {
    return res.status(400).json({
      success: false,
      error: `commission_status must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  // Build update payload
  const payload = {};
  if (commission_status !== undefined) payload.commission_status = commission_status;
  if (payment_date      !== undefined) payload.payment_date      = payment_date || null;
  if (payment_reference !== undefined) payload.payment_reference = payment_reference || null;
  if (notes             !== undefined) payload.notes             = notes || null;

  // Recalculate commission_due when earned or paid changes
  const newEarned = commission_earned !== undefined
    ? Number(commission_earned)
    : Number(existing.commission_earned || 0);

  const newPaid = commission_paid !== undefined
    ? Number(commission_paid)
    : Number(existing.commission_paid || 0);

  if (commission_earned !== undefined) payload.commission_earned = newEarned;
  if (commission_paid   !== undefined) payload.commission_paid   = newPaid;
  payload.commission_due = Math.max(0, newEarned - newPaid);

  // Auto-set status to Paid if full amount is paid
  if (newPaid >= newEarned && newEarned > 0 && !commission_status) {
    payload.commission_status = 'Paid';
  }

  if (Object.keys(payload).length === 0) {
    return res.status(400).json({ success: false, error: 'No valid fields to update.' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('commissions')
      .update(payload)
      .eq('id', req.params.id)
      .select(COMM_SELECT)
      .single();

    if (error) return res.status(500).json({ success: false, error: error.message });

    return res.status(200).json({
      success:    true,
      message:    'Commission record updated.',
      commission: data,
    });

  } catch (err) {
    console.error('[Commissions] PATCH /:id error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/commissions/summary ──────────────────────────────
// Aggregated commission totals.
// admin       → totals across all records (optional ?client_id= filter)
// client      → totals for their own records
// board       → all totals (read-only)
router.get('/summary', verifyToken, async (req, res) => {
  const caller = req.user;

  if (!['admin', 'client', 'board_member'].includes(caller.role)) {
    return res.status(403).json({ success: false, error: 'Access denied.' });
  }

  const { client_id } = req.query;

  try {
    let query = supabaseAdmin
      .from('commissions')
      .select('commission_status, commission_earned, commission_due, commission_paid, client_id');

    if (caller.role === 'client') {
      query = query.eq('client_id', caller.id);
    } else if (client_id) {
      query = query.eq('client_id', client_id);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ success: false, error: error.message });

    const rows = data || [];

    // Aggregate by status
    const byStatus = rows.reduce((acc, r) => {
      acc[r.commission_status] = (acc[r.commission_status] || 0) + 1;
      return acc;
    }, {});

    const summary = {
      total_records: rows.length,
      total_earned:  rows.reduce((s, r) => s + Number(r.commission_earned || 0), 0),
      total_due:     rows.reduce((s, r) => s + Number(r.commission_due    || 0), 0),
      total_paid:    rows.reduce((s, r) => s + Number(r.commission_paid   || 0), 0),
      by_status:     byStatus,
    };

    // Per-client breakdown (admin / board only)
    let byClient = null;
    if (caller.role !== 'client') {
      const clientMap = {};
      rows.forEach(r => {
        if (!r.client_id) return;
        if (!clientMap[r.client_id]) {
          clientMap[r.client_id] = { client_id: r.client_id, earned: 0, due: 0, paid: 0 };
        }
        clientMap[r.client_id].earned += Number(r.commission_earned || 0);
        clientMap[r.client_id].due    += Number(r.commission_due    || 0);
        clientMap[r.client_id].paid   += Number(r.commission_paid   || 0);
      });
      byClient = Object.values(clientMap);
    }

    return res.status(200).json({
      success: true,
      summary,
      by_client: byClient,
    });

  } catch (err) {
    console.error('[Commissions] GET /summary error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/commissions/incentives/list ───────────────────────
// Employee reference incentives (₹5,000 per successful reference).
//   employee     → only their own incentives
//   admin / board→ all incentives
//   others       → 403
router.get('/incentives/list', verifyToken, async (req, res) => {
  const caller = req.user;
  if (!['admin', 'employee', 'board_member'].includes(caller.role)) {
    return res.status(403).json({ success: false, error: 'Access denied.' });
  }

  try {
    let query = supabaseAdmin
      .from('employee_incentives')
      .select(`
        id, incentive_amount, incentive_status, payment_date, notes, created_at,
        employee:employee_id(id, full_name),
        student:student_id(id, full_name)
      `)
      .order('created_at', { ascending: false });

    // Employees see only their own incentives
    if (caller.role === 'employee') {
      query = query.eq('employee_id', caller.id);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ success: false, error: error.message });

    return res.status(200).json({ success: true, incentives: data || [] });
  } catch (err) {
    console.error('[Commissions] GET /incentives/list error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── PATCH /api/commissions/incentives/:id ──────────────────────
// Admin marks an employee incentive as Paid / Pending.
// Body: { incentive_status, payment_date? }
router.patch('/incentives/:id', verifyToken, requireAdmin, async (req, res) => {
  const VALID = ['Pending', 'Paid'];
  const { incentive_status, payment_date } = req.body;

  if (incentive_status && !VALID.includes(incentive_status)) {
    return res.status(400).json({ success: false, error: `incentive_status must be one of: ${VALID.join(', ')}` });
  }

  const payload = {};
  if (incentive_status !== undefined) payload.incentive_status = incentive_status;
  if (payment_date     !== undefined) payload.payment_date     = payment_date || null;

  if (Object.keys(payload).length === 0) {
    return res.status(400).json({ success: false, error: 'No valid fields to update.' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('employee_incentives')
      .update(payload)
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) return res.status(500).json({ success: false, error: error.message });
    return res.status(200).json({ success: true, incentive: data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
