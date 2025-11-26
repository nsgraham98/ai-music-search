// add-track-to-playlist.jsx
"use client";

import { Button, Typography } from "@mui/material";
import axios from "axios";
import { useUserProfile } from "@/context/user-profile-context";
import { useState } from "react";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistsPopup from "./playlists-popup";
import SnackbarComponent from "@/app/components/snackbar.jsx";

export const AddTrackToPlaylistButton = ({ trackId }) => {
  const { userProfile } = useUserProfile();
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  async function handleAddTrackToPlaylist(trackID, playlistID) {
    try {
      const response = await axios.patch(
        `/api/users/${userProfile.uid}/playlists/${playlistID}/${trackID}/`
      );

      if (response.status !== 200) {
        throw new Error("Failed to add track to playlist");
      }

      setSnackbar({
        open: true,
        message: "Track added to playlist!",
        severity: "success",
      });
      return response.data;
    } catch (error) {
      console.error("Error adding track to playlist:", error);
      setSnackbar({
        open: true,
        message: "Failed to add track to playlist.",
        severity: "error",
      });
      throw error;
    }
  }

  const handleSelectPlaylist = async (playlistId) => {
    await handleAddTrackToPlaylist(trackId, playlistId);
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: "0.8rem", color: "white", mr: 0.5 }}
        >
          Add to Playlist
        </Typography>
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
      <SnackbarComponent
        message={snackbar.message}
        severity={snackbar.severity}
        open={snackbar.open}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </>
  );
};
