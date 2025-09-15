import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { authorizeAPICall } from "@/lib/authorize-calls";

export async function POST(request) {
  const decodedToken = await authorizeAPICall(request);
  const { displayName } = await request.json();

  if (!displayName) {
    return new Response(JSON.stringify({ error: "Display name required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userRef = doc(db, "users", decodedToken.uid);
  await updateDoc(userRef, { displayName });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
