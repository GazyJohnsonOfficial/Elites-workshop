import type { Metadata } from "next";
import { getAcademySession } from "@/lib/academyAuth";
import { getAcademyStore } from "@/lib/academyStore";
import { CorporatePortalClient } from "@/components/academy/CorporatePortalClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "For Business & Engineering Teams | Elites Tech Academy",
  description:
    "Compare Team and Enterprise seat plans, preview engineering skill telemetry, allocate staff seats, and generate formal Net-30 quotes.",
};

export default async function AcademyCorporatePage() {
  const store = getAcademyStore();
  const activeCourses = store.courses.filter((c) => c.status === "active");
  const session = await getAcademySession();
  const isOrgAdmin = Boolean(session && (session.role === "org_admin" || session.role === "staff_admin"));

  return (
    <CorporatePortalClient
      initialCourses={activeCourses}
      initialAuthenticated={isOrgAdmin}
    />
  );
}
