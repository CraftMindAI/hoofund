"use client";

import { CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, MapPin, Phone, User, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { checkAccount, completeLogIn, completeSignUp, requestPasswordReset } from "@/lib/auth-actions";
import { cleanLocation, cleanName, LOCATION_MAX, NAME_MAX, normalizePhone, PASSWORD_MIN } from "@/lib/validation";
import { AUTH_EVENT, type AuthMode } from "./AuthTrigger";
import { Field, inputClass } from "./fields";

type Text = Dictionary["auth"];
type ErrorKey = keyof Text["errors"];

const firebaseErrors: Record<string, ErrorKey> = {
  "auth/email-already-in-use": "emailInUse",
  "auth/invalid-email": "invalidEmail",
  "auth/weak-password": "weakPassword",
  "auth/invalid-credential": "wrongLogin",
  "auth/wrong-password": "wrongLogin",
  "auth/user-not-found": "wrongLogin",
  "auth/too-many-requests": "tooMany",
  "auth/network-request-failed": "network",
};

function errorKey(err: unknown): ErrorKey {
  const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
  return firebaseErrors[code] ?? "generic";
}

/** Login and sign-up in one popup. Opened with `openAuth()` or `<AuthTrigger>`. */
export function AuthDialog({ lang, t }: { lang: Locale; t: Text }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState<ErrorKey | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleId = useId();

  useEffect(() => {
    const onOpen = (e: Event) => {
      setMode((e as CustomEvent<AuthMode>).detail ?? "login");
      setError(null);
      setNotice(null);
      dialog.current?.showModal();
    };
    window.addEventListener(AUTH_EVENT, onOpen);
    return () => window.removeEventListener(AUTH_EVENT, onOpen);
  }, []);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  async function onForgotPassword() {
    const email = String(new FormData(formRef.current ?? undefined).get("email") ?? "").trim();
    setNotice(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("invalidEmail");

    setBusy(true);
    setError(null);
    try {
      const result = await requestPasswordReset(lang, email);
      if (result?.ok) setNotice(t.resetSent.replace("{email}", email));
      else setError(result?.error);
    } catch (err) {
      console.error(err);
      setError("generic");
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const phone = String(form.get("phone") ?? "");
    const location = String(form.get("location") ?? "");

    // Check the extra sign-up fields before an account is created.
    if (mode === "signup") {
      if (!cleanName(name)) return setError("name");
      if (password.length < PASSWORD_MIN) return setError("weakPassword");
      if (!normalizePhone(phone)) return setError("phone");
      if (!cleanLocation(location)) return setError("location");
    }

    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      // Login: look the email up in our database first; only known users go on to Firebase.
      if (mode === "login") {
        const found = await checkAccount(email);
        if (!found.ok) return setError(found.error);
      }

      // Loaded on demand so the landing page doesn't ship the Firebase SDK.
      const [{ getClientAuth }, fb] = await Promise.all([import("@/lib/firebase/client"), import("firebase/auth")]);
      const auth = await getClientAuth();
      const cred =
        mode === "signup"
          ? await fb.createUserWithEmailAndPassword(auth, email, password)
          : await fb.signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      // The server session takes over from here, so drop the browser's Firebase login first.
      await fb.signOut(auth);

      const result =
        mode === "signup"
          ? await completeSignUp(lang, { idToken, name, phone, location })
          : await completeLogIn(lang, idToken);

      if (result?.ok) {
        formEl.reset();
        dialog.current?.close();
        // A full page load, so every part of the site picks up the new session.
        // Admins go to /{lang}/admin, everyone else to /{lang}/account.
        window.location.assign(result?.redirectTo);
      } else {
        setError(result?.error);
      }
    } catch (err) {
      console.error(err);
      setError(errorKey(err));
    } finally {
      setBusy(false);
    }
  }

  const isSignup = mode === "signup";

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      // A click on the dimmed area outside the card lands on the dialog itself.
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      className="auth-dialog m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl bg-card p-0 text-ink shadow-2xl"
    >
      <div className="relative px-6 pb-7 pt-6 sm:px-8">
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          aria-label={t.close}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition hover:bg-sand hover:text-ink"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <Image
          src="/images/hoofund-emblem.webp"
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 rounded-full bg-cream p-0.5 ring-1 ring-sand"
        />
        <h2 id={titleId} className="mt-4 font-display text-2xl font-bold text-forest">
          {isSignup ? t.signupTitle : t.loginTitle}
        </h2>
        <p className="mt-1 text-sm text-ink/70">{isSignup ? t.signupLead : t.loginLead}</p>

        <div className="mt-5 grid grid-cols-2 rounded-full bg-sand/70 p-1 text-sm font-semibold">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => switchMode(m)}
              className={`rounded-full py-2 transition ${
                mode === m ? "bg-white text-forest shadow-sm" : "text-ink/60 hover:text-ink"
              }`}
            >
              {m === "login" ? t.login : t.signup}
            </button>
          ))}
        </div>

        <form ref={formRef} onSubmit={onSubmit} className="mt-5 space-y-4">
          {isSignup && (
            <Field icon={User} label={t.name}>
              <input name="name" type="text" required maxLength={NAME_MAX} autoComplete="name" className={inputClass} />
            </Field>
          )}

          <Field icon={Mail} label={t.email}>
            <input name="email" type="email" required autoComplete="email" className={inputClass} />
          </Field>

          {isSignup && (
            <Field icon={Phone} label={t.phone} hint={t.phoneHint} prefix="+91">
              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                required
                autoComplete="tel-national"
                maxLength={14}
                className={`${inputClass} pl-[4.75rem]`}
              />
            </Field>
          )}

          <Field icon={Lock} label={t.password} hint={isSignup ? t.passwordHint : undefined}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={isSignup ? PASSWORD_MIN : undefined}
              autoComplete={isSignup ? "new-password" : "current-password"}
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? t.hidePassword : t.showPassword}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink/50 hover:text-ink"
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
            </button>
          </Field>

          {isSignup && (
            <Field icon={MapPin} label={t.location} hint={t.locationHint}>
              <input
                name="location"
                type="text"
                required
                maxLength={LOCATION_MAX}
                autoComplete="address-level2"
                placeholder={t.locationPlaceholder}
                className={inputClass}
              />
            </Field>
          )}

          {!isSignup && (
            <div className="-mt-2 text-right">
              <button
                type="button"
                onClick={onForgotPassword}
                disabled={busy}
                className="text-sm font-semibold text-leaf underline-offset-4 hover:underline disabled:opacity-60"
              >
                {t.forgotPassword}
              </button>
            </div>
          )}

          {notice && (
            <p
              role="status"
              className="flex items-start gap-2 rounded-xl bg-leaf/10 px-4 py-3 text-sm font-medium text-forest ring-1 ring-leaf/25"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden />
              {notice}
            </p>
          )}

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
              {t.errors[error]}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 font-bold text-cream transition hover:bg-forest-deep disabled:opacity-70"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {busy ? t.working : isSignup ? t.submitSignup : t.submitLogin}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink/70">
          {isSignup ? t.haveAccount : t.noAccount}{" "}
          <button
            type="button"
            onClick={() => switchMode(isSignup ? "login" : "signup")}
            className="font-bold text-leaf underline-offset-4 hover:underline"
          >
            {isSignup ? t.toLogin : t.toSignup}
          </button>
        </p>
      </div>
    </dialog>
  );
}
