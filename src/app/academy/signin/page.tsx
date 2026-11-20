import type { Metadata } from "next";
import { AcademyAuthPanel } from "@/components/academy/AcademyAuthPanel";
import { getAcademyStore, isIndividualCourse } from "@/lib/academyStore";

export const metadata: Metadata = {
  title: "Individual Sign In | Elites Tech Academy",
  description:
    "Sign in to your Elites Tech Academy individual learner workspace to access modules, labs, and verified credentials.",
};

export default function AcademySignInPage() {
  const store = getAcademyStore();
  const individualCourseOptions = store.courses
    .filter((c) => c.status === "active" && isIndividualCourse(c))
    .map((c) => ({
      id: c.id,
      label: `${c.title} (${c.durationWeeks} Weeks)`,
    }));

  return (
    <main id="main" className="acad-auth-section">
      <AcademyAuthPanel
        initialAuthMode="signin"
        courses={individualCourseOptions}
      />
    </main>
  );
}
