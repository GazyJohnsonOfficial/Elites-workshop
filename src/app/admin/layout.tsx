import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Staff Portal | ${SITE_CONFIG.COMPANY}`,
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}

