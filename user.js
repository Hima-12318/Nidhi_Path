(function () {
  const API_BASE_URL = window.NIDHI_API_BASE_URL || window.location.origin;
  const USER_TOKEN_KEY = 'nidhi_user_token';
  const USER_PROFILE_KEY = 'nidhi_user_profile';
  const DEBUG_AUTH = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getUserToken() {
    try {
      const token = window.sessionStorage.getItem(USER_TOKEN_KEY) || window.localStorage.getItem(USER_TOKEN_KEY) || '';
      if (token && !window.sessionStorage.getItem(USER_TOKEN_KEY)) {
        window.sessionStorage.setItem(USER_TOKEN_KEY, token);
      }
      return token;
    } catch (error) {
      return '';
    }
  }

  function debugAuth(message) {
    if (DEBUG_AUTH) {
      console.debug(`[Nidhi User Auth] ${message}`);
    }
  }

  function clearUserSession(reason = 'logout') {
    debugAuth(`User token cleared: ${reason}`);
    try {
      window.sessionStorage.removeItem(USER_TOKEN_KEY);
      window.sessionStorage.removeItem(USER_PROFILE_KEY);
      window.localStorage.removeItem(USER_TOKEN_KEY);
      window.localStorage.removeItem(USER_PROFILE_KEY);
    } catch (error) {}
  }

  function logoutUser() {
    clearUserSession('explicit logout');
    window.location.href = 'login.html';
  }

  window.logoutUser = logoutUser;
  window.NIDHI_logoutUser = logoutUser;

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value || 'Not updated yet';
  }

  function setStatus(message, type = '') {
    const target = $('#user-dashboard-status');
    if (!target) return;
    target.className = `form-status ${type ? `is-${type}` : ''}`.trim();
    target.textContent = message || '';
  }

  function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function detailItem(label, value) {
    return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || 'Not updated yet')}</strong></div>`;
  }

  function fallback(value, text = 'Not updated yet') {
    return value === null || value === undefined || value === '' ? text : value;
  }

  function statusFallback(value) {
    return fallback(value, 'Pending');
  }

  function formatMoney(value) {
    const number = Number(value || 0);
    if (!number) return 'Not updated yet';
    return `Rs. ${number.toLocaleString('en-IN')}`;
  }

  function formatDateOnly(value) {
    if (!value) return '';
    const raw = String(value);
    const date = new Date(raw.includes('T') ? raw : `${raw}T00:00:00`);
    if (Number.isNaN(date.getTime())) return raw;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  function latestDocumentUpdate(updates) {
    return [...updates].reverse().find((update) => {
      const text = `${update.title || ''} ${update.message || ''} ${update.updateType || ''}`.toLowerCase();
      return text.includes('document');
    });
  }

  function setButtonLoading(button, loadingText) {
    if (!button) return () => {};
    const previousText = button.textContent;
    button.disabled = true;
    button.textContent = loadingText;
    return (nextText = previousText) => {
      button.disabled = false;
      button.textContent = nextText;
    };
  }

  function updateRow(update) {
    return `
      <article class="admin-timeline-item">
        <div>
          <strong>${escapeHtml(update.title || 'Update')}</strong>
          <span>${escapeHtml(update.updateType || 'message')}</span>
        </div>
        <p>${escapeHtml(update.message || '')}</p>
        <small>${formatDate(update.createdAt)}</small>
      </article>
    `;
  }

  async function userFetch(path, options = {}) {
    const token = getUserToken();
    debugAuth(`User token found: ${token ? 'yes' : 'no'}`);
    if (!token) {
      window.location.href = 'login.html';
      throw new Error('User session is missing.');
    }
    const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      debugAuth(`User dashboard API success: no (${response.status})`);
      if (response.status === 401) {
        clearUserSession('401 unauthorized');
        window.location.href = 'login.html';
      }
      throw new Error(data.message || 'Something went wrong. Please try again.');
    }
    debugAuth('User dashboard API success: yes');
    return data;
  }

  async function loadUserDashboard() {
    debugAuth('User dashboard auth check started');
    setStatus('Loading your dashboard...', 'info');
    const response = await userFetch('/api/user/dashboard');
    const user = response.user || {};
    const application = response.application || {};
    const updates = response.updates || [];

    try {
      window.sessionStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
      window.localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
    } catch (error) {}

    setText('user-dashboard-title', `Welcome, ${user.fullName || 'User'}`);
    setText('user-account-status', user.status || 'pending');
    setText('user-application-id', application.applicationId || 'Not generated yet');
    setText('user-application-status', application.applicationStatus || 'registered');
    setText('user-application-service', application.service || 'Other');
    setText('user-client-type', application.clientType || user.clientType || 'regular');

    const documentUpdate = latestDocumentUpdate(updates);
    setText('user-application-detail-badge', statusFallback(application.applicationStatus));
    setText('user-bank-update-badge', statusFallback(application.sanctionStatus || application.disbursementStatus));
    setText('user-followup-badge', application.nextFollowupDate ? 'Scheduled' : 'To be updated');
    setText('user-documents-badge', statusFallback(application.documentStatus));

    const applicationDetails = $('#user-application-details-grid');
    if (applicationDetails) {
      applicationDetails.innerHTML = [
        detailItem('Application ID', application.applicationId || 'To be updated by admin'),
        detailItem('Client name', user.fullName || application.customerName),
        detailItem('Email', user.email || application.customerEmail),
        detailItem('Phone', user.phone || application.customerPhone),
        detailItem('Service / Loan type', application.service || 'To be updated by admin'),
        detailItem('Current application status', statusFallback(application.applicationStatus)),
        detailItem('Created date', formatDate(application.createdAt)),
        detailItem('Last updated date', formatDate(application.updatedAt))
      ].join('');
    }

    const bankUpdate = $('#user-bank-update-grid');
    if (bankUpdate) {
      bankUpdate.innerHTML = [
        detailItem('Bank name', application.bankName || 'To be updated by admin'),
        detailItem('Loan amount required', formatMoney(application.loanAmountRequired)),
        detailItem('Sanction / approved amount', formatMoney(application.loanAmountApproved)),
        detailItem('Sanction status', statusFallback(application.sanctionStatus)),
        detailItem('Disbursement status', statusFallback(application.disbursementStatus))
      ].join('');
    }

    const followup = $('#user-followup-grid');
    if (followup) {
      followup.innerHTML = [
        detailItem('Next follow-up date', formatDateOnly(application.nextFollowupDate) || 'To be updated by admin'),
        detailItem('Assigned admin / employee', application.assignedAdminName || application.assignedTo || 'To be updated by admin'),
        detailItem('Admin status', statusFallback(application.adminStatus)),
        detailItem('Priority', application.priority || 'Pending')
      ].join('');
    }

    const documents = $('#user-documents-grid');
    if (documents) {
      documents.innerHTML = [
        detailItem('Document status', statusFallback(application.documentStatus)),
        detailItem('Documents pending', application.documentsPending || application.metadata?.documentsPending || 'To be updated by admin'),
        detailItem('Documents received', application.documentsReceived || application.metadata?.documentsReceived || 'To be updated by admin'),
        detailItem('Latest document update', documentUpdate?.message || 'Not updated yet')
      ].join('');
    }

    const timeline = $('#user-updates-timeline');
    if (timeline) {
      timeline.innerHTML = updates.length ? updates.map(updateRow).join('') : '<p class="admin-table-note">No updates yet.</p>';
    }
    const b2bPanel = $('#b2b-update-panel');
    if (b2bPanel) b2bPanel.hidden = (application.clientType || user.clientType || 'regular') !== 'b2b';
    setStatus('', '');
  }

  function bindB2bUpdateForm() {
    const form = $('#b2b-update-form');
    if (!form) return;
    let inFlight = false;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (inFlight) return;
      inFlight = true;
      const status = $('#b2b-update-status');
      const restore = setButtonLoading(event.submitter || form.querySelector('button[type="submit"]'), 'Submitting...');
      if (status) {
        status.className = 'form-status is-info';
        status.textContent = 'Submitting update...';
      }
      try {
        await userFetch('/api/user/application/updates', {
          method: 'POST',
          body: JSON.stringify({
            message: form.elements.message.value,
            clientMutationId: `b2b-${Date.now()}-${Math.random().toString(36).slice(2)}`
          })
        });
        form.reset();
        if (status) {
          status.className = 'form-status is-success';
          status.textContent = 'Submitted successfully.';
        }
        await loadUserDashboard();
      } catch (error) {
        if (status) {
          status.className = 'form-status is-error';
          status.textContent = error.message;
        }
      } finally {
        inFlight = false;
        restore('Submit Update');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.body.classList.contains('user-dashboard-page')) return;
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (link && !link.hasAttribute('data-user-logout')) {
        debugAuth(`Navigation clicked: no logout (${link.getAttribute('href')})`);
      }
    });
    document.querySelectorAll('[data-user-logout]').forEach((button) => {
      button.addEventListener('click', logoutUser);
    });
    if (!getUserToken()) {
      debugAuth('User token found: no');
      window.location.href = 'login.html';
      return;
    }
    debugAuth('User token found: yes');
    bindB2bUpdateForm();
    loadUserDashboard().catch((error) => setStatus(error.message, 'error'));
  });
})();
