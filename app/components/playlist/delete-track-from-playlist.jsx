// Component for deleting a track from a playlist
// rough for now, to be improved later

"use client";

import { Button, Typography } from "@mui/material";
import axios from "axios"; // library for making API requests easily -> https://axios-http.com/docs/intro
import { useUserProfile } from "@/context/user-profile-context";
import { useState } from "react";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import PlaylistsPopup from "./playlists-popup";
import SnackbarComponent from "@/app/components/snackbar.jsx";

export const DeleteTrackFromPlaylistButton = ({ trackId, playlistId }) => {
  const { userProfile } = useUserProfile();
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  async function handleDeleteTrackFromPlaylist(trackID, playlistID) {
    try {
      const response = await axios.delete(
        `/api/users/${userProfile.uid}/playlists/${playlistID}/${trackID}/`
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete track from playlist");
      }

      setSnackbar({
        open: true,
        message: "Track removed from playlist!",
        severity: "success",
      });
      return response.data;
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error. Track was not removed from playlist",
        severity: "error",
      });
      console.error("Error deleting track from playlist:", error);
      throw error;
    }
  }

  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
          handleDeleteTrackFromPlaylist(trackId, playlistId);
        }}
      >
        <Typography sx={{ fontSize: "0.8rem", color: "white", mr: 0.5 }}>
          Remove from Playlist
        </Typography>
        <PlaylistRemoveIcon sx={{ color: "white" }} />
      </Button>
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
