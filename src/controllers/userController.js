const { sendSuccess } = require("../utils/responseUtils");
const userService = require("../services/userService");
const {
  parseUserLoginPayload,
  parseUserSignupPayload
} = require("../services/userValidationService");
const { parseCrmUpdate } = require("../services/crmValidationService");

async function signup(request, response, next) {
  try {
    const payload = parseUserSignupPayload(request.body);
    const result = await userService.signupUser(payload);
    sendSuccess(response, {
      message: result.message,
      user: result.profile,
      application: result.application
    }, 201);
  } catch (error) {
    next(error);
  }
}

async function login(request, response, next) {
  try {
    const payload = parseUserLoginPayload(request.body);
    const result = await userService.loginUser(payload);
    sendSuccess(response, {
      message: "Login successful",
      token: result.token,
      user: result.profile,
      profile: result.profile,
      application: result.application,
      redirectTo: result.redirectTo,
      adminAccess: result.adminAccess
    });
  } catch (error) {
    next(error);
  }
}

function me(request, response) {
  sendSuccess(response, {
    user: request.userProfile,
    profile: request.userProfile
  });
}

async function dashboard(request, response, next) {
  try {
    const data = await userService.getUserDashboard(request.userProfile);
    sendSuccess(response, data);
  } catch (error) {
    next(error);
  }
}

async function application(request, response, next) {
  try {
    const data = await userService.getUserDashboard(request.userProfile);
    sendSuccess(response, {
      application: data.application
    });
  } catch (error) {
    next(error);
  }
}

async function updates(request, response, next) {
  try {
    const data = await userService.getUserDashboard(request.userProfile);
    sendSuccess(response, {
      updates: data.updates
    });
  } catch (error) {
    next(error);
  }
}

async function addUpdate(request, response, next) {
  try {
    const payload = parseCrmUpdate(request.body);
    const result = await userService.addUserApplicationUpdate(request.userProfile, payload);
    sendSuccess(response, {
      message: "Update submitted successfully",
      application: result.application,
      update: result.update
    }, 201);
  } catch (error) {
    next(error);
  }
}

function logout(request, response) {
  sendSuccess(response, {
    message: "Logged out successfully"
  });
}

module.exports = {
  application,
  addUpdate,
  dashboard,
  login,
  logout,
  me,
  signup,
  updates
};
