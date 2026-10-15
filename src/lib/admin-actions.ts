"use server";

import { refresh, updateTag } from "next/cache";
import { defaultLocale, hasLocale } from "@/app/[lang]/dictionaries";
import { requireAdmin } from "./auth";
import { getAdminAuth } from "./firebase/admin";
import { sendPasswordSetupEmail } from "./invite";
import { getPrisma } from "./prisma";
import { cleanLocation, cleanName, normalizePhone, parseWholeNumber } from "./validation";

export type AddUserError =
  | "name"
  | "email"
  | "emailTaken"
  | "phone"
  | "phoneTaken"
  | "location"
  | "generic";
export type AddUserResult =
  | { ok: true; name: string; email: string; invited: boolean }
  | { ok: false; error: AddUserError };

export type AddUserInput = {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Lets an admin create a user (or another admin): a Firebase login with no
 * password plus the MySQL profile, then emails them a link to set their own
 * password. Phone and location are optional here, unlike public sign-up.
 */
export async function addUser(lang: string, input: AddUserInput): Promise<AddUserResult> {
  const locale = hasLocale(lang) ? lang : defaultLocale;
  // Only admins get past this line; anyone else is redirected home.
  await requireAdmin(locale);

  const name = cleanName(input.name);
  if (!name) return { ok: false, error: "name" };
  const email = input.email.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 255) return { ok: false, error: "email" };

  let phone: string | null = null;
  if (input.phone.trim()) {
    phone = normalizePhone(input.phone);
    if (!phone) return { ok: false, error: "phone" };
  }
  let location: string | null = null;
  if (input.location.trim()) {
    location = cleanLocation(input.location);
    if (!location) return { ok: false, error: "location" };
  }
  const role = input.role === "ADMIN" ? "ADMIN" : "USER";

  const prisma = getPrisma();
  if (await prisma.user.findUnique({ where: { email }, select: { id: true } })) {
    return { ok: false, error: "emailTaken" };
  }
  if (phone && (await prisma.user.findUnique({ where: { phone }, select: { id: true } }))) {
    return { ok: false, error: "phoneTaken" };
  }

  const auth = getAdminAuth();
  let uid: string;
  try {
    ({ uid } = await auth.createUser({ email, displayName: name }));
  } catch (err) {
    const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
    if (code === "auth/email-already-exists") return { ok: false, error: "emailTaken" };
    if (code === "auth/invalid-email") return { ok: false, error: "email" };
    console.error("Add user: Firebase account not created", err);
    return { ok: false, error: "generic" };
  }

  try {
    if (role === "ADMIN") await auth.setCustomUserClaims(uid, { role: "ADMIN" });
    await prisma.user.create({ data: { firebaseUid: uid, name, email, phone, location, role } });
  } catch (err) {
    // Keep Firebase and MySQL in step: remove the login if the profile wasn't saved.
    await auth.deleteUser(uid).catch(() => {});
    console.error("Add user: profile not saved", err);
    return { ok: false, error: "generic" };
  }

  const invited = await sendPasswordSetupEmail(email, locale);
  refresh();
  return { ok: true, name, email, invited };
}

export type AddPlanError = "cows" | "investment" | "monthly" | "total" | "generic";
export type AddPlanResult = { ok: true; number: number } | { ok: false; error: AddPlanError };

export type AddPlanInput = {
  cows: string;
  investment: string;
  monthly: string;
  total: string;
  featured: boolean;
  active: boolean;
};

const MAX_RUPEES = 1_000_000_000; // ₹100 crore

/**
 * Lets an admin add a plan. It goes to the end of the list ("Plan 6", …).
 * Only one plan can be featured, so featuring this one un-features the rest.
 */
export async function addPlan(lang: string, input: AddPlanInput): Promise<AddPlanResult> {
  // Only admins get past this line; anyone else is redirected home.
  await requireAdmin(hasLocale(lang) ? lang : defaultLocale);

  const cows = parseWholeNumber(input.cows, 1, 1000);
  if (cows === null) return { ok: false, error: "cows" };
  const investment = parseWholeNumber(input.investment, 1, MAX_RUPEES);
  if (investment === null) return { ok: false, error: "investment" };
  const monthlyPayment = parseWholeNumber(input.monthly, 1, MAX_RUPEES);
  if (monthlyPayment === null) return { ok: false, error: "monthly" };
  const totalReturn = parseWholeNumber(input.total, 1, MAX_RUPEES);
  if (totalReturn === null) return { ok: false, error: "total" };

  const featured = input.featured === true;
  const isActive = input.active !== false;

  let number: number;
  try {
    number = await getPrisma().$transaction(async (tx) => {
      const last = await tx.plan.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
      const sortOrder = (last?.sortOrder ?? 0) + 1;
      if (featured) await tx.plan.updateMany({ where: { featured: true }, data: { featured: false } });
      await tx.plan.create({ data: { sortOrder, cows, investment, monthlyPayment, totalReturn, featured, isActive } });
      return sortOrder;
    });
  } catch (err) {
    console.error("Add plan failed", err);
    return { ok: false, error: "generic" };
  }

  // Show the new plan on the website straight away, and refresh this admin page.
  updateTag("plans");
  refresh();
  return { ok: true, number };
}

export type SetUserPlansResult = { ok: true } | { ok: false; error: "user" | "plan" | "admin" | "generic" };

/**
 * Saves the full list of plans a user has, as a JSON array of plan ids in
 * `user_plans.plan_ids` (e.g. [1, 3]). An empty list removes the row.
 */
export async function setUserPlans(lang: string, userId: number, planIds: number[]): Promise<SetUserPlansResult> {
  await requireAdmin(hasLocale(lang) ? lang : defaultLocale);
  if (!Number.isInteger(userId)) return { ok: false, error: "user" };

  // Unique, sorted ids, e.g. [3, 1, 3] → [1, 3].
  const ids = [...new Set(planIds)].sort((a, b) => a - b);
  if (!ids.every(Number.isInteger)) return { ok: false, error: "plan" };

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
  if (!user) return { ok: false, error: "user" };
  // Plans are only for users; admins never have them.
  if (user.role === "ADMIN") return { ok: false, error: "admin" };
  // MySQL can't check ids inside a JSON array, so make sure each one is a real plan.
  if (ids.length > 0 && (await prisma.plan.count({ where: { id: { in: ids } } })) !== ids.length) {
    return { ok: false, error: "plan" };
  }

  try {
    if (ids.length === 0) {
      await prisma.userPlan.deleteMany({ where: { userId } });
    } else {
      await prisma.userPlan.upsert({
        where: { userId },
        create: { userId, planIds: ids },
        update: { planIds: ids },
      });
    }
  } catch (err) {
    console.error("Saving user plans failed", err);
    return { ok: false, error: "generic" };
  }

  refresh();
  return { ok: true };
}
