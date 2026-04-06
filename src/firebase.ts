import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVSndC4pI-W8z-2eCZkcCtrld79AwkUcM",
  authDomain: "klo-fullstack-66f70.firebaseapp.com",
  projectId: "klo-fullstack-66f70",
  storageBucket: "klo-fullstack-66f70.firebasestorage.app",
  messagingSenderId: "97964985400",
  appId: "1:97964985400:web:e1326e408d2102d6462acd",
  measurementId: "G-N8BXY56CV2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// ── Role Map ─────────────────────────────────────────────────────────────────
// Add emails here to assign roles. Everyone else → CLIENT
const ROLE_MAP: Record<string, "ADMIN" | "PARTNER"> = {
  "admin@klo.com":           "ADMIN",
  "karibbeanluxuryoperators@gmail.com": "ADMIN",
  "partner@klo.com":         "PARTNER",
  // Add more partner emails here as you onboard them
};

export type KLORole = "CLIENT" | "PARTNER" | "ADMIN";

export interface KLOUser {
  uid: string;
  email: string;
  name: string;
  photo: string | null;
  role: KLORole;
}

export function getRole(email: string | null): KLORole {
  if (!email) return "CLIENT";
  return ROLE_MAP[email.toLowerCase()] ?? "CLIENT";
}

export function firebaseUserToKLO(user: User): KLOUser {
  return {
    uid:   user.uid,
    email: user.email ?? "",
    name:  user.displayName ?? "Guest",
    photo: user.photoURL,
    role:  getRole(user.email),
  };
}

// ── Auth Actions ──────────────────────────────────────────────────────────────
export async function signInWithGoogle(): Promise<KLOUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return firebaseUserToKLO(result.user);
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export function onKLOAuthChange(callback: (user: KLOUser | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? firebaseUserToKLO(user) : null);
  });
}
