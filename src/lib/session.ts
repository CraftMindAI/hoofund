import "server-only";
import { cookies } from "next/headers";
import { getAdminAuth } from "./firebase/admin";

const COOKIE_NAME = "__session";
const MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

/** Swaps a fresh Firebase ID token for a long-lived, httpOnly session cookie. */
export async function createSession(idToken: string) {
  const value = await getAdminAuth().createSessionCookie(idToken, { expiresIn: MAX_AGE_MS });
  (await cookies()).set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_MS / 1000,
  });
}

/** Returns the signed-in Firebase uid, or null if there is no valid session. */
export async function getSessionUid(): Promise<string | null> {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return null;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(value, true);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}
