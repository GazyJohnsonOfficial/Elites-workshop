import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_EMAIL || "elitestechsolutionllc@gmail.com";
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (
      email?.toLowerCase() === expectedEmail.toLowerCase() &&
      password === expectedPassword
    ) {
      await createAdminSession(email);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}

