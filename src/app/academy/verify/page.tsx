import type { Metadata } from "next";
import { VerifyCertificateClient } from "@/components/academy/VerifyCertificateClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verify Certificate | Elites Tech Academy",
  description: "Public employer verification registry for Elites Tech Academy graduate certificates.",
};

export default function VerifyIndexPage() {
  return (
    <VerifyCertificateClient
      initialCode=""
      initialCertificate={null}
      initialSearched={false}
    />
  );
}
