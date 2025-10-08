// Authenticate the API call using Firebase Admin SDK
// Little confusing here because we are authenticating, not authorizing, but the request.headers uses "Authorization" header as a standard naming practice

// Introduction to the Admin Authentication API: https://firebase.google.com/docs/auth/admin
// called from app/api/openai/route.js

import { adminAuth } from "./firebase-admin.js";

export async function authenticateAPICall(request) {
  const authHeader = request.headers.get("Authorization");

  // Check if the Authorization header is present and properly formatted
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // get ID token from the Authorization header
  const idToken = authHeader.split("Bearer ")[1];

  // Authenticate the ID token using Firebase Admin SDK
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken); // Verifying ID tokens: https://firebase.google.com/docs/auth/admin/verify-id-tokens
    return decodedToken; // We can use this to authorize the user if needed - e.g. check user ID, roles, etc. - but not implemented yet
  } catch (error) {
    if (error.name === "FirebaseAuthError") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    console.error("Authorization error:", error);
    return new Response(JSON.stringify({ error: "Authorization failed" }), {
      status: 500,
    });
  }
}
