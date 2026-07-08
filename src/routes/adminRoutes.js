const express = require("express");
const adminController = require("../controllers/adminController");
const { requireAdmin, requireRoles } = require("../middleware/authMiddleware");
const { adminLimiter, adminLoginLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post("/admin/login", adminLoginLimiter, adminController.login);

router.use("/admin", adminLimiter, requireAdmin);
router.get("/admin/me", adminController.me);
router.get("/admin/dashboard", requireRoles("super_admin", "admin", "ceo", "board", "board_member"), adminController.dashboard);
router.get("/admin/enquiries", adminController.listEnquiries);
router.get("/admin/enquiries/:id", adminController.getEnquiry);
router.patch("/admin/enquiries/:id", requireRoles("super_admin", "admin", "ceo"), adminController.updateEnquiry);
router.get("/admin/chats", adminController.listChats);
router.get("/admin/chats/:chatId", adminController.getChat);
router.get("/admin/chats/:chatId/messages", adminController.getChatMessages);
router.post("/admin/chats/:chatId/reply", requireRoles("super_admin", "admin", "ceo"), adminController.replyToChat);
router.patch("/admin/chats/:chatId", requireRoles("super_admin", "admin", "ceo"), adminController.updateChat);

module.exports = router;
