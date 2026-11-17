import type { Metadata } from "next";
import {
  AcademyHeader,
  type HeaderProgramItem,
} from "@/components/academy/AcademyHeader";
import { AcademyFooter } from "@/components/academy/AcademyFooter";
import { SITE_CONFIG } from "@/lib/config";
import { getAcademyStore } from "@/lib/academyStore";

export const metadata: Metadata = {
  title: `Elites Tech Academy | Enterprise Cloud, Data & Cybersecurity Learning Portal`,
  description: `Role-based engineering tracks, flexible regional tuition plans, corporate team enablement, and verifiable credentials by ${SITE_CONFIG.COMPANY}.`,
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = getAcademyStore();
  const programs: HeaderProgramItem[] = store.courses
    .filter((c) => c.status === "active")
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      category: c.category,
      level: c.level,
      durationWeeks: c.durationWeeks,
      tools: c.tools,
    }));

  return (
    <div className="acad-shell">
      <AcademyHeader programs={programs} />
      <div className="acad-main">{children}</div>
      <AcademyFooter />
    </div>
  );
}
