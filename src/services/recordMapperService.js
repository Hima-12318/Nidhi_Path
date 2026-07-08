function mapEnquiry(row = {}) {
  if (!row) return null;
  return {
    id: row.id,
    referenceId: row.reference_id || row.referenceId,
    reference: row.reference_id || row.referenceId,
    name: row.name,
    phone: row.phone,
    email: row.email || "",
    service: row.service,
    message: row.message,
    sourcePage: row.source_page || row.sourcePage || "",
    sourceForm: row.source_form || row.sourceForm || "",
    preferredLanguage: row.preferred_language || row.preferredLanguage || "en",
    status: row.status || "new",
    assignedTo: row.assigned_to || row.assignedTo || "",
    whatsappStatus: row.whatsapp_status || row.whatsappStatus || "not_sent",
    createdFrom: row.created_from || row.createdFrom || "website",
    metadata: row.metadata || {},
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt
  };
}

function mapChat(row = {}, lastMessage = "") {
  if (!row) return null;
  return {
    id: row.id,
    chatId: row.chat_reference_id || row.chatId,
    chatReferenceId: row.chat_reference_id || row.chatId,
    enquiryId: row.enquiry_id || row.enquiryId || "",
    name: row.customer_name || row.customerName,
    phone: row.customer_phone || row.customerPhone,
    email: row.customer_email || row.customerEmail || "",
    customerName: row.customer_name || row.customerName,
    customerPhone: row.customer_phone || row.customerPhone,
    customerEmail: row.customer_email || row.customerEmail || "",
    service: row.service || "",
    initialMessage: row.initial_message || row.initialMessage || "",
    status: row.status || "open",
    assignedTo: row.assigned_to || row.assignedTo || "",
    serviceCategory: row.service_category || row.serviceCategory || row.service || "",
    botAnswerCount: row.bot_answer_count ?? row.botAnswerCount ?? row.metadata?.botAnswerCount ?? 0,
    liveAgentRequested: row.live_agent_requested ?? row.liveAgentRequested ?? row.metadata?.liveAgentRequested ?? false,
    metadata: row.metadata || {},
    lastMessage,
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt
  };
}

function mapMessage(row = {}) {
  if (!row) return null;
  const senderType = row.sender_type || row.senderType || row.sender || "system";
  return {
    id: row.id,
    chatSessionId: row.chat_session_id || row.chatSessionId,
    senderType,
    sender: senderType,
    senderId: row.sender_id || row.senderId || "",
    message: row.message,
    messageType: row.message_type || row.messageType || "text",
    deliveryStatus: row.delivery_status || row.deliveryStatus || "sent",
    createdAt: row.created_at || row.createdAt
  };
}

function mapAdminProfile(row = {}) {
  if (!row) return null;
  return {
    id: row.id,
    authUserId: row.auth_user_id || row.authUserId,
    fullName: row.full_name || row.fullName,
    email: row.email,
    phone: row.phone || "",
    role: row.role || "admin",
    status: row.status || "active",
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt
  };
}

module.exports = {
  mapAdminProfile,
  mapChat,
  mapEnquiry,
  mapMessage
};
