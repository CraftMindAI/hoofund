import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddUserDialog } from "@/components/admin/AddUserDialog";
import { DashboardSkeleton } from "@/components/admin/DashboardSkeleton";
import { UsersTable } from "@/components/admin/UsersTable";
import { getAdminUsers } from "@/lib/admin";
import { toPlanIds } from "@/lib/plans";
import { formatDate, formatPhone } from "@/lib/validation";
import { getDictionary, hasLocale, type Dictionary, type Locale } from "../../dictionaries";

export default async function AdminUsersPage({ params }: PageProps<"/[lang]/admin/users">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.admin;

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest sm:text-4xl">{t.nav.users}</h1>
          <p className="mt-2 max-w-xl text-ink/70">{t.usersLead}</p>
        </div>
        <AddUserDialog lang={lang} t={t} role="USER" />
      </div>

      <div className="mt-8">
        {/* Reads the session and checks the admin role; non-admins are redirected home. */}
        <Suspense fallback={<DashboardSkeleton label={t.loading} cards={false} />}>
          <UserList lang={lang} dict={dict} />
        </Suspense>
      </div>
    </>
  );
}

async function UserList({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { users, plans } = await getAdminUsers(lang);

  return (
    <UsersTable
      variant="users"
      lang={lang}
      t={dict.admin}
      planText={{ plan: dict.plans.plan, cow: dict.plans.cow, cowsUnit: dict.plans.cowsUnit }}
      plans={plans?.map((p) => ({ id: p?.id, number: p?.sortOrder, cows: p?.cows, active: p?.isActive }))}
      users={users?.map((u) => ({
        id: u?.id,
        name: u?.name,
        email: u?.email,
        phone: u?.phone ? formatPhone(u?.phone) : null,
        location: u?.location,
        joined: formatDate(u?.createdAt, lang),
        planIds: toPlanIds(u?.userPlan?.planIds),
      }))}
    />
  );
}
