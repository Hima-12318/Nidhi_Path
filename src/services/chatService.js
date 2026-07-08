const { env } = require("../config/env");
const { serviceSupabase } = require("../config/supabase");
const { createChatReference } = require("./referenceService");
const { mapChat, mapMessage } = require("./recordMapperService");
const {
  buildCustomerKey,
  normalizeEmail,
  normalizeName,
  normalizePhone,
  samePerson
} = require("./customerIdentityService");
const mockDb = require("./mockDatabaseService");

const ACTIVE_CHAT_STATUSES = ["open", "waiting_for_agent", "customer_waiting", "live_agent_requested", "agent_joined", "agent_replied"];
const RECENT_CLOSED_MS = 24 * 60 * 60 * 1000;

function enrichPayload(payload = {}) {
  return {
    ...payload,
    email: normalizeEmail(payload.email),
    phone: normalizePhone(payload.phone) || payload.phone,
    name: payload.name,
    metadata: {
      ...(payload.metadata || {}),
      customerKey: buildCustomerKey(payload),
      normalizedName: normalizeName(payload.name)
    }
  };
}

function chatIsReusable(chat, payload) {
  if (!samePerson(payload, chat)) return false;
  if (ACTIVE_CHAT_STATUSES.includes(chat.status)) return true;
  const updated = new Date(chat.updatedAt || chat.createdAt || 0).getTime();
  return chat.status === "closed" && Date.now() - updated < RECENT_CLOSED_MS;
}

async function findOrReuseChatSession(payload) {
  console.log("Duplicate check started");
  if (env.mockDatabaseMode) {
    const candidate = mockDb
      .listRecords("chatSessions")
      .map((row) => mapChat(row))
      .filter((chat) => chatIsReusable(chat, payload))
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))[0];
    if (!candidate) {
      console.log("Existing chat reused: no");
      return null;
    }
    const reopened = candidate.status === "closed"
      ? await updateChat(candidate.chatId, { status: "open" })
      : candidate;
    console.log("Existing chat reused: yes");
    return { ...reopened, reused: true };
  }

  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);
  const filters = [];
  if (email) filters.push(`customer_email.eq.${email}`);
  if (phone) {
    filters.push(`customer_phone.eq.${phone}`);
    filters.push(`customer_phone.eq.+91${phone}`);
    filters.push(`customer_phone.eq.91${phone}`);
  }
  if (!filters.length && !normalizeName(payload.name)) {
    console.log("Existing chat reused: no");
    return null;
  }

  let query = serviceSupabase
    .from("chat_sessions")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(20);
  if (filters.length) query = query.or(filters.join(","));

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to check duplicate chat session: ${error.message}`);
  }

  const candidate = (data || []).map(mapChat).find((chat) => chatIsReusable(chat, payload));
  if (!candidate) {
    console.log("Existing chat reused: no");
    return null;
  }
  const reopened = candidate.status === "closed"
    ? await updateChat(candidate.chatId, { status: "open" })
    : candidate;
  console.log("Existing chat reused: yes");
  return { ...reopened, reused: true };
}

async function createChatSession(enquiry, payload) {
  const cleanPayload = enrichPayload(payload);
  const existing = await findOrReuseChatSession(cleanPayload);
  if (existing) return existing;
  const chatId = createChatReference();

  if (env.mockDatabaseMode) {
    const session = mockDb.createRecord("chatSessions", {
      chatId,
      enquiryId: enquiry.id,
      customerName: cleanPayload.name,
      customerPhone: cleanPayload.phone,
      customerEmail: cleanPayload.email || "",
      service: cleanPayload.service,
      initialMessage: cleanPayload.message,
      status: cleanPayload.metadata?.liveAgentRequested ? "live_agent_requested" : "open",
      assignedTo: "",
      serviceCategory: cleanPayload.metadata?.serviceCategory || cleanPayload.service,
      botAnswerCount: Number(cleanPayload.metadata?.botAnswerCount || 0),
      liveAgentRequested: Boolean(cleanPayload.metadata?.liveAgentRequested),
      metadata: cleanPayload.metadata || {}
    });
    return mapChat(session);
  }

  const { data, error } = await serviceSupabase
    .from("chat_sessions")
    .insert({
      chat_reference_id: chatId,
      enquiry_id: enquiry.id,
      customer_name: cleanPayload.name,
      customer_phone: cleanPayload.phone,
      customer_email: cleanPayload.email || null,
      service: cleanPayload.service,
      initial_message: cleanPayload.message,
      status: cleanPayload.metadata?.liveAgentRequested ? "live_agent_requested" : "open",
      service_category: cleanPayload.metadata?.serviceCategory || cleanPayload.service,
      bot_answer_count: Number(cleanPayload.metadata?.botAnswerCount || 0),
      live_agent_requested: Boolean(cleanPayload.metadata?.liveAgentRequested),
      metadata: cleanPayload.metadata || {}
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create chat session: ${error.message}`);
  }

  return mapChat(data);
}

