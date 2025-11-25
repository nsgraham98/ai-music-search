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

import { Box } from "@mui/material";
import { TrackInfo } from "./track-info";
import { Controls } from "./controls";
import { ProgressBar } from "./progress-bar";
import { VolumeControl } from "./volume-control";
import { useAudioPlayerContext } from "@/context/audio-player-context";
import TracklistMenu from "@/app/components/audio/track-list-menu";

// import { AddTrackToPlaylistButton } from "../playlist/add-track-to-playlist";
// import { DeleteTrackFromPlaylistButton } from "../playlist/delete-track-from-playlist";

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
        <TracklistMenu
          track={currentTrack}
          showAddButton={true}
          showDeleteButton={false}
          showDownload={true}
        />
        {/* <AddTrackToPlaylistButton trackId={currentTrack?.id} />
        <DeleteTrackFromPlaylistButton trackId={currentTrack?.id} /> */}
      </Box>
    </Box>
  );
};
