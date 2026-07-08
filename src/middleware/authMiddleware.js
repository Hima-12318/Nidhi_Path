const adminService = require("../services/adminService");
const { AppError } = require("./errorMiddleware");

async function requireAdmin(request, response, next) {
  try {
    const header = request.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
    request.admin = await adminService.verifyAdminToken(token);
    return next();
  } catch (error) {
    return next(error);
  }
}

function requireRoles(...roles) {
  return (request, response, next) => {
    if (!request.admin || !roles.includes(request.admin.role)) {
      return next(new AppError("Unauthorized role", 403, "UNAUTHORIZED_ROLE"));
    }
    return next();
  };
}

module.exports = {
  requireAdmin,
  requireRoles
};
