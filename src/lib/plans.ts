import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPrisma } from "./prisma";
import { formatRupees as rupees } from "./validation";

export type PlanView = {
  id: number;
  /** Shown as "Plan 1", "Plan 2", … */
  number: number;
  cows: number;
  investment: string;
  monthly: string;
  total: string;
  featured: boolean;
};

/** Reads a `user_plans.plan_ids` JSON value as a list of plan ids, ignoring anything else. */
export function toPlanIds(value: unknown): number[] {
  return Array.isArray(value) ? value.filter((v): v is number => Number.isInteger(v)) : [];
}

/**
 * The plans a user has joined, in plan order. Pass the id of the verified,
 * signed-in user (from `requireUser`), never an id from the browser.
 */
export async function getUserPlans(userId: number) {
  const prisma = getPrisma();
  const row = await prisma.userPlan.findUnique({ where: { userId }, select: { planIds: true } });
  const ids = toPlanIds(row?.planIds);
  if (ids.length === 0) return [];

  const plans = await prisma.plan.findMany({ where: { id: { in: ids } }, orderBy: { sortOrder: "asc" } });
  return plans.map((p) => ({
    id: p.id,
    number: p.sortOrder,
    cows: p.cows,
    investment: rupees(p.investment),
    monthly: rupees(p.monthlyPayment),
    total: rupees(p.totalReturn),
  }));
}

/**
 * Active plans from the `plans` table, ready to display. Cached for about a
 * minute, so edits (e.g. in Prisma Studio) show on the site within a minute.
 * Callers render it at request time (after `connection()`), so `next build`
 * doesn't need the database.
 * Admin changes call `updateTag("plans")` (see admin-actions.ts) so they show at once.
 */
export async function getPlans(): Promise<PlanView[]> {
  "use cache";
  cacheTag("plans");
  cacheLife({ stale: 60, revalidate: 60, expire: 120 });

  const rows = await getPrisma().plan.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  return rows.map((p) => ({
    id: p.id,
    number: p.sortOrder,
    cows: p.cows,
    investment: rupees(p.investment),
    monthly: rupees(p.monthlyPayment),
    total: rupees(p.totalReturn),
    featured: p.featured,
  }));
}
