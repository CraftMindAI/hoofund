import Image from "next/image";
import Link from "next/link";
import { contact, type Dictionary, type Locale } from "@/app/[lang]/dictionaries";

const languages: { code: Locale; label: string; short: string }[] = [
  { code: "ta", label: "தமிழ்", short: "த" },
  { code: "en", label: "English", short: "EN" },
];

function LanguageSwitcher({ lang, label }: { lang: Locale; label: string }) {
  return (
    <nav
      aria-label={label}
      className="flex items-center rounded-full border border-white/25 bg-white/10 p-1 text-sm"
    >
      {languages.map((l) => {
        const active = l.code === lang;
        return (
          <Link
            key={l.code}
            href={`/${l.code}`}
            hrefLang={l.code}
            lang={l.code}
            aria-current={active ? "true" : undefined}
            className={`rounded-full px-3 py-1 font-semibold transition-colors ${
              active ? "bg-cream text-forest" : "text-cream/85 hover:text-white"
            }`}
          >
            <span className="hidden sm:inline">{l.label}</span>
            <span className="sm:hidden">{l.short}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Navbar({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const links = [
    { href: "#about", label: dict.nav.about },
    { href: "#benefits", label: dict.nav.benefits },
    { href: "#plans", label: dict.nav.plans },
    { href: "#how", label: dict.nav.how },
    { href: "#terms", label: dict.nav.terms },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-forest/95 text-cream backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
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

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-cream/85 transition-colors hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher lang={lang} label={dict.nav.language} />
          <a
            href={contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-gold px-4 py-2 text-sm font-bold text-forest-deep transition-colors hover:bg-[#ecc272] sm:inline-block"
          >
            {dict.nav.join}
          </a>
        </div>
      </div>
    </header>
  );
}
