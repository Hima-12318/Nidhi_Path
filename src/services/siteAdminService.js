const { env } = require("../config/env");
const { serviceSupabase } = require("../config/supabase");
const mockDb = require("./mockDatabaseService");
const adminAuditLogService = require("./adminAuditLogService");

const tableMap = {
  settings: { db: "site_settings", mock: "siteSettings", order: "setting_key" },
  sections: { db: "site_sections", mock: "siteSections", order: "display_order" },
  services: { db: "service_catalog", mock: "serviceCatalog", order: "display_order" },
  navigation: { db: "site_navigation", mock: "siteNavigation", order: "display_order" },
  contentBlocks: { db: "site_content_blocks", mock: "siteContentBlocks", order: "block_key" },
  media: { db: "media_library", mock: "mediaLibrary", order: "created_at" }
};

function read(row, snake, camel, fallback = undefined) {
  return row?.[snake] ?? row?.[camel] ?? fallback;
}

function mapSetting(row = {}) {
  if (!row) return null;
  return {
    id: row.id,
    settingKey: read(row, "setting_key", "settingKey"),
    settingValue: read(row, "setting_value", "settingValue", {}),
    status: read(row, "status", "status", "active"),
    updatedBy: read(row, "updated_by", "updatedBy", ""),
    createdAt: read(row, "created_at", "createdAt"),
    updatedAt: read(row, "updated_at", "updatedAt")
  };
}

function mapSection(row = {}) {
  if (!row) return null;
  return {
    id: row.id,
    pageKey: read(row, "page_key", "pageKey"),
    sectionKey: read(row, "section_key", "sectionKey"),
    sectionTitle: read(row, "section_title", "sectionTitle", ""),
    sectionSubtitle: read(row, "section_subtitle", "sectionSubtitle", ""),
    sectionContent: read(row, "section_content", "sectionContent", {}),
    displayOrder: read(row, "display_order", "displayOrder", 0),
    isVisible: read(row, "is_visible", "isVisible", true),
    updatedBy: read(row, "updated_by", "updatedBy", ""),
    createdAt: read(row, "created_at", "createdAt"),
    updatedAt: read(row, "updated_at", "updatedAt")
  };
}

function mapService(row = {}) {
  if (!row) return null;
  return {
    id: row.id,
    serviceKey: read(row, "service_key", "serviceKey"),
    serviceName: read(row, "service_name", "serviceName"),
    shortDescription: read(row, "short_description", "shortDescription", ""),
    longDescription: read(row, "long_description", "longDescription", ""),
    icon: read(row, "icon", "icon", ""),
    pageUrl: read(row, "page_url", "pageUrl", ""),
    displayOrder: read(row, "display_order", "displayOrder", 0),
    isActive: read(row, "is_active", "isActive", true),
    metadata: read(row, "metadata", "metadata", {}),
    updatedBy: read(row, "updated_by", "updatedBy", ""),
    createdAt: read(row, "created_at", "createdAt"),
    updatedAt: read(row, "updated_at", "updatedAt")
  };
}

function mapNavigation(row = {}) {
  if (!row) return null;
  return {
    id: row.id,
    label: row.label,
    href: row.href,
    navGroup: read(row, "nav_group", "navGroup", "main"),
    displayOrder: read(row, "display_order", "displayOrder", 0),
    isVisible: read(row, "is_visible", "isVisible", true),
    updatedBy: read(row, "updated_by", "updatedBy", ""),
    createdAt: read(row, "created_at", "createdAt"),
    updatedAt: read(row, "updated_at", "updatedAt")
  };
}

function mapContentBlock(row = {}) {
  if (!row) return null;
  return {
    id: row.id,
    blockKey: read(row, "block_key", "blockKey"),
    blockType: read(row, "block_type", "blockType"),
    title: row.title || "",
    subtitle: row.subtitle || "",
    content: row.content || "",
    metadata: read(row, "metadata", "metadata", {}),
    isVisible: read(row, "is_visible", "isVisible", true),
    updatedBy: read(row, "updated_by", "updatedBy", ""),
    createdAt: read(row, "created_at", "createdAt"),
    updatedAt: read(row, "updated_at", "updatedAt")
  };
}

