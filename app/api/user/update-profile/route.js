import { db } from "@/lib/firebase-admin";
import { authorizeAPICall } from "@/lib/authorize-calls";
import { saveUserSession } from "@/app/api/session/session-handler/session";

export async function POST(request) {
  const decodedToken = await authorizeAPICall(request);
  const { displayName } = await request.json();

  if (!displayName) {
    return new Response(JSON.stringify({ error: "Display name required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Update user profile using Admin SDK
  const userRef = db.collection("users").doc(decodedToken.uid);
  await userRef.update({ displayName });

  // Fetch updated user profile for session update
  const userSnap = await userRef.get();
  const userData = userSnap.data();

  // Update session data as well
  await saveUserSession({
    uid: decodedToken.uid,
    email: userData.email,
    displayName: displayName,
    photoURL: userData.photoURL,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
