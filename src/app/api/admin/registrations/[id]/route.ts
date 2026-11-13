import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import { asTrimmedString, isSameOriginRequest } from "@/lib/security";

const ALLOWED_REGISTRATION_STATUSES = new Set([
  "pending",
  "confirmed",
  "enrolled",
  "cancelled",
]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }

  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const cleanId = asTrimmedString(id, 64);
    if (!cleanId) {
      return NextResponse.json({ error: "Invalid registration ID" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    const status = asTrimmedString((body as Record<string, unknown> | null)?.status, 32);
    if (!ALLOWED_REGISTRATION_STATUSES.has(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await prisma.registration.update({
      where: { id: cleanId },
      data: { status },
    });

    return NextResponse.json({ success: true, registration: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update registration" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }

  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const cleanId = asTrimmedString(id, 64);
    if (!cleanId) {
      return NextResponse.json({ error: "Invalid registration ID" }, { status: 400 });
    }

    await prisma.registration.delete({ where: { id: cleanId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete registration" }, { status: 500 });
  }
}
