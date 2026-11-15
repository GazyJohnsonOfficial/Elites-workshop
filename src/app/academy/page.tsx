import { getAcademySession } from "@/lib/academyAuth";
import { getAcademyStore, getCourseCompletionSummaries } from "@/lib/academyStore";
import { AcademyCatalogClient } from "@/components/academy/AcademyCatalogClient";

export const dynamic = "force-dynamic";

export default async function AcademyHomePage() {
  const store = getAcademyStore();
  const activeCourses = store.courses.filter((c) => c.status === "active");
  const session = await getAcademySession();
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
    />
  );
}
