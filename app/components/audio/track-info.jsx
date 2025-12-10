// Track info component
// Is used with the audio player to show current track info (the player itself, not the search results playlist)
// Title, artist, album art thumbnail, with links to Jamendo pages

"use client";

import { Avatar, Box, Typography } from "@mui/material";
import { useAudioPlayerContext } from "@/context/audio-player-context";
import {
  goToArtist,
  goToTrack,
  goToAlbum,
} from "@/app/api/jamendo/jamendo-handler/go-to-jamendo";

// onClick handlers
// goTo functions are in -> /app/api/jamendo/jamendo-handler/go-to-jamendo
export const handleTrackOnClick = (track) => {
  goToTrack(track);
};
export const handleArtistOnClick = (track) => {
  goToArtist(track);
};
export const handleAlbumOnClick = (track) => {
  goToAlbum(track);
};
export const TrackInfo = () => {
  const { currentTrack } = useAudioPlayerContext();

  // base case
  if (!currentTrack) return null;

  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ maxWidth: "100%" }}>
      {/* Avatar Thumbnail */}
      <Avatar
        src={currentTrack.image || ""}
        variant="rounded"
        sx={{
          width: 100,
          height: 100,
          bgcolor: "grey.500",
          flexShrink: 0,
          cursor: "pointer",
        }}
        onClick={() => handleAlbumOnClick(currentTrack)}
      />

      {/* Text Info */}
      <Box sx={{ overflow: "hidden" }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color="white"
          noWrap
          sx={{
            cursor: "pointer",
            color: "white",
            transition: "color 0.1s",
            "&:hover": {
              color: "#E03FD8",
            },
          }}
          onClick={() => handleTrackOnClick(currentTrack)}
        >
          {currentTrack.name}
        </Typography>
        <Typography
          variant="subtitle2"
          color="white"
          noWrap
          sx={{
            cursor: "pointer",
            color: "white",
            transition: "color 0.1s",
            "&:hover": {
              color: "#E03FD8",
            },
          }}
          onClick={() => handleArtistOnClick(currentTrack)}
        >
          {currentTrack.artist_name}
        </Typography>
      </Box>
    </Box>
  );
};
