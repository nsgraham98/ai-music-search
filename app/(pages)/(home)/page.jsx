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
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h4" fontWeight="bold">
            TUTTi.
          </Typography>
          <Link href="/sound-room" passHref>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                borderColor: "white",
                color: "white",
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: "0.875rem",
                padding: "4px 12px",
                borderWidth: 2,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              The Sound Room
            </Button>
          </Link>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <SignedInAs />
          <LogoutButton />
        </Box>
      </Box>

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