async function findChatByReference(chatId) {
  if (env.mockDatabaseMode) {
    const session = mockDb.findRecord("chatSessions", (item) => item.chatId === chatId || item.id === chatId);
    if (!session) return null;
    const last = mockDb
      .listRecords("chatMessages")
      .filter((message) => message.chatSessionId === session.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    return mapChat(session, last?.message || session.initialMessage || "");
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(chatId);
  const query = serviceSupabase.from("chat_sessions").select("*").limit(1);
  const { data, error } = isUuid
    ? await query.eq("id", chatId).maybeSingle()
    : await query.eq("chat_reference_id", chatId).maybeSingle();

  if (error) {
    throw new Error(`Failed to load chat: ${error.message}`);
  }

  if (!data) return null;
  const messages = await listMessages(data.chat_reference_id);
  return mapChat(data, messages[messages.length - 1]?.message || data.initial_message || "");
}

async function createMessage(chatSession, { senderType, senderId = "", message, messageType = "text", deliveryStatus = "sent" }) {
  const nextStatus = senderType === "customer" ? "customer_waiting" : senderType === "agent" ? "agent_replied" : "";
  if (env.mockDatabaseMode) {
    const record = mockDb.createRecord("chatMessages", {
      chatSessionId: chatSession.id,
      senderType,
      senderId,
      message,
      messageType,
      deliveryStatus
    });
    mockDb.updateRecord("chatSessions", (item) => item.id === chatSession.id, nextStatus ? { status: nextStatus } : {});
    return mapMessage(record);
  }

  const { data, error } = await serviceSupabase
    .from("chat_messages")
    .insert({
      chat_session_id: chatSession.id,
      sender_type: senderType,
      sender_id: senderId || null,
      message,
      message_type: messageType,
      delivery_status: deliveryStatus
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create chat message: ${error.message}`);
  }

  await serviceSupabase
    .from("chat_sessions")
    .update({ updated_at: new Date().toISOString(), ...(nextStatus ? { status: nextStatus } : {}) })
    .eq("id", chatSession.id);

  return mapMessage(data);
}

async function listMessages(chatId) {
  const chatSession = await findChatSessionOnly(chatId);
  if (!chatSession) return [];

  if (env.mockDatabaseMode) {
    return mockDb
      .listRecords("chatMessages")
      .filter((item) => item.chatSessionId === chatSession.id)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(mapMessage);
  }

  const { data, error } = await serviceSupabase
    .from("chat_messages")
    .select("*")
    .eq("chat_session_id", chatSession.id)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to list chat messages: ${error.message}`);
  }

  return (data || []).map(mapMessage);
}

async function findChatSessionOnly(chatId) {
  if (env.mockDatabaseMode) {
    const session = mockDb.findRecord("chatSessions", (item) => item.chatId === chatId || item.id === chatId);
    return session ? mapChat(session) : null;
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(chatId);
  const query = serviceSupabase.from("chat_sessions").select("*").limit(1);
  const { data, error } = isUuid
    ? await query.eq("id", chatId).maybeSingle()
    : await query.eq("chat_reference_id", chatId).maybeSingle();

  if (error) {
    throw new Error(`Failed to load chat: ${error.message}`);
  }

  return mapChat(data);
}

async function listChats(filters = {}) {
  if (env.mockDatabaseMode) {
    let rows = dedupeChats(mockDb.listRecords("chatSessions").map(mapChat));
    if (filters.status) rows = rows.filter((item) => item.status === filters.status);
    if (filters.search) {
      const search = filters.search.toLowerCase();
      rows = rows.filter((item) => [item.chatId, item.customerName, item.customerPhone, item.customerEmail, item.service].some((value) => String(value || "").toLowerCase().includes(search)));
    }
    rows = rows.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    const page = Math.max(Number(filters.page) || 1, 1);
    const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 100);
    const start = (page - 1) * limit;
    return {
      chats: rows.slice(start, start + limit).map((row) => {
        const last = mockDb
          .listRecords("chatMessages")
          .filter((message) => message.chatSessionId === row.id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        return mapChat(row, last?.message || row.initialMessage || "");
      }),
      total: rows.length,
      page,
      limit
    };
  }

  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 100);
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  let query = serviceSupabase.from("chat_sessions").select("*", { count: "exact" });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.search) {
    const search = filters.search.replace(/[%(),]/g, "");
    query = query.or(`chat_reference_id.ilike.%${search}%,customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%,customer_email.ilike.%${search}%`);
  }

  const { data, error, count } = await query
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to list chats: ${error.message}`);
  }

  return {
    chats: await Promise.all(dedupeChats((data || []).map(mapChat)).map(async (row) => {
      const messages = await listMessages(row.chatId);
      return mapChat(row, messages[messages.length - 1]?.message || row.initialMessage || "");
    })),
    total: count || 0,
    page,
    limit
  };
}

function dedupeChats(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = buildCustomerKey(row) || row.chatId || row.id;
    const statusBucket = row.status === "closed" ? "closed" : "active";
    const dedupeKey = `${key}|${statusBucket}`;
    if (seen.has(dedupeKey)) return false;
    seen.add(dedupeKey);
    return true;
  });
}

async function updateChat(chatId, updates) {
  const existing = await findChatSessionOnly(chatId);
  if (!existing) return null;

  if (env.mockDatabaseMode) {
    const record = mockDb.updateRecord(
      "chatSessions",
      (item) => item.id === existing.id,
      {
        ...(updates.status ? { status: updates.status } : {}),
        ...(updates.assignedTo || updates.assigned_to ? { assignedTo: updates.assignedTo || updates.assigned_to } : {}),
        ...(updates.liveAgentRequested !== undefined ? { liveAgentRequested: updates.liveAgentRequested } : {}),
        ...(updates.serviceCategory ? { serviceCategory: updates.serviceCategory } : {}),
        ...(updates.botAnswerCount !== undefined ? { botAnswerCount: updates.botAnswerCount } : {})
      }
    );
    return mapChat(record);
  }

  const payload = {};
  if (updates.status) payload.status = updates.status;
  if (updates.assignedTo || updates.assigned_to) payload.assigned_to = updates.assignedTo || updates.assigned_to;
  if (updates.liveAgentRequested !== undefined) payload.live_agent_requested = updates.liveAgentRequested;
  if (updates.serviceCategory) payload.service_category = updates.serviceCategory;
  if (updates.botAnswerCount !== undefined) payload.bot_answer_count = updates.botAnswerCount;

  const { data, error } = await serviceSupabase
    .from("chat_sessions")
    .update(payload)
    .eq("id", existing.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update chat: ${error.message}`);
  }

  return mapChat(data);
}

module.exports = {
  createChatSession,
  createMessage,
  findOrReuseChatSession,
  findChatByReference,
  findChatSessionOnly,
  listChats,
  listMessages,
  updateChat
};
