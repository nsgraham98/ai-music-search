"use client";

import { Box, Typography, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Logout({ onLogout }) {
  return (
    <Box
      sx={{
        bgcolor: "#3a3a3a",
        p: 3,
        borderRadius: 2,
        border: "1px solid #444",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
            Log Out
          </Typography>
          <Typography variant="body2" color="#888">
            Sign out of your account
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{
            bgcolor: "#d32f2f",
            "&:hover": {
              bgcolor: "#b71c1c",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(211, 47, 47, 0.4)",
            },
            transition: "all 0.2s",
            fontWeight: "bold",
          }}
        >
          Log Out
        </Button>
      </Box>
    </Box>
  );
}
