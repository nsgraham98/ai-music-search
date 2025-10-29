"use client";
import { useUserProfile } from "@/context/user-profile-context";
import { useUserAuth } from "@/context/auth-context";

export default function ProfileDebugPanel() {
  const { userProfile, loadingProfile, profileError } = useUserProfile();
  const { authUser, loadingUser } = useUserAuth();

  return (
    <pre style={{ padding: 12, background: "#111", color: "#0f0" }}>
      {JSON.stringify(
        {
          loadingUser,
          authUid: authUser?.uid ?? null,
          loadingProfile,
          profileError: profileError ?? null,
          userProfile,
        },
        null,
        2
      )}
    </pre>
  );
}
