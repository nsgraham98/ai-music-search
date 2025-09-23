// This file handles saving user profiles during the sign-in process
// Called from auth-context.jsx within its sign-in functions

import { getIdToken } from "firebase/auth";

// Generate a default display name from email or provider display name
function generateDisplayName(email, providerDisplayName = null) {
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

export async function saveUserProfile(
  user,
  provider,
  providerAccessToken = null
) {
  try {
    const token = await getIdToken(user, true);

    // Extract display name from the user object (comes from OAuth provider)
    // Different providers store displayName in different places
    let providerDisplayName = user.displayName;

    // Generate a display name using our utility function
    const displayName = generateDisplayName(user.email, providerDisplayName);

    // Prepare profile data
    const profileData = {
      email: user.email,
      displayName: displayName,
      provider: provider, // 'github', 'google', or 'facebook'
    };

    // Send the profile data to the backend (/api/users/route.js)
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        profileData,
      }),
    });

    if (!response.ok) {
      console.error("Failed to save user profile:", await response.text());
    }

    return { success: response.ok };
  } catch (error) {
    console.error("Error saving user profile:", error);
    return { success: false, error };
  }
}
