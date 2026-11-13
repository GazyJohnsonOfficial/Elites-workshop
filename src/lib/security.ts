import crypto from "crypto";

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escapes untrusted strings before interpolation into HTML email templates.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch] || ch);
}

/**
 * Removes CR, LF, and NUL characters to prevent email header injection.
 */
export function stripHeaderNewlines(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[\r\n\0]+/g, " ").trim();
}

/**
 * Formats a CSV cell and neutralizes spreadsheet formula injection prefixes.
 */
export function sanitizeCsvCell(value: unknown): string {
  const raw = value === null || value === undefined ? "" : String(value);
  const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

/**
 * Coerces an unknown input to a trimmed string clipped to a maximum length.
 */
export function asTrimmedString(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validates email length and basic address syntax.
 */
export function isValidEmail(email: string): boolean {
  return email.length >= 5 && email.length <= 254 && EMAIL_RE.test(email);
}

/**
 * Generates an unpredictable alphanumeric reference using crypto.randomInt.
 */
export function generateSecureReference(prefix: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return `${prefix}-${code}`;
}

/**
 * Compares two strings in constant time by hashing both inputs first.
 */
export function safeEqualStrings(a: string, b: string): boolean {
  const digestA = crypto.createHash("sha256").update(a, "utf8").digest();
  const digestB = crypto.createHash("sha256").update(b, "utf8").digest();
  return crypto.timingSafeEqual(digestA, digestB);
}

/**
 * Verifies the staff portal password against ADMIN_PASSWORD_HASH (scrypt)
 * or ADMIN_PASSWORD. Fails closed if neither is configured.
 */
export function verifyAdminPassword(candidate: string): boolean {
  if (!candidate || candidate.length > 256) return false;

  const hashSpec = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (hashSpec) {
    const parts = hashSpec.split(":");
    if (parts.length !== 3 || parts[0] !== "scrypt") {
      return false;
    }
    const [, saltHex, expectedHex] = parts;
    try {
      const salt = Buffer.from(saltHex, "hex");
      const expected = Buffer.from(expectedHex, "hex");
      if (salt.length < 8 || expected.length < 16) return false;
      const derived = crypto.scryptSync(candidate, salt, expected.length);
      return crypto.timingSafeEqual(derived, expected);
    } catch {
      return false;
    }
  }

  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword || configuredPassword.trim().length === 0) {
    return false;
  }

  return safeEqualStrings(candidate, configuredPassword);
}

const globalForAuth = globalThis as unknown as {
  __etsDevJwtSecret?: Uint8Array;
};

/**
 * Returns the HMAC key for admin session JWTs.
 * Production requires ADMIN_SECRET (>= 32 chars). Development generates
 * a process-local random secret when unset rather than using a known string.
 */
export function getAdminJwtSecret(): Uint8Array {
  const envSecret = process.env.ADMIN_SECRET?.trim();
  if (envSecret && envSecret.length >= 32) {
    return new TextEncoder().encode(envSecret);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SECRET environment variable (32+ chars) is required in production.");
  }

  if (!globalForAuth.__etsDevJwtSecret) {
    globalForAuth.__etsDevJwtSecret = new Uint8Array(crypto.randomBytes(32));
  }
  return globalForAuth.__etsDevJwtSecret;
}

/**
 * Extracts a normalized client IP hint for rate-limiting buckets.
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 64);
  return "unknown";
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const globalForRateLimit = globalThis as unknown as {
  __etsRateBuckets?: Map<string, RateLimitBucket>;
};

const MAX_BUCKETS = 10_000;

/**
 * Applies a fixed-window rate limit stored in process memory.
 */
export function checkRateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}): { allowed: boolean; retryAfterSeconds: number; remaining: number } {
  if (!globalForRateLimit.__etsRateBuckets) {
    globalForRateLimit.__etsRateBuckets = new Map<string, RateLimitBucket>();
  }
  const buckets = globalForRateLimit.__etsRateBuckets;
  const now = Date.now();

  // Opportunistic cleanup so stale buckets cannot grow without bound.
  if (buckets.size >= MAX_BUCKETS) {
    for (const [bucketKey, bucket] of buckets.entries()) {
      if (bucket.resetAt <= now) {
        buckets.delete(bucketKey);
      }
    }
  }

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
      remaining: Math.max(0, limit - 1),
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
      remaining: 0,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    remaining: Math.max(0, limit - existing.count),
  };
}

/**
 * Verifies browser Origin matches the active host or configured site URL.
 * Rejects forged cross-site POST/PATCH/DELETE requests from third-party origins.
 */
export function isSameOriginRequest(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  let originHost = "";
  try {
    originHost = new URL(origin).host.toLowerCase();
  } catch {
    return false;
  }

  const requestHost = (
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    ""
  )
    .split(",")[0]
    .trim()
    .toLowerCase();

  if (requestHost && originHost === requestHost) {
    return true;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    try {
      if (new URL(siteUrl).host.toLowerCase() === originHost) {
        return true;
      }
    } catch {
      // Ignore invalid site URL format
    }
  }

  return false;
}

