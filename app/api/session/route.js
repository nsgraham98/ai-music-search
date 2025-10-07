// This file is the API route that actually calls the database to save the session data
// this is called from session-handler/session.js, which is called from auth-context.jsx within its sign-in functions (githubSignIn, googleSignIn, facebookSignIn)

import { adminAuth, db, admin } from "@/lib/firebase-admin";

// saves the session data to the database
export async function POST(req) {
  try {
    // const { token, providerAccessToken, thirdPartyTokens } = await req.json();
    console.log(
      "====================================REQ IN SESSION/ROUTE.JS",
      req
    );
    const { idToken } = await req.json();
    console.log(
      "====================================ID TOKEN IN SESSION/ROUTE.JS",
      idToken
    );
    if (!idToken) {
      return new Response(
        JSON.stringify({ error: "Missing idToken in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    // Verify the ID token and get the user info
    const decoded = await adminAuth.verifyIdToken(idToken);
    console.log(
      "====================================DECODED TOKEN IN SESSION/ROUTE.JS",
      decoded
    );
    const { uid, email } = decoded;
    console.log(
      "====================================USER INFO IN SESSION/ROUTE.JS",
      { uid, email }
    );

    const maxAge = 60 * 60 * 24 * 7 * 1000; // milliseconds - one week
    const cookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: maxAge,
    }); // create a session cookie using the verified token

    // save session data to Firestore database
    // session > {uid} > sessionData: {uid, cookie, email, created_at, expires_at, valid}
    console.log("====================================BEFORE DB WRITE");
    await db
      .collection("sessions")
      .doc(uid)
      .set(
        {
          sessionData: {
            uid: uid, // redundant but useful to have in the document
            cookie: cookie,
            email: email || null,
            created_at: new Date(Date.now()),
            expires_at: new Date(Date.now() + maxAge),
            valid: true, // global shut down flag for all sessions
            thirdPartyTokens: {}, // placeholder for third party tokens... we have none right now, but possibly for spotify in the future
            // we can put whatever else we want to save here - current track, preferences, etc.
          },
        },
        { merge: true }
      );

    // https://firebase.google.com/docs/auth/admin/manage-cookies
    // set the cookie in the response headers
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `session=${cookie}; HttpOnly; Path=/; Max-Age=${maxAge / 1000}`, // session=${cookie} -> name=value pair
      },
    });
  } catch (err) {
    console.error("Session error:", err);
    return new Response("Failed", { status: 500 });
  }
}

// Placeholder for future GET method to retrieve session data
export async function GET(req) {
  try {
    // Get the current session
    // TODO: implement this
  } catch (error) {
    console.error("GET session error:", error);
    return new Response(JSON.stringify({ error: "Failed to get session" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
