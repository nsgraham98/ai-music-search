"use client";

import { Avatar, Box, Typography } from "@mui/material";
import { useAudioPlayerContext } from "@/context/audio-player-context";

export const TrackInfo = () => {
  const { currentTrack } = useAudioPlayerContext();

  if (!currentTrack) return null;

  return (
    <Box display="flex" alignItems="center" gap={2} width="100%" sx={{ px: 2 }}>
      {/* Avatar Thumbnail */}
      <Avatar
        src={currentTrack.image || ""}
        variant="rounded"
        sx={{ width: 80, height: 80, bgcolor: "grey.500" }}
      />

      {/* Text Info */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" color="white" noWrap>
          Song: {currentTrack.name}
        </Typography>

        <Typography variant="subtitle2" color="white">
          Artist: {currentTrack.artist_name}
        </Typography>
      </Box>
    </Box>
  );
};
