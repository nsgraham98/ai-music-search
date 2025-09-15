// Taken from Web Dev week-9 assignment
// https://webdev2-delta.vercel.app/week-9/assignment

// Used to create a context for user authentication through Firebase,
// and to provide authentication states and methods to the rest of the app

"use client";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserProfile } from "@/lib/user-profile";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to update display name in Firestore and locally
  const updateDisplayName = async (displayName) => {
    if (!user) return;
    const res = await fetch("/api/user/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName }),
    });
    if (res.ok) {
      setUser((prev) => ({ ...prev, displayName }));
    }
  };

  const gitHubSignIn = async () => {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await createUserProfile(result.user);
    setUser({
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    });
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await createUserProfile(result.user);
    setUser({
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    });
  };

  const firebaseSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const res = await fetch("/api/session", { method: "GET" });
        let data = {};
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await res.json();
        }
        setUser(
          data.sessionData || {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          }
        );
      } else {
        setUser(null);
      }
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
        firebaseSignOut,
        updateDisplayName,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
