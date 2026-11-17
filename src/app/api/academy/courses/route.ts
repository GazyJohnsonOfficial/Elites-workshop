import { NextResponse } from "next/server";
import { getAcademySession } from "@/lib/academyAuth";
import {
  getAcademyStore,
  normalizeAcademyCategory,
  normalizeDeliveryMode,
  type AcademyCategory,
  type Course,
  type DeliveryMode,
  type SkillLevel,
} from "@/lib/academyStore";
import { asTrimmedString, isSameOriginRequest } from "@/lib/security";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const mode = searchParams.get("mode");
  const level = searchParams.get("level");
  const q = searchParams.get("q")?.trim().toLowerCase() || "";

  const store = getAcademyStore();
  let courses = store.courses.filter((c) => c.status === "active");

  if (category && category !== "all") {
    courses = courses.filter((c) => c.category === category);
  }
  if (mode && mode !== "all") {
    courses = courses.filter((c) => c.deliveryMode === mode);
  }
  if (level && level !== "all") {
    courses = courses.filter((c) => c.level === level);
  }
  if (q) {
    courses = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tools.some((t) => t.toLowerCase().includes(q)) ||
        c.roles.some((r) => r.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    courses,
    cohorts: store.cohorts,
  });
}

export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }

  const session = await getAcademySession();
  if (!session || session.role !== "staff_admin") {
    return NextResponse.json({ error: "Staff admin access required." }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const data = body as Record<string, unknown>;
    const title = asTrimmedString(data.title, 140);
    const subtitle = asTrimmedString(data.subtitle, 220);
    const description = asTrimmedString(data.description, 1000);
    const category = asTrimmedString(data.category, 60) as AcademyCategory;
    const deliveryMode = asTrimmedString(data.deliveryMode, 60) as DeliveryMode;
    const level = asTrimmedString(data.level, 40) as SkillLevel;
    const durationWeeks = Number(data.durationWeeks) || 8;
    const sessionCount = Number(data.sessionCount) || durationWeeks * 3;
    const tuitionUsd = Number(data.tuitionUsd) || 1000;
    const toolsRaw = asTrimmedString(data.tools, 300);
    const rolesRaw = asTrimmedString(data.roles, 300);

    if (title.length < 4 || subtitle.length < 6) {
      return NextResponse.json({ error: "Title and subtitle are required." }, { status: 400 });
    }

    const slugBase = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const store = getAcademyStore();
    const slug = store.courses.some((c) => c.slug === slugBase)
      ? `${slugBase}-${Date.now().toString().slice(-4)}`
      : slugBase;

    const courseId = `course-${Date.now()}`;
    const newCourse: Course = {
      id: courseId,
      slug,
      title,
      subtitle,
      category: normalizeAcademyCategory(category),
      deliveryMode: normalizeDeliveryMode(deliveryMode),
      level: ["Beginner", "Intermediate", "Advanced"].includes(level) ? level : "Intermediate",
      durationWeeks: Math.max(1, Math.min(52, durationWeeks)),
      sessionCount: Math.max(1, Math.min(200, sessionCount)),
      tuitionUsd: Math.max(100, Math.min(25000, tuitionUsd)),
      heroImage: category === "Data & BI" ? "/academy/prog-data-bi.jpg" : "/academy/prog-cloud-devops.jpg",
      tools: toolsRaw
        ? toolsRaw.split(",").map((s) => s.trim()).filter(Boolean)
        : ["SQL", "Cloud Architecture"],
      roles: rolesRaw
        ? rolesRaw.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Solutions Specialist"],
      description: description || subtitle,
      featured: false,
      status: "active",
      createdAt: new Date().toISOString(),
      modules: [
        {
          id: `mod-${Date.now()}-1`,
          order: 1,
          weekLabel: `Weeks 1–${Math.max(2, Math.floor(durationWeeks / 2))}`,
          title: "Core Architecture & Foundations",
          summary: "Hands-on production fundamentals, configuration hygiene, and tooling setup.",
          durationHours: Math.max(4, Math.round(sessionCount / 2)),
          objectives: ["Configure production-grade tooling", "Execute core architecture labs"],
          labTask: "Complete foundational lab workflow and submit repository checkpoint.",
          resourceNote: "Instructor Workshop Deck + Lab Environment",
        },
        {
          id: `mod-${Date.now()}-2`,
          order: 2,
          weekLabel: `Weeks ${Math.max(3, Math.floor(durationWeeks / 2) + 1)}–${durationWeeks}`,
          title: "Applied Production Capstone",
          summary: "End-to-end delivery project reviewed by practicing architects.",
          durationHours: Math.max(4, Math.round(sessionCount / 2)),
          objectives: ["Build and validate end-to-end deliverable", "Defend technical choices"],
          labTask: "Submit final capstone project for evaluation and certificate issuance.",
          resourceNote: "Capstone Evaluation Rubric",
        },
      ],
    };

    store.courses.unshift(newCourse);
    return NextResponse.json({ success: true, course: newCourse });
  } catch {
    return NextResponse.json({ error: "Failed to create course." }, { status: 500 });
  }
}
