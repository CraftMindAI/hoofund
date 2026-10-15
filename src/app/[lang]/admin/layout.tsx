import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminLanguageSwitcher, AdminSidebar } from "@/components/admin/AdminSidebar";
import { NavUser } from "@/components/auth/NavUser";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: LayoutProps<"/[lang]/admin">): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: getDictionary(lang).admin.metaTitle,
    robots: { index: false, follow: false },
  };
}

/**
 * Shell shared by every admin page. It holds no private data: each page checks
 * the admin role itself before loading anything.
 */
export default async function AdminLayout({ children, params }: LayoutProps<"/[lang]/admin">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 bg-forest-deep text-cream shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href={`/${lang}/admin`} className="flex min-w-0 items-center gap-2">
            <Image
              src="/images/hoofund-emblem.webp"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full bg-cream p-0.5"
            />
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Hoo<span className="text-gold">fund</span>
            </span>
            <span className="hidden rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-bold text-gold sm:inline">
              {dict.admin.badge}
            </span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <AdminLanguageSwitcher lang={lang} label={dict.nav.language} />
            <Suspense fallback={<div className="h-10 w-10" />}>
              <NavUser lang={lang} t={dict.auth} />
            </Suspense>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:flex lg:gap-8 lg:py-8">
        <AdminSidebar lang={lang} t={dict.admin} />
        <main className="min-w-0 flex-1 py-6 lg:py-0">{children}</main>
      </div>
    </div>
  );
}
