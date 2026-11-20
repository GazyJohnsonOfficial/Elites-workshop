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
  searchParams: Promise<{
    course?: string;
    cohort?: string;
    mode?: string;
    currency?: string;
    seats?: string;
    tier?: string;
  }>;
}) {
  const params = await searchParams;
  const store = getAcademyStore();
  const activeCourses = store.courses.filter((c) => c.status === "active");
  const region = await getServerRegionContext();
  const initialCurrency = normalizeCurrencyCode(params.currency) || region.currency;
  const matchedCourse = activeCourses.find((c) => c.id === params.course);
  const parsedSeats = params.seats ? Number(params.seats) : undefined;
  const initialSeats =
    parsedSeats && Number.isFinite(parsedSeats)
      ? Math.max(5, Math.min(250, Math.round(parsedSeats)))
      : undefined;
  const initialMode: "individual" | "corporate" =
    params.mode === "corporate" ||
    Boolean(params.tier) ||
    matchedCourse?.audience === "business"
      ? "corporate"
      : "individual";

  return (
    <TuitionEngineClient
      courses={activeCourses}
      cohorts={store.cohorts}
      initialCourseId={params.course || activeCourses[0]?.id || ""}
      initialCohortId={params.cohort || ""}
      initialMode={initialMode}
      initialCurrency={initialCurrency}
      initialCountry={region.defaultCountry}
      initialSeats={initialSeats}
      initialTier={params.tier || ""}
    />
  );
}
