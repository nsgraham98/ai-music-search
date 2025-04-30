"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveUserSession } from "@/app/api/session/session-handler/session";
import { useUserAuth } from "@/context/auth-context";

export default function JamendoCallback() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, loading } = useUserAuth();

  useEffect(() => {
    const exchangeCodeForToken = async () => {
      if (loading) return;

      const code = params.get("code");
      const state = params.get("state");

      if (!code) return;

      try {
        const res = await fetch("/api/jamendo/access-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, grant_type: "authorization_code" }),
        });

        if (!res.ok) throw new Error("Token exchange failed");

        const { access_token, refresh_token, expires_at } = await res.json();

        if (user) {
          await saveUserSession(user, null, {
            thirdPartyTokens: {
              access_token,
              refresh_token,
              expires_at,
            },
          });
        }

        router.push("/");
      } catch (err) {
        console.error("Failed to connect to Jamendo:", err);
      }
    };

    exchangeCodeForToken();
  }, [user, loading, params]);

  return <p>Completing login...</p>;
}
