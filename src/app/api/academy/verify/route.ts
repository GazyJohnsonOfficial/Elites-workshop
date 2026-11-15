import { NextResponse } from "next/server";
import { getAcademyStore } from "@/lib/academyStore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code")?.trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ error: "Certificate code is required." }, { status: 400 });
  }

  const store = getAcademyStore();
  const cert = store.certificates.find((c) => c.code.toUpperCase() === code);

  if (!cert) {
    return NextResponse.json(
      { valid: false, error: "No verified certificate matched that credential code." },
      { status: 404 }
    );
  }

  return NextResponse.json({ valid: true, certificate: cert });
}
