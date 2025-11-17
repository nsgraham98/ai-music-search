// Component for adding a track to a playlist
// rough for now, to be improved later

"use client";

import { Button } from "@mui/material";
import axios from "axios"; // library for making API requests easily -> https://axios-http.com/docs/intro
import { useUserProfile } from "@/context/user-profile-context";
import { useState } from "react";

// Button that adds a track to a playlist
// takes the Track ID as prop
// includes popup to select which playlist to add to
export const AddTrackToPlaylistButton = ({ trackId }) => {
  const { userProfile } = useUserProfile();
  const [showPlaylistsPopup, setShowPlaylistsPopup] = useState(false);

  async function handleAddTrackToPlaylist(trackID, playlistID) {
    try {
      const response = await axios.patch(
        `/api/users/${userProfile.uid}/playlists/${playlistID}/${trackID}/`
      );

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
    <>
      <Button
        onClick={async () => {
          setShowPlaylistsPopup(!showPlaylistsPopup);
        }}
      >
        Add to Playlist
      </Button>

      {/* Show popup list of playlists to add to */}
      {showPlaylistsPopup && (
        <div
          style={{ position: "absolute", background: "white", zIndex: 1000 }}
        >
          {Object.entries(userProfile.playlists).map(([id, name]) => (
            <div key={id}>
              <Button
                onClick={async () => {
                  await handleAddTrackToPlaylist(trackId, id);
                  setShowPlaylistsPopup(!showPlaylistsPopup);
                }}
              >
                {name}
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
