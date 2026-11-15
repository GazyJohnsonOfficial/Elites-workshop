import type { Metadata } from "next";
import { getAcademyStore } from "@/lib/academyStore";
import { VerifyCertificateClient } from "@/components/academy/VerifyCertificateClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Certificate Verification | Elites Tech Academy",
  description: "Verified Elites Tech Academy graduate credential transcript.",
};

export default async function VerifyCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const cleanCode = decodeURIComponent(code).trim().toUpperCase();
  const store = getAcademyStore();
  const cert = store.certificates.find((c) => c.code.toUpperCase() === cleanCode) || null;

  return (
    <VerifyCertificateClient
      initialCode={cleanCode}
      initialCertificate={cert}
      initialSearched={true}
    />
  );
}
