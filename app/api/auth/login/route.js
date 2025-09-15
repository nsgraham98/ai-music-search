import { serialize } from "cookie";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createUserProfile } from "@/lib/user-profile";

export async function POST(request) {
  const sessionData = await request.json();

  // Create user profile in Firestore if it doesn't exist
  await createUserProfile({
    uid: sessionData.uid,
    displayName: sessionData.displayName,
    email: sessionData.email,
    photoURL: sessionData.photoURL,
  });

  // Save session data to the database and return the id
  const docRef = await addDoc(collection(db, "sessions"), sessionData);

  const cookie = serialize("session", docRef.id, {
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
