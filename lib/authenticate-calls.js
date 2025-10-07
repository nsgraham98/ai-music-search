// Authenticate the API call using Firebase Admin SDK
// Little confusing here because we are authenticating, not authorizing, but the request.headers uses "Authorization" header as a standard naming practice

// Introduction to the Admin Authentication API: https://firebase.google.com/docs/auth/admin
// Verifying ID tokens: https://firebase.google.com/docs/auth/admin/verify-id-tokens
// called from app/api/openai/route.js

import { adminAuth } from "./firebase-admin.js";
import { cookies } from "next/headers";

export async function authenticateAPICall(request) {
  // Get the Authorization header from the request
  const authHeader = request.headers.get("Authorization");

  // Check if the Authorization header is present and properly formatted
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // get ID token from the Authorization header
  const idToken = authHeader.split("Bearer ")[1]; // "Bearer <token>""

  // Authenticate the ID token using Firebase Admin SDK
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken); // Verifying ID tokens: https://firebase.google.com/docs/auth/admin/verify-id-tokens
    console.log("User successfully authenticated:", decodedToken);
    return new Response(JSON.stringify({ decodedToken }), {
      status: 200,
    });
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

export async function authenticateCookie(request) {
  // Get the Cookie header from the request
  const cookie = await cookies();
  const sessionCookie = cookie.get("session")?.value;
  console.log("Session cookie from request:", sessionCookie);

  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  try {
    const decodedToken = await adminAuth.verifySessionCookie(
      sessionCookie,
      true /* checkRevoked */
    );
    console.log("User successfully authenticated with cookie:", decodedToken);
    return new Response(JSON.stringify({ decodedToken }), {
      status: 200,
    });
  } catch (error) {
    if (error.name === "FirebaseAuthError") {
      // TODO: if session cookie is expired or revoked, force user to re-authenticate (login)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    console.error("Cookie authorization error:", error);
    return new Response(JSON.stringify({ error: "Authorization failed" }), {
      status: 500,
    });
  }
}
