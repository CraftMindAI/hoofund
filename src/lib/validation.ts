// Shared by the sign-up form (instant feedback) and the server (the real check).

/** Normalises an Indian mobile number to E.164 (+91XXXXXXXXXX), or null if invalid. */
export function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/[\s\-()]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}

export const NAME_MIN = 2;
export const NAME_MAX = 100;
export const LOCATION_MIN = 2;
export const LOCATION_MAX = 160;
export const PASSWORD_MIN = 8;

export function cleanName(raw: string): string | null {
  const value = raw.trim().replace(/\s+/g, " ");
  return value.length >= NAME_MIN && value.length <= NAME_MAX ? value : null;
}

export function cleanLocation(raw: string): string | null {
  const value = raw.trim().replace(/\s+/g, " ");
  return value.length >= LOCATION_MIN && value.length <= LOCATION_MAX ? value : null;
}

/** Shown in place of a missing value. */
export const MISSING = "—";

/** +919876543210 → +91 98765 43210, for display. */
export function formatPhone(phone?: string | null): string {
  return phone ? phone.replace(/^\+91(\d{5})(\d{5})$/, "+91 $1 $2") : MISSING;
}

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** 85000 → ₹85,000 (Indian digit grouping). */
export function formatRupees(amount?: number | null): string {
  return amount == null ? MISSING : `₹${inr.format(amount)}`;
}

/** A date in the page's language, e.g. "8 Oct 2026". A missing date shows "—" (not today's date). */
export function formatDate(date: Date | null | undefined, lang: string, style: "medium" | "long" = "medium"): string {
  return date ? new Intl.DateTimeFormat(lang === "ta" ? "ta-IN" : "en-IN", { dateStyle: style }).format(date) : MISSING;
}

/** "₹1,70,000" / "170000" → 170000, or null if it isn't a whole number between min and max. */
export function parseWholeNumber(raw: string, min: number, max: number): number | null {
  const digits = raw.replace(/[₹,\s]/g, "");
  if (!/^\d+$/.test(digits)) return null;
  const n = Number(digits);
  return n >= min && n <= max ? n : null;
}
