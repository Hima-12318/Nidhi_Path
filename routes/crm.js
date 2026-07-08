'use strict';

const express = require('express');
const router  = express.Router();
const { supabaseAdmin } = require('../supabase/client');
const {
  verifyToken,
  requireAdmin,
  requireEmployee,
} = require('../middleware/authMiddleware');

// ─── Constants ──────────────────────────────────────────────────
const VALID_STATUSES = [
  'New', 'Registered', 'Assigned', 'Verified',
  'Documents Pending', 'Documents Received', 'Work Started', 'In Progress',
  'Follow Up', 'Bank Review', 'Sanction In Progress',
  'Sanctioned', 'Disbursed', 'Approved', 'Rejected', 'Closed',
];
const VALID_PRIORITIES  = ['Low', 'Normal', 'High', 'Urgent'];
const VALID_VISIBILITY  = ['internal_only', 'client_visible', 'student_visible', 'board_visible'];

// Statuses exposed to students (keep vague enough to not reveal internal process)
const STUDENT_VISIBLE_STATUS_MAP = {
  'New':                  'Application Received',
  'Registered':           'Application Received',
  'Assigned':             'Under Review',
  'Verified':             'Under Review',
  'Documents Pending':    'Documents Required',
  'Documents Received':   'Documents Submitted',
  'Work Started':         'Processing Started',
  'In Progress':          'In Process',
  'Follow Up':            'In Process',
  'Bank Review':          'Bank Evaluation',
  'Sanction In Progress': 'Bank Evaluation',
  'Sanctioned':           'Loan Sanctioned',
  'Disbursed':            'Loan Disbursed',
  'Approved':             'Approved',
  'Rejected':             'Application Rejected',
  'Closed':               'Closed',
};

// Full student_details select with joined relations
const LEAD_SELECT = `
  id, application_id, lead_status, student_visible_status, priority,
  university_applied, country, course,
  loan_amount_needed, loan_amount_sanctioned, bank_applied,
  next_follow_up, rejection_reason, internal_notes,
  work_started_at, created_at, updated_at,
  student:student_id(id, full_name, email, mobile),
  source_client:source_client_id(id, full_name, email, client_type, commission_type, commission_percentage, commission_fixed_amount),
  assigned_employee:assigned_employee_id(id, full_name, email)
`;

