// HOME PAGE (DASHBOARD) LAYOUT
// This file is the layout for the home page (dashboard), and all future subpages.

// Provides the audio player context for all authenticated views and ensures only logged in users can access these views
// AudioPlayer component is included here at the bottom of the page (so it's always visible to logged in users)
// https://nextjs.org/docs/app/api-reference/file-conventions/layout

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

  // if user is logged in, show page
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
