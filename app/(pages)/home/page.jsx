// Our apps home page
"use client";

import { AudioPlayer } from "@/app/components/audio/audio-player.jsx";
import SearchBar from "@/app/components/search-bar.jsx";
import { useRouter } from "next/navigation";
import { LogoutButton } from "@/app/components/logout-button";

import { Box, Typography, Container, Paper } from "@mui/material";

export default function HomePage() {
  return (
    <Box minHeight="100vh" bgcolor="#1e1e1e" color="white" py={4}>
      <Container maxWidth="md">
        {/* Header and Logout */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" fontWeight="bold">
            Home Page
          </Typography>
          <LogoutButton />
        </Box>

        {/* Search Bar */}
        <Box mb={4}>
          <SearchBar />
        </Box>

        {/* Audio Player */}
        <AudioPlayer />
      </Container>
    </Box>
  );
}
