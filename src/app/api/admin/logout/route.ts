import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";
import { clearAcademySession } from "@/lib/academyAuth";
import { isSameOriginRequest } from "@/lib/security";

export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }
  await clearAdminSession();
  await clearAcademySession();
  return NextResponse.json({ success: true });
}
