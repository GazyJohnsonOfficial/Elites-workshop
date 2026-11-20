import type { Metadata } from "next";
import { getAcademyStore, isBusinessCourse } from "@/lib/academyStore";
import { getServerRegionContext } from "@/lib/serverCurrency";
import { CareerPathsClient } from "@/components/academy/CareerPathsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Enterprise Workforce Pathways & Capability Strategy | Elites Tech Academy",
  description:
    "Explore organizational capability tracks, talent market economics, maturity ladders, team expertise standards, and recommended corporate programs for Cloud, Data, DevSecOps, FinOps, and Workforce AI.",
};

export default async function BusinessCareerPathsPage() {
  const store = getAcademyStore();
  const businessCourses = store.courses.filter(
    (c) => c.status === "active" && isBusinessCourse(c)
  );
  const region = await getServerRegionContext();

  return (
    <CareerPathsClient
      audience="business"
      courses={businessCourses}
      initialCurrency={region.currency}
    />
  );
}
