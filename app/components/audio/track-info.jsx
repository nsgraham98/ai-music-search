"use client";

import { useAudioPlayerContext } from "@/context/audio-player-context";
import { Box, Typography, Avatar } from "@mui/material";
import { BsMusicNoteBeamed } from "react-icons/bs";

export const TrackInfo = () => {
  const { currentTrack } = useAudioPlayerContext();

  if (!currentTrack) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        {/* fallback block when no track is selected */}
        <Avatar
          variant="rounded"
          sx={{
            width: 120, // same as w-24
            height: 120,
            bgcolor: "grey.200",
            color: "grey.600",
            fontSize: 28,
          }}
        >
          <BsMusicNoteBeamed />
        </Avatar>

        <Box display="flex" flexDirection="column" gap={0.5}>
          <Typography
            fontWeight="bold"
            noWrap
            maxWidth={256} // same as max-w-64
          >
            No track selected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No artist
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {/* add to return statement if we want thumbnail handling */}

      {/* {currentTrack.thumbnail ? (
        <img
          className="w-full h-full object-cover"
          src={currentTrack.thumbnail}
          alt="audio avatar"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded-md">
          <span className="text-xl text-gray-600">
            <BsMusicNoteBeamed />
          </span>
        </div>
      )} */}

      {/* updated MUI version with fallback */}
      {currentTrack.thumbnail || currentTrack.image ? (
        <Avatar
          variant="rounded"
          src={currentTrack.thumbnail || currentTrack.image}
          sx={{ width: 96, height: 96 }}
        />
      ) : (
        <Avatar
          variant="rounded"
          sx={{
            width: 96,
            height: 96,
            bgcolor: "grey.200",
            color: "grey.600",
            fontSize: 28,
          }}
        >
          <BsMusicNoteBeamed />
        </Avatar>
      )}

      <Box>
        <Typography
          fontWeight="bold"
          noWrap
          maxWidth={256} // same as max-w-64
        >
          Song: {currentTrack.name}
        </Typography>
        <Typography variant="body2" color="text.primary">
          Artist: {currentTrack.artist_name}
        </Typography>
      </Box>
    </Box>
  );
};
