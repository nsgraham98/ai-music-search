// Individual Game Page
// Shows game details, current round, submissions, and voting

"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { LogoutButton } from "@/app/components/login/logout-button";
import SignedInAs from "@/app/components/login/signed-in-as";
import LoginPopup from "@/app/components/login/login-popup";
import { useUserAuth } from "@/context/auth-context";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/utils/date-utils";
import SongSubmissionInterface from "@/app/components/song-submission";
import VotingInterface from "@/app/components/voting-interface";

export default function GamePage() {
  const { authUser } = useUserAuth();
  const params = useParams();
  const gameId = params.id;

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startingGame, setStartingGame] = useState(false);
  const [currentRound, setCurrentRound] = useState(null);
  const [loadingRound, setLoadingRound] = useState(false);
  const [userSubmission, setUserSubmission] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [closingVoting, setClosingVoting] = useState(false);

  useEffect(() => {
    if (authUser && gameId) {
      fetchGameDetails();
    }
  }, [authUser, gameId]);

  useEffect(() => {
    // Fetch current round data when game becomes active
    if (game && game.status === "active" && game.current_round) {
      fetchCurrentRound();
    }
  }, [game]);

  const fetchGameDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      });

      const data = await response.json();

      if (data.success) {
        setGame(data.game);
      } else {
        setError(data.error || "Failed to load game");
      }
    } catch (error) {
      console.error("Error fetching game:", error);
      setError("Failed to load game details");
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = async () => {
    setStartingGame(true);
    setError("");

    try {
      const response = await fetch(`/api/games/${gameId}/start`, {
        method: "POST",
        credentials: "include", // Include cookies for authentication
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the game data to show the updated state
        await fetchGameDetails();
      } else {
        setError(data.error || "Failed to start game");
      }
    } catch (error) {
      console.error("Error starting game:", error);
      setError("Failed to start game");
    } finally {
      setStartingGame(false);
    }
  };

  const fetchCurrentRound = async () => {
    if (!game || !game.current_round) return;

    setLoadingRound(true);
    try {
      const response = await fetch(
        `/api/games/${gameId}/rounds/${game.current_round}`,
        {
          method: "GET",
          credentials: "include", // Include cookies for authentication
        }
      );

      const data = await response.json();

      if (data.success) {
        setCurrentRound(data.round);

        // Check if user has already submitted for this round
        const userId = authUser.uid;
        const submissions = data.round.submissions || {};
        if (submissions[userId]) {
          setUserSubmission(submissions[userId].song);
        } else {
          setUserSubmission(null);
        }

        // Check if user has already voted
        const votes = data.round.votes || {};
        if (votes[userId]) {
          setHasVoted(true);
        } else {
          setHasVoted(false);
        }
      } else {
        console.error("Failed to fetch round:", data.error);
      }
    } catch (error) {
      console.error("Error fetching current round:", error);
    } finally {
      setLoadingRound(false);
    }
  };

  const handleSubmissionSuccess = (submittedSong) => {
    setUserSubmission(submittedSong);
    // Optionally refresh the round data
    fetchCurrentRound();
  };

  const handleVoteSuccess = () => {
    setHasVoted(true);
    // Refresh the round data
    fetchCurrentRound();
  };

  const handleCloseVoting = async () => {
    setClosingVoting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/games/${gameId}/rounds/${game.current_round}/close-voting`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        // Refresh the round data to show results
        await fetchCurrentRound();
        await fetchGameDetails();
      } else {
        setError(data.error || "Failed to close voting");
      }
    } catch (error) {
      console.error("Error closing voting:", error);
      setError("Failed to close voting");
    } finally {
      setClosingVoting(false);
    }
  };

  const getGameStatusText = (game) => {
    switch (game?.status) {
      case "waiting_for_players":
        return "Waiting for players";
      case "active":
        return `Round ${game.current_round}`;
      case "completed":
        return "Completed";
      default:
        return game?.status || "Unknown";
    }
  };

  const getGameStatusColor = (status) => {
    switch (status) {
      case "waiting_for_players":
        return "#ff9800"; // orange
      case "active":
        return "#4caf50"; // green
      case "completed":
        return "#757575"; // gray
      default:
        return "#2196f3"; // blue
    }
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: "#1e1e1e", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <LoginPopup />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress color="primary" />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#1e1e1e", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <LoginPopup />

        {/* Header with TUTTi logo and user info */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Link href="/" passHref>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                TUTTi.
              </Typography>
            </Link>
            <Typography variant="h6" color="#ccc">
              /
            </Typography>
            <Link href="/sound-room" passHref>
              <Typography
                variant="h6"
                sx={{
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "#ccc",
                  "&:hover": { color: "white" },
                }}
              >
                Sound Room
              </Typography>
            </Link>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <SignedInAs />
            <LogoutButton />
          </Box>
        </Box>

        {/* Game Content */}
        {error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        ) : game ? (
          <Box>
            {/* Game Header */}
            <Paper sx={{ bgcolor: "#2e2d2d", color: "white", p: 4, mb: 4 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={2}
              >
                <Box>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {game.name}
                  </Typography>
                  <Typography variant="body1" color="#ccc">
                    {game.players?.length || 1} player(s) • Created{" "}
                    {formatDate(game.created_at)}
                  </Typography>
                </Box>
                <Chip
                  label={getGameStatusText(game)}
                  sx={{
                    backgroundColor: getGameStatusColor(game.status),
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    padding: "8px 16px",
                  }}
                />
              </Box>

              {/* Invited Emails */}
              {game.invited_emails && game.invited_emails.length > 0 && (
                <Box mt={2}>
                  <Typography variant="h6" color="white" mb={1}>
                    Invited Players:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {game.invited_emails.map((email, index) => (
                      <Chip
                        key={index}
                        label={email}
                        size="small"
                        sx={{
                          backgroundColor: "#555",
                          color: "white",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>

            {/* Game Content Based on Status */}
            <Paper sx={{ bgcolor: "#2e2d2d", color: "white", p: 4 }}>
              {game.status === "waiting_for_players" ? (
                <Box textAlign="center" py={4}>
                  <Typography variant="h5" gutterBottom>
                    Waiting for Players
                  </Typography>
                  <Typography variant="body1" color="#ccc" mb={3}>
                    The game will start once all invited players join, or you
                    can start now.
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "white",
                      color: "white",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      "&:hover": {
                        borderColor: "#4caf50",
                        backgroundColor: "#4caf50",
                      },
                    }}
                    onClick={handleStartGame}
                    disabled={startingGame}
                  >
                    {startingGame ? "Starting..." : "Start Game"}
                  </Button>
                </Box>
              ) : game.status === "active" ? (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Round {game.current_round}
                  </Typography>

                  {loadingRound ? (
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <CircularProgress size={20} />
                      <Typography variant="body1" color="#ccc">
                        Loading round details...
                      </Typography>
                    </Box>
                  ) : currentRound ? (
                    <Box mb={3}>
                      <Typography variant="h6" color="#4caf50" gutterBottom>
                        Theme: {currentRound.theme}
                      </Typography>
                      <Typography variant="body2" color="#ccc" mb={2}>
                        Status:{" "}
                        {currentRound.status?.replace(/_/g, " ").toUpperCase()}
                      </Typography>
                      <Typography variant="body2" color="#ccc">
                        Submissions due:{" "}
                        {formatDate(currentRound.submissions_deadline)}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="#ff5722" mb={3}>
                      Error loading round details
                    </Typography>
                  )}

                  {/* Song Submission or Voting Interface */}
                  {currentRound &&
                    currentRound.status === "submissions_open" && (
                      <SongSubmissionInterface
                        gameId={gameId}
                        roundId={game.current_round.toString()}
                        theme={currentRound.theme}
                        onSubmissionSuccess={handleSubmissionSuccess}
                        disabled={loadingRound}
                        currentSubmission={userSubmission}
                      />
                    )}

                  {/* Voting Interface - Show after user has submitted */}
                  {currentRound &&
                    (currentRound.status === "voting_open" ||
                      (currentRound.status === "submissions_open" &&
                        userSubmission)) && (
                      <Box mt={userSubmission ? 3 : 0}>
                        <VotingInterface
                          gameId={gameId}
                          roundId={game.current_round.toString()}
                          theme={currentRound.theme}
                          submissions={currentRound.submissions}
                          currentUserId={authUser.uid}
                          hasVoted={hasVoted}
                          onVoteSuccess={handleVoteSuccess}
                        />

                        {/* Close Voting Button (only for game creator after voting) */}
                        {hasVoted && game.creator === authUser.uid && (
                          <Box mt={3}>
                            <Button
                              variant="outlined"
                              onClick={handleCloseVoting}
                              disabled={closingVoting}
                              fullWidth
                              sx={{
                                borderColor: "#ff9800",
                                color: "#ff9800",
                                textTransform: "uppercase",
                                fontWeight: "bold",
                                py: 1.5,
                                "&:hover": {
                                  borderColor: "#f57c00",
                                  backgroundColor: "rgba(255, 152, 0, 0.1)",
                                },
                                "&:disabled": {
                                  borderColor: "#666",
                                  color: "#666",
                                },
                              }}
                            >
                              {closingVoting ? (
                                <CircularProgress size={24} />
                              ) : (
                                "Close Voting & Show Results (Creator Only)"
                              )}
                            </Button>
                          </Box>
                        )}
                      </Box>
                    )}
                </Box>
              ) : game.status === "completed" ? (
                <Box textAlign="center" py={4}>
                  <Typography variant="h5" gutterBottom>
                    Game Completed
                  </Typography>
                  <Typography variant="body1" color="#ccc">
                    This game has finished. Final results and scores will be
                    displayed here.
                  </Typography>
                </Box>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="h5" gutterBottom>
                    Unknown Game Status
                  </Typography>
                  <Typography variant="body1" color="#ccc">
                    This game is in an unknown state: {game.status}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        ) : (
          <Alert severity="info">
            Game not found or you don't have access to this game.
          </Alert>
        )}
      </Container>
    </Box>
  );
}
