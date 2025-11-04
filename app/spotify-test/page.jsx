"use client";
// Simple Spotify test page
import React from "react";
import { startSpotifyAuth,getToken } from "@/app/api/spotify/accesstoken/spotifyroute.js";

export default function SpotifyTestPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Spotify Connection</h1>
      <p>
        Placeholder - Testing spotify components here.
      </p>
      <button onClick={startSpotifyAuth}>Spotify access code</button>
    </div>
  );
}
