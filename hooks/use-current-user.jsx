"use client";

import { UserContext } from "@/contexts/user-context";
import { useContext, useEffect } from "react";

const useCurrentUser = () => {
  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
    fetch("/api/current_user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        if (!data) {
          return;
        }
        setUser(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, [setUser]);
  return user;
};

export default useCurrentUser;
