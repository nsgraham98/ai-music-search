// Component for adding a track to a playlist
// rough for now, to be improved later

"use client";

import { Button } from "@mui/material";
import { useAudioPlayerContext } from "@/context/audio-player-context";
import axios from "axios"; // library for making API requests easily -> https://axios-http.com/docs/intro

export const GetPlaylistsButton = () => {
  const { testTrack, testPlaylist } = useAudioPlayerContext();

  async function fetchPlaylists() {
    try {
      const response = await axios.get(`/api/playlist`);
      console.log("Playlists fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching playlists:", error);
      throw error;
    }
  }
  return (
    <Button
      onClick={async () => {
        await fetchPlaylists();
      }}
    >
      Get Playlists
    </Button>
  );
};
