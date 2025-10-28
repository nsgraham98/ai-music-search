// Component for updating playlist information (e.g., name, description)
// rough for now, to be improved later

"use client";

import { Button } from "@mui/material";
import { useTestingContext } from "@/context/testing-context";
import axios from "axios"; // library for making API requests easily -> https://axios-http.com/docs/intro

export const UpdatePlaylistButton = () => {
  const { testPlaylistID, userID } = useTestingContext();

  async function handleUpdatePlaylist(playlistID, updatedData) {
    try {
      const response = await axios.patch(
        `/api/users/${userID}/playlists/${playlistID}/`,
        updatedData
      );

      if (response.status !== 200) {
        throw new Error("Failed to update playlist");
      }

      return response.data;
    } catch (error) {
      console.error("Error updating playlist:", error);
      throw error;
    }
  }
  return (
    <Button
      onClick={async () => {
        const playlistID = testPlaylistID; // Get the playlist ID from your state or props
        const updatedData = {
          name: "Updated Playlist Name",
          description: "Updated Playlist Description",
        };
        await handleUpdatePlaylist(playlistID, updatedData);
      }}
    >
      Update Playlist
    </Button>
  );
};
