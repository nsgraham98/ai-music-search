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

export default function GamePage() {
  const { user } = useUserAuth();
  const params = useParams();
  const gameId = params.id;

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && gameId) {
      fetchGameDetails();
    }
  }, [user, gameId]);

  const fetchGameDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const token = await user.getIdToken();

      const response = await fetch(`/api/games/${gameId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
                    {new Date(
                      game.created_at?.seconds * 1000 || game.created_at
                    ).toLocaleDateString()}
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
                    The game will start once all invited players join.
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "white",
                      color: "white",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                    }}
                    onClick={() => {
                      // TODO: Implement start game functionality
                      alert("Start game functionality coming soon!");
                    }}
                  >
                    Start Game
                  </Button>
                </Box>
              ) : game.status === "active" ? (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Round {game.current_round}
                  </Typography>
                  <Typography variant="body1" color="#ccc" mb={3}>
                    Round functionality coming soon! Here you'll be able to:
                  </Typography>
                  <ul style={{ color: "#ccc", paddingLeft: "20px" }}>
                    <li>See the current theme/prompt</li>
                    <li>Submit your song choice</li>
                    <li>View other players' submissions</li>
                    <li>Vote on submissions</li>
                    <li>See round results</li>
                  </ul>
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
