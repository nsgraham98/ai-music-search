"use client";
import { useEffect } from "react";
import { useUserAuth } from "@/context/auth-context";
import { useUserProfile } from "@/context/user-profile-context";
import axios from "axios";

/*
  Should only mount once, at the root of the app
  eg. in app/layout.jsx:
    <AuthContextProvider>
      <UserProfileContextProvider>
        <Box>
          <AppInitializer />
          {children}
        </Box>
      </UserProfileContextProvider>
    </AuthContextProvider>

*/

/*
  Flow should be something like:
    1. On app load, check for existing session cookie
    2. If session exists, authenticate user
      2.1. If no session, user is null, show login options
    3. If authenticated, set user
    4. Get user profile from firestore
    5. If profile exists, load user data
      5.1. If no profile, create one
*/

export const AppInitializer = () => {
  const { setAuthUser, setAuthFlowComplete } = useUserAuth();
  const { fetchCurrentUserProfile, setUserProfile } = useUserProfile();

  useEffect(() => {
    // If no cookie, check for session in DB -> set user if found
    const checkSessionDB = async () => {
      try {
        console.log("AppInitializer: Checking for existing session...");
        // 2. If session exists, authenticate user (authenticates in session route)
        const response = await axios.get("/api/auth/session", {
          withCredentials: true,
        });
        if (!response.data.ok) {
          console.log("No valid session found");
          setAuthUser(null);
          return null;
        }
        console.log("AppInitializer: Session found");
        // 3. If authenticated, set user
        const data = response.data; // { ok, authUser, session }
        if (data?.authUser) {
          return data.authUser;
        } else {
          // handle no user found
          // console.log("No user found");
          setAuthUser(null);
          return null;
        }
        // handle no session found (response not ok)
      } catch (error) {
        // console.error("Error checking session, in checkSession:", error);
        setAuthUser(null);
      } finally {
        setAuthFlowComplete(true);
      }
    };

    const initApp = async () => {
      try {
        const authUser = await checkSessionDB(); // get auth user from session if exists
        // set auth user
        if (authUser) {
          // console.log("AppInitializer: Authenticated user found:", authUser);
          setAuthUser(authUser);
          const userProfile = await fetchCurrentUserProfile();
          // set user profile
          if (userProfile) {
            setUserProfile(userProfile);
          } else {
            throw new Error("No user profile found after authentication");
          }
        } else {
          setAuthUser(null);
          setUserProfile(null);
          throw new Error("No authenticated user found in session");
        }
      } catch (error) {
        // console.error("Error during app initialization:", error);
        setAuthUser(null);
        setUserProfile(null);
      } finally {
        setAuthFlowComplete(true);
      }
    };
    initApp();
  }, []);
  return null; // This component does not render anything
};
