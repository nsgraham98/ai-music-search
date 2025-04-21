"use client";

import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();

  const signIn = async (email, password) => {
    debugger;
    return fetch("/api/auth/sign_in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setUser({ email });
        alert("Successfully logged in!");
      });
  };
  const signOut = async () => {
    return fetch("/api/auth/sign_out", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        setUser(null);
        alert("Successfully logged out!");
      });
  };
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        signIn,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
