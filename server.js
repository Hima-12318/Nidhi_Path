'use strict';

// ─── Load environment variables first ──────────────────────────
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const path    = require('path');

// ─── Route modules ──────────────────────────────────────────────
const authRouter        = require('./routes/auth');
const usersRouter       = require('./routes/users');
const crmRouter         = require('./routes/crm');
const commissionsRouter = require('./routes/commissions');
const reportsRouter     = require('./routes/reports');
const siteRouter        = require('./routes/site');

const app  = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ─── Trust proxy (required for Render / reverse proxies) ───────
app.set('trust proxy', 1);
app.disable('x-powered-by');

// ─── Security headers (helmet) ─────────────────────────────────
// Sets HSTS, X-Frame-Options (clickjacking), X-Content-Type-Options
// (MIME sniffing), Referrer-Policy, and more.
// NOTE: Content-Security-Policy is disabled because the frontend pages
// rely on inline <script> blocks, inline event handlers (onerror=…) and
// inline style attributes. Enabling a strict CSP here would break the UI.
// If the frontend is later refactored to external scripts, re-enable CSP.
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// ─── CORS ────────────────────────────────────────────────────────
const allowedOrigins = (() => {
  const raw = process.env.ALLOWED_ORIGINS || '';
  return raw.split(',').map(s => s.trim()).filter(Boolean);
})();

app.use(cors({
  origin(origin, callback) {
    // Allow server-to-server (no origin header) and same-origin requests
    if (!origin) return callback(null, true);
    // In development allow all origins
    if (NODE_ENV === 'development') return callback(null, true);
    // In production check allowlist
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin "${origin}" is not allowed.`));
  },
  credentials:    true,
  methods:        ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body parsers ────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ─── Request logger (development only) ──────────────────────────
if (NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ─── Health check (public, no auth) ────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success:     true,
    status:      'ok',
    service:     'Nidhi Path SmartCRM Intelligence',
    environment: NODE_ENV,
    timestamp:   new Date().toISOString(),
  });
});

// ─── API routes ──────────────────────────────────────────────────
// Each route enforces its own auth via verifyToken / requireRole guards
// inside the route handlers (see middleware/authMiddleware.js). This keeps
// the public endpoints (login, GET site settings) open while protecting
// everything else explicitly and consistently.
app.use('/api/auth',        authRouter);    // login = public; logout/me = guarded
app.use('/api/users',       usersRouter);   // all routes guarded
app.use('/api/crm',         crmRouter);     // all routes guarded
app.use('/api/commissions', commissionsRouter); // all routes guarded
app.use('/api/reports',     reportsRouter); // all routes guarded
app.use('/api/site',        siteRouter);    // GET = public, POST = admin-guarded

// ─── 404 for unmatched /api routes ──────────────────────────────
app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found.' });
});

// ─── Serve frontend static files ────────────────────────────────
const FRONTEND_DIR = path.resolve(__dirname, '../frontend');
app.use(express.static(FRONTEND_DIR, { extensions: ['html'], maxAge: NODE_ENV === 'production' ? '1h' : 0 }));

// ─── SPA fallback — serve index.html for any unmatched path ─────
// This allows frontend routing to work correctly when users bookmark
// or share deep links like /admin/crm.html
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'), err => {
    if (err) {
      res.status(404).send('Page not found.');
    }
  });
});

// ─── Global error handler ────────────────────────────────────────
// Catches unhandled errors thrown in route handlers.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  // CORS errors
  if (err.message && err.message.startsWith('CORS')) {
    return res.status(403).json({ success: false, error: err.message });
  }

  // JSON parse errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, error: 'Invalid JSON in request body.' });
  }

  // Payload too large
  if (err.status === 413) {
    return res.status(413).json({ success: false, error: 'Request body too large.' });
  }

  console.error('[Server] Unhandled error:', err.message || err);
  return res.status(err.status || 500).json({
    success: false,
    error:   NODE_ENV === 'production' ? 'An unexpected error occurred.' : (err.message || 'Internal server error.'),
  });
});

// ─── Start the server ────────────────────────────────────────────
// Bind to 0.0.0.0 so the service is reachable inside Render / containers.
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════════╗');
  console.log('  ║   NIDHI PATH SmartCRM Intelligence        ║');
  console.log(`  ║   http://localhost:${PORT}                    ║`);
  console.log(`  ║   Environment: ${NODE_ENV.padEnd(27)}║`);
  console.log('  ╚═══════════════════════════════════════════╝');
  console.log('');
});

module.exports = app; // export for testing
