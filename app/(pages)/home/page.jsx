"use client";

import { AudioPlayer } from "@/app/components/audio/audio-player.jsx";
import SearchBar from "@/app/components/search-bar.jsx";
import { LogoutButton } from "@/app/components/logout-button";
import { Box, Typography, Container } from "@mui/material";

export default function HomePage() {
  return (
    <Box minHeight="100vh" bgcolor="#1e1e1e" color="white" pt={4}>
      <Container maxWidth="lg">
        {/* Header and Logout */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" fontWeight="bold">
            TUTTi.
          </Typography>
          <LogoutButton />
        </Box>

        {/* Search Bar */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 1000 }}>
            <SearchBar />
          </Box>
        </Box>

        {/* Audio Player */}
        <AudioPlayer />
      </Container>
    </Box>
  );
}
