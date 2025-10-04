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
//import { saveUserSession } from "@/app/api/session/session-handler/session.js";
import { saveUserProfile } from "@/app/api/users/user-handler/save-user-profile.js";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // active logged in user object
  const [loadingUser, setLoadingUser] = useState(true); // loading while checking auth state

  async function saveUserSession(IdToken) {
    //const token = await getIdToken(user, true);

    // Send the token to the backend (/api/session/route.js) to save the session data in the database
    // currently we don't check for errors here, because they are handled in the route.js file... not sure if this is the best way to do it
    await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        IdToken,
      }),
    });
  }

  // https://firebase.google.com/docs/auth/web/github-auth
  const gitHubSignIn = async () => {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user; // user object from firebase
    const IdToken = await user.getIdToken();
    console.log("IDTOKEN", IdToken);

    // TODO: change the saveUserSession to call the /session route, not the session-handler file directly

    // this commented out code gets a github access token, if we need to work with the github api later (different from firebase api we do use for auth)
    // const credential = GithubAuthProvider.credentialFromResult(result);
    // const gitHubToken = credential.accessToken;

    // Save session data
    // await saveUserSession(result.user, accessToken);
    await saveUserSession(IdToken);

    // Create or update user profile
    await saveUserProfile(result.user, "github", IdToken);
  };

  // https://firebase.google.com/docs/auth/web/google-signin
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log("====================================RESULT", result);
    const accessToken = await result.user.getIdToken();

    // Save session data
    await saveUserSession(result.user, accessToken);

    // Create or update user profile
    await saveUserProfile(result.user, "google", accessToken);
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
