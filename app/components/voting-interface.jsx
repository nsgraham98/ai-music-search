// Voting Interface Component
// Allows users to allocate votes to submitted songs

"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Card,
  CardContent,
  Slider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { CheckCircle as CheckIcon } from "@mui/icons-material";
import { useUserAuth } from "@/context/auth-context";

export default function VotingInterface({
  gameId,
  roundId,
  theme,
  submissions,
  currentUserId,
  hasVoted = false,
  onVoteSuccess,
}) {
  const { authUser } = useUserAuth();
  const [votes, setVotes] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const MAX_VOTES = 5;

  // Initialize votes state
  useEffect(() => {
    if (submissions) {
      const initialVotes = {};
      Object.keys(submissions).forEach((userId) => {
        if (userId !== currentUserId) {
          initialVotes[userId] = 0;
        }
      });
      setVotes(initialVotes);
    }
  }, [submissions, currentUserId]);

  // Calculate total votes allocated
  const totalVotesAllocated = Object.values(votes).reduce(
    (sum, count) => sum + count,
    0
  );

  // Handle vote allocation
  const handleVoteChange = (userId, newValue) => {
    const currentVote = votes[userId] || 0;
    const difference = newValue - currentVote;

    // Check if this would exceed max votes
    if (totalVotesAllocated + difference > MAX_VOTES) {
      return;
    }

    setVotes({
      ...votes,
      [userId]: newValue,
    });
  };

  // Submit votes
  const handleSubmitVotes = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/games/${gameId}/rounds/${roundId}/vote`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            votes: votes,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit votes");
      }

      // Close dialog and notify success
      setConfirmDialogOpen(false);
      if (onVoteSuccess) {
        onVoteSuccess();
      }
    } catch (error) {
      console.error("Voting error:", error);
      setError(error.message || "Failed to submit votes. Please try again.");
      setConfirmDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user has already voted
  if (hasVoted) {
    return (
      <Paper sx={{ bgcolor: "#2e2d2d", color: "white", p: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <CheckIcon sx={{ color: "#4caf50" }} />
          <Typography variant="h6">Votes Submitted!</Typography>
        </Box>
        <Typography variant="body2" color="#ccc" mb={3}>
          Your votes have been locked in. Waiting for other players to finish
          voting...
        </Typography>

        {/* Show all submissions (anonymous) */}
        <Typography variant="h6" mb={2}>
          All Submissions for "{theme}":
        </Typography>
        {Object.entries(submissions || {}).map(
          ([userId, submission], index) => (
            <Card
              key={userId}
              sx={{
                mb: 2,
                bgcolor: "#3e3d3d",
                color: "white",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {index + 1}. {submission.song.name}
                </Typography>
                <Typography variant="body2" color="#ccc" mb={2}>
                  by {submission.song.artist_name}
                </Typography>
                {submission.song.argument && (
                  <Box
                    mt={2}
                    p={2}
                    sx={{ bgcolor: "#2e2d2d", borderRadius: 1 }}
                  >
                    <Typography variant="body2" color="#aaa" mb={1}>
                      Their Case:
                    </Typography>
                    <Typography variant="body2" color="#ddd">
                      {submission.song.argument}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )
        )}
      </Paper>
    );
  }

  // Get submissions excluding current user's
  const votableSubmissions = Object.entries(submissions || {}).filter(
    ([userId]) => userId !== currentUserId
  );

  if (votableSubmissions.length === 0) {
    return (
      <Paper sx={{ bgcolor: "#2e2d2d", color: "white", p: 3 }}>
        <Typography variant="h6" gutterBottom>
          No Other Submissions Yet
        </Typography>
        <Typography variant="body2" color="#ccc">
          Waiting for other players to submit their songs...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ bgcolor: "#2e2d2d", color: "white", p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Vote on Submissions
      </Typography>
      <Typography variant="body2" color="#ccc" mb={1}>
        Theme: <strong>{theme}</strong>
      </Typography>
      <Typography variant="body2" color="#ccc" mb={3}>
        You have {MAX_VOTES - totalVotesAllocated} of {MAX_VOTES} votes
        remaining. Allocate them to your favorite submissions!
      </Typography>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Voting Cards */}
      {votableSubmissions.map(([userId, submission], index) => (
        <Card
          key={userId}
          sx={{
            mb: 3,
            bgcolor: "#3e3d3d",
            color: "white",
            border: votes[userId] > 0 ? "2px solid #4caf50" : "none",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {index + 1}. {submission.song.name}
            </Typography>
            <Typography variant="body2" color="#ccc" mb={2}>
              by {submission.song.artist_name}
            </Typography>

            {/* Song Argument */}
            {submission.song.argument && (
              <Box
                mt={2}
                mb={3}
                p={2}
                sx={{ bgcolor: "#2e2d2d", borderRadius: 1 }}
              >
                <Typography variant="body2" color="#aaa" mb={1}>
                  Their Case:
                </Typography>
                <Typography variant="body2" color="#ddd">
                  {submission.song.argument}
                </Typography>
              </Box>
            )}

            {/* Vote Slider */}
            <Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#ccc">
                  Allocate Votes:
                </Typography>
                <Typography
                  variant="body2"
                  color={votes[userId] > 0 ? "#4caf50" : "#ccc"}
                  fontWeight="bold"
                >
                  {votes[userId] || 0} vote{votes[userId] !== 1 ? "s" : ""}
                </Typography>
              </Box>
              <Slider
                value={votes[userId] || 0}
                onChange={(e, newValue) => handleVoteChange(userId, newValue)}
                min={0}
                max={Math.min(
                  MAX_VOTES,
                  (votes[userId] || 0) + (MAX_VOTES - totalVotesAllocated)
                )}
                marks
                step={1}
                disabled={isSubmitting}
                sx={{
                  color: "#4caf50",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#4caf50",
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: "#4caf50",
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "#555",
                  },
                  "& .MuiSlider-mark": {
                    backgroundColor: "#777",
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Submit Button */}
      <Box mt={3}>
        <Button
          variant="contained"
          onClick={() => setConfirmDialogOpen(true)}
          disabled={isSubmitting || totalVotesAllocated === 0}
          fullWidth
          sx={{
            bgcolor: "#4caf50",
            color: "white",
            textTransform: "uppercase",
            fontWeight: "bold",
            py: 1.5,
            "&:hover": {
              bgcolor: "#45a049",
            },
            "&:disabled": {
              bgcolor: "#555",
              color: "#999",
            },
          }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "I'm Done Voting"}
        </Button>
        <Typography
          variant="caption"
          color="#999"
          mt={1}
          display="block"
          textAlign="center"
        >
          You've allocated {totalVotesAllocated} of {MAX_VOTES} votes
        </Typography>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => !isSubmitting && setConfirmDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#2e2d2d",
            color: "white",
          },
        }}
      >
        <DialogTitle>Confirm Your Votes?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#ccc" mb={2}>
            You've allocated {totalVotesAllocated} of {MAX_VOTES} available
            votes.
          </Typography>
          <Typography variant="body2" color="#ccc">
            Once confirmed, you won't be able to change your votes. Are you sure
            you're done voting?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            disabled={isSubmitting}
            sx={{ color: "#ccc" }}
          >
            Go Back
          </Button>
          <Button
            onClick={handleSubmitVotes}
            disabled={isSubmitting}
            sx={{
              bgcolor: "#4caf50",
              color: "white",
              "&:hover": { bgcolor: "#45a049" },
            }}
          >
            {isSubmitting ? <CircularProgress size={20} /> : "Confirm Votes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