function mapMedia(row = {}) {
  if (!row) return null;
  return {
    id: row.id,
    fileName: read(row, "file_name", "fileName"),
    fileUrl: read(row, "file_url", "fileUrl"),
    fileType: read(row, "file_type", "fileType", ""),
    altText: read(row, "alt_text", "altText", ""),
    usageContext: read(row, "usage_context", "usageContext", ""),
    uploadedBy: read(row, "uploaded_by", "uploadedBy", ""),
    createdAt: read(row, "created_at", "createdAt")
  };
}

const mappers = {
  settings: mapSetting,
  sections: mapSection,
  services: mapService,
  navigation: mapNavigation,
  contentBlocks: mapContentBlock,
  media: mapMedia
};

const defaultSettings = [
  { settingKey: "business_name", settingValue: { value: "Nidhi Path Loan Ventures" } },
  { settingKey: "tagline", settingValue: { value: "Way to Money" } },
  { settingKey: "official_email", settingValue: { value: "info@nidhipath.in" } },
  { settingKey: "official_website", settingValue: { value: "www.nidhipath.in" } },
  { settingKey: "official_phone", settingValue: { value: "+91 97056 82595" } },
  { settingKey: "whatsapp_number", settingValue: { value: "+91 97056 82595" } },
  { settingKey: "address", settingValue: { value: "Vijayawada, Andhra Pradesh" } },
  { settingKey: "city", settingValue: { value: "Vijayawada" } },
  { settingKey: "state", settingValue: { value: "Andhra Pradesh" } },
  { settingKey: "working_hours", settingValue: { value: "Monday to Saturday, 10:00 AM to 6:00 PM" } },
  { settingKey: "support_message", settingValue: { value: "Our team will contact you regarding your enquiry." } },
  { settingKey: "footer_text", settingValue: { value: "Terms & Conditions Apply. Loan approval is subject to bank policies, eligibility, verification, documentation, and credit assessment." } },
  { settingKey: "consent_text", settingValue: { value: "By submitting this form, you agree that Nidhi Path Loan Ventures may contact you regarding your enquiry." } },
  { settingKey: "seo_title", settingValue: { value: "Nidhi Path Loan Ventures" } },
  { settingKey: "seo_description", settingValue: { value: "Loan consultation, education loan guidance, and financial services." } }
];

const defaultServices = [
  ["education-loan", "Education Loan", "Education loan guidance", "education-loan.html", 1],
  ["personal-loan", "Personal Loan", "Personal loan consultation", "personal-loan.html", 2],
  ["business-loan", "Business Loan", "Business loan consultation", "business-loan.html", 3],
  ["home-loan", "Home Loan", "Home loan consultation", "home-loan.html", 4],
  ["mutual-funds", "Mutual Funds", "Mutual funds guidance", "mutual-funds.html", 5],
  ["insurance", "Insurance", "Insurance guidance", "insurance.html", 6],
  ["all-loans", "All Types of Loans", "Loan requirement review across categories", "all-loans.html", 7],
  ["loan-consultation", "Loan Consultation", "Loan consultation support", "loan-consultation.html", 8],
  ["other", "Other", "General financial service enquiry", "contact.html", 9]
].map(([serviceKey, serviceName, shortDescription, pageUrl, displayOrder]) => ({
  serviceKey,
  serviceName,
  shortDescription,
  longDescription: "",
  icon: "",
  pageUrl,
  displayOrder,
  isActive: true,
  metadata: {}
}));

const defaultNavigation = [
  ["Home", "index.html", "main", 1],
  ["Services", "services.html", "main", 2],
  ["About Us", "about.html", "main", 3],
  ["Eligibility", "eligibility.html", "main", 4],
  ["Contact Us", "contact.html", "main", 5],
  ["Login", "login.html", "main", 6]
].map(([label, href, navGroup, displayOrder]) => ({
  label,
  href,
  navGroup,
  displayOrder,
  isVisible: true
}));

const defaultSections = [
  ["home", "hero", "Home Hero", 1],
  ["home", "services", "Home Services", 2],
  ["home", "why_choose_us", "Why Choose Us", 3],
  ["home", "contact_cta", "Contact CTA", 4],
  ["footer", "main", "Footer Main", 1],
  ["contact", "main", "Contact Main", 1],
  ["eligibility", "main", "Eligibility Main", 1]
].map(([pageKey, sectionKey, sectionTitle, displayOrder]) => ({
  pageKey,
  sectionKey,
  sectionTitle,
  sectionSubtitle: "",
  sectionContent: {},
  displayOrder,
  isVisible: true
}));

