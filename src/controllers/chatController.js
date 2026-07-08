const { AppError } = require("../middleware/errorMiddleware");
const { parseChatMessagePayload, parseChatStartPayload } = require("../services/validationService");
const enquiryService = require("../services/enquiryService");
const chatService = require("../services/chatService");
const chatbotService = require("../services/chatbotService");
const whatsappService = require("../services/whatsappService");
const { sendSuccess } = require("../utils/responseUtils");

async function startChat(request, response, next) {
  try {
    const payload = parseChatStartPayload(request.body);
    const enquiry = await enquiryService.createEnquiry(payload);
    const chatSession = await chatService.createChatSession(enquiry, payload);
    const firstMessage = await chatService.createMessage(chatSession, {
      senderType: "customer",
      message: payload.message
    });
    if (!chatSession.reused) {
      await chatService.createMessage(chatSession, {
        senderType: "system",
        message: "Chat started. An agent will reply shortly."
      });
    }
    const whatsappStatus = await whatsappService.sendChatStartAlert(chatSession, enquiry);
    await enquiryService.updateEnquiryWhatsAppStatus(enquiry.id, whatsappStatus);

    sendSuccess(response, {
      chatId: chatSession.chatId,
      enquiryId: enquiry.referenceId,
      message: "Chat started successfully",
      whatsappStatus,
      chat: chatSession,
      firstMessage
    }, 201);
  } catch (error) {
    next(error);
  }
}

async function sendMessage(request, response, next) {
  try {
    const payload = parseChatMessagePayload(request.body);
    const chatSession = await chatService.findChatByReference(payload.chatId);
    if (!chatSession) {
      throw new AppError("Chat session not found", 404, "CHAT_NOT_FOUND");
    }

    const message = await chatService.createMessage(chatSession, {
      senderType: "customer",
      message: payload.message
    });
    await whatsappService.sendChatMessageAlert(chatSession, message);

    sendSuccess(response, {
      message: "Message sent successfully",
      chatId: chatSession.chatId,
      chatMessage: message
    }, 201);
  } catch (error) {
    next(error);
  }
}

async function answerBot(request, response, next) {
  try {
    const result = chatbotService.answerQuestion({
      message: request.body?.message,
      selectedCategory: request.body?.selectedCategory || request.body?.category || "",
      botAnswerCount: Number(request.body?.botAnswerCount || 0)
    });
    sendSuccess(response, result);
  } catch (error) {
    next(error);
  }
}

async function listMessages(request, response, next) {
  try {
    const chatId = request.params.chatId;
    const chatSession = await chatService.findChatByReference(chatId);
    if (!chatSession) {
      sendSuccess(response, {
        chatId,
        messages: []
      });
      return;
    }

    const messages = await chatService.listMessages(chatId);
    sendSuccess(response, {
      chatId: chatSession.chatId,
      messages
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listMessages,
  answerBot,
  sendMessage,
  startChat
};
