const express = require("express");
const chatController = require("../controllers/chatController");
const { chatMessageLimiter, chatStartLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post("/chat/start", chatStartLimiter, chatController.startChat);
router.post("/chatbot/answer", chatMessageLimiter, chatController.answerBot);
router.post("/chat/message", chatMessageLimiter, chatController.sendMessage);
router.get("/chat/messages/:chatId", chatController.listMessages);

router.post("/agent-handoff", chatStartLimiter, chatController.startChat);
router.post("/live-chat", chatMessageLimiter, chatController.sendMessage);
router.get("/live-chat/:chatId/messages", chatController.listMessages);

module.exports = router;
