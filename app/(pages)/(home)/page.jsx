// HOME PAGE (DASHBOARD)
// Only shown to logged in users, otherwise login popup is shown
// AudioPlayer component is located in the layout.jsx file so it's always visible to logged in users
"use client";
import SearchBar from "@/app/components/search-bar.jsx";
import { LogoutButton } from "@/app/components/login/logout-button";
import { Box, Typography, Container, Paper, Button } from "@mui/material";
import { PlayList } from "@/app/components/audio/playlist.jsx";
import SignedInAs from "@/app/components/login/signed-in-as";
import LoginPopup from "@/app/components/login/login-popup";
import Link from "next/link";
import Navigation from "@/app/components/navigation/nav-bar.jsx";
import { Add } from "@mui/icons-material";

import { AddToTrackPlaylistButton } from "@/app/components/playlist/add-track-to-playlist.jsx";
import { CreatePlaylistButton } from "@/app/components/playlist/create-playlist.jsx";
import { DeletePlaylistButton } from "@/app/components/playlist/delete-playlist.jsx";
import { DeleteTrackFromPlaylistButton } from "@/app/components/playlist/delete-track-from-playlist";
import { GetAllPlaylistsButton } from "@/app/components/playlist/get-all-playlists.jsx";
import { GetPlaylistButton } from "@/app/components/playlist/get-playlist.jsx";
import { UpdatePlaylistButton } from "@/app/components/playlist/update-playlist.jsx";

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      <LoginPopup />
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

        <Box display="flex" alignItems="center" gap={2}>
          <SignedInAs />
          <LogoutButton />
        </Box>
      </Box>

      {/* Playlist Buttons for testing */}
      <GetAllPlaylistsButton />
      <CreatePlaylistButton />
      <UpdatePlaylistButton />
      <DeletePlaylistButton />
      <GetPlaylistButton />
      <AddToTrackPlaylistButton />
      <DeleteTrackFromPlaylistButton />

      {/* Navigation Bar */}
      <Navigation />

      {/* Search Bar */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "100%" }}>
          <SearchBar />
        </Box>
      </Box>
      {/* Playlist (aka search results) */}
      {/* Outer playlist box */}
      <Box
        component={Paper}
        elevation={4}
        sx={{
          bgcolor: "#2e2d2d",
          color: "white",
          width: "100%",
          maxWidth: "100%",
          height: "100%",
          minHeight: "100%",
          mx: "auto",
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          // flexGrow: 1,
          // display: "flex",
          // flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Inner playlist box */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <PlayList />
        </Box>
      </Box>
    </Container>
  );
}
