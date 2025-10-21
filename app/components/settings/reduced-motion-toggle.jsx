"use client";

import { Box, Typography, FormControlLabel, Switch } from "@mui/material";

export default function ReducedMotionToggle({ enabled, onToggle }) {
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
            Reduce Motion
          </Typography>
          <Typography variant="body2" color="#888">
            Minimize animations and transitions
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={enabled}
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
