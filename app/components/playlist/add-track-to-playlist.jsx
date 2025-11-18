// add-track-to-playlist.jsx
"use client";

import { Button } from "@mui/material";
import axios from "axios";
import { useUserProfile } from "@/context/user-profile-context";
import { useState } from "react";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { PlaylistsPopup } from "./playlists-popup";

export const AddTrackToPlaylistButton = ({ trackId }) => {
  const { userProfile } = useUserProfile();
  const [open, setOpen] = useState(false);

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

  const handleSelectPlaylist = async (playlistId) => {
    await handleAddTrackToPlaylist(trackId, playlistId);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen((prev) => !prev)}>
        <PlaylistAddIcon sx={{ color: "white" }} />
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
