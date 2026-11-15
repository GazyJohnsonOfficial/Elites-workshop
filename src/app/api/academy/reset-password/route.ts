import { NextResponse } from "next/server";
import {
  createPasswordResetRequest,
  consumePasswordReset,
  getAcademyStore,
} from "@/lib/academyStore";
import { sendPasswordResetEmail } from "@/lib/mail";
import { asTrimmedString, isSameOriginRequest, isValidEmail } from "@/lib/security";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = asTrimmedString(searchParams.get("token"), 64);

  if (!token) {
    return NextResponse.json({ valid: false, error: "Missing token parameter." }, { status: 400 });
  }

  const store = getAcademyStore();
  const resetReq = store.passwordResets.find(
    (r) => r.token.toUpperCase() === token.toUpperCase()
  );

  if (!resetReq) {
    return NextResponse.json({ valid: false, error: "Invalid recovery token." }, { status: 404 });
  }

  if (resetReq.used) {
    return NextResponse.json({ valid: false, error: "This recovery token has already been used." }, { status: 410 });
  }

  if (new Date(resetReq.expiresAt) < new Date()) {
    return NextResponse.json({ valid: false, error: "This recovery token has expired." }, { status: 410 });
  }

  // Mask email for privacy (e.g. a***a@example.com)
  const parts = resetReq.email.split("@");
  const namePart = parts[0];
  const domainPart = parts[1] || "";
  const maskedName =
    namePart.length <= 2
      ? `${namePart[0]}*`
      : `${namePart[0]}${"*".repeat(Math.min(namePart.length - 2, 5))}${namePart[namePart.length - 1]}`;

  return NextResponse.json({
    valid: true,
    emailMasked: `${maskedName}@${domainPart}`,
    email: resetReq.email,
  });
}

export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const data = body as Record<string, unknown>;
    const email = asTrimmedString(data.email, 254).toLowerCase();

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid registered email address." },
        { status: 400 }
      );
    }

    const store = getAcademyStore();
    const user = store.users.find((u) => u.email.toLowerCase() === email);

    // Create password reset request record in store
    const resetReq = createPasswordResetRequest(email);

    // Determine host URL for direct reset link
    const origin = req.headers.get("origin") || req.headers.get("referer") || "http://localhost:3000";
    const resetUrl = `${new URL(origin).origin}/academy/signin?token=${encodeURIComponent(resetReq.token)}&mode=reset`;

    // Dispatch branded recovery email
    await sendPasswordResetEmail({
      email: resetReq.email,
      fullName: user?.fullName,
      resetToken: resetReq.token,
      resetUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Password recovery instructions and security token dispatched.",
      email: resetReq.email,
      token: resetReq.token, // Returned for instant demo testing and fast UX feedback
      expiresAt: resetReq.expiresAt,
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { error: "Unable to process password reset request. Please try again." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const data = body as Record<string, unknown>;
    const token = asTrimmedString(data.token, 64);
    const newPassword = asTrimmedString(data.newPassword, 128);

    if (!token) {
      return NextResponse.json({ error: "Recovery token is required." }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Passphrase must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const result = consumePasswordReset(token, newPassword);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Unable to reset passphrase." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Passphrase successfully updated. You may now sign in to your workspace.",
      user: {
        email: result.user?.email,
        fullName: result.user?.fullName,
      },
    });
  } catch (error) {
    console.error("Password reset update error:", error);
    return NextResponse.json(
      { error: "Failed to update passphrase. Please try again." },
      { status: 500 }
    );
  }
}
