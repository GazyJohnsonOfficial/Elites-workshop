import type { Metadata } from "next";
import { getAcademyStore, isIndividualCourse } from "@/lib/academyStore";
import { getServerRegionContext } from "@/lib/serverCurrency";
import { CareerPathsClient } from "@/components/academy/CareerPathsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Individual Career Paths & Tech Roadmaps | Elites Tech Academy",
  description:
    "Step-by-step IT, Data Analysis, Cloud & DevOps, Cybersecurity SOC, Python, and Applied AI career paths for individual learners with portfolio capstones and verified credentials.",
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
