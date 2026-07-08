const { AppError } = require("../middleware/errorMiddleware");
const { sendSuccess } = require("../utils/responseUtils");
const crmService = require("../services/crmService");
const {
  parseApplicationPatch,
  parseCrmUpdate
} = require("../services/crmValidationService");

async function stats(request, response, next) {
  try {
    const crmStats = await crmService.getStats();
    sendSuccess(response, { stats: crmStats });
  } catch (error) {
    next(error);
  }
}

async function listApplications(request, response, next) {
  try {
    const result = await crmService.listApplications(request.query);
    sendSuccess(response, {
      applications: result.applications,
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

async function getApplication(request, response, next) {
  try {
    const application = await crmService.findApplicationByIdOrApplicationId(request.params.id);
    if (!application) throw new AppError("CRM application not found", 404, "CRM_APPLICATION_NOT_FOUND");
    const user = application.userProfileId
      ? await crmService.findUserProfileById(application.userProfileId)
      : null;
    sendSuccess(response, { application, user });
  } catch (error) {
    next(error);
  }
}

async function updateApplication(request, response, next) {
  try {
    crmService.assertCanEditCrm(request.admin);
    if (process.env.NODE_ENV !== "production") {
      console.log(`CRM update application id: ${request.params.id}`);
      console.log(`CRM update payload keys: ${JSON.stringify(Object.keys(request.body || {}))}`);
    }
    const payload = parseApplicationPatch(request.body);
    if (process.env.NODE_ENV !== "production") {
      console.log(`CRM update mapped keys: ${JSON.stringify(Object.keys(payload).filter((key) => payload[key] !== undefined))}`);
    }
    const application = await crmService.updateApplication(request.params.id, payload, request.admin, "Admin CRM update");
    if (!application) throw new AppError("CRM application not found", 404, "CRM_APPLICATION_NOT_FOUND");
    if (process.env.NODE_ENV !== "production") {
      console.log("CRM update success: yes");
    }
    sendSuccess(response, {
      message: "Successfully Saved",
      application,
      data: application
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.log("CRM update success: no");
      console.log(`CRM update error: ${error.message}`);
    }
    next(error);
  }
}

async function markWorkStarted(request, response, next) {
  try {
    crmService.assertCanEditCrm(request.admin);
    const application = await crmService.markWorkStarted(request.params.id, request.admin);
    if (!application) throw new AppError("CRM application not found", 404, "CRM_APPLICATION_NOT_FOUND");
    sendSuccess(response, {
      message: "Work started successfully",
      application
    });
  } catch (error) {
    next(error);
  }
}

async function listUpdates(request, response, next) {
  try {
    const updates = await crmService.listUpdates(request.params.id, { visibleOnly: false });
    if (!updates) throw new AppError("CRM application not found", 404, "CRM_APPLICATION_NOT_FOUND");
    sendSuccess(response, { updates });
  } catch (error) {
    next(error);
  }
}

async function addUpdate(request, response, next) {
  try {
    crmService.assertCanAddCrmUpdate(request.admin);
    const payload = parseCrmUpdate(request.body);
    const update = await crmService.addUpdate(request.params.id, payload, request.admin);
    if (!update) throw new AppError("CRM application not found", 404, "CRM_APPLICATION_NOT_FOUND");
    sendSuccess(response, {
      message: "CRM update added successfully",
      update
    }, 201);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addUpdate,
  getApplication,
  listApplications,
  listUpdates,
  markWorkStarted,
  stats,
  updateApplication
};
