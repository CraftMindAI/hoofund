"use client";

import { CheckCircle2, Mail, MapPin, Phone, Search, Settings2 } from "lucide-react";
import { useDeferredValue, useState } from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { ManagePlansDialog, type PlanOption } from "./ManagePlansDialog";

export type AdminUserRow = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  joined: string;
  /** From user_plans.plan_ids, e.g. [1, 3]. */
  planIds: number[];
};

/**
 * Searchable list of accounts: a table on wide screens, cards on phones.
 * The "users" variant also shows each user's plans; the "admins" variant has no plans.
 */
export function UsersTable({
  variant,
  lang,
  users,
  plans = [],
  t,
  planText,
}: {
  variant: "users" | "admins";
  lang: Locale;
  users: AdminUserRow[];
  plans?: PlanOption[];
  t: Dictionary["admin"];
  planText: Pick<Dictionary["plans"], "plan" | "cow" | "cowsUnit">;
}) {
  const showPlans = variant === "users";
  const [query, setQuery] = useState("");
  const [managing, setManaging] = useState<AdminUserRow | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const planNumber = new Map(plans?.map((p) => [p?.id, p?.number]));

  const planCell = (u: AdminUserRow) => (
    <div className="flex flex-wrap items-center gap-1.5">
      {!u?.planIds?.length ? (
        <span className="text-ink/45">{t.userPlans.none}</span>
      ) : (
        u?.planIds?.map((id) => (
          <span key={id} className="rounded-full bg-forest/10 px-2.5 py-1 text-xs font-bold text-forest">
            {planText.plan} {planNumber.get(id) ?? `#${id}`}
          </span>
        ))
      )}
      <button
        type="button"
        onClick={() => {
          setSaved(null);
          setManaging(u);
        }}
        aria-label={`${t.userPlans.manage}: ${u?.name}`}
        title={t.userPlans.manage}
        className="flex h-7 w-7 items-center justify-center rounded-full text-leaf ring-1 ring-sand transition hover:bg-forest hover:text-gold hover:ring-forest"
      >
        <Settings2 className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
  const q = useDeferredValue(query.trim().toLowerCase());

  const shown = q
    ? users?.filter((u) =>
        [u?.name, u?.email, u?.phone, u?.location].some((v) => v?.toLowerCase()?.includes(q)),
      )
    : users;

  return (
    <section aria-label={t.users} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sand sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink/60">
            {t.showing.replace("{shown}", String(shown?.length ?? 0)).replace("{total}", String(users?.length ?? 0))}
          </p>
          {saved && (
            <p role="status" className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-leaf">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              {t.userPlans.saved.replace("{name}", saved)}
            </p>
          )}
        </div>
        <label className="relative block sm:w-80">
          <span className="sr-only">{t.search}</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-leaf" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full rounded-full border border-sand bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-ink/40 focus:border-leaf focus:ring-2 focus:ring-leaf/25"
          />
        </label>
      </div>

      {!shown?.length ? (
        <p className="mt-8 rounded-2xl bg-card px-4 py-10 text-center text-sm text-ink/60">
          {variant === "admins" ? t.admins.empty : !users?.length ? t.noUsers : t.empty}
        </p>
      ) : (
        <>
          {/* Wide screens */}
          <div className="mt-6 hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-sand text-xs uppercase tracking-wide text-ink/50">
                  <th className="py-3 pr-4 font-semibold">{t.columns.name}</th>
                  <th className="py-3 pr-4 font-semibold">{t.columns.contact}</th>
                  <th className="py-3 pr-4 font-semibold">{t.columns.location}</th>
                  {showPlans && <th className="py-3 pr-4 font-semibold">{t.columns.plans}</th>}
                  <th className="py-3 font-semibold">{t.columns.joined}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/70">
                {shown?.map((u) => (
                  <tr key={u?.id} className="align-top transition-colors hover:bg-card">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u?.name} />
                        <span className="font-semibold text-ink">{u?.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="text-ink">{u?.email}</div>
                      <div className="text-ink/60">{u?.phone ?? t.none}</div>
                    </td>
                    <td className="py-3.5 pr-4 text-ink/80">{u?.location ?? t.none}</td>
                    {showPlans && <td className="py-3.5 pr-4">{planCell(u)}</td>}
                    <td className="whitespace-nowrap py-3.5 text-ink/70">{u?.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phones */}
          <ul className="mt-5 space-y-3 md:hidden">
            {shown?.map((u) => (
              <li key={u?.id} className="rounded-2xl bg-card p-4 ring-1 ring-sand">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={u?.name} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{u?.name}</p>
                      <p className="text-xs text-ink/55">{u?.joined}</p>
                    </div>
                  </div>
                </div>
                <dl className="mt-3 space-y-1.5 text-sm text-ink/80">
                  <Detail icon={Mail} label={t.columns.contact} value={u?.email} />
                  {u?.phone && <Detail icon={Phone} label={t.columns.contact} value={u?.phone} />}
                  {u?.location && <Detail icon={MapPin} label={t.columns.location} value={u?.location} />}
                </dl>
                {showPlans && <div className="mt-3 border-t border-sand pt-3">{planCell(u)}</div>}
              </li>
            ))}
          </ul>
        </>
      )}

      {showPlans && (
        <ManagePlansDialog
          key={managing?.id ?? "closed"}
          lang={lang}
          t={t}
          dict={planText}
          plans={plans}
          user={managing}
          onClose={() => setManaging(null)}
          onSaved={setSaved}
        />
      )}
    </section>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest font-display font-bold uppercase text-gold"
    >
      {name.charAt(0)}
    </span>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <dt className="sr-only">{label}</dt>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden />
      <dd className="min-w-0 break-words">{value}</dd>
    </div>
  );
}
