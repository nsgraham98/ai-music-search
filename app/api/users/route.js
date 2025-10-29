// API route for user profile operations
// Handles creating, updating, and retrieving user profiles

import {
  authenticateCookie,
  authenticateIdToken,
  // authenticateIdToken,
} from "@/lib/authenticate-calls";
import { cookies } from "next/headers";
import { db } from "@/lib/firebase-admin.js";

// GET - Retrieve the current user's profile
export async function GET(req) {
  try {
    let decodedUser = await authenticateCookie(req);
    console.log("Decoded user following authenticateCookie:", decodedUser);
    if (!decodedUser.ok) {
      // if cookie auth fails, try ID token auth as backup
      decodedUser = await authenticateIdToken(req);
      console.log("Decoded user following authenticateIdToken:", decodedUser);
    }
    const uid = decodedUser.uid;
    if (!uid) {
      return new Response(
        JSON.stringify({ error: "UID not found in decoded token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userDocRef = db.collection("users").doc(uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      return new Response(JSON.stringify({ error: "User profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    const userData = userDoc.data();
    const result = { success: true, userProfile: userData };

    console.log("👤 Current user profile retrieved");
    // Return the current user profile
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
    const existingUserDocRef = doc(db, "users", uid);
    const existingProfile = await getDoc(existingUserDocRef);

    if (existingProfile.exists()) {
      return new Response(
        JSON.stringify({ error: "User profile already exists" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create a new user profile with default values
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, {
      uid,
      provider,
      displayName: decodedUser.name || "New User",
      email: decodedUser.email,
      created_at: new Date().toISOString(),
      // Add other default fields as needed
    });

    console.log("👤 User profile created for UID:", uid);
    // Return the created user profile
    const newUserDocRef = doc(db, "users", uid);
    const userProfileSnap = await getDoc(newUserDocRef);
    const userProfile = userProfileSnap.data();

    if (!userProfileSnap.exists()) {
      return new Response(
        JSON.stringify({ error: "Failed to retrieve created user profile" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, userProfile: userProfile }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
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

    const userDocRef = doc(db, "users", uid);
    await setDoc(
      userDocRef,
      { ...updatedProfileData, lastUpdated: Date.now() },
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
