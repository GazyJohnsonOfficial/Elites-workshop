import type { Metadata } from "next";
import { AcademyAuthPanel } from "@/components/academy/AcademyAuthPanel";

export const metadata: Metadata = {
  title: "Sign In | Elites Tech Academy",
  description:
    "Sign in to your Elites Tech Academy learner workspace, corporate team telemetry portal, or cohort administration console.",
};

export default function AcademySignInPage() {
  return (
    <main id="main" className="acad-auth-section">
      <AcademyAuthPanel initialAuthMode="signin" />
    </main>
  );
}
