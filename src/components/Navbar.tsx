import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { contact, type Dictionary, type Locale } from "@/app/[lang]/dictionaries";
import { AuthDialog } from "./auth/AuthDialog";
import { HeaderShell } from "./HeaderShell";
import { LoginButton, NavUser } from "./auth/NavUser";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

/** `path` keeps the language switch on the same page, e.g. "/account". */
export function Navbar({ lang, dict, path = "" }: { lang: Locale; dict: Dictionary; path?: string }) {
  const links = [
    { href: `/${lang}#about`, label: dict.nav.about },
    { href: `/${lang}#benefits`, label: dict.nav.benefits },
    { href: `/${lang}#plans`, label: dict.nav.plans },
    { href: `/${lang}#how`, label: dict.nav.how },
    { href: `/${lang}#terms`, label: dict.nav.terms },
  ];

  return (
    <HeaderShell>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={`/${lang}`} className="flex shrink-0 items-center gap-2">
          <Image
            src="/images/hoofund-emblem.webp"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full bg-cream p-0.5"
            priority
          />
          <span className="font-display text-xl font-bold tracking-tight text-white">
            Hoo<span className="text-gold">fund</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 xl:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium text-cream/85 transition-colors hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <LanguageSwitcher lang={lang} label={dict.nav.language} path={path} />
          <a
            href={contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-gold px-4 py-2 text-sm font-bold text-forest-deep transition-colors hover:bg-[#ecc272] sm:inline-block whitespace-nowrap"
          >
            {dict.nav.join}
          </a>
          {/* Shows the login button until the session check says otherwise. */}
          <Suspense fallback={<LoginButton t={dict.auth} />}>
            <NavUser lang={lang} t={dict.auth} />
          </Suspense>
          <MobileMenu
            links={links}
            join={{ href: contact.whatsappUrl, label: dict.nav.join }}
            openLabel={dict.nav.menu}
            closeLabel={dict.nav.close}
          />
        </div>
      </div>
      <AuthDialog lang={lang} t={dict.auth} />
    </HeaderShell>
  );
}
