const { AppError } = require("../middleware/errorMiddleware");
const { sendSuccess } = require("../utils/responseUtils");
const smartCrmService = require("../services/smartCrmService");
const { parseCrmUpdate } = require("../services/crmValidationService");
const {
  parseAdminCreateUserPayload,
  parseDailyUpdatePayload,
  parseEmployeeApplicationPatch
} = require("../services/smartCrmValidationService");

async function createUser(request, response, next) {
  try {
    const payload = parseAdminCreateUserPayload(request.body);
    const result = await smartCrmService.createSmartCrmUser(request.admin, payload);
    sendSuccess(response, {
      message: "User created successfully",
      user: result.profile,
      profile: result.profile,
      referencePartner: result.referencePartner,
      redirectTo: result.redirectTo
    }, 201);
  } catch (error) {
    next(error);
  }
}

async function createStudent(request, response, next) {
  try {
    const payload = parseAdminCreateUserPayload({
      ...request.body,
      userType: "student"
    });
    const result = await smartCrmService.createSmartCrmUser(request.admin, payload);
    sendSuccess(response, {
      message: "Student created successfully",
      user: result.profile,
      profile: result.profile,
      application: result.application,
      referencePartner: result.referencePartner
    }, 201);
  } catch (error) {
    next(error);
  }
}

