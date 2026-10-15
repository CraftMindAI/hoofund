import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";

// Web app config from the Firebase console (Project settings → Your apps).
// These values are public by design; access is protected by Firebase rules.
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Firebase Auth for the browser. The server's session cookie is the source of
 * truth, so the browser keeps no Firebase login of its own.
 */
export async function getClientAuth() {
  const app = getApps().length ? getApp() : initializeApp(config);
  const auth = getAuth(app);
  await setPersistence(auth, inMemoryPersistence);
  return auth;
}
