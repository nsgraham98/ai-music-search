// User Profile Context
// Manages user profile state separately from authentication state
// Provides profile data and functions to update profiles across the app

"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { useUserAuth } from "@/context/auth-context";
import { getIdToken } from "firebase/auth";

const UserProfileContext = createContext();

export const UserProfileContextProvider = ({ children }) => {
  const { user } = useUserAuth(); // Get the authenticated user
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // When auth user changes, fetch the profile
  useEffect(() => {
    const fetchProfile = async () => {
      // do something when user is authenticated in auth context
      if (user) {
        setLoadingProfile(true);
        const userProfile = await fetchUserProfile(user);
        setUserProfile(userProfile);
        setLoadingProfile(false);
        setProfileError(null);
      } else {
        setUserProfile(null);
        setLoadingProfile(false);
        setProfileError(null);
      }
    };
    fetchProfile();
  }, [user]);

  // Fetch user profile from the backend for setting the userProfile state
  // user argument is optional
  // If provided, will fetch that user's profile
  // If not provided, it will clear the profile state
  const fetchUserProfile = async (user = null) => {
    console.log("user-profile-context: Fetching user profile...");
    console.log("user-profile-context: Authenticated user: ", user);
    if (!user) {
      // No user, clear profile state
      setUserProfile(null);
      setLoadingProfile(false);
      setProfileError(null);
      return;
    }
    try {
      setLoadingProfile(true);
      setProfileError(null);

      const response = await fetch("/api/users", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.success) {
        return result.data;
      } else {
        setProfileError("Profile not found");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setProfileError("Error fetching profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Update display name
  const updateDisplayName = async (newDisplayName) => {
    if (!user || !newDisplayName.trim()) {
      return { success: false, error: "Invalid display name" };
    }

    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: newDisplayName.trim(),
        }),
      });

      if (response.ok) {
        // Update local state
        setUserProfile((prev) => ({
          ...prev,
          displayName: newDisplayName.trim(),
          lastUpdated: Date.now(),
        }));
        return { success: true };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.error || "Failed to update display name",
        };
      }
    } catch (error) {
      console.error("Error updating display name:", error);
      return { success: false, error: "Network error" };
    }
  };

  // Get user profile by UID (for viewing other users)
  const getUserProfileById = async (uid) => {
    try {
      const response = await fetch(`/api/users?uid=${uid}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        return { success: false, error: "Failed to fetch user profile" };
      }
    } catch (error) {
      console.error("Error fetching user profile by ID:", error);
      return { success: false, error: "Network error" };
    }
  };

  // Refresh current user's profile
  const refreshProfile = async () => {
    if (!user) return;

    try {
      setLoadingProfile(true);

      const response = await fetch("/api/users", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUserProfile(result.data);
        }
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        loadingProfile,
        profileError,
        updateDisplayName,
        getUserProfileById,
        refreshProfile,
        fetchUserProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error(
      "useUserProfile must be used within a UserProfileContextProvider"
    );
  }
  return context;
};
