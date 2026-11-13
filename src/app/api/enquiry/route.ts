import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEnquiryEmails } from "@/lib/mail";
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
      key: `enquiry-ip:${ip}`,
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });

    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a few minutes and try again." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const data = body as Record<string, unknown>;
    const hp = asTrimmedString(data.hp, 100);

    // Bot detection
    if (hp) {
      return NextResponse.json({ success: true, reference: "ETS-ENQ-MOCK" });
    }

    const fullName = asTrimmedString(data.fullName, 120);
    const email = asTrimmedString(data.email, 254).toLowerCase();
    const phone = asTrimmedString(data.phone, 32);
    const organisation = asTrimmedString(data.organisation, 150);
    const region = asTrimmedString(data.region, 80);
    const topic = asTrimmedString(data.topic, 120);
    const message = asTrimmedString(data.message, 2000);
    const privacyConsent = data.privacyConsent === true;

    if (
      fullName.length < 2 ||
      !isValidEmail(email) ||
      !region ||
      !topic ||
      message.length < 10 ||
      !privacyConsent
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields with valid information." },
        { status: 400 }
      );
    }

    let reference = generateSecureReference("ETS-ENQ");
    let exists = await prisma.enquiry.findUnique({ where: { reference } });
    while (exists) {
      reference = generateSecureReference("ETS-ENQ");
      exists = await prisma.enquiry.findUnique({ where: { reference } });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        reference,
        fullName,
        email,
        phone: phone || null,
        organisation: organisation || null,
        region,
        topic,
        message,
        privacyConsent: true,
        status: "new",
      },
    });

    sendEnquiryEmails(enquiry).catch((err) =>
      console.error("Async email dispatch failed:", err)
    );

    return NextResponse.json({
      success: true,
      reference,
      message: "Enquiry successfully sent.",
    });
  } catch (error) {
    console.error("Enquiry error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while sending your enquiry." },
      { status: 500 }
    );
  }
}
