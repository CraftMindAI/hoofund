"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type Props = {
  links: { href: string; label: string }[];
  join: { href: string; label: string };
  openLabel: string;
  closeLabel: string;
};

export function MobileMenu({ links, join, openLabel, closeLabel }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? closeLabel : openLabel}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-cream ring-1 ring-white/20 transition hover:bg-white/20"
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              aria-hidden
              className="absolute inset-x-0 top-16 z-40 h-[100dvh] bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              id="mobile-menu"
              className="absolute inset-x-0 top-16 z-50 border-b border-white/10 bg-forest-deep px-4 pb-6 pt-2 shadow-2xl sm:px-6"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="divide-y divide-white/10">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block py-3.5 text-base font-semibold text-cream/90 transition-colors hover:text-gold"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={join.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-4 flex items-center justify-center rounded-full bg-gold px-5 py-3 font-bold text-forest-deep"
              >
                {join.label}
              </a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
