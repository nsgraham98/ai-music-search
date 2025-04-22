"use client";

import { Avatar, Box, Typography } from "@mui/material";
import { useAudioPlayerContext } from "@/context/audio-player-context";

export const TrackInfo = () => {
  const { currentTrack } = useAudioPlayerContext();

  if (!currentTrack) return null;

  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ maxWidth: "100%" }}>
      {/* Avatar Thumbnail */}
      <Avatar
        src={currentTrack.image || ""}
        variant="rounded"
        sx={{ width: 100, height: 100, bgcolor: "grey.500", flexShrink: 0 }}
      />

      {/* Text Info */}
      <Box sx={{ overflow: "hidden" }}>
        <Typography variant="subtitle1" fontWeight="bold" color="white" noWrap>
          {currentTrack.name}
        </Typography>

        <Typography variant="subtitle2" color="white" noWrap>
          {currentTrack.artist_name}
        </Typography>
      </Box>
    </Box>
  );
};
