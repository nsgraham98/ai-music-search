"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useUserAuth } from "@/context/auth-context";
import { Typography, Paper, Box } from "@mui/material";
import { useAudioPlayerContext } from "@/context/audio-player-context";

import { TrackList } from "@/app/components/audio/track-list.jsx";

export default function PlaylistPage({ params }) {
  const { playlistID } = React.use(params);
  const { authUser } = useUserAuth();
  const { setCurrentPlaylist, currentPlaylist } = useAudioPlayerContext();

  useEffect(() => {
    // Fetch playlist data using playlistID
    async function fetchPlaylistRich() {
      try {
        const response = await axios.get(
          `/api/users/${authUser.uid}/playlists/${playlistID}`
        );
        console.log("Fetched playlist:", response.data);
        const trackIds = response.data.playlist.tracks;
        const jamendoResponse = await axios.get(
          `/api/jamendo/${trackIds.join("/")}`
        );
        console.log("Fetched tracks from Jamendo:", jamendoResponse.data);
        setCurrentPlaylist(jamendoResponse.data.results);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    }
    fetchPlaylistRich();
  }, []);

  return (
    <Box
      component={Paper}
      elevation={4}
      sx={{
        bgcolor: "#2e2d2d",
        color: "white",
        width: "100%",
        maxWidth: "100%",
        height: "100%",
        minHeight: "100%",
        mx: "auto",
        p: { xs: 2, md: 4 },
        borderRadius: 2,
        // flexGrow: 1,
        // display: "flex",
        // flexDirection: "column",
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {!currentPlaylist || currentPlaylist.length === 0 ? (
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
              Loading...
            </Typography>
          </Paper>
        ) : (
          <TrackList />
        )}
      </Box>
    </Box>
  );

  // else, show list of tracks
}
