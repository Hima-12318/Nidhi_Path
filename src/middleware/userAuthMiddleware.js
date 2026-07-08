const userService = require("../services/userService");

async function requireUser(request, response, next) {
  try {
    const header = request.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
    request.userProfile = await userService.verifyUserToken(token);
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  requireUser
};
