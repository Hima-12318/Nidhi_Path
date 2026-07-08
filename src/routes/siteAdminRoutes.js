const express = require("express");
const siteAdminController = require("../controllers/siteAdminController");
const { requireAdmin, requireRoles } = require("../middleware/authMiddleware");
const { adminLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();
const canEditSite = requireRoles("super_admin", "admin", "ceo");

router.get("/site/settings", siteAdminController.publicSettings);

router.use("/admin/site", adminLimiter, requireAdmin);

router.get("/admin/site/overview", siteAdminController.overview);
router.post("/admin/site/seed-defaults", requireRoles("super_admin"), siteAdminController.seedDefaults);

router.get("/admin/site/settings", siteAdminController.listSettings);
router.patch("/admin/site/settings", canEditSite, siteAdminController.updateSettings);

router.get("/admin/site/sections", siteAdminController.listSections);
router.get("/admin/site/sections/:id", siteAdminController.getSection);
router.patch("/admin/site/sections/:id", canEditSite, siteAdminController.updateSection);

router.get("/admin/site/services", siteAdminController.listServices);
router.post("/admin/site/services", canEditSite, siteAdminController.createService);
router.patch("/admin/site/services/:id", canEditSite, siteAdminController.updateService);

router.get("/admin/site/navigation", siteAdminController.listNavigation);
router.post("/admin/site/navigation", canEditSite, siteAdminController.createNavigation);
router.patch("/admin/site/navigation/:id", canEditSite, siteAdminController.updateNavigation);

router.get("/admin/site/media", siteAdminController.listMedia);
router.post("/admin/site/media", canEditSite, siteAdminController.createMedia);
router.patch("/admin/site/media/:id", canEditSite, siteAdminController.updateMedia);

router.get("/admin/site/content-blocks", siteAdminController.listContentBlocks);
router.patch("/admin/site/content-blocks/:id", canEditSite, siteAdminController.updateContentBlock);

router.get("/admin/site/audit-logs", canEditSite, siteAdminController.listAuditLogs);

module.exports = router;
