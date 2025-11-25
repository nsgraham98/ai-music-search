// TrackList.jsx
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
import {
  goToTrack,
  goToArtist,
  goToAlbum,
} from "@/app/api/jamendo/jamendo-handler/go-to-jamendo";

import { useState, useEffect } from "react";
import TracklistMenu from "./track-list-menu";

export const TrackList = ({
  tracks,
  playlistId = "",
  variant = "default", // "search" | "playlist" | "default"
  // UI controls
  showDownload = true,
  showAddButton = false,
  showDeleteButton = false,
  clearOnUnmount = false,
  // optional override for click behaviour
  onTrackClick, // (track) => void
}) => {
  const { currentTrack, setCurrentTrack, setIsPlaying, setCurrentPlaylist } =
    useAudioPlayerContext();

  // const effectiveTracks = tracks ?? currentPlaylist?.tracks ?? [];
  // const [effectiveTracks, setEffectiveTracks] = useState(tracks ?? []);
  const [effectiveTracks, setEffectiveTracks] = useState(tracks ?? []);

  useEffect(() => {
    console.log("TrackList mounted with tracks:", tracks);
    setEffectiveTracks(tracks ?? []);
  }, [tracks]);

  const handlePlay = (track) => {
    // default behaviour if no custom handler passed
    if (onTrackClick) {
      onTrackClick(track);
    } else {
      setCurrentTrack(track);
      // if the current playlist is different from the one containing the track, update it
      setCurrentPlaylist((prev) => {
        if (!prev.tracks.find((t) => t.id === track.id)) {
          return {
            ...prev,
            tracks: effectiveTracks,
          };
        }
        return prev;
      });
      setIsPlaying(true);
    }
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
        width: "100%",
        maxWidth: 900,
        mx: "auto",
      }}
    >
      <List disablePadding>
        {effectiveTracks.map((track, index) => {
          const isActive = currentTrack?.id
            ? currentTrack.id === track.id
            : currentTrack?.name === track.name;

          return (
            <ListItemButton
              key={track.id ?? index}
              selected={isActive}
              onClick={() => handlePlay(track)}
              onKeyDown={(e) => e.key === "Enter" && handlePlay(track)}
              sx={{
                bgcolor: isActive ? "#a66646" : "transparent",
                "&:hover": {
                  bgcolor: isActive ? "#a66646" : "#5a5555",
                },
                border: isActive
                  ? "1px solid #E03FD8"
                  : "1px solid transparent",
                borderRadius: 2.5,
                boxShadow: isActive
                  ? "0 0 10px 2px rgba(224, 63, 216, 0.5)"
                  : "none",
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
                    sx={{ cursor: "pointer" }}
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

                {/* Right Side: Actions – configurable per use case */}
                <TracklistMenu
                  track={track}
                  playlistId={playlistId}
                  showAddButton={showAddButton}
                  showDeleteButton={showDeleteButton}
                  showDownload={showDownload}
                />
              </Box>
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
};
