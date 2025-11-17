"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useUserAuth } from "@/context/auth-context";
import { Typography, Paper, Box, Container } from "@mui/material";
import { useAudioPlayerContext } from "@/context/audio-player-context";
import SignedInAs from "@/app/components/login/signed-in-as";
import { LogoutButton } from "@/app/components/login/logout-button";
import Navigation from "@/app/components/navigation/nav-bar.jsx";
import ColorblindFilters from "@/app/components/settings/colorblind-filters";

import { TrackList } from "@/app/components/audio/track-list.jsx";

export default function PlaylistPage({ params }) {
  const { playlistID } = React.use(params);
  const { authUser } = useUserAuth();
  const { setCurrentPlaylist, currentPlaylist } = useAudioPlayerContext();

  useEffect(() => {
    // Fetch playlist data using playlistID
    async function fetchPlaylistRich() {
      try {
        const firebaseResponse = await axios.get(
          `/api/users/${authUser.uid}/playlists/${playlistID}`
        );
        console.log("Fetched playlist:", firebaseResponse.data);
        const trackIds = firebaseResponse.data.playlist.tracks;
        const jamendoResponse = await axios.get(
          `/api/jamendo/${trackIds.join("/")}`
        );
        console.log("Fetched tracks from Jamendo:", jamendoResponse.data);

        // consider waiting to set the playlist, until the user has actually clicked a track to play
        setCurrentPlaylist({
          id: firebaseResponse.data.playlist.id,
          userID: firebaseResponse.data.playlist.userID,
          name: firebaseResponse.data.playlist.name,
          public: firebaseResponse.data.playlist.public,
          description: firebaseResponse.data.playlist.description,
          timeCreated: firebaseResponse.data.playlist.timeCreated,
          timeUpdated: firebaseResponse.data.playlist.timeUpdated,
          tracks: jamendoResponse.data.results,
        });
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    }
    fetchPlaylistRich();
  }, []);

  return (
    <Container maxWidth="lg">
      <ColorblindFilters />

      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight="bold">
          TUTTi.
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <SignedInAs />
          <LogoutButton />
        </Box>
      </Box>

      {/* Navigation */}
      <Navigation />
      <Box>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {currentPlaylist.name || "Playlist"}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          gutterBottom
          sx={{ mb: 4, color: "white" }}
        >
          {currentPlaylist.description || "No description available."}
        </Typography>
      </Box>
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
          {!currentPlaylist.id || currentPlaylist.tracks.length === 0 ? (
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
              <Typography
                variant="body1"
                color="white"
                textAlign="center"
                p={2}
              >
                Loading...
              </Typography>
            </Paper>
          ) : (
            <TrackList />
          )}
        </Box>
      </Box>
    </Container>
  );
}