async function listAdminClients(request, response, next) {
  try {
    const result = await smartCrmService.listAdminClients(request.query);
    sendSuccess(response, {
      clients: result.clients,
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

async function adminClientDashboard(request, response, next) {
  try {
    const data = await smartCrmService.getAdminClientDashboard(request.params.id);
    sendSuccess(response, data);
  } catch (error) {
    next(error);
  }
}

async function reportsOverview(request, response, next) {
  try {
    const data = await smartCrmService.getReportsOverview(request.admin);
    sendSuccess(response, data);
  } catch (error) {
    next(error);
  }
}

async function employeePerformance(request, response, next) {
  try {
    const data = await smartCrmService.getReportsOverview(request.admin);
    sendSuccess(response, {
      employeePerformance: data.employeePerformance,
      dailyUpdateCompliance: data.dailyUpdateCompliance
    });
  } catch (error) {
    next(error);
  }
}

async function employeePerformanceHistory(request, response, next) {
  try {
    const report = await smartCrmService.getEmployeePerformanceReport(request.admin, request.query);
    sendSuccess(response, { report });
  } catch (error) {
    next(error);
  }
}

async function businessReport(request, response, next) {
  try {
    const data = await smartCrmService.getReportsOverview(request.admin);
    sendSuccess(response, {
      stats: data.stats,
      revenueSnapshot: data.revenueSnapshot,
      weeklyBusinessTrend: data.weeklyBusinessTrend,
      leadFunnel: data.leadFunnel
    });
  } catch (error) {
    next(error);
  }
}

async function commissionsReport(request, response, next) {
  try {
    const data = await smartCrmService.getReportsOverview(request.admin);
    sendSuccess(response, {
      commissionAnalytics: data.commissionAnalytics
    });
  } catch (error) {
    next(error);
  }
}

async function sourcePerformance(request, response, next) {
  try {
    const data = await smartCrmService.getReportsOverview(request.admin);
    sendSuccess(response, {
      sourcePerformance: data.sourcePerformance
    });
  } catch (error) {
    next(error);
  }
}

async function studentDashboard(request, response, next) {
  try {
    const data = await smartCrmService.getStudentDashboard(request.userProfile);
    sendSuccess(response, data);
  } catch (error) {
    next(error);
  }
}

async function employeeDashboard(request, response, next) {
  try {
    const data = await smartCrmService.getEmployeeDashboard(request.userProfile);
    sendSuccess(response, data);
  } catch (error) {
    next(error);
  }
}

async function employeeApplications(request, response, next) {
  try {
    const data = await smartCrmService.getEmployeeDashboard(request.userProfile);
    sendSuccess(response, {
      applications: data.applications,
      stats: data.stats
    });
  } catch (error) {
    next(error);
  }
}

async function employeeApplicationDetail(request, response, next) {
  try {
    const data = await smartCrmService.getEmployeeDashboard(request.userProfile);
    const application = data.applications.find((item) => item.id === request.params.id || item.applicationId === request.params.id);
    if (!application) throw new AppError("Application not found", 404, "APPLICATION_NOT_FOUND");
    sendSuccess(response, { application });
  } catch (error) {
    next(error);
  }
}

async function updateEmployeeApplication(request, response, next) {
  try {
    const payload = parseEmployeeApplicationPatch(request.body);
    const application = await smartCrmService.updateAssignedApplication(request.userProfile, request.params.id, payload);
    sendSuccess(response, {
      message: "Application updated successfully",
      application
    });
  } catch (error) {
    next(error);
  }
}

async function addEmployeeApplicationUpdate(request, response, next) {
  try {
    const payload = parseCrmUpdate(request.body);
    const update = await smartCrmService.addEmployeeApplicationUpdate(request.userProfile, request.params.id, payload);
    sendSuccess(response, {
      message: "Update posted successfully",
      update
    }, 201);
  } catch (error) {
    next(error);
  }
}

async function submitDailyUpdate(request, response, next) {
  try {
    const payload = parseDailyUpdatePayload(request.body);
    const dailyUpdate = await smartCrmService.submitDailyUpdate(request.userProfile, payload);
    sendSuccess(response, {
      message: "Daily work update submitted successfully",
      dailyUpdate
    }, 201);
  } catch (error) {
    next(error);
  }
}

async function myDailyUpdates(request, response, next) {
  try {
    smartCrmService.assertUserRole(request.userProfile, ["employee"]);
    const dailyUpdates = await smartCrmService.listDailyUpdatesRaw({
      employeeId: request.userProfile.id,
      limit: request.query.limit || 30
    });
    sendSuccess(response, { dailyUpdates });
  } catch (error) {
    next(error);
  }
}

async function clientDashboard(request, response, next) {
  try {
    const data = await smartCrmService.getClientDashboard(request.userProfile);
    sendSuccess(response, data);
  } catch (error) {
    next(error);
  }
}

async function clientReferences(request, response, next) {
  try {
    const data = await smartCrmService.getClientDashboard(request.userProfile);
    sendSuccess(response, {
      applications: data.applications,
      summary: data.summary,
      commissionVisible: data.commissionVisible
    });
  } catch (error) {
    next(error);
  }
}

async function clientReferenceDetail(request, response, next) {
  try {
    const data = await smartCrmService.getClientDashboard(request.userProfile);
    const application = data.applications.find((item) => item.id === request.params.id || item.applicationId === request.params.id);
    if (!application) throw new AppError("Reference not found", 404, "REFERENCE_NOT_FOUND");
    sendSuccess(response, {
      application,
      commissionVisible: data.commissionVisible
    });
  } catch (error) {
    next(error);
  }
}

async function clientCommissions(request, response, next) {
  try {
    const data = await smartCrmService.getClientDashboard(request.userProfile);
    sendSuccess(response, {
      commissionVisible: data.commissionVisible,
      summary: {
        commissionDue: data.summary.commissionDue,
        commissionPaid: data.summary.commissionPaid,
        totalCommissionValue: data.summary.totalCommissionValue
      },
      applications: data.applications
        .filter((item) => item.commissionVisible)
        .map((item) => ({
          id: item.id,
          applicationId: item.applicationId,
          name: item.name,
          commissionPercentage: item.commissionPercentage,
          commissionAmount: item.commissionAmount,
          commissionStatus: item.commissionStatus,
          commissionNotes: item.commissionNotes
        }))
    });
  } catch (error) {
    next(error);
  }
}

async function clientReply(request, response, next) {
  try {
    const update = await smartCrmService.addClientReply(request.userProfile, request.params.id, request.body);
    sendSuccess(response, {
      message: "Reply submitted successfully",
      update
    }, 201);
  } catch (error) {
    next(error);
  }
}

async function boardDashboard(request, response, next) {
  try {
    const data = await smartCrmService.getBoardDashboard(request.userProfile);
    sendSuccess(response, data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  adminClientDashboard,
  boardDashboard,
  businessReport,
  clientCommissions,
  clientDashboard,
  clientReply,
  clientReferenceDetail,
  clientReferences,
  commissionsReport,
  createStudent,
  createUser,
  employeeApplicationDetail,
  addEmployeeApplicationUpdate,
  employeeApplications,
  employeeDashboard,
  employeePerformance,
  employeePerformanceHistory,
  listAdminClients,
  myDailyUpdates,
  reportsOverview,
  sourcePerformance,
  studentDashboard,
  submitDailyUpdate,
  updateEmployeeApplication
};
