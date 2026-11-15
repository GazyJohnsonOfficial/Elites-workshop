import { NextResponse } from "next/server";
import { getAcademySession } from "@/lib/academyAuth";
import {
  createNewReference,
  getAcademyStore,
  getCourseCompletionSummaries,
} from "@/lib/academyStore";
import { asTrimmedString, isSameOriginRequest } from "@/lib/security";

export async function GET() {
  const session = await getAcademySession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const store = getAcademyStore();
  const enrollments = store.enrollments.filter(
    (e) =>
      e.userId === session.userId ||
      e.learnerEmail.toLowerCase() === session.email.toLowerCase()
  );

  const enrollmentIds = new Set(enrollments.map((e) => e.id));
  const payments = store.payments.filter(
    (p) => p.enrollmentId && enrollmentIds.has(p.enrollmentId)
  );
  const certificates = store.certificates.filter(
    (c) => enrollmentIds.has(c.enrollmentId)
  );
  const courseProgress = getCourseCompletionSummaries(
    store,
    session.userId,
    session.email
  );
  const progressByCourse = new Map(courseProgress.map((p) => [p.courseId, p]));

  const enriched = enrollments.map((enr) => {
    const course = store.courses.find((c) => c.id === enr.courseId) || null;
    const cohort = enr.cohortId
      ? store.cohorts.find((c) => c.id === enr.cohortId) || null
      : null;
    const cert = enr.certificateCode
      ? certificates.find((c) => c.code === enr.certificateCode) || null
      : null;
    const summary = progressByCourse.get(enr.courseId);
    return {
      ...enr,
      course,
      cohort,
      certificate: cert,
      completedCount: summary?.completedCount ?? enr.completedModuleIds.length,
      totalModules: summary?.totalModules ?? (course?.modules.length ?? 0),
      completionPct: summary?.completionPct ?? 0,
    };
  });

  return NextResponse.json({
    user: session,
    enrollments: enriched,
    courseProgress,
    payments,
    certificates,
  });
}

export async function PATCH(req: Request) {
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
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const data = body as Record<string, unknown>;
    const enrollmentId = asTrimmedString(data.enrollmentId, 80);
    const toggleModuleId = asTrimmedString(data.toggleModuleId, 80);
    const capstoneUrl = typeof data.capstoneUrl === "string" ? asTrimmedString(data.capstoneUrl, 300) : undefined;
    const capstoneNotes = typeof data.capstoneNotes === "string" ? asTrimmedString(data.capstoneNotes, 1000) : undefined;
    const claimCertificate = data.claimCertificate === true;

    const store = getAcademyStore();
    const enrollment = store.enrollments.find(
      (e) =>
        e.id === enrollmentId &&
        (e.userId === session.userId ||
          e.learnerEmail.toLowerCase() === session.email.toLowerCase() ||
          session.role === "staff_admin")
    );

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found." }, { status: 404 });
    }

    const course = store.courses.find((c) => c.id === enrollment.courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    if (toggleModuleId) {
      const validModule = course.modules.some((m) => m.id === toggleModuleId);
      if (validModule) {
        if (enrollment.completedModuleIds.includes(toggleModuleId)) {
          enrollment.completedModuleIds = enrollment.completedModuleIds.filter(
            (id) => id !== toggleModuleId
          );
        } else {
          enrollment.completedModuleIds = [...enrollment.completedModuleIds, toggleModuleId];
        }
      }
    }

    if (capstoneUrl !== undefined) {
      enrollment.capstoneUrl = capstoneUrl;
    }
    if (capstoneNotes !== undefined) {
      enrollment.capstoneNotes = capstoneNotes;
    }

    enrollment.lastActiveAt = new Date().toISOString();

    const allModulesDone =
      course.modules.length > 0 &&
      course.modules.every((m) => enrollment.completedModuleIds.includes(m.id));
    const hasCapstone = enrollment.capstoneUrl.trim().length >= 5;

    if (allModulesDone && hasCapstone && enrollment.status !== "completed") {
      enrollment.status = "completed";
    }

    let issuedCertificate = enrollment.certificateCode
      ? store.certificates.find((c) => c.code === enrollment.certificateCode) || null
      : null;

    if (claimCertificate) {
      if (!allModulesDone) {
        return NextResponse.json(
          { error: "Complete all course modules before claiming your certificate." },
          { status: 400 }
        );
      }
      if (!hasCapstone) {
        return NextResponse.json(
          { error: "Submit your capstone GitHub or portfolio link before claiming." },
          { status: 400 }
        );
      }

      if (!issuedCertificate) {
        const code = createNewReference("ETS-CERT");
        issuedCertificate = {
          code,
          enrollmentId: enrollment.id,
          learnerName: enrollment.learnerName,
          learnerEmail: enrollment.learnerEmail,
          courseTitle: course.title,
          category: course.category,
          durationWeeks: course.durationWeeks,
          issuedAt: new Date().toISOString(),
          instructorName: "Principal Solutions Architecture Board",
        };
        store.certificates.unshift(issuedCertificate);
        enrollment.certificateCode = code;
        enrollment.status = "completed";
      }
    }

    return NextResponse.json({
      success: true,
      enrollment,
      certificate: issuedCertificate,
    });
  } catch {
    return NextResponse.json({ error: "Unable to update learning progress." }, { status: 500 });
  }
}
