import { NextResponse } from "next/server";
import { createAcademySession, getAcademySession } from "@/lib/academyAuth";
import {
  createNewReference,
  formatCurrencyAmount,
  getAcademyStore,
  getCorporateDiscountPercent,
  type CurrencyCode,
} from "@/lib/academyStore";
import { sendCorporateQuoteEmails } from "@/lib/mail";
import { asTrimmedString, isSameOriginRequest, isValidEmail } from "@/lib/security";

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
    const organizationName = asTrimmedString(data.organizationName, 140);
    const contactName = asTrimmedString(data.contactName, 120);
    const contactEmail = asTrimmedString(data.contactEmail, 254).toLowerCase();
    const phone = asTrimmedString(data.phone, 32);
    const region = asTrimmedString(data.region, 80) || "United States";
    const courseId = asTrimmedString(data.courseId, 80);
    const seatCount = Math.max(5, Math.min(250, Number(data.seatCount) || 10));
    const rawCurrency = asTrimmedString(data.currency, 8).toUpperCase();
    const currency: CurrencyCode =
      rawCurrency === "GHS" || rawCurrency === "GBP" ? rawCurrency : "USD";
    const billingTerms =
      asTrimmedString(data.billingTerms, 60) === "Upfront Corporate Invoice"
        ? "Upfront Corporate Invoice"
        : "Net-30 Purchase Order";
    const notes = asTrimmedString(data.notes, 600);

    if (organizationName.length < 2 || contactName.length < 2 || !isValidEmail(contactEmail)) {
      return NextResponse.json(
        { error: "Provide organization name, contact name, and valid business email." },
        { status: 400 }
      );
    }

    const store = getAcademyStore();
    const course = store.courses.find((c) => c.id === courseId) || store.courses[0];
    const discountPercent = getCorporateDiscountPercent(seatCount);
    const grossUsd = course.tuitionUsd * seatCount;
    const totalUsd = Math.round(grossUsd * (1 - discountPercent / 100));
    const totalLocalFormatted = formatCurrencyAmount(totalUsd, currency);
    const nowIso = new Date().toISOString();

    let org = store.organizations.find(
      (o) =>
        o.billingEmail.toLowerCase() === contactEmail ||
        o.name.toLowerCase() === organizationName.toLowerCase()
    );

    if (!org) {
      org = {
        id: `org-${Date.now()}`,
        reference: createNewReference("ETS-CORP"),
        name: organizationName,
        billingEmail: contactEmail,
        contactName,
        phone: phone || "Not provided",
        region,
        seatQuota: seatCount,
        seatsUsed: 0,
        billingStatus: "quote_pending",
        createdAt: nowIso,
      };
      store.organizations.unshift(org);
    } else {
      org.seatQuota += seatCount;
    }

    const quoteRef = createNewReference("ETS-QT");
    const quote = {
      id: `quote-${Date.now()}`,
      reference: quoteRef,
      organizationId: org.id,
      organizationName,
      contactName,
      contactEmail,
      region,
      courseId: course.id,
      courseTitle: course.title,
      seatCount,
      currency,
      unitPriceUsd: course.tuitionUsd,
      discountPercent,
      totalUsd,
      totalLocalFormatted,
      billingTerms: billingTerms as "Net-30 Purchase Order" | "Upfront Corporate Invoice",
      status: "pending" as const,
      notes,
      createdAt: nowIso,
    };

    store.quotes.unshift(quote);

    store.payments.unshift({
      id: `pay-${Date.now()}`,
      reference: createNewReference("ETS-PAY"),
      organizationId: org.id,
      quoteId: quote.id,
      payerName: organizationName,
      payerEmail: contactEmail,
      description: `Corporate ${seatCount}-Seat Pack (${course.title})`,
      installmentNumber: 1,
      currency,
      amountUsd: totalUsd,
      amountLocalFormatted: totalLocalFormatted,
      channel: billingTerms === "Net-30 Purchase Order" ? "Net-30 Corporate PO" : "Bank Transfer",
      status: "pending",
      createdAt: nowIso,
    });

    // Provision org_admin user & set session so manager can inspect /academy/corporate immediately
    let user = store.users.find((u) => u.email.toLowerCase() === contactEmail);
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        email: contactEmail,
        fullName: contactName,
        role: "org_admin",
        country: region,
        organizationId: org.id,
        createdAt: nowIso,
      };
      store.users.push(user);
    } else if (user.role === "staff_admin") {
      return NextResponse.json(
        { error: "Please use a corporate or team manager email address." },
        { status: 403 }
      );
    } else {
      user.role = "org_admin";
      user.organizationId = org.id;
    }

    const currentSession = await getAcademySession();
    if (!currentSession || currentSession.role !== "staff_admin") {
      await createAcademySession(user);
    }

    sendCorporateQuoteEmails({
      reference: quoteRef,
      organizationName,
      contactName,
      contactEmail,
      courseTitle: course.title,
      seatCount,
      totalFormatted: totalLocalFormatted,
      billingTerms,
    }).catch((err) => console.error("Corporate quote email error:", err));

    return NextResponse.json({
      success: true,
      reference: quoteRef,
      quote,
      organization: org,
    });
  } catch (error) {
    console.error("Corporate quote error:", error);
    return NextResponse.json({ error: "Unable to create corporate quote." }, { status: 500 });
  }
}
