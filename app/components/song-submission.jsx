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
import {
  isValidSoundCloudUrl,
  getSoundCloudTrackInfo,
  parseSoundCloudTrackData,
} from "@/lib/soundcloud-utils";
import SoundCloudPlayer from "./soundcloud-player";

export default function SongSubmissionInterface({
  gameId,
  roundId,
  theme,
  onSubmissionSuccess,
  disabled = false,
  currentSubmission = null,
}) {
  const { authUser } = useUserAuth();
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [songArgument, setSongArgument] = useState("");
  const [soundcloudUrl, setSoundcloudUrl] = useState("");
  const [isFetchingTrackInfo, setIsFetchingTrackInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Handle SoundCloud URL input and fetch track info
  const handleSoundCloudUrlChange = async (url) => {
    setSoundcloudUrl(url);
    setError("");

    // Only fetch if it's a valid URL
    if (url.trim() && isValidSoundCloudUrl(url)) {
      setIsFetchingTrackInfo(true);
      try {
        const trackInfo = await getSoundCloudTrackInfo(url);
        if (trackInfo.success) {
          const { title, artist } = parseSoundCloudTrackData(trackInfo);
          // Auto-fill the song and artist fields
          setSongName(title);
          setArtistName(artist);
        } else {
          setError(trackInfo.error || "Could not fetch track information");
        }
      } catch (err) {
        console.error("Error fetching track info:", err);
        setError("Failed to fetch track information from SoundCloud");
      } finally {
        setIsFetchingTrackInfo(false);
      }
    }
  };

  // Submit the song
  const handleSubmitSong = async () => {
    if (!songName.trim() || !artistName.trim() || !authUser) {
      setError("Song name and artist name are required");
      return;
    }

    if (!songArgument.trim()) {
      setError("Please write a case for your song choice");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/games/${gameId}/rounds/${roundId}/submit`,
        {
          method: "POST",
          credentials: "include", // Include cookies for authentication
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            song: {
              id: `manual_${Date.now()}`, // Generate a simple ID
              name: songName.trim(),
              artist_name: artistName.trim(),
              argument: songArgument.trim(), // User's case for the song
              soundcloud_url: soundcloudUrl.trim() || null, // Optional SoundCloud URL
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
      setSongArgument("");
      setSoundcloudUrl("");

      // Call success callback
      if (onSubmissionSuccess) {
        onSubmissionSuccess({
          name: songName.trim(),
          artist_name: artistName.trim(),
          argument: songArgument.trim(),
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
          Your song has been locked in for this round. You can now vote on other
          submissions!
        </Typography>
        <Card sx={{ bgcolor: "#3e3d3d", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {currentSubmission.name}
            </Typography>
            <Typography variant="body2" color="#ccc" mb={2}>
              by {currentSubmission.artist_name}
            </Typography>

            {/* SoundCloud Player */}
            {currentSubmission.soundcloud_url && (
              <Box mb={2}>
                <SoundCloudPlayer url={currentSubmission.soundcloud_url} />
              </Box>
            )}

            {currentSubmission.argument && (
              <Box mt={2} p={2} sx={{ bgcolor: "#2e2d2d", borderRadius: 1 }}>
                <Typography variant="body2" color="#aaa" mb={1}>
                  Your Case:
                </Typography>
                <Typography variant="body2" color="#ddd">
                  {currentSubmission.argument}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
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
        {/* SoundCloud URL Field */}
        <Box>
          <TextField
            fullWidth
            label="SoundCloud URL (Optional)"
            variant="outlined"
            placeholder="https://soundcloud.com/artist/track"
            value={soundcloudUrl}
            onChange={(e) => handleSoundCloudUrlChange(e.target.value)}
            disabled={disabled || isSubmitting || isFetchingTrackInfo}
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
                  borderColor: "#E03FD8",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#ccc",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#E03FD8",
              },
            }}
          />
          {isFetchingTrackInfo && (
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <CircularProgress size={16} sx={{ color: "#E03FD8" }} />
              <Typography variant="caption" color="#ccc">
                Fetching track information...
              </Typography>
            </Box>
          )}
          {soundcloudUrl && !isFetchingTrackInfo && (
            <Typography variant="caption" color="#999" display="block" mt={1}>
              {isValidSoundCloudUrl(soundcloudUrl)
                ? "✓ Valid SoundCloud URL - Song info will auto-fill"
                : "⚠ Enter a valid SoundCloud track URL"}
            </Typography>
          )}
        </Box>

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
                borderColor: "#E03FD8",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#ccc",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#E03FD8",
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
                borderColor: "#E03FD8",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#ccc",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#E03FD8",
            },
          }}
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Why This Song? *"
          variant="outlined"
          placeholder="Explain why this song fits the theme..."
          value={songArgument}
          onChange={(e) => setSongArgument(e.target.value)}
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
                borderColor: "#E03FD8",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#ccc",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#E03FD8",
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleSubmitSong}
          disabled={
            disabled ||
            isSubmitting ||
            !songName.trim() ||
            !artistName.trim() ||
            !songArgument.trim()
          }
          sx={{
            bgcolor: "#E03FD8",
            color: "white",
            textTransform: "uppercase",
            fontWeight: "bold",
            transition: "all 0.2s",
            boxShadow: "0 4px 12px rgba(224, 63, 216, 0.3)",
            "&:hover": {
              bgcolor: "#c133b9",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 16px rgba(224, 63, 216, 0.5)",
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
