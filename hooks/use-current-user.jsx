// not yet implemented, but we will want this in the future
// hook to manage user state across the app (e.g. in context or global state)

"use client";

import { UserContext } from "@/contexts/user-context";
import { useContext, useEffect } from "react";

const useCurrentUser = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("@/app/api/session/route.js", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.sessionData) {
          setUser(data.sessionData);
        } else {
          console.error("No session data found in response:", data);
        }
      } catch {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [setUser]);
  return user;
};

export default useCurrentUser;
