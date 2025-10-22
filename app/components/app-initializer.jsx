"use client";
import { useEffect } from "react";
import { useUserAuth } from "@/context/auth-context";

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
            setUser(data.user);
            setAuthFlowComplete(true);
          } else {
            // 2.1. If no session, user is null, show login options
          }
          if (data.session) {
            // handle session data if needed
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    const getUserProfile = async () => {
      // 4. Get user profile from firestore
      // 5. If profile exists, load user data
      //   5.1. If no profile, create one - not sure if this is possible at this point in the flow though?
    };
    // Run both functions
    checkSession();
    getUserProfile();
  }, []);
  return null; // This component does not render anything
};
