'use strict';

const express = require('express');
const router  = express.Router();
const { supabaseAdmin } = require('../supabase/client');
const { verifyToken, requireBoard } = require('../middleware/authMiddleware');

// All reports require at minimum admin or board_member access
// requireBoard allows admin + board_member

// ─── Shared data loader ─────────────────────────────────────────
// Loads the base datasets used across multiple report endpoints.
// Returns null on error (callers should handle).
async function loadBaseData() {
  const [leadsRes, profilesRes, commissionsRes, incentivesRes] = await Promise.all([
    supabaseAdmin
      .from('student_details')
      .select(`
        id, lead_status, priority, loan_amount_needed, loan_amount_sanctioned,
        source_client_id, assigned_employee_id, created_at, updated_at
      `),
    supabaseAdmin
      .from('profiles')
      .select('id, role, status, client_type'),
    supabaseAdmin
      .from('commissions')
      .select('commission_status, commission_earned, commission_due, commission_paid, client_id'),
    supabaseAdmin
      .from('employee_incentives')
      .select('incentive_status, incentive_amount, employee_id'),
  ]);

  if (leadsRes.error || profilesRes.error) {
    throw new Error(leadsRes.error?.message || profilesRes.error?.message || 'Data load failed.');
  }

  return {
    leads:       leadsRes.data       || [],
    profiles:    profilesRes.data    || [],
    commissions: commissionsRes.data || [],
    incentives:  incentivesRes.data  || [],
  };
}

