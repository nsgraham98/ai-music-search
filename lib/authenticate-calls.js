/*
  Authenticate the API call using Firebase Admin SDK

  Should be called from API routes that need authentication 
    e.g. to get user profile, save user data, openAI calls, spotify calls (I assume), etc.

  Introduction to the Admin Authentication API: https://firebase.google.com/docs/auth/admin
  Verifying cookies: https://firebase.google.com/docs/auth/admin/manage-cookies
  Verifying ID tokens: https://firebase.google.com/docs/auth/admin/verify-id-tokens
  - Nick
*/

import { adminAuth } from "./firebase-admin.js";
import { cookies } from "next/headers";

/* 
  Authenticate the user using a session cookie.
  We should use this method for most API routes that require authentication, since we are using session cookies for user sessions.
  This is more secure than using ID tokens in the Authorization header, since cookies are HttpOnly and Secure.
  See: https://firebase.google.com/docs/auth/admin/manage-cookies

  To use this method, the client must send the request which contains the cookie
  The cookie is set in the response headers when the user signs in (see app/api/session/route.js)
  - Nick
*/
export async function authenticateCookie(request) {
  // Get the Cookie header from the request
  const cookie = await cookies();
  const sessionCookie = cookie.get("session")?.value;

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
    console.log("User successfully authenticated with cookie");
    // return new Response(JSON.stringify({ decodedToken }), {
    //   status: 200,
    // });
    return decodedToken;
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

/*
  Authenticate the user using an ID token passed in the Authorization header
  We should only use this method for testing
  In general, we should use authenticateCookie() for user authentication
  Format for authorization header:
    headers: { Authorization: "Bearer <session token>" }
*/
export async function authenticateIdToken(request) {
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
    console.log("User successfully authenticated");
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
