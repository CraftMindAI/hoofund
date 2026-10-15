import "server-only";
import type { Locale } from "@/app/[lang]/dictionaries";
import { requireAdmin } from "./auth";
import { getPrisma } from "./prisma";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const userFields = {
  id: true,
  name: true,
  email: true,
  phone: true,
  location: true,
  role: true,
  createdAt: true,
} as const;

// Each loader checks the admin role itself, so it is safe to call from any page.

/** Counts and the latest sign-ups for the dashboard overview. */
export async function getAdminOverview(lang: Locale) {
  const admin = await requireAdmin(lang);
  const prisma = getPrisma();
  const weekAgo = new Date(Date.now() - WEEK_MS);

  const [total, admins, newThisWeek, recent] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: userFields }),
  ]);

  return { admin, stats: { total, admins, newThisWeek }, recent };
}

/** Every plan, including hidden ones, for the Plans page. */
export async function getAdminPlans(lang: Locale) {
  await requireAdmin(lang);
  return getPrisma().plan.findMany({ orderBy: { sortOrder: "asc" } });
}

/** Every account with the role USER (newest first) with their plan ids, plus the plans an admin can assign. */
export async function getAdminUsers(lang: Locale) {
  await requireAdmin(lang);
  const prisma = getPrisma();
  const [users, plans] = await Promise.all([
    prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "desc" },
      take: 1000,
      select: { ...userFields, userPlan: { select: { planIds: true } } },
    }),
    prisma.plan.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, sortOrder: true, cows: true, isActive: true } }),
  ]);
  return { users, plans };
}

/** Every account with the role ADMIN, newest first. Admins don't have plans. */
export async function getAdminAdmins(lang: Locale) {
  await requireAdmin(lang);
  return getPrisma().user.findMany({ where: { role: "ADMIN" }, orderBy: { createdAt: "desc" }, select: userFields });
}
