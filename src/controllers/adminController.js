const { AppError } = require("../middleware/errorMiddleware");
const { sendSuccess } = require("../utils/responseUtils");
const adminService = require("../services/adminService");
const enquiryService = require("../services/enquiryService");
const chatService = require("../services/chatService");
const activityLogService = require("../services/activityLogService");
const {
  parseAdminLoginPayload,
  parseAdminReplyPayload,
  parseChatUpdatePayload,
  parseEnquiryUpdatePayload
} = require("../services/validationService");

async function login(request, response, next) {
  try {
    const payload = parseAdminLoginPayload(request.body);
    const { token, profile } = await adminService.loginAdmin(payload);
    sendSuccess(response, {
      message: "Login successful",
      token,
      user: profile,
      admin: profile,
      redirectTo: "admin-dashboard.html"
    });
  } catch (error) {
    next(error);
  }
}

function me(request, response) {
  sendSuccess(response, {
    user: request.admin,
    admin: request.admin
  });
}

async function dashboard(request, response, next) {
  try {
    const data = await adminService.getDashboard();
    sendSuccess(response, data);
  } catch (error) {
    next(error);
  }
}

async function listEnquiries(request, response, next) {
  try {
    const result = await enquiryService.listEnquiries(request.query);
    sendSuccess(response, {
      enquiries: result.enquiries,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getEnquiry(request, response, next) {
  try {
    const enquiry = await enquiryService.findEnquiryByIdOrReference(request.params.id);
    if (!enquiry) {
      throw new AppError("Enquiry not found", 404, "ENQUIRY_NOT_FOUND");
    }
    sendSuccess(response, { enquiry });
  } catch (error) {
    next(error);
  }
}

async function updateEnquiry(request, response, next) {
  try {
    const payload = parseEnquiryUpdatePayload(request.body);
    const enquiry = await enquiryService.updateEnquiry(request.params.id, payload);
    if (!enquiry) {
      throw new AppError("Enquiry not found", 404, "ENQUIRY_NOT_FOUND");
    }
    await activityLogService.createActivityLog({
      userId: request.admin.id,
      action: "update_enquiry",
      module: "enquiries",
      recordId: enquiry.id,
      details: payload
    });
    sendSuccess(response, {
      message: "Enquiry updated successfully",
      enquiry
    });
  } catch (error) {
    next(error);
  }
}

async function listChats(request, response, next) {
  try {
    const result = await chatService.listChats(request.query);
    sendSuccess(response, {
      chats: result.chats,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getChat(request, response, next) {
  try {
    const chat = await chatService.findChatByReference(request.params.chatId);
    if (!chat) {
      throw new AppError("Chat not found", 404, "CHAT_NOT_FOUND");
    }
    sendSuccess(response, { chat });
  } catch (error) {
    next(error);
  }
}

async function getChatMessages(request, response, next) {
  try {
    const chat = await chatService.findChatByReference(request.params.chatId);
    if (!chat) {
      throw new AppError("Chat not found", 404, "CHAT_NOT_FOUND");
    }
    const messages = await chatService.listMessages(request.params.chatId);
    sendSuccess(response, {
      chatId: chat.chatId,
      messages
    });
  } catch (error) {
    next(error);
  }
}

async function replyToChat(request, response, next) {
  try {
    const payload = parseAdminReplyPayload(request.body);
    const chat = await chatService.findChatByReference(request.params.chatId);
    if (!chat) {
      throw new AppError("Chat not found", 404, "CHAT_NOT_FOUND");
    }
    if (chat.status === "closed") {
      throw new AppError("Closed chat cannot accept new replies. Reopen the chat before replying.", 409, "CHAT_CLOSED");
    }
    const message = await chatService.createMessage(chat, {
      senderType: "agent",
      senderId: request.admin.id,
      message: payload.message
    });
    const updatedChat = ["open", "waiting_for_agent", "customer_waiting", "live_agent_requested"].includes(chat.status)
      ? await chatService.updateChat(chat.chatId, { status: "agent_joined" })
      : chat;
    await activityLogService.createActivityLog({
      userId: request.admin.id,
      action: "reply_chat",
      module: "chat_sessions",
      recordId: chat.id,
      details: { messageId: message.id }
    });
    sendSuccess(response, {
      message: "Reply sent successfully",
      chat: updatedChat,
      chatMessage: message
    }, 201);
  } catch (error) {
    next(error);
  }
}

async function updateChat(request, response, next) {
  try {
    const payload = parseChatUpdatePayload(request.body);
    const chat = await chatService.updateChat(request.params.chatId, payload);
    if (!chat) {
      throw new AppError("Chat not found", 404, "CHAT_NOT_FOUND");
    }
    await activityLogService.createActivityLog({
      userId: request.admin.id,
      action: "update_chat",
      module: "chat_sessions",
      recordId: chat.id,
      details: payload
    });
    sendSuccess(response, {
      message: "Chat updated successfully",
      chat
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  dashboard,
  getChat,
  getChatMessages,
  getEnquiry,
  listChats,
  listEnquiries,
  login,
  me,
  replyToChat,
  updateChat,
  updateEnquiry
};
