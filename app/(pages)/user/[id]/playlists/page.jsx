"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Card,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { useUserAuth } from "@/context/auth-context";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PlaylistsPage() {
  const { authUser } = useUserAuth();
  const router = useRouter();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({
    open: false,
    type: "",
    playlist: null,
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

  // Fetch all playlists for the user
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/users/${authUser.uid}/playlists`
        );
        setPlaylists(response.data.playlists || []);
      } catch (error) {
        console.error("Error fetching playlists:", error);
        showSnackbar("Failed to load playlists", "error");
      } finally {
        setLoading(false);
      }
    };
    if (authUser?.uid) {
      fetchPlaylists();
    }
  }, [authUser?.uid]);

  // Create new playlist
  const handleCreatePlaylist = async () => {
    if (!form.name.trim()) {
      showSnackbar("Please enter a playlist name", "error");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `/api/users/${authUser.uid}/playlists`,
        {
          name: form.name,
          description: form.description,
          public: form.public,
        }
      );
      const newPlaylist = response.data;

      setPlaylists([...playlists, newPlaylist]);
      setDialog({ open: false, type: "", playlist: null });
      setForm({ name: "", description: "", public: false });
      showSnackbar("Playlist created successfully!", "success");
    } catch (error) {
      console.error("Error creating playlist:", error);
      showSnackbar("Failed to create playlist", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Update playlist
  const handleEditPlaylist = async () => {
    if (!form.name.trim()) {
      showSnackbar("Please enter a playlist name", "error");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.patch(
        `/api/users/${authUser.uid}/playlists/${dialog.playlist.id}`,
        {
          name: form.name,
          description: form.description,
          public: form.public,
        }
      );

      setPlaylists(
        playlists?.map((p) => (p.id === dialog.playlist.id ? response.data : p))
      );
      setDialog({ open: false, type: "", playlist: null });
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
        `/api/users/${authUser.uid}/playlists/${dialog.playlist.id}`
      );

      setPlaylists(playlists.filter((p) => p.id !== dialog.playlist.id));
      setDialog({ open: false, type: "", playlist: null });
      showSnackbar("Playlist deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      showSnackbar("Failed to delete playlist", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (dialog.type === "create") {
      handleCreatePlaylist();
    } else if (dialog.type === "edit") {
      handleEditPlaylist();
    } else if (dialog.type === "delete") {
      handleDeletePlaylist();
    }
  };

  // Open dialog
  const openDialog = (type, playlist = null) => {
    setDialog({ open: true, type, playlist });
    if (type === "edit") {
      setForm({
        name: playlist.name,
        description: playlist.description || "",
        public: playlist.public || false,
      });
    } else {
      setForm({ name: "", description: "", public: false });
    }
  };

  // Show snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Navigate to playlist detail page
  const handlePlaylistClick = (playlist) => {
    router.push(`/user/${authUser.uid}/playlists/${playlist.id}`);
  };

  // if (!authUser) {
  //   return (
  //     <Container maxWidth="lg">
  //       <LoginPopup />
  //       <ColorblindFilters />
  //     </Container>
  //   );
  // }

  return (
    <>
      {/* My Playlists + Create Button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          My Playlists
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openDialog("create")}
          sx={{
            bgcolor: "#E03FD8",
            "&:hover": { bgcolor: "#c133b9" },
            fontWeight: "bold",
          }}
        >
          Create
        </Button>
      </Box>

      {/* Loading State */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress sx={{ color: "#E03FD8" }} />
        </Box>
      ) : playlists.length === 0 ? (
        /* Empty State */
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "#2e2d2d",
            border: "1px solid #444",
            borderRadius: 2,
          }}
        >
          <MusicNoteIcon sx={{ fontSize: 60, color: "#666", mb: 2 }} />
          <Typography color="#888" mb={2}>
            No playlists yet
          </Typography>
          <Typography variant="body2" color="#666" mb={3}>
            Create your first playlist to organize your favorite tracks
          </Typography>
          <Button
            variant="contained"
            onClick={() => openDialog("create")}
            sx={{ bgcolor: "#E03FD8", "&:hover": { bgcolor: "#c133b9" } }}
          >
            Create First Playlist
          </Button>
        </Box>
      ) : (
        /* Playlists Grid */
        <Grid container spacing={2}>
          {playlists.map((playlist) => (
            <Grid item xs={12} sm={6} md={4} key={playlist.id}>
              <Card
                sx={{
                  bgcolor: "#2e2d2d",
                  border: "1px solid #444",
                  p: 2,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "#E03FD8",
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => handlePlaylistClick(playlist)}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <MusicNoteIcon sx={{ color: "#E03FD8", fontSize: 20 }} />
                  <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    noWrap
                    color="white"
                  >
                    {playlist.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="#888" mb={1}>
                  {playlist.description || "No description"}
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="caption" color="#666">
                    {playlist.tracks.length || 0} tracks
                  </Typography>
                  <Box
                    display="flex"
                    gap={0.5}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconButton
                      size="small"
                      onClick={() => openDialog("edit", playlist)}
                      sx={{
                        color: "#888",
                        "&:hover": { color: "#E03FD8", bgcolor: "#3a3a3a" },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openDialog("delete", playlist)}
                      sx={{
                        color: "#888",
                        "&:hover": { color: "#ff6b6b", bgcolor: "#3a3a3a" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
            Are you sure you want to delete "{dialog.playlist?.name}"? This
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            bgcolor: snackbar.severity === "success" ? "#1a3d1a" : "#3d1a1a",
            color: snackbar.severity === "success" ? "#69ff6b" : "#ff6b6b",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
