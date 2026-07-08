const express = require("express");
const crmController = require("../controllers/crmController");
const { requireAdmin, requireRoles } = require("../middleware/authMiddleware");
const { adminLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.use("/admin/crm", adminLimiter, requireAdmin);
router.get("/admin/crm/stats", crmController.stats);
router.get("/admin/crm/applications", crmController.listApplications);
router.get("/admin/crm/applications/:id", crmController.getApplication);
router.patch("/admin/crm/applications/:id", requireRoles("super_admin", "admin", "ceo"), crmController.updateApplication);
router.post("/admin/crm/applications/:id/work-started", requireRoles("super_admin", "admin", "ceo"), crmController.markWorkStarted);
router.get("/admin/crm/applications/:id/updates", crmController.listUpdates);
router.post("/admin/crm/applications/:id/updates", requireRoles("super_admin", "admin", "ceo"), crmController.addUpdate);

router.use("/crm", adminLimiter, requireAdmin);
router.get("/crm/:id/updates", crmController.listUpdates);
router.post("/crm/:id/updates", requireRoles("super_admin", "admin", "ceo"), crmController.addUpdate);

router.use("/applications", adminLimiter, requireAdmin);
router.get("/applications/:id", crmController.getApplication);
router.put("/applications/:id", requireRoles("super_admin", "admin", "ceo"), crmController.updateApplication);
router.patch("/applications/:id/work-started", requireRoles("super_admin", "admin", "ceo"), crmController.markWorkStarted);

module.exports = router;
