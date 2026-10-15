"use client";

import type { ReactNode } from "react";

export type AuthMode = "login" | "signup";

export const AUTH_EVENT = "hoofund:auth";

/** Opens the login / sign-up popup from anywhere on the page. */
export function openAuth(mode: AuthMode = "login") {
  window.dispatchEvent(new CustomEvent<AuthMode>(AUTH_EVENT, { detail: mode }));
}

export function AuthTrigger({
  mode = "login",
  className,
  label,
  children,
}: {
  mode?: AuthMode;
  className?: string;
  /** Accessible name, for icon-only buttons. */
  label?: string;
  children: ReactNode;
}) {
  return (
    <button type="button" onClick={() => openAuth(mode)} aria-label={label} className={className}>
      {children}
    </button>
  );
}
