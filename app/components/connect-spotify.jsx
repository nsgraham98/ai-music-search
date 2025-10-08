"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import { useUserAuth } from "@/context/auth-context";

export function ConnectSpotifyButton() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { user } = useUserAuth();

  const connectSpotify = async () => {
    if (!user) {
      alert("Please sign in first");
      return;
    }

    setIsConnecting(true);
    
    try {
      const idToken = await user.getIdToken();
      const redirectUri = window.location.origin + "/login/callback";
      
      // Generate auth URL from server
      const response = await fetch("/api/spotify/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ redirectUri }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate auth URL");
      }
      
      const data = await response.json();
      
      // Redirect to Spotify auth
      window.location.href = data.authUrl;
      
    } catch (error) {
      console.error("Spotify connection error:", error);
      alert("Failed to connect to Spotify");
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={connectSpotify}
      variant="contained"
      disabled={isConnecting}
      sx={{
        bgcolor: "#1DB954", // Spotify green
        "&:hover": { bgcolor: "#1ed760" },
        color: "white",
        minWidth: 150,
      }}
    >
      {isConnecting ? "Connecting..." : "Connect Spotify"}
    </Button>
  );
}