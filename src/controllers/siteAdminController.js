const { AppError } = require("../middleware/errorMiddleware");
const { sendSuccess } = require("../utils/responseUtils");
const siteAdminService = require("../services/siteAdminService");
const {
  parseContentBlockPatch,
  parseId,
  parseMediaCreate,
  parseMediaPatch,
  parseNavigationCreate,
  parseNavigationPatch,
  parseServiceCreate,
  parseServicePatch,
  parseSiteSectionPatch,
  parseSiteSettingsPatch
} = require("../services/siteValidationService");

async function overview(request, response, next) {
  try {
    const data = await siteAdminService.getOverview();
    sendSuccess(response, { data });
  } catch (error) {
    next(error);
  }
}

async function listSettings(request, response, next) {
  try {
    const settings = await siteAdminService.listSettings();
    sendSuccess(response, { data: settings, settings });
  } catch (error) {
    next(error);
  }
}

async function publicSettings(request, response, next) {
  try {
    const settings = await siteAdminService.listPublicSettings();
    const settingsMap = settings.reduce((map, item) => {
      map[item.settingKey] = item.settingValue?.value ?? item.settingValue ?? "";
      return map;
    }, {});
    sendSuccess(response, { data: settings, settings, settingsMap });
  } catch (error) {
    next(error);
  }
}

async function updateSettings(request, response, next) {
  try {
    const payload = parseSiteSettingsPatch(request.body);
    console.log("[site-settings] admin action", {
      adminId: request.admin?.id || "",
      fields: payload.map((item) => item.settingKey)
    });
    const settings = await siteAdminService.updateSettings(payload, request.admin);
    sendSuccess(response, { message: "Saved successfully", data: settings, settings });
  } catch (error) {
    console.error("[site-settings] admin update failed", {
      adminId: request.admin?.id || "",
      message: error.message
    });
    next(error);
  }
}

async function listSections(request, response, next) {
  try {
    const sections = await siteAdminService.listSections(request.query);
    sendSuccess(response, { data: sections, sections });
  } catch (error) {
    next(error);
  }
}

async function getSection(request, response, next) {
  try {
    const id = parseId(request.params.id);
    const sections = await siteAdminService.listSections({});
    const section = sections.find((item) => item.id === id);
    if (!section) throw new AppError("Site section not found", 404, "SITE_SECTION_NOT_FOUND");
    sendSuccess(response, { data: section, section });
  } catch (error) {
    next(error);
  }
}

async function updateSection(request, response, next) {
  try {
    const id = parseId(request.params.id);
    const payload = parseSiteSectionPatch(request.body);
    const section = await siteAdminService.updateSection(id, payload, request.admin);
    if (!section) throw new AppError("Site section not found", 404, "SITE_SECTION_NOT_FOUND");
    sendSuccess(response, { message: "Site section updated successfully", data: section, section });
  } catch (error) {
    next(error);
  }
}

async function listServices(request, response, next) {
  try {
    const services = await siteAdminService.listServices();
    sendSuccess(response, { data: services, services });
  } catch (error) {
    next(error);
  }
}

async function createService(request, response, next) {
  try {
    const payload = parseServiceCreate(request.body);
    const service = await siteAdminService.createService(payload, request.admin);
    sendSuccess(response, { message: "Service created successfully", data: service, service }, 201);
  } catch (error) {
    next(error);
  }
}

async function updateService(request, response, next) {
  try {
    const id = parseId(request.params.id);
    const payload = parseServicePatch(request.body);
    const service = await siteAdminService.updateService(id, payload, request.admin);
    if (!service) throw new AppError("Service not found", 404, "SERVICE_NOT_FOUND");
    sendSuccess(response, { message: "Service updated successfully", data: service, service });
  } catch (error) {
    next(error);
  }
}

async function listNavigation(request, response, next) {
  try {
    const navigation = await siteAdminService.listNavigation(request.query);
    sendSuccess(response, { data: navigation, navigation });
  } catch (error) {
    next(error);
  }
}

async function createNavigation(request, response, next) {
  try {
    const payload = parseNavigationCreate(request.body);
    const navigationItem = await siteAdminService.createNavigation(payload, request.admin);
    sendSuccess(response, { message: "Navigation item created successfully", data: navigationItem, navigationItem }, 201);
  } catch (error) {
    next(error);
  }
}

async function updateNavigation(request, response, next) {
  try {
    const id = parseId(request.params.id);
    const payload = parseNavigationPatch(request.body);
    const navigationItem = await siteAdminService.updateNavigation(id, payload, request.admin);
    if (!navigationItem) throw new AppError("Navigation item not found", 404, "NAVIGATION_NOT_FOUND");
    sendSuccess(response, { message: "Navigation updated successfully", data: navigationItem, navigationItem });
  } catch (error) {
    next(error);
  }
}

async function listContentBlocks(request, response, next) {
  try {
    const contentBlocks = await siteAdminService.listContentBlocks();
    sendSuccess(response, { data: contentBlocks, contentBlocks });
  } catch (error) {
    next(error);
  }
}

async function updateContentBlock(request, response, next) {
  try {
    const id = parseId(request.params.id);
    const payload = parseContentBlockPatch(request.body);
    const contentBlock = await siteAdminService.updateContentBlock(id, payload, request.admin);
    if (!contentBlock) throw new AppError("Content block not found", 404, "CONTENT_BLOCK_NOT_FOUND");
    sendSuccess(response, { message: "Content block updated successfully", data: contentBlock, contentBlock });
  } catch (error) {
    next(error);
  }
}

async function listMedia(request, response, next) {
  try {
    const media = await siteAdminService.listMedia();
    sendSuccess(response, { data: media, media });
  } catch (error) {
    next(error);
  }
}

async function createMedia(request, response, next) {
  try {
    const payload = parseMediaCreate(request.body);
    const media = await siteAdminService.createMedia(payload, request.admin);
    sendSuccess(response, { message: "Media record created successfully", data: media, media }, 201);
  } catch (error) {
    next(error);
  }
}

async function updateMedia(request, response, next) {
  try {
    const id = parseId(request.params.id);
    const payload = parseMediaPatch(request.body);
    const media = await siteAdminService.updateMedia(id, payload, request.admin);
    if (!media) throw new AppError("Media record not found", 404, "MEDIA_NOT_FOUND");
    sendSuccess(response, { message: "Media record updated successfully", data: media, media });
  } catch (error) {
    next(error);
  }
}

async function listAuditLogs(request, response, next) {
  try {
    const result = await siteAdminService.listAuditLogs(request.query);
    sendSuccess(response, {
      data: result.auditLogs,
      auditLogs: result.auditLogs,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit
      }
    });
  } catch (error) {
    next(error);
  }
}

async function seedDefaults(request, response, next) {
  try {
    const data = await siteAdminService.seedDefaults(request.admin);
    sendSuccess(response, { message: "Default site management data seeded successfully", data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createMedia,
  createNavigation,
  createService,
  getSection,
  listAuditLogs,
  listContentBlocks,
  listMedia,
  listNavigation,
  listSections,
  listServices,
  listSettings,
  overview,
  publicSettings,
  seedDefaults,
  updateContentBlock,
  updateMedia,
  updateNavigation,
  updateSection,
  updateService,
  updateSettings
};
