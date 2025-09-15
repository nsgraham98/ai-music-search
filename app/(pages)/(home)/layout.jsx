"use client";

import { useUserAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AudioPlayerProvider } from "@/context/audio-player-context";
import { Box, CircularProgress, Container } from "@mui/material";
import { AudioPlayer } from "@/app/components/audio/audio-player.jsx";
import DisplayNameForm from "@/app/components/profile/display-name-form"; // <-- Add this import

export default function DashboardLayout({ children }) {
  const { user, loading } = useUserAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!user && !loading) {
  //     router.push("/login");
  //   }
  // }, [user, loading, router]);

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

  // Prompt for display name if user is logged in but doesn't have one
  if (user && !user.displayName) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#1e1e1e"
      >
        <DisplayNameForm />
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
