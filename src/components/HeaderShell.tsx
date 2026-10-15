"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Sticky header that is fully transparent over the hero video and turns into
 * frosted glass once the page scrolls, so the links stay readable everywhere.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      // -mb-16 lets the hero slide up underneath the (transparent) header.
      className={`sticky top-0 z-50 -mb-16 border-b text-cream transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? "border-white/10 bg-forest/75 shadow-lg shadow-black/10 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      {children}
    </header>
  );
}
