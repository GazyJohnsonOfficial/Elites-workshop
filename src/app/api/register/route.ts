import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendRegistrationEmails } from "@/lib/mail";
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
      key: `register-ip:${ip}`,
      limit: 5,
      windowMs: 15 * 60 * 1000,
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
      return NextResponse.json({ success: true, reference: "ETS-DA-MOCK" });
    }

    const fullName = asTrimmedString(data.fullName, 120);
    const email = asTrimmedString(data.email, 254).toLowerCase();
    const phone = asTrimmedString(data.phone, 32);
    const country = asTrimmedString(data.country, 100);
    const jobTitle = asTrimmedString(data.jobTitle, 100);
    const organisation = asTrimmedString(data.organisation, 150);
    const experience = asTrimmedString(data.experience, 80);
    const tools = asTrimmedString(data.tools, 500);
    const goals = asTrimmedString(data.goals, 1000);
    const source = asTrimmedString(data.source, 100);
    const privacyConsent = data.privacyConsent === true;
    const marketingConsent = data.marketingConsent === true;

    if (
      fullName.length < 2 ||
      !isValidEmail(email) ||
      phone.length < 6 ||
      country.length < 2 ||
      jobTitle.length < 2 ||
      !experience ||
      !privacyConsent
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields with valid information." },
        { status: 400 }
      );
    }

    let reference = generateSecureReference("ETS-DA");
    let exists = await prisma.registration.findUnique({ where: { reference } });
    while (exists) {
      reference = generateSecureReference("ETS-DA");
      exists = await prisma.registration.findUnique({ where: { reference } });
    }

    const registration = await prisma.registration.create({
      data: {
        reference,
        fullName,
        email,
        phone,
        country,
        jobTitle,
        organisation: organisation || null,
        experience,
        tools: tools || null,
        goals: goals || null,
        source: source || null,
        privacyConsent: true,
        marketingConsent,
        status: "pending",
      },
    });

    // Send emails asynchronously (does not block response if email is slow)
    sendRegistrationEmails(registration).catch((err) =>
      console.error("Async email dispatch failed:", err)
    );

    return NextResponse.json({
      success: true,
      reference,
      message: "Registration successfully recorded.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your registration." },
      { status: 500 }
    );
  }
}
