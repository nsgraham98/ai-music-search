// Spotify OAuth callback - Step 2: Exchange code for tokens
import { NextResponse } from "next/server";
import { authenticateCookie } from "@/lib/authenticate-calls";
import { dbAdmin } from "@/lib/firebase-admin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        new URL("/?spotify_error=" + error, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/?spotify_error=no_code", request.url)
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokens = await tokenResponse.json();

    // Save tokens to user's session
    const decodedToken = await authenticateCookie(request);
    const uid = decodedToken.uid;

    await dbAdmin
      .collection("sessions")
      .doc(uid)
      .set(
        {
          spotifyTokens: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: Date.now() + tokens.expires_in * 1000,
            scope: tokens.scope,
          },
          spotifyConnected: true,
          spotifyConnectedAt: new Date(),
        },
        { merge: true }
      );

    return NextResponse.redirect(
      new URL("/?spotify_connected=true", request.url)
    );
  } catch (error) {
    console.error("Spotify callback error:", error);
    return NextResponse.redirect(
      new URL("/?spotify_error=callback_failed", request.url)
    );
  }
}
