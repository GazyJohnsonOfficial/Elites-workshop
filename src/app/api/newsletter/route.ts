import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendNewsletterWelcomeEmail } from "@/lib/mail";

function generateEnquiryReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ETS-NEWS-${code}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
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

    let reference = generateEnquiryReference();
    let exists = await prisma.enquiry.findUnique({ where: { reference } });
    while (exists) {
      reference = generateEnquiryReference();
      exists = await prisma.enquiry.findUnique({ where: { reference } });
    }

    const subscriberName = trimmed.split("@")[0];
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
