/* ============================================================
   auth.js — Session & access control
   ============================================================ */
'use strict';

const TOKEN_KEY = 'np_token';
const ROLE_KEY  = 'np_role';
const USER_KEY  = 'np_user';

/* ─── Session getters ────────────────────────────────────────── */
function getToken() { return sessionStorage.getItem(TOKEN_KEY) || ''; }
function getRole()  { return sessionStorage.getItem(ROLE_KEY)  || ''; }
function getUser() {
  try { return JSON.parse(sessionStorage.getItem(USER_KEY) || 'null'); }
  catch { return null; }
}

/* ─── Session setters ────────────────────────────────────────── */
function saveSession(token, user) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(ROLE_KEY,  user.role || '');
  sessionStorage.setItem(USER_KEY,  JSON.stringify(user));
}

/* ─── Logout ─────────────────────────────────────────────────── */
function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
  sessionStorage.removeItem(USER_KEY);
  window.location.href = '/login.html';
}

/* ─── Role → dashboard map ───────────────────────────────────── */
const ROLE_DASHBOARD = {
  admin:        '/admin/dashboard.html',
  employee:     '/employee/dashboard.html',
  board_member: '/board/dashboard.html',
  client:       '/client/dashboard.html',
  student:      '/student/dashboard.html',
};

/* ─── Page guard ─────────────────────────────────────────────── */
/* Call at top of every dashboard page.
   - Redirects to login if no token.
   - Redirects to correct dashboard if role mismatch.
   allowedRoles: array of roles permitted on this page (admin always allowed). */
function requireAuth(allowedRoles = []) {
  const token = getToken();
  const role  = getRole();

  if (!token || !role) {
    window.location.href = '/login.html';
    return null;
  }

  const permitted = allowedRoles.length === 0 || allowedRoles.includes(role) || role === 'admin';
  if (!permitted) {
    window.location.href = ROLE_DASHBOARD[role] || '/login.html';
    return null;
  }

  return getUser();
}

/* ─── Sidebar population + logout binding ────────────────────── */
function initShell(user) {
  // Fill user name + avatar in topbar / sidebar
  const u = user || getUser() || {};
  document.querySelectorAll('[data-user-name]').forEach(el => { el.textContent = u.full_name || u.email || 'User'; });
  document.querySelectorAll('[data-user-role]').forEach(el => {
    const labels = { admin:'Administrator', employee:'Employee', board_member:'Board Member', client:'Client Partner', student:'Student' };
    el.textContent = labels[u.role] || u.role || '';
  });
  document.querySelectorAll('[data-user-avatar]').forEach(el => {
    const name = u.full_name || u.email || 'U';
    el.textContent = name.trim().split(/\s+/).slice(0,2).map(w => w[0]||'').join('').toUpperCase();
  });

  // Mark active nav link
  const path = window.location.pathname;
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (path === href || path.endsWith(href))) a.classList.add('active');
  });

  // Bind logout buttons
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); logout(); });
  });
}

/* ─── Login page handler ─────────────────────────────────────── */
function initLogin() {
  // Redirect away if already authenticated
  if (getToken() && getRole()) {
    window.location.href = ROLE_DASHBOARD[getRole()] || '/';
    return;
  }

  document.querySelectorAll('[data-login-form]').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const loginType = form.dataset.loginForm;          // student | client | employee
      const email     = form.querySelector('[name="email"]').value.trim();
      const password  = form.querySelector('[name="password"]').value;
      const errorEl   = form.querySelector('[data-login-error]');
      const btn       = form.querySelector('[type="submit"]');

      if (!email || !password) {
        if (errorEl) { errorEl.textContent = 'Please enter email and password.'; errorEl.classList.add('show'); }
        return;
      }
      if (errorEl) errorEl.classList.remove('show');
      btn.disabled = true;
      const original = btn.textContent;
      btn.textContent = 'Signing in…';

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, loginType }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Login failed.');

        // Validate role matches the login card used
        const role = data.user.role;
        const groupOf = (r) => {
          if (r === 'student') return 'student';
          if (r === 'client')  return 'client';
          return 'employee';   // admin, employee, board_member all use Employee login
        };
        if (groupOf(role) !== loginType) {
          throw new Error(`This account is not a ${loginType} account. Please use the correct login.`);
        }

        saveSession(data.token, data.user);
        window.location.href = data.redirectTo || ROLE_DASHBOARD[role] || '/';
      } catch (err) {
        if (errorEl) { errorEl.textContent = err.message; errorEl.classList.add('show'); }
        btn.disabled = false;
        btn.textContent = original;
      }
    });
  });
}

/* ─── Exports (global) ───────────────────────────────────────── */
window.Auth = {
  getToken, getRole, getUser, saveSession, logout,
  requireAuth, initShell, initLogin, ROLE_DASHBOARD,
};
