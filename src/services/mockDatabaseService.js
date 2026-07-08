const crypto = require("crypto");
const { env } = require("../config/env");
const { toIsoString } = require("../utils/dateUtils");

const store = {
  adminProfiles: [
    {
      id: crypto.randomUUID(),
      authUserId: "mock-admin-user",
      fullName: "Nidhi Path Admin",
      email: env.mockAdminEmail || "info@nidhipath.in",
      phone: "",
      role: "super_admin",
      status: "active",
      createdAt: toIsoString(),
      updatedAt: toIsoString()
    }
  ],
  mockTokens: new Map(),
  enquiries: [],
  chatSessions: [],
  chatMessages: [],
  whatsappLogs: [],
  activityLogs: [],
  siteSettings: [],
  siteSections: [],
  siteContentBlocks: [],
  siteNavigation: [],
  serviceCatalog: [],
  homepageBlocks: [],
  mediaLibrary: [],
  adminAuditLogs: [],
  userProfiles: [],
  crmApplications: [],
  crmUpdates: [],
  crmStatusHistory: [],
  referencePartners: [],
  applicationCommissions: [],
  applicationUpdates: [],
  employeeDailyUpdates: [],
  employeeIncentives: [],
  businessIncomeRecords: [],
  applicationIdCounters: new Map()
};

function now() {
  return toIsoString();
}

function createRecord(table, record) {
  const entry = {
    id: record.id || crypto.randomUUID(),
    ...record,
    createdAt: record.createdAt || now(),
    updatedAt: record.updatedAt || now()
  };
  store[table].push(entry);
  return entry;
}

function updateRecord(table, predicate, updates) {
  const item = store[table].find(predicate);
  if (!item) return null;
  Object.assign(item, updates, { updatedAt: now() });
  return item;
}

function listRecords(table) {
  return store[table].slice();
}

function findRecord(table, predicate) {
  return store[table].find(predicate) || null;
}

function deleteAll() {
  store.enquiries = [];
  store.chatSessions = [];
  store.chatMessages = [];
  store.whatsappLogs = [];
  store.activityLogs = [];
  store.siteSettings = [];
  store.siteSections = [];
  store.siteContentBlocks = [];
  store.siteNavigation = [];
  store.serviceCatalog = [];
  store.homepageBlocks = [];
  store.mediaLibrary = [];
  store.adminAuditLogs = [];
  store.userProfiles = [];
  store.crmApplications = [];
  store.crmUpdates = [];
  store.crmStatusHistory = [];
  store.referencePartners = [];
  store.applicationCommissions = [];
  store.applicationUpdates = [];
  store.employeeDailyUpdates = [];
  store.employeeIncentives = [];
  store.businessIncomeRecords = [];
  store.applicationIdCounters = new Map();
  store.mockTokens = new Map();
}

module.exports = {
  createRecord,
  deleteAll,
  findRecord,
  listRecords,
  store,
  updateRecord
};
