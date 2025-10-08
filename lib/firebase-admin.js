// Initialize Firebase Admin SDK
// https://firebase.google.com/docs/admin/setup
// https://firebase.google.com/docs/auth/admin
// https://firebase.google.com/docs/firestore/quickstart

import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const adminApp = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });

// Export the auth and firestore instances for use in other files
export const adminAuth = getAuth(adminApp);
export const db = getFirestore(adminApp);
