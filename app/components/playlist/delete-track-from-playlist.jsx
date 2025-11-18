// Component for deleting a track from a playlist
// rough for now, to be improved later

"use client";

import { Button } from "@mui/material";
import axios from "axios"; // library for making API requests easily -> https://axios-http.com/docs/intro
import { useUserProfile } from "@/context/user-profile-context";
import { useState } from "react";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { PlaylistsPopup } from "./playlists-popup";

export const DeleteTrackFromPlaylistButton = ({ trackId }) => {
  const { userProfile } = useUserProfile();
  const [open, setOpen] = useState(false);

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
  const handleSelectPlaylist = async (playlistId) => {
    await handleDeleteTrackFromPlaylist(trackId, playlistId);
    setOpen(false);
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlaylistRemoveIcon sx={{ color: "white" }} />
      </Button>

      <PlaylistsPopup
        open={open}
        playlists={userProfile?.playlists || {}}
        onSelectPlaylist={handleSelectPlaylist}
        onClose={() => setOpen(false)}
        // optional: control placement
        style={{ top: "2.5rem", right: 0 }}
      />
    </>
  );
};
