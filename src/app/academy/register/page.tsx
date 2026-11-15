import type { Metadata } from "next";
import { AcademyAuthPanel } from "@/components/academy/AcademyAuthPanel";

export const metadata: Metadata = {
  title: "Register & Apply | Elites Tech Academy",
  description:
    "Start your Elites Tech Academy cohort application or register a new learner or corporate workspace account.",
};

export default function AcademyRegisterPage() {
  return (
    <main id="main" className="acad-auth-section">
      <AcademyAuthPanel initialAuthMode="register" />
    </main>
  );
}
