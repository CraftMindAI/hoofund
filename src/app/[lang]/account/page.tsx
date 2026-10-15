import {
  CalendarDays,
  LayoutDashboard,
  Mail,
  MapPin,
  MessageCircleQuestion,
  Phone,
  Sprout,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, unstable_rethrow } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { Navbar } from "@/components/Navbar";
import { requireUser } from "@/lib/auth";
import { getPlans, getUserPlans } from "@/lib/plans";
import { formatDate, formatPhone } from "@/lib/validation";
import { contact, getDictionary, hasLocale, type Dictionary, type Locale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/account">): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: getDictionary(lang).account.metaTitle,
    robots: { index: false, follow: false },
  };
}

export default async function AccountPage({ params }: PageProps<"/[lang]/account">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <Navbar lang={lang} dict={dict} path="/account" />
      <main className="min-h-screen bg-cream">
        {/* Reads the session; visitors who aren't logged in are sent home. */}
        <Suspense fallback={<AccountSkeleton label={dict.account.loading} />}>
          <Account lang={lang} dict={dict} />
        </Suspense>
      </main>
    </>
  );
}

async function Account({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.account;
  const user = await requireUser(lang);
  const [myPlans, plans] = await Promise.all([
    getUserPlans(user?.id),
    getPlans().catch((err) => {
      unstable_rethrow(err);
      console.error("Plans could not be loaded", err);
      return null;
    }),
  ]);
  const memberSince = formatDate(user?.createdAt, lang, "long");

  const details: { icon: LucideIcon; label: string; value: string | null }[] = [
    { icon: UserRound, label: dict.auth.name, value: user?.name },
    { icon: Mail, label: dict.auth.email, value: user?.email },
    { icon: Phone, label: dict.auth.phone, value: user?.phone ? formatPhone(user?.phone) : null },
    { icon: MapPin, label: dict.auth.location, value: user?.location },
    { icon: CalendarDays, label: dict.auth.memberSince, value: memberSince },
  ];

  return (
    <>
      <AccountBanner>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <span
              aria-hidden
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold font-display text-3xl font-bold uppercase text-forest-deep ring-4 ring-white/20"
            >
              {user?.name?.charAt(0)}
            </span>
            <div>
              <p className="text-sm font-semibold text-gold">{t.eyebrow}</p>
              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
                {t.welcome.replace("{name}", user?.name ?? "")}
              </h1>
              <p className="mt-1 text-cream/80">{t.lead}</p>
            </div>
          </div>
          {user?.role === "ADMIN" && (
            <Link
              href={`/${lang}/admin`}
              className="flex items-center justify-center gap-2 self-start rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold text-cream ring-1 ring-white/25 transition hover:bg-white/20 sm:self-auto"
            >
              <LayoutDashboard className="h-4 w-4 text-gold" aria-hidden />
              {t.adminLink}
            </Link>
          )}
        </div>
      </AccountBanner>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:py-14">
        {/* Plan */}
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sand sm:p-8">
          <h2 className="font-display text-2xl font-bold text-forest">{t.plan}</h2>
          {myPlans?.length ? (
            <ul className="mt-5 space-y-3">
              {myPlans?.map((p) => (
                <li key={p?.id} className="rounded-2xl bg-gradient-to-br from-forest to-forest-deep p-5 text-cream shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-xl font-bold text-white">
                      {dict.plans.plan} {p?.number}
                    </p>
                    <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold text-gold">
                      {p?.cows} {p?.cows === 1 ? dict.plans.cow : dict.plans.cowsUnit}
                    </span>
                  </div>
                  <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-cream/65">{dict.plans.investment}</dt>
                      <dd className="font-semibold text-white">{p?.investment}</dd>
                    </div>
                    <div>
                      <dt className="text-cream/65">
                        {dict.plans.monthly} ({dict.plans.monthlyNote})
                      </dt>
                      <dd className="font-semibold text-white">{p?.monthly}</dd>
                    </div>
                    <div>
                      <dt className="text-cream/65">{dict.plans.total}</dt>
                      <dd className="font-display text-lg font-bold text-gold">{p?.total}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          ) : (
          <>
          <div className="mt-5 rounded-2xl bg-card p-6 ring-1 ring-sand">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-gold">
              <Sprout className="h-6 w-6" aria-hidden />
            </span>
            <p className="mt-4 font-display text-xl font-bold text-ink">{t.noPlan}</p>
            <p className="mt-1.5 text-ink/70">{t.noPlanBody}</p>
          </div>

          {plans ? (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {plans?.map((p) => (
                <li
                  key={p?.id}
                  className="rounded-2xl px-4 py-3 ring-1 ring-sand"
                >
                  <span className="block text-xs font-semibold uppercase tracking-wide text-ink/50">
                    {dict.plans.plan} {p?.number} · {p?.cows} {p?.cows === 1 ? dict.plans.cow : dict.plans.cowsUnit}
                  </span>
                  <span className="block font-display text-lg font-bold text-forest">
                    {p?.monthly}
                    <span className="ml-1 font-sans text-sm font-medium text-ink/55">/ {dict.plans.monthlyNote}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 rounded-2xl px-4 py-3 text-sm text-ink/60 ring-1 ring-sand">{dict.plans.unavailable}</p>
          )}
          </>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-forest-deep transition hover:bg-[#ecc272]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t.chat}
            </a>
          </div>
        </section>

        <div className="space-y-6">
          {/* Details */}
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sand sm:p-8">
            <h2 className="font-display text-2xl font-bold text-forest">{t.details}</h2>
            <dl className="mt-5 space-y-4">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-card text-leaf ring-1 ring-sand">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</dt>
                    <dd className={`break-words ${value ? "font-semibold text-ink" : "italic text-ink/45"}`}>
                      {value ?? t.notAdded}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-5 rounded-xl bg-card px-4 py-3 text-sm text-ink/65">{t.changeNote}</p>
          </section>

          {/* Help */}
          <section className="rounded-3xl bg-forest p-6 text-cream shadow-sm sm:p-8">
            <MessageCircleQuestion className="h-8 w-8 text-gold" aria-hidden />
            <h2 className="mt-3 font-display text-2xl font-bold text-white">{t.help}</h2>
            <p className="mt-1.5 text-cream/80">{t.helpBody}</p>
            <div className="mt-5 space-y-2 text-sm font-semibold">
              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream transition hover:text-gold"
              >
                <WhatsAppIcon className="h-4 w-4 text-gold" />
                {contact.whatsapp}
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 break-all text-cream transition hover:text-gold">
                <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                {contact.email}
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

/** Dark photo banner the transparent navbar sits on. */
function AccountBanner({ children }: { children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-forest-deep">
      <Image
        src="/images/photos/cow-grazing.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-35"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-forest-deep/80 via-forest-deep/60 to-forest-deep/90" />
      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-28 sm:px-6 md:pb-12 md:pt-32">{children}</div>
    </section>
  );
}

function AccountSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-label={label}>
      <AccountBanner>
        <div className="flex animate-pulse items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-white/15" />
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-white/15" />
            <div className="h-8 w-64 max-w-full rounded bg-white/15" />
          </div>
        </div>
      </AccountBanner>
      <div className="mx-auto grid max-w-6xl animate-pulse gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:py-14">
        <div className="h-96 rounded-3xl bg-white ring-1 ring-sand" />
        <div className="h-96 rounded-3xl bg-white ring-1 ring-sand" />
      </div>
    </div>
  );
}
