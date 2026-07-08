'use strict';

const express = require('express');
const router  = express.Router();
const { supabaseAdmin } = require('../supabase/client');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// ─── GET /api/site/settings ─────────────────────────────────────
// Returns all site settings as a flat key→value object.
// Public — no auth required (settings like business name, phone are public).
router.get('/settings', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('setting_key, setting_value')
      .order('setting_key');

    if (error) return res.status(500).json({ success: false, error: error.message });

    // Convert array → { key: value } object for easy front-end use
    const settings = (data || []).reduce((acc, row) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {});

    return res.status(200).json({ success: true, settings });

  } catch (err) {
    console.error('[Site] GET /settings error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/site/settings ────────────────────────────────────
// Upsert one or multiple settings by key.
// Admin only.
// Body: { key: value, key2: value2, ... }   OR   { setting_key, setting_value }
router.post('/settings', verifyToken, requireAdmin, async (req, res) => {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({
      success: false,
      error:   'Request body must be a flat object of { key: value } pairs.',
    });
  }

  // Support both formats:
  //  { setting_key: "business_name", setting_value: "Nidhi Path" }
  //  { business_name: "Nidhi Path", tagline: "Way to Money" }
  let pairs = [];

  if (body.setting_key !== undefined) {
    // Single-key format
    if (!body.setting_key) {
      return res.status(400).json({ success: false, error: 'setting_key is required.' });
    }
    pairs = [{ setting_key: body.setting_key, setting_value: String(body.setting_value ?? '') }];
  } else {
    // Multi-key flat format
    pairs = Object.entries(body).map(([key, value]) => ({
      setting_key:   key,
      setting_value: String(value ?? ''),
    }));
  }

  if (pairs.length === 0) {
    return res.status(400).json({ success: false, error: 'No settings provided.' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .upsert(pairs, { onConflict: 'setting_key' })
      .select('setting_key, setting_value');

    if (error) return res.status(500).json({ success: false, error: error.message });

    // Return updated map
    const updated = (data || []).reduce((acc, row) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {});

    return res.status(200).json({
      success:  true,
      message:  `${pairs.length} setting${pairs.length > 1 ? 's' : ''} saved.`,
      updated,
    });

  } catch (err) {
    console.error('[Site] POST /settings error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
