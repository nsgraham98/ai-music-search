// Song Submission Component
// Allows users to manually enter and submit songs for a game round

"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CheckCircle as CheckIcon } from "@mui/icons-material";
import { useUserAuth } from "@/context/auth-context";

export default function SongSubmissionInterface({
  gameId,
  roundId,
  theme,
  onSubmissionSuccess,
  disabled = false,
  currentSubmission = null,
}) {
  const { user } = useUserAuth();
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Submit the song
  const handleSubmitSong = async () => {
    if (!songName.trim() || !artistName.trim() || !user) {
      setError("Song name and artist name are required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const token = await user.getIdToken();

      const response = await fetch(
        `/api/games/${gameId}/rounds/${roundId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            song: {
              id: `manual_${Date.now()}`, // Generate a simple ID
              name: songName.trim(),
              artist_name: artistName.trim(),
              album_name: albumName.trim() || "Unknown Album",
              duration: 0, // No duration for manual entries
              audio: null,
              image: null,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit song");
      }

      // Clear form
      setSongName("");
      setArtistName("");
      setAlbumName("");

      // Call success callback
      if (onSubmissionSuccess) {
        onSubmissionSuccess({
          name: songName.trim(),
          artist_name: artistName.trim(),
          album_name: albumName.trim() || "Unknown Album",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message || "Failed to submit song. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user has already submitted
  if (currentSubmission) {
    return (
      <Paper sx={{ bgcolor: "#2e2d2d", color: "white", p: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <CheckIcon sx={{ color: "#4caf50" }} />
          <Typography variant="h6">Song Submitted!</Typography>
        </Box>
        <Typography variant="body2" color="#ccc" mb={2}>
          You've submitted your song for this round. You can change your
          submission until the deadline.
        </Typography>
        <Card sx={{ bgcolor: "#3e3d3d", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {currentSubmission.name}
            </Typography>
            <Typography variant="body2" color="#ccc">
              by {currentSubmission.artist_name}
            </Typography>
            {currentSubmission.album_name &&
              currentSubmission.album_name !== "Unknown Album" && (
                <Typography variant="body2" color="#ccc">
                  {currentSubmission.album_name}
                </Typography>
              )}
          </CardContent>
        </Card>
        <Button
          variant="outlined"
          sx={{ mt: 2, borderColor: "white", color: "white" }}
          onClick={() => {
            // Reset to allow changing submission
            // This will hide the "already submitted" view
          }}
        >
          Change Submission
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ bgcolor: "#2e2d2d", color: "white", p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Submit Your Song
      </Typography>
      <Typography variant="body2" color="#ccc" mb={3}>
        Theme: <strong>{theme}</strong>
      </Typography>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Manual Entry Form */}
      <Box component="form" display="flex" flexDirection="column" gap={2}>
        <TextField
          fullWidth
          label="Song Name *"
          variant="outlined"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          disabled={disabled || isSubmitting}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": {
                borderColor: "#555",
              },
              "&:hover fieldset": {
                borderColor: "#777",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#4caf50",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#ccc",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#4caf50",
            },
          }}
        />

        <TextField
          fullWidth
          label="Artist Name *"
          variant="outlined"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          disabled={disabled || isSubmitting}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": {
                borderColor: "#555",
              },
              "&:hover fieldset": {
                borderColor: "#777",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#4caf50",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#ccc",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#4caf50",
            },
          }}
        />

        <TextField
          fullWidth
          label="Album Name (Optional)"
          variant="outlined"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
          disabled={disabled || isSubmitting}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": {
                borderColor: "#555",
              },
              "&:hover fieldset": {
                borderColor: "#777",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#4caf50",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#ccc",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#4caf50",
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleSubmitSong}
          disabled={
            disabled || isSubmitting || !songName.trim() || !artistName.trim()
          }
          sx={{
            bgcolor: "#4caf50",
            color: "white",
            textTransform: "uppercase",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "#45a049",
            },
            "&:disabled": {
              bgcolor: "#555",
              color: "#999",
            },
          }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Submit Song"}
        </Button>
      </Box>

      <Typography variant="caption" color="#999" mt={2} display="block">
        * Required fields
      </Typography>
    </Paper>
  );
}
