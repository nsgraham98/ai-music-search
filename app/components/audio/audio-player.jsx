"use client";

import { Box, Paper, Divider } from "@mui/material";
import { TrackInfo } from "./track-info";
import { Controls } from "./controls";
import { ProgressBar } from "./progress-bar";
import { VolumeControl } from "./volume-control";
import { PlayList } from "./playlist";

export const AudioPlayer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#1e1e1e",
        color: "white",
        justifyContent: "space-between",
      }}
    >
      {/* Main Audio Player Section */}
      <Box
        component={Paper}
        elevation={4}
        sx={{
          bgcolor: "#2e2d2d",
          color: "white",
          width: "100%",
          maxWidth: "100%",
          mx: "auto",
          p: { xs: 2, md: 4 },
          borderRadius: 0,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Track Info and Playlist Column */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            maxwidth: "100%",
            px: 2,
          }}
        >
          {/* Track Info - Left Aligned, Fixed Width */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
            }}
          >
            <TrackInfo />
          </Box>

          {/* Playlist - Slightly Wider */}
          <Box
            sx={{
              width: "100%",
              px: 2, // optional: keep padding left/right
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "100%",
              }}
            >
              <PlayList />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Sticky Footer with Progress Bar and Controls */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          bgcolor: "#2e2d2d",
          borderTop: "1px solid #444",
          zIndex: 100,
          width: "100%",
          px: 2,
          py: 1.5,
        }}
      >
        {/* Progress Bar */}
        <Box mb={1}>
          <ProgressBar />
        </Box>

        {/* Audio Controls + Volume */}
        <Box display="flex" alignItems="center" width="100%">
          <Box sx={{ flex: 1 }} />
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Controls />
          </Box>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <VolumeControl />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
