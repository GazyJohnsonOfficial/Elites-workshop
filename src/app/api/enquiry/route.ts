import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEnquiryEmails } from "@/lib/mail";

function generateEnquiryReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ETS-ENQ-${code}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      organisation,
      region,
      topic,
      message,
      privacyConsent,
      hp,
    } = body;

    // Bot detection
    if (hp) {
      return NextResponse.json({ success: true, reference: "ETS-ENQ-MOCK" });
    }

    if (!fullName || !email || !region || !topic || !message || !privacyConsent) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    let reference = generateEnquiryReference();
    let exists = await prisma.enquiry.findUnique({ where: { reference } });
    while (exists) {
      reference = generateEnquiryReference();
      exists = await prisma.enquiry.findUnique({ where: { reference } });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        reference,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        organisation: organisation?.trim() || null,
        region,
        topic,
        message: message.trim(),
        privacyConsent: !!privacyConsent,
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

