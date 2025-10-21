"use client";

import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";

export default function ColorblindModeSelector({ mode, onChange }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

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
            PaperProps: {
              sx: {
                bgcolor: "#3a3a3a",
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
