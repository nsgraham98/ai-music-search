// this is the search results component that will be used to display the search results in the audio player
// should probably use a different name to avoid confusion

"use client";

import { useAudioPlayerContext } from "@/context/audio-player-context";
import {
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { DownloadButton } from "./download-button";
import {
  goToTrack,
  goToArtist,
  goToAlbum,
} from "@/app/api/jamendo/jamendo-handler/go-to-jamendo";

// placeholder for future search result repurposing
export function handleSearchResults(searchResults) {}

export const PlayList = () => {
  const { currentTrack, setCurrentTrack, setIsPlaying, tracks } =
    useAudioPlayerContext();

  const handleClick = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleTrackOnClick = (track) => {
    goToTrack(track);
  };

  const handleArtistOnClick = (track) => {
    goToArtist(track);
  };
  const handleAlbumOnClick = (track) => {
    goToAlbum(track);
  };

  if (!tracks || tracks.length === 0) {
    return (
      <Paper
        elevation={3}
        sx={{
          bgcolor: "#4c4848",
          color: "white",
          // maxHeight: "18rem",
          overflowY: "auto",
          borderRadius: 2,
          width: "100%", // add this
          maxWidth: 900, // adjust this width to make it wider
          mx: "auto", // optional: centers it horizontally
        }}
      >
        <Typography variant="body1" color="white" textAlign="center" p={2}>
          No tracks available.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        bgcolor: "#4c4848",
        color: "white",
        overflowY: "auto",
        borderRadius: 2,
        width: "100%", // add this
        maxWidth: 900, // adjust this width to make it wider
        mx: "auto", // optional: centers it horizontally
      }}
    >
      <List disablePadding>
        {tracks.map((track, index) => {
          const isActive = currentTrack?.name === track.name;

          return (
            <ListItemButton
              key={index}
              selected={isActive}
              onClick={() => handleClick(track)}
              onKeyDown={(e) => e.key === "Enter" && handleClick(track)}
              sx={{
                bgcolor: isActive ? "#a66646" : "transparent",
                "&:hover": {
                  bgcolor: isActive ? "#a66646" : "#5a5555",
                },
                px: 2,
                py: 1,
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                {/* Left Side: Avatar + Text */}
                <Box display="flex" alignItems="center" gap={2}>
                  <ListItemAvatar
                    onClick={() => handleAlbumOnClick(track)}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    {track.image ? (
                      <Avatar
                        src={track.image}
                        variant="rounded"
                        sx={{ width: 64, height: 64 }}
                      />
                    ) : (
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: "grey.300",
                          color: "grey.600",
                          fontSize: 24,
                        }}
                      >
                        <BsMusicNoteBeamed />
                      </Avatar>
                    )}
                  </ListItemAvatar>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      noWrap
                      onClick={() => handleTrackOnClick(track)}
                      sx={{
                        cursor: "pointer",
                        color: "white",
                        transition: "color 0.1s",
                        "&:hover": {
                          color: "#E03FD8",
                        },
                      }}
                    >
                      {track.name}
                    </Typography>

                    <Typography
                      variant="caption"
                      noWrap
                      onClick={() => handleArtistOnClick(track)}
                      sx={{
                        cursor: "pointer",
                        color: "white",
                        transition: "color 0.1s",
                        "&:hover": {
                          color: "#E03FD8",
                        },
                      }}
                    >
                      {track.artist_name}
                    </Typography>
                  </Box>
                </Box>

                {/* Right Side: Download Button */}
                <DownloadButton
                  downloadUrl={track.audiodownload}
                  downloadAllowed={track.audiodownload_allowed}
                  filename={`${track.name}.mp3`}
                />
              </Box>
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
};
