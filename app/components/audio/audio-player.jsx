"use client";

import { Box, Paper, Divider } from "@mui/material";
import { TrackInfo } from "./track-info";
import { Controls } from "./controls";
import { ProgressBar } from "./progress-bar";
import { VolumeControl } from "./volume-control";
import { PlayList } from "./playlist";

export const AudioPlayer = () => {
  return (
    <Paper
      elevation={4}
      sx={{
        bgcolor: "#2e2d2d",
        color: "white",
        width: "100%",
        maxWidth: "100%",
        mx: "auto",
        mb: 4,
        p: { xs: 2, md: 4 },
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Row 1: Track Info */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 160, // increase this from 128 to make the section taller
          px: 2,
        }}
      >
        <TrackInfo />
      </Box>

      <Divider sx={{ bgcolor: "#444" }} />

      {/* Row 2: Playlist */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <PlayList />
      </Box>

      <Divider sx={{ bgcolor: "#444" }} />

      {/* Row 3: Progress Bar */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          bgcolor: "#2e2d2d",
          zIndex: 10,
          px: 2,
          py: 2,
          borderTop: "1px solid #444",
          width: "100%",
        }}
      >
        {/* Progress Bar */}
        <Box mb={1}>
          <ProgressBar />
        </Box>

        {/* Controls + Volume on same row */}
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
    </Paper>
  );
};
