"use client";

import { Box, Typography, FormControlLabel, Switch } from "@mui/material";

export default function DarkModeToggle({ darkMode, onToggle }) {
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
            Dark Mode
          </Typography>
          <Typography variant="body2" color="#888">
            Toggle between light and dark theme
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={(e) => onToggle(e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#E03FD8",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  bgcolor: "#E03FD8",
                },
              }}
            />
          }
          label=""
        />
      </Box>
    </Box>
  );
}