// ─── GET /api/crm/leads ─────────────────────────────────────────
// Returns leads filtered by the caller's role:
//   admin        → all leads (with optional query filters)
//   employee     → only their assigned leads
//   client       → only leads where source_client_id = their id
//   student      → only their own lead (returns slim student-safe view)
//   board_member → all leads (read-only analytics context)
//
// Query params: ?status=&priority=&search=&limit=50&offset=0&employee_id=&client_id=
router.get('/leads', verifyToken, async (req, res) => {
  const caller = req.user;
  const {
    status, priority, search,
    limit  = 50,
    offset = 0,
    employee_id,
    client_id,
  } = req.query;

  try {
    let query = supabaseAdmin
      .from('student_details')
      .select(LEAD_SELECT, { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    // ── Role-based scoping ──
    if (caller.role === 'employee') {
      query = query.eq('assigned_employee_id', caller.id);
    } else if (caller.role === 'client') {
      query = query.eq('source_client_id', caller.id);
    } else if (caller.role === 'student') {
      query = query.eq('student_id', caller.id).limit(1);
    }
    // admin / board_member see all; may further filter via query params

    // ── Optional filters (admin / board only to prevent data leaks) ──
    if (['admin', 'board_member'].includes(caller.role)) {
      if (employee_id) query = query.eq('assigned_employee_id', employee_id);
      if (client_id)   query = query.eq('source_client_id', client_id);
    }
    if (status && VALID_STATUSES.includes(status)) {
      query = query.eq('lead_status', status);
    }
    if (priority && VALID_PRIORITIES.includes(priority)) {
      query = query.eq('priority', priority);
    }
    if (search && ['admin', 'employee', 'board_member'].includes(caller.role)) {
      // Search is done on the profiles table join — filter after fetching
      // (Supabase doesn't support ilike on joined tables easily; do in-JS)
    }

    const { data: leads, error, count } = await query;
    if (error) return res.status(500).json({ success: false, error: error.message });

    let result = leads || [];

    // ── In-JS search filter ──
    if (search && result.length) {
      const term = search.toLowerCase().trim();
      result = result.filter(l =>
        (l.student?.full_name  || '').toLowerCase().includes(term) ||
        (l.student?.email      || '').toLowerCase().includes(term) ||
        (l.student?.mobile     || '').toLowerCase().includes(term) ||
        (l.application_id      || '').toLowerCase().includes(term) ||
        (l.university_applied  || '').toLowerCase().includes(term)
      );
    }

    // ── Strip sensitive fields for students ──
    if (caller.role === 'student') {
      result = result.map(l => ({
        id:                     l.id,
        application_id:         l.application_id,
        lead_status:            l.student_visible_status || l.lead_status,
        university_applied:     l.university_applied,
        country:                l.country,
        course:                 l.course,
        loan_amount_needed:     l.loan_amount_needed,
        loan_amount_sanctioned: l.loan_amount_sanctioned,
        source_client: l.source_client
          ? { full_name: l.source_client.full_name }
          : null,
      }));
    }

    // ── Strip internal_notes for clients / board ──
    if (['client', 'board_member'].includes(caller.role)) {
      result = result.map(({ internal_notes: _dropped, ...rest }) => rest);
    }

    return res.status(200).json({
      success: true,
      leads:   result,
      total:   count ?? result.length,
    });

  } catch (err) {
    console.error('[CRM] GET /leads error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── PATCH /api/crm/leads/:id ───────────────────────────────────
// Update lead status, notes, follow-up, amounts.
// admin       → can update all fields
// employee    → can update only their assigned leads; limited field set
router.patch('/leads/:id', verifyToken, requireEmployee, async (req, res) => {
  const caller = req.user;

  // Fetch the existing lead to verify ownership / existence
  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from('student_details')
    .select('id, student_id, assigned_employee_id, lead_status, work_started_at')
    .eq('id', req.params.id)
    .maybeSingle();

  if (fetchErr || !existing) {
    return res.status(404).json({ success: false, error: 'Lead not found.' });
  }

  // Employees can only update leads assigned to them
  if (caller.role === 'employee' && existing.assigned_employee_id !== caller.id) {
    return res.status(403).json({
      success: false,
      error:   'You can only update leads assigned to you.',
    });
  }

  // Build update payload from allowed fields
  const adminOnlyFields   = ['source_client_id', 'assigned_employee_id', 'application_id'];
  const sharedFields      = [
    'lead_status', 'priority', 'next_follow_up', 'internal_notes',
    'university_applied', 'country', 'course',
    'loan_amount_needed', 'loan_amount_sanctioned', 'bank_applied',
    'rejection_reason',
  ];
  const allowedFields = caller.role === 'admin'
    ? [...adminOnlyFields, ...sharedFields]
    : sharedFields;

  const payload = {};
  allowedFields.forEach(key => {
    if (req.body[key] !== undefined) {
      payload[key] = req.body[key] === '' ? null : req.body[key];
    }
  });

  if (Object.keys(payload).length === 0) {
    return res.status(400).json({ success: false, error: 'No valid fields provided.' });
  }

  // Validate lead_status
  if (payload.lead_status && !VALID_STATUSES.includes(payload.lead_status)) {
    return res.status(400).json({
      success: false,
      error: `Invalid lead_status. Valid values: ${VALID_STATUSES.join(', ')}`,
    });
  }

  // Auto-set student_visible_status and work_started_at
  if (payload.lead_status) {
    payload.student_visible_status = STUDENT_VISIBLE_STATUS_MAP[payload.lead_status] || payload.lead_status;
    if (payload.lead_status === 'Work Started' && !existing.work_started_at) {
      payload.work_started_at = new Date().toISOString();
    }
  }

  // Numeric coercions
  ['loan_amount_needed', 'loan_amount_sanctioned'].forEach(key => {
    if (payload[key] != null) payload[key] = Number(payload[key]) || 0;
  });

  try {
    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('student_details')
      .update(payload)
      .eq('id', req.params.id)
      .select(LEAD_SELECT)
      .single();

    if (updateErr) return res.status(500).json({ success: false, error: updateErr.message });

    // Auto-update commission earned when loan is sanctioned
    if (
      payload.lead_status === 'Sanctioned' &&
      payload.loan_amount_sanctioned > 0 &&
      updated.source_client?.id
    ) {
      await recalculateCommission(existing.student_id, updated.source_client.id, Number(payload.loan_amount_sanctioned));
    }

    return res.status(200).json({
      success: true,
      message: 'Lead updated.',
      lead:    updated,
    });

  } catch (err) {
    console.error('[CRM] PATCH /leads/:id error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Recalculate commission on sanction ──────────────────────────
async function recalculateCommission(studentId, clientId, sanctionedAmount) {
  try {
    const { data: comm } = await supabaseAdmin
      .from('commissions')
      .select('id, commission_type, commission_percentage, commission_fixed_amount, commission_paid')
      .eq('student_id', studentId)
      .eq('client_id', clientId)
      .maybeSingle();

    if (!comm || comm.commission_type === 'not_applicable') return;

    let earned = 0;
    if (comm.commission_type === 'percentage') {
      earned = sanctionedAmount * Number(comm.commission_percentage) / 100;
    } else if (comm.commission_type === 'fixed') {
      earned = Number(comm.commission_fixed_amount);
    }

    const paid = Number(comm.commission_paid || 0);
    await supabaseAdmin
      .from('commissions')
      .update({
        commission_earned: earned,
        commission_due:    Math.max(0, earned - paid),
        commission_status: earned > 0 ? 'Due' : 'Not Applicable',
      })
      .eq('id', comm.id);
  } catch (e) {
    console.error('[CRM] recalculateCommission error:', e.message);
  }
}

// ─── GET /api/crm/leads/:id/updates ────────────────────────────
// Returns updates for a lead filtered by the caller's visibility level:
//   admin / employee  → all visibility levels
//   client            → client_visible only
//   student           → student_visible only
//   board_member      → board_visible + client_visible + student_visible
router.get('/leads/:id/updates', verifyToken, async (req, res) => {
  const caller = req.user;

  // First verify the caller has access to this lead
  const { data: lead, error: leadErr } = await supabaseAdmin
    .from('student_details')
    .select('id, student_id, assigned_employee_id, source_client_id')
    .eq('id', req.params.id)
    .maybeSingle();

  if (leadErr || !lead) {
    return res.status(404).json({ success: false, error: 'Lead not found.' });
  }

  // Access control
  if (caller.role === 'employee' && lead.assigned_employee_id !== caller.id) {
    return res.status(403).json({ success: false, error: 'Not your assigned lead.' });
  }
  if (caller.role === 'client' && lead.source_client_id !== caller.id) {
    return res.status(403).json({ success: false, error: 'Not your referral.' });
  }
  if (caller.role === 'student' && lead.student_id !== caller.id) {
    return res.status(403).json({ success: false, error: 'Access denied.' });
  }

  try {
    let query = supabaseAdmin
      .from('crm_updates')
      .select(`
        id, update_text, visibility, created_at,
        poster:posted_by(id, full_name, role),
        replies:client_replies(
          id, reply_text, created_at,
          replier:client_id(id, full_name)
        )
      `)
      .eq('student_id', lead.student_id)
      .order('created_at', { ascending: false });

    // Visibility filter by role
    if (caller.role === 'student') {
      query = query.eq('visibility', 'student_visible');
    } else if (caller.role === 'client') {
      query = query.eq('visibility', 'client_visible');
    } else if (caller.role === 'board_member') {
      query = query.in('visibility', ['board_visible', 'client_visible', 'student_visible']);
    }
    // admin / employee see all visibility levels

    const { data: updates, error } = await query;
    if (error) return res.status(500).json({ success: false, error: error.message });

    return res.status(200).json({ success: true, updates: updates || [] });

  } catch (err) {
    console.error('[CRM] GET updates error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/crm/leads/:id/updates ───────────────────────────
// Admin or employee posts a new update with a visibility flag.
// Body: { update_text, visibility }
router.post('/leads/:id/updates', verifyToken, requireEmployee, async (req, res) => {
  const caller = req.user;
  const { update_text, visibility } = req.body;

  if (!update_text?.trim()) {
    return res.status(400).json({ success: false, error: 'update_text is required.' });
  }
  if (!visibility || !VALID_VISIBILITY.includes(visibility)) {
    return res.status(400).json({
      success: false,
      error: `visibility must be one of: ${VALID_VISIBILITY.join(', ')}`,
    });
  }

  // Verify lead exists and employee owns it
  const { data: lead, error: leadErr } = await supabaseAdmin
    .from('student_details')
    .select('id, student_id, assigned_employee_id')
    .eq('id', req.params.id)
    .maybeSingle();

  if (leadErr || !lead) {
    return res.status(404).json({ success: false, error: 'Lead not found.' });
  }
  if (caller.role === 'employee' && lead.assigned_employee_id !== caller.id) {
    return res.status(403).json({ success: false, error: 'Not your assigned lead.' });
  }

  try {
    const { data: update, error } = await supabaseAdmin
      .from('crm_updates')
      .insert({
        student_id:  lead.student_id,
        posted_by:   caller.id,
        update_text: update_text.trim(),
        visibility,
      })
      .select(`
        id, update_text, visibility, created_at,
        poster:posted_by(id, full_name, role)
      `)
      .single();

    if (error) return res.status(500).json({ success: false, error: error.message });

    return res.status(201).json({
      success: true,
      message: 'Update posted.',
      update,
    });

  } catch (err) {
    console.error('[CRM] POST update error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/crm/updates/:updateId/reply ──────────────────────
// Client replies to a client_visible update.
// Only authenticated clients can reply to updates linked to their referrals.
// Body: { reply_text }
router.post('/updates/:updateId/reply', verifyToken, async (req, res) => {
  const caller = req.user;

  if (caller.role !== 'client') {
    return res.status(403).json({ success: false, error: 'Only clients can post replies.' });
  }

  const { reply_text } = req.body;
  if (!reply_text?.trim()) {
    return res.status(400).json({ success: false, error: 'reply_text is required.' });
  }

  // 1. Load the update to verify it is client_visible
  const { data: update, error: updErr } = await supabaseAdmin
    .from('crm_updates')
    .select('id, student_id, visibility')
    .eq('id', req.params.updateId)
    .maybeSingle();

  if (updErr || !update) {
    return res.status(404).json({ success: false, error: 'Update not found.' });
  }
  if (update.visibility !== 'client_visible') {
    return res.status(403).json({ success: false, error: 'This update does not accept client replies.' });
  }

  // 2. Verify the student belongs to this client
  const { data: lead } = await supabaseAdmin
    .from('student_details')
    .select('id')
    .eq('student_id', update.student_id)
    .eq('source_client_id', caller.id)
    .maybeSingle();

  if (!lead) {
    return res.status(403).json({ success: false, error: 'This student is not your referral.' });
  }

  // 3. Insert the reply
  try {
    const { data: reply, error } = await supabaseAdmin
      .from('client_replies')
      .insert({
        update_id:  update.id,
        client_id:  caller.id,
        reply_text: reply_text.trim(),
      })
      .select(`
        id, reply_text, created_at,
        replier:client_id(id, full_name)
      `)
      .single();

    if (error) return res.status(500).json({ success: false, error: error.message });

    return res.status(201).json({ success: true, message: 'Reply sent.', reply });

  } catch (err) {
    console.error('[CRM] POST reply error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
