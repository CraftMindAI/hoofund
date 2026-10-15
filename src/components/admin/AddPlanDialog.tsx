"use client";

import { BadgeIndianRupee, CalendarRange, CheckCircle2, Coins, Loader2, PiggyBank, Plus, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { Field, inputClass } from "@/components/auth/fields";
import { addPlan, type AddPlanError } from "@/lib/admin-actions";

type Text = Dictionary["admin"]["plans"];

/** "Add plan" button plus the popup form. */
export function AddPlanDialog({ lang, t }: { lang: Locale; t: Text }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [error, setError] = useState<AddPlanError | null>(null);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState<number | null>(null);
  const titleId = useId();
  const f = t.form;

  useEffect(() => {
    if (added === null) return;
    const id = setTimeout(() => setAdded(null), 8000);
    return () => clearTimeout(id);
  }, [added]);

  const open = () => {
    setError(null);
    setFeatured(false);
    setActive(true);
    dialog.current?.showModal();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const value = (k: string) => String(form.get(k) ?? "");

    setBusy(true);
    setError(null);
    try {
      const result = await addPlan(lang, {
        cows: value("cows"),
        investment: value("investment"),
        monthly: value("monthly"),
        total: value("total"),
        featured,
        active,
      });
      if (result?.ok) {
        formEl.reset();
        dialog.current?.close();
        setAdded(result?.number);
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

  const rupeeInput = (name: string) => (
    <input
      name={name}
      type="text"
      inputMode="numeric"
      required
      autoComplete="off"
      placeholder="0"
      className={`${inputClass} pl-16`}
    />
  );

  return (
    <>
      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        <button
          type="button"
          onClick={open}
          className="flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-cream shadow-sm transition hover:bg-forest-deep"
        >
          <Plus className="h-4 w-4 text-gold" aria-hidden />
          {t.add}
        </button>
        {added !== null && (
          <p role="status" className="flex items-center gap-1.5 text-sm font-semibold text-leaf">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            {t.added.replace("{number}", String(added))}
          </p>
        )}
      </div>

      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="auth-dialog m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl bg-card p-0 text-ink shadow-2xl"
      >
        <div className="relative px-6 pb-7 pt-6 sm:px-8">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label={f.close}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition hover:bg-sand hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>

          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-gold">
            <BadgeIndianRupee className="h-6 w-6" aria-hidden />
          </span>
          <h2 id={titleId} className="mt-4 font-display text-2xl font-bold text-forest">
            {f.title}
          </h2>
          <p className="mt-1 text-sm text-ink/70">{f.lead}</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field icon={BadgeIndianRupee} label={f.cows}>
              <input
                name="cows"
                type="number"
                inputMode="numeric"
                min={1}
                max={1000}
                step={1}
                required
                className={inputClass}
              />
            </Field>
            <Field icon={PiggyBank} label={f.investment} hint={f.rupeeHint} prefix="₹">
              {rupeeInput("investment")}
            </Field>
            <Field icon={CalendarRange} label={f.monthly} hint={f.rupeeHint} prefix="₹">
              {rupeeInput("monthly")}
            </Field>
            <Field icon={Coins} label={f.total} hint={f.rupeeHint} prefix="₹">
              {rupeeInput("total")}
            </Field>

            <div className="space-y-2">
              <Toggle checked={active} onChange={setActive} label={f.active} hint={f.activeHint} />
              <Toggle checked={featured} onChange={setFeatured} label={f.featured} hint={f.featuredHint} />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
                {t.errors[error]}
              </p>
            )}

            <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => dialog.current?.close()}
                className="rounded-full px-5 py-3 text-sm font-bold text-ink/70 transition hover:bg-sand"
              >
                {f.cancel}
              </button>
              <button
                type="submit"
                disabled={busy}
                className="flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold text-cream transition hover:bg-forest-deep disabled:opacity-70"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {busy ? f.working : f.submit}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-sand bg-white p-3.5">
      <span>
        <span className="block text-sm font-bold text-ink">{label}</span>
        <span className="block text-xs text-ink/60">{hint}</span>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition peer-focus-visible:ring-2 peer-focus-visible:ring-leaf/40 ${
          checked ? "bg-forest" : "bg-sand"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[1.375rem]" : "left-0.5"}`}
        />
      </span>
    </label>
  );
}
