"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { saveUserSession } from "@/services/session";
import { useUserAuth } from "@/context/auth-context";
import { getAccessToken } from "@/services/jamendo/jamendo-auth";

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, grant_type: "authorization_code" }), // grant_type defaults to "authorization_code"
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

        router.push("/home");
      } catch (err) {
        console.error("Failed to connect to Jamendo:", err);
      }
    };

    exchangeCodeForToken();
  }, [user, loading, params]);
  // useEffect(() => {
  //   const exchangeCodeForToken = async () => {
  //     if (loading) return; // wait for loading to finish
  //     const code = params.get("code");
  //     const state = params.get("state"); // optional

  //     if (!code) return;

  //     const { access_token, refresh_token, expires_at } = await getAccessToken(
  //       code,
  //       "authorization_code"
  //     );

  //     if (user) {
  //       await saveUserSession(user, null, {
  //         thirdPartyTokens: {
  //           access_token,
  //           refresh_token,
  //           expires_at,
  //         },
  //       });
  //     }

  //     router.push("/home"); // redirect after saving session
  //   };

  //   exchangeCodeForToken();
  // }, [user, loading, params]);

  return <p>Completing login...</p>;
}
