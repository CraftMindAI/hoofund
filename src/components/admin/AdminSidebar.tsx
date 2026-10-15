"use client";

import { ArrowUpRight, BadgeIndianRupee, LayoutDashboard, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

type Text = Dictionary["admin"];

function useAdminLinks(lang: Locale, t: Text) {
  const pathname = usePathname();
  const base = `/${lang}/admin`;
  const links: { href: string; label: string; icon: LucideIcon }[] = [
    { href: base, label: t.nav.overview, icon: LayoutDashboard },
    { href: `${base}/users`, label: t.nav.users, icon: Users },
    { href: `${base}/admins`, label: t.nav.admins, icon: ShieldCheck },
    { href: `${base}/plans`, label: t.nav.plans, icon: BadgeIndianRupee },
  ];
  return links.map((l) => ({ ...l, active: pathname === l.href }));
}

/** Left sidebar on wide screens; a row of tabs under the header on phones and tablets. */
export function AdminSidebar({ lang, t }: { lang: Locale; t: Text }) {
  const links = useAdminLinks(lang, t);

  return (
    <>
      {/* Wide screens */}
      <aside className="sticky top-24 hidden w-60 shrink-0 self-start lg:block">
        <nav aria-label={t.menu} className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-sand">
          <ul className="space-y-1">
            {links.map(({ href, label, icon: Icon, active }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active ? "bg-forest text-cream shadow-sm" : "text-ink/75 hover:bg-card hover:text-forest"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-gold" : "text-leaf"}`} aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-sand pt-3">
            <Link
              href={`/${lang}`}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-ink/60 transition hover:bg-card hover:text-forest"
            >
              <ArrowUpRight className="h-5 w-5" aria-hidden />
              {t.viewSite}
            </Link>
          </div>
        </nav>
      </aside>

      {/* Phones and tablets */}
      <nav aria-label={t.menu} className="-mx-4 overflow-x-auto px-4 pt-4 sm:-mx-6 sm:px-6 lg:hidden">
        <ul className="flex gap-2">
          {links.map(({ href, label, icon: Icon, active }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                  active ? "bg-forest text-cream ring-forest" : "bg-white text-ink/75 ring-sand hover:text-forest"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-gold" : "text-leaf"}`} aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

/** Language pill that keeps the admin on the page they are viewing. */
export function AdminLanguageSwitcher({ lang, label }: { lang: Locale; label: string }) {
  const path = usePathname().replace(/^\/(ta|en)(?=\/|$)/, "");
  return <LanguageSwitcher lang={lang} label={label} path={path} />;
}
