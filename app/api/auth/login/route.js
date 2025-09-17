import { serialize } from "cookie";
import { db } from "@/lib/firebase-admin";
import { createUserProfile } from "@/lib/user-profile";

export async function POST(request) {
  const sessionData = await request.json();

  // Create user profile in Firestore if it doesn't exist
  const userRef = db.collection("users").doc(sessionData.uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    await userRef.set({
      uid: sessionData.uid,
      displayName: sessionData.displayName,
      email: sessionData.email,
      photoURL: sessionData.photoURL,
      online: true,
      createdAt: new Date().toISOString(),
    });
  }

  // Save session data to the database and return the id
  const sessionRef = await db.collection("sessions").add(sessionData);

  const cookie = serialize("session", sessionRef.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // One week
    path: "/",
  });

  return new Response(JSON.stringify({ message: "Successfully set cookie!" }), {
    status: 200,
    headers: {
      "Set-Cookie": cookie,
      "Content-Type": "application/json",
    },
  });
}
