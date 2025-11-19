"use client";

import { useState, useEffect } from "react";
import { Box, Button, Typography, Alert, CircularProgress } from "@mui/material";
import { useUserAuth } from "@/context/auth-context";
import { startSpotifyAuth } from "@/lib/spotify-client-auth";
import { useSearchParams } from "next/navigation";

export default function SpotifyConnect() {
  const { authUser } = useUserAuth();
  const searchParams = useSearchParams();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  // Handle callback from Spotify
  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams?.get('spotify_code');
      const errorParam = searchParams?.get('spotify_error');

      if (errorParam) {
        setError(`Spotify connection failed: ${errorParam}`);
        // Clear URL params
        window.history.replaceState({}, '', '/settings');
        return;
      }

      if (code && authUser) {
        setIsConnecting(true);
        try {
          // Exchange code for token
          const token = await authUser.getIdToken();
          const response = await fetch('/api/spotify/callback/exchange', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to connect Spotify');
          }

          setSuccess('Spotify connected successfully!');
          setSpotifyConnected(true);
          setTimeout(() => setSuccess(null), 5000);
          
          // Clear URL params
          window.history.replaceState({}, '', '/settings');
        } catch (err) {
          console.error('Token exchange error:', err);
          setError(err.message || 'Failed to complete Spotify connection');
        } finally {
          setIsConnecting(false);
        }
      }
    };

    if (authUser) {
      handleCallback();
    }
  }, [searchParams, authUser]);

  const handleConnect = async () => {
    if (!authUser) {
      setError("Please sign in to Tutti first to connect your Spotify account");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await startSpotifyAuth(authUser);
    } catch (err) {
      console.error("Spotify connection error:", err);
      setError(err.message || "Failed to connect Spotify account");
      setIsConnecting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        bgcolor: "#1a1a1a",
        borderRadius: 2,
        border: "1px solid #444",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
            Connect Spotify
          </Typography>
          <Typography variant="body2" color="#888">
            Link your Spotify account to search and play music from Spotify
          </Typography>
        </Box>
        <Button
          onClick={handleConnect}
          disabled={isConnecting || !authUser}
          variant={spotifyConnected ? "outlined" : "contained"}
          sx={{
            bgcolor: spotifyConnected ? "transparent" : "#1DB954",
            color: "white",
            borderColor: "#1DB954",
            "&:hover": {
              bgcolor: spotifyConnected ? "#1a3d1a" : "#1aa34a",
              borderColor: "#1aa34a",
            },
            "&:disabled": {
              bgcolor: "#666",
              color: "#999",
            },
            minWidth: 140,
            fontWeight: "bold",
          }}
        >
          {isConnecting ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : spotifyConnected ? (
            "Connected ✓"
          ) : (
            "Connect Spotify"
          )}
        </Button>
      </Box>

      {success && (
        <Alert
          severity="success"
          sx={{
            bgcolor: "#1a3d1a",
            color: "#69ff6b",
            "& .MuiAlert-icon": { color: "#69ff6b" },
          }}
        >
          {success}
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{
            bgcolor: "#3d1a1a",
            color: "#ff6b6b",
            "& .MuiAlert-icon": { color: "#ff6b6b" },
          }}
        >
          {error}
        </Alert>
      )}

      {!authUser && (
        <Alert
          severity="info"
          sx={{
            bgcolor: "#1a2a3d",
            color: "#6bb6ff",
            "& .MuiAlert-icon": { color: "#6bb6ff" },
          }}
        >
          Sign in to Tutti to connect your Spotify account
        </Alert>
      )}

      <Typography variant="caption" color="#666" sx={{ mt: 1 }}>
        Note: Your Spotify account doesn't need to have the same email as your Tutti account.
        You can connect any Spotify account.
      </Typography>
    </Box>
  );
}
