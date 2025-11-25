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

import { Box, IconButton } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { TrackInfo } from "./track-info";
import { Controls } from "./controls";
import { ProgressBar } from "./progress-bar";
import { VolumeControl } from "./volume-control";
import { DownloadButton } from "./download-button.jsx";
import { useAudioPlayerContext } from "@/context/audio-player-context";
// import { AddTrackToPlaylistButton } from "../playlist/add-track-to-playlist";
// import { DeleteTrackFromPlaylistButton } from "../playlist/delete-track-from-playlist";

export const AudioPlayer = () => {
  const { currentTrack, isMinimized, setIsMinimized } = useAudioPlayerContext();
  // if (!currentTrack) return null; // Ensure currentTrack is defined before rendering
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
      {!isMinimized && (
        <Box
          sx={{
            width: "25%",
            maxWidth: "25%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            mr: 2,
            transition: "all 0.3s ease-in-out",
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
      )}
    </Box>
  );
};
