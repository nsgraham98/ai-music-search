import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
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

  // Update user profile
  const userRef = doc(db, "users", decodedToken.uid);
  await updateDoc(userRef, { displayName });

  // Fetch updated user profile for session update
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  // Update session data as well
  await saveUserSession(
    {
      uid: decodedToken.uid,
      email: userData.email,
      displayName: displayName,
      photoURL: userData.photoURL,
    }
  );

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
