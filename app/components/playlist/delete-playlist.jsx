// Component for deleting a playlist
// rough for now, to be improved later

"use client";

import { Button } from "@mui/material";
import { useTestingContext } from "@/context/testing-context";
import axios from "axios"; // library for making API requests easily -> https://axios-http.com/docs/intro

export const DeletePlaylistButton = () => {
  const { testTrack, testPlaylist } = useTestingContext();

  async function handleDeletePlaylist(playlistID) {
    try {
      const response = await axios.delete(
        `/api/users/${userID}/playlists/${playlistID}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete playlist");
      }

      return response.data;
    } catch (error) {
      console.error("Error deleting playlist:", error);
      throw error;
    }
  }
  return (
    <Button
      onClick={async () => {
        const playlistID = testPlaylist.id; // Get the playlist ID from your state or props
        await handleDeletePlaylist(playlistID);
      }}
    >
      Delete Playlist
    </Button>
  );
};