async function listRecords(type, queryParams = {}) {
  const config = tableMap[type];
  const mapper = mappers[type];

  if (env.mockDatabaseMode) {
    let rows = mockDb.listRecords(config.mock).map(mapper);
    if (queryParams.pageKey) rows = rows.filter((item) => item.pageKey === queryParams.pageKey);
    if (queryParams.navGroup) rows = rows.filter((item) => item.navGroup === queryParams.navGroup);
    rows.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0) || String(a.settingKey || a.blockKey || a.label || a.fileName || "").localeCompare(String(b.settingKey || b.blockKey || b.label || b.fileName || "")));
    return rows;
  }

  let query = serviceSupabase.from(config.db).select("*");
  if (queryParams.pageKey && type === "sections") query = query.eq("page_key", queryParams.pageKey);
  if (queryParams.navGroup && type === "navigation") query = query.eq("nav_group", queryParams.navGroup);
  query = query.order(config.order, { ascending: true });

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to list ${config.db}: ${error.message}`);
  }

  return (data || []).map(mapper);
}

async function findRecord(type, id) {
  const config = tableMap[type];
  const mapper = mappers[type];

  if (env.mockDatabaseMode) {
    return mapper(mockDb.findRecord(config.mock, (item) => item.id === id));
  }

  const { data, error } = await serviceSupabase
    .from(config.db)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load ${config.db}: ${error.message}`);
  }

  return mapper(data);
}

