const crypto = require("crypto");
const { todayStamp, timeStamp } = require("../utils/dateUtils");

function randomCode(length = 4) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let output = "";
  const bytes = crypto.randomBytes(length);

  for (let index = 0; index < length; index += 1) {
    output += alphabet[bytes[index] % alphabet.length];
  }

  return output;
}

function createReference(prefix) {
  const now = new Date();
  return `${prefix}-${todayStamp(now)}-${timeStamp(now)}-${randomCode(4)}`;
}

function createEnquiryReference() {
  return createReference("NP-ENQ");
}

function createChatReference() {
  return createReference("NP-CHAT");
}

module.exports = {
  createEnquiryReference,
  createChatReference
};
