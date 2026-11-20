import type { Metadata } from "next";
import { getAcademyStore, isBusinessCourse } from "@/lib/academyStore";
import { getServerRegionContext } from "@/lib/serverCurrency";
import { CareerPathsClient } from "@/components/academy/CareerPathsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Corporate Team Pathways & Workforce Roadmaps | Elites Tech Academy",
  description:
    "Structured departmental upskilling pathways for Cloud Platform & Kubernetes SRE, Enterprise Data & BI, Zero-Trust DevSecOps, Cloud FinOps, and Workforce AI teams.",
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
