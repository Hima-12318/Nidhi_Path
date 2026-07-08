function normalizeIndianPhone(phone) {
  const raw = String(phone || "").trim().replace(/[()\-\s]/g, "");
  let digits = raw;

  if (digits.startsWith("+91")) {
    digits = digits.slice(3);
  } else if (digits.startsWith("91") && digits.length === 12) {
    digits = digits.slice(2);
  }

  if (!/^[6-9]\d{9}$/.test(digits)) {
    return "";
  }

  return `+91${digits}`;
}

function isValidIndianPhone(phone) {
  return Boolean(normalizeIndianPhone(phone));
}

function maskPhone(phone) {
  const normalized = normalizeIndianPhone(phone);
  if (!normalized) return "";
  return `${normalized.slice(0, 5)}*****${normalized.slice(-2)}`;
}

module.exports = {
  normalizeIndianPhone,
  isValidIndianPhone,
  maskPhone
};
