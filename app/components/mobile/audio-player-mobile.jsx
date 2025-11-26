"use client";

import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { TrackInfo } from "../audio/track-info";
import { Controls } from "../audio/controls";
import { ProgressBar } from "../audio/progress-bar";
import { VolumeControl } from "../audio/volume-control";
import { DownloadButton } from "../audio/download-button.jsx";
import { useAudioPlayerContext } from "@/context/audio-player-context";

export const AudioPlayer = () => {
  const { currentTrack } = useAudioPlayerContext();
  const theme = useTheme();

  // Detect mobile and tablet breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 900px
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // > 900px

  // Mobile Layout (Stacked Vertically)
  if (isMobile) {
    return (
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "#2e2d2d",
          borderTop: "1px solid #444",
          zIndex: 1000,
          width: "100%",
          px: 1,
          py: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          isolation: "isolate",
          // Light mode
          ".light-mode &": {
            bgcolor: "#ffffff",
            borderTop: "1px solid #cccccc",
            boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
          },
          // iOS safe area
          paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        }}
      >
        {/* Progress Bar - Full Width at Top */}
        <Box width="100%">
          <ProgressBar />
        </Box>

        {/* Track Info and Controls Combined Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          {/* Track Info - Takes most space */}
          <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            <TrackInfo compact={true} />
          </Box>

          {/* Controls - Compact */}
          <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
            <Controls compact={true} />
          </Box>

          {/* Download Button */}
          {currentTrack?.audiodownload_allowed && (
            <Box sx={{ flexShrink: 0 }}>
              <DownloadButton
                downloadUrl={currentTrack?.audiodownload}
                downloadAllowed={currentTrack?.audiodownload_allowed}
                filename={`${currentTrack?.name}.mp3`}
                size="small"
              />
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  // Tablet Layout (Horizontal but more compact)
  if (isTablet) {
    return (
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          bgcolor: "#2e2d2d",
          borderTop: "1px solid #444",
          zIndex: 1000,
          width: "100%",
          px: 2,
          py: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          isolation: "isolate",
          ".light-mode &": {
            bgcolor: "#ffffff",
            borderTop: "1px solid #cccccc",
            boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {/* Progress Bar - Full Width */}
        <Box width="100%">
          <ProgressBar />
        </Box>

        {/* Main Controls Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Track Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TrackInfo />
          </Box>

          {/* Controls */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Controls />
          </Box>

          {/* Volume and Download */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <VolumeControl />
            <DownloadButton
              downloadUrl={currentTrack?.audiodownload}
              downloadAllowed={currentTrack?.audiodownload_allowed}
              filename={`${currentTrack?.name}.mp3`}
            />
          </Box>
        </Box>
      </Box>
    );
  }

  // Desktop Layout (Original Three-Column Layout)
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        bgcolor: "#2e2d2d",
        borderTop: "1px solid #444",
        zIndex: 100,
        width: "100%",
        px: 2,
        py: 1.5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        minHeight: "5vw",
        isolation: "isolate",
        ".light-mode &": {
          bgcolor: "#ffffff",
          borderTop: "1px solid #cccccc",
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {/* Left - Track Info */}
      <Box
        sx={{
          width: "25%",
          maxWidth: "25%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          ml: 2,
        }}
      >
        <TrackInfo />
      </Box>

      {/* Middle - Controls and Progress */}
      <Box
        sx={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box width="100%" mb={1}>
          <ProgressBar />
        </Box>
        <Box display="flex" alignItems="center" width="100%">
          <Box flex={1} />
          <Box flex={1} display="flex" justifyContent="center">
            <Controls />
          </Box>
          <Box flex={1} display="flex" justifyContent="flex-end"></Box>
        </Box>
      </Box>

      {/* Right - Volume and Download */}
      <Box
        sx={{
          width: "25%",
          maxWidth: "25%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          mr: 2,
        }}
      >
        <VolumeControl />
        <DownloadButton
          downloadUrl={currentTrack?.audiodownload}
          downloadAllowed={currentTrack?.audiodownload_allowed}
          filename={`${currentTrack?.name}.mp3`}
        />
      </Box>
    </Box>
  );
};