// ─── GET /api/reports/overview ──────────────────────────────────
// High-level counts: total leads, active, sanctioned, disbursed, rejected,
// commission totals, incentive totals, user counts, smart alerts.
router.get('/overview', verifyToken, requireBoard, async (req, res) => {
  try {
    const { leads, profiles, commissions, incentives } = await loadBaseData();

    // ── Lead status counts ──
    const statusCounts = leads.reduce((acc, l) => {
      acc[l.lead_status] = (acc[l.lead_status] || 0) + 1;
      return acc;
    }, {});

    const active = leads.filter(l =>
      ['Work Started', 'In Progress', 'Follow Up', 'Bank Review',
       'Sanction In Progress', 'Documents Pending', 'Documents Received'].includes(l.lead_status)
    ).length;

    // ── User counts by role ──
    const userCounts = profiles.reduce((acc, p) => {
      acc[p.role] = (acc[p.role] || 0) + 1;
      return acc;
    }, {});

    // ── Client type breakdown ──
    const clientBreakdown = profiles
      .filter(p => p.role === 'client')
      .reduce((acc, p) => {
        const ct = p.client_type || 'unknown';
        acc[ct] = (acc[ct] || 0) + 1;
        return acc;
      }, {});

    // ── Commission totals ──
    const commSummary = commissions.reduce((acc, c) => {
      acc.total_earned += Number(c.commission_earned || 0);
      acc.total_due    += Number(c.commission_due    || 0);
      acc.total_paid   += Number(c.commission_paid   || 0);
      return acc;
    }, { total_earned: 0, total_due: 0, total_paid: 0 });

    // ── Incentive totals ──
    const incentiveSummary = incentives.reduce((acc, i) => {
      acc.total    += Number(i.incentive_amount || 0);
      acc.pending  += i.incentive_status === 'Pending' ? Number(i.incentive_amount || 0) : 0;
      acc.paid     += i.incentive_status === 'Paid'    ? Number(i.incentive_amount || 0) : 0;
      return acc;
    }, { total: 0, pending: 0, paid: 0 });

    // ── Loan totals ──
    const loanTotals = leads.reduce((acc, l) => {
      acc.total_needed     += Number(l.loan_amount_needed     || 0);
      acc.total_sanctioned += Number(l.loan_amount_sanctioned || 0);
      return acc;
    }, { total_needed: 0, total_sanctioned: 0 });

    // ── Smart alerts ──
    const alerts = [];
    const urgentActive = leads.filter(l =>
      l.priority === 'Urgent' &&
      !['Sanctioned', 'Disbursed', 'Approved', 'Rejected', 'Closed'].includes(l.lead_status)
    ).length;

    if (urgentActive > 0) {
      alerts.push({ type: 'danger', text: `${urgentActive} urgent lead${urgentActive > 1 ? 's' : ''} require immediate attention.` });
    }
    if (statusCounts['Rejected'] > 0) {
      alerts.push({ type: 'warning', text: `${statusCounts['Rejected']} lead${statusCounts['Rejected'] > 1 ? 's' : ''} marked as Rejected.` });
    }
    if (commSummary.total_due > 0) {
      alerts.push({
        type: 'info',
        text: `₹${commSummary.total_due.toLocaleString('en-IN')} in partner commissions are pending payment.`,
      });
    }
    if (incentiveSummary.pending > 0) {
      alerts.push({
        type: 'info',
        text: `₹${incentiveSummary.pending.toLocaleString('en-IN')} in employee incentives are pending.`,
      });
    }
    const docsStuck = statusCounts['Documents Pending'] || 0;
    if (docsStuck > 0) {
      alerts.push({ type: 'warning', text: `${docsStuck} lead${docsStuck > 1 ? 's' : ''} waiting on documents.` });
    }

    return res.status(200).json({
      success:     true,
      total_leads: leads.length,
      active,
      status_counts: statusCounts,
      users:         userCounts,
      clients:       clientBreakdown,
      commissions:   commSummary,
      incentives:    incentiveSummary,
      loans:         loanTotals,
      alerts,
    });

  } catch (err) {
    console.error('[Reports] GET /overview error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/reports/employee-performance ──────────────────────
// Per-employee stats: assigned leads, updates posted, conversion rate.
router.get('/employee-performance', verifyToken, requireBoard, async (req, res) => {
  try {
    // Load employees, their leads, and their update counts
    const [empRes, leadsRes, updatesRes] = await Promise.all([
      supabaseAdmin
        .from('profiles')
        .select('id, full_name, email, status')
        .eq('role', 'employee')
        .order('full_name'),
      supabaseAdmin
        .from('student_details')
        .select('id, assigned_employee_id, lead_status, loan_amount_sanctioned'),
      supabaseAdmin
        .from('crm_updates')
        .select('id, posted_by'),
    ]);

    if (empRes.error) return res.status(500).json({ success: false, error: empRes.error.message });

    const employees   = empRes.data    || [];
    const leads       = leadsRes.data  || [];
    const updates     = updatesRes.data || [];

    const performance = employees.map(emp => {
      const assigned = leads.filter(l => l.assigned_employee_id === emp.id);
      const sanctioned = assigned.filter(l =>
        ['Sanctioned', 'Disbursed', 'Approved'].includes(l.lead_status)
      );
      const rejected = assigned.filter(l => l.lead_status === 'Rejected');
      const postedUpdates = updates.filter(u => u.posted_by === emp.id).length;
      const totalSanctionedValue = sanctioned.reduce(
        (s, l) => s + Number(l.loan_amount_sanctioned || 0), 0
      );
      const conversionRate = assigned.length > 0
        ? Math.round((sanctioned.length / assigned.length) * 100)
        : 0;

      return {
        employee_id:            emp.id,
        name:                   emp.full_name,
        email:                  emp.email,
        status:                 emp.status,
        assigned_count:         assigned.length,
        sanctioned_count:       sanctioned.length,
        rejected_count:         rejected.length,
        updates_posted:         postedUpdates,
        conversion_rate:        conversionRate,
        total_sanctioned_value: totalSanctionedValue,
      };
    });

    // Sort by conversion rate descending, then by assigned count
    performance.sort((a, b) =>
      b.conversion_rate - a.conversion_rate ||
      b.assigned_count  - a.assigned_count
    );

    return res.status(200).json({ success: true, performance });

  } catch (err) {
    console.error('[Reports] GET /employee-performance error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/reports/source-wise ──────────────────────────────
// Lead counts and commission grouped by client_type / source.
router.get('/source-wise', verifyToken, requireBoard, async (req, res) => {
  try {
    // Leads with their client type
    const { data: leads, error: leadsErr } = await supabaseAdmin
      .from('student_details')
      .select(`
        id, lead_status, loan_amount_sanctioned,
        source_client:source_client_id(client_type)
      `);

    if (leadsErr) return res.status(500).json({ success: false, error: leadsErr.message });

    const sourceMap = {};

    (leads || []).forEach(lead => {
      const source = lead.source_client?.client_type || 'self_own';
      if (!sourceMap[source]) {
        sourceMap[source] = {
          source,
          total_leads:     0,
          sanctioned:      0,
          disbursed:       0,
          rejected:        0,
          total_value:     0,
          conversion_rate: 0,
        };
      }
      sourceMap[source].total_leads++;
      if (['Sanctioned', 'Approved'].includes(lead.lead_status)) sourceMap[source].sanctioned++;
      if (lead.lead_status === 'Disbursed') sourceMap[source].disbursed++;
      if (lead.lead_status === 'Rejected')  sourceMap[source].rejected++;
      sourceMap[source].total_value += Number(lead.loan_amount_sanctioned || 0);
    });

    // Calculate conversion rate
    const rows = Object.values(sourceMap).map(r => ({
      ...r,
      conversion_rate: r.total_leads > 0
        ? Math.round(((r.sanctioned + r.disbursed) / r.total_leads) * 100)
        : 0,
    }));

    // Attach commission totals per source
    const { data: comms } = await supabaseAdmin
      .from('commissions')
      .select('commission_status, commission_earned, commission_due, client_id');

    const { data: clients } = await supabaseAdmin
      .from('profiles')
      .select('id, client_type')
      .eq('role', 'client');

    const clientTypeById = {};
    (clients || []).forEach(c => { clientTypeById[c.id] = c.client_type; });

    const commBySource = {};
    (comms || []).forEach(c => {
      const src = clientTypeById[c.client_id] || 'self_own';
      if (!commBySource[src]) commBySource[src] = { earned: 0, due: 0 };
      commBySource[src].earned += Number(c.commission_earned || 0);
      commBySource[src].due    += Number(c.commission_due    || 0);
    });

    const enriched = rows.map(r => ({
      ...r,
      commission_earned: commBySource[r.source]?.earned || 0,
      commission_due:    commBySource[r.source]?.due    || 0,
    }));

    enriched.sort((a, b) => b.total_leads - a.total_leads);

    return res.status(200).json({ success: true, source_performance: enriched });

  } catch (err) {
    console.error('[Reports] GET /source-wise error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/reports/commission-summary ───────────────────────
// Total commission due, paid, hold grouped by client (partner).
router.get('/commission-summary', verifyToken, requireBoard, async (req, res) => {
  try {
    const { data: comms, error } = await supabaseAdmin
      .from('commissions')
      .select(`
        commission_status, commission_earned, commission_due, commission_paid,
        client:client_id(id, full_name, email, client_type)
      `);

    if (error) return res.status(500).json({ success: false, error: error.message });

    // Group by client
    const byClient = {};
    (comms || []).forEach(c => {
      const id = c.client?.id;
      if (!id) return;
      if (!byClient[id]) {
        byClient[id] = {
          client_id:   id,
          client_name: c.client.full_name,
          client_type: c.client.client_type,
          earned: 0, due: 0, paid: 0,
          count: 0, by_status: {},
        };
      }
      byClient[id].earned += Number(c.commission_earned || 0);
      byClient[id].due    += Number(c.commission_due    || 0);
      byClient[id].paid   += Number(c.commission_paid   || 0);
      byClient[id].count++;
      byClient[id].by_status[c.commission_status] =
        (byClient[id].by_status[c.commission_status] || 0) + 1;
    });

    const rows = Object.values(byClient).sort((a, b) => b.due - a.due);

    // Grand totals
    const totals = rows.reduce((acc, r) => {
      acc.total_earned += r.earned;
      acc.total_due    += r.due;
      acc.total_paid   += r.paid;
      return acc;
    }, { total_earned: 0, total_due: 0, total_paid: 0 });

    return res.status(200).json({
      success: true,
      by_client: rows,
      totals,
    });

  } catch (err) {
    console.error('[Reports] GET /commission-summary error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/reports/funnel ────────────────────────────────────
// Count of leads at each status stage in pipeline order.
router.get('/funnel', verifyToken, requireBoard, async (req, res) => {
  const FUNNEL_ORDER = [
    'New', 'Registered', 'Assigned', 'Verified',
    'Documents Pending', 'Documents Received',
    'Work Started', 'In Progress', 'Follow Up',
    'Bank Review', 'Sanction In Progress',
    'Sanctioned', 'Disbursed', 'Approved',
    'Rejected', 'Closed',
  ];

  try {
    const { data: leads, error } = await supabaseAdmin
      .from('student_details')
      .select('lead_status');

    if (error) return res.status(500).json({ success: false, error: error.message });

    const counts = (leads || []).reduce((acc, l) => {
      acc[l.lead_status] = (acc[l.lead_status] || 0) + 1;
      return acc;
    }, {});

    const funnel = FUNNEL_ORDER.map(stage => ({
      stage,
      count: counts[stage] || 0,
    }));

    const totalActive = FUNNEL_ORDER
      .filter(s => !['Rejected', 'Closed'].includes(s))
      .reduce((s, stage) => s + (counts[stage] || 0), 0);

    return res.status(200).json({
      success:      true,
      funnel,
      total_active: totalActive,
      total_leads:  (leads || []).length,
    });

  } catch (err) {
    console.error('[Reports] GET /funnel error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
