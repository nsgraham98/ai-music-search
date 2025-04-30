import { serialize } from "cookie";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase"; // import the firebase database instance

export async function POST(request, response) {
  const sessionData = await request.json(); // get the session data from the request body
  const docRef = await addDoc(collection(db, "sessions"), sessionData); // save session data to the database and return the id
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
