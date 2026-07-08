const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const { env } = require("./config/env");
const { requestLogger } = require("./middleware/requestLogger");
const { errorHandler, notFoundHandler } = require("./middleware/errorMiddleware");
const healthRoutes = require("./routes/healthRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const chatRoutes = require("./routes/chatRoutes");
const siteAdminRoutes = require("./routes/siteAdminRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const crmRoutes = require("./routes/crmRoutes");
const smartCrmRoutes = require("./routes/smartCrmRoutes");

const app = express();
const frontendDirectory = path.resolve(__dirname, "../../frontend");
const indexPath = path.join(frontendDirectory, "index.html");
const scriptPath = path.join(frontendDirectory, "script.js");
const stylePath = path.join(frontendDirectory, "style.css");

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin(origin, callback) {
    const isLocalDevelopmentOrigin = env.nodeEnv === "development"
      && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "");

    if (!origin || env.allowedOrigins.includes(origin) || isLocalDevelopmentOrigin) {
      callback(null, true);
      return;
    }
    callback(new Error("CORS origin not allowed"));
  },
  credentials: true
}));

app.use(requestLogger);

if (env.nodeEnv === "development") {
  app.use((request, response, next) => {
    response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Expires", "0");
    next();
  });
}

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/api", healthRoutes, enquiryRoutes, chatRoutes, userRoutes, siteAdminRoutes, adminUserRoutes, crmRoutes, smartCrmRoutes, adminRoutes);
app.use("/api", notFoundHandler);

app.get("/favicon.ico", (request, response) => {
  response.sendFile(path.join(frontendDirectory, "logo.jpg"));
});

app.get("/", (request, response) => {
  response.sendFile(indexPath);
});

app.use(express.static(frontendDirectory, {
  extensions: ["html"],
  maxAge: env.nodeEnv === "production" ? "1h" : 0
}));

app.use((request, response) => {
  response.status(404).sendFile(indexPath);
});

app.use(errorHandler);

module.exports = {
  app,
  frontendDirectory,
  indexPath,
  scriptPath,
  stylePath
};
