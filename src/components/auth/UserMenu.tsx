"use client";

import { CalendarDays, LayoutDashboard, Loader2, LogOut, Mail, MapPin, Phone, UserRound, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { logOut } from "@/lib/auth-actions";

export type NavUserDetails = {
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  memberSince: string;
  accountHref: string;
  /** Link to the admin dashboard, only for admins. */
  dashboardHref?: string;
};

/** Account button shown in the navbar once someone is logged in. */
export function UserMenu({ user, t }: { user: NavUserDetails; t: Dictionary["auth"] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="user-menu"
        aria-label={t.account}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-display text-lg font-bold uppercase text-forest-deep ring-2 ring-white/30 transition hover:ring-white/60"
      >
        {(user?.name || user?.email).charAt(0)}
      </button>

      {open && (
        <div
          id="user-menu"
          className="absolute right-0 top-12 z-50 w-[min(18rem,calc(100vw-2rem))] rounded-2xl bg-card p-5 text-ink shadow-2xl ring-1 ring-sand"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{t.account}</p>
          <p className="mt-0.5 break-words font-display text-lg font-bold text-forest">{user?.name}</p>
          <dl className="mt-3 space-y-2.5 text-sm">
            <Row icon={Mail} label={t.email} value={user?.email} />
            {user?.phone && <Row icon={Phone} label={t.phone} value={user?.phone} />}
            {user?.location && <Row icon={MapPin} label={t.location} value={user?.location} />}
            <Row icon={CalendarDays} label={t.memberSince} value={user?.memberSince} />
          </dl>
          <Link
            href={user?.accountHref}
            onClick={() => setOpen(false)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-bold text-forest-deep transition hover:bg-[#ecc272]"
          >
            <UserRound className="h-4 w-4" aria-hidden />
            {t.account}
          </Link>
          {user?.dashboardHref && (
            <Link
              href={user?.dashboardHref}
              onClick={() => setOpen(false)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-bold text-cream transition hover:bg-forest-deep"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden />
              {t.dashboard}
            </Link>
          )}
          <p className="mt-4 text-xs text-ink/60">{t.accountLead}</p>
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => logOut())}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-forest/20 px-4 py-2.5 text-sm font-bold text-forest transition hover:bg-forest hover:text-cream disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <LogOut className="h-4 w-4" aria-hidden />}
            {t.logout}
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden />
      <div className="min-w-0">
        <dt className="sr-only">{label}</dt>
        <dd className="break-words">{value}</dd>
      </div>
    </div>
  );
}
