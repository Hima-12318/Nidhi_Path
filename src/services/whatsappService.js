const { env } = require("../config/env");
const { serviceSupabase } = require("../config/supabase");
const mockDb = require("./mockDatabaseService");

function isConfigured() {
  return Boolean(
    env.whatsappAccessToken &&
    env.whatsappPhoneNumberId &&
    env.whatsappAgentNumber &&
    env.whatsappApiVersion
  );
}

function truncate(value, max = 900) {
  const text = String(value || "");
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

function buildEnquiryMessage(enquiry) {
  return [
    "New Nidhi Path Enquiry",
    "",
    `Reference ID: ${enquiry.referenceId}`,
    `Name: ${enquiry.name}`,
    `Phone: ${enquiry.phone}`,
    `Email: ${enquiry.email || "-"}`,
    `Service: ${enquiry.service}`,
    `Message: ${truncate(enquiry.message, 700)}`,
    `Source: ${enquiry.sourcePage || "-"}`,
    "",
    "Open admin dashboard for details."
  ].join("\n");
}

function buildChatStartMessage(chatSession, enquiry) {
  return [
    "New Live Chat Request",
    "",
    `Chat ID: ${chatSession.chatId}`,
    `Enquiry ID: ${enquiry.referenceId}`,
    `Name: ${chatSession.customerName}`,
    `Phone: ${chatSession.customerPhone}`,
    `Service: ${chatSession.service || "-"}`,
    `Message: ${truncate(chatSession.initialMessage, 700)}`,
    "",
    "Open admin dashboard to reply."
  ].join("\n");
}

function buildChatMessageAlert(chatSession, message) {
  return [
    "New Website Chat Message",
    "",
    `Chat ID: ${chatSession.chatId}`,
    `Name: ${chatSession.customerName}`,
    `Phone: ${chatSession.customerPhone}`,
    `Message: ${truncate(message.message, 700)}`,
    "",
    "Open admin dashboard to reply."
  ].join("\n");
}

async function sendPlainText(text) {
  if (!isConfigured()) {
    return {
      status: "not_configured",
      whatsappMessageId: "",
      errorMessage: "WhatsApp Business Cloud API variables are not configured."
    };
  }

  const url = `https://graph.facebook.com/${env.whatsappApiVersion}/${env.whatsappPhoneNumberId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to: env.whatsappAgentNumber,
    type: "text",
    text: {
      preview_url: false,
      body: text
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.whatsappAccessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        status: "failed",
        whatsappMessageId: "",
        errorMessage: data?.error?.message || `WhatsApp API failed with status ${response.status}`
      };
    }

    return {
      status: "sent",
      whatsappMessageId: data?.messages?.[0]?.id || "",
      errorMessage: ""
    };
  } catch (error) {
    return {
      status: "failed",
      whatsappMessageId: "",
      errorMessage: error.message
    };
  }
}

async function logWhatsAppResult({
  eventType,
  relatedTable = "",
  relatedId = null,
  recipientNumber = env.whatsappAgentNumber || "",
  messagePreview = "",
  result
}) {
  const payload = {
    event_type: eventType,
    related_table: relatedTable,
    related_id: relatedId,
    recipient_number: recipientNumber,
    message_preview: truncate(messagePreview, 500),
    whatsapp_message_id: result.whatsappMessageId || "",
    status: result.status,
    error_message: result.errorMessage || ""
  };

  if (env.mockDatabaseMode) {
    return mockDb.createRecord("whatsappLogs", {
      eventType,
      relatedTable,
      relatedId,
      recipientNumber,
      messagePreview: truncate(messagePreview, 500),
      whatsappMessageId: result.whatsappMessageId || "",
      status: result.status,
      errorMessage: result.errorMessage || ""
    });
  }

  const { data, error } = await serviceSupabase
    .from("whatsapp_logs")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    console.error("Failed to write WhatsApp log:", error.message);
    return null;
  }

  return data;
}

async function sendAndLog({ eventType, relatedTable, relatedId, messagePreview }) {
  const result = await sendPlainText(messagePreview);
  await logWhatsAppResult({
    eventType,
    relatedTable,
    relatedId,
    messagePreview,
    result
  });

  if (result.status !== "sent") {
    console.log(`WhatsApp ${eventType}: ${result.status}${result.errorMessage ? ` (${result.errorMessage})` : ""}`);
  }

  return result.status;
}

async function sendEnquiryAlert(enquiry) {
  return sendAndLog({
    eventType: "enquiry_alert",
    relatedTable: "enquiries",
    relatedId: enquiry.id,
    messagePreview: buildEnquiryMessage(enquiry)
  });
}

async function sendChatStartAlert(chatSession, enquiry) {
  return sendAndLog({
    eventType: "chat_start_alert",
    relatedTable: "chat_sessions",
    relatedId: chatSession.id,
    messagePreview: buildChatStartMessage(chatSession, enquiry)
  });
}

async function sendChatMessageAlert(chatSession, message) {
  return sendAndLog({
    eventType: "chat_message_alert",
    relatedTable: "chat_sessions",
    relatedId: chatSession.id,
    messagePreview: buildChatMessageAlert(chatSession, message)
  });
}

module.exports = {
  isConfigured,
  logWhatsAppResult,
  sendChatMessageAlert,
  sendChatStartAlert,
  sendEnquiryAlert
};
