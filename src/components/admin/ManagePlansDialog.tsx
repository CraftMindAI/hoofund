"use client";

import { BadgeIndianRupee, Check, Loader2, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { setUserPlans, type SetUserPlansResult } from "@/lib/admin-actions";

export type PlanOption = { id: number; number: number; cows: number; active: boolean };

type Text = Dictionary["admin"];
type ErrorKey = Extract<SetUserPlansResult, { ok: false }>["error"];

/**
 * Checkbox list of every plan for one user. Saving stores the ticked plan ids
 * as an array, e.g. [1, 3]. Opens when `user` is set; render it with
 * `key={user?.id}` so each user starts from their own saved plans.
 */
export function ManagePlansDialog({
  lang,
  t,
  dict,
  plans,
  user,
  onClose,
  onSaved,
}: {
  lang: Locale;
  t: Text;
  dict: Pick<Dictionary["plans"], "plan" | "cow" | "cowsUnit">;
  plans: PlanOption[];
  user: { id: number; name: string; planIds: number[] } | null;
  onClose: () => void;
  onSaved: (name: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<number[]>(user?.planIds ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorKey | null>(null);
  const titleId = useId();
  const u = t.userPlans;

  useEffect(() => {
    if (user) dialog.current?.showModal();
  }, [user]);

  const toggle = (id: number) =>
    setSelected((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  async function save() {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      const result = await setUserPlans(lang, user?.id, selected);
      if (result?.ok) {
        dialog.current?.close();
        onSaved(user?.name);
      } else {
        setError(result?.error);
      }
    } catch (err) {
      console.error(err);
      setError("generic");
    } finally {
      setBusy(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      className="auth-dialog m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl bg-card p-0 text-ink shadow-2xl"
    >
      <div className="relative px-6 pb-7 pt-6 sm:px-8">
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          aria-label={u.close}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition hover:bg-sand hover:text-ink"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-gold">
          <BadgeIndianRupee className="h-6 w-6" aria-hidden />
        </span>
        <h2 id={titleId} className="mt-4 font-display text-2xl font-bold text-forest">
          {u.title.replace("{name}", user?.name ?? "")}
        </h2>
        <p className="mt-1 text-sm text-ink/70">{u.lead}</p>

        <fieldset className="mt-5 space-y-2">
          <legend className="sr-only">{t.columns.plans}</legend>
          {plans?.map((p) => {
            const checked = selected.includes(p?.id);
            return (
              <label
                key={p?.id}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-3.5 transition ${
                  checked ? "border-forest ring-2 ring-forest/15" : "border-sand hover:border-leaf"
                }`}
              >
                <input type="checkbox" checked={checked} onChange={() => toggle(p?.id)} className="peer sr-only" />
                <span
                  aria-hidden
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition peer-focus-visible:ring-2 peer-focus-visible:ring-leaf/40 ${
                    checked ? "border-forest bg-forest text-gold" : "border-ink/25 bg-white"
                  }`}
                >
                  {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-ink">
                    {dict.plan} {p?.number}
                    <span className="font-normal text-ink/60">
                      {" · "}
                      {p?.cows} {p?.cows === 1 ? dict.cow : dict.cowsUnit}
                    </span>
                  </span>
                  {!p?.active && <span className="block text-xs text-ink/50">{u.hidden}</span>}
                </span>
              </label>
            );
          })}
        </fieldset>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
            {u.errors[error]}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="rounded-full px-5 py-3 text-sm font-bold text-ink/70 transition hover:bg-sand"
          >
            {u.cancel}
          </button>
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold text-cream transition hover:bg-forest-deep disabled:opacity-70"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {busy ? u.working : u.save}
          </button>
        </div>
      </div>
    </dialog>
  );
}
