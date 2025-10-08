// API route for user profile operations
// Handles creating, updating, and retrieving user profiles

import {
  saveUserProfile,
  getUserProfile,
  updateDisplayName,
} from "./user-handler/user-profile";
import {
  authenticateCookie,
  // authenticateIdToken,
} from "@/lib/authenticate-calls";

// GET - Retrieve user profile
export async function GET(req) {
  try {
    // Get the UID from query parameters or from authorization header
    const url = new URL(req.url);
    const uid = url.searchParams.get("uid");
    // console.log("Requested UID:", uid);
    // console.log("Full URL:", req.url);

    if (!uid) {
      // If no UID provided, try to get it from the auth token
      const authHeader = req.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ error: "No authorization token provided" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      /*
        @francis i added this, in place of the commented code below
        it's a method i wrote for authentication logic, but in a centralized location for reusability
        You give it the request you're making, it extracts and verifies the "session=<session ID>" value of the cookie, throws an error if invalid, then returns the decoded token
        The decoded object it returns is structured like this:
        decodedToken: {
          uid: "user-uid",
          email: "user@example.com",
          etc.
        }
        -Nick
      */
      //console.log("REQUEST", req);
      const decodedToken = await authenticateCookie(req);
      console.log("DECODED TOKEN", decodedToken);
      const userUid = decodedToken.uid;
      console.log("User UID from token:", userUid);

      // const token = authHeader.split(" ")[1];
      // const decoded = await adminAuth.verifyIdToken(token);
      // const userUid = decoded.uid;

      const result = await getUserProfile(userUid);
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 404,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Get profile by provided UID (for viewing other users' profiles)
      const result = await getUserProfile(uid);
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("GET user profile error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to retrieve user profile" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// POST - Create or update user profile
export async function POST(req) {
  try {
    // Get the token and profile data from the request body
    const { token, profileData } = await req.json();

    // if (!token || !profileData) {
    //   return new Response(
    //     JSON.stringify({ error: "Missing token or profile data" }),
    //     {
    //       status: 400,
    //       headers: { "Content-Type": "application/json" },
    //     }
    //   );
    // }

    const decodedToken = await authenticateCookie(req);
    const uid = decodedToken.uid;

    // const token = authHeader.split(" ")[1];
    // const decoded = await adminAuth.verifyIdToken(token);
    // const userUid = decoded.uid;

    const result = await saveUserProfile(uid, profileData); // save to the database

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST user profile error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to save user profile" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// PATCH - Update specific fields (like displayName)
export async function PATCH(req) {
  try {
    const { displayName } = await req.json();
    // const token = req.headers.get("authorization");

    // if (!token || !displayName) {
    //   return new Response(
    //     JSON.stringify({ error: "Missing token or displayName" }),
    //     {
    //       status: 400,
    //       headers: { "Content-Type": "application/json" },
    //     }
    //   );
    // }

    const decodedToken = await authenticateCookie(req);
    const uid = decodedToken.uid;

    // const token = authHeader.split(" ")[1];
    // const decoded = await adminAuth.verifyIdToken(token);
    // const userUid = decoded.uid;

    const result = await updateDisplayName(uid, displayName);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PATCH user profile error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update user profile" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
