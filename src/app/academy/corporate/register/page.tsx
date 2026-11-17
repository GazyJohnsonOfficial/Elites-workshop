import type { Metadata } from "next";
import { AcademyAuthPanel } from "@/components/academy/AcademyAuthPanel";

export const metadata: Metadata = {
  title: "Corporate Registration | Elites Tech Academy",
  description:
    "Create an organization administrator account to manage team training seats, custom cohorts, and invoices.",
};

export default function CorporateRegisterPage() {
  return (
    <main id="main" className="acad-auth-section">
      <AcademyAuthPanel defaultRole="org_admin" initialAuthMode="register" />
    </main>
  );
}