async function updateRecord(type, id, updates, admin, action) {
  const config = tableMap[type];
  const mapper = mappers[type];
  const oldValue = await findRecord(type, id);
  if (!oldValue) return null;

  if (env.mockDatabaseMode) {
    const updated = mapper(mockDb.updateRecord(config.mock, (item) => item.id === id, { ...updates, updatedBy: admin.id }));
    await adminAuditLogService.createAdminAuditLog({
      adminUserId: admin.id,
      action,
      module: config.db,
      recordId: id,
      oldValue,
      newValue: updated
    });
    return updated;
  }

  const { data, error } = await serviceSupabase
    .from(config.db)
    .update(type === "media" ? updates : { ...updates, updated_by: admin.id })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update ${config.db}: ${error.message}`);
  }

  const updated = mapper(data);
  await adminAuditLogService.createAdminAuditLog({
    adminUserId: admin.id,
    action,
    module: config.db,
    recordId: id,
    oldValue,
    newValue: updated
  });
  return updated;
}

async function listSettings() {
  return listRecords("settings");
}

async function listPublicSettings() {
  const settings = await listSettings();
  return settings.filter((item) => item.status === "active");
}

async function listSections(query = {}) {
  return listRecords("sections", query);
}

async function listServices() {
  return listRecords("services");
}

async function listNavigation(query = {}) {
  return listRecords("navigation", query);
}

async function listContentBlocks() {
  return listRecords("contentBlocks");
}

async function listMedia() {
  return listRecords("media");
}

async function updateSettings(items, admin) {
  const adminId = admin?.id || null;
  console.log("[site-settings] update started", {
    adminId: adminId || "",
    fields: items.map((item) => item.settingKey)
  });

  if (env.mockDatabaseMode) {
    const updated = items.map((item) => {
      const existing = mockDb.findRecord("siteSettings", (record) => record.settingKey === item.settingKey);
      if (existing) {
        return mapSetting(mockDb.updateRecord("siteSettings", (record) => record.id === existing.id, {
          settingValue: item.settingValue,
          status: item.status || existing.status,
          updatedBy: adminId
        }));
      }
      return mapSetting(mockDb.createRecord("siteSettings", {
        settingKey: item.settingKey,
        settingValue: item.settingValue,
        status: item.status || "active",
        updatedBy: adminId
      }));
    });
    await adminAuditLogService.createAdminAuditLog({
      adminUserId: adminId,
      action: "update_site_settings",
      module: "site_settings",
      newValue: updated
    });
    console.log("[site-settings] update success", {
      adminId: admin?.id || "",
      fields: updated.map((item) => item.settingKey)
    });
    return updated;
  }

  const rows = items.map((item) => ({
    setting_key: item.settingKey,
    setting_value: item.settingValue,
    status: item.status || "active",
    updated_by: adminId
  }));

  const savedRows = [];
  for (const row of rows) {
    const { data: existing, error: lookupError } = await serviceSupabase
      .from("site_settings")
      .select("id")
      .eq("setting_key", row.setting_key)
      .maybeSingle();

    if (lookupError) {
      console.error("[site-settings] lookup failed", {
        adminId: adminId || "",
        field: row.setting_key,
        message: lookupError.message
      });
      throw new Error(`Failed to update site settings: ${lookupError.message}`);
    }

    const query = existing?.id
      ? serviceSupabase.from("site_settings").update(row).eq("id", existing.id)
      : serviceSupabase.from("site_settings").insert(row);

    const { data, error } = await query.select("*").single();

    if (error) {
      console.error("[site-settings] update failed", {
        adminId: adminId || "",
        field: row.setting_key,
        message: error.message
      });
      throw new Error(`Failed to update site settings: ${error.message}`);
    }

    savedRows.push(data);
  }

  const updated = savedRows.map(mapSetting).sort((a, b) => String(a.settingKey || "").localeCompare(String(b.settingKey || "")));
  await adminAuditLogService.createAdminAuditLog({
    adminUserId: adminId,
    action: "update_site_settings",
    module: "site_settings",
    newValue: updated
  });
  console.log("[site-settings] update success", {
    adminId: admin?.id || "",
    fields: updated.map((item) => item.settingKey)
  });
  return updated;
}

function toSectionUpdates(payload) {
  return {
    ...(payload.sectionTitle !== undefined ? { section_title: payload.sectionTitle } : {}),
    ...(payload.sectionSubtitle !== undefined ? { section_subtitle: payload.sectionSubtitle } : {}),
    ...(payload.sectionContent !== undefined ? { section_content: payload.sectionContent } : {}),
    ...(payload.displayOrder !== undefined ? { display_order: payload.displayOrder } : {}),
    ...(payload.isVisible !== undefined ? { is_visible: payload.isVisible } : {})
  };
}

function toServicePayload(payload) {
  return {
    ...(payload.serviceKey !== undefined ? { service_key: payload.serviceKey } : {}),
    ...(payload.serviceName !== undefined ? { service_name: payload.serviceName } : {}),
    ...(payload.shortDescription !== undefined ? { short_description: payload.shortDescription } : {}),
    ...(payload.longDescription !== undefined ? { long_description: payload.longDescription } : {}),
    ...(payload.icon !== undefined ? { icon: payload.icon } : {}),
    ...(payload.pageUrl !== undefined ? { page_url: payload.pageUrl } : {}),
    ...(payload.displayOrder !== undefined ? { display_order: payload.displayOrder } : {}),
    ...(payload.isActive !== undefined ? { is_active: payload.isActive } : {}),
    ...(payload.metadata !== undefined ? { metadata: payload.metadata } : {})
  };
}

function toNavigationUpdates(payload) {
  return {
    ...(payload.label !== undefined ? { label: payload.label } : {}),
    ...(payload.href !== undefined ? { href: payload.href } : {}),
    ...(payload.navGroup !== undefined ? { nav_group: payload.navGroup } : {}),
    ...(payload.displayOrder !== undefined ? { display_order: payload.displayOrder } : {}),
    ...(payload.isVisible !== undefined ? { is_visible: payload.isVisible } : {})
  };
}

function toContentBlockUpdates(payload) {
  return {
    ...(payload.blockType !== undefined ? { block_type: payload.blockType } : {}),
    ...(payload.title !== undefined ? { title: payload.title } : {}),
    ...(payload.subtitle !== undefined ? { subtitle: payload.subtitle } : {}),
    ...(payload.content !== undefined ? { content: payload.content } : {}),
    ...(payload.metadata !== undefined ? { metadata: payload.metadata } : {}),
    ...(payload.isVisible !== undefined ? { is_visible: payload.isVisible } : {})
  };
}

function toMediaPayload(payload) {
  return {
    ...(payload.fileName !== undefined ? { file_name: payload.fileName } : {}),
    ...(payload.fileUrl !== undefined ? { file_url: payload.fileUrl } : {}),
    ...(payload.fileType !== undefined ? { file_type: payload.fileType } : {}),
    ...(payload.altText !== undefined ? { alt_text: payload.altText } : {}),
    ...(payload.usageContext !== undefined ? { usage_context: payload.usageContext } : {})
  };
}

async function createNavigation(payload, admin) {
  if (env.mockDatabaseMode) {
    const navigationItem = mapNavigation(mockDb.createRecord("siteNavigation", {
      label: payload.label,
      href: payload.href,
      navGroup: payload.navGroup || "main",
      displayOrder: payload.displayOrder || 0,
      isVisible: payload.isVisible !== undefined ? payload.isVisible : true,
      updatedBy: admin.id
    }));
    await adminAuditLogService.createAdminAuditLog({
      adminUserId: admin.id,
      action: "create_navigation",
      module: "site_navigation",
      recordId: navigationItem.id,
      newValue: navigationItem
    });
    return navigationItem;
  }

  const { data, error } = await serviceSupabase
    .from("site_navigation")
    .insert({ ...toNavigationUpdates(payload), updated_by: admin.id })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create navigation item: ${error.message}`);
  }

  const navigationItem = mapNavigation(data);
  await adminAuditLogService.createAdminAuditLog({
    adminUserId: admin.id,
    action: "create_navigation",
    module: "site_navigation",
    recordId: navigationItem.id,
    newValue: navigationItem
  });
  return navigationItem;
}

