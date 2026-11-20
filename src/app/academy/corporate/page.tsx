import type { Metadata } from "next";
import { getAcademySession } from "@/lib/academyAuth";
import { getAcademyStore } from "@/lib/academyStore";
import { getServerRegionContext } from "@/lib/serverCurrency";
import { CorporatePortalClient } from "@/components/academy/CorporatePortalClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "For Businesses & Engineering Teams | Elites Tech Academy",
  description:
    "Corporate IT, Cloud, Data, AI & Cybersecurity bootcamps, private cohorts, multi-seat team enrollment, Net-30 PO billing, and engineering lead telemetry.",
};

export default async function AcademyCorporatePage() {
  const store = getAcademyStore();
  const activeCourses = store.courses.filter((c) => c.status === "active");
  const session = await getAcademySession();
  const region = await getServerRegionContext();
  const isOrgAdmin = Boolean(
    session && (session.role === "org_admin" || session.role === "staff_admin")
  );

  return (
    <CorporatePortalClient
      initialCourses={activeCourses}
      initialAuthenticated={isOrgAdmin}
      initialCurrency={region.currency}
    />
  );
}
