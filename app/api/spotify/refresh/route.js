// Refresh Spotify access token
import { NextResponse } from "next/server";
import { authenticateCookie } from "@/lib/authenticate-calls";
import { dbAdmin } from "@/lib/firebase-admin";

export async function POST(request) {
  try {
    const decodedToken = await authenticateCookie(request);
    const uid = decodedToken.uid;

    // Get current tokens
    const sessionDoc = await dbAdmin.collection("sessions").doc(uid).get();
    const spotifyTokens = sessionDoc.data()?.spotifyTokens;

    if (!spotifyTokens?.refresh_token) {
      return NextResponse.json(
        { error: "No refresh token available" },
        { status: 400 }
      );
    }

    // Refresh the token
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: spotifyTokens.refresh_token,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const tokens = await response.json();

    // Update tokens in session
    await dbAdmin
      .collection("sessions")
      .doc(uid)
      .update({
        "spotifyTokens.access_token": tokens.access_token,
        "spotifyTokens.expires_at": Date.now() + tokens.expires_in * 1000,
        // Keep existing refresh token if new one isn't provided
        ...(tokens.refresh_token && {
          "spotifyTokens.refresh_token": tokens.refresh_token,
        }),
      });

    return NextResponse.json({
      success: true,
      access_token: tokens.access_token,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    );
  }
}
