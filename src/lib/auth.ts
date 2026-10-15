import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { Locale } from "@/app/[lang]/dictionaries";
import { getPrisma } from "./prisma";
import { getSessionUid } from "./session";

/** The signed-in user's profile, or null when nobody is logged in. */
export async function getCurrentUser() {
  // Checking the session compares its expiry with the clock, so it must run per request.
  await connection();
  const uid = await getSessionUid();
  if (!uid) return null;

  return getPrisma().user.findUnique({
    where: { firebaseUid: uid },
    select: { id: true, name: true, email: true, phone: true, location: true, role: true, createdAt: true },
  });
}

/** Guards pages for any logged-in user. Visitors who aren't logged in go back to the home page. */
export async function requireUser(lang: Locale) {
  const user = await getCurrentUser();
  if (!user) redirect(`/${lang}`);
  return user;
}

/**
 * Guards admin-only pages and data. The role always comes from MySQL for the
 * verified session, never from the browser. Anyone else goes back to the home page.
 */
export async function requireAdmin(lang: Locale) {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") redirect(`/${lang}`);
  return user;
}
