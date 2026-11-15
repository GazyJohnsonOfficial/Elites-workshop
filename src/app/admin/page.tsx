import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { getAcademySession } from "@/lib/academyAuth";
import { getAcademyStore } from "@/lib/academyStore";
import { AdminDashboardClient } from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await verifyAdminSession();
  const acadSession = !session ? await getAcademySession() : null;

  const userEmail =
    session?.email ||
    (acadSession?.role === "staff_admin" ? acadSession.email : null);

  if (!userEmail) {
    redirect("/admin/login");
  }

  const [registrations, enquiries] = await Promise.all([
    prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const academyStore = getAcademyStore();

  return (
    <main id="main">
      <AdminDashboardClient
        initialRegistrations={registrations.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
        initialEnquiries={enquiries.map((e) => ({
          ...e,
          createdAt: e.createdAt.toISOString(),
        }))}
        initialAcademy={{
          courses: academyStore.courses,
          enrollments: academyStore.enrollments,
          payments: academyStore.payments,
          quotes: academyStore.quotes,
          organizations: academyStore.organizations,
          certificates: academyStore.certificates,
        }}
        userEmail={userEmail}
      />
    </main>
  );
}
