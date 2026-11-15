import { NextResponse } from "next/server";
import { getAcademySession } from "@/lib/academyAuth";
import { verifyAdminSession } from "@/lib/auth";
import { createNewReference, getAcademyStore } from "@/lib/academyStore";
import { asTrimmedString, isSameOriginRequest } from "@/lib/security";

async function isStaffAuthorized(): Promise<boolean> {
  const adminSession = await verifyAdminSession();
  if (adminSession) return true;
  const acadSession = await getAcademySession();
  return acadSession?.role === "staff_admin";
}

export async function GET() {
  if (!(await isStaffAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getAcademyStore();
  return NextResponse.json({
    courses: store.courses,
    cohorts: store.cohorts,
    enrollments: store.enrollments,
    payments: store.payments,
    quotes: store.quotes,
    organizations: store.organizations,
    certificates: store.certificates,
  });
}

export async function PATCH(req: Request) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }

  if (!(await isStaffAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const data = body as Record<string, unknown>;
    const action = asTrimmedString(data.action, 64);
    const store = getAcademyStore();
    const nowIso = new Date().toISOString();

    if (action === "verify_payment") {
      const paymentId = asTrimmedString(data.paymentId, 80);
      const payment = store.payments.find((p) => p.id === paymentId);
      if (!payment) {
        return NextResponse.json({ error: "Payment record not found." }, { status: 404 });
      }

      payment.status = "verified";
      payment.verifiedBy = "Staff Admin";
      payment.verifiedAt = nowIso;

      if (payment.enrollmentId) {
        const enr = store.enrollments.find((e) => e.id === payment.enrollmentId);
        if (enr) {
          const allEnrPayments = store.payments.filter(
            (p) => p.enrollmentId === enr.id && p.status === "verified"
          );
          const totalVerifiedUsd = allEnrPayments.reduce((sum, p) => sum + p.amountUsd, 0);
          enr.amountPaidUsd = totalVerifiedUsd;
          if (totalVerifiedUsd >= enr.totalUsd) {
            enr.paymentStatus = "paid_in_full";
          } else if (totalVerifiedUsd > 0) {
            enr.paymentStatus = "deposit_paid";
          }
        }
      }

      if (payment.quoteId) {
        const quote = store.quotes.find((q) => q.id === payment.quoteId);
        if (quote) quote.status = "paid";
      }

      if (payment.organizationId) {
        const org = store.organizations.find((o) => o.id === payment.organizationId);
        if (org) org.billingStatus = "paid";
      }

      return NextResponse.json({ success: true, payment });
    }

    if (action === "approve_quote") {
      const quoteId = asTrimmedString(data.quoteId, 80);
      const quote = store.quotes.find((q) => q.id === quoteId);
      if (!quote) {
        return NextResponse.json({ error: "Quote not found." }, { status: 404 });
      }
      quote.status = "approved";
      const org = store.organizations.find((o) => o.id === quote.organizationId);
      if (org && org.billingStatus === "quote_pending") {
        org.billingStatus = "net30_invoiced";
      }
      return NextResponse.json({ success: true, quote });
    }

    if (action === "issue_certificate") {
      const enrollmentId = asTrimmedString(data.enrollmentId, 80);
      const enr = store.enrollments.find((e) => e.id === enrollmentId);
      if (!enr) {
        return NextResponse.json({ error: "Enrollment not found." }, { status: 404 });
      }
      const course = store.courses.find((c) => c.id === enr.courseId);
      if (!course) {
        return NextResponse.json({ error: "Course not found." }, { status: 404 });
      }

      let cert = enr.certificateCode
        ? store.certificates.find((c) => c.code === enr.certificateCode)
        : undefined;

      if (!cert) {
        const code = createNewReference("ETS-CERT");
        cert = {
          code,
          enrollmentId: enr.id,
          learnerName: enr.learnerName,
          learnerEmail: enr.learnerEmail,
          courseTitle: course.title,
          category: course.category,
          durationWeeks: course.durationWeeks,
          issuedAt: nowIso,
          instructorName: "Principal Solutions Architecture Board",
        };
        store.certificates.unshift(cert);
        enr.certificateCode = code;
        enr.status = "completed";
      }
      return NextResponse.json({ success: true, certificate: cert, enrollment: enr });
    }

    if (action === "update_course") {
      const courseId = asTrimmedString(data.courseId, 80);
      const course = store.courses.find((c) => c.id === courseId);
      if (!course) {
        return NextResponse.json({ error: "Course not found." }, { status: 404 });
      }
      if (typeof data.tuitionUsd === "number" && data.tuitionUsd >= 100) {
        course.tuitionUsd = data.tuitionUsd;
      }
      if (data.status === "active" || data.status === "draft") {
        course.status = data.status;
      }
      return NextResponse.json({ success: true, course });
    }

    return NextResponse.json({ error: "Unsupported admin action." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Admin operation failed." }, { status: 500 });
  }
}
