"use client";
// Simple Spotify test page
import React from "react";
import dynamic from "next/dynamic";

const ConnectSpotifyButton = dynamic(
  () => import("@/app/components/connect-spotify.jsx").then(mod => ({ default: mod.ConnectSpotifyButton })),
  { ssr: false }
);

export default function SpotifyTestPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Spotify Connection</h1>
      <p>
        Testing Spotify integration components here.
      </p>
      <ConnectSpotifyButton />
    </div>
  );
}
