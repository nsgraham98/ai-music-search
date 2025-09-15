"use client";

import { LogoutButton } from "@/app/components/login/logout-button";
import { Box, Typography, Container, Paper } from "@mui/material";
import SignedInAs from "@/app/components/login/signed-in-as";
import LoginPopup from "@/app/components/login/login-popup";

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      <LoginPopup />
      {/* Placeholder for a future user profile page. */}
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
    </Container>
  );
}
