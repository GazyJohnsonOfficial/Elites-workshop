import type { Metadata } from "next";
import { getAcademyStore } from "@/lib/academyStore";
import { AcademyGetStarted } from "@/components/academy/AcademyGetStarted";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get Started | Elites Tech Academy",
  description:
    "Map your engineering career pathway or configure corporate team training with Elites Tech Academy.",
};

export default function AcademyGetStartedPage() {
  const store = getAcademyStore();
  const activeCourses = store.courses.filter((c) => c.status === "active");

  return (
    <main id="main" className="acad-auth-section">
      <AcademyGetStarted courses={activeCourses} />
    </main>
  );
}
