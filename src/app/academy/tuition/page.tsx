import type { Metadata } from "next";
import { getAcademyStore } from "@/lib/academyStore";
import { TuitionEngineClient } from "@/components/academy/TuitionEngineClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tuition Calculator & Corporate Quotes | Elites Tech Academy",
  description:
    "Interactive USD, GHS, and GBP tuition calculator, 2-installment enrollment plan, and corporate seat-pack quote builder.",
};

export default async function AcademyTuitionPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; cohort?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const store = getAcademyStore();
  const activeCourses = store.courses.filter((c) => c.status === "active");

  return (
    <TuitionEngineClient
      courses={activeCourses}
      cohorts={store.cohorts}
      initialCourseId={params.course || activeCourses[0]?.id || ""}
      initialCohortId={params.cohort || ""}
      initialMode={params.mode === "corporate" ? "corporate" : "individual"}
    />
  );
}
