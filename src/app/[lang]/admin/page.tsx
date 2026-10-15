import { ArrowRight, ShieldCheck, UserPlus, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/admin/DashboardSkeleton";
import { getAdminOverview } from "@/lib/admin";
import { formatDate } from "@/lib/validation";
import { getDictionary, hasLocale, type Dictionary, type Locale } from "../dictionaries";

export default async function AdminOverviewPage({ params }: PageProps<"/[lang]/admin">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    // Reads the session and checks the admin role; non-admins are redirected home.
    <Suspense fallback={<DashboardSkeleton label={dict.admin.loading} />}>
      <Overview lang={lang} dict={dict} />
    </Suspense>
  );
}

async function Overview({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.admin;
  const { admin, stats, recent } = await getAdminOverview(lang);

  const cards: { icon: LucideIcon; label: string; value: number }[] = [
    { icon: Users, label: t.stats.total, value: stats?.total },
    { icon: UserPlus, label: t.stats.newThisWeek, value: stats?.newThisWeek },
    { icon: ShieldCheck, label: t.stats.admins, value: stats?.admins },
  ];

  return (
    <>
      <p className="text-sm font-semibold text-leaf">{t.welcome.replace("{name}", admin?.name ?? "")}</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-forest sm:text-4xl">{t.title}</h1>
      <p className="mt-2 text-ink/70">{t.lead}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sand">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest text-gold">
              <Icon className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="font-display text-3xl font-bold text-forest">{value.toLocaleString("en-IN")}</p>
              <p className="text-sm text-ink/65">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sand sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-forest">{t.recent}</h2>
          <Link
            href={`/${lang}/admin/users`}
            className="flex items-center gap-1.5 text-sm font-bold text-leaf underline-offset-4 hover:underline"
          >
            {t.viewAll}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        {!recent?.length ? (
          <p className="mt-6 rounded-2xl bg-card px-4 py-8 text-center text-sm text-ink/60">{t.noUsers}</p>
        ) : (
          <ul className="mt-4 divide-y divide-sand/70">
            {recent?.map((u) => (
              <li key={u?.id} className="flex items-center gap-3 py-3">
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest font-display font-bold uppercase text-gold"
                >
                  {u?.name?.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">
                    {u?.name}
                    {u?.role === "ADMIN" && (
                      <ShieldCheck className="ml-1.5 inline h-4 w-4 align-[-2px] text-earth" aria-label={t.roles.ADMIN} />
                    )}
                  </p>
                  <p className="truncate text-sm text-ink/60">{u?.email}</p>
                </div>
                <span className="shrink-0 text-sm text-ink/55">{formatDate(u?.createdAt, lang)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
