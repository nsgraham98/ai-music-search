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

// placeholder for future search result repurposing
export function handleSearchResults(searchResults) {}

// i think we can repurpose this component for the search results
export const PlayList = () => {
  const { currentTrack, setCurrentTrack, setIsPlaying, tracks } =
    useAudioPlayerContext();

  const handleClick = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // thumbnail might be broken - attribute does not exist in our test tracks
  return (
    <Paper
      elevation={3}
      sx={{
        bgcolor: "#4c4848",
        color: "white",
        maxHeight: "18rem",
        overflowY: "auto",
        borderRadius: 2,
      }}
    >
      <List disablePadding>
        {tracks.map((track, index) => {
          console.log({
            name: track.name,
            downloadUrl: track.audiodownload,
            downloadAllowed: track.download_allowed,
          });
          const isActive = currentTrack?.name === track.name;

          return (
            <ListItemButton
              key={index}
              selected={isActive}
              onClick={() => handleClick(track)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleClick(track);
                }
              }}
              sx={{
                px: 2,
                py: 1,
                bgcolor: isActive ? "#a66646" : "transparent",
                "&:hover": {
                  bgcolor: isActive ? "#a66646" : "#5a5555",
                },
              }}
            >
              {/* Wrap left and right side in a flex box */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                {/* Left: Avatar + Song Info */}
                <Box display="flex" alignItems="center" gap={2}>
                  <ListItemAvatar>
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
                      sx={{
                        color: "white",
                        transition: "color 0.2s",
                        "&:hover": {
                          color: "#ff9966",
                        },
                      }}
                    >
                      Song: {track.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "gray",
                        transition: "color 0.2s",
                        "&:hover": {
                          color: "#ccc",
                        },
                      }}
                    >
                      Artist: {track.artist_name}
                    </Typography>
                  </Box>
                </Box>

                {/* Right: Download Button */}
                <DownloadButton
                  downloadUrl={track.audiodownload}
                  downloadAllowed={track.audiodownload_allowed} // ✅ FIXED
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
