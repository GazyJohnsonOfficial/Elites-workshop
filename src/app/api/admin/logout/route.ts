import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";
import { isSameOriginRequest } from "@/lib/security";

export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }
  await clearAdminSession();
  return NextResponse.json({ success: true });
}
