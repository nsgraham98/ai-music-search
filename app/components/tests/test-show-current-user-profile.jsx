"use client";
import React from "react";
import { useUserProfile } from "@/context/user-profile-context";
import { useUserAuth } from "@/context/auth-context";

export default function TestShowCurrentUser() {
  const { userProfile, loadingProfile, profileError } = useUserProfile();
  const { authUser, loadingUser } = useUserAuth();
  function handleOnClick() {
    console.log("userProfile:", userProfile, "\nauthUser:", authUser);
    console.log({
      loadingUser,
      uid: authUser?.uid,
      loadingProfile,
      userProfile,
      profileError,
    });
  }

  return (
    <div>
      <button onClick={() => handleOnClick()}>
        Log userProfile, authUser to Console
      </button>
    </div>
  );
}
