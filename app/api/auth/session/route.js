// This file is the API route that actually calls the database to save the session data

import { dbAdmin } from "@/lib/firebase-admin.js";
import { authenticateCookie } from "@/lib/authenticate-calls.js";
import { cookies } from "next/headers";
import { getDoc } from "firebase/firestore";

// saves the session data to the database
export async function POST(request) {
  try {
    const decodedToken = await authenticateCookie(request); // authenticate the user using the session cookie

    const uid = decodedToken.uid;
    const email = decodedToken.email || null;
    const cookie = await cookies();
    const maxAge = cookie.get("Max-Age") || 60 * 60 * 24 * 7; // default to one week

    const sessionDocRef = dbAdmin.collection("sessions").doc(uid);
    // Save session data to the database
    await sessionDocRef.set(
      {
        sessionData: {
          uid: uid, // redundant but useful to have in the document
          // sessionCookie: sessionCookie, // unsafe to store
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
    console.log("🍪 Session data saved to database");

    // https://firebase.google.com/docs/auth/admin/manage-cookies
    // set the cookie in the response headers
    return new Response(JSON.stringify({ uid: uid, ok: true }), {
      // return uid for confirmation
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Session error:", err);
    return new Response("Failed", { status: 500 });
  }
}

// GET - Verify session cookie and return session data, user info
export async function GET(req) {
  try {
    // Check if session cookie exists
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) {
      console.log("🍪 No session cookie found");
      return new Response(
        JSON.stringify({ error: "No session cookie found" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const decoded = await authenticateCookie(req);
    if (!decoded) {
      return new Response(JSON.stringify({ error: "No valid session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    // get session data from the database if needed
    const sessionDocRef = dbAdmin.collection("sessions").doc(decoded.uid);
    const docSnap = await getDoc(sessionDocRef);

    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ error: "No valid session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const sessionData = docSnap.data();
    return new Response(
      JSON.stringify({ ok: true, session: sessionData, authUser: decoded }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("GET session error:", error);
    return new Response(JSON.stringify({ error: "Failed to get session" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
