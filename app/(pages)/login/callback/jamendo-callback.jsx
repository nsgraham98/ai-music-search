// JAMENDO CALLBACK HELPER
// This component handles the actual logic of exchanging the code for an access token through an API route,
// and saving the tokens to the user's session in the database.
// Logging in through a jamendo account is not in use currently, but is required for any future features that require a jamendo account
// (eg. creating playlists, favoriting tracks, etc.), using built-in jamendo features.
// https://developer.jamendo.com/v3.0/authentication

"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveUserSession } from "@/app/api/session/session-handler/session";
import { useUserAuth } from "@/context/auth-context";

export default function JamendoCallback() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, loadingUser } = useUserAuth();

  // When the component mounts (on change to: user or loadingUser), exchange the code for a jamendo access token
  useEffect(() => {
    const exchangeCodeForToken = async () => {
      if (loadingUser) return;

      const code = params.get("code");
      const state = params.get("state");

      if (!code) return;

      // Exchange the code for a jamendo access token, refresh token, and expiry time
      try {
        const res = await fetch("/api/jamendo/access-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, grant_type: "authorization_code" }),
        });

        if (!res.ok) throw new Error("Token exchange failed");

        const { access_token, refresh_token, expires_at } = await res.json();

        // Save the jamendo tokens to the OAuth user's session in the database
        if (user) {
          await saveUserSession(user, null, {
            thirdPartyTokens: {
              access_token,
              refresh_token,
              expires_at,
            },
          });
        }

        // Redirect to home page after successful login
        router.push("/");
      } catch (err) {
        console.error("Failed to connect to Jamendo:", err);
      }
    };

    exchangeCodeForToken();
  }, [user, loadingUser, params]);

  return <p>Completing login...</p>;
}
