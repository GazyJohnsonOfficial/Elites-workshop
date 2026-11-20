import type { Metadata } from "next";
import { AcademyAuthPanel } from "@/components/academy/AcademyAuthPanel";
import { getAcademyStore, isIndividualCourse } from "@/lib/academyStore";

export const metadata: Metadata = {
  title: "Register & Apply | Elites Tech Academy",
  description:
    "Create your Elites Tech Academy learner account and apply for an upcoming IT, Cloud, Data, AI, or Cybersecurity track.",
};

export default function AcademyRegisterPage() {
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
        initialAuthMode="register"
        courses={individualCourseOptions}
      />
    </main>
  );
}
