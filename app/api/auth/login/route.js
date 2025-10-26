// NOT IN USE - don't delete yet

// This endpoint is called after a successful login to set a session cookie
// The session cookie contains the Firestore document ID where session data is stored
// This allows the server to identify the user session on subsequent requests

import { adminAuth } from "@/lib/firebase-admin.js";

export async function POST(req) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return new Response(
        JSON.stringify({ error: "Missing idToken in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify the ID token and get the user info
    const decoded = await adminAuth.verifyIdToken(idToken);
    console.log("🔒 IdToken successfully verified");

    const expiresIn = 60 * 60 * 24 * 7 * 1000; // one week
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });
    console.log("🍪 Session cookie created");

    // set the cookie in the response headers
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `session=${sessionCookie}; HttpOnly; Secure; Path=/; Max-Age=${expiresIn / 1000}`, // session=${cookie} -> name=value pair
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return new Response("Failed to log in", { status: 500 });
  }
}
