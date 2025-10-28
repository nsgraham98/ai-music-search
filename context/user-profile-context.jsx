// User Profile Context
// Manages user profile state separately from authentication state
// Provides profile data and functions to update profiles across the app

"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { useUserAuth } from "@/context/auth-context";

const UserProfileContext = createContext();

export const UserProfileContextProvider = ({ children }) => {
  const { authUser, isReadyToLoadProfile } = useUserAuth(); // Get the authenticated user
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // When auth user changes, fetch the profile
  useEffect(() => {
    const fetchProfileListener = async () => {
      console.log("in user-profile-context, isReadyToLoadProfile useEffect");
      // do something when user is authenticated in auth context
      if (authUser) {
        console.log(
          "in user-profile-context, isReadyToLoadProfile useEffect: authUser exists, fetching profile. authUser: ",
          authUser
        );
        setLoadingProfile(true);
        const user = await fetchCurrentUserProfile();
        console.log(
          "in user-profile-context, isReadyToLoadProfile useEffect: fetched user profile",
          user
        );
        setUserProfile(user);
        setLoadingProfile(false);
        setProfileError(null);
      } else {
        console.log(
          "in user-profile-context, isReadyToLoadProfile useEffect: no authUser, clearing profile"
        );
        setUserProfile(null);
        setLoadingProfile(false);
        setProfileError(null);
      }
    };
    fetchProfileListener();
  }, [isReadyToLoadProfile]);

  // Fetch user profile from the backend for setting the userProfile state
  // Works if uid is provided, or uid isn't provided (for when authUser hasn't updated yet)
  const fetchCurrentUserProfile = async (uid = null) => {
    try {
      setLoadingProfile(true);
      setProfileError(null);
      if (!uid && !authUser) {
        console.log("in fetchCurrentUserProfile: no uid and no authUser");
        setUserProfile(null);
        return;
      }
      const response = await fetch("/api/users", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log("in fetchCurrentUserProfile: GET /api/users result:", result);
      console.log("Timestamp:", new Date().toISOString());
      if (result.success) {
        const user = result.data;
        return user;
      } else {
        throw new Error("Profile not found");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setProfileError("Error fetching profile");
      return;
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchOtherUserProfile = async (uid) => {
    try {
      setLoadingProfile(true);
      setProfileError(null);
      if (!uid) {
        throw new Error("No UID provided for other user profile fetch");
      }
      const response = await fetch(`/api/users?uid=${uid}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.success) {
        const user = result.data;
        return user;
      } else {
        throw new Error("Profile not found");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setProfileError("Error fetching profile");
      return;
    } finally {
      setLoadingProfile(false);
    }
  };

  // Update user profile (currently only display name)
  // updateProfileData = { displayName: "New Name", email: "newemail@example.com", etc. }
  const updateUserProfile = async (updateProfileData) => {
    if (!authUser || !updateProfileData.displayName?.trim()) {
      return { success: false, error: "Invalid display name" };
    }

    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updateProfileData,
        }),
      });

      if (response.ok) {
        // Update local state
        setUserProfile((prev) => ({
          ...prev,
          ...updateProfileData,
          lastUpdated: Date.now(),
        }));
        return { success: true };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.error || "Failed to update user profile",
        };
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
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
    // if (!authUser) return;
    // try {
    //   setLoadingProfile(true);
    //   const response = await fetch("/api/users", {
    //     method: "GET",
    //     credentials: "include",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   if (response.ok) {
    //     const result = await response.json();
    //     if (result.success) {
    //       setUserProfile(result.data);
    //     }
    //   }
    // } catch (error) {
    //   console.error("Error refreshing profile:", error);
    // } finally {
    //   setLoadingProfile(false);
    // }
  };

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        setUserProfile,
        loadingProfile,
        profileError,
        updateUserProfile,
        getUserProfileById,
        refreshProfile,
        fetchCurrentUserProfile,
        fetchOtherUserProfile,
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