async function createService(payload, admin) {
  if (env.mockDatabaseMode) {
    const service = mapService(mockDb.createRecord("serviceCatalog", {
      serviceKey: payload.serviceKey,
      serviceName: payload.serviceName,
      shortDescription: payload.shortDescription || "",
      longDescription: payload.longDescription || "",
      icon: payload.icon || "",
      pageUrl: payload.pageUrl || "",
      displayOrder: payload.displayOrder || 0,
      isActive: payload.isActive !== undefined ? payload.isActive : true,
      metadata: payload.metadata || {},
      updatedBy: admin.id
    }));
    await adminAuditLogService.createAdminAuditLog({
      adminUserId: admin.id,
      action: "create_service",
      module: "service_catalog",
      recordId: service.id,
      newValue: service
    });
    return service;
  }

  const { data, error } = await serviceSupabase
    .from("service_catalog")
    .insert({ ...toServicePayload(payload), updated_by: admin.id })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create service: ${error.message}`);
  }

  const service = mapService(data);
  await adminAuditLogService.createAdminAuditLog({
    adminUserId: admin.id,
    action: "create_service",
    module: "service_catalog",
    recordId: service.id,
    newValue: service
  });
  return service;
}

async function createMedia(payload, admin) {
  if (env.mockDatabaseMode) {
    const media = mapMedia(mockDb.createRecord("mediaLibrary", {
      fileName: payload.fileName,
      fileUrl: payload.fileUrl,
      fileType: payload.fileType || "",
      altText: payload.altText || "",
      usageContext: payload.usageContext || "",
      uploadedBy: admin.id
    }));
    await adminAuditLogService.createAdminAuditLog({
      adminUserId: admin.id,
      action: "create_media",
      module: "media_library",
      recordId: media.id,
      newValue: media
    });
    return media;
  }

  const { data, error } = await serviceSupabase
    .from("media_library")
    .insert({ ...toMediaPayload(payload), uploaded_by: admin.id })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create media record: ${error.message}`);
  }

  const media = mapMedia(data);
  await adminAuditLogService.createAdminAuditLog({
    adminUserId: admin.id,
    action: "create_media",
    module: "media_library",
    recordId: media.id,
    newValue: media
  });
  return media;
}

async function getOverview() {
  const [services, sections, navigation, media] = await Promise.all([
    listRecords("services"),
    listRecords("sections"),
    listRecords("navigation"),
    listRecords("media")
  ]);

  return {
    activeServices: services.filter((item) => item.isActive).length,
    visibleSections: sections.filter((item) => item.isVisible).length,
    navigationItems: navigation.filter((item) => item.isVisible).length,
    mediaFiles: media.length
  };
}

