// This endpoint is called to log the user out by deleting the session cookie
// Gets called from logout-button.jsx component and firebaseSignOut function in auth-context.jsx

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin.js";

// Log out user by deleting the session cookie
export async function POST(request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  // If no session cookie, return 400
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: "No session cookie found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie);
    const uid = decoded.uid;

    await adminAuth.revokeRefreshTokens(uid); // revoke all refresh tokens for the user to force re-authentication
    cookieStore.delete("session");
    cookieStore.delete("Max-Age");
    cookieStore.delete("uid");
    console.log("🔒 User logged out, session cookie deleted");
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to log out" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
