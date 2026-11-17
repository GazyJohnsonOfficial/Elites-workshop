import type { Metadata } from "next";
import { getAcademyStore } from "@/lib/academyStore";
import { normalizeCurrencyCode } from "@/lib/geoCurrency";
import { getServerRegionContext } from "@/lib/serverCurrency";
import { TuitionEngineClient } from "@/components/academy/TuitionEngineClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tuition Calculator & Corporate Quotes | Elites Tech Academy",
  description:
    "Regional tuition calculator, 2-installment enrollment plan, and corporate seat-pack quote builder.",
};

export default async function AcademyTuitionPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; cohort?: string; mode?: string; currency?: string }>;
}) {
  const params = await searchParams;
  const store = getAcademyStore();
  const activeCourses = store.courses.filter((c) => c.status === "active");
  const region = await getServerRegionContext();
  const initialCurrency = normalizeCurrencyCode(params.currency) || region.currency;

  return (
    <TuitionEngineClient
      courses={activeCourses}
      cohorts={store.cohorts}
      initialCourseId={params.course || activeCourses[0]?.id || ""}
      initialCohortId={params.cohort || ""}
      initialMode={params.mode === "corporate" ? "corporate" : "individual"}
      initialCurrency={initialCurrency}
      initialCountry={region.defaultCountry}
    />
  );
}
