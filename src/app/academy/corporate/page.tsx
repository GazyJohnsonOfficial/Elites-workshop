import type { Metadata } from "next";
import { CorporatePortalClient } from "@/components/academy/CorporatePortalClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Corporate Team Portal | Elites Tech Academy",
  description:
    "Manage enterprise training seat quotas, assign staff to engineering cohorts, and monitor completion telemetry.",
};

export default function AcademyCorporatePage() {
  return <CorporatePortalClient />;
}
