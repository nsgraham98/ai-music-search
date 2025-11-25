"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserAuth } from "@/context/auth-context";
import {
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { TrackList } from "@/app/components/audio/track-list.jsx";
import { useParams } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";

export default function PlaylistPage() {
  const params = useParams();
  const playlistID = params.playlistID;
  const { authUser } = useUserAuth();
  const [playlistInfo, setPlaylistInfo] = useState({});
  const [loadingMessage, setLoadingMessage] = useState("Loading playlist...");
  const [playlists, setPlaylists] = useState([]);
  const [dialog, setDialog] = useState({
    open: false,
    type: "",
    playlistInfo: null,
  });
  const [form, setForm] = useState({
    name: "",
    description: "",
    public: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  // Update playlist
  const handleEditPlaylist = async () => {
    if (!form.name.trim()) {
      showSnackbar("Please enter a playlist name", "error");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.patch(
        `/api/users/${authUser.uid}/playlists/${dialog.playlistInfo.id}`,
        {
          name: form.name,
          description: form.description,
          public: form.public,
        }
      );

      setDialog({ open: false, type: "", playlistInfo: null });
      setForm({ name: "", description: "", public: false });
      showSnackbar("Playlist updated successfully!", "success");
    } catch (error) {
      console.error("Error updating playlist:", error);
      showSnackbar("Failed to update playlist", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete playlist
  const handleDeletePlaylist = async () => {
    try {
      setSubmitting(true);
      await axios.delete(
        `/api/users/${authUser.uid}/playlists/${dialog.playlistInfo.id}`
      );

      setDialog({ open: false, type: "", playlistInfo: null });
      showSnackbar("Playlist deleted successfully!", "success");
      router.push(`/user/${authUser.uid}/playlists`);
    } catch (error) {
      console.error("Error deleting playlist:", error);
      showSnackbar("Failed to delete playlist", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (dialog.type === "edit") {
      handleEditPlaylist();
    } else if (dialog.type === "delete") {
      handleDeletePlaylist();
    }
  };

  // Open dialog
  const openDialog = (type, playlistInfo = null) => {
    setDialog({ open: true, type, playlistInfo });
    if (type === "edit") {
      setForm({
        name: playlistInfo.name,
        description: playlistInfo.description || "",
        public: playlistInfo.public || false,
      });
    } else {
      setForm({ name: "", description: "", public: false });
    }
  };

  // Show snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    // Fetch playlist data using playlistID
    async function fetchPlaylistRich() {
      try {
        const firebaseResponse = await axios.get(
          `/api/users/${authUser.uid}/playlists/${playlistID}`
        );
        console.log("Fetched playlist:", firebaseResponse.data);
        const trackIds = firebaseResponse.data.playlist.tracks;
        if (!trackIds || trackIds.length === 0) {
          setPlaylistInfo({
            id: firebaseResponse.data.playlist.id,
            userID: firebaseResponse.data.playlist.userID,
            name: firebaseResponse.data.playlist.name,
            public: firebaseResponse.data.playlist.public,
            description: firebaseResponse.data.playlist.description,
            timeCreated: firebaseResponse.data.playlist.timeCreated,
            tracks: [],
          });
          setLoadingMessage("No tracks found in this playlist.");
          return; // Exit early if no tracks
        }
        const jamendoResponse = await axios.get(
          `/api/jamendo/${trackIds.join("/")}`
        );
        console.log("Fetched tracks from Jamendo:", jamendoResponse.data);
        setPlaylistInfo({
          id: firebaseResponse.data.playlist.id,
          userID: firebaseResponse.data.playlist.userID,
          name: firebaseResponse.data.playlist.name,
          public: firebaseResponse.data.playlist.public,
          description: firebaseResponse.data.playlist.description,
          timeCreated: firebaseResponse.data.playlist.timeCreated,
          timeUpdated: firebaseResponse.data.playlist.timeUpdated,
          tracks: jamendoResponse.data.results,
        });
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    }
    fetchPlaylistRich();
  }, [authUser?.uid, playlistID]);

  return (
    <>
      <Box>
        {/* Playlist Title, Description, Edit and Delete Buttons */}
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          {/* Playlist Title */}
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            {playlistInfo.name || "Loading playlist..."}
          </Typography>
          {/* Edit and Delete Buttons */}
          <Box display="flex" gap={0.5} onClick={(e) => e.stopPropagation()}>
            <IconButton
              size="small"
              onClick={() => openDialog("edit", playlistInfo)}
              sx={{
                mb: 1.5,
                color: "#888",
                "&:hover": { color: "#E03FD8", bgcolor: "#3a3a3a" },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => openDialog("delete", playlistInfo)}
              sx={{
                color: "#888",
                mb: 1.5,
                "&:hover": { color: "#ff6b6b", bgcolor: "#3a3a3a" },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        {/* Playlist Description */}
        <Typography
          variant="subtitle1"
          align="center"
          gutterBottom
          sx={{ mb: 4, color: "white" }}
        >
          {playlistInfo.description || ""}
        </Typography>
      </Box>

      {/* Tracks List */}
      <Box
        component={Paper}
        elevation={4}
        sx={{
          bgcolor: "#2e2d2d",
          color: "white",
          width: "100%",
          maxWidth: "100%",
          height: "100%",
          minHeight: "100%",
          mx: "auto",
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {!playlistInfo.id || playlistInfo.tracks.length === 0 ? (
            <Paper
              elevation={3}
              sx={{
                bgcolor: "#4c4848",
                color: "white",
                overflowY: "auto",
                borderRadius: 2,
                width: "100%", // add this
                maxWidth: 900, // adjust this width to make it wider
                mx: "auto", // optional: centers it horizontally
              }}
            >
              <Typography
                variant="body1"
                color="white"
                textAlign="center"
                p={2}
              >
                {loadingMessage}
              </Typography>
            </Paper>
          ) : (
            <TrackList
              variant="playlist"
              tracks={playlistInfo.tracks}
              playlistId={playlistInfo.id}
              showDownload={true}
              showAddButton={false}
              showDeleteButton={true}
              clearOnUnmount={true}
            />
          )}
        </Box>
      </Box>

      {/* Create/Edit Dialog */}
      <Dialog
        open={dialog.open && dialog.type !== "delete"}
        onClose={() => setDialog({ ...dialog, open: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: "#2e2d2d", border: "1px solid #444" } }}
      >
        <DialogTitle sx={{ color: "white", fontWeight: "bold" }}>
          {dialog.type === "edit" ? "Edit Playlist" : "Create Playlist"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#888" },
                "&.Mui-focused fieldset": { borderColor: "#E03FD8" },
              },
              "& .MuiInputLabel-root": { color: "#888" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#E03FD8" },
            }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#888" },
                "&.Mui-focused fieldset": { borderColor: "#E03FD8" },
              },
              "& .MuiInputLabel-root": { color: "#888" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#E03FD8" },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDialog({ ...dialog, open: false })}
            sx={{ color: "#888" }}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{ bgcolor: "#E03FD8", "&:hover": { bgcolor: "#c133b9" } }}
          >
            {submitting ? (
              <CircularProgress size={20} />
            ) : dialog.type === "edit" ? (
              "Save"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialog.open && dialog.type === "delete"}
        onClose={() => setDialog({ ...dialog, open: false })}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { bgcolor: "#2e2d2d", border: "1px solid #444" } }}
      >
        <DialogTitle sx={{ color: "white", fontWeight: "bold" }}>
          Delete Playlist?
        </DialogTitle>
        <DialogContent>
          <Typography color="#888">
            Are you sure you want to delete "{dialog.playlistInfo?.name}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDialog({ ...dialog, open: false })}
            sx={{ color: "#888" }}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{ bgcolor: "#d32f2f", "&:hover": { bgcolor: "#b71c1c" } }}
          >
            {submitting ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
