import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Reference",
    "Full Name",
    "Email",
    "Phone",
    "Country",
    "Job Title",
    "Organisation",
    "Experience",
    "Tools",
    "Goals",
    "Source",
    "Marketing Consent",
    "Status",
    "Date Registered",
  ];

  const rows = registrations.map((r) => [
    `"${r.reference}"`,
    `"${r.fullName.replace(/"/g, '""')}"`,
    `"${r.email}"`,
    `"${r.phone}"`,
    `"${r.country.replace(/"/g, '""')}"`,
    `"${r.jobTitle.replace(/"/g, '""')}"`,
    `"${(r.organisation || "").replace(/"/g, '""')}"`,
    `"${r.experience}"`,
    `"${(r.tools || "").replace(/"/g, '""')}"`,
    `"${(r.goals || "").replace(/"/g, '""')}"`,
    `"${(r.source || "").replace(/"/g, '""')}"`,
    r.marketingConsent ? "Yes" : "No",
    r.status,
    `"${r.createdAt.toISOString()}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="elites-tech-registrations-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

