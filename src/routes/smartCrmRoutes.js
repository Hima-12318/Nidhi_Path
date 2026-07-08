const express = require("express");
const smartCrmController = require("../controllers/smartCrmController");
const { requireAdmin, requireRoles } = require("../middleware/authMiddleware");
const { requireUser } = require("../middleware/userAuthMiddleware");
const { adminLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.use("/admin/reports", adminLimiter, requireAdmin);
router.get("/admin/reports/overview", smartCrmController.reportsOverview);
router.get("/admin/reports/employee-performance", smartCrmController.employeePerformance);
router.get("/admin/reports/employee-performance/history", smartCrmController.employeePerformanceHistory);
router.get("/admin/reports/business", smartCrmController.businessReport);
router.get("/admin/reports/commissions", smartCrmController.commissionsReport);
router.get("/admin/reports/source-performance", smartCrmController.sourcePerformance);

router.use("/admin/clients", adminLimiter, requireAdmin);
router.get("/admin/clients", smartCrmController.listAdminClients);
router.get("/admin/clients/:id/dashboard", smartCrmController.adminClientDashboard);

router.use("/admin/students", adminLimiter, requireAdmin);
router.post("/admin/students", requireRoles("super_admin", "admin", "ceo"), smartCrmController.createStudent);

router.use("/student", requireUser);
router.get("/student/dashboard", smartCrmController.studentDashboard);
router.get("/student/application", smartCrmController.studentDashboard);

router.use("/employee", requireUser);
router.get("/employee/dashboard", smartCrmController.employeeDashboard);
router.get("/employee/applications", smartCrmController.employeeApplications);
router.get("/employee/applications/:id", smartCrmController.employeeApplicationDetail);
router.patch("/employee/applications/:id", smartCrmController.updateEmployeeApplication);
router.post("/employee/applications/:id/updates", smartCrmController.addEmployeeApplicationUpdate);
router.post("/employee/daily-updates", smartCrmController.submitDailyUpdate);
router.get("/employee/daily-updates/me", smartCrmController.myDailyUpdates);
router.get("/employee/references", smartCrmController.employeeDashboard);

router.use("/client", requireUser);
router.get("/client/dashboard", smartCrmController.clientDashboard);
router.get("/client/references", smartCrmController.clientReferences);
router.get("/client/references/:id", smartCrmController.clientReferenceDetail);
router.post("/client/references/:id/replies", smartCrmController.clientReply);
router.get("/client/commissions", smartCrmController.clientCommissions);

router.use("/board", requireUser);
router.get("/board/dashboard", smartCrmController.boardDashboard);
router.get("/board/reports", smartCrmController.boardDashboard);
router.get("/board/applications", smartCrmController.boardDashboard);

module.exports = router;
