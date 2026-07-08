(function () {
  const API_BASE_URL = window.NIDHI_API_BASE_URL || window.location.origin;
  const USER_TOKEN_KEY = 'nidhi_user_token';
  const ADMIN_TOKEN_KEY = 'nidhi_admin_token';
  const CRM_SYNC_INTERVAL_MS = 30000;
  let latestReportData = null;
  let latestEmployeePerformanceReport = null;
  let employeeReportPage = 1;
  let employeeReportHasLoaded = false;
  let employeeReportPanelAction = '';

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getToken(key) {
    try {
      return window.sessionStorage.getItem(key) || window.localStorage.getItem(key) || '';
    } catch (error) {
      return '';
    }
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value ?? '0';
  }

  function notifyCrmChanged(applicationId = '') {
    const detail = {
      applicationId,
      updatedAt: Date.now()
    };
    window.dispatchEvent(new CustomEvent('nidhi:crm-updated', { detail }));
    try {
      window.localStorage.setItem('nidhi_crm_last_update', JSON.stringify(detail));
    } catch (error) {
      // Best effort cross-tab sync.
    }
  }

  function localDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function setStatus(message, type = '') {
    const target = $('#smartcrm-status') || $('#admin-page-status');
    if (!target) return;
    target.className = `form-status ${type ? `is-${type}` : ''}`.trim();
    target.textContent = message || '';
  }

  function money(value) {
    const number = Number(value || 0);
    return `Rs. ${number.toLocaleString('en-IN')}`;
  }

  function compactMoney(value) {
    const number = Number(value || 0);
    if (number >= 10000000) return `Rs. ${(number / 10000000).toFixed(2)}Cr`;
    if (number >= 100000) return `Rs. ${(number / 100000).toFixed(2)}L`;
    return money(number);
  }

  function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function formatLabel(value) {
    if (window.NIDHI_formatLabel) return window.NIDHI_formatLabel(value);
    const raw = String(value ?? '').trim();
    if (!raw) return '-';
    if (raw === '-') return '-';
    return raw
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function stableHash(value) {
    const text = String(value || 'nidhi-path-smartcrm');
    let hash = 0;
    for (let index = 0; index < text.length; index += 1) {
      hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
    }
    return Math.abs(hash);
  }

  function normalizeDashboardThemeRole(role) {
    const value = String(role || '').toLowerCase();
    if (value === 'board_member') return 'board';
    if (['connector', 'client_consultant', 'own_self', 'online_reference', 'banker_reference', 'employee_reference'].includes(value)) return 'client';
    if (['student', 'employee', 'board', 'client'].includes(value)) return value;
    return 'student';
  }

  function getDashboardTheme(role, profile = {}) {
    const themeRole = normalizeDashboardThemeRole(role || profile.role || profile.userType);
    const seed = profile.themeIndex || profile.theme_index || profile.id || profile.authUserId || profile.auth_user_id || profile.email || profile.fullName || themeRole;
    const themeNumber = (stableHash(seed) % 10) + 1;
    return {
      role: themeRole,
      number: themeNumber,
      className: `dashboard-theme-${themeRole}-${themeNumber}`,
      variantClass: `dashboard-theme-variant-${themeNumber}`,
      roleClass: `dashboard-theme-role-${themeRole}`
    };
  }

  function applyDashboardTheme(role, profile = {}) {
    const theme = getDashboardTheme(role, profile);
    const classes = Array.from(document.body.classList).filter((name) => name.startsWith('dashboard-theme-'));
    classes.forEach((name) => document.body.classList.remove(name));
    document.body.classList.add('dashboard-theme', theme.roleClass, theme.variantClass, theme.className);
    document.body.dataset.dashboardTheme = theme.className;
    return theme;
  }

  window.NIDHI_getDashboardTheme = getDashboardTheme;

  async function apiFetch(path, token) {
    if (!token) {
      window.location.href = 'login.html';
      throw new Error('Session is missing.');
    }
    const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Request failed.');
    }
    return data;
  }

  async function apiWrite(path, token, payload, method = 'POST') {
    if (!token) {
      window.location.href = 'login.html';
      throw new Error('Session is missing.');
    }
    const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Request failed.');
    }
    return data;
  }

  function detailItem(label, value) {
    return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || '-')}</strong></div>`;
  }

  function roleShellLinks(page) {
    if (page === 'student') {
      return [
        ['01', 'Dashboard', 'student-dashboard.html']
      ];
    }
    if (page === 'employee' || page === 'employee-detail') {
      return [
        ['01', 'Dashboard', 'employee-dashboard.html'],
        ['02', 'Daily Update', 'employee-dashboard.html#daily-update']
      ];
    }
    if (page === 'client' || page === 'client-detail') {
      return [
        ['01', 'Dashboard', 'client-dashboard.html'],
        ['02', 'References', 'client-dashboard.html#client-references']
      ];
    }
    if (page === 'board') {
      return [
        ['01', 'Dashboard', 'board-dashboard.html'],
        ['02', 'Reports', 'board-dashboard.html#board-reports']
      ];
    }
    return [];
  }

  function installRoleDashboardShell(page) {
    if (!['student', 'employee', 'employee-detail', 'client', 'client-detail', 'board'].includes(page) || document.querySelector('.smartcrm-shell')) return;
    const legacyMain = document.querySelector('main');
    if (!legacyMain) return;
    const shell = document.createElement('div');
    shell.className = 'smartcrm-shell smartcrm-shell-compact';
    const sidebar = document.createElement('aside');
    sidebar.className = 'smartcrm-sidebar';
    sidebar.setAttribute('aria-label', 'SmartCRM navigation');
    const links = roleShellLinks(page).map(([number, label, href], index) => `
      <a class="${index === 0 ? 'is-active' : ''}" href="${href}"><span>${number}</span>${escapeHtml(label)}</a>
    `).join('');
    sidebar.innerHTML = `
      <a class="smartcrm-brand" href="${page}-dashboard.html" data-no-translate>
        <img src="logo.jpg" alt="Nidhi Path logo">
        <span>
          <strong>NIDHI PATH</strong>
          <small>SMARTCRM INTELLIGENCE</small>
        </span>
      </a>
      <nav class="smartcrm-side-nav" aria-label="SmartCRM navigation">
        ${links}
        <a href="login.html" data-smartcrm-user-logout><span>${String(roleShellLinks(page).length + 1).padStart(2, '0')}</span>Logout</a>
      </nav>
      <div class="smartcrm-profile-card">
        <div class="smartcrm-profile-mark">NP</div>
        <div>
          <strong>${escapeHtml(formatLabel(page))}</strong>
          <span>Role Based Access</span>
        </div>
      </div>
    `;
    const workspace = document.createElement('main');
    workspace.className = 'smartcrm-workspace smartcrm-legacy-workspace';
    while (legacyMain.firstChild) workspace.appendChild(legacyMain.firstChild);
    shell.append(sidebar, workspace);
    const header = document.querySelector('body > header');
    (header || legacyMain).replaceWith(shell);
    legacyMain.remove();
    document.body.classList.add('smartcrm-command-page');
    $all('[data-smartcrm-user-logout]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        if (window.NIDHI_logoutUser) {
          window.NIDHI_logoutUser();
        } else {
          window.location.href = 'login.html';
        }
      });
    });
  }

  function applicationRow(item, mode = 'employee') {
    const rejectionReason = item.sanctionRejectionReason || item.disbursementRejectionReason || item.rejectionReason || '-';
    const commissionCells = mode === 'client'
      ? `<td>${escapeHtml(rejectionReason)}</td><td>${item.commissionVisible ? money(item.commissionAmount) : 'Hidden'}</td><td>${escapeHtml(formatLabel(item.commissionStatus || '-'))}</td>`
      : '';
    return `
      <tr data-application-id="${escapeHtml(item.id || '')}">
        <td>${escapeHtml(item.applicationId || 'Not generated')}</td>
        <td>${escapeHtml(item.name || '-')}</td>
        <td>${escapeHtml(item.mobile || '-')}</td>
        <td>${escapeHtml(item.email || '-')}</td>
        <td>${escapeHtml(item.universityApplied || '-')}</td>
        <td>${escapeHtml(item.course || '-')}</td>
        <td>${escapeHtml(money(item.loanAmount))}</td>
        <td>${escapeHtml(formatLabel(item.status || '-'))}</td>
        ${commissionCells}
      </tr>
    `;
  }

  function renderApplicationDetail(id, application) {
    const target = document.getElementById(id);
    if (!target) return;
    target.innerHTML = [
      detailItem('Name', application?.name),
      detailItem('Client Name', application?.clientName),
      detailItem('Email', application?.email),
      detailItem('Mobile', application?.mobile),
      detailItem('University Applied For', application?.universityApplied),
      detailItem('Country', application?.country),
      detailItem('Loan Amount Needed', application?.loanAmountNeeded ? money(application.loanAmountNeeded) : ''),
      detailItem('Loan Amount Sanctioned', application?.loanAmountSanctioned ? money(application.loanAmountSanctioned) : '')
    ].join('');
  }

  function renderDashboardUpdates(id, updates = []) {
    const target = document.getElementById(id);
    if (!target) return;
    target.innerHTML = updates.length
      ? updates.map((update) => `
        <article class="smartcrm-update-item">
          <strong>${escapeHtml(update.title || formatLabel(update.updateType || 'Update'))}</strong>
          <p>${escapeHtml(update.message || '')}</p>
          <span>${escapeHtml([formatDate(update.createdAt), update.applicationNumber || update.studentName || ''].filter(Boolean).join(' - '))}</span>
        </article>
      `).join('')
      : '<p class="admin-table-note">No notifications yet.</p>';
  }

  function clientStatus(application) {
    return String(application?.status || '').toLowerCase();
  }

  function isApprovedOrDisbursed(application) {
    return ['approved', 'sanctioned', 'disbursed'].includes(clientStatus(application)) || application?.disbursementStatus === 'disbursed';
  }

  function isOngoing(application) {
    return ['new_user', 'registered', 'verified', 'in_progress', 'bank_review', 'sanction_in_progress', 'loan_processing'].includes(clientStatus(application));
  }

  function renderClientDetailTable(columns, rows) {
    if (!rows.length) return '<p class="admin-table-note">No records found.</p>';
    return `
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead><tr>${columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map((row) => `
              <tr>${columns.map((column) => `<td>${escapeHtml(column.value(row))}</td>`).join('')}</tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderEmployeeDetailTable(columns, rows) {
    return renderClientDetailTable(columns, rows);
  }

  function employeeStatus(application) {
    return String(application?.status || '').toLowerCase();
  }

  function isEmployeeSanctioned(application) {
    return employeeStatus(application) === 'sanctioned' || Number(application?.loanAmountSanctioned || application?.sanctionedAmount || 0) > 0;
  }

  function isEmployeeDisbursed(application) {
    return employeeStatus(application) === 'disbursed' || application?.disbursementStatus === 'disbursed' || Number(application?.disbursedAmount || 0) > 0;
  }

  function renderEmployeeCardDetails(type, data) {
    const title = $('#employee-card-detail-title');
    const body = $('#employee-card-detail-body');
    if (!title || !body) return;
    const applications = data.applications || [];
    const configs = {
      assigned: {
        title: 'Assigned Applications',
        rows: applications,
        columns: [
          { label: 'App ID', value: (item) => item.applicationId || 'Not generated' },
          { label: 'Student/Lead Name', value: (item) => item.name || '-' },
          { label: 'Mobile', value: (item) => item.mobile || '-' },
          { label: 'Email', value: (item) => item.email || '-' },
          { label: 'University', value: (item) => item.universityApplied || '-' },
          { label: 'Course', value: (item) => item.course || '-' },
          { label: 'Loan Amount', value: (item) => money(item.loanAmount) },
          { label: 'Status', value: (item) => formatLabel(item.status || '-') },
          { label: 'Follow-up Date', value: (item) => item.nextFollowupDate || '-' },
          { label: 'Last Updated', value: (item) => formatDate(item.updatedAt) || '-' }
        ]
      },
      followups: {
        title: 'Pending Follow-ups',
        rows: data.pendingFollowups || [],
        columns: [
          { label: 'Student/Lead Name', value: (item) => item.name || '-' },
          { label: 'Mobile', value: (item) => item.mobile || '-' },
          { label: 'University', value: (item) => item.universityApplied || '-' },
          { label: 'Course', value: (item) => item.course || '-' },
          { label: 'Follow-up', value: (item) => item.nextFollowupDate || '-' },
          { label: 'Follow-up Date', value: (item) => item.nextFollowupDate || '-' },
          { label: 'Current Status', value: (item) => formatLabel(item.status || '-') }
        ]
      },
      sanctioned: {
        title: 'Sanctioned Records',
        rows: applications.filter(isEmployeeSanctioned),
        columns: [
          { label: 'Student/Lead Name', value: (item) => item.name || '-' },
          { label: 'University', value: (item) => item.universityApplied || '-' },
          { label: 'Course', value: (item) => item.course || '-' },
          { label: 'Loan Amount Needed', value: (item) => money(item.loanAmount) },
          { label: 'Loan Amount Sanctioned', value: (item) => money(item.loanAmountSanctioned || item.sanctionedAmount) },
          { label: 'Bank/NBFC', value: (item) => item.bankApplied || '-' },
          { label: 'Status', value: (item) => formatLabel(item.status || '-') }
        ]
      },
      disbursed: {
        title: 'Disbursed Records',
        rows: applications.filter(isEmployeeDisbursed),
        columns: [
          { label: 'Student/Lead Name', value: (item) => item.name || '-' },
          { label: 'University', value: (item) => item.universityApplied || '-' },
          { label: 'Course', value: (item) => item.course || '-' },
          { label: 'Loan Amount Sanctioned', value: (item) => money(item.loanAmountSanctioned || item.sanctionedAmount) },
          { label: 'Loan Amount Disbursed', value: (item) => money(item.disbursedAmount) },
          { label: 'Bank/NBFC', value: (item) => item.bankApplied || '-' },
          { label: 'Status', value: (item) => formatLabel(item.status || '-') },
          { label: 'Disbursed Date', value: (item) => item.disbursedAt || item.disbursementDate || '-' }
        ]
      }
    };
    const config = configs[type] || configs.assigned;
    title.textContent = config.title;
    body.innerHTML = renderEmployeeDetailTable(config.columns, config.rows);
  }

  function bindEmployeeSummaryCards() {
    $all('[data-employee-card]').forEach((card) => {
      card.style.cursor = 'pointer';
      const navigate = () => {
        const type = card.dataset.employeeCard || 'assigned';
        window.location.href = `employee-dashboard-detail.html?type=${encodeURIComponent(type)}`;
      };
      card.onclick = navigate;
      card.onkeydown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate();
        }
      };
    });
  }

  function renderClientCardDetails(card, data) {
    const panel = $('#client-card-details');
    const title = $('#client-card-detail-title');
    const body = $('#client-card-detail-body');
    if (!panel || !title || !body) return;
    const applications = data.applications || [];
    const summary = data.summary || {};
    const commissionVisible = Boolean(data.commissionVisible);
    const rejectionReason = (item) => item.sanctionRejectionReason || item.disbursementRejectionReason || item.rejectionReason || '-';
    const commissionAmount = (item) => commissionVisible && item.commissionVisible ? money(item.commissionAmount) : 'Hidden';
    const baseLeadColumns = [
      { label: 'Name', value: (item) => item.name || '-' },
      { label: 'Mobile', value: (item) => item.mobile || '-' },
      { label: 'Email', value: (item) => item.email || '-' },
      { label: 'University', value: (item) => item.universityApplied || '-' },
      { label: 'Course', value: (item) => item.course || '-' },
      { label: 'Loan Amount', value: (item) => money(item.loanAmount) },
      { label: 'Current Status', value: (item) => formatLabel(item.status || '-') }
    ];
    const configs = {
      total: {
        title: 'Total Referrals Details',
        rows: applications,
        columns: baseLeadColumns
      },
      approved: {
        title: 'Approved / Disbursed Applications',
        rows: applications.filter(isApprovedOrDisbursed),
        columns: [
          { label: 'Name', value: (item) => item.name || '-' },
          { label: 'University', value: (item) => item.universityApplied || '-' },
          { label: 'Course', value: (item) => item.course || '-' },
          { label: 'Sanctioned/Disbursed Amount', value: (item) => money(item.disbursedAmount || item.sanctionedAmount || item.loanAmount) },
          { label: 'Status', value: (item) => formatLabel(item.status || '-') },
          { label: 'Commission', value: commissionAmount }
        ]
      },
      ongoing: {
        title: 'Ongoing Applications',
        rows: applications.filter(isOngoing),
        columns: [
          { label: 'Name', value: (item) => item.name || '-' },
          { label: 'University', value: (item) => item.universityApplied || '-' },
          { label: 'Course', value: (item) => item.course || '-' },
          { label: 'Current Status', value: (item) => formatLabel(item.status || '-') },
          { label: 'Follow-up Date', value: (item) => item.nextFollowupDate || '-' }
        ]
      },
      rejected: {
        title: 'Rejected Applications',
        rows: applications.filter((item) => clientStatus(item) === 'rejected'),
        columns: [
          { label: 'Name', value: (item) => item.name || '-' },
          { label: 'University', value: (item) => item.universityApplied || '-' },
          { label: 'Course', value: (item) => item.course || '-' },
          { label: 'Rejection Reason', value: rejectionReason },
          { label: 'Status', value: (item) => formatLabel(item.status || '-') }
        ]
      },
      due: {
        title: 'Commission Due',
        rows: applications.filter((item) => item.commissionVisible && item.commissionStatus === 'due'),
        columns: [
          { label: 'Name', value: (item) => item.name || '-' },
          { label: 'Loan Amount', value: (item) => money(item.loanAmount) },
          { label: 'Commission Amount', value: commissionAmount },
          { label: 'Commission Status', value: (item) => formatLabel(item.commissionStatus || '-') }
        ]
      },
      paid: {
        title: 'Commission Paid',
        rows: applications.filter((item) => item.commissionVisible && item.commissionStatus === 'paid'),
        columns: [
          { label: 'Name', value: (item) => item.name || '-' },
          { label: 'Commission Amount', value: commissionAmount },
          { label: 'Paid Date', value: (item) => item.commissionPaidAt || item.paidAt || '-' },
          { label: 'Commission Status', value: (item) => formatLabel(item.commissionStatus || '-') }
        ]
      },
      commission: {
        title: 'Total Commission Value',
        html: `
          <div class="admin-detail-grid">
            ${detailItem('Total commission value', commissionVisible ? money(summary.totalCommissionValue) : 'Hidden')}
            ${detailItem('Paid commission', commissionVisible ? money(summary.commissionPaid) : 'Hidden')}
            ${detailItem('Due commission', commissionVisible ? money(summary.commissionDue) : 'Hidden')}
            ${detailItem('Related leads', applications.map((item) => item.name).filter(Boolean).join(', ') || 'No records found.')}
          </div>
        `
      },
      access: {
        title: 'Access Level',
        html: `
          <div class="admin-detail-grid">
            ${detailItem('Current access level', 'Role-Based')}
            ${detailItem('Visibility', 'Only records linked to your client/reference account are visible.')}
            ${detailItem('Privacy', 'Private admin-only and employee-private data is not shown.')}
          </div>
        `
      }
    };
    const config = configs[card] || configs.total;
    title.textContent = config.title;
    body.innerHTML = config.html || renderClientDetailTable(config.columns, config.rows);
    panel.hidden = false;
    $all('[data-client-card]').forEach((item) => {
      const active = item.dataset.clientCard === card;
      item.classList.toggle('is-active', active);
      item.style.outline = active ? '2px solid var(--secondary-color)' : '';
    });
  }

  function bindClientSummaryCards(data) {
    $all('[data-client-card]').forEach((card) => {
      card.style.cursor = 'pointer';
      const navigate = () => {
        const type = card.dataset.clientCard || 'total';
        window.location.href = `client-dashboard-detail.html?type=${encodeURIComponent(type)}`;
      };
      card.onclick = navigate;
      card.onkeydown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate();
        }
      };
    });
  }

  function fillApplicationSelect(id, applications = []) {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = applications.length
      ? applications.map((application) => {
        const label = `${application.applicationId || 'Application'} - ${application.name || '-'}`;
        return `<option value="${escapeHtml(application.id)}">${escapeHtml(label)}</option>`;
      }).join('')
      : '<option value="">No applications</option>';
  }

  function renderEmployeeDailyHistory(rows = []) {
    const target = $('#employee-daily-history-body');
    if (!target) return;
    target.innerHTML = rows.length ? rows.map((item) => `
      <tr>
        <td>${escapeHtml(formatDate(item.workDate))}</td>
        <td>${escapeHtml(item.totalLeadsHandled || 0)}</td>
        <td>${escapeHtml(item.newLeadsContacted || 0)}</td>
        <td>${escapeHtml(item.followupsDone || 0)}</td>
        <td>${escapeHtml(item.sanctionUpdates || 0)}</td>
        <td>${escapeHtml(item.disbursementUpdates || 0)}</td>
        <td>${escapeHtml(item.documentsCollected || 0)}</td>
        <td>${escapeHtml(item.bankLoginsDone || 0)}</td>
        <td>${escapeHtml(item.remarks || item.pendingIssues || '-')}</td>
        <td>${escapeHtml(formatDate(item.submittedAt || item.createdAt))}</td>
      </tr>
    `).join('') : '<tr><td colspan="10">No daily updates found.</td></tr>';
  }

  async function loadEmployeeDailyHistory() {
    const target = $('#employee-daily-history-body');
    if (!target) return;
    const data = await apiFetch('/api/employee/daily-updates/me?limit=30', getToken(USER_TOKEN_KEY));
    renderEmployeeDailyHistory(data.dailyUpdates || []);
  }

  async function loadStudentDashboard({ quiet = false } = {}) {
    if (!quiet) setStatus('Loading student dashboard...', 'info');
    const data = await apiFetch('/api/student/dashboard', getToken(USER_TOKEN_KEY));
    applyDashboardTheme('student', data.user || {});
    const app = data.application || {};
    setText('student-name', app.name || data.user?.fullName || 'Student');
    setText('student-status', app.status || '-');
    setText('student-application-id', app.applicationId || 'Not generated');
    setText('student-loan-amount', app.loanAmountNeeded ? money(app.loanAmountNeeded) : '-');
    renderApplicationDetail('student-application-grid', app);
    renderDashboardUpdates('student-updates-list', data.updates || []);
    if (!quiet) setStatus('', '');
  }

  async function loadEmployeeDashboard({ quiet = false } = {}) {
    if (!quiet) setStatus('Loading employee dashboard...', 'info');
    const data = await apiFetch('/api/employee/dashboard', getToken(USER_TOKEN_KEY));
    applyDashboardTheme('employee', data.user || {});
    const stats = data.stats || {};
    setText('employee-name', data.user?.fullName || 'Employee');
    setText('employee-assigned', stats.assignedApplications || 0);
    setText('employee-followups', stats.pendingFollowups || 0);
    setText('employee-sanctioned', stats.sanctioned || 0);
    setText('employee-disbursed', stats.disbursed || 0);
    bindEmployeeSummaryCards();
    renderDashboardUpdates('employee-client-replies-list', data.clientReplies || []);
    fillApplicationSelect('employee-update-application', data.applications || []);
    renderDashboardUpdates('employee-updates-list', data.employeeUpdates || []);
    bindEmployeeUpdateForm();
    bindDailyUpdateForm();
    await loadEmployeeDailyHistory();
    if (!quiet) setStatus('', '');
  }

  async function loadEmployeeDetailPage({ quiet = false } = {}) {
    if (!quiet) setStatus('Loading employee details...', 'info');
    const data = await apiFetch('/api/employee/dashboard', getToken(USER_TOKEN_KEY));
    applyDashboardTheme('employee', data.user || {});
    const type = new URLSearchParams(window.location.search).get('type') || 'assigned';
    setText('employee-detail-name', data.user?.fullName || 'Employee');
    renderEmployeeCardDetails(type, data);
    fillApplicationSelect('employee-update-application', data.applications || []);
    renderDashboardUpdates('employee-updates-list', data.employeeUpdates || []);
    bindEmployeeUpdateForm();
    if (!quiet) setStatus('', '');
  }

  function bindEmployeeUpdateForm() {
    const form = $('#employee-update-form');
    if (!form || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const applicationId = $('#employee-update-application')?.value || '';
      if (!applicationId) {
        setStatus('Please select an application.', 'error');
        return;
      }
      const values = Object.fromEntries(new FormData(form).entries());
      const internalOnly = Boolean(form.elements.internalOnly?.checked);
      const payload = {
        title: values.title || '',
        message: values.message || '',
        updateType: values.updateType || 'message',
        studentVisible: !internalOnly && Boolean(form.elements.studentVisible?.checked),
        clientVisible: !internalOnly && Boolean(form.elements.clientVisible?.checked),
        boardVisible: Boolean(form.elements.boardVisible?.checked),
        internalOnly,
        visibleToUser: !internalOnly && (Boolean(form.elements.studentVisible?.checked) || Boolean(form.elements.clientVisible?.checked))
      };
      setStatus('Posting update...', 'info');
      try {
        await apiWrite(`/api/employee/applications/${encodeURIComponent(applicationId)}/updates`, getToken(USER_TOKEN_KEY), payload);
        form.reset();
        notifyCrmChanged(applicationId);
        await loadEmployeeDetailPage({ quiet: true });
        setStatus('Update posted successfully.', 'success');
      } catch (error) {
        setStatus(error.message, 'error');
      }
    });
  }

  function bindDailyUpdateForm() {
    const form = $('#employee-daily-update-form');
    if (!form || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';
    const workDateInput = form.elements.workDate;
    const setDefaultWorkDate = () => {
      if (workDateInput && !workDateInput.value) workDateInput.value = localDateKey();
    };
    setDefaultWorkDate();
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      setStatus('Submitting daily update...', 'info');
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.workDate = payload.workDate || localDateKey();
      try {
        await apiWrite('/api/employee/daily-updates', getToken(USER_TOKEN_KEY), payload);
        form.reset();
        setDefaultWorkDate();
        notifyCrmChanged();
        await loadEmployeeDashboard({ quiet: true });
        await loadEmployeeDailyHistory();
        setStatus('Daily work update submitted successfully.', 'success');
      } catch (error) {
        setStatus(error.message, 'error');
      }
    });
  }

  async function loadClientDashboard({ quiet = false } = {}) {
    if (!quiet) setStatus('Loading client dashboard...', 'info');
    const data = await apiFetch('/api/client/dashboard', getToken(USER_TOKEN_KEY));
    applyDashboardTheme('client', data.user || data.partner || {});
    const summary = data.summary || {};
    setText('client-name', data.user?.fullName || data.partner?.name || 'Reference Partner');
    setText('client-total-references', summary.totalReferences || 0);
    setText('client-approved-disbursed', summary.approvedDisbursed || 0);
    setText('client-ongoing', summary.ongoing || 0);
    setText('client-rejected', summary.rejected || 0);
    setText('client-commission-due', data.commissionVisible ? money(summary.commissionDue) : 'Hidden');
    setText('client-commission-paid', data.commissionVisible ? money(summary.commissionPaid) : 'Hidden');
    setText('client-total-commission', data.commissionVisible ? money(summary.totalCommissionValue) : 'Hidden');
    bindClientSummaryCards(data);
    fillApplicationSelect('client-reply-application', data.applications || []);
    renderDashboardUpdates('client-updates-list', data.updates || []);
    bindClientReplyForm();
    if (!quiet) setStatus('', '');
  }

  async function loadClientDetailPage({ quiet = false } = {}) {
    if (!quiet) setStatus('Loading details...', 'info');
    const data = await apiFetch('/api/client/dashboard', getToken(USER_TOKEN_KEY));
    applyDashboardTheme('client', data.user || data.partner || {});
    const type = new URLSearchParams(window.location.search).get('type') || 'total';
    setText('client-detail-name', data.user?.fullName || data.partner?.name || 'Reference Partner');
    renderClientCardDetails(type, data);
    if (!quiet) setStatus('', '');
  }

  function bindClientReplyForm() {
    const form = $('#client-reply-message-form') || $('#client-reply-form');
    if (!form || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(form).entries());
      values.applicationId = $('#client-reply-application')?.value || values.applicationId || '';
      if (!values.applicationId) {
        setStatus('Please select an application.', 'error');
        return;
      }
      setStatus('Sending reply...', 'info');
      try {
        await apiWrite(`/api/client/references/${encodeURIComponent(values.applicationId)}/replies`, getToken(USER_TOKEN_KEY), {
          message: values.message
        });
        form.reset();
        notifyCrmChanged(values.applicationId);
        await loadClientDashboard({ quiet: true });
        setStatus('Reply sent successfully.', 'success');
      } catch (error) {
        setStatus(error.message, 'error');
      }
    });
  }

  function reportBar(item, max) {
    const width = max ? Math.max(4, Math.round((Number(item.value || 0) / max) * 100)) : 4;
    return `<article class="smartcrm-bar-row"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value || 0)}</strong><i style="width:${width}%"></i></article>`;
  }

  function percentage(part, total) {
    const safeTotal = Number(total || 0);
    if (!safeTotal) return 0;
    return Math.round((Number(part || 0) / safeTotal) * 100);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(Number(value || 0), min), max);
  }

  function shortName(value) {
    return String(value || 'Employee').split(/\s+/)[0] || 'Employee';
  }

  function renderPerformanceBars(rows = []) {
    const target = $('#admin-performance-bars');
    if (!target) return;
    const card = target.closest('#employee-performance-overview');
    const items = rows.slice(0, 5);
    if (!items.length) {
      card?.classList.add('is-empty-performance');
      target.innerHTML = '<p class="admin-table-note">No employee performance data yet.</p>';
      return;
    }
    card?.classList.remove('is-empty-performance');
    const max = Math.max(...items.flatMap((item) => [
      item.leadsHandled || 0,
      item.followupsCompleted || 0,
      item.sanctionsAchieved || 0,
      item.disbursementsAchieved || 0
    ]), 1);
    target.innerHTML = `
      <div class="smartcrm-chart-legend">
        <span><i class="legend-purple"></i>Leads Handled</span>
        <span><i class="legend-blue"></i>Follow-ups Completed</span>
        <span><i class="legend-green"></i>Sanctions</span>
        <span><i class="legend-gold"></i>Disbursements</span>
      </div>
      <div class="smartcrm-bar-stage">
        ${items.map((item) => {
          const values = [
            ['purple', item.leadsHandled || 0],
            ['blue', item.followupsCompleted || 0],
            ['green', item.sanctionsAchieved || 0],
            ['gold', item.disbursementsAchieved || 0]
          ];
          return `
            <div class="smartcrm-employee-bars">
              <div class="smartcrm-bar-cluster">
                ${values.map(([tone, value]) => `<span class="${tone}" style="height:${clamp((value / max) * 100, 7, 100)}%"><b>${escapeHtml(value)}</b></span>`).join('')}
              </div>
              <strong>${escapeHtml(shortName(item.employeeName))}</strong>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderCompliance(data = {}) {
    const submitted = Number(data.submitted || 0);
    const pending = Number(data.pending || 0);
    const total = submitted + pending;
    const percent = percentage(submitted, total);
    const donut = $('#admin-compliance-donut');
    if (donut) donut.style.setProperty('--value', percent);
    setText('admin-compliance-percent', `${percent}%`);
    setText('admin-compliance-alert', `${pending} employees pending daily update`);
  }

  function seriesFromValue(value, variant = 0) {
    const base = Math.max(Number(value || 0), 1);
    const patterns = [
      [0.62, 0.82, 0.72, 1, 0.78, 0.74, 0.92],
      [0.55, 0.76, 0.63, 0.84, 0.66, 0.81, 0.88],
      [0.5, 0.68, 0.58, 0.74, 0.6, 0.7, 0.76]
    ];
    return patterns[variant].map((factor) => Math.round(base * factor));
  }

  function polyline(series, max, color) {
    const width = 520;
    const height = 180;
    const points = series.map((value, index) => {
      const x = 18 + index * ((width - 36) / Math.max(series.length - 1, 1));
      const y = height - 18 - ((Number(value || 0) / max) * (height - 42));
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    return `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>`;
  }

  function renderWeeklyTrend(data = {}) {
    const target = $('#admin-weekly-trend');
    if (!target) return;
    const leads = seriesFromValue(data.stats?.totalLeads || 0, 0);
    const sanctions = seriesFromValue(data.stats?.sanctioned || 0, 1);
    const disbursements = seriesFromValue(data.stats?.disbursed || 0, 2);
    const max = Math.max(...leads, ...sanctions, ...disbursements, 1);
    const labels = ['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16', 'Sat 17', 'Sun 18'];
    target.innerHTML = `
      <div class="smartcrm-line-legend">
        <span><i class="legend-purple"></i>Leads</span>
        <span><i class="legend-green"></i>Sanctions</span>
        <span><i class="legend-gold"></i>Disbursements</span>
      </div>
      <svg viewBox="0 0 520 215" role="img" aria-label="Weekly business trend">
        <g class="grid">
          <line x1="18" y1="28" x2="502" y2="28"></line>
          <line x1="18" y1="78" x2="502" y2="78"></line>
          <line x1="18" y1="128" x2="502" y2="128"></line>
          <line x1="18" y1="178" x2="502" y2="178"></line>
        </g>
        ${polyline(leads, max, '#6554e8')}
        ${polyline(sanctions, max, '#35a853')}
        ${polyline(disbursements, max, '#f2a51a')}
        ${labels.map((label, index) => `<text x="${18 + index * (484 / 6)}" y="207" text-anchor="middle">${escapeHtml(label)}</text>`).join('')}
      </svg>
    `;
  }

  function renderFunnel(items = []) {
    const target = $('#admin-lead-funnel');
    if (!target) return;
    target.closest('.smartcrm-funnel-layout')?.querySelectorAll('.smartcrm-conversion-card').forEach((card) => card.remove());
    const max = Math.max(...items.map((item) => Number(item.value || 0)), 1);
    const colors = ['#3478e5', '#8e4cc4', '#f59e32', '#15a4ad', '#4290e8', '#54b85a', '#7ab842', '#8a8f99'];
    if (target.classList.contains('smartcrm-funnel')) {
      target.innerHTML = items.map((item, index) => {
        return `<article style="--funnel-color:${colors[index % colors.length]};display:grid;width:100%;max-width:100%;min-width:0;grid-template-columns:minmax(0,1fr) auto;align-items:center;column-gap:1rem"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value || 0)}</strong></article>`;
      }).join('');
    } else {
      target.innerHTML = items.map((item) => reportBar(item, max)).join('');
    }
  }

  function renderSourceDonut(rows = [], stats = {}) {
    const donut = $('#admin-source-donut');
    const total = rows.reduce((sum, item) => sum + Number(item.totalReferences || 0), 0);
    const colors = ['#1d8fe8', '#51b85a', '#f3b43f', '#f27654', '#9b77d9', '#14a3a3'];
    if (donut) {
      if (!total) {
        donut.style.background = 'conic-gradient(#e7ebf1 0 100%)';
        donut.innerHTML = '<strong>0</strong><span>Total References</span>';
      } else {
        let cursor = 0;
        const stops = rows.map((item, index) => {
          const share = (Number(item.totalReferences || 0) / total) * 100;
          const start = cursor;
          cursor += share;
          return `${colors[index % colors.length]} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`;
        }).join(', ');
        donut.style.background = `conic-gradient(${stops})`;
        donut.innerHTML = `<strong>${escapeHtml(total)}</strong><span>Total References</span>`;
      }
    }
    const noteValue = stats.disbursed || 0;
    setText('admin-source-note', `Disbursed from these sources: ${noteValue} (${percentage(noteValue, total)}% Conversion)`);
  }

  function commissionStatusClass(status) {
    const value = String(status || '').toLowerCase();
    if (value === 'paid') return 'is-paid';
    if (value === 'due') return 'is-due';
    if (value === 'hold') return 'is-hold';
    return 'is-muted';
  }

  function renderCommissionTable(data = {}) {
    const target = $('#admin-commission-table');
    if (!target) return;
    const detailed = target.dataset.commissionTable === 'detailed';
    const partnerTypeFilter = $('#commission-partner-type-filter')?.value || '';
    const statusFilter = $('#commission-status-filter')?.value || '';
    const startFilter = $('#commission-start-date')?.value || '';
    const endFilter = $('#commission-end-date')?.value || '';
    const rows = (data.commissionAnalytics?.rows || []).filter((item) => {
      if (partnerTypeFilter && item.partnerType !== partnerTypeFilter) return false;
      if (statusFilter && item.commissionStatus !== statusFilter) return false;
      if (startFilter || endFilter) {
        const paidTime = item.paidDate ? new Date(`${item.paidDate}T00:00:00`).getTime() : 0;
        if (startFilter && (!paidTime || paidTime < new Date(`${startFilter}T00:00:00`).getTime())) return false;
        if (endFilter && (!paidTime || paidTime > new Date(`${endFilter}T23:59:59`).getTime())) return false;
      }
      return true;
    });
    if (detailed) {
      target.innerHTML = rows.length ? rows.map((item, index) => `
        <tr>
          <td>${escapeHtml(item.partnerName || item.referencePartnerId || `Partner ${index + 1}`)}</td>
          <td>${escapeHtml(formatLabel(item.partnerType || 'not_applicable'))}</td>
          <td>${escapeHtml(item.commissionPercentage || 0)}%</td>
          <td>${money(item.commissionAmount || 0)}</td>
          <td><span class="smartcrm-status ${commissionStatusClass(item.commissionStatus)}">${escapeHtml(formatLabel(item.commissionStatus || 'not_applicable'))}</span></td>
          <td>${escapeHtml(formatDate(item.paidDate))}</td>
          <td>${escapeHtml(item.paymentReference || '-')}</td>
          <td>${escapeHtml(item.notes || item.commissionNotes || '-')}</td>
        </tr>
      `).join('') : '<tr><td colspan="8">No commission records match these filters.</td></tr>';
    } else {
      target.innerHTML = rows.length ? rows.slice(0, 6).map((item, index) => `
      <tr>
        <td>${escapeHtml(item.partnerName || item.referencePartnerId || `Partner ${index + 1}`)}</td>
        <td>${escapeHtml(item.commissionPercentage || 0)}%</td>
        <td>${money(item.commissionAmount || 0)}</td>
        <td><span class="smartcrm-status ${commissionStatusClass(item.commissionStatus)}">${escapeHtml(formatLabel(item.commissionStatus || 'not_applicable'))}</span></td>
      </tr>
    `).join('') : '<tr><td colspan="4">No commission records yet.</td></tr>';
    }
    const due = data.commissionAnalytics?.totalDue || data.stats?.commissionDue || 0;
    const paid = data.commissionAnalytics?.totalPaid || data.stats?.commissionPaid || 0;
    setText('admin-commission-total-paid', money(paid));
    setText('admin-commission-total-due', money(due));
    setText('admin-commission-total-value', money(Number(due) + Number(paid)));
  }

  function bindCommissionFilters() {
    const form = $('#commission-filters');
    if (!form || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (latestReportData) renderCommissionTable(latestReportData);
    });
    form.addEventListener('change', () => {
      if (latestReportData) renderCommissionTable(latestReportData);
    });
    $('#commission-filter-reset')?.addEventListener('click', () => {
      form.reset();
      if (latestReportData) renderCommissionTable(latestReportData);
    });
  }

  function renderActivity(rows = []) {
    const target = $('#admin-recent-activity');
    if (!target) return;
    const activityText = (item = {}) => {
      const leadName = item.name || 'Application';
      const appId = item.applicationId ? ` (${item.applicationId})` : '';
      const relatedName = item.consultantClientName || item.assignedAdminName || item.clientName || item.employeeName || '';
      if (relatedName) return `${leadName}${appId} assigned to ${relatedName}`;
      return `${leadName}${appId} updated`;
    };
    target.innerHTML = rows.length ? rows.slice(0, 6).map((item) => `
      <article>
        <span>${escapeHtml((item.name || 'U').slice(0, 1).toUpperCase())}</span>
        <p>${escapeHtml(activityText(item))}</p>
        <time>${formatDate(item.updatedAt || item.createdAt)}</time>
      </article>
    `).join('') : '<p class="admin-table-note">No recent CRM activity yet.</p>';
  }

  function renderAlerts(alerts = []) {
    const target = $('#admin-smart-alerts');
    if (!target) return;
    setText('admin-alert-count', alerts.length);
    target.innerHTML = alerts.length ? alerts.map((item, index) => `
      <li class="tone-${index % 4}">
        <span>${index + 1}</span>
        <p>${escapeHtml(item)}</p>
      </li>
    `).join('') : '<li><p>No smart alerts right now.</p></li>';
  }

  function renderReports(data, prefix = 'admin') {
    latestReportData = data;
    const stats = data.stats || {};
    setText(`${prefix}-total-leads`, stats.totalLeads || 0);
    setText(`${prefix}-ongoing-files`, stats.ongoingFiles || 0);
    setText(`${prefix}-sanctioned`, stats.sanctioned || 0);
    setText(`${prefix}-disbursed`, stats.disbursed || 0);
    setText(`${prefix}-weekly-income`, compactMoney(stats.weeklyIncome || 0));
    setText(`${prefix}-monthly-net-income`, compactMoney(stats.monthlyNetIncome || 0));
    setText(`${prefix}-commission-due`, compactMoney(stats.commissionDue || 0));
    setText(`${prefix}-commission-paid`, compactMoney(stats.commissionPaid || 0));

    const funnel = $(`#${prefix}-lead-funnel`);
    if (funnel) {
      const max = Math.max(...(data.leadFunnel || []).map((item) => Number(item.value || 0)), 1);
      if (prefix === 'admin') {
        renderFunnel(data.leadFunnel || []);
      } else {
        funnel.innerHTML = (data.leadFunnel || []).map((item) => reportBar(item, max)).join('');
      }
    }

    if (prefix === 'admin') {
      renderAlerts(data.smartAlerts || []);
    } else {
      const alerts = $(`#${prefix}-smart-alerts`);
      if (alerts) {
        alerts.innerHTML = (data.smartAlerts || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
      }
    }

    const leaderboard = $(`#${prefix}-employee-performance`);
    if (leaderboard) {
      leaderboard.innerHTML = (data.employeePerformance || []).length
        ? data.employeePerformance.map((item, index) => `
          <article class="smartcrm-leader-row">
            <span>${index + 1}</span>
            <strong>${escapeHtml(item.employeeName || 'Employee')}</strong>
            <em>${escapeHtml(item.performanceScore || 0)}/100</em>
          </article>
        `).join('')
        : '<p class="admin-table-note">No employee performance data yet.</p>';
    }

    const source = $(`#${prefix}-source-performance`);
    if (source) {
      source.innerHTML = (data.sourcePerformance || []).map((item) => `
        <article>
          <strong>${escapeHtml(formatLabel(item.source))}</strong>
          <span>${escapeHtml(item.totalReferences)} refs</span>
          <span>${escapeHtml(item.conversionRate)}% conversion</span>
          <span>${money(item.disbursedValue)}</span>
        </article>
      `).join('');
    }

    const revenue = data.revenueSnapshot || {};
    setText(`${prefix}-gross-income`, compactMoney(revenue.grossIncome || 0));
    setText(`${prefix}-partner-commission`, compactMoney(revenue.partnerCommissionPayable || stats.commissionDue || 0));
    setText(`${prefix}-employee-incentives`, compactMoney(revenue.employeeIncentives || 0));
    setText(`${prefix}-net-income`, compactMoney(revenue.netIncome || 0));
    setText(`${prefix}-daily-submitted`, data.dailyUpdateCompliance?.submitted || 0);
    setText(`${prefix}-daily-pending`, data.dailyUpdateCompliance?.pending || 0);

    if (prefix === 'admin') {
      renderPerformanceBars(data.employeePerformance || []);
      renderCompliance(data.dailyUpdateCompliance || {});
      renderWeeklyTrend(data);
      renderSourceDonut(data.sourcePerformance || [], stats);
      renderCommissionTable(data);
      renderActivity(data.recentCrmUpdates || []);
    }
  }

  function daysInMonth(year, month) {
    return new Date(Number(year), Number(month), 0).getDate();
  }

  function monthParts(value) {
    const fallback = localDateKey().slice(0, 7);
    const [year, month] = String(value || fallback).split('-').map(Number);
    return {
      year: year || Number(fallback.slice(0, 4)),
      month: month || Number(fallback.slice(5, 7))
    };
  }

  function updateEmployeeReportControls() {
    const form = $('#employee-performance-report-form');
    if (!form) return;
    const type = $('#employee-report-type')?.value || 'daily';
    $all('[data-report-field]', form).forEach((field) => {
      const name = field.dataset.reportField;
      field.hidden = (type === 'daily' && name !== 'date') ||
        (type === 'weekly' && !['month', 'week'].includes(name)) ||
        (type === 'monthly' && name !== 'month');
    });
    const monthInput = $('#employee-report-month');
    const weekSelect = $('#employee-report-week');
    if (monthInput && weekSelect) {
      const { year, month } = monthParts(monthInput.value);
      const weeks = Math.ceil(daysInMonth(year, month) / 7);
      const selected = Number(weekSelect.value || 1);
      weekSelect.innerHTML = Array.from({ length: weeks }, (_, index) => {
        const value = index + 1;
        return `<option value="${value}" ${value === selected ? 'selected' : ''}>Week ${value}</option>`;
      }).join('');
    }
  }

  function employeeReportQuery() {
    const type = $('#employee-report-type')?.value || 'daily';
    const query = new URLSearchParams({ reportType: type });
    const employeeId = $('#employee-report-employee')?.value || '';
    if (employeeId) query.set('employeeId', employeeId);
    if (type === 'daily') {
      query.set('date', $('#employee-report-date')?.value || localDateKey());
    } else {
      const { year, month } = monthParts($('#employee-report-month')?.value);
      query.set('year', String(year));
      query.set('month', String(month));
      if (type === 'weekly') query.set('week', $('#employee-report-week')?.value || '1');
    }
    return query;
  }

  function populateEmployeeReportEmployees(report = {}) {
    const select = $('#employee-report-employee');
    if (!select || select.dataset.loaded === 'true') return;
    const current = select.value;
    select.innerHTML = '<option value="">All employees</option>' + (report.employees || []).map((employee) => (
      `<option value="${escapeHtml(employee.employeeId)}">${escapeHtml(employee.employeeName)}</option>`
    )).join('');
    select.value = current;
    select.dataset.loaded = 'true';
  }

  function employeeReportTitle(report = latestEmployeePerformanceReport || {}) {
    const label = report.label || '';
    if (report.reportType === 'weekly') return `Employee Weekly Performance Report - ${label}`;
    if (report.reportType === 'monthly') return `Employee Monthly Performance Report - ${label}`;
    return `Employee Daily Performance Report - ${label}`;
  }

  function employeeReportFilename(report = latestEmployeePerformanceReport || {}, extension = 'csv') {
    const part = report.filenamePart || `daily-${localDateKey()}`;
    return `employee-performance-${part}.${extension}`;
  }

  function employeeReportExportLabel(format) {
    if (format === 'pdf') return 'Export PDF';
    if (format === 'pdf-download') return 'Download PDF';
    return 'Export CSV';
  }

  function setEmployeeReportExportFormat(format = 'csv') {
    const select = $('#employee-report-export-format');
    const button = $('#employee-report-export-button');
    if (select) select.value = format;
    if (button) button.textContent = employeeReportExportLabel(format);
  }

  function openEmployeeReportPanel(action = 'view') {
    const modal = $('#employee-performance-reports');
    if (modal) modal.hidden = false;
    employeeReportPanelAction = action;
    const form = $('#employee-performance-report-form');
    if (form) form.hidden = false;
    if (action !== 'view') setEmployeeReportExportFormat(action);
    const empty = $('#employee-report-empty');
    if (empty && !employeeReportHasLoaded) {
      empty.textContent = action === 'view'
        ? 'Choose filters, then click View Report.'
        : `Choose filters, then click ${employeeReportExportLabel(action)}.`;
    }
  }

  function closeEmployeeReportPanel() {
    const modal = $('#employee-performance-reports');
    if (modal) modal.hidden = true;
    employeeReportPanelAction = '';
  }

  function toggleEmployeeReportPanel(action = 'view') {
    const modal = $('#employee-performance-reports');
    if (modal && !modal.hidden && employeeReportPanelAction === action) {
      closeEmployeeReportPanel();
      return;
    }
    openEmployeeReportPanel(action);
  }

  function employeeReportFilteredRows() {
    const report = latestEmployeePerformanceReport || {};
    const search = ($('#employee-report-search')?.value || '').trim().toLowerCase();
    const rows = report.rows || [];
    if (!search) return rows;
    return rows.filter((item) => String(item.employeeName || '').toLowerCase().includes(search));
  }

  function renderEmployeeReportRows() {
    const body = $('#employee-report-body');
    if (!body) return;
    if (!employeeReportHasLoaded) {
      body.innerHTML = '<tr><td colspan="13">Select filters and click View Report.</td></tr>';
      return;
    }
    const rows = employeeReportFilteredRows();
    const pageSize = Number($('#employee-report-page-size')?.value || 10);
    const totalPages = Math.max(Math.ceil(rows.length / pageSize), 1);
    employeeReportPage = Math.min(Math.max(employeeReportPage, 1), totalPages);
    const start = (employeeReportPage - 1) * pageSize;
    const pageRows = rows.slice(start, start + pageSize);
    body.innerHTML = pageRows.length ? pageRows.map((item) => `
      <tr>
        <td>${escapeHtml(item.employeeName || 'Employee')}</td>
        <td>${escapeHtml(formatDate(item.workDate))}</td>
        <td>${escapeHtml(item.totalLeadsHandled || 0)}</td>
        <td>${escapeHtml(item.newLeadsContacted || 0)}</td>
        <td>${escapeHtml(item.followupsDone || 0)}</td>
        <td>${escapeHtml(item.sanctions || item.sanctionUpdates || 0)}</td>
        <td>${escapeHtml(item.disbursements || item.disbursementUpdates || 0)}</td>
        <td>${escapeHtml(item.documentsCollected || 0)}</td>
        <td>${escapeHtml(item.filesLoggedIntoBank || item.bankLoginsDone || 0)}</td>
        <td>${escapeHtml(item.filesApproved || 0)}</td>
        <td>${escapeHtml(item.filesRejected || item.rejectedCount || 0)}</td>
        <td>${escapeHtml(item.notes || item.remarks || '-')}</td>
        <td>${escapeHtml(formatDate(item.submittedAt || item.createdAt))}</td>
      </tr>
    `).join('') : '<tr><td colspan="13">No employee daily updates match this report.</td></tr>';

    const resultTools = $('#employee-report-result-tools');
    const pagination = $('#employee-report-pagination');
    const tableWrap = $('#employee-report-table-wrap');
    const info = $('#employee-report-page-info');
    const prev = $('#employee-report-prev');
    const next = $('#employee-report-next');
    if (resultTools) resultTools.hidden = false;
    if (tableWrap) tableWrap.hidden = false;
    if (pagination) pagination.hidden = rows.length <= pageSize;
    if (info) info.textContent = `${rows.length ? start + 1 : 0}-${Math.min(start + pageSize, rows.length)} of ${rows.length}`;
    if (prev) prev.disabled = employeeReportPage <= 1;
    if (next) next.disabled = employeeReportPage >= totalPages;
  }

  function renderEmployeePerformanceReport(report = {}) {
    latestEmployeePerformanceReport = report;
    populateEmployeeReportEmployees(report);
    const summary = $('#employee-report-summary');
    const rows = report.rows || [];
    const totals = report.totals || {};
    if (summary) {
      summary.hidden = false;
      summary.innerHTML = `
        <strong>${escapeHtml(employeeReportTitle(report))}</strong>
        <span>${escapeHtml(report.startDate || '')}${report.endDate && report.endDate !== report.startDate ? ` to ${escapeHtml(report.endDate)}` : ''}</span>
        <span>${rows.length} records</span>
        <span>${totals.totalLeadsHandled || 0} leads</span>
        <span>${totals.followupsDone || 0} follow-ups</span>
        <span>${totals.sanctions || 0} sanctions</span>
      `;
    }
    const empty = $('#employee-report-empty');
    if (empty) empty.hidden = true;
    renderEmployeeReportRows();
  }

  async function loadEmployeePerformanceReport({ render = true } = {}) {
    const form = $('#employee-performance-report-form');
    if (!form) return null;
    if (render) setStatus('Loading employee performance report...', 'info');
    const token = getToken(ADMIN_TOKEN_KEY);
    const data = await apiFetch(`/api/admin/reports/employee-performance/history?${employeeReportQuery().toString()}`, token);
    latestEmployeePerformanceReport = data.report || {};
    populateEmployeeReportEmployees(latestEmployeePerformanceReport);
    if (render) {
      employeeReportHasLoaded = true;
      employeeReportPage = 1;
      renderEmployeePerformanceReport(latestEmployeePerformanceReport);
      setStatus('', '');
    }
    return data.report;
  }

  function employeeReportCsv(report = latestEmployeePerformanceReport || {}) {
    const rows = report.rows || [];
    const header = ['Employee name', 'Work date', 'Total leads handled', 'New leads contacted', 'Follow-ups done', 'Sanctions', 'Disbursements', 'Documents collected', 'Files logged into bank', 'Files approved', 'Files rejected', 'Notes', 'Submitted time'];
    const dataRows = rows.map((item) => [
      item.employeeName,
      item.workDate,
      item.totalLeadsHandled,
      item.newLeadsContacted,
      item.followupsDone,
      item.sanctions || item.sanctionUpdates,
      item.disbursements || item.disbursementUpdates,
      item.documentsCollected,
      item.filesLoggedIntoBank || item.bankLoginsDone,
      item.filesApproved,
      item.filesRejected || item.rejectedCount,
      item.notes || item.remarks || '',
      item.submittedAt || item.createdAt || ''
    ]);
    return [header, ...dataRows].map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  }

  function employeeReportPdfLines(report = latestEmployeePerformanceReport || {}) {
    const rows = report.rows || [];
    const totals = report.totals || {};
    return [
      employeeReportTitle(report),
      `Date range: ${report.startDate || '-'}${report.endDate && report.endDate !== report.startDate ? ` to ${report.endDate}` : ''}`,
      `Records: ${rows.length}`,
      `Totals: Leads ${totals.totalLeadsHandled || 0}, Follow-ups ${totals.followupsDone || 0}, Sanctions ${totals.sanctions || 0}, Disbursements ${totals.disbursements || 0}`,
      '',
      'Employee | Work Date | Leads | New Leads | Follow-ups | Sanctions | Disbursements | Docs | Bank Logins | Approved | Rejected | Notes | Submitted',
      ...(
        rows.length
          ? rows.map((item) => `${item.employeeName || 'Employee'} | ${item.workDate || '-'} | ${item.totalLeadsHandled || 0} | ${item.newLeadsContacted || 0} | ${item.followupsDone || 0} | ${item.sanctions || item.sanctionUpdates || 0} | ${item.disbursements || item.disbursementUpdates || 0} | ${item.documentsCollected || 0} | ${item.filesLoggedIntoBank || item.bankLoginsDone || 0} | ${item.filesApproved || 0} | ${item.filesRejected || item.rejectedCount || 0} | ${item.notes || item.remarks || '-'} | ${formatDate(item.submittedAt || item.createdAt)}`)
          : ['No employee daily updates match this report.']
      )
    ];
  }

  function buildEmployeeReportHtml(report = latestEmployeePerformanceReport || {}) {
    const rows = report.rows || [];
    const totals = report.totals || {};
    return buildPrintableShell({
      title: employeeReportTitle(report),
      subtitle: `${report.startDate || '-'}${report.endDate && report.endDate !== report.startDate ? ` to ${report.endDate}` : ''}`,
      kpis: [
        ['Records', rows.length],
        ['Total Leads', totals.totalLeadsHandled || 0],
        ['Follow-ups', totals.followupsDone || 0],
        ['Sanctions', totals.sanctions || 0],
        ['Disbursements', totals.disbursements || 0],
        ['Documents', totals.documentsCollected || 0],
        ['Bank Files', totals.bankLoginsDone || 0],
        ['Rejected', totals.filesRejected || totals.rejectedCount || 0]
      ],
      sections: [
        {
          title: 'Employee Daily Updates',
          headers: ['Employee', 'Work Date', 'Leads', 'New Leads', 'Follow-ups', 'Sanctions', 'Disbursements', 'Docs', 'Bank Files', 'Approved', 'Rejected', 'Submitted'],
          rows: rows.map((item) => [
            item.employeeName || 'Employee',
            formatDate(item.workDate),
            item.totalLeadsHandled || 0,
            item.newLeadsContacted || 0,
            item.followupsDone || 0,
            item.sanctions || item.sanctionUpdates || 0,
            item.disbursements || item.disbursementUpdates || 0,
            item.documentsCollected || 0,
            item.filesLoggedIntoBank || item.bankLoginsDone || 0,
            item.filesApproved || 0,
            item.filesRejected || item.rejectedCount || 0,
            formatDate(item.submittedAt || item.createdAt)
          ]),
          empty: 'No employee daily updates match this report.'
        }
      ]
    });
  }

  function printEmployeeReport(report = latestEmployeePerformanceReport || {}) {
    printHtmlDocument(buildEmployeeReportHtml(report));
  }

  function buildEmployeeReportPdf(report = latestEmployeePerformanceReport || {}) {
    const rows = report.rows || [];
    const totals = report.totals || {};
    return buildStyledPdf({
      title: employeeReportTitle(report),
      subtitle: `${report.startDate || '-'}${report.endDate && report.endDate !== report.startDate ? ` to ${report.endDate}` : ''}`,
      kpis: [
        ['Records', rows.length],
        ['Total Leads', totals.totalLeadsHandled || 0],
        ['Follow-ups', totals.followupsDone || 0],
        ['Sanctions', totals.sanctions || 0],
        ['Disbursements', totals.disbursements || 0],
        ['Documents', totals.documentsCollected || 0],
        ['Bank Files', totals.bankLoginsDone || 0],
        ['Rejected', totals.filesRejected || totals.rejectedCount || 0]
      ],
      sections: [
        {
          title: 'Employee Daily Updates',
          headers: ['Employee', 'Work Date', 'Leads', 'New Leads', 'Follow-ups', 'Sanctions', 'Disbursements', 'Docs', 'Bank Files', 'Approved', 'Rejected', 'Submitted'],
          rows: rows.map((item) => [
            item.employeeName || 'Employee',
            formatDate(item.workDate),
            item.totalLeadsHandled || 0,
            item.newLeadsContacted || 0,
            item.followupsDone || 0,
            item.sanctions || item.sanctionUpdates || 0,
            item.disbursements || item.disbursementUpdates || 0,
            item.documentsCollected || 0,
            item.filesLoggedIntoBank || item.bankLoginsDone || 0,
            item.filesApproved || 0,
            item.filesRejected || item.rejectedCount || 0,
            formatDate(item.submittedAt || item.createdAt)
          ]),
          empty: 'No employee daily updates match this report.'
        }
      ]
    });
  }

  function downloadEmployeeReportPdf(report = latestEmployeePerformanceReport || {}) {
    const pdf = buildEmployeeReportPdf(report);
    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = employeeReportFilename(report, 'pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function bindEmployeePerformanceReport() {
    const form = $('#employee-performance-report-form');
    if (!form || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';
    const today = localDateKey();
    const month = today.slice(0, 7);
    const dateInput = $('#employee-report-date');
    const monthInput = $('#employee-report-month');
    if (dateInput && !dateInput.value) dateInput.value = today;
    if (monthInput && !monthInput.value) monthInput.value = month;
    updateEmployeeReportControls();
    setEmployeeReportExportFormat($('#employee-report-export-format')?.value || 'csv');
    $('#employee-report-close')?.addEventListener('click', closeEmployeeReportPanel);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      openEmployeeReportPanel('view');
      loadEmployeePerformanceReport().catch((error) => setStatus(error.message, 'error'));
    });
    $('#employee-report-type')?.addEventListener('change', updateEmployeeReportControls);
    $('#employee-report-month')?.addEventListener('change', updateEmployeeReportControls);
    $('#employee-report-export-format')?.addEventListener('change', (event) => {
      setEmployeeReportExportFormat(event.target.value);
    });
    $('#employee-report-search')?.addEventListener('input', () => {
      employeeReportPage = 1;
      renderEmployeeReportRows();
    });
    $('#employee-report-page-size')?.addEventListener('change', () => {
      employeeReportPage = 1;
      renderEmployeeReportRows();
    });
    $('#employee-report-prev')?.addEventListener('click', () => {
      employeeReportPage -= 1;
      renderEmployeeReportRows();
    });
    $('#employee-report-next')?.addEventListener('click', () => {
      employeeReportPage += 1;
      renderEmployeeReportRows();
    });
    $('#employee-report-export-button')?.addEventListener('click', async () => {
      openEmployeeReportPanel($('#employee-report-export-format')?.value || 'csv');
      const report = await loadEmployeePerformanceReport();
      if (!report) return;
      const format = $('#employee-report-export-format')?.value || 'csv';
      if (format === 'csv') {
        downloadText(employeeReportFilename(report, 'csv'), employeeReportCsv(report), 'text/csv');
        return;
      }
      if (format === 'pdf-download') {
        downloadEmployeeReportPdf(report);
        return;
      }
      printEmployeeReport(report);
    });
    loadEmployeePerformanceReport({ render: false }).catch((error) => setStatus(error.message, 'error'));
  }

  async function loadAdminReports(prefix = 'admin') {
    const token = getToken(ADMIN_TOKEN_KEY);
    if (!token) return;
    const data = await apiFetch('/api/admin/reports/overview', token);
    renderReports(data, prefix);
  }

  async function loadBoardDashboard({ quiet = false } = {}) {
    if (!quiet) setStatus('Loading board dashboard...', 'info');
    const data = await apiFetch('/api/board/dashboard', getToken(USER_TOKEN_KEY));
    applyDashboardTheme('board', data.user || {});
    window._boardData = data;
    renderReports(data, 'board');
    if (!quiet) setStatus('', '');
  }

  function downloadText(filename, text, type = 'text/plain') {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function buildPrintableShell({ title, subtitle = '', kpis = [], sections = [] } = {}) {
    const generatedAt = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const renderCell = (cell) => escapeHtml(cell ?? '-');
    return `<!doctype html>
      <html>
      <head>
        <title>Nidhi Path SmartCRM Report</title>
        <style>
          *{box-sizing:border-box}
          body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:24px;color:#0b2a4d;background:#fff}
          .print-page{max-width:980px;margin:0 auto}
          .print-top{display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#1f2f46;margin-bottom:24px}
          .report-kicker{text-align:center;font-weight:700;color:#1f2f46}
          h1{margin:0;color:#082552;font-size:26px;line-height:1.15;font-weight:800}
          .subtitle{margin:6px 0 0;color:#4d5d74;font-size:14px}
          .generated{margin:3px 0 16px;color:#4d5d74;font-size:12px}
          .gold-line{height:0;border-top:2px solid #c17d00;margin:16px 0 22px}
          .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:0 0 18px}
          .kpis div{border:1px solid #d7e0ec;border-radius:4px;padding:11px 12px;min-height:70px}
          .kpis span{display:block;color:#4d5d74;font-size:10px;font-weight:800;text-transform:uppercase}
          .kpis strong{display:block;margin-top:8px;font-size:18px;color:#c17d00}
          h2{margin:18px 0 9px;font-size:16px;color:#0b2a4d}
          table{border-collapse:collapse;width:100%;font-size:11px;margin-bottom:16px;page-break-inside:auto}
          tr{page-break-inside:avoid;page-break-after:auto}
          td,th{border:1px solid #d7e0ec;padding:7px 8px;text-align:left;vertical-align:top}
          th{background:#f8fafc;color:#0b2a4d;font-weight:800}
          .empty-row td{text-align:center;color:#607089}
          @page{size:A4;margin:12mm}
          @media print{
            body{padding:0}
            .print-page{max-width:none}
            .gold-line{border-top-color:#c17d00}
            .kpis{grid-template-columns:repeat(4,1fr);gap:8px}
          }
          @media(max-width:760px){
            body{padding:16px}
            .kpis{grid-template-columns:repeat(2,1fr)}
          }
        </style>
      </head>
      <body>
        <main class="print-page">
        <div class="print-top">
          <span>${escapeHtml(generatedAt)}</span>
          <span class="report-kicker">Nidhi Path SmartCRM Report</span>
        </div>
        <h1>${escapeHtml(title || 'Nidhi Path SmartCRM Report')}</h1>
        ${subtitle ? `<p class="subtitle">${escapeHtml(subtitle)}</p>` : ''}
        <p class="generated">Generated: ${escapeHtml(generatedAt)}</p>
        <div class="gold-line"></div>
        <section class="kpis">
          ${kpis.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}
        </section>
        ${sections.map((section) => `
          <h2>${escapeHtml(section.title)}</h2>
          <table>
            <thead><tr>${section.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>
            <tbody>
              ${section.rows.length
                ? section.rows.map((row) => `<tr>${row.map((cell) => `<td>${renderCell(cell)}</td>`).join('')}</tr>`).join('')
                : `<tr class="empty-row"><td colspan="${section.headers.length}">${escapeHtml(section.empty || 'No records found.')}</td></tr>`}
            </tbody>
          </table>
        `).join('')}
        </main>
      </body>
      </html>`;
  }

  function buildReportHtml(data = {}) {
    const stats = data.stats || {};
    const revenue = data.revenueSnapshot || {};
    const employeeRows = data.employeePerformance || [];
    const sourceRows = data.sourcePerformance || [];
    const commissionRows = data.commissionAnalytics?.rows || [];
    return buildPrintableShell({
      title: 'Nidhi Path SmartCRM Report',
      subtitle: 'Performance, Pipeline & Revenue Intelligence',
      kpis: [
        ['Total Leads', stats.totalLeads || 0],
        ['Ongoing Files', stats.ongoingFiles || 0],
        ['Sanctioned', stats.sanctioned || 0],
        ['Disbursed', stats.disbursed || 0],
        ['Weekly Income', compactMoney(stats.weeklyIncome || 0)],
        ['Monthly Net Income', compactMoney(stats.monthlyNetIncome || 0)],
        ['Commission Due', compactMoney(stats.commissionDue || 0)],
        ['Commission Paid', compactMoney(stats.commissionPaid || 0)]
      ],
      sections: [
        {
          title: 'Employee Performance',
          headers: ['Employee', 'Leads', 'Follow-ups', 'Bank Files', 'Sanctions', 'Disbursements', 'Score'],
          rows: employeeRows.map((item) => [
            item.employeeName || 'Employee',
            item.leadsHandled || 0,
            item.followupsCompleted || 0,
            item.bankFiles || item.bankLoginsDone || 0,
            item.sanctionsAchieved || 0,
            item.disbursementsAchieved || 0,
            `${item.performanceScore || 0}/100`
          ]),
          empty: 'No employee performance data yet.'
        },
        {
          title: 'Source-wise Business',
          headers: ['Source', 'Total References', 'Conversion', 'Disbursed Value'],
          rows: sourceRows.map((item) => [
            formatLabel(item.source || '-'),
            item.totalReferences || 0,
            `${item.conversionRate || 0}%`,
            money(item.disbursedValue || 0)
          ]),
          empty: 'No source-wise business data yet.'
        },
        {
          title: 'Commission Analytics',
          headers: ['Partner', 'Commission %', 'Commission', 'Status'],
          rows: commissionRows.map((item, index) => [
            item.partnerName || item.referencePartnerId || `Partner ${index + 1}`,
            item.commissionPercentage ? `${item.commissionPercentage}%` : '-',
            money(item.commissionAmount || 0),
            formatLabel(item.commissionStatus || 'not_applicable')
          ]),
          empty: 'No commission records yet.'
        }
      ]
    });
  }

  function printHtmlDocument(html) {
    const frame = document.createElement('iframe');
    frame.style.position = 'fixed';
    frame.style.right = '0';
    frame.style.bottom = '0';
    frame.style.width = '0';
    frame.style.height = '0';
    frame.style.border = '0';
    frame.setAttribute('aria-hidden', 'true');
    document.body.appendChild(frame);
    const doc = frame.contentWindow?.document;
    if (!doc) {
      frame.remove();
      return;
    }
    doc.open();
    doc.write(html);
    doc.close();
    window.setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      window.setTimeout(() => frame.remove(), 1000);
    }, 250);
  }

  function printReport(data = {}) {
    printHtmlDocument(buildReportHtml(data));
  }

  function pdfText(value) {
    return String(value ?? '')
      .replace(/[^\x20-\x7E]/g, ' ')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  }

  function reportPdfLines(data = {}) {
    const stats = data.stats || {};
    const revenue = data.revenueSnapshot || {};
    const employees = data.employeePerformance || [];
    const applications = data.applications || [];
    return [
      'Nidhi Path SmartCRM Intelligence',
      `Generated: ${formatDate(new Date().toISOString())}`,
      '',
      `Total Leads: ${stats.totalLeads || 0}`,
      `Sanctioned: ${stats.sanctioned || 0}`,
      `Disbursed: ${stats.disbursed || 0}`,
      `Net Income: ${compactMoney(revenue.netIncome || stats.monthlyNetIncome || 0)}`,
      '',
      'Employee Performance',
      ...(
        employees.length
          ? employees.map((item) => `${item.employeeName || 'Employee'} | Leads ${item.leadsHandled || 0} | Follow-ups ${item.followupsCompleted || 0} | Sanctions ${item.sanctionsAchieved || 0} | Disbursed ${item.disbursementsAchieved || 0} | Score ${item.performanceScore || 0}/100`)
          : ['No employee performance data yet.']
      ),
      '',
      'Lead Pipeline',
      ...(
        applications.length
          ? applications.slice(0, 80).map((item) => `${item.name || '-'} | ${item.email || '-'} | ${item.universityApplied || '-'} | ${money(item.loanAmount || 0)} | ${formatLabel(item.status || '-')}`)
          : ['No applications yet.']
      )
    ];
  }

  function buildSimplePdf(lines = []) {
    const pages = [];
    const lineHeight = 16;
    const linesPerPage = 45;
    for (let i = 0; i < lines.length; i += linesPerPage) {
      pages.push(lines.slice(i, i + linesPerPage));
    }
    if (!pages.length) pages.push(['Nidhi Path SmartCRM Report']);

    const objects = [];
    const addObject = (content) => {
      objects.push(content);
      return objects.length;
    };
    const fontId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    const pageIds = [];
    const pageContentIds = [];
    pages.forEach((pageLines) => {
      const commands = ['BT', '/F1 10 Tf', '50 800 Td'];
      pageLines.forEach((line, index) => {
        if (index) commands.push(`0 -${lineHeight} Td`);
        commands.push(`(${pdfText(line).slice(0, 105)}) Tj`);
      });
      commands.push('ET');
      const stream = commands.join('\n');
      const contentId = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
      pageContentIds.push(contentId);
    });
    const pagesId = objects.length + pages.length + 1;
    pageContentIds.forEach((contentId) => {
      pageIds.push(addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`));
    });
    addObject(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`);
    const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((content, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${content}\nendobj\n`;
    });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return pdf;
  }

  function pdfDisplayText(value) {
    return String(value ?? '-')
      .replace(/[^\x20-\x7E]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || '-';
  }

  function buildStyledPdf({ title = 'Nidhi Path SmartCRM Report', subtitle = '', kpis = [], sections = [] } = {}) {
    const pageWidth = 595;
    const pageHeight = 842;
    const margin = 42;
    const contentWidth = pageWidth - (margin * 2);
    const bottomMargin = 40;
    const generatedAt = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const pages = [];
    let commands = [];
    let y = pageHeight - 42;

    const esc = (value) => pdfText(pdfDisplayText(value));
    const cmd = (value) => commands.push(value);
    const text = (value, x, textY, size = 10, font = 'F1', color = '0 0 0') => {
      cmd(`BT /${font} ${size} Tf ${color} rg ${x} ${textY} Td (${esc(value)}) Tj ET`);
    };
    const line = (x1, y1, x2, y2, color = '0.82 0.87 0.93', width = 0.7) => {
      cmd(`${color} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
    };
    const rect = (x, rectY, w, h, stroke = '0.82 0.87 0.93', fill = '') => {
      if (fill) cmd(`q ${fill} rg ${x} ${rectY} ${w} ${h} re f Q`);
      cmd(`${stroke} RG 0.7 w ${x} ${rectY} ${w} ${h} re S`);
    };
    const finishPage = () => {
      pages.push(commands.join('\n'));
      commands = [];
    };
    const addPage = ({ continuation = false } = {}) => {
      if (commands.length) finishPage();
      y = pageHeight - 42;
      text(generatedAt, margin, y, 8, 'F1', '0.12 0.18 0.27');
      text('Nidhi Path SmartCRM Report', 390, y, 8, 'F2', '0.12 0.18 0.27');
      y -= continuation ? 34 : 64;
    };
    const ensureSpace = (height) => {
      if (y - height < bottomMargin) addPage({ continuation: true });
    };
    const truncate = (value, chars) => {
      const clean = pdfDisplayText(value);
      return clean.length > chars ? `${clean.slice(0, Math.max(chars - 3, 1))}...` : clean;
    };
    const drawTable = (section) => {
      const headers = section.headers || [];
      const rows = section.rows?.length ? section.rows : [headers.map(() => '')];
      const colWidth = contentWidth / Math.max(headers.length, 1);
      const rowHeight = 22;
      ensureSpace(58);
      text(section.title, margin, y, 13, 'F2', '0.03 0.15 0.32');
      y -= 20;
      rect(margin, y - rowHeight + 5, contentWidth, rowHeight, '0.82 0.87 0.93', '0.97 0.98 0.99');
      headers.forEach((header, index) => {
        const x = margin + (colWidth * index);
        if (index) line(x, y + 5, x, y - rowHeight + 5);
        text(truncate(header, Math.floor(colWidth / 5)), x + 6, y - 9, 8.5, 'F2', '0.03 0.15 0.32');
      });
      y -= rowHeight;

      if (!section.rows?.length) {
        ensureSpace(rowHeight);
        rect(margin, y - rowHeight + 5, contentWidth, rowHeight);
        text(section.empty || 'No records found.', margin + 8, y - 9, 8.5, 'F1', '0.38 0.44 0.54');
        y -= rowHeight + 10;
        return;
      }

      rows.forEach((row) => {
        ensureSpace(rowHeight + 6);
        rect(margin, y - rowHeight + 5, contentWidth, rowHeight);
        row.forEach((cell, index) => {
          const x = margin + (colWidth * index);
          if (index) line(x, y + 5, x, y - rowHeight + 5);
          text(truncate(cell, Math.floor(colWidth / 4.8)), x + 6, y - 9, 8.2, 'F1', '0.03 0.15 0.32');
        });
        y -= rowHeight;
      });
      y -= 10;
    };

    addPage();
    text(title, margin, y, 22, 'F2', '0.03 0.15 0.32');
    y -= 18;
    if (subtitle) {
      text(subtitle, margin, y, 12, 'F1', '0.29 0.36 0.45');
      y -= 15;
    }
    text(`Generated: ${generatedAt}`, margin, y, 10, 'F1', '0.29 0.36 0.45');
    y -= 18;
    line(margin, y, margin + contentWidth, y, '0.76 0.49 0', 2);
    y -= 22;

    const kpiGap = 10;
    const kpiWidth = (contentWidth - (kpiGap * 3)) / 4;
    const kpiHeight = 56;
    for (let index = 0; index < kpis.length; index += 4) {
      ensureSpace(kpiHeight + 10);
      kpis.slice(index, index + 4).forEach(([label, value], col) => {
        const x = margin + (col * (kpiWidth + kpiGap));
        const boxY = y - kpiHeight;
        rect(x, boxY, kpiWidth, kpiHeight, '0.82 0.87 0.93', '0.99 0.995 1');
        text(label, x + 10, boxY + 34, 8, 'F2', '0.29 0.36 0.45');
        text(value, x + 10, boxY + 15, 15, 'F2', '0.76 0.49 0');
      });
      y -= kpiHeight + 10;
    }
    y -= 10;

    sections.forEach(drawTable);
    if (commands.length) finishPage();

    const objects = [];
    const addObject = (content) => {
      objects.push(content);
      return objects.length;
    };
    const fontRegularId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    const fontBoldId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
    const contentIds = pages.map((stream) => addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`));
    const pagesId = objects.length + contentIds.length + 1;
    const pageIds = contentIds.map((contentId) => addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentId} 0 R >>`));
    addObject(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`);
    const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((content, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${content}\nendobj\n`;
    });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return pdf;
  }

  function buildOverviewPdf(data = {}) {
    const stats = data.stats || {};
    const employeeRows = data.employeePerformance || [];
    const sourceRows = data.sourcePerformance || [];
    const commissionRows = data.commissionAnalytics?.rows || [];
    return buildStyledPdf({
      title: 'Nidhi Path SmartCRM Report',
      subtitle: 'Performance, Pipeline & Revenue Intelligence',
      kpis: [
        ['Total Leads', stats.totalLeads || 0],
        ['Ongoing Files', stats.ongoingFiles || 0],
        ['Sanctioned', stats.sanctioned || 0],
        ['Disbursed', stats.disbursed || 0],
        ['Weekly Income', compactMoney(stats.weeklyIncome || 0)],
        ['Monthly Net Income', compactMoney(stats.monthlyNetIncome || 0)],
        ['Commission Due', compactMoney(stats.commissionDue || 0)],
        ['Commission Paid', compactMoney(stats.commissionPaid || 0)]
      ],
      sections: [
        {
          title: 'Employee Performance',
          headers: ['Employee', 'Leads', 'Follow-ups', 'Bank Files', 'Sanctions', 'Disbursements', 'Score'],
          rows: employeeRows.map((item) => [
            item.employeeName || 'Employee',
            item.leadsHandled || 0,
            item.followupsCompleted || 0,
            item.bankFiles || item.bankLoginsDone || 0,
            item.sanctionsAchieved || 0,
            item.disbursementsAchieved || 0,
            `${item.performanceScore || 0}/100`
          ]),
          empty: 'No employee performance data yet.'
        },
        {
          title: 'Source-wise Business',
          headers: ['Source', 'Total References', 'Conversion', 'Disbursed Value'],
          rows: sourceRows.map((item) => [
            formatLabel(item.source || '-'),
            item.totalReferences || 0,
            `${item.conversionRate || 0}%`,
            money(item.disbursedValue || 0)
          ]),
          empty: 'No source-wise business data yet.'
        },
        {
          title: 'Commission Analytics',
          headers: ['Partner', 'Commission %', 'Commission', 'Status'],
          rows: commissionRows.map((item, index) => [
            item.partnerName || item.referencePartnerId || `Partner ${index + 1}`,
            item.commissionPercentage ? `${item.commissionPercentage}%` : '-',
            money(item.commissionAmount || 0),
            formatLabel(item.commissionStatus || 'not_applicable')
          ]),
          empty: 'No commission records yet.'
        }
      ]
    });
  }

  function downloadPdfReport(data = {}) {
    const pdf = buildOverviewPdf(data);
    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nidhi-smartcrm-report-${localDateKey()}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function bindExportButtons() {
    document.querySelectorAll('[data-smartcrm-export]').forEach((button) => {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', async () => {
        const type = button.dataset.smartcrmExport;
        if ($('#employee-performance-report-form') && document.body.dataset.adminPage === 'reports') {
          toggleEmployeeReportPanel(type);
          return;
        }
        if (type === 'pdf') {
          if (!latestReportData) return;
          printReport(latestReportData);
          return;
        }
        if (!latestReportData) return;
        if (type === 'pdf-download') {
          downloadPdfReport(latestReportData);
          return;
        }
        if (type === 'csv') {
          const rows = latestReportData.employeePerformance || [];
          const csv = [
            ['Employee', 'Leads Handled', 'Follow-ups', 'Sanctions', 'Disbursements', 'Score'],
            ...rows.map((item) => [item.employeeName, item.leadsHandled, item.followupsCompleted, item.sanctionsAchieved, item.disbursementsAchieved, item.performanceScore])
          ].map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
          downloadText('smartcrm-employee-performance.csv', csv, 'text/csv');
          return;
        }
        const rows = type === 'employee'
          ? latestReportData.employeePerformance || []
          : type === 'commission'
            ? latestReportData.commissionAnalytics?.rows || []
            : latestReportData.applications || [];
        downloadText(`${type || 'smartcrm'}-report.json`, JSON.stringify(rows, null, 2), 'application/json');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.smartcrmPage || '';
    const adminPage = document.body.dataset.adminPage || '';
    installRoleDashboardShell(page);
    const runJobs = ({ quiet = false } = {}) => {
      const jobs = [];
      if (page === 'student') jobs.push(loadStudentDashboard({ quiet }));
      if (page === 'employee') jobs.push(loadEmployeeDashboard({ quiet }));
      if (page === 'employee-detail') jobs.push(loadEmployeeDetailPage({ quiet }));
      if (page === 'client') jobs.push(loadClientDashboard({ quiet }));
      if (page === 'client-detail') jobs.push(loadClientDetailPage({ quiet }));
      if (page === 'board') jobs.push(loadBoardDashboard({ quiet }));
      if (adminPage === 'reports') jobs.push(loadAdminReports('admin'));
      if (adminPage === 'dashboard') jobs.push(loadAdminReports('admin'));
      if (adminPage === 'commissions') jobs.push(loadAdminReports('admin'));
      return jobs;
    };
    const jobs = runJobs();
    if (jobs.length) {
      let syncInFlight = false;
      const syncDashboards = ({ quiet = true } = {}) => {
        if (syncInFlight) return Promise.resolve();
        syncInFlight = true;
        return Promise.all(runJobs({ quiet }))
          .catch((error) => {
            if (!quiet) setStatus(error.message, 'error');
          })
          .finally(() => {
            syncInFlight = false;
          });
      };
      Promise.all(jobs)
        .then(() => {
          bindCommissionFilters();
          bindEmployeePerformanceReport();
          bindExportButtons();
        })
        .catch((error) => setStatus(error.message, 'error'));
      window.addEventListener('storage', (event) => {
        if (event.key !== 'nidhi_crm_last_update') return;
        syncDashboards({ quiet: true });
      });
      window.addEventListener('nidhi:crm-updated', () => {
        syncDashboards({ quiet: true });
      });
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) syncDashboards({ quiet: true });
      });
      window.setInterval(() => {
        if (!document.hidden) syncDashboards({ quiet: true });
      }, CRM_SYNC_INTERVAL_MS);
      window.NIDHI_syncSmartCrm = () => syncDashboards({ quiet: true });
      window.NIDHI_notifySmartCrmChanged = notifyCrmChanged;
    }
  });
})();
