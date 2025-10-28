// Component for deleting a track from a playlist
// rough for now, to be improved later

"use client";

import { Button } from "@mui/material";
import { useTestingContext } from "@/context/testing-context";
import axios from "axios"; // library for making API requests easily -> https://axios-http.com/docs/intro

export const DeleteTrackFromPlaylistButton = () => {
  const { testTrack, testPlaylistID, userID } = useTestingContext();

  async function handleDeleteTrackFromPlaylist(trackID, playlistID) {
    try {
      const response = await axios.delete(
        `/api/users/${userID}/playlists/${playlistID}/${trackID}/`
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete track from playlist");
      }

      return response.data;
    } catch (error) {
      console.error("Error deleting track from playlist:", error);
      throw error;
    }
  }
  return (
    <Button
      onClick={async () => {
        const trackID = testTrack.id; // Get the track ID from your state or props
        const playlistID = testPlaylistID; // Get the playlist ID from your state or props
        await handleDeleteTrackFromPlaylist(trackID, playlistID);
      }}
    >
      Delete Track From Playlist
    </Button>
  );
};
