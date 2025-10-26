import React from "react";
import { useUserProfile } from "@/context/user-profile-context";

export default function TestShowCurrentUserProfile() {
  const { userProfile } = useUserProfile();
  return (
    <div>
      <h2>Current User Profile</h2>
      <pre>{JSON.stringify(userProfile, null, 2)}</pre>
      <button onClick={() => console.log(userProfile)}>
        Log User to Console
      </button>
    </div>
  );
}
