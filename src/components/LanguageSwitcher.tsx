import Link from "next/link";
import type { Locale } from "@/app/[lang]/dictionaries";

const languages: { code: Locale; label: string; short: string }[] = [
  { code: "ta", label: "தமிழ்", short: "த" },
  { code: "en", label: "English", short: "EN" },
];

/** Tamil / English pill. `path` keeps the visitor on the same page, e.g. "/admin". */
export function LanguageSwitcher({ lang, label, path = "" }: { lang: Locale; label: string; path?: string }) {
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
            href={`/${l.code}${path}`}
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
