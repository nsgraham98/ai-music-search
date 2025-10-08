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

  // Fetch user profile when user changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setUserProfile(null);
        setLoadingProfile(false);
        setProfileError(null);
        return;
      }

      try {
        setLoadingProfile(true);
        setProfileError(null);

        const token = await getIdToken(user, true);

        const response = await fetch("/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setUserProfile(result.data);
          } else {
            setProfileError("Profile not found");
          }
        } else {
          setProfileError("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setProfileError("Error fetching profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Update display name
  const updateDisplayName = async (newDisplayName) => {
    if (!user || !newDisplayName.trim()) {
      return { success: false, error: "Invalid display name" };
    }

    try {
      const token = await getIdToken(user, true);

      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      const token = await getIdToken(user, true);

      const response = await fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
