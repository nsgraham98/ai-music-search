"use client";

import { useUserAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AudioPlayerProvider } from "@/context/audio-player-context";
import { Box, CircularProgress, Container } from "@mui/material";
import { AudioPlayer } from "@/app/components/audio/audio-player.jsx";

export default function DashboardLayout({ children }) {
  const { user, loading } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
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
          pb: "5vw",
          minHeight: "100vh",
          pt: 4,
        }}
      >
        {children}
      </Box>
      <AudioPlayer />
    </AudioPlayerProvider>
  );
}
