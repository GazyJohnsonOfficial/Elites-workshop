import { NextResponse } from "next/server";
import { createAcademySession, getAcademySession } from "@/lib/academyAuth";
import {
  createNewReference,
  formatCurrencyAmount,
  getAcademyStore,
  type CurrencyCode,
  type TuitionPayment,
} from "@/lib/academyStore";
import { sendAcademyEnrollmentEmails } from "@/lib/mail";
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
    const fullName = asTrimmedString(data.fullName, 120);
    const email = asTrimmedString(data.email, 254).toLowerCase();
    const phone = asTrimmedString(data.phone, 32);
    const country = asTrimmedString(data.country, 80);
    const courseId = asTrimmedString(data.courseId, 80);
    const cohortId = asTrimmedString(data.cohortId, 80);
    const paymentPlan: "full" | "installment_2" =
      asTrimmedString(data.paymentPlan, 32) === "installment_2" ? "installment_2" : "full";
    const rawCurrency = asTrimmedString(data.currency, 8).toUpperCase();
    const currency: CurrencyCode =
      rawCurrency === "GHS" || rawCurrency === "GBP" ? rawCurrency : "USD";
    const channelRaw = asTrimmedString(data.channel, 60);
    const channel: TuitionPayment["channel"] =
      channelRaw === "Mobile Money (MoMo)" ||
      channelRaw === "Debit / Credit Card" ||
      channelRaw === "Bank Transfer"
        ? channelRaw
        : "Bank Transfer";

    if (fullName.length < 2 || !isValidEmail(email) || phone.length < 6 || country.length < 2) {
      return NextResponse.json(
        { error: "Please complete your name, email, phone, and country." },
        { status: 400 }
      );
    }

    const store = getAcademyStore();
    const course = store.courses.find((c) => c.id === courseId);
    if (!course) {
      return NextResponse.json({ error: "Selected program was not found." }, { status: 404 });
    }

    const cohort =
      (cohortId && store.cohorts.find((c) => c.id === cohortId && c.courseId === course.id)) ||
      store.cohorts.find((c) => c.courseId === course.id && c.status === "open");

    let user = store.users.find((u) => u.email.toLowerCase() === email);
    if (!user) {
      user = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        email,
        fullName,
        role: "learner",
        country,
        createdAt: new Date().toISOString(),
      };
      store.users.push(user);
    }

    const reference = createNewReference("ETS-ACAD");
    const enrollmentId = `enr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const nowIso = new Date().toISOString();

    const enrollment = {
      id: enrollmentId,
      reference,
      userId: user.id,
      learnerName: fullName,
      learnerEmail: email,
      learnerPhone: phone,
      country,
      courseId: course.id,
      cohortId: cohort?.id,
      paymentPlan,
      currency,
      totalUsd: course.tuitionUsd,
      amountPaidUsd: 0,
      paymentStatus: "pending" as const,
      status: "active" as const,
      completedModuleIds: [],
      capstoneUrl: "",
      capstoneNotes: "",
      lastActiveAt: nowIso,
      createdAt: nowIso,
    };

    store.enrollments.unshift(enrollment);

    if (cohort && cohort.seatsTaken < cohort.seatCapacity) {
      cohort.seatsTaken += 1;
    }

    const firstInstallmentUsd =
      paymentPlan === "installment_2" ? Math.ceil(course.tuitionUsd / 2) : course.tuitionUsd;

    store.payments.unshift({
      id: `pay-${Date.now()}-1`,
      reference: createNewReference("ETS-PAY"),
      enrollmentId,
      payerName: fullName,
      payerEmail: email,
      description:
        paymentPlan === "installment_2"
          ? `${course.title} · Installment 1 of 2`
          : `${course.title} · Full Tuition`,
      installmentNumber: 1,
      currency,
      amountUsd: firstInstallmentUsd,
      amountLocalFormatted: formatCurrencyAmount(firstInstallmentUsd, currency),
      channel,
      status: "pending",
      createdAt: nowIso,
    });

    if (paymentPlan === "installment_2") {
      const secondUsd = course.tuitionUsd - firstInstallmentUsd;
      store.payments.unshift({
        id: `pay-${Date.now()}-2`,
        reference: createNewReference("ETS-PAY"),
        enrollmentId,
        payerName: fullName,
        payerEmail: email,
        description: `${course.title} · Installment 2 of 2`,
        installmentNumber: 2,
        currency,
        amountUsd: secondUsd,
        amountLocalFormatted: formatCurrencyAmount(secondUsd, currency),
        channel,
        status: "pending",
        createdAt: nowIso,
      });
    }

    // Automatically log the learner into the Academy workspace if not currently signed in as staff
    const currentSession = await getAcademySession();
    if (!currentSession || currentSession.role !== "staff_admin") {
      await createAcademySession(user);
    }

    sendAcademyEnrollmentEmails({
      reference,
      learnerName: fullName,
      learnerEmail: email,
      courseTitle: course.title,
      paymentPlanLabel:
        paymentPlan === "installment_2"
          ? "2 Monthly Installments (50% Deposit)"
          : "Full Program Tuition",
      amountDueFormatted: formatCurrencyAmount(firstInstallmentUsd, currency),
    }).catch((err) => console.error("Academy enrollment email error:", err));

    return NextResponse.json({
      success: true,
      reference,
      enrollment,
      amountDueFormatted: formatCurrencyAmount(firstInstallmentUsd, currency),
    });
  } catch (error) {
    console.error("Academy enroll error:", error);
    return NextResponse.json({ error: "Unable to complete enrollment." }, { status: 500 });
  }
}
