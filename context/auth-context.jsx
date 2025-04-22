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
  // FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase.js";
import { saveUserSession } from "@/app/api/session/session-handler/session.js";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const gitHubSignIn = async () => {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const accessToken = result.user.accessToken;

    await saveUserSession(result.user, accessToken);
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const accessToken = result.user.accessToken;

    await saveUserSession(result.user, accessToken);
  };
  // const facebookSignIn = () => {
  //   const provider = new FacebookAuthProvider();
  //   return signInWithPopup(auth, provider);
  // };

  const firebaseSignOut = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        gitHubSignIn,
        googleSignIn,
        // facebookSignIn,
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
