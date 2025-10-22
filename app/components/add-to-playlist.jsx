// Component for adding a track to a playlist
// rough for now, to be improved later

"use client";

import { Button } from "@mui/material";

async function handleAddToPlaylist(trackID, playlistID) {
  try {
    const response = await fetch(`/api/playlist/${playlistID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trackID, playlistID }),
    });

    if (!response.ok) {
      throw new Error("Failed to add track to playlist");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding track to playlist:", error);
    throw error;
  }
}

export const AddToPlaylistButton = () => {
  return (
    <Button
      onClick={async () => {
        const token = ""; // Get the token from your auth context or state
        const trackID = ""; // Get the track ID from your state or props
        const playlistID = ""; // Get the playlist ID from your state or props
        await handleAddToPlaylist(trackID, playlistID, token);
      }}
    >
      Add to Playlist
    </Button>
  );
};
