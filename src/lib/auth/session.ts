import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { UserRole } from "@/models/User";

const DEV_FALLBACK_SECRET = "vps_solar_dev_only_jwt_secret_minimum_32_chars";

export function getJwtSecretBytes(): Uint8Array {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
      throw new Error("JWT_SECRET environment variable must be configured in production");
    }
    return new TextEncoder().encode(DEV_FALLBACK_SECRET);
  }
  return new TextEncoder().encode(secret);
}

export const SESSION_COOKIE_NAME = "vps_admin_session";
const EXPIRY_DAYS = Math.min(30, Math.max(1, Number(process.env.SESSION_EXPIRY_DAYS || 7)));

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  [key: string]: unknown;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRY_DAYS}d`)
    .sign(getJwtSecretBytes());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    if (!token || typeof token !== "string") return null;
    const { payload } = await jwtVerify(token, getJwtSecretBytes(), {
      algorithms: ["HS256"],
    });
    if (!payload.userId || !payload.role || !payload.email) {
      return null;
    }
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: EXPIRY_DAYS * 24 * 60 * 60,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
