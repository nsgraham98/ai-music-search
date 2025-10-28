"use client";
import React from "react";
import { useUserProfile } from "@/context/user-profile-context";
import { useUserAuth } from "@/context/auth-context";

export default function TestShowCurrentUser() {
  const { userProfile } = useUserProfile();
  const { authUser } = useUserAuth();

  return (
    <div>
      <button
        onClick={() =>
          console.log("userProfile:", userProfile, "\nauthUser:", authUser)
        }
      >
        Log userProfile, authUser to Console
      </button>
    </div>
  );
}
