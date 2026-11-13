import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendNewsletterWelcomeEmail } from "@/lib/mail";
import {
  asTrimmedString,
  checkRateLimit,
  generateSecureReference,
  getClientIp,
  isSameOriginRequest,
  isValidEmail,
} from "@/lib/security";

export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }

  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit({
      key: `newsletter-ip:${ip}`,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many subscription requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;
    const hp = asTrimmedString(data.hp, 100);
    if (hp) {
      return NextResponse.json({
        success: true,
        message: "Thank you! You've been subscribed to executive tech updates.",
      });
    }

    const trimmed = asTrimmedString(data.email, 254).toLowerCase();
    if (!isValidEmail(trimmed)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    const existing = await prisma.enquiry.findFirst({
      where: {
        email: trimmed,
        topic: "Newsletter Subscription",
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You are already subscribed to our briefings!",
        alreadySubscribed: true,
      });
    }

    let reference = generateSecureReference("ETS-NEWS");
    let exists = await prisma.enquiry.findUnique({ where: { reference } });
    while (exists) {
      reference = generateSecureReference("ETS-NEWS");
      exists = await prisma.enquiry.findUnique({ where: { reference } });
    }

    const subscriberName = trimmed.split("@")[0] || "Subscriber";
    const formattedName =
      subscriberName.charAt(0).toUpperCase() + subscriberName.slice(1);

    await prisma.enquiry.create({
      data: {
        reference,
        fullName: `${formattedName} (Subscriber)`,
        email: trimmed,
        region: "Global",
        topic: "Newsletter Subscription",
        message: "Executive Newsletter briefing subscription from website footer.",
        privacyConsent: true,
        status: "new",
      },
    });

    // Send confirmation welcome email asynchronously
    sendNewsletterWelcomeEmail({ email: trimmed, reference }).catch((err) =>
      console.error("[NEWSLETTER_MAIL_ERROR]", err)
    );

    return NextResponse.json({
      success: true,
      message: "Thank you! You've been subscribed to executive tech updates.",
    });
  } catch (err: unknown) {
    console.error("[NEWSLETTER_API_ERROR]", err);
    return NextResponse.json(
      { error: "Unable to process subscription right now. Please try again." },
      { status: 500 }
    );
  }
}
