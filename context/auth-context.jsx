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
import { saveUserSession } from "@/app/api/session/session-handler/session.js";
import { saveUserProfile } from "@/app/api/users/user-handler/save-user-profile.js";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // active logged in user object
  const [loadingUser, setLoadingUser] = useState(true); // loading while checking auth state

  // Not sure if this is a good way to handle OAuth sign-ins with Firebase, but it works. See recommended method below these 3 functions.
  // In the future, look at cleaning this up and making it closer to the recommended way from the firebase docs
  // session.js would also need to be updated if we change this

  // https://firebase.google.com/docs/auth/web/github-auth
  const gitHubSignIn = async () => {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const accessToken = result.user.accessToken;

    // Save session data
    await saveUserSession(result.user, accessToken);
    
    // Create or update user profile
    await saveUserProfile(result.user, "github", accessToken);
  };

  // https://firebase.google.com/docs/auth/web/google-signin
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const accessToken = result.user.accessToken;

    // Save session data
    await saveUserSession(result.user, accessToken);
    
    // Create or update user profile
    await saveUserProfile(result.user, "google", accessToken);
  };
  // https://firebase.google.com/docs/auth/web/facebook-login
  const facebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const accessToken = result.user.accessToken;

    // Save session data
    await saveUserSession(result.user, accessToken);
    
    // Create or update user profile
    await saveUserProfile(result.user, "facebook", accessToken);
  };

  // Recommended way to handle OAuth sign-in with Firebase, from the firebase docs
  // https://firebase.google.com/docs/auth/web/github-auth

  // const gitHubSignIn = async () => {
  //   const provider = new GithubAuthProvider();
  //   signInWithPopup(auth, provider)
  //     .then((result) => {
  //       // This gives you a GitHub Access Token. You can use it to access the GitHub API.
  //       const credential = GithubAuthProvider.credentialFromResult(result);
  //       const token = credential.accessToken;

  //       // The signed-in user info.
  //       const user = result.user;
  //       // IdP data available using getAdditionalUserInfo(result)
  //       // ...
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // The email of the user's account used.
  //       const email = error.customData.email;
  //       // The AuthCredential type that was used.
  //       const credential = GithubAuthProvider.credentialFromError(error);
  //       // ...
  //     });
  // };

  // Sign out user
  // Also calls the logout API route to clear the session cookie
  const firebaseSignOut = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return signOut(auth);
  };

  // Listener for auth state changes
  // Sets the user state (logged in user or null) and loading state (is mid login or not)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingUser,
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
