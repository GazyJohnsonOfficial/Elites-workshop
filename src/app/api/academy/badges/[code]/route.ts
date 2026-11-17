import { NextResponse } from "next/server";
import { getAcademyStore } from "@/lib/academyStore";
import { buildOpenBadgeAssertion } from "@/lib/credentialUtils";
import { SITE_CONFIG } from "@/lib/config";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const cleanCode = decodeURIComponent(code).trim().toUpperCase();
  if (!cleanCode) {
    return NextResponse.json({ error: "Badge credential code required." }, { status: 400 });
  }

  const store = getAcademyStore();
  const cert = store.certificates.find((c) => c.code.toUpperCase() === cleanCode);
  if (!cert) {
    return NextResponse.json({ error: "Credential assertion not found." }, { status: 404 });
  }

  const requestOrigin = (() => {
    try {
      return new URL(req.url).origin;
    } catch {
      return SITE_CONFIG.CONTACT.WEBSITE_URL;
    }
  })();

  const assertion = buildOpenBadgeAssertion(cert, requestOrigin);
  return NextResponse.json(assertion, {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
