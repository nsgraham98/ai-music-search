// Component for adding a track to a playlist
// rough for now, to be improved later

"use client";

import { Button } from "@mui/material";
import { useAudioPlayerContext } from "@/context/audio-player-context";
import axios from "axios"; // library for making API requests easily -> https://axios-http.com/docs/intro

export const AddToPlaylistButton = () => {
  const { testTrack, testPlaylist } = useAudioPlayerContext();

  async function handleAddToPlaylist(trackID, musicService, playlistID) {
    try {
      const response = await axios.post(`/api/playlist/${playlistID}`, {
        trackID,
        musicService,
        playlistID,
      });

      if (response.status !== 200) {
        throw new Error("Failed to add track to playlist");
      }

      return response.data;
    } catch (error) {
      console.error("Error adding track to playlist:", error);
      throw error;
    }
  }
  return (
    <Button
      onClick={async () => {
        const trackID = testTrack.id; // Get the track ID from your state or props
        const playlistID = testPlaylist.id; // Get the playlist ID from your state or props
        const musicService = "jamendo"; // Example music provider
        await handleAddToPlaylist(trackID, musicService, playlistID);
      }}
    >
      Add to Playlist
    </Button>
  );
};
