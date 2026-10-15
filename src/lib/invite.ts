import "server-only";
import { headers } from "next/headers";
import type { Locale } from "@/app/[lang]/dictionaries";

const SEND_OOB_URL = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode";

/**
 * Emails a "set your password" link using Firebase's own email service
 * (the Password reset template in the Firebase console). Returns false if
 * Firebase could not send it.
 */
export async function sendPasswordSetupEmail(email: string, lang: Locale): Promise<boolean> {
  const origin = (await headers()).get("origin");

  const send = (continueUrl?: string) =>
    fetch(`${SEND_OOB_URL}?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
      method: "POST",
      headers: { "content-type": "application/json", "X-Firebase-Locale": lang },
      body: JSON.stringify({ requestType: "PASSWORD_RESET", email, ...(continueUrl && { continueUrl }) }),
    });

  try {
    // After setting a password, the "Continue" button brings them back to the site.
    let res = await send(origin ? `${origin}/${lang}` : undefined);
    // That only works for domains listed under Firebase → Authentication → Settings → Authorized domains.
    if (!res.ok && origin) res = await send();
    if (!res.ok) console.error("Invite email not sent", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("Invite email not sent", err);
    return false;
  }
}
