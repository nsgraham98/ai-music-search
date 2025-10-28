// Taken from Web Dev week-9 assignment
// https://webdev2-delta.vercel.app/week-9/assignment

// Used to create a context for user authentication through Firebase,
// and to provide authentication states and methods to the rest of the app

"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GithubAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase.js";
import axios from "axios";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null); // active logged in user object
  const [loadingUser, setLoadingUser] = useState(true); // loading while checking auth state
  const [authFlowComplete, setAuthFlowComplete] = useState(false); // true after initial auth check is done
  const [isReadyToLoadProfile, setIsReadyToLoadProfile] = useState(false); // true when user profile is ready to be loaded

  // Listener for auth state changes
  // Sets the user state (logged in user or null) and loading state (is mid login or not)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (authFlowComplete) {
        setAuthUser(currentUser);
        setLoadingUser(false);
      }
    });
    return () => unsubscribe(); // cleanup the listener on unmount
  }, [authFlowComplete]);

  useEffect(() => {
    console.log("authUser changed:", authUser);
    if (authUser) {
      setIsReadyToLoadProfile(true);
    } else {
      setIsReadyToLoadProfile(false);
    }
  }, [authUser]);

  // Sign in with popup for the given provider (github, google, facebook)
  // Called from login-form component
  const signIn = async (providerName) => {
    try {
      //setAuthFlowComplete(false);
      const provider = getAuthProvider(providerName);
      const result = await signInWithPopup(auth, provider);
      const decodedAuthUser = result.user; // user object from firebase
      const idToken = await decodedAuthUser.getIdToken(
        true /* force refresh */
      );

      // Send the ID token to the backend to for authentication, create session cookie, create uid cookie
      const loginSuccess = await loginWithToken(idToken);
      if (!loginSuccess) {
        console.error("Login with token failed");
        return;
      }

      // Save session data in the database
      const sessionResult = await saveUserSession(); // Save session data
      if (!sessionResult) {
        console.error("Saving user session failed");
        return;
      }

      // get the user profile from the database (to check if it exists, not to set state)
      const getUserResponse = await fetch("/api/users", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // create new user profile if not found
      if (getUserResponse.status === 404) {
        const postUserResponse = await fetch("/api/users", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ provider: providerName }),
        });
        if (!postUserResponse.ok) {
          console.error("Failed to create user profile");
          return;
        }
        const data = await postUserResponse.json();
        const newUserProfile = data.userProfile;
        console.log("New User Profile Created: ", newUserProfile);
        setAuthUser(decodedAuthUser);
        return;
      }

      setAuthUser(decodedAuthUser);
    } catch (error) {
      console.error("Error during sign-in:", error);
      return;
    } finally {
      setLoadingUser(false);
      setAuthFlowComplete(true);
    }
  };

  /*
    Send the Firebase ID token to the backend (/api/auth/login/route.js) to:
      Verify the token
      Create a cookie with a sessionID
      returns true if successful
    Runs only once on login
  */
  async function loginWithToken(idToken) {
    if (!idToken) return;
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      console.log("Login successful");
      return true;
    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  /* 
    Send the token to the backend (/api/session/route.js) to:
      Save the session data in the database
      Set the session cookie (to be used for authenticating API calls)
    returns true if successful
  */
  async function saveUserSession() {
    try {
      const response = await fetch("/api/auth/session", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Session and Cookie successfully set");
        return true;
      }
    } catch (error) {
      console.error("Error saving user session:", error);
    }
  }

  // Get the appropriate auth provider based on the provider name
  const getAuthProvider = (providerName) => {
    switch (providerName) {
      case "github":
        // https://firebase.google.com/docs/auth/web/github-auth
        return new GithubAuthProvider();
      case "google":
        // https://firebase.google.com/docs/auth/web/google-signin
        return new GoogleAuthProvider();
      case "facebook":
        // https://firebase.google.com/docs/auth/web/facebook-login
        return new FacebookAuthProvider();
      default:
        throw new Error("Unsupported provider");
    }
  };

  // Sign out user
  // Also calls the logout API route to clear the session cookie
  const firebaseSignOut = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setAuthFlowComplete(false);
    setAuthUser(null);
    return signOut(auth);
  };

  const getAuthUserFromSession = async () => {
    try {
      const response = await axios.get("/api/auth/auth-user", {
        withCredentials: true,
      });
      return response.data.authUser;
    } catch (error) {
      console.error("Error fetching auth user:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        loadingUser,
        setLoadingUser,
        firebaseSignOut,
        setAuthFlowComplete,
        signIn,
        getAuthUserFromSession,
        isReadyToLoadProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
