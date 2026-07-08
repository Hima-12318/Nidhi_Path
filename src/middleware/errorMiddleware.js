const { ZodError } = require("zod");
const { env } = require("../config/env");

class AppError extends Error {
  constructor(message, statusCode = 400, code = "") {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

function notFoundHandler(request, response, next) {
  next(new AppError("Route not found", 404, "NOT_FOUND"));
}

function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];
    return response.status(400).json({
      success: false,
      message: firstIssue?.message || "Invalid request data",
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  const statusCode = error.statusCode || 500;
  const payload = {
    success: false,
    message: statusCode >= 500 ? "Something went wrong. Please try again." : error.message
  };
  payload.error = payload.message;

  if (error.code) {
    payload.code = error.code;
  }

  if (env.nodeEnv !== "production" && statusCode >= 500) {
    payload.debug = error.message;
  }

  response.status(statusCode).json(payload);
}

module.exports = {
  AppError,
  notFoundHandler,
  errorHandler
};
