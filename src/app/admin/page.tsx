import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { AdminDashboardClient } from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await verifyAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch all registrations and enquiries
  const [registrations, enquiries] = await Promise.all([
    prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

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
        userEmail={session.email}
      />
    </main>
  );
}

