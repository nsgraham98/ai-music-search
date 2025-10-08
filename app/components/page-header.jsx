"use client";

import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import SignedInAs from "@/app/components/login/signed-in-as";
import { LogoutButton } from "@/app/components/login/logout-button";

export function PageHeader() {
  const router = useRouter();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={4}
      sx={{
        flexWrap: { xs: "wrap", md: "nowrap" },
        gap: 2,
      }}
    >
      {/* Logo */}
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{
          background: "linear-gradient(135deg, #E03FD8 0%, #8B5CF6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          cursor: "pointer",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
        onClick={() => router.push("/")}
      >
        TUTTi.
      </Typography>

      {/* Right Side - User Info & Logout */}
      <Box display="flex" alignItems="center" gap={2}>
        <SignedInAs />
        <LogoutButton />
      </Box>
    </Box>
  );
}
