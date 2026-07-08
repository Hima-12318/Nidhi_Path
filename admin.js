window.NIDHI_ADMIN_APP_HANDLES_PAGES = true;

(function () {
  const API_BASE_URL = window.NIDHI_API_BASE_URL || window.location.origin;
  const ADMIN_TOKEN_KEY = 'nidhi_admin_token';
  const ADMIN_PROFILE_KEY = 'nidhi_admin_user';
  const LEGACY_ADMIN_TOKEN_KEY = 'nidhi-admin-token';
  const LEGACY_ADMIN_PROFILE_KEY = 'nidhi-admin-profile';

  const serviceOptions = [
    'Education Loan',
    'Personal Loan',
    'Business Loan',
    'Home Loan',
    'Mutual Funds',
    'Insurance',
    'Loan Consultation',
    'Other'
  ];

  const enquiryStatuses = ['new', 'contacted', 'in_progress', 'closed', 'rejected'];
  const chatStatuses = ['open', 'waiting_for_agent', 'customer_waiting', 'live_agent_requested', 'agent_joined', 'agent_replied', 'closed'];
  const userStatuses = ['pending', 'verified', 'approved', 'inactive', 'suspended'];
  const smartUserTypes = ['student', 'employee', 'client'];
  const smartEmployeeRoles = ['ceo', 'board', 'employee'];
  const smartClientCategories = ['connector', 'client_consultant', 'own_self', 'online_reference', 'banker_reference', 'employee_reference'];
  const regularWorkflowStages = ['new_user', 'verified', 'approved', 'documents_pending', 'documents_received', 'bank_review', 'sanction_in_progress', 'sanctioned', 'disbursement_pending', 'disbursed', 'completed', 'rejected', 'closed'];
  const b2bWorkflowStages = ['registered', 'verified', 'approved_partner', 'referral_received', 'client_contacted', 'documents_pending', 'loan_processing', 'sanctioned', 'disbursed', 'commission_pending', 'commission_paid', 'closed'];
  const applicationStatuses = [...new Set([...regularWorkflowStages, ...b2bWorkflowStages, 'work_started', 'in_progress', 'submitted', 'on_hold'])];
  const documentStatuses = ['not_started', 'pending', 'requested', 'received', 'verified', 'incomplete', 'not_required'];
  const priorityOptions = ['low', 'normal', 'high', 'urgent'];
  const sanctionStatuses = ['not_started', 'pending', 'in_progress', 'sanctioned', 'rejected', 'not_required'];
  const disbursementStatuses = ['not_started', 'pending', 'partial', 'disbursed', 'not_required'];
  const commissionStatuses = ['paid', 'due', 'hold', 'not_applicable'];
  const updateTypes = ['message', 'status_update', 'document_request', 'internal_note', 'system'];
  let crmClientLoginUsersCache = null;
  let crmEmployeeUsersCache = null;

  const defaultSettingValues = {
    business_name: 'Nidhi Path Loan Ventures',
    tagline: 'Way to Money',
    official_email: 'info@nidhipath.in',
    official_website: 'www.nidhipath.in',
    official_phone: '+91 97056 82595',
    whatsapp_number: '+91 97056 82595',
    address: 'Vijayawada, Andhra Pradesh',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    working_hours: 'Monday to Saturday, 10:00 AM to 6:00 PM',
    support_message: 'Our team will contact you regarding your enquiry.',
    footer_text: 'Terms & Conditions Apply. Loan approval is subject to bank policies, eligibility, verification, documentation, and credit assessment.',
    consent_text: 'By submitting this form, you agree that Nidhi Path Loan Ventures may contact you regarding your enquiry.',
    seo_title: 'Nidhi Path Loan Ventures',
    seo_description: 'Loan consultation, education loan guidance, and financial services.'
  };

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

  function clean(value) {
    return String(value ?? '').trim();
  }

  function formatLabel(value) {
    if (window.NIDHI_formatLabel) return window.NIDHI_formatLabel(value);
    const raw = String(value ?? '').trim();
    if (!raw) return '-';
    if (raw === '-') return '-';
    const known = {
      crm: 'CRM',
      admin: 'Admin',
      board: 'Board Member',
      board_member: 'Board Member',
      employee: 'Employee',
      student: 'Student',
      client: 'Client',
      ceo: 'Admin / CEO',
      b2b: 'B2B',
      new_user: 'New User',
      work_started: 'Work Started',
      not_started: 'Not Started',
      in_progress: 'In Progress',
      client_consultant: 'Client / Consultant',
      own_self: 'Own / Self',
      online_reference: 'Online Reference',
      banker_reference: 'Banker Reference',
      employee_reference: 'Employee Reference',
      not_applicable: 'Not Applicable',
      admin_status: 'Admin Status',
      user_dashboard: 'User Dashboard',
      student_login: 'Student Login'
    };
    const lowered = raw.toLowerCase();
    if (known[lowered]) return known[lowered];
    return raw
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value ?? '0';
    }
  }

  function getAdminToken() {
    try {
      const token = window.sessionStorage.getItem(ADMIN_TOKEN_KEY) || window.sessionStorage.getItem(LEGACY_ADMIN_TOKEN_KEY) || '';
      if (token && !window.sessionStorage.getItem(ADMIN_TOKEN_KEY)) {
        window.sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
      }
      return token;
    } catch (error) {
      return '';
    }
  }

  function getAdminProfile() {
    try {
      return JSON.parse(window.sessionStorage.getItem(ADMIN_PROFILE_KEY) || '{}');
    } catch (error) {
      return {};
    }
  }

  function logoutAdmin() {
    try {
      window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      window.sessionStorage.removeItem(ADMIN_PROFILE_KEY);
      window.sessionStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
      window.sessionStorage.removeItem(LEGACY_ADMIN_PROFILE_KEY);
    } catch (error) {
      // Ignore storage errors during logout.
    }
    window.location.href = 'login.html#employee';
  }

  function requireAdminAuth() {
    if (!document.body.classList.contains('admin-page') || document.body.dataset.adminPage === 'login') {
      return false;
    }
    if (!getAdminToken()) {
      window.location.href = 'login.html#employee';
      return false;
    }
    return true;
  }

  function setMessage(target, type, message) {
    if (!target) return;
    target.className = `form-status ${type ? `is-${type}` : ''}`.trim();
    target.textContent = message || '';
  }

  function showAdminMessage(type, message) {
    setMessage($('#admin-page-status'), type, message);
    if (message) showAdminToast(type, message);
  }

  function showAdminToast(type, message) {
    let stack = $('#admin-toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'admin-toast-stack';
      stack.className = 'admin-toast-stack';
      document.body.appendChild(stack);
    }
    const toast = document.createElement('div');
    toast.className = `admin-toast ${type ? `is-${type}` : ''}`.trim();
    toast.textContent = message;
    stack.appendChild(toast);
    window.setTimeout(() => {
      toast.classList.add('is-leaving');
      window.setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  function notifyCrmChanged(applicationId) {
    const detail = {
      applicationId: applicationId || '',
      updatedAt: Date.now()
    };
    window.dispatchEvent(new CustomEvent('nidhi:crm-updated', { detail }));
    try {
      window.localStorage.setItem('nidhi_crm_last_update', JSON.stringify(detail));
    } catch (error) {
      // Cross-tab refresh is best effort only.
    }
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

  function renderStatusBadge(status) {
    return `<span class="status-pill">${escapeHtml(formatLabel(status))}</span>`;
  }

  async function adminFetch(path, options = {}) {
    const token = getAdminToken();
    if (!token) {
      logoutAdmin();
      throw new Error('Admin session is missing.');
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
      const message = data.debug || data.message || data.error || 'Request failed. Please try again.';
      if (response.status === 401) {
        setTimeout(logoutAdmin, 700);
      }
      throw Object.assign(new Error(message), { status: response.status, data });
    }
    return data;
  }

  function pageParam(...names) {
    const params = new URLSearchParams(window.location.search);
    for (const name of names) {
      const value = clean(params.get(name));
      if (value) return value;
    }
    return '';
  }

  function fillSelect(select, options, includeAll = false) {
    if (!select) return;
    select.innerHTML = `${includeAll ? '<option value="">All</option>' : ''}${options.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(formatLabel(value))}</option>`).join('')}`;
  }

  function fillSelectOptionObjects(select, options, placeholder = '') {
    if (!select) return;
    const placeholderMarkup = placeholder ? `<option value="">${escapeHtml(placeholder)}</option>` : '';
    select.innerHTML = `${placeholderMarkup}${options.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`).join('')}`;
  }

  function ensureSelectOption(select, value) {
    const cleanedValue = clean(value);
    if (!select || !cleanedValue) return;
    const exists = Array.from(select.options).some((option) => option.value === cleanedValue);
    if (!exists) {
      select.appendChild(new Option(formatLabel(cleanedValue), cleanedValue));
    }
  }

  function ensureSelectOptionLabel(select, value, label) {
    const cleanedValue = clean(value);
    if (!select || !cleanedValue) return;
    const existing = Array.from(select.options).find((option) => option.value === cleanedValue);
    if (existing) {
      if (clean(label)) existing.textContent = label;
      return;
    }
    select.appendChild(new Option(clean(label) || formatLabel(cleanedValue), cleanedValue));
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

  function delay(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function mutationId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function tableState(tbody, message, colspan) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="${colspan}">${escapeHtml(message)}</td></tr>`;
  }

  function installAdminNav() {
    const nav = $('.admin-nav');
    if (!nav) return;
    const page = document.body.dataset.adminPage || '';
    const items = [
      ['dashboard', 'Dashboard', 'admin-dashboard.html'],
      ['users', 'Users', 'admin-users.html'],
      ['userDetail', 'Users', 'admin-users.html'],
      ['crm', 'CRM', 'admin-crm.html'],
      ['crmDetail', 'CRM', 'admin-crm.html'],
      ['employeePerformance', 'Employee Performance', 'admin-reports.html#employee-performance-overview'],
      ['reports', 'Reports', 'admin-reports.html'],
      ['commissions', 'Commissions', 'admin-commissions.html'],
      ['businessAnalytics', 'Business Analytics', 'admin-reports.html#business-analytics'],
      ['alerts', 'Alerts', 'admin-reports.html#smart-alerts-panel'],
      ['settings', 'Settings', 'admin-site-settings.html']
    ];
    const uniqueItems = items.filter(([id]) => !id.endsWith('Detail'));
    nav.innerHTML = uniqueItems.map(([id, label, href]) => {
      const active = page === id || (page === 'userDetail' && id === 'users') || (page === 'crmDetail' && id === 'crm');
      return `<a class="${active ? 'is-active' : ''}" href="${href}" data-no-translate>${label}</a>`;
    }).join('');
  }

  function smartAdminShellItems() {
    return [
      ['dashboard', '01', 'Dashboard', 'admin-dashboard.html'],
      ['users', '02', 'Users', 'admin-users.html'],
      ['crm', '03', 'CRM', 'admin-crm.html'],
      ['employeePerformance', '04', 'Employee Performance', 'admin-reports.html#employee-performance-overview'],
      ['reports', '05', 'Reports', 'admin-reports.html'],
      ['commissions', '06', 'Commissions', 'admin-commissions.html'],
      ['businessAnalytics', '07', 'Business Analytics', 'admin-reports.html#business-analytics'],
      ['alerts', '08', 'Alerts', 'admin-reports.html#smart-alerts-panel'],
      ['settings', '09', 'Settings', 'admin-site-settings.html']
    ];
  }

  function isShellItemActive(page, id) {
    const hash = window.location.hash || '';
    if (page === 'reports' && id === 'employeePerformance' && hash === '#employee-performance-overview') return true;
    if (page === 'reports' && id === 'businessAnalytics' && hash === '#business-analytics') return true;
    if (page === 'reports' && id === 'alerts' && hash === '#smart-alerts-panel') return true;
    if (page === 'reports' && ['employeePerformance', 'businessAnalytics', 'alerts'].includes(id)) return false;
    if (page === id) return true;
    if (page === 'userDetail' && id === 'users') return true;
    if (page === 'crmDetail' && id === 'crm') return true;
    return false;
  }

  function smartAdminSidebarMarkup(page) {
    const items = smartAdminShellItems();
    const nav = items.map(([id, number, label, href]) => `
      <a class="${isShellItemActive(page, id) ? 'is-active' : ''}" href="${href}">
        <span>${number}</span>${escapeHtml(label)}${id === 'alerts' ? '<em id="admin-alert-count">0</em>' : ''}
      </a>
    `).join('');
    return `
      <a class="smartcrm-brand" href="admin-dashboard.html" data-no-translate>
        <img src="logo.jpg" alt="Nidhi Path logo">
        <span>
          <strong>NIDHI PATH</strong>
          <small>SMARTCRM INTELLIGENCE</small>
        </span>
      </a>
      <nav class="smartcrm-side-nav" aria-label="SmartCRM navigation">
        ${nav}
        <a href="login.html#employee" data-admin-logout><span>${String(items.length + 1).padStart(2, '0')}</span>Logout</a>
      </nav>
      <div class="smartcrm-profile-card">
        <div class="smartcrm-profile-mark">NP</div>
        <div>
          <strong>Nidhi Path Finance</strong>
          <span>Super Admin</span>
        </div>
      </div>
    `;
  }

  function refreshSmartAdminSidebar() {
    const sidebar = $('.smartcrm-sidebar');
    if (sidebar) sidebar.innerHTML = smartAdminSidebarMarkup(document.body.dataset.adminPage || '');
  }

  function installSmartAdminShell() {
    const body = document.body;
    if (!body.classList.contains('admin-page') || body.dataset.adminPage === 'login') return;
    const existingShell = $('.smartcrm-shell');
    if (existingShell) {
      refreshSmartAdminSidebar();
      body.classList.add('smartcrm-admin-page', 'smartcrm-command-page');
      return;
    }
    if (body.classList.contains('smartcrm-command-page')) return;
    const legacyMain = $('.admin-main');
    if (!legacyMain) return;
    const shell = document.createElement('div');
    shell.className = 'smartcrm-shell smartcrm-shell-compact';
    const sidebar = document.createElement('aside');
    sidebar.className = 'smartcrm-sidebar';
    sidebar.setAttribute('aria-label', 'SmartCRM navigation');
    sidebar.innerHTML = smartAdminSidebarMarkup(body.dataset.adminPage || '');
    const workspace = document.createElement('main');
    workspace.className = 'smartcrm-workspace smartcrm-legacy-workspace';
    while (legacyMain.firstChild) {
      workspace.appendChild(legacyMain.firstChild);
    }
    shell.append(sidebar, workspace);
    const topbar = $('.admin-topbar');
    (topbar || legacyMain).replaceWith(shell);
    legacyMain.remove();
    body.classList.add('smartcrm-admin-page', 'smartcrm-command-page');
  }

  function bindLogout() {
    $all('[data-admin-logout]').forEach((button) => {
      button.addEventListener('click', logoutAdmin);
    });
  }

  function detailItem(label, value) {
    return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || '-')}</strong></div>`;
  }

  function enquiryRow(enquiry) {
    const referenceId = enquiry.referenceId || enquiry.reference || enquiry.id || '';
    return `
      <tr>
        <td>${escapeHtml(referenceId || '-')}</td>
        <td>${escapeHtml(enquiry.name || '-')}</td>
        <td>${escapeHtml(enquiry.phone || '-')}</td>
        <td>${escapeHtml(enquiry.email || '-')}</td>
        <td>${escapeHtml(enquiry.service || '-')}</td>
        <td>${escapeHtml(enquiry.sourceForm || '-')}</td>
        <td>${renderStatusBadge(enquiry.status || 'new')}</td>
        <td>${formatDate(enquiry.createdAt)}</td>
        <td><a class="table-action" href="admin-enquiry-detail.html?id=${encodeURIComponent(referenceId)}">View</a></td>
      </tr>
    `;
  }

  function chatRow(chat) {
    const chatId = chat.chatId || chat.chatReferenceId || '';
    return `
      <tr>
        <td>${escapeHtml(chatId || '-')}</td>
        <td>${escapeHtml(chat.customerName || chat.name || '-')}</td>
        <td>${escapeHtml(chat.customerPhone || chat.phone || '-')}</td>
        <td>${escapeHtml(chat.customerEmail || chat.email || '-')}</td>
        <td>${escapeHtml(chat.service || '-')}</td>
        <td>${renderStatusBadge(chat.status || 'open')}</td>
        <td>${escapeHtml(chat.lastMessage || chat.initialMessage || '-')}</td>
        <td>${escapeHtml(chat.serviceCategory || chat.service || '-')} / ${escapeHtml(chat.botAnswerCount || 0)} bot</td>
        <td><a class="table-action" href="admin-chat-detail.html?chatId=${encodeURIComponent(chatId)}">Open</a></td>
      </tr>
    `;
  }

  async function loadDashboard() {
    const response = await adminFetch('/api/admin/dashboard');
    const stats = response.stats || {};
    setText('dashboard-total-enquiries', stats.totalEnquiries);
    setText('dashboard-new-enquiries', stats.newEnquiries);
    setText('dashboard-open-chats', stats.openChats);
    setText('dashboard-closed-chats', stats.closedChats);

    const recentEnquiriesBody = $('#recent-enquiries-body');
    const recentChatsBody = $('#recent-chats-body');
    const recentEnquiries = response.recentEnquiries || [];
    const recentChats = response.recentChats || [];
    recentEnquiriesBody.innerHTML = recentEnquiries.length ? recentEnquiries.map(enquiryRow).join('') : '<tr><td colspan="9">No enquiries yet.</td></tr>';
    recentChatsBody.innerHTML = recentChats.length ? recentChats.map(chatRow).join('') : '<tr><td colspan="9">No chats yet.</td></tr>';

    try {
      const overview = await adminFetch('/api/admin/site/overview');
      const data = overview.data || {};
      setText('site-active-services', data.activeServices);
      setText('site-visible-sections', data.visibleSections);
      setText('site-navigation-items', data.navigationItems);
      setText('site-media-files', data.mediaFiles);
    } catch (error) {
      // Dashboard remains usable even if site tables have not been migrated yet.
    }

    try {
      const crm = await adminFetch('/api/admin/crm/stats');
      const crmStats = crm.stats || {};
      setText('dashboard-total-users', crmStats.totalUsers);
      setText('dashboard-total-applications', crmStats.totalApplications);
      setText('dashboard-work-started', crmStats.workStarted);
      setText('dashboard-completed-applications', crmStats.completed);
    } catch (error) {
      // CRM widgets stay empty until CRM tables are migrated.
    }
  }

  async function loadEnquiries() {
    fillSelect($('#enquiry-status-filter'), enquiryStatuses, true);
    fillSelect($('#enquiry-service-filter'), serviceOptions, true);
    const tbody = $('#admin-enquiries-body');
    const form = $('#admin-enquiry-filters');

    async function refresh(page = 1) {
      tableState(tbody, 'Loading enquiries...', 9);
      const params = new URLSearchParams({
        page: String(page),
        limit: '25'
      });
      const search = clean($('#enquiry-search')?.value);
      const status = clean($('#enquiry-status-filter')?.value);
      const service = clean($('#enquiry-service-filter')?.value);
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (service) params.set('service', service);
      const response = await adminFetch(`/api/admin/enquiries?${params}`);
      const enquiries = response.enquiries || [];
      tbody.innerHTML = enquiries.length ? enquiries.map(enquiryRow).join('') : '<tr><td colspan="9">No enquiries yet.</td></tr>';
      const pagination = $('#admin-enquiries-pagination');
      if (pagination) {
        const total = response.pagination?.total ?? enquiries.length;
        pagination.textContent = `Showing ${enquiries.length} of ${total} enquiries`;
      }
    }

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      refresh().catch((error) => showAdminMessage('error', error.message));
    });
    $('#enquiry-filter-reset')?.addEventListener('click', () => {
      form?.reset();
      refresh().catch((error) => showAdminMessage('error', error.message));
    });
    await refresh();
  }

  async function loadEnquiryDetail() {
    const referenceId = pageParam('id', 'referenceId');
    const detail = $('#admin-enquiry-detail');
    const statusSelect = $('#admin-enquiry-status');
    const notesInput = $('#admin-enquiry-notes');
    fillSelect(statusSelect, enquiryStatuses);
    if (!referenceId || !detail) return;

    const response = await adminFetch(`/api/admin/enquiries/${encodeURIComponent(referenceId)}`);
    const enquiry = response.enquiry || {};
    detail.innerHTML = [
      detailItem('Reference ID', enquiry.referenceId || enquiry.reference),
      detailItem('Name', enquiry.name),
      detailItem('Phone', enquiry.phone),
      detailItem('Email', enquiry.email),
      detailItem('Service', enquiry.service),
      detailItem('Message', enquiry.message),
      detailItem('Source page', enquiry.sourcePage),
      detailItem('Source form', enquiry.sourceForm),
      detailItem('Preferred language', enquiry.preferredLanguage),
      detailItem('WhatsApp status', enquiry.whatsappStatus),
      detailItem('Created at', formatDate(enquiry.createdAt)),
      detailItem('Updated at', formatDate(enquiry.updatedAt))
    ].join('');
    if (statusSelect) statusSelect.value = enquiry.status || 'new';
    if (notesInput) notesInput.value = enquiry.metadata?.notes || '';

    $('#admin-enquiry-status-form')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const message = $('#admin-enquiry-status-message');
      setMessage(message, 'info', 'Saving...');
      try {
        await adminFetch(`/api/admin/enquiries/${encodeURIComponent(referenceId)}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: statusSelect?.value || 'new',
            metadata: { ...(enquiry.metadata || {}), notes: notesInput?.value || '' }
          })
        });
        setMessage(message, 'success', 'Enquiry updated successfully.');
      } catch (error) {
        setMessage(message, 'error', error.message);
      }
    });
  }

  async function loadChats() {
    fillSelect($('#chat-status-filter'), chatStatuses, true);
    const tbody = $('#admin-chats-body');
    const form = $('#admin-chat-filters');

    async function refresh(page = 1) {
      tableState(tbody, 'Loading chats...', 9);
      const params = new URLSearchParams({
        page: String(page),
        limit: '25'
      });
      const search = clean($('#chat-search')?.value);
      const status = clean($('#chat-status-filter')?.value);
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      const response = await adminFetch(`/api/admin/chats?${params}`);
      const chats = response.chats || [];
      tbody.innerHTML = chats.length ? chats.map(chatRow).join('') : '<tr><td colspan="9">No chats yet.</td></tr>';
      const pagination = $('#admin-chats-pagination');
      if (pagination) {
        const total = response.pagination?.total ?? chats.length;
        pagination.textContent = `Showing ${chats.length} of ${total} chats`;
      }
    }

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      refresh().catch((error) => showAdminMessage('error', error.message));
    });
    $('#chat-filter-reset')?.addEventListener('click', () => {
      form?.reset();
      refresh().catch((error) => showAdminMessage('error', error.message));
    });
    await refresh();
    window.setInterval(() => refresh().catch(() => {}), 7000);
  }

  async function loadChatDetail() {
    const chatId = pageParam('chatId');
    const messages = $('#admin-chat-messages');
    const meta = $('#admin-chat-meta');
    const status = $('#admin-chat-status');
    if (!chatId || !messages) return;

    const seenMessages = new Set();
    async function render({ quiet = false } = {}) {
      if (!quiet) setMessage(status, 'info', 'Checking for new messages...');
      const [chatResponse, messageResponse] = await Promise.all([
        adminFetch(`/api/admin/chats/${encodeURIComponent(chatId)}`),
        adminFetch(`/api/admin/chats/${encodeURIComponent(chatId)}/messages`)
      ]);
      const chat = chatResponse.chat || {};
      const messageList = messageResponse.messages || [];
      if (meta) {
        meta.innerHTML = [
          detailItem('Chat ID', chat.chatId || chatId),
          detailItem('Customer name', chat.customerName || chat.name),
          detailItem('Phone', chat.customerPhone || chat.phone),
          detailItem('Email', chat.customerEmail || chat.email),
          detailItem('Service', chat.service),
          detailItem('Service category', chat.serviceCategory || chat.service),
          detailItem('Bot answers', chat.botAnswerCount || 0),
          detailItem('Status', chat.status)
        ].join('');
      }
      const markup = messageList.length
        ? messageList.map((entry) => `
          <div class="admin-chat-message is-${escapeHtml(entry.senderType || entry.sender || 'system')}">
            <strong>${escapeHtml(entry.senderType || entry.sender || 'system')}</strong>
            <span>${escapeHtml(entry.message || '')}</span>
            <small>${formatDate(entry.createdAt)}</small>
          </div>
        `).join('')
        : '<p>No messages yet.</p>';
      const key = messageList.map((entry) => entry.id || `${entry.senderType}-${entry.createdAt}-${entry.message}`).join('|');
      if (!seenMessages.has(key)) {
        seenMessages.clear();
        seenMessages.add(key);
        messages.innerHTML = markup;
        messages.scrollTop = messages.scrollHeight;
      }
      if (!quiet) setMessage(status, 'success', 'Live chat connected.');
    }

    await render();
    $('#admin-chat-reply-form')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = $('#admin-chat-reply');
      const message = clean(input?.value);
      if (!message) return;
      const submitButton = event.submitter || event.currentTarget.querySelector('button[type="submit"]');
      const restoreButton = setButtonLoading(submitButton, 'Sending...');
      setMessage(status, 'info', 'Sending reply...');
      try {
        const response = await adminFetch(`/api/admin/chats/${encodeURIComponent(chatId)}/reply`, {
          method: 'POST',
          body: JSON.stringify({ message })
        });
        input.value = '';
        if (response.chatMessage) {
          await render({ quiet: true });
        }
        setMessage(status, 'success', 'Reply sent.');
      } catch (error) {
        setMessage(status, 'error', error.message);
      } finally {
        restoreButton('Send Reply');
      }
    });
    $('#admin-close-chat')?.addEventListener('click', async () => {
      setMessage(status, 'info', 'Closing chat...');
      try {
        await adminFetch(`/api/admin/chats/${encodeURIComponent(chatId)}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'closed' })
        });
        setMessage(status, 'success', 'Chat closed.');
        await render();
      } catch (error) {
        setMessage(status, 'error', error.message);
      }
    });
    window.setInterval(() => render({ quiet: true }).catch(() => {}), 3000);
  }

  async function seedDefaults() {
    return adminFetch('/api/admin/site/seed-defaults', { method: 'POST', body: JSON.stringify({}) });
  }

  async function loadWebsiteControl() {
    const overview = await adminFetch('/api/admin/site/overview');
    const data = overview.data || {};
    const setText = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = String(value ?? 0);
    };
    setText('website-active-services', data.activeServices);
    setText('website-visible-sections', data.visibleSections);
    setText('website-navigation-items', data.navigationItems);
    setText('website-media-files', data.mediaFiles);
    $('#seed-site-defaults')?.addEventListener('click', async () => {
      showAdminMessage('info', 'Seeding default site data...');
      try {
        await seedDefaults();
        showAdminMessage('success', 'Default site data is ready.');
        await loadWebsiteControl();
      } catch (error) {
        showAdminMessage('error', error.message);
      }
    }, { once: true });
  }

  function settingsToMap(settings) {
    const map = { ...defaultSettingValues };
    settings.forEach((item) => {
      map[item.settingKey] = item.settingValue?.value ?? item.settingValue ?? '';
    });
    return map;
  }

  async function loadSiteSettings() {
    let response = await adminFetch('/api/admin/site/settings');
    if (!(response.data || []).length) {
      try {
        await seedDefaults();
        response = await adminFetch('/api/admin/site/settings');
      } catch (error) {
        // Admin without seed permission can still save settings manually.
      }
    }
    const values = settingsToMap(response.data || []);
    Object.entries(values).forEach(([key, value]) => {
      const input = document.querySelector(`[name="${key}"]`);
      if (input) input.value = value;
    });
    let saveInFlight = false;
    $('#admin-site-settings-form')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (saveInFlight) return;
      saveInFlight = true;
      const restoreButton = setButtonLoading(event.submitter || event.currentTarget.querySelector('button[type="submit"]'), 'Saving...');
      showAdminMessage('info', 'Saving...');
      const payload = {};
      Object.keys(defaultSettingValues).forEach((key) => {
        payload[key] = { value: document.querySelector(`[name="${key}"]`)?.value || '' };
      });
      try {
        const saveResponse = await adminFetch('/api/admin/site/settings', {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
        const savedValues = settingsToMap(saveResponse.data || []);
        setFormValues(event.currentTarget, savedValues);
        showAdminMessage('success', 'Saved successfully');
      } catch (error) {
        showAdminMessage('error', error.message || 'Unable to save site settings.');
      } finally {
        saveInFlight = false;
        restoreButton('Save Settings');
      }
    });
  }

  function setFormValues(form, values) {
    if (!form) return;
    Object.entries(values).forEach(([key, value]) => {
      const input = form.elements[key];
      if (!input) return;
      if (input.tagName === 'SELECT') ensureSelectOption(input, value);
      if (input.type === 'checkbox') input.checked = Boolean(value);
      else input.value = value ?? '';
    });
  }

  function getFormValues(form) {
    const values = {};
    Array.from(new FormData(form).entries()).forEach(([key, value]) => {
      values[key] = value;
    });
    $all('input[type="checkbox"]', form).forEach((input) => {
      values[input.name] = input.checked;
    });
    ['displayOrder'].forEach((key) => {
      if (values[key] !== undefined && values[key] !== '') values[key] = Number(values[key]);
    });
    return values;
  }

  function normalizeCrmApplicationPayload(values) {
    const payload = { ...values };
    const selectedClient = findCrmClientLoginUser(payload.clientId || payload.referencePartnerId || payload.referenceOwnerId || payload.consultantClientId);
    if (selectedClient) {
      const partnerId = selectedClient.id || '';
      const sourceType = selectedClient.referenceType || selectedClient.role || selectedClient.clientType || '';
      payload.clientId = partnerId;
      payload.referencePartnerId = partnerId;
      payload.referenceOwnerId = partnerId;
      payload.consultantClientId = selectedClient.profileUserId || '';
      payload.referenceSourceType = sourceType;
      payload.leadSourceType = payload.referenceSourceType;
      payload.clientType = 'b2b';
    }
    const selectedEmployee = findCrmEmployeeUser(payload.assignedEmployeeId || payload.assignedTo);
    if (selectedEmployee) {
      payload.assignedEmployeeId = selectedEmployee.id;
      payload.assignedTo = selectedEmployee.id;
      payload.assignedAdminName = selectedEmployee.fullName || selectedEmployee.name || '';
    } else if (!clean(payload.assignedEmployeeId)) {
      payload.assignedEmployeeId = null;
      payload.assignedTo = null;
      payload.assignedAdminName = '';
    }
    ['loanAmountRequired', 'loanAmountApproved'].forEach((key) => {
      if (payload[key] === '') {
        payload[key] = null;
      } else if (payload[key] !== undefined && payload[key] !== null) {
        payload[key] = Number(payload[key]);
      }
    });
    if (payload.nextFollowupDate === '') payload.nextFollowupDate = null;
    return payload;
  }

  function isClientLoginUser(user = {}) {
    const userType = clean(user.userType).toLowerCase();
    const role = clean(user.role || user.referenceType || user.clientType).toLowerCase();
    return userType === 'client' && smartClientCategories.includes(role);
  }

  function clientLoginUserLabel(user = {}) {
    const name = clean(user.fullName || user.name) || 'Unnamed client';
    const company = clean(user.companyName);
    const contact = clean(user.phone || user.mobile || user.email);
    const detail = company || contact;
    return detail ? `${name} (${detail})` : name;
  }

  function findCrmClientLoginUser(id) {
    const cleanedId = clean(id);
    if (!cleanedId || !crmClientLoginUsersCache) return null;
    return crmClientLoginUsersCache.find((user) => user.id === cleanedId) || null;
  }

  async function loadCrmClientLoginUsers() {
    if (crmClientLoginUsersCache) return crmClientLoginUsersCache;
    const collected = [];
    let page = 1;
    let total = Infinity;
    while (collected.length < total && page <= 10) {
      const response = await adminFetch(`/api/admin/clients?page=${page}&limit=100&client_type=all`);
      const clients = response.clients || [];
      collected.push(...clients);
      total = response.pagination?.total ?? collected.length;
      if (!clients.length) break;
      page += 1;
    }
    const unique = new Map();
    collected.forEach((user) => {
      if (user.id && !unique.has(user.id)) unique.set(user.id, user);
    });
    crmClientLoginUsersCache = Array.from(unique.values());
    return crmClientLoginUsersCache;
  }

  function employeeUserLabel(user = {}) {
    const name = clean(user.fullName || user.name) || 'Employee';
    return user.email ? `${name} - ${user.email}` : name;
  }

  function findCrmEmployeeUser(id) {
    const cleanedId = clean(id);
    if (!cleanedId || !crmEmployeeUsersCache) return null;
    return crmEmployeeUsersCache.find((user) => user.id === cleanedId) || null;
  }

  async function loadCrmEmployeeUsers() {
    if (crmEmployeeUsersCache) return crmEmployeeUsersCache;
    const response = await adminFetch('/api/admin/users?type=employee&limit=100');
    crmEmployeeUsersCache = response.users || [];
    return crmEmployeeUsersCache;
  }

  async function loadServicesAdmin() {
    let response = await adminFetch('/api/admin/site/services');
    if (!(response.data || []).length) {
      try {
        await seedDefaults();
        response = await adminFetch('/api/admin/site/services');
      } catch (error) {}
    }
    const tbody = $('#admin-services-body');
    const form = $('#admin-service-form');
    const idInput = $('#service-id');
    const render = (services) => {
      tbody.innerHTML = services.length ? services.map((item) => `
        <tr>
          <td>${escapeHtml(item.serviceName)}</td>
          <td>${escapeHtml(item.serviceKey)}</td>
          <td>${escapeHtml(item.pageUrl)}</td>
          <td>${escapeHtml(item.displayOrder)}</td>
          <td>${renderStatusBadge(item.isActive ? 'active' : 'inactive')}</td>
          <td><button type="button" class="table-action" data-edit-service="${escapeHtml(item.id)}">Edit</button></td>
        </tr>
      `).join('') : '<tr><td colspan="6">No services yet.</td></tr>';
      $all('[data-edit-service]').forEach((button) => {
        button.addEventListener('click', () => {
          const service = services.find((item) => item.id === button.dataset.editService);
          if (!service) return;
          idInput.value = service.id;
          setFormValues(form, service);
          window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
        });
      });
    };
    render(response.data || []);
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      showAdminMessage('info', 'Saving service...');
      const payload = getFormValues(form);
      payload.isActive = Boolean(payload.isActive);
      try {
        const id = idInput.value;
        await adminFetch(id ? `/api/admin/site/services/${encodeURIComponent(id)}` : '/api/admin/site/services', {
          method: id ? 'PATCH' : 'POST',
          body: JSON.stringify(payload)
        });
        form.reset();
        idInput.value = '';
        showAdminMessage('success', 'Service saved.');
        const next = await adminFetch('/api/admin/site/services');
        render(next.data || []);
      } catch (error) {
        showAdminMessage('error', error.message);
      }
    });
    $('#service-form-reset')?.addEventListener('click', () => {
      form?.reset();
      idInput.value = '';
    });
  }

  async function loadSectionsAdmin() {
    let response = await adminFetch('/api/admin/site/sections');
    if (!(response.data || []).length) {
      try {
        await seedDefaults();
        response = await adminFetch('/api/admin/site/sections');
      } catch (error) {}
    }
    const tbody = $('#admin-sections-body');
    const form = $('#admin-section-form');
    const idInput = $('#section-id');
    const contentInput = $('#section-content-json');
    const render = (sections) => {
      tbody.innerHTML = sections.length ? sections.map((item) => `
        <tr>
          <td>${escapeHtml(`${item.pageKey}.${item.sectionKey}`)}</td>
          <td>${escapeHtml(item.sectionTitle)}</td>
          <td>${escapeHtml(item.displayOrder)}</td>
          <td>${renderStatusBadge(item.isVisible ? 'visible' : 'hidden')}</td>
          <td><button type="button" class="table-action" data-edit-section="${escapeHtml(item.id)}">Edit</button></td>
        </tr>
      `).join('') : '<tr><td colspan="5">No content sections yet.</td></tr>';
      $all('[data-edit-section]').forEach((button) => {
        button.addEventListener('click', () => {
          const section = sections.find((item) => item.id === button.dataset.editSection);
          if (!section) return;
          idInput.value = section.id;
          setFormValues(form, section);
          contentInput.value = JSON.stringify(section.sectionContent || {}, null, 2);
        });
      });
    };
    render(response.data || []);
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const id = idInput.value;
      if (!id) {
        showAdminMessage('error', 'Select a section to edit.');
        return;
      }
      let sectionContent = {};
      try {
        sectionContent = JSON.parse(contentInput.value || '{}');
      } catch (error) {
        showAdminMessage('error', 'Section content must be valid JSON.');
        return;
      }
      showAdminMessage('info', 'Saving content section...');
      try {
        await adminFetch(`/api/admin/site/sections/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          body: JSON.stringify({ ...getFormValues(form), sectionContent })
        });
        showAdminMessage('success', 'Content section saved.');
        const next = await adminFetch('/api/admin/site/sections');
        render(next.data || []);
      } catch (error) {
        showAdminMessage('error', error.message);
      }
    });
  }

  async function loadNavigationAdmin() {
    let response = await adminFetch('/api/admin/site/navigation');
    if (!(response.data || []).length) {
      try {
        await seedDefaults();
        response = await adminFetch('/api/admin/site/navigation');
      } catch (error) {}
    }
    const tbody = $('#admin-navigation-body');
    const form = $('#admin-navigation-form');
    const idInput = $('#navigation-id');
    const render = (items) => {
      tbody.innerHTML = items.length ? items.map((item) => `
        <tr>
          <td>${escapeHtml(item.label)}</td>
          <td>${escapeHtml(item.href)}</td>
          <td>${escapeHtml(item.navGroup)}</td>
          <td>${escapeHtml(item.displayOrder)}</td>
          <td>${renderStatusBadge(item.isVisible ? 'visible' : 'hidden')}</td>
          <td><button type="button" class="table-action" data-edit-navigation="${escapeHtml(item.id)}">Edit</button></td>
        </tr>
      `).join('') : '<tr><td colspan="6">No navigation items yet.</td></tr>';
      $all('[data-edit-navigation]').forEach((button) => {
        button.addEventListener('click', () => {
          const item = items.find((entry) => entry.id === button.dataset.editNavigation);
          if (!item) return;
          idInput.value = item.id;
          setFormValues(form, item);
        });
      });
    };
    render(response.data || []);
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      showAdminMessage('info', 'Saving navigation item...');
      const payload = getFormValues(form);
      payload.isVisible = Boolean(payload.isVisible);
      try {
        const id = idInput.value;
        await adminFetch(id ? `/api/admin/site/navigation/${encodeURIComponent(id)}` : '/api/admin/site/navigation', {
          method: id ? 'PATCH' : 'POST',
          body: JSON.stringify(payload)
        });
        form.reset();
        idInput.value = '';
        showAdminMessage('success', 'Navigation item saved.');
        const next = await adminFetch('/api/admin/site/navigation');
        render(next.data || []);
      } catch (error) {
        showAdminMessage('error', error.message);
      }
    });
    $('#navigation-form-reset')?.addEventListener('click', () => {
      form?.reset();
      idInput.value = '';
    });
  }

  async function loadMediaAdmin() {
    const tbody = $('#admin-media-body');
    const form = $('#admin-media-form');
    const idInput = $('#media-id');
    const render = (items) => {
      tbody.innerHTML = items.length ? items.map((item) => `
        <tr>
          <td>${escapeHtml(item.fileName)}</td>
          <td><a href="${escapeHtml(item.fileUrl)}" target="_blank" rel="noopener">Open</a></td>
          <td>${escapeHtml(item.fileType)}</td>
          <td>${escapeHtml(item.altText)}</td>
          <td>${escapeHtml(item.usageContext)}</td>
          <td>${formatDate(item.createdAt)}</td>
          <td><button type="button" class="table-action" data-edit-media="${escapeHtml(item.id)}">Edit</button></td>
        </tr>
      `).join('') : '<tr><td colspan="7">No media records yet.</td></tr>';
      $all('[data-edit-media]').forEach((button) => {
        button.addEventListener('click', () => {
          const item = items.find((entry) => entry.id === button.dataset.editMedia);
          if (!item) return;
          idInput.value = item.id;
          setFormValues(form, item);
        });
      });
    };
    const response = await adminFetch('/api/admin/site/media');
    render(response.data || []);
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      showAdminMessage('info', 'Saving media record...');
      const payload = getFormValues(form);
      try {
        const id = idInput.value;
        await adminFetch(id ? `/api/admin/site/media/${encodeURIComponent(id)}` : '/api/admin/site/media', {
          method: id ? 'PATCH' : 'POST',
          body: JSON.stringify(payload)
        });
        form.reset();
        idInput.value = '';
        showAdminMessage('success', 'Media record saved.');
        const next = await adminFetch('/api/admin/site/media');
        render(next.data || []);
      } catch (error) {
        showAdminMessage('error', error.message);
      }
    });
    $('#media-form-reset')?.addEventListener('click', () => {
      form?.reset();
      idInput.value = '';
    });
  }

  function userRow(user) {
    return `
      <tr>
        <td>${escapeHtml(user.fullName || '-')}</td>
        <td>${escapeHtml(user.email || '-')}</td>
        <td>${escapeHtml(user.phone || '-')}</td>
        <td>${escapeHtml(formatLabel(user.userType || 'student'))} / ${escapeHtml(formatLabel(user.role || '-'))}</td>
        <td>${renderStatusBadge(user.status || 'pending')}</td>
        <td>${formatDate(user.createdAt)}</td>
        <td><a class="table-action" href="admin-user-detail.html?id=${encodeURIComponent(user.id)}">View</a></td>
      </tr>
    `;
  }

  async function loadUsers() {
    fillSelect($('#user-status-filter'), ['active', ...userStatuses], true);
    fillSelect($('#create-user-type'), smartUserTypes, false);
    fillSelect($('#create-employee-role'), smartEmployeeRoles, false);
    fillSelect($('#create-client-category'), smartClientCategories, false);
    const tbody = $('#admin-users-body');
    const form = $('#admin-user-filters');
    const createForm = $('#admin-create-user-form');
    const requestedView = clean(document.body.dataset.usersView) || clean(pageParam('view'));
    const currentView = ['create', 'list'].includes(requestedView) ? requestedView : 'home';
    const actionCards = $all('.users-action-card');
    if (actionCards[0]) actionCards[0].textContent = 'Create Users';
    if (actionCards[1]) actionCards[1].textContent = 'View Existing Users';

    $all('[data-users-section]').forEach((section) => {
      section.hidden = section.dataset.usersSection !== currentView;
    });

    function syncCreateUserFields() {
      const type = $('#create-user-type')?.value || 'student';
      $all('[data-create-user-section]', createForm || document).forEach((section) => {
        const visible = section.dataset.createUserSection === type;
        section.hidden = !visible;
        $all('input, select, textarea, button', section).forEach((control) => {
          control.disabled = !visible;
        });
      });
    }
    $('#create-user-type')?.addEventListener('change', syncCreateUserFields);
    syncCreateUserFields();

    async function refresh(page = 1) {
      tableState(tbody, 'Loading users...', 7);
      const params = new URLSearchParams({ page: String(page), limit: '25' });
      const search = clean($('#user-search')?.value);
      const status = clean($('#user-status-filter')?.value);
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      const response = await adminFetch(`/api/admin/users?${params}`);
      const users = response.users || [];
      tbody.innerHTML = users.length ? users.map(userRow).join('') : '<tr><td colspan="7">No registered users yet.</td></tr>';
      const pagination = $('#admin-users-pagination');
      if (pagination) pagination.textContent = `Showing ${users.length} of ${response.pagination?.total ?? users.length} users`;
    }

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      refresh().catch((error) => showAdminMessage('error', error.message));
    });
    $('#user-filter-reset')?.addEventListener('click', () => {
      form?.reset();
      refresh().catch((error) => showAdminMessage('error', error.message));
    });
    createForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const restoreButton = setButtonLoading(event.submitter || createForm.querySelector('button[type="submit"]'), 'Creating...');
      showAdminMessage('info', 'Creating SmartCRM user...');
      const payload = getFormValues(createForm);
      payload.commissionVisibilityEnabled = Boolean(payload.commissionVisibilityEnabled);
      try {
        const createResponse = await adminFetch('/api/admin/users/create', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        const createdUser = createResponse.user || createResponse.profile || {};
        if (payload.userType === 'client' && createdUser.id) {
          showAdminMessage('success', 'Client created successfully. Opening CRM...');
          window.location.href = `admin-crm.html?clientId=${encodeURIComponent(createdUser.id)}&list=1`;
          return;
        }
        createForm.reset();
        syncCreateUserFields();
        showAdminMessage('success', 'User created successfully. Share the temporary password securely.');
        if (tbody) await refresh();
      } catch (error) {
        showAdminMessage('error', error.message);
      } finally {
        restoreButton('Create User');
      }
    });
    if (currentView === 'list' && tbody) await refresh();
  }

  async function loadUsersModule() {
    const requestedView = clean(document.body.dataset.usersView) || clean(pageParam('view'));
    const params = new URLSearchParams(window.location.search);
    const requestedMode = clean(params.get('mode') || params.get('action') || (requestedView === 'list' ? 'view' : requestedView));
    const currentView = ['create', 'view'].includes(requestedMode) ? requestedMode : 'home';
    const selectedType = clean(params.get('type') || params.get('userType')).toLowerCase();
    const selectedClientType = clean(params.get('client_type') || params.get('clientType')).toLowerCase();
    const actionCards = $all('.users-action-card');
    if (actionCards[0]) {
      actionCards[0].textContent = 'Create Users';
      actionCards[0].href = 'admin-users.html?mode=create';
    }
    if (actionCards[1]) {
      actionCards[1].textContent = 'View Existing Users';
      actionCards[1].href = 'admin-users.html?mode=view';
    }
    $all('[data-users-section]').forEach((section) => {
      section.hidden = currentView !== 'home' || section.dataset.usersSection !== 'home';
    });

    let root = $('#users-module-root');
    if (!root) {
      root = document.createElement('section');
      root.id = 'users-module-root';
      root.className = 'users-module-root';
    }
    const usersHost = $('.smartcrm-workspace') || $('.admin-main') || document.querySelector('main');
    if (usersHost && root.parentElement !== usersHost) {
      usersHost.appendChild(root);
    }
    root.hidden = currentView === 'home';
    root.innerHTML = '';
    if (currentView === 'home') return;

    const roleCards = [['student', 'Student'], ['client', 'Client'], ['employee', 'Employee'], ['board', 'Board Member']];
    const clientCards = [
      ['connector', 'Connector'],
      ['client_consultant', 'Consultant'],
      ['own_self', 'Self / Own'],
      ['employee_reference', 'Employee Reference'],
      ['online_reference', 'Online Reference'],
      ['banker_reference', 'Banker Reference']
    ];
    const usersHref = (next) => `admin-users.html?${new URLSearchParams(next).toString()}`;
    const optionMarkup = (items, selected = '') => items.map((value) => `<option value="${escapeHtml(value)}" ${value === selected ? 'selected' : ''}>${escapeHtml(formatLabel(value))}</option>`).join('');
    const renderCards = (cards, title, backHref, note = '') => {
      root.innerHTML = `
        <section class="admin-panel users-module-panel">
          <a class="admin-back-link" href="${escapeHtml(backHref)}">Back</a>
          <div class="admin-panel-head"><h2>${escapeHtml(title)}</h2>${note ? `<span class="status-pill">${escapeHtml(note)}</span>` : ''}</div>
          <div class="users-module-card-grid">
            ${cards.map((card) => `<a class="users-module-card" href="${escapeHtml(card.href)}"><strong>${escapeHtml(card.label)}</strong></a>`).join('')}
          </div>
        </section>
      `;
    };

    if (!selectedType) {
      renderCards(roleCards.map(([type, label]) => ({ label, href: usersHref({ mode: currentView, type }) })), currentView === 'create' ? 'Create Users' : 'View Existing Users', 'admin-users.html');
      return;
    }
    if (currentView === 'create' && selectedType === 'client' && !selectedClientType) {
      renderCards(clientCards.map(([type, label]) => ({ label, href: usersHref({ mode: 'create', type: 'client', client_type: type }) })), 'Create Client', usersHref({ mode: 'create' }), 'Client Type');
      return;
    }
    if (currentView === 'view' && selectedType === 'client' && !selectedClientType) {
      renderCards([
        { label: 'All Clients', href: usersHref({ mode: 'view', type: 'client', client_type: 'all' }) },
        ...clientCards.map(([type, label]) => ({ label, href: usersHref({ mode: 'view', type: 'client', client_type: type }) }))
      ], 'View Clients', usersHref({ mode: 'view' }), 'Client Type');
      return;
    }

    async function loadUserOptions() {
      const [clientsResult, employeesResult] = await Promise.all([
        adminFetch('/api/admin/clients?client_type=all&limit=1000').catch(() => ({ clients: [] })),
        adminFetch('/api/admin/users?type=employee&limit=100').catch(() => ({ users: [] }))
      ]);
      return {
        clients: clientsResult.clients || [],
        employees: employeesResult.users || []
      };
    }
    const clientOptions = (clients) => `<option value="">Select client/source owner</option>${clients.map((client) => {
      const label = `${client.name || client.companyName || 'Client'} (${formatLabel(client.referenceType || client.clientType || 'client')})`;
      return `<option value="${escapeHtml(client.id)}">${escapeHtml(label)}</option>`;
    }).join('')}`;
    const employeeOptions = (employees) => `<option value="">Unassigned</option>${employees.map((employee) => {
      const label = `${employee.fullName || employee.name || 'Employee'}${employee.email ? ` - ${employee.email}` : ''}`;
      return `<option value="${escapeHtml(employee.id)}">${escapeHtml(label)}</option>`;
    }).join('')}`;

    async function renderCreateForm() {
      const { clients, employees } = await loadUserOptions();
      const isClient = selectedType === 'client';
      const clientType = selectedClientType || 'client_consultant';
      const loginRequired = !isClient;
      const backHref = isClient ? usersHref({ mode: 'create', type: 'client' }) : usersHref({ mode: 'create' });
      const header = isClient ? `Create ${formatLabel(clientType)}` : `Create ${formatLabel(selectedType)}`;
      const commissionChecked = ['connector', 'client_consultant', 'banker_reference'].includes(clientType) ? 'checked' : '';
      const commonLogin = `
        <label>Full Name <input type="text" name="name" required placeholder="Full name"></label>
        <label>Email Address <input type="email" name="email" ${loginRequired ? 'required' : ''} placeholder="user@example.com"></label>
        <label>Mobile Number <input type="tel" name="mobile" ${loginRequired || selectedType === 'student' ? 'required' : ''} placeholder="+91 9876543210"></label>
        <label>Temporary Password <input type="text" name="temporaryPassword" ${loginRequired ? 'required' : ''} minlength="8" placeholder="Min 8 characters — share securely"></label>
        <label>Account Status <select name="status"><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
      `;
      const forms = {
        student: `
          <input type="hidden" name="userType" value="student">
          ${commonLogin}
          <label>University Applied For <input type="text" name="universityAppliedFor" placeholder="University name or lender pre-approval target"></label>
          <label>Country <input type="text" name="country" placeholder="e.g. USA, UK, Canada"></label>
          <label>Course / Program <input type="text" name="course" placeholder="e.g. MS Computer Science"></label>
          <label>Loan Amount Needed (₹) <input type="number" name="loanAmountNeeded" min="0" step="1" placeholder="0"></label>
          <label>Loan Amount Sanctioned (₹) <input type="number" name="loanAmountSanctioned" min="0" step="1" placeholder="0"></label>
          <label>Lead Source Owner (Client) <select name="referenceOwnerId">${clientOptions(clients)}</select></label>
          <label>Lead Source Type <select name="leadSourceType">${optionMarkup(smartClientCategories)}</select></label>
          <label>Assigned Employee <select name="assignedEmployeeId">${employeeOptions(employees)}</select></label>
          <label>Application Status <select name="studentStatus">${optionMarkup(applicationStatuses, 'new_user')}</select></label>
        `,
        client: `
          <input type="hidden" name="userType" value="client">
          <input type="hidden" name="clientCategory" value="${escapeHtml(clientType)}">
          ${commonLogin}
          ${clientType === 'client_consultant' ? '<label class="span-2">Consultancy / Organisation Name <input type="text" name="companyName" placeholder="e.g. Meridian Education Consultants"></label>' : '<label>Company / Source Name <input type="text" name="companyName" placeholder="Organisation or source name"></label>'}
          <label>Contact Person <input type="text" name="contactPerson" placeholder="Primary contact name"></label>
          ${clientType === 'employee_reference' ? `<label class="span-2">Linked Employee <select name="linkedEmployeeId">${employeeOptions(employees)}</select></label>` : ''}
          ${clientType === 'online_reference' ? '<label>Source URL <input type="url" name="sourceUrl" placeholder="https://"></label>' : ''}
          ${clientType === 'client_consultant' ? '<label>Website <input type="url" name="website" placeholder="https://"></label><label>GST Number <input type="text" name="gstNumber" placeholder="Optional"></label>' : ''}
          <label>City <input type="text" name="city" placeholder="City"></label>
          <label>State <input type="text" name="state" placeholder="State"></label>
          ${['connector', 'client_consultant', 'banker_reference'].includes(clientType) ? `
          <label>Commission Type
            <select name="commissionType">
              <option value="percentage">Percentage of Sanctioned Amount</option>
              <option value="fixed">Fixed Amount</option>
              <option value="none">No Commission</option>
            </select>
          </label>
          <label>Commission % <input type="number" name="commissionDefaultPercentage" min="0" max="100" step="0.01" placeholder="e.g. 1.5"></label>
          <label>Fixed Commission Amount (₹) <input type="number" name="commissionFixedAmount" min="0" step="1" placeholder="0"></label>
          ` : '<input type="hidden" name="commissionType" value="none">'}
          ${['connector', 'client_consultant', 'banker_reference'].includes(clientType) ? `
          <label>Bank Account Name <input type="text" name="bankAccountName" placeholder="Account holder name"></label>
          <label>Bank Account Number <input type="text" name="bankAccountNumber" placeholder="Account number"></label>
          <label>IFSC Code <input type="text" name="bankIfsc" placeholder="IFSC code"></label>
          <label>UPI ID <input type="text" name="upiId" placeholder="name@bank"></label>
          ` : ''}
          <label class="span-2">Office Address <textarea name="officeAddress" rows="2" placeholder="Full office / business address"></textarea></label>
          <label class="span-2">Internal Notes <textarea name="notes" rows="2" placeholder="Admin-only notes about this partner"></textarea></label>
          <label class="checkbox-field smartcrm-checkbox span-2">
            <input type="checkbox" name="commissionVisibilityEnabled" ${commissionChecked}>
            <span>Show commission details in this partner's dashboard</span>
          </label>
        `,
        employee: `
          <input type="hidden" name="userType" value="employee">
          <input type="hidden" name="employeeRole" value="employee">
          ${commonLogin}
          <label>Designation / Role Title <input type="text" name="designation" placeholder="e.g. Senior CRM Executive"></label>
          <label>Department <input type="text" name="department" placeholder="e.g. Operations, Sales"></label>
          <label>Access Level <input type="text" name="accessLevel" placeholder="e.g. Standard, Manager"></label>
        `,
        board: `
          <input type="hidden" name="userType" value="board">
          <input type="hidden" name="employeeRole" value="board_member">
          ${commonLogin}
          <label>Designation <input type="text" name="designation" placeholder="e.g. Director, Managing Partner"></label>
          <label>Access Level <input type="text" name="accessLevel" placeholder="Read-only by default"></label>
          <p class="admin-table-note span-2" style="margin-top:0">Board members have read-only dashboard access. They cannot modify CRM records, users, or commission data.</p>
        `
      };
      root.innerHTML = `
        <section class="admin-panel users-module-panel">
          <a class="admin-back-link" href="${escapeHtml(backHref)}">Back</a>
          <div class="admin-panel-head"><h2>${escapeHtml(header)}</h2><span class="status-pill">Admin / CEO Only</span></div>
          <form class="admin-editor-grid smartcrm-form users-dynamic-form" id="users-dynamic-form">
            ${forms[selectedType] || forms.employee}
            <div class="admin-actions span-2"><button type="submit" class="btn">Create User</button></div>
          </form>
        </section>
      `;
      const form = $('#users-dynamic-form', root);
      form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitBtn = event.submitter || form.querySelector('button[type="submit"]');
        const restoreButton = setButtonLoading(submitBtn, 'Creating...');
        showAdminMessage('info', 'Creating SmartCRM user...');
        const payload = getFormValues(form);
        try {
          const createResponse = await adminFetch(
            payload.userType === 'student' ? '/api/admin/students' : '/api/admin/users',
            { method: 'POST', body: JSON.stringify(payload) }
          );
          const createdUser = createResponse.user || createResponse.profile || {};
          form.reset();
          const typeLabel = formatLabel(payload.userType || 'User');
          if (payload.userType === 'student' && createdUser.id) {
            showAdminMessage('success', `${typeLabel} created. Redirecting to CRM...`);
            await delay(900);
            window.location.href = `admin-crm.html?search=${encodeURIComponent(payload.email || '')}`;
            return;
          }
          if (payload.userType === 'client' && createdUser.id) {
            showAdminMessage('success', `${typeLabel} created. View in Users list or link students to this client.`);
          } else {
            showAdminMessage('success', `${typeLabel} created successfully. Share the temporary password securely.`);
          }
        } catch (error) {
          showAdminMessage('error', error.message);
        } finally {
          restoreButton('Create User');
        }
      });
    }

    function studentRow(application) {
      const hasCrmApplication = Boolean(application.applicationId || application.userProfileId || application.customerName || application.studentName);
      const viewHref = hasCrmApplication
        ? crmDetailHref(application)
        : `admin-user-detail.html?id=${encodeURIComponent(application.id || '')}`;
      return `
        <tr>
          <td>${escapeHtml(application.customerName || application.studentName || application.fullName || application.name || '-')}</td>
          <td>${escapeHtml(application.customerEmail || application.studentEmail || application.email || '-')}</td>
          <td>${escapeHtml(application.customerPhone || application.studentMobile || application.mobile || application.phone || '-')}</td>
          <td>${escapeHtml(application.universityAppliedFor || application.universityApplied || '-')}</td>
          <td>${escapeHtml(application.country || '-')}</td>
          <td>${escapeHtml(application.loanAmountNeeded || application.loanAmountRequired || application.loanAmount || 0)}</td>
          <td>${escapeHtml(application.loanAmountSanctioned || application.loanAmountApproved || application.sanctionedAmount || 0)}</td>
          <td>${renderStatusBadge(application.status || application.applicationStatus || 'new_user')}</td>
          <td><a class="table-action" href="${viewHref}">View</a></td>
        </tr>
      `;
    }
    function clientRow(client) {
      return `
        <tr>
          <td>${escapeHtml(client.name || '-')}</td>
          <td>${escapeHtml(formatLabel(client.referenceType || client.clientType || '-'))}</td>
          <td>${escapeHtml(client.email || '-')}</td>
          <td>${escapeHtml(client.mobile || '-')}</td>
          <td>${escapeHtml(client.companyName || '-')}</td>
          <td>${escapeHtml(client.linkedEmployeeName || '-')}</td>
          <td>${escapeHtml(client.totalLeads || 0)}</td>
          <td>${escapeHtml(client.commissionDue || 0)}</td>
          <td>${renderStatusBadge(client.status || 'active')}</td>
          <td><a class="table-action" href="admin-crm.html?clientId=${encodeURIComponent(client.id || client.profileUserId || '')}&list=1">View</a></td>
        </tr>
      `;
    }
    function simpleUserRow(user, type) {
      return `
        <tr>
          <td>${escapeHtml(user.fullName || user.name || '-')}</td>
          <td>${escapeHtml(user.email || '-')}</td>
          <td>${escapeHtml(user.phone || user.mobile || '-')}</td>
          <td>${escapeHtml(type === 'board' ? 'Board Member' : formatLabel(user.role || type))}</td>
          <td>${renderStatusBadge(user.status || 'active')}</td>
          <td>${formatDate(user.createdAt)}</td>
          <td><a class="table-action" href="admin-user-detail.html?id=${encodeURIComponent(user.id)}">View</a></td>
        </tr>
      `;
    }

    async function renderList() {
      const title = selectedType === 'client' ? `${formatLabel(selectedClientType || 'all')} Clients` : `${formatLabel(selectedType)} Users`;
      const backHref = selectedType === 'client' ? usersHref({ mode: 'view', type: 'client' }) : usersHref({ mode: 'view' });
      root.innerHTML = `
        <section class="admin-panel users-module-panel">
          <a class="admin-back-link" href="${escapeHtml(backHref)}">Back</a>
          <div class="admin-panel-head"><h2>${escapeHtml(title)}</h2><span class="admin-table-note" id="admin-users-pagination"></span></div>
          <form class="admin-filter-bar users-dynamic-filters" id="users-dynamic-filters">
            <label>Search <input type="search" id="user-search" placeholder="Name, email or phone"></label>
            <label>Status <select id="user-status-filter"><option value="">All</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="pending">Pending</option><option value="suspended">Suspended</option></select></label>
            <button type="submit" class="btn">Apply</button>
            <button type="button" class="btn secondary-btn" id="user-filter-reset">Reset</button>
          </form>
          <div class="admin-table-wrap users-table-wrap">
            <table class="admin-table">
              <thead id="users-dynamic-head"></thead>
              <tbody id="admin-users-body"></tbody>
            </table>
          </div>
        </section>
      `;
      const tbody = $('#admin-users-body', root);
      const head = $('#users-dynamic-head', root);
      const pagination = $('#admin-users-pagination', root);
      async function refresh() {
        const search = clean($('#user-search', root)?.value);
        const status = clean($('#user-status-filter', root)?.value);
        const query = new URLSearchParams({ limit: '100' });
        if (search) query.set('search', search);
        if (status) query.set('status', status);
        if (selectedType === 'student') {
          tableState(tbody, 'Loading students...', 9);
          head.innerHTML = '<tr><th>Name</th><th>Email</th><th>Mobile</th><th>University</th><th>Country</th><th>Loan Needed</th><th>Sanctioned</th><th>Status</th><th>Action</th></tr>';
          query.set('type', 'student');
          const response = await adminFetch(`/api/admin/users?${query}`);
          const rows = response.users || [];
          tbody.innerHTML = rows.length ? rows.map(studentRow).join('') : '<tr><td colspan="9">No students found.</td></tr>';
          if (pagination) pagination.textContent = `Showing ${rows.length} of ${response.pagination?.total ?? rows.length} students`;
          return;
        }
        if (selectedType === 'client') {
          tableState(tbody, 'Loading clients...', 10);
          query.set('client_type', selectedClientType || 'all');
          head.innerHTML = '<tr><th>Name</th><th>Type</th><th>Email</th><th>Mobile</th><th>Company</th><th>Linked Employee</th><th>Leads</th><th>Commission Due</th><th>Status</th><th>Action</th></tr>';
          const response = await adminFetch(`/api/admin/clients?${query}`);
          const rows = response.clients || [];
          tbody.innerHTML = rows.length ? rows.map(clientRow).join('') : '<tr><td colspan="10">No clients found.</td></tr>';
          if (pagination) pagination.textContent = `Showing ${rows.length} of ${response.pagination?.total ?? rows.length} clients`;
          return;
        }
        tableState(tbody, `Loading ${formatLabel(selectedType)} users...`, 7);
        query.set('type', selectedType);
        head.innerHTML = '<tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Created</th><th>Action</th></tr>';
        const response = await adminFetch(`/api/admin/users?${query}`);
        const rows = response.users || [];
        tbody.innerHTML = rows.length ? rows.map((user) => simpleUserRow(user, selectedType)).join('') : '<tr><td colspan="7">No users found.</td></tr>';
        if (pagination) pagination.textContent = `Showing ${rows.length} of ${response.pagination?.total ?? rows.length} users`;
      }
      $('#users-dynamic-filters', root)?.addEventListener('submit', (event) => {
        event.preventDefault();
        refresh().catch((error) => showAdminMessage('error', error.message));
      });
      $('#user-filter-reset', root)?.addEventListener('click', () => {
        $('#users-dynamic-filters', root)?.reset();
        refresh().catch((error) => showAdminMessage('error', error.message));
      });
      await refresh();
    }

    if (currentView === 'create') {
      await renderCreateForm();
      return;
    }
    await renderList();
  }

  async function loadUserDetail() {
    const id = pageParam('id');
    if (!id) {
      showAdminMessage('error', 'User ID is missing.');
      return;
    }
    const [response, employees] = await Promise.all([
      adminFetch(`/api/admin/users/${encodeURIComponent(id)}`),
      loadCrmEmployeeUsers().catch(() => [])
    ]);
    const user = response.user || {};
    const application = response.application || null;
    const applicationKey = application?.id || application?.applicationId;
    const detail = $('#admin-user-detail');
    if (detail) {
      detail.innerHTML = [
        detailItem('Name', user.fullName),
        detailItem('Email', user.email),
        detailItem('Phone', user.phone),
        detailItem('User type', user.userType || 'student'),
        detailItem('Role/category', user.role || '-'),
        detailItem('Account status', user.status),
        detailItem('Registered', formatDate(user.createdAt)),
        detailItem('Updated', formatDate(user.updatedAt)),
        detailItem('Application ID', application?.applicationId || 'Not generated yet'),
        detailItem('Application status', application?.applicationStatus || '-')
      ].join('');
    }
    const form = $('#admin-user-status-form');
    const accountStatusSelect = $('#user-account-status');
    const applicationStatusSelect = $('#user-application-status');
    const assignedEmployeeSelect = $('#user-assigned-employee');
    fillSelect(accountStatusSelect, [...new Set(['active', ...userStatuses])], false);
    fillSelect(applicationStatusSelect, applicationStatuses, false);
    fillSelectOptionObjects(assignedEmployeeSelect, (employees || []).map((employee) => ({
      value: employee.id,
      label: employeeUserLabel(employee)
    })), 'Unassigned');
    if (form) {
      const selectedEmployeeId = application?.assignedEmployeeId || application?.assignedTo || '';
      const selectedEmployee = findCrmEmployeeUser(selectedEmployeeId);
      ensureSelectOptionLabel(assignedEmployeeSelect, selectedEmployeeId, selectedEmployee ? employeeUserLabel(selectedEmployee) : application?.assignedAdminName || 'Current employee');
      setFormValues(form, {
        status: user.status || 'active',
        applicationStatus: application?.applicationStatus || application?.workflowStage || application?.status || 'new_user',
        assignedEmployeeId: selectedEmployeeId
      });
      if (!applicationKey) {
        if (applicationStatusSelect) applicationStatusSelect.disabled = true;
        if (assignedEmployeeSelect) assignedEmployeeSelect.disabled = true;
      }
    }
    const appLink = $('#user-application-link');
    if (appLink) {
      if (applicationKey) {
        appLink.href = `admin-crm-detail.html?id=${encodeURIComponent(applicationKey)}`;
      } else {
        const searchValue = user.email || user.phone || user.fullName || id;
        appLink.href = `admin-crm.html?search=${encodeURIComponent(searchValue)}`;
      }
      appLink.hidden = false;
    }
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const restoreButton = setButtonLoading(event.submitter || event.currentTarget.querySelector('button[type="submit"]'), 'Saving...');
      showAdminMessage('info', 'Saving user...');
      try {
        await adminFetch(`/api/admin/users/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: accountStatusSelect?.value || user.status || 'active'
          })
        });
        if (applicationKey) {
          const assignedEmployeeId = assignedEmployeeSelect?.value || '';
          const selectedEmployee = findCrmEmployeeUser(assignedEmployeeId);
          const applicationStatus = applicationStatusSelect?.value || application?.applicationStatus || 'new_user';
          await adminFetch(`/api/admin/crm/applications/${encodeURIComponent(applicationKey)}`, {
            method: 'PATCH',
            body: JSON.stringify({
              applicationStatus,
              workflowStage: applicationStatus,
              assignedEmployeeId,
              assignedTo: assignedEmployeeId,
              assignedAdminName: selectedEmployee ? (selectedEmployee.fullName || selectedEmployee.name || '') : ''
            })
          });
        }
        showAdminMessage('success', 'Changes saved successfully.');
      } catch (error) {
        showAdminMessage('error', error.message);
      } finally {
        restoreButton('Save Changes');
      }
    });
  }

  function crmDetailHref(application = {}) {
    const applicationKey = application.id || application.applicationId;
    return applicationKey
      ? `admin-crm-detail.html?id=${encodeURIComponent(applicationKey)}`
      : 'admin-crm.html';
  }

  function getInitials(name) {
    return String(name || 'U').trim().split(/\s+/).slice(0, 2).map((word) => word[0] || '').join('').toUpperCase() || 'U';
  }

  function statusColorClass(status) {
    const s = String(status || '').toLowerCase();
    if (['new_user', 'registered'].includes(s)) return 'crm-status-new';
    if (['assigned', 'verified', 'in_progress', 'work_started'].includes(s)) return 'crm-status-active';
    if (['documents_pending', 'documents_received'].includes(s)) return 'crm-status-docs';
    if (['bank_review', 'loan_processing', 'follow_up'].includes(s)) return 'crm-status-bank';
    if (['sanction_in_progress', 'sanction_pending'].includes(s)) return 'crm-status-sanction';
    if (['sanctioned', 'approved', 'approved_partner'].includes(s)) return 'crm-status-sanctioned';
    if (['disbursed', 'disbursement_pending'].includes(s)) return 'crm-status-disbursed';
    if (['rejected', 'not_interested'].includes(s)) return 'crm-status-rejected';
    if (['closed', 'completed'].includes(s)) return 'crm-status-closed';
    return 'crm-status-new';
  }

  function sourceColorClass(source) {
    const s = String(source || '').toLowerCase();
    if (s === 'connector') return 'crm-source-connector';
    if (s === 'client_consultant') return 'crm-source-consultant';
    if (s === 'banker_reference') return 'crm-source-banker';
    if (s === 'employee_reference') return 'crm-source-employee';
    if (s === 'online_reference') return 'crm-source-online';
    return 'crm-source-own';
  }

  function formatLoanShort(amount) {
    const n = Number(amount || 0);
    if (!n) return '—';
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    return `₹${n.toLocaleString('en-IN')}`;
  }

  function avatarColor(name) {
    const colors = ['#6554e8', '#1d8fe8', '#15a350', '#e8801d', '#dc3545', '#0f9f9f', '#8b5cf6', '#c17d00'];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
    return colors[Math.abs(hash) % colors.length];
  }

  function applicationRow(application) {
    const name = application.customerName || application.studentName || '—';
    const appId = application.applicationId || '—';
    const source = application.referenceSourceType || application.leadSourceType || application.clientType || 'own_self';
    const status = application.applicationStatus || application.workflowStage || application.status || 'new_user';
    const initials = getInitials(name);
    const bg = avatarColor(name);
    const university = application.universityApplied || application.universityAppliedFor || '—';
    const country = application.country ? ` · ${application.country}` : '';
    const loanAmount = formatLoanShort(application.loanAmountRequired || application.loanAmountNeeded || application.loanAmount);
    const assigned = application.assignedAdminName || application.assignedTo || '—';
    const lastDate = application.updatedAt || application.createdAt || '';
    const detailHref = crmDetailHref(application);
    const appKey = application.id || application.applicationId || '';

    return `
      <tr class="crm-lead-row" data-app-id="${escapeHtml(appKey)}">
        <td class="crm-td-lead">
          <div class="crm-lead-cell">
            <div class="crm-lead-avatar" style="background:${bg}">${escapeHtml(initials)}</div>
            <div class="crm-lead-text">
              <strong>${escapeHtml(name)}</strong>
              <span class="crm-app-id-small">${escapeHtml(appId)}</span>
            </div>
          </div>
        </td>
        <td>${escapeHtml(application.customerPhone || application.studentMobile || '—')}</td>
        <td>
          <span class="crm-university-cell">${escapeHtml(university)}${escapeHtml(country)}</span>
        </td>
        <td><span class="crm-source-chip ${escapeHtml(sourceColorClass(source))}">${escapeHtml(formatLabel(source))}</span></td>
        <td class="crm-td-amount">${escapeHtml(loanAmount)}</td>
        <td>${escapeHtml(assigned)}</td>
        <td><span class="crm-status-badge ${escapeHtml(statusColorClass(status))}">${escapeHtml(formatLabel(status))}</span></td>
        <td class="crm-td-date">${formatDate(lastDate)}</td>
        <td class="crm-td-action">
          <a class="crm-open-btn" href="${detailHref}">Open</a>
        </td>
      </tr>
    `;
  }

  function updateCrmHeroCard(application) {
    const name = application.customerName || application.studentName || '—';
    const status = application.applicationStatus || application.workflowStage || application.status || 'new_user';
    const avatarEl = $('#crm-hero-avatar');
    const nameEl = $('#crm-hero-name');
    const statusEl = $('#crm-hero-status-badge');
    const metaEl = $('#crm-hero-meta');
    const fullLink = $('#crm-full-detail-link');
    if (avatarEl) {
      avatarEl.textContent = getInitials(name);
      avatarEl.style.background = avatarColor(name);
    }
    if (nameEl) nameEl.textContent = name;
    if (statusEl) {
      statusEl.textContent = formatLabel(status);
      statusEl.className = `crm-status-badge ${statusColorClass(status)}`;
    }
    if (metaEl) {
      const parts = [
        application.customerPhone || application.studentMobile,
        application.customerEmail || application.studentEmail,
        application.universityApplied || application.universityAppliedFor,
        application.country
      ].filter(Boolean);
      metaEl.textContent = parts.join(' · ') || '—';
    }
    if (fullLink && (application.id || application.applicationId)) {
      fullLink.href = `admin-crm-detail.html?id=${encodeURIComponent(application.id || application.applicationId)}`;
    }
    const drawerEl = $('#crm-drawer-app-id');
    if (drawerEl) drawerEl.textContent = application.applicationId || '—';
  }

  function syncCrmWorkflowOptions(clientType = 'regular') {
    const stage = $('#crm-workflow-stage');
    const status = $('#crm-application-status');
    const options = clientType === 'b2b' ? b2bWorkflowStages : regularWorkflowStages;
    fillSelect(stage, options, false);
    fillSelect(status, options, false);
  }

  function syncSelectedCrmClientType() {
    const select = $('#crm-client-name');
    const typeInput = $('#crm-client-type-value');
    const selectedClient = findCrmClientLoginUser(select?.value);
    if (typeInput && selectedClient) typeInput.value = 'b2b';
    return typeInput?.value || selectedClient?.clientType || 'regular';
  }

  function populateCrmClientNameSelect() {
    const select = $('#crm-client-name');
    if (!select) return;
    const users = crmClientLoginUsersCache || [];
    fillSelectOptionObjects(select, users.map((user) => ({
      value: user.id,
      label: clientLoginUserLabel(user)
    })), users.length ? '' : 'No client logins found');
  }

  function populateCrmControlSelects(clientType = 'regular') {
    fillSelect($('#crm-application-service'), serviceOptions, false);
    populateCrmClientNameSelect();
    const employeeSelect = $('#crm-assigned-employee');
    if (employeeSelect) {
      const employees = crmEmployeeUsersCache || [];
      fillSelectOptionObjects(employeeSelect, employees.map((employee) => ({
        value: employee.id,
        label: employeeUserLabel(employee)
      })), 'Unassigned');
    }
    if ($('#crm-client-type-value')) $('#crm-client-type-value').value = clientType;
    syncCrmWorkflowOptions(clientType);
    fillSelect($('#crm-document-status'), documentStatuses, false);
    fillSelect($('#crm-priority'), priorityOptions, false);
    fillSelect($('#crm-sanction-status'), sanctionStatuses, false);
    fillSelect($('#crm-disbursement-status'), disbursementStatuses, false);
    fillSelect($('#crm-commission-status'), commissionStatuses, false);
    fillSelect($('#crm-update-type'), updateTypes, false);
  }

  async function loadCrm() {
    fillSelect($('#crm-status-filter'), applicationStatuses, true);
    fillSelect($('#crm-service-filter'), serviceOptions, true);
    await loadCrmClientLoginUsers();
    await loadCrmEmployeeUsers();
    populateCrmControlSelects('regular');
    const tbody = $('#admin-crm-body');
    const form = $('#admin-crm-filters');
    const urlParams = new URLSearchParams(window.location.search);
    const initialSearch = pageParam('search', 'q');
    const initialDetailId = pageParam('id', 'applicationId');
    const initialClientId = pageParam('clientId', 'client');
    const inlineDetailPanel = $('#crm-inline-detail-panel');
    const tableSection = $('.crm-table-section');
    if (tableSection && initialDetailId) tableSection.hidden = true;
    if (initialSearch && $('#crm-search')) $('#crm-search').value = initialSearch;
    if (initialClientId && $('#crm-client-name')) {
      ensureSelectOptionLabel($('#crm-client-name'), initialClientId, findCrmClientLoginUser(initialClientId) ? clientLoginUserLabel(findCrmClientLoginUser(initialClientId)) : 'Selected client');
      $('#crm-client-name').value = initialClientId;
      syncSelectedCrmClientType();
    }

    // Pipeline tab setup
    $all('.crm-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        clearStatFilterButtons();
        currentStatFilter = '';
        if (!(tab.dataset.status || '')) activeClientFilterId = '';
        setPipelineStatus(tab.dataset.status || '');
        refresh().catch((error) => showAdminMessage('error', error.message));
      });
    });

    // Drawer close button
    $('#crm-drawer-close-btn')?.addEventListener('click', () => {
      if (inlineDetailPanel) inlineDetailPanel.hidden = true;
    });

    // Row click — open drawer
    tbody?.addEventListener('click', (event) => {
      const row = event.target.closest('.crm-lead-row');
      if (!row || event.target.closest('.crm-open-btn')) return;
      const appId = row.dataset.appId;
      if (!appId || !inlineDetailPanel) return;
      inlineDetailPanel.hidden = false;
      inlineDetailPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      initializeCrmDetail(appId).catch((error) => showAdminMessage('error', error.message));
    });

    const shouldOpenDetail = !inlineDetailPanel && urlParams.get('list') !== '1';
    let openedDetail = false;
    let inlineDetailStarted = false;
    let currentStatFilter = '';
    let activeClientFilterId = initialClientId;

    function clearStatFilterButtons() {
      $all('[data-crm-stat-filter]').forEach((button) => button.classList.remove('is-active'));
    }

    function setPipelineStatus(status) {
      const statusFilter = $('#crm-status-filter');
      if (statusFilter) statusFilter.value = status || '';
      $all('.crm-tab').forEach((tab) => {
        tab.classList.toggle('is-active', (tab.dataset.status || '') === (status || ''));
      });
    }

    async function refresh(page = 1) {
      if (tbody) {
        tbody.innerHTML = `<tr class="crm-empty-row"><td colspan="9"><div class="crm-empty-state"><div class="crm-empty-icon" style="font-size:1.5rem">⏳</div><strong>Loading leads…</strong></div></td></tr>`;
      }
      const params = new URLSearchParams({ page: String(page), limit: '25' });
      const search = clean($('#crm-search')?.value);
      const status = clean($('#crm-status-filter')?.value);
      const service = clean($('#crm-service-filter')?.value);
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (currentStatFilter) params.set('statFilter', currentStatFilter);
      if (service) params.set('service', service);
      if (activeClientFilterId) params.set('clientId', activeClientFilterId);
      const response = await adminFetch(`/api/admin/crm/applications?${params}`);
      const applications = response.applications || [];
      if (shouldOpenDetail && !openedDetail && page === 1 && applications.length) {
        openedDetail = true;
        window.location.href = crmDetailHref(applications[0]);
        return;
      }
      if (tbody) {
        tbody.innerHTML = applications.length
          ? applications.map(applicationRow).join('')
          : `<tr class="crm-empty-row"><td colspan="9">
              <div class="crm-empty-state">
                <div class="crm-empty-icon">📋</div>
                <strong>No leads found</strong>
                <p>Try adjusting your filters or create a new lead.</p>
                <a href="admin-users.html?mode=create&type=student" class="crm-btn-primary" style="margin-top:0.5rem">Create New Lead</a>
              </div>
             </td></tr>`;
      }
      const pagination = $('#admin-crm-pagination');
      if (pagination) {
        const total = response.pagination?.total ?? applications.length;
        pagination.textContent = `${applications.length} of ${total} leads`;
      }
      if (inlineDetailPanel && !inlineDetailStarted && page === 1 && (initialDetailId || applications.length)) {
        const selectedApplication = initialDetailId
          ? applications.find((application) => [application.id, application.applicationId].includes(initialDetailId))
          : null;
        const selectedKey = initialDetailId || selectedApplication?.id || selectedApplication?.applicationId;
        if (selectedKey) {
          inlineDetailStarted = true;
          inlineDetailPanel.hidden = false;
          await initializeCrmDetail(selectedKey);
        }
      }
      try {
        const statsResponse = await adminFetch('/api/admin/crm/stats');
        const stats = statsResponse.stats || {};
        setText('crm-total-users', stats.totalUsers);
        setText('crm-pending-users', stats.pendingUsers);
        setText('crm-total-applications', stats.totalApplications);
        setText('crm-work-started', stats.workStarted);
      } catch (error) {}
    }

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      clearStatFilterButtons();
      currentStatFilter = '';
      activeClientFilterId = '';
      refresh().catch((error) => showAdminMessage('error', error.message));
    });
    $('#crm-filter-reset')?.addEventListener('click', () => {
      form?.reset();
      clearStatFilterButtons();
      currentStatFilter = '';
      activeClientFilterId = '';
      setPipelineStatus('');
      refresh().catch((error) => showAdminMessage('error', error.message));
    });
    $all('[data-crm-stat-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.crmStatFilter || '';
        if (filter === 'users') {
          window.location.href = 'admin-users.html?mode=view';
          return;
        }
        clearStatFilterButtons();
        button.classList.add('is-active');
        currentStatFilter = filter === 'pending' ? 'pending' : '';
        if (filter === 'applications') activeClientFilterId = '';
        setPipelineStatus(filter === 'work_started' ? 'work_started' : '');
        if (filter === 'applications') currentStatFilter = '';
        refresh().catch((error) => showAdminMessage('error', error.message));
      });
    });
    await refresh();
  }

  function updateTimelineRow(update) {
    const isInternal = update.internalOnly || (!update.studentVisible && !update.clientVisible);
    const audienceParts = [];
    if (update.studentVisible) audienceParts.push('Student');
    if (update.clientVisible) audienceParts.push('Client');
    if (update.boardVisible) audienceParts.push('Board');
    if (isInternal || audienceParts.length === 0) audienceParts.push('Internal Only');
    const audience = audienceParts.join(', ');
    return `
      <article class="admin-timeline-item ${isInternal ? 'is-internal' : ''}">
        <div>
          <strong>${escapeHtml(update.title || update.updateType || 'Update')}</strong>
          <span>${escapeHtml(formatLabel(update.updateType || 'message'))} &middot; ${escapeHtml(audience)}</span>
        </div>
        <p>${escapeHtml(update.message || '')}</p>
        <small>${formatDate(update.createdAt)}</small>
      </article>
    `;
  }

  async function initializeCrmDetail(id) {
    if (!id) {
      showAdminMessage('error', 'CRM application ID is missing.');
      return;
    }
    await loadCrmClientLoginUsers();
    await loadCrmEmployeeUsers();
    populateCrmControlSelects('regular');
    let crmSaveInFlight = false;
    let crmUpdateInFlight = false;
    let workStartInFlight = false;
    let crmFormDirty = false;

    function syncWorkflowOptions(clientType) {
      syncCrmWorkflowOptions(clientType);
    }
    $('#crm-client-name')?.addEventListener('change', () => syncWorkflowOptions(syncSelectedCrmClientType()));

    function validateCrmApplicationForm(form) {
      const requiredFields = [
        ['service', 'Loan Type / Service'],
        ['workflowStage', 'Current Workflow Stage'],
        ['applicationStatus', 'Application Status'],
        ['documentStatus', 'Document status'],
        ['sanctionStatus', 'Sanction status'],
        ['disbursementStatus', 'Disbursement status'],
        ['commissionStatus', 'Commission status'],
        ['priority', 'Priority']
      ];
      const missing = requiredFields
        .filter(([name]) => !clean(form.elements[name]?.value))
        .map(([, label]) => label);
      if (missing.length) throw new Error(`Please complete: ${missing.join(', ')}.`);
    }

    async function refresh({ quiet = false, forceForm = false } = {}) {
      if (!quiet) {
        showAdminMessage('info', 'Loading application details...');
        const detail = $('#admin-crm-detail');
        if (detail) detail.innerHTML = '<div><span>Loading</span><strong>Fetching latest CRM data...</strong></div>';
      }
      const [detailResponse, updatesResponse] = await Promise.all([
        adminFetch(`/api/applications/${encodeURIComponent(id)}`),
        adminFetch(`/api/admin/crm/applications/${encodeURIComponent(id)}/updates`)
      ]);
      const application = detailResponse.application || {};
      const user = detailResponse.user || {};
      const detail = $('#admin-crm-detail');
      if (detail) {
        const amtReq = application.loanAmountRequired ? `₹${Number(application.loanAmountRequired).toLocaleString('en-IN')}` : '—';
        const amtSan = application.loanAmountApproved ? `₹${Number(application.loanAmountApproved).toLocaleString('en-IN')}` : '—';
        const amtDis = application.disbursedAmount ? `₹${Number(application.disbursedAmount).toLocaleString('en-IN')}` : '—';
        detail.innerHTML = [
          detailItem('Student Name', application.customerName || application.studentName),
          detailItem('Email', application.customerEmail || application.studentEmail),
          detailItem('Mobile', application.customerPhone || application.studentMobile),
          detailItem('University Applied For', application.universityApplied || application.universityAppliedFor),
          detailItem('Country', application.country || '—'),
          detailItem('Course', application.course || '—'),
          detailItem('Source Type', formatLabel(application.referenceSourceType || application.leadSourceType || '—')),
          detailItem('Loan Required', amtReq),
          detailItem('Loan Sanctioned', amtSan),
          detailItem('Loan Disbursed', amtDis),
          detailItem('Bank / NBFC', application.bankName || '—'),
          detailItem('Assigned To', application.assignedAdminName || application.assignedTo || '—'),
          detailItem('Follow-up Date', application.nextFollowupDate || '—'),
          detailItem('Created', formatDate(application.createdAt)),
          detailItem('Work Started', formatDate(application.workStartedAt))
        ].join('');
      }
      updateCrmHeroCard(application);
      const crmForm = $('#crm-application-form');
      const activeInsideForm = crmForm?.contains(document.activeElement);
      const shouldUpdateForm = forceForm || !quiet || (!crmFormDirty && !activeInsideForm);
      if (shouldUpdateForm) {
        syncWorkflowOptions(application.clientType || 'regular');
        const clientSelect = $('#crm-client-name');
        if (clientSelect) {
          const selectedClientId = application.clientId || application.referencePartnerId || application.referenceOwnerId || application.consultantClientId || '';
          const selectedClient = findCrmClientLoginUser(selectedClientId);
          ensureSelectOptionLabel(clientSelect, selectedClientId, selectedClient ? clientLoginUserLabel(selectedClient) : application.assignedAdminName || 'Current client');
        }
        const employeeSelect = $('#crm-assigned-employee');
        if (employeeSelect) {
          const selectedEmployeeId = application.assignedEmployeeId || application.assignedTo || '';
          const selectedEmployee = findCrmEmployeeUser(selectedEmployeeId);
          ensureSelectOptionLabel(employeeSelect, selectedEmployeeId, selectedEmployee ? employeeUserLabel(selectedEmployee) : application.assignedAdminName || 'Current employee');
        }
        setFormValues(crmForm, {
          userProfileId: application.userProfileId || '',
          clientId: application.clientId || application.referencePartnerId || application.referenceOwnerId || '',
          clientType: application.clientType || 'regular',
          service: application.service || 'Other',
          universityAppliedFor: application.universityAppliedFor || application.universityApplied || '',
          country: application.country || '',
          course: application.course || '',
          applicationStatus: application.applicationStatus || 'new_user',
          workflowStage: application.workflowStage || application.applicationStatus || 'new_user',
          documentStatus: application.documentStatus || 'not_started',
          bankName: application.bankName || '',
          loanAmountRequired: application.loanAmountRequired ?? '',
          loanAmountApproved: application.loanAmountApproved ?? '',
          sanctionStatus: application.sanctionStatus || 'not_started',
          disbursementStatus: application.disbursementStatus || 'not_started',
          commissionStatus: application.commissionStatus || 'not_applicable',
          priority: application.priority || 'normal',
          nextFollowupDate: application.nextFollowupDate || '',
          adminStatus: application.adminStatus || '',
          assignedEmployeeId: application.assignedEmployeeId || application.assignedTo || '',
          notes: application.notes || ''
        });
        crmFormDirty = false;
      }
      const timeline = $('#crm-updates-timeline');
      const updates = updatesResponse.updates || [];
      if (timeline) {
        timeline.innerHTML = updates.length
          ? updates.map(updateTimelineRow).join('')
          : '<p class="crm-empty-msg">No updates yet. Post the first update above.</p>';
      }
      setText('crm-generated-application-id', application.applicationId || 'Not generated yet');
      if (!quiet) showAdminMessage('success', 'Lead loaded successfully.');
      return application;
    }

    $('#crm-application-form')?.addEventListener('input', () => {
      crmFormDirty = true;
    });
    $('#crm-application-form')?.addEventListener('change', () => {
      crmFormDirty = true;
    });

    $('#crm-application-form')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (crmSaveInFlight) return;
      crmSaveInFlight = true;
      const restoreButton = setButtonLoading(event.submitter || event.currentTarget.querySelector('button[type="submit"]'), 'Saving...');
      showAdminMessage('info', 'Saving CRM application...');
      try {
        validateCrmApplicationForm(event.currentTarget);
        const payload = normalizeCrmApplicationPayload(getFormValues(event.currentTarget));
        const saveResponse = await adminFetch(`/api/applications/${encodeURIComponent(id)}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        if (event.submitter) event.submitter.textContent = 'Saved';
        showAdminMessage('success', 'Successfully Saved');
        notifyCrmChanged(saveResponse.application?.id || saveResponse.application?.applicationId || id);
        crmFormDirty = false;
        await refresh({ forceForm: true });
        await delay(1600);
      } catch (error) {
        showAdminMessage('error', error.message);
      } finally {
        crmSaveInFlight = false;
        restoreButton('Save Changes');
      }
    });

    $('#crm-work-started-button')?.addEventListener('click', async () => {
      if (workStartInFlight) return;
      workStartInFlight = true;
      const restoreButton = setButtonLoading($('#crm-work-started-button'), 'Starting...');
      showAdminMessage('info', 'Starting work and generating Application ID...');
      try {
        const response = await adminFetch(`/api/applications/${encodeURIComponent(id)}/work-started`, {
          method: 'PATCH',
          body: JSON.stringify({})
        });
        const appId = response.application?.applicationId || 'generated';
        showAdminMessage('success', response.application?.workStartedAt ? `Work started successfully. Application ID: ${appId}` : `Work already started. Application ID: ${appId}`);
        notifyCrmChanged(response.application?.id || response.application?.applicationId || id);
        await refresh();
      } catch (error) {
        showAdminMessage('error', error.message);
      } finally {
        workStartInFlight = false;
        restoreButton('Mark Work Started');
      }
    });

    $('#crm-update-form')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (crmUpdateInFlight) return;
      crmUpdateInFlight = true;
      const submitButton = event.submitter || event.currentTarget.querySelector('button[type="submit"]');
      const restoreButton = setButtonLoading(submitButton, 'Adding...');
      showAdminMessage('info', 'Adding CRM update...');
      try {
        const payload = getFormValues(event.currentTarget);
        const internalOnly = Boolean(payload.internalOnly);
        payload.studentVisible = !internalOnly && Boolean(payload.studentVisible);
        payload.clientVisible = !internalOnly && Boolean(payload.clientVisible);
        payload.boardVisible = Boolean(payload.boardVisible);
        payload.internalOnly = internalOnly;
        payload.visibleToUser = payload.studentVisible || payload.clientVisible;
        payload.clientMutationId = mutationId('crm-update');
        await adminFetch(`/api/admin/crm/applications/${encodeURIComponent(id)}/updates`, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        if (submitButton) submitButton.textContent = 'Added';
        showAdminMessage('success', 'Update added successfully.');
        notifyCrmChanged(id);
        await refresh();
        event.currentTarget.reset();
        const studentChk = event.currentTarget.elements.studentVisible;
        const clientChk = event.currentTarget.elements.clientVisible;
        if (studentChk) studentChk.checked = true;
        if (clientChk) clientChk.checked = true;
        await delay(1400);
      } catch (error) {
        showAdminMessage('error', error.message);
      } finally {
        crmUpdateInFlight = false;
        restoreButton('Add Update');
      }
    });

    window.addEventListener('nidhi:crm-updated', (event) => {
      if (!event.detail?.applicationId || event.detail.applicationId === id) {
        refresh({ quiet: true }).catch(() => {});
      }
    });
    window.addEventListener('storage', (event) => {
      if (event.key !== 'nidhi_crm_last_update') return;
      const detail = JSON.parse(event.newValue || '{}');
      if (!detail.applicationId || detail.applicationId === id) {
        refresh({ quiet: true }).catch(() => {});
      }
    });
    window.setInterval(() => refresh({ quiet: true }).catch(() => {}), 15000);
    await refresh();
  }

  async function loadCrmDetail() {
    await initializeCrmDetail(pageParam('id'));
  }

  const loaders = {
    dashboard: loadDashboard,
    enquiries: loadEnquiries,
    enquiryDetail: loadEnquiryDetail,
    chats: loadChats,
    chatDetail: loadChatDetail,
    users: loadUsersModule,
    userDetail: loadUserDetail,
    crm: loadCrm,
    crmDetail: loadCrmDetail,
    websiteControl: loadWebsiteControl,
    siteSettings: loadSiteSettings,
    servicesAdmin: loadServicesAdmin,
    contentSections: loadSectionsAdmin,
    navigationAdmin: loadNavigationAdmin,
    mediaLibrary: loadMediaAdmin
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.body.classList.contains('admin-page')) return;
    installSmartAdminShell();
    installAdminNav();
    bindLogout();
    window.addEventListener('hashchange', () => {
      refreshSmartAdminSidebar();
      bindLogout();
    });
    if (!requireAdminAuth()) return;
    const loader = loaders[document.body.dataset.adminPage || ''];
    let crmReloadTimer = null;
    const reloadForCrmMutation = () => {
      const page = document.body.dataset.adminPage || '';
      if (!['dashboard', 'crm', 'reports', 'commissions', 'userDetail'].includes(page)) return;
      if (page === 'crmDetail') return;
      window.clearTimeout(crmReloadTimer);
      crmReloadTimer = window.setTimeout(() => {
        Promise.resolve(loaders[page]?.()).catch((error) => showAdminMessage('error', error.message));
      }, 250);
    };
    window.addEventListener('nidhi:crm-updated', reloadForCrmMutation);
    window.addEventListener('storage', (event) => {
      if (event.key === 'nidhi_crm_last_update') reloadForCrmMutation();
    });
    Promise.resolve(loader?.())
      .then(() => window.NIDHI_initializePremiumTiltEffects?.(document))
      .catch((error) => {
        showAdminMessage('error', error.message || 'Something went wrong. Please try again.');
        window.NIDHI_initializePremiumTiltEffects?.(document);
      });
  });
})();
