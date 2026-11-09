import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendRegistrationEmails } from "@/lib/mail";

function generateReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ETS-DA-${code}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      country,
      jobTitle,
      organisation,
      experience,
      tools,
      goals,
      source,
      privacyConsent,
      marketingConsent,
      hp,
    } = body;

    // Bot detection
    if (hp) {
      return NextResponse.json({ success: true, reference: "ETS-DA-MOCK" });
    }

    if (!fullName || !email || !phone || !country || !jobTitle || !experience || !privacyConsent) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Generate unique reference
    let reference = generateReference();
    let exists = await prisma.registration.findUnique({ where: { reference } });
    while (exists) {
      reference = generateReference();
      exists = await prisma.registration.findUnique({ where: { reference } });
    }

    // Save to Database
    const registration = await prisma.registration.create({
      data: {
        reference,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        country: country.trim(),
        jobTitle: jobTitle.trim(),
        organisation: organisation?.trim() || null,
        experience,
        tools: tools || null,
        goals: goals?.trim() || null,
        source: source || null,
        privacyConsent: !!privacyConsent,
        marketingConsent: !!marketingConsent,
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

