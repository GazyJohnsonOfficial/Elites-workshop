import type { Metadata } from "next";
import { AcademyAuthPanel } from "@/components/academy/AcademyAuthPanel";
import "@/styles/academy.css";

export const metadata: Metadata = {
  title: "Register & Apply | Elites Tech Solutions",
  description:
    "Start your Elites Tech Academy application or register a new student or corporate workspace account.",
};

export default function RegisterPage() {
  return (
    <div className="acad-shell">
      <main id="main" className="acad-auth-section">
        <AcademyAuthPanel initialAuthMode="register" />
      </main>
    </div>
  );
}
