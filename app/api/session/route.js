// This file is the API route that actually calls the database to save the session data
// this is called from session-handler/session.js, which is called from auth-context.jsx within its sign-in functions (githubSignIn, googleSignIn, facebookSignIn)

import { adminAuth, db } from "@/lib/firebase-admin";
import { cleanForFirestore } from "@/utils/clean";

// saves the session data to the database
export async function POST(req) {
  try {
    const { token, providerAccessToken, thirdPartyTokens } = await req.json();
    const decoded = await adminAuth.verifyIdToken(token); // idk why this works and not authenticateAPICall(req)
    const uid = decoded.uid;

    // prepare the data to be saved
    // cleanForFirestore() adds a created_at timestamp and removes undefined values
    // we save the providerAccessToken and thirdPartyTokens (if they exist) for future use
    const sessionData = cleanForFirestore({
      uid,
      jamendo_access_token: thirdPartyTokens?.access_token,
      jamendo_refresh_token: thirdPartyTokens?.refresh_token,
      expires_at: thirdPartyTokens?.expires_at,
      providerAccessToken,
    });

    // write to the database (the "sessions" collection, document ID is the user's uid)
    await db.collection("sessions").doc(uid).set(
      {
        sessionData,
      },
      { merge: true }
    );

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Session error:", err);
    return new Response("Failed", { status: 500 });
  }
}
