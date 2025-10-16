"use client";
import { useEffect } from "react";
import { useUserAuth } from "@/context/auth-context";
import { useUserProfile } from "@/context/user-profile-context";

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
  const { setUser, setAuthFlowComplete } = useUserAuth();
  const { fetchUserProfile } = useUserProfile();

  useEffect(() => {
    // 1. On app load, check for existing session cookie
    const checkSession = async () => {
      try {
        // 2. If session exists, authenticate user (authenticates in session route)
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });
        // 3. If authenticated, set user
        if (response.ok) {
          const data = await response.json(); // { ok, user, session }
          if (data.user) {
            // set user in context
            setUser(data.user);
            setAuthFlowComplete(true);
            return data.user;
          } else {
            // handle no user found
            console.log("No user found");
            setUser(null);
            setAuthFlowComplete(true);
            return null;
          }
        } else {
          // handle no session found (response not ok)
          console.log("No valid session found");
          setUser(null);
          setAuthFlowComplete(true);
          return null;
        }
      } catch (error) {
        console.error("Error checking session, in checkSession:", error);
      }
    };
    const getUserProfile = async (user) => {
      // 4. Get user profile from firestore
      await fetchUserProfile(user);
      // 5. If profile exists, load user data
      //   5.1. If no profile, create one - not sure if this is possible at this point in the flow though?
    };
    // run both functions sequentially
    const initApp = async () => {
      const user = await checkSession();
      console.log("AppInitializer: Session check complete, User:", user);
      if (user) {
        const profile = await getUserProfile(user);
        console.log(
          "AppInitializer: User profile fetch complete, Profile:",
          profile
        );
      }
    };
    initApp();
  }, []);
  return null; // This component does not render anything
};
