const rateLimit = require("express-rate-limit");
const { env } = require("../config/env");

function limiter(max, message = "Too many requests. Please wait a moment and try again.") {
  return rateLimit({
    windowMs: env.rateLimitWindowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler(request, response) {
      console.warn(`Rate limit hit: ${request.method} ${request.originalUrl} ${request.ip}`);
      response.status(429).json({
        success: false,
        message
      });
    }
  });
}

const generalApiLimiter = limiter(env.rateLimitMaxPublic);
const enquiryLimiter = limiter(env.rateLimitMaxPublic);
const chatStartLimiter = limiter(env.rateLimitMaxPublic);
const chatMessageLimiter = limiter(env.rateLimitMaxPublic);
const authLimiter = limiter(env.rateLimitMaxAuth);
const adminLoginLimiter = authLimiter;
const adminLimiter = limiter(env.rateLimitMaxAdmin);

module.exports = {
  generalApiLimiter,
  enquiryLimiter,
  chatStartLimiter,
  chatMessageLimiter,
  authLimiter,
  adminLoginLimiter,
  adminLimiter
};
