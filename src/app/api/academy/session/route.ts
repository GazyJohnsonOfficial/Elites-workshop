import { NextResponse } from "next/server";
import { createAcademySession, clearAcademySession, getAcademySession } from "@/lib/academyAuth";
import {
  createNewReference,
  formatCurrencyAmount,
  getAcademyStore,
  type AcademyUser,
  type CurrencyCode,
  type UserRole,
} from "@/lib/academyStore";
import { asTrimmedString, isSameOriginRequest, isValidEmail } from "@/lib/security";

export async function GET() {
  const session = await getAcademySession();
  return NextResponse.json({ user: session });
}

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
    const demoRole = asTrimmedString(data.demoRole, 32);
    const store = getAcademyStore();

    let user: AcademyUser | undefined;

    if (demoRole === "learner") {
      user = store.users.find((u) => u.id === "user-learner-demo");
    } else if (demoRole === "org_admin") {
      user = store.users.find((u) => u.id === "user-corp-demo");
    } else if (demoRole === "staff_admin") {
      user = store.users.find((u) => u.id === "user-staff-demo");
    } else {
      const email = asTrimmedString(data.email, 254).toLowerCase();
      const fullName = asTrimmedString(data.fullName, 120);
      const password = asTrimmedString(data.password, 128);
      const phone = asTrimmedString(data.phone, 40) || "+233 53 353 4687";
      const requestedRole = asTrimmedString(data.role, 32);
      const country = asTrimmedString(data.country, 80) || "Ghana";
      const courseId = asTrimmedString(data.courseId, 80);
      const paymentPlan: "full" | "installment_2" =
        asTrimmedString(data.paymentPlan, 32) === "full" ? "full" : "installment_2";
      const rawCurrency = asTrimmedString(data.currency, 8).toUpperCase();
      const currency: CurrencyCode =
        rawCurrency === "GHS" || rawCurrency === "GBP" ? rawCurrency : "USD";

      if (!isValidEmail(email)) {
        return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
      }

      user = store.users.find((u) => u.email.toLowerCase() === email);
      if (!user) {
        const resolvedName =
          fullName.length >= 2
            ? fullName
            : email
                .split("@")[0]
                .replace(/[._-]+/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());

        const safeRole: UserRole =
          requestedRole === "org_admin" ? "org_admin" : "learner";

        user = {
          id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          email,
          fullName: resolvedName,
          role: safeRole,
          country,
          password: password || undefined,
          createdAt: new Date().toISOString(),
        };
        store.users.push(user);
        // Auto-link any existing enrollments matching this email
        for (const enr of store.enrollments) {
          if (enr.learnerEmail.toLowerCase() === email) {
            enr.userId = user.id;
            if (enr.organizationId && !user.organizationId && safeRole === "org_admin") {
              user.organizationId = enr.organizationId;
            }
          }
        }
      } else if (password && !user.password) {
        user.password = password;
      }

      // If registering with a selected courseId (or if learner has zero enrollments and courseId is provided), provision enrollment
      const targetCourseId = courseId || (data.authMode === "register" ? "course-data-bi" : "");
      if (targetCourseId && user.role === "learner") {
        const existingEnr = store.enrollments.find(
          (e) =>
            (e.userId === user!.id || e.learnerEmail.toLowerCase() === email) &&
            e.courseId === targetCourseId
        );
        if (!existingEnr) {
          const course =
            store.courses.find((c) => c.id === targetCourseId) || store.courses[0];
          if (course) {
            const openCohort = store.cohorts.find(
              (c) => c.courseId === course.id && c.status === "open"
            );
            const enrollmentId = `enr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
            const nowIso = new Date().toISOString();
            store.enrollments.unshift({
              id: enrollmentId,
              reference: createNewReference("ETS-ACAD"),
              userId: user.id,
              learnerName: user.fullName,
              learnerEmail: user.email,
              learnerPhone: phone,
              country: user.country,
              courseId: course.id,
              cohortId: openCohort?.id,
              paymentPlan,
              currency,
              totalUsd: course.tuitionUsd,
              amountPaidUsd: 0,
              paymentStatus: "pending",
              status: "active",
              completedModuleIds: [],
              capstoneUrl: "",
              capstoneNotes: "",
              lastActiveAt: nowIso,
              createdAt: nowIso,
            });

            const firstInstallmentUsd =
              paymentPlan === "installment_2"
                ? Math.ceil(course.tuitionUsd / 2)
                : course.tuitionUsd;

            store.payments.unshift({
              id: `pay-${Date.now()}-1`,
              reference: createNewReference("ETS-PAY"),
              enrollmentId,
              payerName: user.fullName,
              payerEmail: user.email,
              description:
                paymentPlan === "installment_2"
                  ? `${course.title} · Installment 1 of 2`
                  : `${course.title} · Full Tuition`,
              installmentNumber: 1,
              currency,
              amountUsd: firstInstallmentUsd,
              amountLocalFormatted: formatCurrencyAmount(firstInstallmentUsd, currency),
              channel: "Bank Transfer",
              status: "pending",
              createdAt: nowIso,
            });
          }
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Unable to locate account." }, { status: 404 });
    }

    const session = await createAcademySession(user);
    return NextResponse.json({ success: true, user: session });
  } catch {
    return NextResponse.json({ error: "Sign-in failed. Please try again." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }
  await clearAcademySession();
  return NextResponse.json({ success: true });
}
