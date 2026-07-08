const express = require("express");
const userController = require("../controllers/userController");
const { requireUser } = require("../middleware/userAuthMiddleware");
const { authLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post("/user/signup", authLimiter, userController.signup);
router.post("/user/login", authLimiter, userController.login);
router.post("/user/logout", userController.logout);

router.use("/user", requireUser);
router.get("/user/me", userController.me);
router.get("/user/dashboard", userController.dashboard);
router.get("/user/application", userController.application);
router.get("/user/application/updates", userController.updates);
router.post("/user/application/updates", userController.addUpdate);

module.exports = router;
