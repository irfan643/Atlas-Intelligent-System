import { cookies } from "next/headers";

import { SESSION_COOKIE } from "@/lib/session-cookie";
import {
  decodeSession,
  encodeSession,
  type SessionUser,
} from "@/lib/session-token";

export { SESSION_COOKIE };
export type { SessionUser };

export async function createSession(user: SessionUser) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await encodeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return decodeSession(token);
}

export async function requireDoctorSession(): Promise<SessionUser> {
  const session = await getSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}
