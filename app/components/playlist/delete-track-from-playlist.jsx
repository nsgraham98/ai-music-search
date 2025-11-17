// Component for deleting a track from a playlist
// rough for now, to be improved later

"use client";

import { Button } from "@mui/material";
import axios from "axios"; // library for making API requests easily -> https://axios-http.com/docs/intro
import { useUserProfile } from "@/context/user-profile-context";
import { useState } from "react";

export const DeleteTrackFromPlaylistButton = ({ trackId }) => {
  const { userProfile } = useUserProfile();
  const [showPlaylistsPopup, setShowPlaylistsPopup] = useState(false);

  async function handleDeleteTrackFromPlaylist(trackID, playlistID) {
    try {
      const response = await axios.delete(
        `/api/users/${userProfile.uid}/playlists/${playlistID}/${trackID}/`
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
    <>
      <Button
        onClick={async () => {
          setShowPlaylistsPopup(!showPlaylistsPopup);
        }}
      >
        Delete from Playlist
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
                  await handleDeleteTrackFromPlaylist(trackId, id);
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
