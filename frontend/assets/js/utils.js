/* ============================================================
   utils.js — Shared UI utilities
   ============================================================ */
'use strict';

/* ─── HTML escaping ──────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/* ─── Initials & avatar colour ───────────────────────────────── */
function initials(name) {
  return String(name || 'U').trim().split(/\s+/).slice(0, 2)
    .map(w => w[0] || '').join('').toUpperCase() || 'U';
}
function avatarColor(name) {
  const colors = ['#1E3A5F','#C9A84C','#2ECC71','#E67E22','#E74C3C','#16A085','#8E44AD','#2980B9'];
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return colors[Math.abs(h) % colors.length];
}

/* ─── Date formatting ────────────────────────────────────────── */
function formatDate(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d)) return String(dateString);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatDateTime(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d)) return String(dateString);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function timeAgo(dateString) {
  if (!dateString) return '—';
  const diff = Date.now() - new Date(dateString).getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000);
  if (m < 2) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 30) return `${d}d ago`;
  return formatDate(dateString);
}

/* ─── Currency ───────────────────────────────────────────────── */
function formatCurrency(amount, compact = false) {
  const n = Number(amount || 0);
  if (!n) return '₹0';
  if (compact) {
    if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
    if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  }
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

/* ─── Status badge ───────────────────────────────────────────── */
const STATUS_BADGE_CLASS = {
  'New':                  'badge-new',
  'Registered':           'badge-registered',
  'Assigned':             'badge-assigned',
  'Verified':             'badge-verified',
  'Documents Pending':    'badge-docs-pending',
  'Documents Received':   'badge-docs-received',
  'Work Started':         'badge-work-started',
  'In Progress':          'badge-in-progress',
  'Follow Up':            'badge-follow-up',
  'Bank Review':          'badge-bank-review',
  'Sanction In Progress': 'badge-sanction-ip',
  'Sanctioned':           'badge-sanctioned',
  'Disbursed':            'badge-disbursed',
  'Approved':             'badge-approved',
  'Rejected':             'badge-rejected',
  'Closed':               'badge-closed',
};
function createStatusBadge(status) {
  const cls = STATUS_BADGE_CLASS[status] || 'badge-new';
  return `<span class="status-badge ${cls}">${escapeHtml(status || 'New')}</span>`;
}
function priorityBadge(p) {
  const cls = { Urgent:'prio-urgent', High:'prio-high', Normal:'prio-normal', Low:'prio-low' }[p] || 'prio-normal';
  return `<span class="prio-badge ${cls}">${escapeHtml(p || 'Normal')}</span>`;
}
function roleBadge(role) {
  const map = { admin:['rb-admin','Admin'], employee:['rb-employee','Employee'], board_member:['rb-board','Board'], client:['rb-client','Client'], student:['rb-student','Student'] };
  const [cls, label] = map[role] || ['rb-student', role];
  return `<span class="role-badge ${cls}">${escapeHtml(label)}</span>`;
}
function clientTypeLabel(ct) {
  return ({ connector:'Connector', consultant:'Consultant', self_own:'Self / Own', employee_reference:'Employee Ref', online_reference:'Online Ref', banker_reference:'Banker Ref' })[ct] || ct || '—';
}
function commStatusBadge(status) {
  const cls = { Due:'cs-due', Paid:'cs-paid', Hold:'cs-hold', 'Not Applicable':'cs-na' }[status] || 'cs-na';
  return `<span class="status-badge ${cls}">${escapeHtml(status || '—')}</span>`;
}

/* ─── Toast notifications ─────────────────────────────────────── */
function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success:'✓', error:'✕', warning:'⚠', info:'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ'}</span><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

/* ─── Modal management ───────────────────────────────────────── */
function showModal(content, opts = {}) {
  let overlay = document.getElementById('modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  }
  const sizeClass = opts.size === 'lg' ? 'modal-lg' : opts.size === 'xl' ? 'modal-xl' : '';
  overlay.innerHTML = `<div class="modal ${sizeClass}">${content}</div>`;
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  // Bind close buttons
  overlay.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', closeModal));
}
function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) { overlay.classList.remove('show'); overlay.innerHTML = ''; }
  document.body.style.overflow = '';
}

/* ─── Debounce ───────────────────────────────────────────────── */
function debounce(fn, delay = 300) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ─── DOM helpers ────────────────────────────────────────────── */
function el(id)            { return document.getElementById(id); }
function setText(id, v)    { const e = el(id); if (e) e.textContent = v ?? ''; }
function setHtml(id, v)    { const e = el(id); if (e) e.innerHTML = v ?? ''; }
function emptyState(colspan, msg = 'No records found.', icon = '📋') {
  return `<tr><td colspan="${colspan}"><div class="empty-state"><div class="empty-icon">${icon}</div><strong>${escapeHtml(msg)}</strong></div></td></tr>`;
}
function loadingRow(colspan) {
  return `<tr><td colspan="${colspan}"><div class="empty-state"><div class="empty-icon">⏳</div><strong>Loading…</strong></div></td></tr>`;
}

/* ─── Exports (global) ───────────────────────────────────────── */
window.escapeHtml        = escapeHtml;
window.initials          = initials;
window.avatarColor       = avatarColor;
window.formatDate        = formatDate;
window.formatDateTime    = formatDateTime;
window.timeAgo           = timeAgo;
window.formatCurrency    = formatCurrency;
window.createStatusBadge = createStatusBadge;
window.priorityBadge     = priorityBadge;
window.roleBadge         = roleBadge;
window.clientTypeLabel   = clientTypeLabel;
window.commStatusBadge   = commStatusBadge;
window.showToast         = showToast;
window.showModal         = showModal;
window.closeModal        = closeModal;
window.debounce          = debounce;
window.el = el; window.setText = setText; window.setHtml = setHtml;
window.emptyState = emptyState; window.loadingRow = loadingRow;
