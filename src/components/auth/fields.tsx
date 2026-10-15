import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-xl border border-sand bg-white py-3 pl-11 pr-4 text-base text-ink outline-none transition placeholder:text-ink/35 focus:border-leaf focus:ring-2 focus:ring-leaf/25";

/** Labelled input with a leading icon, used by the login and add-user popups. */
export function Field({
  icon: Icon,
  label,
  hint,
  prefix,
  children,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string;
  prefix?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink/85">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-leaf" aria-hidden />
        {prefix && (
          <span className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-base font-semibold text-ink/60">
            {prefix}
          </span>
        )}
        {children}
      </span>
      {hint && <span className="mt-1 block text-xs text-ink/55">{hint}</span>}
    </label>
  );
}
