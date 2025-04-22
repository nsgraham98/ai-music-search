"use client";

import { Box } from "@mui/material";
import { TrackInfo } from "./track-info";
import { Controls } from "./controls";
import { ProgressBar } from "./progress-bar";
import { VolumeControl } from "./volume-control";
import { DownloadButton } from "./download-button.jsx";
import { useAudioPlayerContext } from "@/context/audio-player-context";

export const AudioPlayer = () => {
  const { currentTrack } = useAudioPlayerContext();
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
        py: 1.5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        minHeight: "5vw",
      }}
    >
      {/* Left */}
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

      {/* Middle */}
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
      </Box>
    </Box>
  );
};
