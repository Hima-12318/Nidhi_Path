const { env } = require("../config/env");
const { serviceSupabase } = require("../config/supabase");
const { createEnquiryReference } = require("./referenceService");
const { mapEnquiry } = require("./recordMapperService");
const {
  buildCustomerKey,
  normalizeEmail,
  normalizePhone,
  samePerson
} = require("./customerIdentityService");
const crmService = require("./crmService");
const mockDb = require("./mockDatabaseService");

const RECENT_DUPLICATE_MS = 10 * 60 * 1000;

function toSupabaseInsert(payload, referenceId) {
  return {
    reference_id: referenceId,
    name: payload.name,
    phone: normalizePhone(payload.phone) || payload.phone,
    email: normalizeEmail(payload.email) || null,
    service: payload.service,
    message: payload.message,
    source_page: payload.sourcePage || "",
    source_form: payload.sourceForm || "",
    preferred_language: payload.preferredLanguage || "en",
    status: "new",
    whatsapp_status: "not_sent",
    created_from: payload.createdFrom || "website",
    metadata: payload.metadata || {}
  };
}

function logEnquiryInsert(event, details = {}) {
  console.log(`[enquiries] ${event}`, details);
}

function withIdentityMetadata(payload, existingProfile = null, existingApplication = null) {
  return {
    ...payload,
    phone: normalizePhone(payload.phone) || payload.phone,
    email: normalizeEmail(payload.email),
    metadata: {
      ...(payload.metadata || {}),
      customerKey: buildCustomerKey(payload),
      linkedUserProfileId: existingProfile?.id || payload.metadata?.linkedUserProfileId || null,
      linkedApplicationId: existingApplication?.id || payload.metadata?.linkedApplicationId || null
    }
  };
}

function isRecentSameService(enquiry, payload) {
  const created = new Date(enquiry.createdAt || 0).getTime();
  return String(enquiry.service || "") === String(payload.service || "") &&
    Date.now() - created < RECENT_DUPLICATE_MS &&
    samePerson(payload, enquiry);
}

