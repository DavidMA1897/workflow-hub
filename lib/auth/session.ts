import "server-only";

import { UserRole } from "@/generated/prisma/client";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "flowpilot_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
const SESSION_ISSUER = "flowpilot";
const SESSION_AUDIENCE = "flowpilot-web";

export type SessionPayload = { userId: string; role: UserRole };

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters long.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setExpirationTime(expiresAt)
    .sign(getSecret());
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
    priority: "high",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    if (
      typeof payload.userId !== "string" ||
      !Object.values(UserRole).includes(payload.role as UserRole)
    ) {
      return null;
    }
    return { userId: payload.userId, role: payload.role as UserRole };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}