async function seedDefaults(admin) {
  const result = {
    settingsCreated: 0,
    servicesCreated: 0,
    sectionsCreated: 0,
    navigationCreated: 0
  };

  if (env.mockDatabaseMode) {
    defaultSettings.forEach((item) => {
      if (!mockDb.findRecord("siteSettings", (record) => record.settingKey === item.settingKey)) {
        mockDb.createRecord("siteSettings", { ...item, status: "active", updatedBy: admin.id });
        result.settingsCreated += 1;
      }
    });
    defaultServices.forEach((item) => {
      if (!mockDb.findRecord("serviceCatalog", (record) => record.serviceKey === item.serviceKey)) {
        mockDb.createRecord("serviceCatalog", { ...item, updatedBy: admin.id });
        result.servicesCreated += 1;
      }
    });
    defaultSections.forEach((item) => {
      if (!mockDb.findRecord("siteSections", (record) => record.pageKey === item.pageKey && record.sectionKey === item.sectionKey)) {
        mockDb.createRecord("siteSections", { ...item, updatedBy: admin.id });
        result.sectionsCreated += 1;
      }
    });
    defaultNavigation.forEach((item) => {
      if (!mockDb.findRecord("siteNavigation", (record) => record.href === item.href && record.navGroup === item.navGroup)) {
        mockDb.createRecord("siteNavigation", { ...item, updatedBy: admin.id });
        result.navigationCreated += 1;
      }
    });
  } else {
    const [settings, services, sections, navigation] = await Promise.all([
      listSettings(),
      listServices(),
      listSections({}),
      listNavigation({})
    ]);

    const missingSettings = defaultSettings
      .filter((item) => !settings.some((existing) => existing.settingKey === item.settingKey))
      .map((item) => ({
        setting_key: item.settingKey,
        setting_value: item.settingValue,
        status: "active",
        updated_by: admin.id
      }));
    if (missingSettings.length) {
      const { error } = await serviceSupabase.from("site_settings").insert(missingSettings);
      if (error) throw new Error(`Failed to seed site settings: ${error.message}`);
      result.settingsCreated = missingSettings.length;
    }

    const missingServices = defaultServices
      .filter((item) => !services.some((existing) => existing.serviceKey === item.serviceKey))
      .map((item) => ({ ...toServicePayload(item), updated_by: admin.id }));
    if (missingServices.length) {
      const { error } = await serviceSupabase.from("service_catalog").insert(missingServices);
      if (error) throw new Error(`Failed to seed services: ${error.message}`);
      result.servicesCreated = missingServices.length;
    }

    const missingSections = defaultSections
      .filter((item) => !sections.some((existing) => existing.pageKey === item.pageKey && existing.sectionKey === item.sectionKey))
      .map((item) => ({
        page_key: item.pageKey,
        section_key: item.sectionKey,
        section_title: item.sectionTitle,
        section_subtitle: item.sectionSubtitle,
        section_content: item.sectionContent,
        display_order: item.displayOrder,
        is_visible: item.isVisible,
        updated_by: admin.id
      }));
    if (missingSections.length) {
      const { error } = await serviceSupabase.from("site_sections").insert(missingSections);
      if (error) throw new Error(`Failed to seed sections: ${error.message}`);
      result.sectionsCreated = missingSections.length;
    }

    const missingNavigation = defaultNavigation
      .filter((item) => !navigation.some((existing) => existing.href === item.href && existing.navGroup === item.navGroup))
      .map((item) => ({ ...toNavigationUpdates(item), updated_by: admin.id }));
    if (missingNavigation.length) {
      const { error } = await serviceSupabase.from("site_navigation").insert(missingNavigation);
      if (error) throw new Error(`Failed to seed navigation: ${error.message}`);
      result.navigationCreated = missingNavigation.length;
    }
  }

  await adminAuditLogService.createAdminAuditLog({
    adminUserId: admin.id,
    action: "seed_site_defaults",
    module: "site_management",
    newValue: result
  });

  return result;
}

module.exports = {
  createMedia,
  createNavigation,
  createService,
  getOverview,
  listAuditLogs: adminAuditLogService.listAdminAuditLogs,
  listPublicSettings,
  listContentBlocks,
  listMedia,
  listNavigation,
  listSections,
  listServices,
  listSettings,
  seedDefaults,
  updateContentBlock: (id, payload, admin) => updateRecord("contentBlocks", id, toContentBlockUpdates(payload), admin, "update_content_block"),
  updateMedia: (id, payload, admin) => updateRecord("media", id, toMediaPayload(payload), admin, "update_media"),
  updateNavigation: (id, payload, admin) => updateRecord("navigation", id, toNavigationUpdates(payload), admin, "update_navigation"),
  updateSection: (id, payload, admin) => updateRecord("sections", id, toSectionUpdates(payload), admin, "update_site_section"),
  updateService: (id, payload, admin) => updateRecord("services", id, toServicePayload(payload), admin, "update_service"),
  updateSettings
};