function dedupeEnquiries(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = `${buildCustomerKey(row) || row.referenceId || row.id}|${row.service || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function findRecentDuplicateEnquiry(payload) {
  if (env.mockDatabaseMode) {
    const duplicate = mockDb
      .listRecords("enquiries")
      .map(mapEnquiry)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .find((item) => isRecentSameService(item, payload));
    return duplicate || null;
  }

  const filters = [];
  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);
  if (email) filters.push(`email.eq.${email}`);
  if (phone) {
    filters.push(`phone.eq.${phone}`);
    filters.push(`phone.eq.+91${phone}`);
    filters.push(`phone.eq.91${phone}`);
  }
  if (!filters.length) return null;

  const since = new Date(Date.now() - RECENT_DUPLICATE_MS).toISOString();
  const { data, error } = await serviceSupabase
    .from("enquiries")
    .select("*")
    .gte("created_at", since)
    .eq("service", payload.service)
    .or(filters.join(","))
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(`Failed to check duplicate enquiry: ${error.message}`);
  }
  return (data || []).map(mapEnquiry).find((item) => samePerson(payload, item)) || null;
}

async function createEnquiry(payload) {
  const existingProfile = await crmService.findUserProfileByEmailPhone(payload);
  const existingApplication = existingProfile
    ? await crmService.findApplicationByUserAndService(existingProfile.id, payload.service || "Other")
    : null;
  const enrichedPayload = withIdentityMetadata(payload, existingProfile, existingApplication);
  const recentDuplicate = await findRecentDuplicateEnquiry(enrichedPayload);
  if (recentDuplicate) {
    console.log("Existing enquiry attached: yes");
    return recentDuplicate;
  }
  console.log("Existing enquiry attached: no");
  const referenceId = createEnquiryReference();

  if (env.mockDatabaseMode) {
    logEnquiryInsert("mock insert started", {
      referenceId,
      payloadKeys: Object.keys(enrichedPayload || {})
    });
    const record = mockDb.createRecord("enquiries", {
      referenceId,
      name: enrichedPayload.name,
      phone: enrichedPayload.phone,
      email: enrichedPayload.email || "",
      service: enrichedPayload.service,
      message: enrichedPayload.message,
      sourcePage: enrichedPayload.sourcePage || "",
      sourceForm: enrichedPayload.sourceForm || "",
      preferredLanguage: enrichedPayload.preferredLanguage || "en",
      status: "new",
      assignedTo: "",
      whatsappStatus: "not_sent",
      createdFrom: enrichedPayload.createdFrom || "website",
      metadata: enrichedPayload.metadata || {}
    });
    logEnquiryInsert("mock insert success", { referenceId });
    return mapEnquiry(record);
  }

  const insertPayload = toSupabaseInsert(enrichedPayload, referenceId);
  logEnquiryInsert("Supabase insert started", {
    referenceId,
    payloadKeys: Object.keys(insertPayload)
  });

  const { data, error } = await serviceSupabase
    .from("enquiries")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    console.error("[enquiries] Supabase insert failed", {
      referenceId,
      message: error.message
    });
    throw new Error(`Failed to create enquiry: ${error.message}`);
  }

  logEnquiryInsert("Supabase insert success", { referenceId });
  return mapEnquiry(data);
}

async function updateEnquiryWhatsAppStatus(enquiryId, whatsappStatus) {
  if (env.mockDatabaseMode) {
    const record = mockDb.updateRecord("enquiries", (item) => item.id === enquiryId, { whatsappStatus });
    return mapEnquiry(record);
  }

  const { data, error } = await serviceSupabase
    .from("enquiries")
    .update({ whatsapp_status: whatsappStatus })
    .eq("id", enquiryId)
    .select("*")
    .single();

  if (error) {
    console.error("Failed to update enquiry WhatsApp status:", error.message);
    return null;
  }

  return mapEnquiry(data);
}

async function findEnquiryByIdOrReference(idOrReference) {
  if (env.mockDatabaseMode) {
    return mapEnquiry(mockDb.findRecord("enquiries", (item) => item.id === idOrReference || item.referenceId === idOrReference));
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrReference);
  const query = serviceSupabase.from("enquiries").select("*").limit(1);
  const { data, error } = isUuid
    ? await query.eq("id", idOrReference).maybeSingle()
    : await query.eq("reference_id", idOrReference).maybeSingle();

  if (error) {
    throw new Error(`Failed to load enquiry: ${error.message}`);
  }

  return mapEnquiry(data);
}

async function listEnquiries(filters = {}) {
  if (env.mockDatabaseMode) {
    let rows = mockDb.listRecords("enquiries");
    if (filters.status) rows = rows.filter((item) => item.status === filters.status);
    if (filters.service) rows = rows.filter((item) => item.service === filters.service);
    if (filters.search) {
      const search = filters.search.toLowerCase();
      rows = rows.filter((item) => [item.referenceId, item.name, item.phone, item.email, item.service].some((value) => String(value || "").toLowerCase().includes(search)));
    }
    rows = dedupeEnquiries(rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    const page = Math.max(Number(filters.page) || 1, 1);
    const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 100);
    const start = (page - 1) * limit;
    return {
      enquiries: rows.slice(start, start + limit).map(mapEnquiry),
      total: rows.length,
      page,
      limit
    };
  }

  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 100);
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  let query = serviceSupabase.from("enquiries").select("*", { count: "exact" });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.service) query = query.eq("service", filters.service);
  if (filters.fromDate) query = query.gte("created_at", filters.fromDate);
  if (filters.toDate) query = query.lte("created_at", filters.toDate);
  if (filters.search) {
    const search = filters.search.replace(/[%(),]/g, "");
    query = query.or(`reference_id.ilike.%${search}%,name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to list enquiries: ${error.message}`);
  }

  return {
    enquiries: dedupeEnquiries((data || []).map(mapEnquiry)),
    total: count || 0,
    page,
    limit
  };
}

async function updateEnquiry(idOrReference, updates) {
  if (env.mockDatabaseMode) {
    const record = mockDb.updateRecord(
      "enquiries",
      (item) => item.id === idOrReference || item.referenceId === idOrReference,
      {
        ...(updates.status ? { status: updates.status } : {}),
        ...(updates.assignedTo || updates.assigned_to ? { assignedTo: updates.assignedTo || updates.assigned_to } : {}),
        ...(updates.metadata ? { metadata: updates.metadata } : {})
      }
    );
    return mapEnquiry(record);
  }

  const existing = await findEnquiryByIdOrReference(idOrReference);
  if (!existing) return null;

  const payload = {};
  if (updates.status) payload.status = updates.status;
  if (updates.assignedTo || updates.assigned_to) payload.assigned_to = updates.assignedTo || updates.assigned_to;
  if (updates.metadata) payload.metadata = updates.metadata;

  const { data, error } = await serviceSupabase
    .from("enquiries")
    .update(payload)
    .eq("id", existing.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update enquiry: ${error.message}`);
  }

  return mapEnquiry(data);
}

module.exports = {
  createEnquiry,
  findEnquiryByIdOrReference,
  listEnquiries,
  updateEnquiry,
  updateEnquiryWhatsAppStatus
};
