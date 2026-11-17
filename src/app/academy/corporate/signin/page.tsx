import type { Metadata } from "next";
import { AcademyAuthPanel } from "@/components/academy/AcademyAuthPanel";

export const metadata: Metadata = {
  title: "Corporate Sign In | Elites Tech Academy",
  description:
    "Sign in to your organization administrator workspace to manage enterprise seat allocations, custom team cohorts, and learner telemetry.",
};

export default function CorporateSignInPage() {
  return (
    <main id="main" className="acad-auth-section">
      <AcademyAuthPanel defaultRole="org_admin" initialAuthMode="signin" />
    </main>
  );
}
