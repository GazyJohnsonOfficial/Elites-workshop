import type { Metadata } from "next";
import { AcademyAuthPanel } from "@/components/academy/AcademyAuthPanel";
import "@/styles/academy.css";

export const metadata: Metadata = {
  title: "Sign In | Elites Tech Solutions",
  description:
    "Sign in to your Elites Tech Academy learner workspace, corporate team telemetry portal, or staff operations console.",
};

export default function SignInPage() {
  return (
    <div className="acad-shell">
      <main id="main" className="acad-auth-section">
        <AcademyAuthPanel initialAuthMode="signin" />
      </main>
    </div>
  );
}
