// Component to fetch a specific playlist for a user
// rough for now, to be improved later

"use client";

import { Button } from "@mui/material";
import { useTestingContext } from "@/context/testing-context";
import axios from "axios"; // library for making API requests easily -> https://axios-http.com/docs/intro

export const GetPlaylistButton = () => {
  const { testPlaylist } = useTestingContext();

  async function fetchPlaylist(playlistID) {
    try {
      const response = await axios.get(
        `/api/users/${userID}/playlists/${playlistID}`
      );
      console.log("Playlist fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching playlist:", error);
      throw error;
    }
  }
  return (
    <Button
      onClick={async () => {
        const playlistID = testPlaylist.id;
        await fetchPlaylist(playlistID);
      }}
    >
      Get Playlist
    </Button>
  );
};
