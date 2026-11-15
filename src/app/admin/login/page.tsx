import { AdminLoginClient } from "./AdminLoginClient";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const allowPreview = !process.env.ADMIN_EMAIL?.trim();
  return <AdminLoginClient allowPreview={allowPreview} />;
}
