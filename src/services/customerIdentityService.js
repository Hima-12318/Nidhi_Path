function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizePhone(phone) {
  const digits = String(phone || "").replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function normalizeName(name) {
  return String(name || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function buildCustomerKey({ email, phone, name } = {}) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);
  const normalizedName = normalizeName(name);
  if (normalizedEmail && normalizedPhone) return `${normalizedEmail}|${normalizedPhone}`;
  if (normalizedEmail) return `email:${normalizedEmail}`;
  if (normalizedPhone) return `phone:${normalizedPhone}`;
  if (normalizedName) return `name:${normalizedName}`;
  return "";
}

function samePerson(left = {}, right = {}) {
  const leftEmail = normalizeEmail(left.email || left.customerEmail);
  const rightEmail = normalizeEmail(right.email || right.customerEmail);
  const leftPhone = normalizePhone(left.phone || left.customerPhone);
  const rightPhone = normalizePhone(right.phone || right.customerPhone);
  const leftName = normalizeName(left.name || left.fullName || left.customerName);
  const rightName = normalizeName(right.name || right.fullName || right.customerName);

  if (leftEmail && rightEmail && leftPhone && rightPhone) {
    return leftEmail === rightEmail && leftPhone === rightPhone;
  }
  if (leftEmail && rightEmail && leftEmail === rightEmail && (!leftPhone || !rightPhone)) return true;
  if (leftPhone && rightPhone && leftPhone === rightPhone && (!leftEmail || !rightEmail)) return true;
  if (leftEmail && rightEmail && leftEmail === rightEmail && leftName && rightName && leftName === rightName) return true;
  if (leftPhone && rightPhone && leftPhone === rightPhone && leftName && rightName && leftName === rightName) return true;
  return false;
}

module.exports = {
  buildCustomerKey,
  normalizeEmail,
  normalizeName,
  normalizePhone,
  samePerson
};
