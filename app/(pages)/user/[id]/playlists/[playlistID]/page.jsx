"use client";

import React, { useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { useUserAuth } from "@/context/auth-context";
import { Typography, Paper, Box } from "@mui/material";
import { useAudioPlayerContext } from "@/context/audio-player-context";
import { TrackList } from "@/app/components/audio/track-list.jsx";
import { useParams } from "next/navigation";

export default function PlaylistPage() {
  const params = useParams();
  const playlistID = params.playlistID;
  const { authUser } = useUserAuth();
  const [playlistInfo, setPlaylistInfo] = useState({});
  const [loadingMessage, setLoadingMessage] = useState("Loading playlist...");

  useEffect(() => {
    // Fetch playlist data using playlistID
    async function fetchPlaylistRich() {
      try {
        const firebaseResponse = await axios.get(
          `/api/users/${authUser.uid}/playlists/${playlistID}`
        );
        console.log("Fetched playlist:", firebaseResponse.data);
        const trackIds = firebaseResponse.data.playlist.tracks;
        if (!trackIds || trackIds.length === 0) {
          setPlaylistInfo({
            id: firebaseResponse.data.playlist.id,
            userID: firebaseResponse.data.playlist.userID,
            name: firebaseResponse.data.playlist.name,
            public: firebaseResponse.data.playlist.public,
            description: firebaseResponse.data.playlist.description,
            timeCreated: firebaseResponse.data.playlist.timeCreated,
            tracks: [],
          });
          setLoadingMessage("No tracks found in this playlist.");
          return; // Exit early if no tracks
        }
        const jamendoResponse = await axios.get(
          `/api/jamendo/${trackIds.join("/")}`
        );
        console.log("Fetched tracks from Jamendo:", jamendoResponse.data);
        setPlaylistInfo({
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
  }, [authUser?.uid, playlistID]);

  return (
    <>
      <Box>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {playlistInfo.name || "Loading playlist..."}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          gutterBottom
          sx={{ mb: 4, color: "white" }}
        >
          {playlistInfo.description || ""}
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
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {!playlistInfo.id || playlistInfo.tracks.length === 0 ? (
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
              <Typography
                variant="body1"
                color="white"
                textAlign="center"
                p={2}
              >
                {loadingMessage}
              </Typography>
            </Paper>
          ) : (
            <TrackList
              variant="playlist"
              tracks={playlistInfo.tracks}
              showDownload={true}
              showAddButton={false}
              showDeleteButton={true}
              clearOnUnmount={true}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
