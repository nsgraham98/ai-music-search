"use client";

import { useAudioPlayerContext } from "@/context/audio-player-context";
import {
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Paper,
} from "@mui/material";
import { BsMusicNoteBeamed } from "react-icons/bs";

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
              <ListItemAvatar>
                {/* if thumbnail exists, use it — otherwise show fallback */}
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

              <ListItemText
                primary={
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
                }
                secondary={
                  <Typography
                    variant="caption"
                    sx={{
                      color: "white",
                      transition: "color 0.2s",
                      "&:hover": {
                        color: "#ccc",
                      },
                    }}
                  >
                    Artist: {track.artist_name}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
};
