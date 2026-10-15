"use server";

import { refresh } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { getAdminAuth } from "./firebase/admin";
import { defaultLocale, hasLocale, type Locale } from "@/app/[lang]/dictionaries";
import { sendPasswordSetupEmail } from "./invite";
import { getPrisma } from "./prisma";
import { createSession, deleteSession } from "./session";
import { cleanLocation, cleanName, normalizePhone } from "./validation";

export type AuthErrorCode = "name" | "phone" | "location" | "userNotFound" | "phoneTaken" | "noProfile" | "generic";
export type AuthResult = { ok: true } | { ok: false; error: AuthErrorCode };
/** `redirectTo` is the page to open next: the account page, or the dashboard for admins. */
export type SessionResult = { ok: true; redirectTo: string } | { ok: false; error: AuthErrorCode };

const toLocale = (lang: string): Locale => (hasLocale(lang) ? lang : defaultLocale);

/**
 * Second half of sign-up. The browser has already created the Firebase account
 * (email + password); this saves the profile in MySQL, starts a session and
 * returns their account page as the next page. If the profile can't be saved, the new
 * Firebase account is removed so the person can simply try again.
 */
export async function completeSignUp(
  lang: string,
  input: { idToken: string; name: string; phone: string; location: string },
): Promise<SessionResult> {
  let uid: string;
  let email: string | undefined;
  try {
    ({ uid, email } = await getAdminAuth().verifyIdToken(input.idToken));
  } catch {
    return { ok: false, error: "generic" };
  }

  const existing = await getPrisma().user.findUnique({ where: { firebaseUid: uid }, select: { id: true } });
  if (existing) {
    await createSession(input.idToken);
    return { ok: true, redirectTo: `/${toLocale(lang)}/account` };
  }

  const fail = async (error: AuthErrorCode): Promise<SessionResult> => {
    await getAdminAuth().deleteUser(uid).catch(() => {});
    return { ok: false, error };
  };

  const name = cleanName(input.name);
  if (!name) return fail("name");
  const phone = normalizePhone(input.phone);
  if (!phone) return fail("phone");
  const location = cleanLocation(input.location);
  if (!location) return fail("location");
  if (!email) return fail("generic");

  try {
    // `role` is deliberately not set here: it always starts as the default (USER).
    await getPrisma().user.create({ data: { firebaseUid: uid, name, email: email.toLowerCase(), phone, location } });
  } catch (err) {
    const duplicate = err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
    console.error("Sign-up: could not save profile", err);
    return fail(duplicate ? "phoneTaken" : "generic");
  }

  await createSession(input.idToken);
  return { ok: true, redirectTo: `/${toLocale(lang)}/account` };
}

/**
 * First step of login: is there a Hoofund account with this email in MySQL?
 * Firebase is only contacted when there is.
 */
export async function checkAccount(email: string): Promise<AuthResult> {
  const value = email.trim().toLowerCase();
  if (!value || value.length > 255) return { ok: false, error: "userNotFound" };
  const user = await getPrisma().user.findUnique({ where: { email: value }, select: { id: true } });
  return user ? { ok: true } : { ok: false, error: "userNotFound" };
}

/**
 * "Forgot password?" (also how invited users get a fresh link). Like login,
 * it checks MySQL first and only then asks Firebase to email the link.
 */
export async function requestPasswordReset(lang: string, email: string): Promise<AuthResult> {
  const found = await checkAccount(email);
  if (!found.ok) return found;
  const sent = await sendPasswordSetupEmail(email.trim().toLowerCase(), toLocale(lang));
  return sent ? { ok: true } : { ok: false, error: "generic" };
}

/**
 * Starts a session after the browser has signed in to Firebase. Admins go to
 * the dashboard next; everyone else to their account page.
 */
export async function completeLogIn(lang: string, idToken: string): Promise<SessionResult> {
  let uid: string;
  try {
    ({ uid } = await getAdminAuth().verifyIdToken(idToken));
  } catch {
    return { ok: false, error: "generic" };
  }

  // The role is read from MySQL for this verified account, so admins can be sent to the dashboard.
  const user = await getPrisma().user.findUnique({ where: { firebaseUid: uid }, select: { role: true } });
  if (!user) return { ok: false, error: "noProfile" };

  await createSession(idToken);
  return { ok: true, redirectTo: `/${toLocale(lang)}/${user.role === "ADMIN" ? "admin" : "account"}` };
}

export async function logOut() {
  await deleteSession();
  refresh();
}
