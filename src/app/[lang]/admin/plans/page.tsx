import { Eye, EyeOff, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddPlanDialog } from "@/components/admin/AddPlanDialog";
import { DashboardSkeleton } from "@/components/admin/DashboardSkeleton";
import { getAdminPlans } from "@/lib/admin";
import { formatRupees } from "@/lib/validation";
import {
  getDictionary,
  hasLocale,
  type Dictionary,
  type Locale,
} from "../../dictionaries";

export default async function AdminPlansPage({
  params,
}: PageProps<"/[lang]/admin/plans">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.admin;

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest sm:text-4xl">
            {t.nav.plans}
          </h1>
          <p className="mt-2 max-w-xl text-ink/70">{t.plans.lead}</p>
        </div>
        <AddPlanDialog lang={lang} t={t.plans} />
      </div>

      <div className="mt-8">
        {/* Reads the session and checks the admin role; non-admins are redirected home. */}
        <Suspense
          fallback={<DashboardSkeleton label={t.loading} cards={false} />}
        >
          <PlanList lang={lang} dict={dict} />
        </Suspense>
      </div>
    </>
  );
}

async function PlanList({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict?.admin?.plans;
  const plans = await getAdminPlans(lang);
  const cowsLabel = (n: number) =>
    `${n} ${n === 1 ? dict?.plans?.cow : dict?.plans?.cowsUnit}`;

  if (!plans?.length) {
    return (
      <p className="rounded-3xl bg-white px-6 py-12 text-center text-ink/60 shadow-sm ring-1 ring-sand">
        {t.empty}
      </p>
    );
  }

  return (
    <section
      aria-label={dict?.admin?.nav?.plans}
      className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sand sm:p-6"
    >
      <p className="text-sm font-semibold text-ink/60">
        {t?.count?.replace("{count}", String(plans?.length ?? 0))}
      </p>

      {/* Wide screens */}
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-sand text-xs uppercase tracking-wide text-ink/50">
              <th className="py-3 pr-4 font-semibold">{t?.columns?.plan}</th>
              <th className="py-3 pr-4 font-semibold">{t?.columns?.cows}</th>
              <th className="py-3 pr-4 text-right font-semibold">
                {t?.columns?.investment}
              </th>
              <th className="py-3 pr-4 text-right font-semibold">
                {t?.columns?.monthly}
              </th>
              <th className="py-3 pr-4 text-right font-semibold">
                {t?.columns?.total}
              </th>
              <th className="py-3 font-semibold">{t?.columns?.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/70">
            {plans?.map((p) => (
              <tr
                key={p?.id}
                className={`transition-colors hover:bg-card ${p?.isActive ? "" : "text-ink/50"}`}
              >
                <td className="py-3.5 pr-4 font-display text-base font-bold text-forest">
                  {dict?.plans?.plan} {p?.sortOrder}
                </td>
                <td className="py-3.5 pr-4">{cowsLabel(p?.cows)}</td>
                <td className="py-3.5 pr-4 text-right tabular-nums">
                  {formatRupees(p?.investment)}
                </td>
                <td className="py-3.5 pr-4 text-right tabular-nums">
                  {formatRupees(p?.monthlyPayment)}
                </td>
                <td className="py-3.5 pr-4 text-right font-semibold tabular-nums">
                  {formatRupees(p?.totalReturn)}
                </td>
                <td className="py-3.5">
                  <Badges active={p?.isActive} featured={p?.featured} t={t} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones */}
      <ul className="mt-4 space-y-3 md:hidden">
        {plans?.map((p) => (
          <li
            key={p?.id}
            className={`rounded-2xl bg-card p-4 ring-1 ring-sand ${p?.isActive ? "" : "opacity-70"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-bold text-forest">
                  {dict?.plans?.plan} {p?.sortOrder}
                </p>
                <p className="text-sm text-ink/60">{cowsLabel(p?.cows)}</p>
              </div>
              <Badges active={p?.isActive} featured={p?.featured} t={t} />
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div>
                <dt className="text-xs text-ink/55">
                  {t?.columns?.investment}
                </dt>
                <dd className="font-semibold tabular-nums">
                  {formatRupees(p?.investment)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink/55">{dict.plans.monthly}</dt>
                <dd className="font-semibold tabular-nums">
                  {formatRupees(p?.monthlyPayment)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink/55">{t.columns.total}</dt>
                <dd className="font-semibold tabular-nums">
                  {formatRupees(p?.totalReturn)}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Badges({
  active,
  featured,
  t,
}: {
  active: boolean;
  featured: boolean;
  t: Dictionary["admin"]["plans"];
}) {
  return (
    <span className="flex flex-wrap justify-end gap-1.5 md:justify-start">
      {active ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-leaf/10 px-2.5 py-1 text-xs font-semibold text-leaf">
          <Eye className="h-3.5 w-3.5" aria-hidden />
          {t.shown}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-semibold text-ink/55">
          <EyeOff className="h-3.5 w-3.5" aria-hidden />
          {t.hidden}
        </span>
      )}
      {featured && (
        <span className="inline-flex items-center gap-1 rounded-full bg-gold/25 px-2.5 py-1 text-xs font-bold text-earth">
          <Star className="h-3.5 w-3.5" aria-hidden />
          {t.featured}
        </span>
      )}
    </span>
  );
}
