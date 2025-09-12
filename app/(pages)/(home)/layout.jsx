"use client";

import { useUserAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AudioPlayerProvider } from "@/context/audio-player-context";
import { Box, CircularProgress, Container } from "@mui/material";
import { AudioPlayer } from "@/app/components/audio/audio-player.jsx";

export default function DashboardLayout({ children }) {
  // must be logged in to see this page
  const { user, loadingUser } = useUserAuth();
  const router = useRouter();

  if (loadingUser) {
    // show loading spinner while waiting for auth status
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    // wrap all authenticated views in the audio player context
    <AudioPlayerProvider>
      <Box
        sx={{
          pb: "30vh",
          pt: 4,
          bgcolor: "#1e1e1e",
          height: "100%",
          width: "100%",
        }}
      >
        {children}
      </Box>
      <AudioPlayer />
    </AudioPlayerProvider>
  );
}
