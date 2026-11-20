import type { Metadata } from "next";
import { getAcademyStore, isIndividualCourse } from "@/lib/academyStore";
import { getServerRegionContext } from "@/lib/serverCurrency";
import { CareerPathsClient } from "@/components/academy/CareerPathsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tech Career Paths, Job Market & Expertise Guide | Elites Tech Academy",
  description:
    "Explore high-demand career opportunities, compensation benchmarks, progression ladders, core technical expertise, and best-fit academy programs in Data & BI, Cloud & DevOps, Cybersecurity, and Applied AI.",
};

export default async function IndividualCareerPathsPage() {
  const store = getAcademyStore();
  const individualCourses = store.courses.filter(
    (c) => c.status === "active" && isIndividualCourse(c)
  );
  const region = await getServerRegionContext();

  return (
    <CareerPathsClient
      audience="individual"
      courses={individualCourses}
      initialCurrency={region.currency}
    />
  );
}
