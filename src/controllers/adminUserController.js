const { AppError } = require("../middleware/errorMiddleware");
const { sendSuccess } = require("../utils/responseUtils");
const crmService = require("../services/crmService");
const { parseUserStatusPatch } = require("../services/crmValidationService");

async function listUsers(request, response, next) {
  try {
    const result = await crmService.listUsers(request.query);
    sendSuccess(response, {
      users: result.users,
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

async function getUser(request, response, next) {
  try {
    const user = await crmService.findUserProfileById(request.params.id);
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
    const application = await crmService.findApplicationByUserProfileId(user.id);
    sendSuccess(response, { user, application });
  } catch (error) {
    next(error);
  }
}

async function updateUser(request, response, next) {
  try {
    crmService.assertCanEditCrm(request.admin);
    const payload = parseUserStatusPatch(request.body);
    const user = await crmService.updateUserProfileStatus(request.params.id, payload, request.admin);
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
    const application = await crmService.findApplicationByUserProfileId(user.id);
    sendSuccess(response, {
      message: "User updated successfully",
      user,
      application
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUser,
  listUsers,
  updateUser
};
