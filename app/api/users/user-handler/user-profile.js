// This file handles logic regarding user profiles
// Functions for creating, updating, and retrieving user profile data
// Called from /api/users/route.js

import { adminAuth, db } from "@/lib/firebase-admin";
import { cleanForFirestore } from "@/utils/clean";

// Create or update a user profile
export async function saveUserProfile(uid, profileData) {
  try {
    // Prepare the profile data
    const userProfileData = cleanForFirestore({
      uid,
      email: profileData.email,
      displayName: profileData.displayName,
      provider: profileData.provider, // e.g., 'github', 'google', 'facebook'
      lastUpdated: Date.now(),
    });

    // Write to the database (the "users" collection, document ID is the user's uid)
    await db.collection("users").doc(uid).set(userProfileData, { merge: true });

    return { success: true, data: userProfileData };
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
}

// Retrieve a user profile by UID
export async function getUserProfile(uid) {
  try {
    const docRef = db.collection("users").doc(uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      return { success: true, data: data };
    } else {
      return { success: false, error: "User profile not found" };
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}

// Generate a default display name from email
export function generateDisplayName(email, providerDisplayName = null) {
  // First preference: use the provider's display name if available
  if (providerDisplayName && providerDisplayName.trim()) {
    return providerDisplayName.trim();
  }

  // Fallback: use the part before @ in the email
  if (email) {
    return email.split("@")[0];
  }

  // Last resort
  return "User";
}

// Update only the display name of a user profile
export async function updateDisplayName(uid, newDisplayName) {
  try {
    await db.collection("users").doc(uid).update({
      displayName: newDisplayName,
      lastUpdated: Date.now(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating display name:", error);
    throw error;
  }
}
