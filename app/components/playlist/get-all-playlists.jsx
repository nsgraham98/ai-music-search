// Component to fetch all playlists for a user
// rough for now, to be improved later

"use client";

import { Button } from "@mui/material";
import axios from "axios"; // library for making API requests easily -> https://axios-http.com/docs/intro

export const GetAllPlaylistsButton = () => {
  async function fetchAllPlaylists() {
    try {
      const response = await axios.get(`/api/users/${userID}/playlists`);
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
        await fetchAllPlaylists();
      }}
    >
      Get Playlists
    </Button>
  );
};
