const express = require("express");
const adminUserController = require("../controllers/adminUserController");
const smartCrmController = require("../controllers/smartCrmController");
const { requireAdmin, requireRoles } = require("../middleware/authMiddleware");
const { adminLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.use("/admin/users", adminLimiter, requireAdmin);
router.post("/admin/users", requireRoles("super_admin", "admin", "ceo"), smartCrmController.createUser);
router.post("/admin/users/create", requireRoles("super_admin", "admin", "ceo"), smartCrmController.createUser);
router.get("/admin/users", adminUserController.listUsers);
router.get("/admin/users/:id", adminUserController.getUser);
router.patch("/admin/users/:id", requireRoles("super_admin", "admin", "ceo"), adminUserController.updateUser);

module.exports = router;
