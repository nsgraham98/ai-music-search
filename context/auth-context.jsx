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
  // const [userReady, setUserReady] = useState(false); // true when user profile is loaded

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

  // https://firebase.google.com/docs/auth/web/github-auth
  const gitHubSignIn = async () => {
    //setAuthFlowComplete(false);
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user; // user object from firebase
    const idToken = await user.getIdToken();

    // this commented out code gets a github access token, if we need to work with the github api later (different from firebase api we do use for auth)
    // const credential = GithubAuthProvider.credentialFromResult(result);
    // const gitHubToken = credential.accessToken;

    await loginWithToken(idToken);
    await saveUserSession(); // Save session data

    // Create or update user profile
    await saveUserProfile(user, "github", idToken);
    setAuthFlowComplete(true);
  };

  // https://firebase.google.com/docs/auth/web/google-signin
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user; // user object from firebase
    const idToken = await user.getIdToken();

    // this commented out code gets a github access token, if we need to work with the github api later (different from firebase api we do use for auth)
    // const credential = GithubAuthProvider.credentialFromResult(result);
    // const gitHubToken = credential.accessToken;

    // Save session data
    await saveUserSession(idToken);
    // Create or update user profile
    await saveUserProfile(user, "google", idToken);
  };
  // https://firebase.google.com/docs/auth/web/facebook-login
  const facebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const accessToken = await result.user.getIdToken();

    // Save session data
    await saveUserSession(result.user, accessToken);

    // Create or update user profile
    await saveUserProfile(result.user, "facebook", accessToken);
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

  // Listener for auth state changes
  // Sets the user state (logged in user or null) and loading state (is mid login or not)
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  //     setUser(currentUser);
  //     setLoadingUser(false);
  //   });
  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (authFlowComplete) {
        setUser(currentUser);
        setLoadingUser(false);
      }
    });
    return () => unsubscribe();
  }, [authFlowComplete]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingUser,
        // userReady,
        gitHubSignIn,
        googleSignIn,
        facebookSignIn,
        firebaseSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
