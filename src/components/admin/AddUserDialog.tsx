"use client";

import { CheckCircle2, Loader2, Mail, MapPin, Phone, ShieldCheck, TriangleAlert, User, UserPlus, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { Field, inputClass } from "@/components/auth/fields";
import { addUser, type AddUserError } from "@/lib/admin-actions";
import { LOCATION_MAX, NAME_MAX } from "@/lib/validation";

type Role = "USER" | "ADMIN";

/** "Add user" / "Add admin" button plus the popup form. Each new account gets an email invite to set a password. */
export function AddUserDialog({ lang, t, role }: { lang: Locale; t: Dictionary["admin"]; role: Role }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<AddUserError | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const titleId = useId();
  const f = t.form;
  const isAdmin = role === "ADMIN";
  const RoleIcon = isAdmin ? ShieldCheck : UserPlus;

  // Hide the "added" message after a while.
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 10000);
    return () => clearTimeout(id);
  }, [notice]);

  const open = () => {
    setError(null);
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
      const result = await addUser(lang, {
        name: value("name"),
        email: value("email"),
        phone: value("phone"),
        location: value("location"),
        role,
      });
      if (result?.ok) {
        formEl.reset();
        dialog.current?.close();
        const text = (result?.invited ? t.added : t.inviteFailed)
          .replace("{name}", result?.name ?? "")
          .replace("{email}", result?.email ?? "");
        setNotice({ text, ok: result?.invited });
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
    <>
      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        <button
          type="button"
          onClick={open}
          className="flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-cream shadow-sm transition hover:bg-forest-deep"
        >
          <RoleIcon className="h-4 w-4 text-gold" aria-hidden />
          {isAdmin ? t.admins.add : t.addUser}
        </button>
        {notice && (
          <p
            role="status"
            className={`flex max-w-sm items-start gap-1.5 text-sm font-semibold sm:text-right ${
              notice.ok ? "text-leaf" : "text-earth"
            }`}
          >
            {notice.ok ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            ) : (
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            )}
            {notice.text}
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
            <RoleIcon className="h-6 w-6" aria-hidden />
          </span>
          <h2 id={titleId} className="mt-4 font-display text-2xl font-bold text-forest">
            {isAdmin ? t.admins.formTitle : f.title}
          </h2>
          <p className="mt-1 text-sm text-ink/70">{isAdmin ? t.admins.formLead : f.lead}</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field icon={User} label={f.name}>
              <input name="name" type="text" required maxLength={NAME_MAX} autoComplete="off" className={inputClass} />
            </Field>
            <Field icon={Mail} label={f.email}>
              <input name="email" type="email" required autoComplete="off" className={inputClass} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field icon={Phone} label={f.phone} prefix="+91">
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={14}
                  autoComplete="off"
                  className={`${inputClass} pl-[4.75rem]`}
                />
              </Field>
              <Field icon={MapPin} label={f.location}>
                <input
                  name="location"
                  type="text"
                  maxLength={LOCATION_MAX}
                  autoComplete="off"
                  placeholder={f.locationPlaceholder}
                  className={inputClass}
                />
              </Field>
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
