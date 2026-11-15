import type { Metadata } from "next";
import { LearnerPortalClient } from "@/components/academy/LearnerPortalClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Learner Workspace & Progress | Elites Tech Academy",
  description:
    "Track your module completion, capstone deliverables, installment balance, and verifiable credentials.",
};

export default function AcademyLearnPage() {
  return <LearnerPortalClient />;
}
