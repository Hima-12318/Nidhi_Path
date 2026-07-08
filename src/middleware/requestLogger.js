const morgan = require("morgan");
const { env } = require("../config/env");

const requestLogger = env.nodeEnv === "test"
  ? (request, response, next) => next()
  : morgan(env.nodeEnv === "production" ? "combined" : "dev");

module.exports = { requestLogger };
