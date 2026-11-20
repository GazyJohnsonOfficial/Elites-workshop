import type { Metadata } from "next";
import { getAcademySession } from "@/lib/academyAuth";
import { getAcademyStore, getCourseCompletionSummaries } from "@/lib/academyStore";
import { getServerRegionContext } from "@/lib/serverCurrency";
import { AcademyCatalogClient } from "@/components/academy/AcademyCatalogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IT, Data, Cloud, AI & Cybersecurity Courses for Individuals | Elites Tech Academy",
  description:
    "Build job-ready skills in IT Support, Data Analysis, Cloud & DevOps, Cybersecurity, Python, and Applied AI with live instructor-led cohorts, self-paced tracks, and flexible 2-part installments.",
};

export default async function AcademyHomePage() {
  const store = getAcademyStore();
  const activeCourses = store.courses.filter((c) => c.status === "active");
  const session = await getAcademySession();
  const region = await getServerRegionContext();
  const courseProgress = getCourseCompletionSummaries(
    store,
    session?.userId,
    session?.email
  );

  return (
    <AcademyCatalogClient
      courses={activeCourses}
      cohorts={store.cohorts}
      courseProgress={courseProgress}
      isAuthenticated={Boolean(session)}
      initialCurrency={region.currency}
    />
  );
}
