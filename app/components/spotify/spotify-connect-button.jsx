"use client";

import { Button, Box, Typography } from "@mui/material";
import { useState } from "react";

export default function SpotifyConnectButton({ isConnected }) {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    window.location.href = "/api/spotify/auth";
  };

  if (isConnected) {
    return (
      <Box
        sx={{
          bgcolor: "#1DB954",
          color: "white",
          p: 2,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          ✓ Spotify Connected
        </Typography>
      </Box>
    );
  }

  return (
    <Button
      variant="contained"
      onClick={handleConnect}
      disabled={connecting}
      sx={{
        bgcolor: "#1DB954",
        color: "white",
        fontWeight: "bold",
        "&:hover": {
          bgcolor: "#1ed760",
        },
        "&:disabled": {
          bgcolor: "#666",
        },
      }}
    >
      {connecting ? "Connecting..." : "Connect Spotify"}
    </Button>
  );
}
