import type { Metadata } from "next";
import { AcademyHeader } from "@/components/academy/AcademyHeader";
import { AcademyFooter } from "@/components/academy/AcademyFooter";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Elites Tech Academy | Enterprise Cloud, Data & Cybersecurity Learning Portal`,
  description: `Role-based technical cohorts, multi-currency tuition plans, corporate team enablement, and verifiable credentials by ${SITE_CONFIG.COMPANY}.`,
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="acad-shell">
      <AcademyHeader />
      <div className="acad-main">{children}</div>
      <AcademyFooter />
    </div>
  );
}
