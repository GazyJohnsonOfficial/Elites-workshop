import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { sanitizeCsvCell } from "@/lib/security";

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
    "Organization",
    "Experience",
    "Tools",
    "Goals",
    "Source",
    "Marketing Consent",
    "Status",
    "Date Registered",
  ];

  const rows = registrations.map((r) => [
    sanitizeCsvCell(r.reference),
    sanitizeCsvCell(r.fullName),
    sanitizeCsvCell(r.email),
    sanitizeCsvCell(r.phone),
    sanitizeCsvCell(r.country),
    sanitizeCsvCell(r.jobTitle),
    sanitizeCsvCell(r.organisation || ""),
    sanitizeCsvCell(r.experience),
    sanitizeCsvCell(r.tools || ""),
    sanitizeCsvCell(r.goals || ""),
    sanitizeCsvCell(r.source || ""),
    sanitizeCsvCell(r.marketingConsent ? "Yes" : "No"),
    sanitizeCsvCell(r.status),
    sanitizeCsvCell(r.createdAt.toISOString()),
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="elites-tech-registrations-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
