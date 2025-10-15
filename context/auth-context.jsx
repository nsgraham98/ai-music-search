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
import { saveUserProfile } from "@/app/api/users/user-handler/save-user-profile.js";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // active logged in user object
  const [loadingUser, setLoadingUser] = useState(true); // loading while checking auth state
  const [authFlowComplete, setAuthFlowComplete] = useState(false); // true after initial auth check is done

  // Listener for auth state changes
  // Sets the user state (logged in user or null) and loading state (is mid login or not)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (authFlowComplete) {
        setUser(currentUser);
        setLoadingUser(false);
      }
    });
    return () => unsubscribe(); // cleanup the listener on unmount
  }, [authFlowComplete]);

  // Sign in with popup for the given provider (github, google, facebook)
  // Called from login-form component
  const signIn = async (providerName) => {
    //setAuthFlowComplete(false);
    const provider = getAuthProvider(providerName);
    const result = await signInWithPopup(auth, provider);
    const user = result.user; // user object from firebase
    const idToken = await user.getIdToken(true /* force refresh */);

    await loginWithToken(idToken);
    await saveUserSession(); // Save session data

    // Create or update user profile
    await saveUserProfile(user, providerName, idToken); // consider only calling this on first login?
    setAuthFlowComplete(true);
  };

  /*
    Send the Firebase ID token to the backend (/api/auth/login/route.js) to:
      Verify the token
      Create a cookie with a sessionID
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
    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  /* 
    Send the token to the backend (/api/session/route.js) to:
      Save the session data in the database
      Set the session cookie (to be used for authenticating API calls)
  */
  async function saveUserSession() {
    try {
      const response = await fetch("/api/auth/session", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Session and Cookie successfully set");
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
    setUser(null);
    return signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loadingUser,
        firebaseSignOut,
        setAuthFlowComplete,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
