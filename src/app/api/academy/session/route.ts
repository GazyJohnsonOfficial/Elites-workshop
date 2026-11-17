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
import { mapCountryNameToCurrency, normalizeCurrencyCode } from "@/lib/geoCurrency";

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
    const store = getAcademyStore();

    let user: AcademyUser | undefined;

    {
      const email = asTrimmedString(data.email, 254).toLowerCase();
      const fullName = asTrimmedString(data.fullName, 120);
      const password = asTrimmedString(data.password, 128);
      const phone = asTrimmedString(data.phone, 40) || "+233 53 353 4687";
      const requestedRole = asTrimmedString(data.role, 32);
      const country = asTrimmedString(data.country, 80) || "Ghana";
      const courseId = asTrimmedString(data.courseId, 80);
      const paymentPlan: "full" | "installment_2" =
        asTrimmedString(data.paymentPlan, 32) === "full" ? "full" : "installment_2";
      const rawCurrency = asTrimmedString(data.currency, 8);
      const currency: CurrencyCode =
        normalizeCurrencyCode(rawCurrency) || mapCountryNameToCurrency(country);

      const authMode = asTrimmedString(data.authMode, 32) || "signin";

      if (!isValidEmail(email)) {
        return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
      }

      user = store.users.find((u) => u.email.toLowerCase() === email);

      if (authMode === "signin") {
        if (!user || user.role === "staff_admin") {
          return NextResponse.json(
            { error: "No account found with this email address. Please register or apply first." },
            { status: 404 }
          );
        }

        if (!user.password || !password || password !== user.password) {
          return NextResponse.json(
            { error: "Invalid email or passphrase. Please try again." },
            { status: 401 }
          );
        }
      } else {
        // Register mode: prevent duplicate registration
        if (user) {
          return NextResponse.json(
            { error: "An account with this email already exists. Please sign in instead." },
            { status: 409 }
          );
        }

        if (!password || password.length < 6) {
          return NextResponse.json(
            { error: "Passphrase must be at least 6 characters long." },
            { status: 400 }
          );
        }

        const resolvedName =
          fullName.length >= 2
            ? fullName
            : email
              .split("@")[0]
              .replace(/[._-]+/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());

        const safeRole: UserRole =
          requestedRole === "org_admin" ? "org_admin" : "learner";
        const organizationName = asTrimmedString(data.organizationName, 140);

        user = {
          id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          email,
          fullName: resolvedName,
          role: safeRole,
          country,
          password,
          createdAt: new Date().toISOString(),
        };

        // Provision a workspace organization for new corporate administrators
        if (safeRole === "org_admin") {
          const domainPart = email.split("@")[1]?.split(".")[0] || "";
          const inferredCompany =
            organizationName.length >= 2
              ? organizationName
              : domainPart && domainPart !== "gmail" && domainPart !== "yahoo"
                ? `${domainPart.charAt(0).toUpperCase()}${domainPart.slice(1)} Group`
                : `${resolvedName} Organization`;
          const newOrgId = `org-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
          store.organizations.push({
            id: newOrgId,
            reference: createNewReference("ETS-CORP"),
            name: inferredCompany,
            billingEmail: email,
            contactName: resolvedName,
            phone,
            region: country,
            seatQuota: 5,
            seatsUsed: 0,
            billingStatus: "quote_pending",
            createdAt: new Date().toISOString(),
          });
          user.organizationId = newOrgId;
        }

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
