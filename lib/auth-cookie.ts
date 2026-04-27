const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const AUTH_COOKIE_PREFIX = "nm1";

function toHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

async function signAuthPayload(payload: string, appPassword: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(appPassword),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toHex(signature);
}

export function getAuthCookieMaxAge() {
  return AUTH_COOKIE_MAX_AGE_SECONDS;
}

export async function createAuthCookieValue(appPassword: string) {
  const issuedAt = Date.now().toString();
  const payload = `${AUTH_COOKIE_PREFIX}.${issuedAt}`;
  const signature = await signAuthPayload(payload, appPassword);
  return `${payload}.${signature}`;
}

export async function isValidAuthCookieValue(value: string | undefined, appPassword: string) {
  if (!value) return false;

  const [prefix, issuedAt, signature] = value.split(".");
  if (prefix !== AUTH_COOKIE_PREFIX || !issuedAt || !signature) return false;

  const issuedAtMs = Number.parseInt(issuedAt, 10);
  if (!Number.isFinite(issuedAtMs)) return false;

  const ageMs = Date.now() - issuedAtMs;
  if (ageMs < 0 || ageMs > AUTH_COOKIE_MAX_AGE_SECONDS * 1000) return false;

  const expectedSignature = await signAuthPayload(`${prefix}.${issuedAt}`, appPassword);
  return safeEqual(signature, expectedSignature);
}
