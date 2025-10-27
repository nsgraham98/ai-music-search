// API route for user profile operations
// Handles creating, updating, and retrieving user profiles

import {
  authenticateCookie,
  // authenticateIdToken,
} from "@/lib/authenticate-calls";
import { db } from "@/lib/firebase-admin.js";

// GET - Retrieve user profile
// if ?uid= is provided, get that user's profile (for viewing other users)
// if no uid provided, get the profile of the authenticated user (requires auth)
export async function GET(req) {
  try {
    // Get the optional UID from query parameters, to view other users' profiles
    const url = new URL(req.url);
    const uid = url.searchParams.get("uid");

    // Get profile of the current authenticated user (if no uid provided)
    if (!uid) {
      const decoded = await authenticateCookie(req);
      console.log("GET user profile for authenticated user:", decoded);
      const userUid = decoded.uid;

      if (!userUid) {
        return new Response(JSON.stringify({ error: "No user ID found" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      const docRef = db.collection("users").doc(userUid);
      const userDoc = await docRef.get();

      // handle user not found with a 404
      if (!userDoc.exists) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "User not found",
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Return the user profile
      const user = userDoc.data();
      const result = { success: true, data: user };
      console.log("👤 Current user profile retrieved");
      return new Response(JSON.stringify(result), {
        status: user ? 200 : 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const docRef = db.collection("users").doc(uid);
    const userDoc = await docRef.get();

    if (!userDoc.exists) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = userDoc.data();
    const cleanedUser = { displayName: user.displayName, uid: user.uid }; // Exclude sensitive fields - can add more public fields as needed
    const result = { success: true, data: cleanedUser };
    console.log("👤 Public user profile retrieved");
    // Return the public user profile
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 404,
      headers: { "Content-Type": "application/json" },
    });
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

// POST - Create user profile
export async function POST(req) {
  try {
    // Authenticate the user making the request
    const decodedUser = await authenticateCookie(req);
    const uid = decodedUser.uid;
    const { provider } = await req.json();
    if (!uid || !provider) {
      return new Response(
        JSON.stringify({ error: "Missing UID or provider in request" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if user profile already exists
    const existingProfile = await db.collection("users").doc(uid).get();
    if (existingProfile.exists) {
      return new Response(
        JSON.stringify({ error: "User profile already exists" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create a new user profile with default values
    await db
      .collection("users")
      .doc(uid)
      .set({
        uid,
        provider,
        displayName: decodedUser.name || "New User",
        email: decodedUser.email,
        created_at: new Date().toISOString(),
        // Add other default fields as needed
      });

    console.log("👤 User profile created for UID:", uid);
    // Return the created user profile
    const createdUserProfile = await db.collection("users").doc(uid).get();
    const result = createdUserProfile.data();
    if (!result) {
      return new Response(
        JSON.stringify({ error: "Failed to retrieve created user profile" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ ok: true, userProfile: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST user profile error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create user profile" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// TODO: improve PATCH to allow updating other fields
// PATCH - Update specific fields (like displayName)
export async function PATCH(req) {
  try {
    const updatedProfileData = await req.json();
    const decodedToken = await authenticateCookie(req);
    const uid = decodedToken.uid;

    await db
      .collection("users")
      .doc(uid)
      .set(
        {
          ...updatedProfileData,
          lastUpdated: Date.now(),
        },
        { merge: true }
      );

    console.log("👤 User profile updated for UID:", uid);
    return new Response(JSON.stringify({ ok: true }), {
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

// TODO: add DELETE method to delete user profile (admin only?)
export async function DELETE(req) {
  return new Response(
    JSON.stringify({ error: "DELETE method not implemented" }),
    {
      status: 501,
      headers: { "Content-Type": "application/json" },
    }
  );
}
