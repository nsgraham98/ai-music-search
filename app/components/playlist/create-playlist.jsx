// Component for adding a track to a playlist
// rough for now, to be improved later

"use client";

import { Button } from "@mui/material";
import { useAudioPlayerContext } from "@/context/audio-player-context";
import axios from "axios"; // library for making API requests easily -> https://axios-http.com/docs/intro

export const CreatePlaylistButton = () => {
  const { testTrack, testPlaylist } = useAudioPlayerContext();

  async function handleCreatePlaylist(playlistName) {
    try {
      const response = await axios.post(`/api/playlist`, {
        name: playlistName,
      });

      if (response.status !== 200) {
        throw new Error("Failed to create playlist");
      }

      return response.data;
    } catch (error) {
      console.error("Error creating playlist:", error);
      throw error;
    }
  }
  return (
    <Button
      onClick={async () => {
        const playlistName = "My New Playlist"; // Placeholder name for the new playlist
        await handleCreatePlaylist(playlistName);
      }}
    >
      Create Playlist
    </Button>
  );
};
