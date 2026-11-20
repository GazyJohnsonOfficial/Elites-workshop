import { NextResponse } from "next/server";
import {
  createNewReference,
  getAcademyStore,
  type AcademyLead,
} from "@/lib/academyStore";
import { sendEnquiryEmails } from "@/lib/mail";
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
    const rawType = asTrimmedString(data.type, 40);
    const type: AcademyLead["type"] =
      rawType === "corporate_consultation"
        ? "corporate_consultation"
        : "syllabus_download";

    const fullName = asTrimmedString(data.fullName, 120);
    const email = asTrimmedString(data.email, 254).toLowerCase();
    const phone = asTrimmedString(data.phone, 40);
    const organizationName = asTrimmedString(data.organizationName, 140);
    const teamSize = asTrimmedString(data.teamSize, 40);
    const courseId = asTrimmedString(data.courseId, 80);
    const courseTitle = asTrimmedString(data.courseTitle, 160);
    const experienceLevel = asTrimmedString(data.experienceLevel, 80);
    const objective = asTrimmedString(data.objective, 140);
    const notes = asTrimmedString(data.notes, 800);
    const requestAdvisorCall = Boolean(data.requestAdvisorCall);

    if (fullName.length < 2 || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter your full name and a valid email address." },
        { status: 400 }
      );
    }

    if (type === "corporate_consultation" && organizationName.length < 2) {
      return NextResponse.json(
        { error: "Please enter your organization or company name." },
        { status: 400 }
      );
    }

    const store = getAcademyStore();
    const reference = createNewReference(
      type === "corporate_consultation" ? "ETS-BIZ" : "ETS-SYL"
    );
    const nowIso = new Date().toISOString();

    const lead: AcademyLead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      reference,
      type,
      fullName,
      email,
      phone,
      organizationName: organizationName || undefined,
      teamSize: teamSize || undefined,
      courseId: courseId || undefined,
      courseTitle: courseTitle || undefined,
      experienceLevel: experienceLevel || undefined,
      objective: objective || undefined,
      notes: notes || undefined,
      requestAdvisorCall,
      createdAt: nowIso,
    };

    store.leads.unshift(lead);

    const summaryLines = [
      type === "corporate_consultation"
        ? `Corporate Training Scoping Request (${teamSize || "Team Inquiry"})`
        : `Curriculum Syllabus Request: ${courseTitle || courseId || "Academy Program"}`,
      experienceLevel ? `Experience: ${experienceLevel}` : "",
      objective ? `Objective: ${objective}` : "",
      requestAdvisorCall ? "Requested optional 15-minute advisor consultation." : "",
      notes ? `Notes: ${notes}` : "",
    ].filter(Boolean);

    sendEnquiryEmails({
      reference,
      fullName,
      email,
      phone: phone || "Not provided",
      organisation: organizationName || "Individual Learner",
      region: "Academy Portal",
      topic:
        type === "corporate_consultation"
          ? "Corporate Team Training Scoping"
          : `Syllabus Brief: ${courseTitle || "Academy Track"}`,
      message: summaryLines.join("\n"),
      createdAt: new Date(nowIso),
    }).catch((err) => console.error("Academy lead email dispatch error:", err));

    return NextResponse.json({
      success: true,
      reference,
      lead,
    });
  } catch (err) {
    console.error("Academy lead capture error:", err);
    return NextResponse.json(
      { error: "Unable to process your request right now. Please try again." },
      { status: 500 }
    );
  }
}
