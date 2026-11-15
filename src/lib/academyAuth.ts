import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { verifyAdminSession } from "./auth";
import { getAcademyStore, type AcademyUser, type UserRole } from "./academyStore";

export const ACADEMY_COOKIE_NAME = "ets_academy_token";
const ACADEMY_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const globalForAcademyAuth = globalThis as unknown as {
  __etsAcademyJwtSecret?: Uint8Array;
};

function getAcademySecret(): Uint8Array {
  const envSecret = process.env.ADMIN_SECRET?.trim();
  if (envSecret && envSecret.length >= 32) {
    return new TextEncoder().encode(envSecret);
  }
  if (!globalForAcademyAuth.__etsAcademyJwtSecret) {
    globalForAcademyAuth.__etsAcademyJwtSecret = new Uint8Array(crypto.randomBytes(32));
  }
  return globalForAcademyAuth.__etsAcademyJwtSecret;
}

async function getCookieFlags() {
  const hdrs = await headers();
  const proto = hdrs.get("x-forwarded-proto") || "";
  const isHttps = proto.includes("https") || process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isHttps,
    sameSite: (isHttps ? "none" : "lax") as "none" | "lax",
    path: "/",
  };
}

export interface AcademySessionPayload {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  organizationId?: string;
}

export async function createAcademySession(user: AcademyUser) {
  const payload: AcademySessionPayload = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    organizationId: user.organizationId,
  };

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getAcademySecret());

  const cookieStore = await cookies();
  const flags = await getCookieFlags();
  cookieStore.set(ACADEMY_COOKIE_NAME, token, {
    ...flags,
    maxAge: ACADEMY_SESSION_TTL_SECONDS,
  });

  return payload;
}

export async function getAcademySession(): Promise<AcademySessionPayload | null> {
  const staffAdmin = await verifyAdminSession();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACADEMY_COOKIE_NAME)?.value;
    if (token) {
      const { payload } = await jwtVerify(token, getAcademySecret(), {
        algorithms: ["HS256"],
      });

      if (
        typeof payload.userId === "string" &&
        typeof payload.email === "string" &&
        typeof payload.fullName === "string" &&
        typeof payload.role === "string"
      ) {
        const store = getAcademyStore();
        const latestUser = store.users.find((u) => u.id === payload.userId || u.email === payload.email);
        return {
          userId: latestUser?.id ?? payload.userId,
          email: latestUser?.email ?? payload.email,
          fullName: latestUser?.fullName ?? payload.fullName,
          role: (staffAdmin ? "staff_admin" : latestUser?.role ?? payload.role) as UserRole,
          organizationId:
            latestUser?.organizationId ??
            (typeof payload.organizationId === "string" ? payload.organizationId : undefined),
        };
      }
    }
  } catch {
    // Ignore invalid/expired token and fall through
  }

  if (staffAdmin) {
    return {
      userId: "user-staff-admin",
      email: staffAdmin.email,
      fullName: "Staff Administrator",
      role: "staff_admin",
    };
  }

  return null;
}

export async function clearAcademySession() {
  const cookieStore = await cookies();
  const flags = await getCookieFlags();
  cookieStore.set(ACADEMY_COOKIE_NAME, "", {
    ...flags,
    maxAge: 0,
  });
}
