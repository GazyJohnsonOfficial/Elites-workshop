import { NextResponse } from "next/server";
import { getAcademySession } from "@/lib/academyAuth";
import { createNewReference, getAcademyStore } from "@/lib/academyStore";
import { asTrimmedString, isSameOriginRequest, isValidEmail } from "@/lib/security";

export async function GET() {
  const session = await getAcademySession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const store = getAcademyStore();
  const org =
    (session.organizationId &&
      store.organizations.find((o) => o.id === session.organizationId)) ||
    store.organizations.find(
      (o) => o.billingEmail.toLowerCase() === session.email.toLowerCase()
    ) ||
    (session.role === "staff_admin" ? store.organizations[0] : undefined);

  if (!org) {
    return NextResponse.json({
      organization: null,
      quotes: [],
      teamEnrollments: [],
      courses: store.courses.filter((c) => c.status === "active"),
      cohorts: store.cohorts,
    });
  }

  const quotes = store.quotes.filter((q) => q.organizationId === org.id);
  const teamEnrollments = store.enrollments
    .filter((e) => e.organizationId === org.id)
    .map((enr) => {
      const course = store.courses.find((c) => c.id === enr.courseId);
      const totalModules = course?.modules.length || 1;
      const progressPercent = Math.round((enr.completedModuleIds.length / totalModules) * 100);
      return {
        ...enr,
        courseTitle: course?.title || "Unknown Course",
        progressPercent,
        totalModules,
      };
    });

  return NextResponse.json({
    organization: org,
    quotes,
    teamEnrollments,
    courses: store.courses.filter((c) => c.status === "active"),
    cohorts: store.cohorts,
  });
}

export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }

  const session = await getAcademySession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const data = body as Record<string, unknown>;
    const fullName = asTrimmedString(data.fullName, 120);
    const email = asTrimmedString(data.email, 254).toLowerCase();
    const phone = asTrimmedString(data.phone, 32) || "Corporate Assigned";
    const country = asTrimmedString(data.country, 80) || "United States";
    const courseId = asTrimmedString(data.courseId, 80);

    if (fullName.length < 2 || !isValidEmail(email) || !courseId) {
      return NextResponse.json(
        { error: "Provide employee full name, valid work email, and course." },
        { status: 400 }
      );
    }

    const store = getAcademyStore();
    const org =
      (session.organizationId &&
        store.organizations.find((o) => o.id === session.organizationId)) ||
      store.organizations.find(
        (o) => o.billingEmail.toLowerCase() === session.email.toLowerCase()
      ) ||
      (session.role === "staff_admin" ? store.organizations[0] : undefined);

    if (!org) {
      return NextResponse.json(
        { error: "No corporate seat account linked to your profile yet." },
        { status: 404 }
      );
    }

    if (org.seatsUsed >= org.seatQuota) {
      return NextResponse.json(
        { error: "All purchased seats are currently assigned. Request additional seats via Tuition & Quotes." },
        { status: 400 }
      );
    }

    const duplicate = store.enrollments.find(
      (e) =>
        e.organizationId === org.id &&
        e.learnerEmail.toLowerCase() === email &&
        e.courseId === courseId
    );
    if (duplicate) {
      return NextResponse.json(
        { error: "This team member is already assigned to the selected track." },
        { status: 400 }
      );
    }

    const course = store.courses.find((c) => c.id === courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const cohort = store.cohorts.find((c) => c.courseId === course.id && c.status === "open");

    let learner = store.users.find((u) => u.email.toLowerCase() === email);
    if (!learner) {
      learner = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        email,
        fullName,
        role: "learner",
        country,
        organizationId: org.id,
        createdAt: new Date().toISOString(),
      };
      store.users.push(learner);
    }

    const nowIso = new Date().toISOString();
    const newEnrollment = {
      id: `enr-corp-${Date.now()}`,
      reference: createNewReference("ETS-ACAD"),
      userId: learner.id,
      learnerName: fullName,
      learnerEmail: email,
      learnerPhone: phone,
      country,
      courseId: course.id,
      cohortId: cohort?.id,
      organizationId: org.id,
      paymentPlan: "corporate_seat" as const,
      currency: "USD" as const,
      totalUsd: course.tuitionUsd,
      amountPaidUsd: course.tuitionUsd,
      paymentStatus: "corporate_sponsored" as const,
      status: "active" as const,
      completedModuleIds: [],
      capstoneUrl: "",
      capstoneNotes: "",
      lastActiveAt: nowIso,
      createdAt: nowIso,
    };

    store.enrollments.unshift(newEnrollment);
    org.seatsUsed += 1;
    if (cohort && cohort.seatsTaken < cohort.seatCapacity) {
      cohort.seatsTaken += 1;
    }

    return NextResponse.json({
      success: true,
      enrollment: {
        ...newEnrollment,
        courseTitle: course.title,
        progressPercent: 0,
        totalModules: course.modules.length,
      },
      organization: org,
    });
  } catch {
    return NextResponse.json({ error: "Unable to assign team seat." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }

  const session = await getAcademySession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const enrollmentId = searchParams.get("enrollmentId");
    if (!enrollmentId) {
      return NextResponse.json({ error: "Enrollment ID required." }, { status: 400 });
    }

    const store = getAcademyStore();
    const idx = store.enrollments.findIndex((e) => e.id === enrollmentId);
    if (idx === -1) {
      return NextResponse.json({ error: "Enrollment not found." }, { status: 404 });
    }

    const enr = store.enrollments[idx];
    const org = store.organizations.find((o) => o.id === enr.organizationId);
    if (!org) {
      return NextResponse.json({ error: "Organization not found." }, { status: 404 });
    }

    const isAllowed =
      session.role === "staff_admin" ||
      session.organizationId === org.id ||
      org.billingEmail.toLowerCase() === session.email.toLowerCase();
    if (!isAllowed) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    store.enrollments.splice(idx, 1);
    org.seatsUsed = Math.max(0, org.seatsUsed - 1);

    return NextResponse.json({ success: true, organization: org });
  } catch {
    return NextResponse.json({ error: "Unable to revoke seat." }, { status: 500 });
  }
}
