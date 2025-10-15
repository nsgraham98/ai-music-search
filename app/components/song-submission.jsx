// Song Submission Component
// Allows users to search for and submit songs for a game round

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
  CardActions,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [error, setError] = useState("");
  const [playingTrack, setPlayingTrack] = useState(null);

  // Search for songs using Jamendo API
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError("");

    try {
      const response = await fetch("/api/jamendo/jamendo-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchArgsObj: {
            tags: [searchQuery],
            speed: [],
            tags_fuzzy: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to search songs");
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search for songs. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle song selection
  const handleSelectSong = (song) => {
    setSelectedSong(song);
    setPlayingTrack(null); // Stop any playing audio
  };

  // Submit the selected song
  const handleSubmitSong = async () => {
    if (!selectedSong || !user) return;

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
              id: selectedSong.id,
              name: selectedSong.name,
              artist_name: selectedSong.artist_name,
              album_name: selectedSong.album_name,
              duration: selectedSong.duration,
              audio: selectedSong.audio,
              image: selectedSong.image,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit song");
      }

      // Call success callback
      if (onSubmissionSuccess) {
        onSubmissionSuccess(selectedSong);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message || "Failed to submit song. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle audio play/pause
  const handlePlayPause = (track) => {
    if (playingTrack?.id === track.id) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(track);
    }
  };

  // Format duration from seconds to mm:ss
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
            <Typography variant="body2" color="#ccc">
              {currentSubmission.album_name} •{" "}
              {formatDuration(currentSubmission.duration)}
            </Typography>
          </CardContent>
        </Card>
        <Button
          variant="outlined"
          sx={{ mt: 2, borderColor: "white", color: "white" }}
          onClick={() => setSelectedSong(null)}
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

      {/* Search Interface */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for songs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          disabled={disabled || isSearching}
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
          }}
        />
        <Button
          variant="outlined"
          onClick={handleSearch}
          disabled={disabled || isSearching || !searchQuery.trim()}
          sx={{
            borderColor: "white",
            color: "white",
            minWidth: "100px",
            "&:hover": {
              borderColor: "#4caf50",
              backgroundColor: "#4caf50",
            },
          }}
        >
          {isSearching ? <CircularProgress size={24} /> : "Search"}
        </Button>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Selected Song */}
      {selectedSong && (
        <Box mb={3}>
          <Typography variant="h6" color="#4caf50" gutterBottom>
            Selected Song:
          </Typography>
          <Card sx={{ bgcolor: "#3e3d3d", color: "white" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedSong.name}
              </Typography>
              <Typography variant="body2" color="#ccc">
                by {selectedSong.artist_name}
              </Typography>
              <Typography variant="body2" color="#ccc">
                {selectedSong.album_name} •{" "}
                {formatDuration(selectedSong.duration)}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={handleSubmitSong}
                disabled={isSubmitting}
                sx={{ color: "#4caf50" }}
              >
                {isSubmitting ? (
                  <CircularProgress size={20} />
                ) : (
                  "Submit This Song"
                )}
              </Button>
              <Button
                size="small"
                onClick={() => setSelectedSong(null)}
                sx={{ color: "#ccc" }}
              >
                Cancel
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Search Results:
          </Typography>
          <Box maxHeight="400px" overflow="auto">
            {searchResults.map((track) => (
              <Card
                key={track.id}
                sx={{
                  bgcolor: "#3e3d3d",
                  color: "white",
                  mb: 2,
                  cursor: selectedSong?.id === track.id ? "default" : "pointer",
                  border:
                    selectedSong?.id === track.id
                      ? "2px solid #4caf50"
                      : "none",
                }}
                onClick={() => !selectedSong && handleSelectSong(track)}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box flex={1}>
                      <Typography variant="subtitle1" gutterBottom>
                        {track.name}
                      </Typography>
                      <Typography variant="body2" color="#ccc">
                        by {track.artist_name}
                      </Typography>
                      <Typography variant="body2" color="#ccc">
                        {track.album_name} • {formatDuration(track.duration)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      {track.audio && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPause(track);
                          }}
                          sx={{ color: "white" }}
                        >
                          {playingTrack?.id === track.id ? (
                            <PauseIcon />
                          ) : (
                            <PlayIcon />
                          )}
                        </IconButton>
                      )}
                      {selectedSong?.id === track.id && (
                        <Chip
                          label="Selected"
                          size="small"
                          sx={{ bgcolor: "#4caf50", color: "white" }}
                        />
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* No results message */}
      {searchResults.length === 0 && searchQuery && !isSearching && (
        <Typography variant="body2" color="#ccc" textAlign="center" py={3}>
          No songs found. Try different search terms.
        </Typography>
      )}
    </Paper>
  );
}
