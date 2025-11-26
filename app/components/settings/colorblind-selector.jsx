"use client";

import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";

export default function ColourblindSelector({ mode, onChange }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  // Check if we're in light mode
  const isLightMode =
    typeof document !== "undefined" &&
    document.body.classList.contains("light-mode");

  return (
    <Box
      sx={{
        bgcolor: "#3a3a3a",
        p: 3,
        borderRadius: 2,
        border: "1px solid #444",
        mb: 2,
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        Colorblind Mode
      </Typography>
      <Typography variant="body2" color="#888" mb={2}>
        Adjust colors for better visibility
      </Typography>
      <FormControl fullWidth>
        <Select
          value={mode}
          onChange={handleChange}
          sx={{
            color: "white",
            bgcolor: "#2e2d2d",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#888",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#E03FD8",
            },
            "& .MuiSvgIcon-root": { color: "#888" },
          }}
          MenuProps={{
            disableScrollLock: true,
            hideBackdrop: true,
            PaperProps: {
              sx: {
                bgcolor: "#3a3a3a",
                maxHeight: "300px",
                "& .MuiMenuItem-root": {
                  color: "white",
                  "&:hover": {
                    bgcolor: "#4a4a4a",
                  },
                  "&.Mui-selected": {
                    bgcolor: "#2e2d2d",
                    "&:hover": {
                      bgcolor: "#4a4a4a",
                    },
                  },
                },
                // Light mode overrides
                ".light-mode &": {
                  bgcolor: "#f5f5f5",
                  "& .MuiMenuItem-root": {
                    color: "#000000",
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                    "&.Mui-selected": {
                      bgcolor: "#d0d0d0",
                      "&:hover": {
                        bgcolor: "#c0c0c0",
                      },
                    },
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="protanopia">Protanopia (Red-Blind)</MenuItem>
          <MenuItem value="deuteranopia">Deuteranopia (Green-Blind)</MenuItem>
          <MenuItem value="tritanopia">Tritanopia (Blue-Blind)</MenuItem>
          <MenuItem value="monochromacy">Monochromacy</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
