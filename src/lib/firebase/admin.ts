import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

/**
 * Firebase Admin, created on first use so pages that never touch auth don't
 * need the credentials. They come from the Firebase console
 * (Project settings → Service accounts → Generate new private key).
 */
export function getAdminAuth() {
  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // .env files store the key on one line with literal "\n".
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, "\n"),
      }),
    });
  return getAuth(app);
}
