const { parseEnquiryPayload } = require("../services/validationService");
const enquiryService = require("../services/enquiryService");
const whatsappService = require("../services/whatsappService");
const { sendSuccess } = require("../utils/responseUtils");

async function createEnquiry(request, response, next) {
  const payloadKeys = Object.keys(request.body || {});
  console.log("[enquiries] endpoint hit", {
    origin: request.get("origin") || "",
    payloadKeys
  });

  try {
    const payload = parseEnquiryPayload(request.body);
    const enquiry = await enquiryService.createEnquiry(payload);
    const whatsappStatus = await whatsappService.sendEnquiryAlert(enquiry);
    await enquiryService.updateEnquiryWhatsAppStatus(enquiry.id, whatsappStatus);

    console.log("[enquiries] request completed", {
      referenceId: enquiry.referenceId,
      sourceForm: payload.sourceForm || "",
      service: payload.service || ""
    });

    sendSuccess(response, {
      referenceId: enquiry.referenceId,
      message: "Requirement submitted successfully. Our team will contact you shortly.",
      whatsappStatus,
      enquiry
    });
  } catch (error) {
    console.error("[enquiries] request failed", {
      payloadKeys,
      message: error.message
    });
    next(error);
  }
}

module.exports = {
  createEnquiry
};
