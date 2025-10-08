"use client";
import { useEffect } from "react";
import { useUserAuth } from "@/context/auth-context";

export const AppInitializer = () => {
  const { setUser, setAuthFlowComplete } = useUserAuth();

  useEffect(() => {
    // check for existing session cookie on app load
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json(); // { ok, user, session }
          if (data.user) {
            setUser(data.user);
            setAuthFlowComplete(true);
          }
          if (data.session) {
            // handle session data if needed
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    checkSession();
  }, []);
  return null; // This component does not render anything
};
