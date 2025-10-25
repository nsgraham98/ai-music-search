"use client";
import { Box, Typography } from "@mui/material";

export default function SettingsSection({ icon, title, children }) {
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        {icon}
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={2}>
        {children}
      </Box>
    </Box>
  );
}
