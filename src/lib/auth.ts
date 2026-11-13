import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getAdminJwtSecret } from "./security";

export const ADMIN_COOKIE_NAME = "ets_admin_token";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

export async function createAdminSession(email: string) {
  const token = await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getAdminJwtSecret());

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });

  return token;
}

export async function verifyAdminSession(): Promise<{ email: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getAdminJwtSecret(), {
      algorithms: ["HS256"],
    });

    if (payload.role !== "admin" || typeof payload.email !== "string") {
      return null;
    }

    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
