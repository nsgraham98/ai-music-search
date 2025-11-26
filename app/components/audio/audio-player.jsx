// Component for the audio player UI at the bottom of the screen
// Present on every page after login (i.e. within the dashboard layout)
// Used in /app/(pages)/(home)/layout.jsx

// Contains subcomponents for:
// track info
// playback controls
// progress bar
// volume control
// download button

"use client";

import { Box, IconButton, useMediaQuery, useTheme} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { TrackInfo } from "./track-info";
import { Controls } from "./controls";
import { ProgressBar } from "./progress-bar";
import { VolumeControl } from "./volume-control";
import { DownloadButton } from "./download-button.jsx";
import { useAudioPlayerContext } from "@/context/audio-player-context";

export const AudioPlayer = () => {
  const { currentTrack, isMinimized, setIsMinimized } = useAudioPlayerContext();
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
        py: isMinimized ? 0.5 : 1.5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        minHeight: isMinimized ? "auto" : "5vw",
        isolation: "isolate",
        ".light-mode &": {
          bgcolor: "#ffffff",
          borderTop: "1px solid #cccccc",
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
        },
        maxHeight: isMinimized ? "48px" : "none",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Minimize/Expand Button */}
      <IconButton
        onClick={() => setIsMinimized(!isMinimized)}
        title={isMinimized ? "Show audio player" : "Hide audio player"}
        sx={{
          color: "#ccc",
          transition: "all 0.2s",
          "&:hover": {
            color: "#E03FD8",
            transform: "scale(1.1)",
          },
        }}
        size="small"
      >
        {isMinimized ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </IconButton>

      {/* Left */}
      {/* Left - Track Info */}
      <Box
        sx={{
          width: isMinimized ? "0" : "25%",
          maxWidth: isMinimized ? "0" : "25%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          ml: isMinimized ? 0 : 2,
          opacity: isMinimized ? 0 : 1,
          transition: "all 0.3s ease-in-out",
          overflow: "hidden",
        }}
      >
        <TrackInfo />
      </Box>

      {/* Middle */}
      {!isMinimized && (
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease-in-out",
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
      )}

      {/* Right */}
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
        {/* <AddTrackToPlaylistButton trackId={currentTrack?.id} />
        <DeleteTrackFromPlaylistButton trackId={currentTrack?.id} /> */}
      </Box>
    </Box>
  );
};
