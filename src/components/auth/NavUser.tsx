import { LogIn } from "lucide-react";
import { unstable_rethrow } from "next/navigation";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatPhone } from "@/lib/validation";
import { AuthTrigger } from "./AuthTrigger";
import { UserMenu } from "./UserMenu";

/** Login button, or the account menu when someone is logged in. Reads the session, so render it inside <Suspense>. */
export async function NavUser({ lang, t }: { lang: Locale; t: Dictionary["auth"] }) {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch (err) {
    unstable_rethrow(err); // let Next.js's own signals (e.g. request-time rendering) through
    // Database or Firebase unreachable: show the login button instead of breaking the page.
    console.error("NavUser: could not load the current user", err);
  }

  if (user) {
    const phone = user?.phone ? formatPhone(user?.phone) : null;
    const memberSince = formatDate(user?.createdAt, lang);
    return <UserMenu user={{
          name: user?.name,
          email: user?.email,
          phone,
          location: user?.location,
          memberSince,
          accountHref: `/${lang}/account`,
          dashboardHref: user?.role === "ADMIN" ? `/${lang}/admin` : undefined,
        }} t={t} />;
  }

  return <LoginButton t={t} />;
}

export function LoginButton({ t }: { t: Dictionary["auth"] }) {
  return (
    <AuthTrigger
      label={t.login}
      className="flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-cream ring-1 ring-white/25 transition hover:bg-white/10 sm:px-4"
    >
      <LogIn className="h-4 w-4" aria-hidden />
      <span className="hidden sm:inline">{t.login}</span>
    </AuthTrigger>
  );
}
