/* ============================================================
   api.js — Authenticated fetch wrappers
   ============================================================ */
'use strict';

const API_ORIGIN = window.location.origin;

/* ─── Core request ───────────────────────────────────────────── */
async function apiRequest(method, endpoint, body = null) {
  const token = window.Auth ? window.Auth.getToken() : sessionStorage.getItem('np_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body !== null) options.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(`${API_ORIGIN}${endpoint}`, options);
  } catch (networkErr) {
    if (window.showToast) window.showToast('Network error. Please check your connection.', 'error');
    throw new Error('Network error.');
  }

  // Handle auth failures globally
  if (res.status === 401) {
    if (window.showToast) window.showToast('Session expired. Please log in again.', 'warning');
    setTimeout(() => { if (window.Auth) window.Auth.logout(); else window.location.href = '/login.html'; }, 800);
    throw new Error('Unauthorized');
  }

  let data;
  try { data = await res.json(); }
  catch { data = {}; }

  if (!res.ok || data.success === false) {
    const msg = data.error || `Request failed (${res.status})`;
    if (window.showToast) window.showToast(msg, 'error');
    throw new Error(msg);
  }

  return data;
}

/* ─── Verb helpers ───────────────────────────────────────────── */
function apiGet(endpoint)         { return apiRequest('GET',    endpoint); }
function apiPost(endpoint, body)  { return apiRequest('POST',   endpoint, body || {}); }
function apiPatch(endpoint, body) { return apiRequest('PATCH',  endpoint, body || {}); }
function apiDelete(endpoint)      { return apiRequest('DELETE', endpoint); }

/* Build query string from object */
function qs(params = {}) {
  const clean = Object.entries(params).filter(([, v]) => v !== '' && v != null);
  return clean.length ? '?' + new URLSearchParams(Object.fromEntries(clean)).toString() : '';
}

/* ─── Exports (global) ───────────────────────────────────────── */
window.apiGet    = apiGet;
window.apiPost   = apiPost;
window.apiPatch  = apiPatch;
window.apiDelete = apiDelete;
window.qs        = qs;
