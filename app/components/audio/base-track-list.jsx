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
import { AddTrackToPlaylistButton } from "../playlist/add-track-to-playlist";
import { DeleteTrackFromPlaylistButton } from "../playlist/delete-track-from-playlist";

export const TrackList = () => {
  const { currentTrack, setCurrentTrack, setIsPlaying, currentPlaylist } =
    useAudioPlayerContext();

  // onClick handlers
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
        {currentPlaylist.tracks.map((track, index) => {
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
                <AddTrackToPlaylistButton trackId={track.id} />
                <DeleteTrackFromPlaylistButton trackId={track.id} />
              </Box>
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
};
