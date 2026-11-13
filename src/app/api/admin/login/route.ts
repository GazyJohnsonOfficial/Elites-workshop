import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";
import {
  asTrimmedString,
  checkRateLimit,
  getClientIp,
  isSameOriginRequest,
  isValidEmail,
  safeEqualStrings,
  verifyAdminPassword,
} from "@/lib/security";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }

  try {
    const ip = getClientIp(req);
    const ipLimit = checkRateLimit({
      key: `admin-login-ip:${ip}`,
      limit: 8,
      windowMs: LOGIN_WINDOW_MS,
    });

    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(ipLimit.retryAfterSeconds) },
        }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const email = asTrimmedString((body as Record<string, unknown>).email, 254).toLowerCase();
    const rawPassword = (body as Record<string, unknown>).password;
    const password = typeof rawPassword === "string" ? rawPassword : "";

    if (!isValidEmail(email) || !password || password.length > 256) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const emailLimit = checkRateLimit({
      key: `admin-login-email:${email}`,
      limit: 5,
      windowMs: LOGIN_WINDOW_MS,
    });

    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts for this account. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(emailLimit.retryAfterSeconds) },
        }
      );
    }

    const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (!expectedEmail) {
      return NextResponse.json(
        { error: "Authentication service is not configured." },
        { status: 503 }
      );
    }

    const emailOk = safeEqualStrings(email, expectedEmail);
    const passwordOk = verifyAdminPassword(password);

    if (emailOk && passwordOk) {
      await createAdminSession(expectedEmail);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
