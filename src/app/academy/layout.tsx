import type { Metadata } from "next";
import {
  AcademyHeader,
  type HeaderProgramItem,
} from "@/components/academy/AcademyHeader";
import { SITE_CONFIG } from "@/lib/config";
import { getAcademyStore } from "@/lib/academyStore";

export const metadata: Metadata = {
  title: `Elites Tech Academy | IT, Cloud, Data, AI & Cybersecurity Courses`,
  description: `Practical online IT, Data Analysis, Cloud, Cybersecurity, Python, and Applied AI courses for individuals and corporate engineering teams by ${SITE_CONFIG.COMPANY}.`,
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
      deliveryMode: c.deliveryMode,
      audience: c.audience,
      tools: c.tools,
    }));

  return (
    <div className="acad-shell">
      <AcademyHeader programs={programs} />
      <div className="acad-main">{children}</div>
    </div>
  );
}
