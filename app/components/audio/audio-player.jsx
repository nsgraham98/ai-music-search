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
        maxWidth: 900,
        mx: "auto",
        mb: 4,
        p: { xs: 2, md: 4 },
        borderRadius: 3,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 3, md: 5 },
        alignItems: { md: "flex-start" },
      }}
    >
      {/* Track Info */}
      <Box
        minWidth={220}
        flexShrink={0}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pb: { xs: 2, md: 0 },
        }}
      >
        <TrackInfo />
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{ display: { xs: "none", md: "block" }, bgcolor: "#444" }}
      />

      {/* Center: Playlist */}
      <Box flex={1} minWidth={0} sx={{ mb: { xs: 2, md: 0 } }}>
        <PlayList />
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{ display: { xs: "none", md: "block" }, bgcolor: "#444" }}
      />

      {/* Right: Controls, Progress, Volume */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          minWidth: 240,
          width: { xs: "100%", md: 240 },
        }}
      >
        <ProgressBar />
        <Box display="flex" alignItems="center" gap={2} width="100%">
          <VolumeControl />
          <Controls />
        </Box>
      </Box>
    </Paper>
  );
};
