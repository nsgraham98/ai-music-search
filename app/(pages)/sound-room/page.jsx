// The Sound Room Page
// This page allows users to create a new game

"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { LogoutButton } from "@/app/components/login/logout-button";
import SignedInAs from "@/app/components/login/signed-in-as";
import LoginPopup from "@/app/components/login/login-popup";
import { useUserAuth } from "@/context/auth-context";
import Link from "next/link";
import { formatDate } from "@/utils/date-utils";

export default function SoundRoomPage() {
  const { authUser } = useUserAuth();
  const [gameName, setGameName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [invitedFriends, setInvitedFriends] = useState([]);
  const [error, setError] = useState("");
  const [friendError, setFriendError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Dashboard state
  const [userGames, setUserGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [gamesError, setGamesError] = useState("");

  // Fetch user's games when component mounts or user changes
  useEffect(() => {
    if (authUser) {
      fetchUserGames();
    }
  }, [authUser]);

  const fetchUserGames = async () => {
    setLoadingGames(true);
    setGamesError("");

    try {
      const response = await fetch("/api/games", {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      });

      const data = await response.json();

      if (data.success) {
        setUserGames(data.games);
      } else {
        setGamesError(data.error || "Failed to load games");
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      setGamesError("Failed to load games");
    } finally {
      setLoadingGames(false);
    }
  };

  const handleGameClick = (gameId) => {
    // Navigate to specific game page
    window.location.href = `/sound-room/game/${gameId}`;
  };

  const getGameStatusText = (game) => {
    switch (game.status) {
      case "waiting_for_players":
        return "Waiting for players";
      case "active":
        return `Round ${game.current_round}`;
      case "completed":
        return "Completed";
      default:
        return game.status;
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

  const handleAddFriend = () => {
    if (!friendEmail.trim()) {
      setFriendError("Email is required.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(friendEmail)) {
      setFriendError("Please enter a valid email address.");
      return;
    }

    // Check if friend is already added
    if (invitedFriends.includes(friendEmail)) {
      setFriendError("This friend has already been invited.");
      return;
    }

    setInvitedFriends([...invitedFriends, friendEmail]);
    setFriendEmail("");
    setFriendError("");
  };

  const handleRemoveFriend = (emailToRemove) => {
    setInvitedFriends(
      invitedFriends.filter((email) => email !== emailToRemove)
    );
  };

  const handleCreateGame = async () => {
    if (!gameName.trim()) {
      setError("Game name is required.");
      return;
    }

    if (!authUser) {
      setError("You must be logged in to create a game.");
      return;
    }

    setIsCreating(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        credentials: "include", // Include cookies for authentication
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameName: gameName,
          invitedEmails: invitedFriends,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(
          `Game '${gameName}' created successfully! Game ID: ${data.gameId}`
        );
        setGameName("");
        setInvitedFriends([]);
        setError("");
        // Refresh the games list
        fetchUserGames();
      } else {
        setError(data.error || "Failed to create game");
      }
    } catch (error) {
      console.error("Error creating game:", error);
      setError("An error occurred while creating the game. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

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
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <SignedInAs />
            <LogoutButton />
          </Box>
        </Box>

        {/* Sound Room Content - Two Column Layout */}
        <Grid container spacing={4}>
          {/* Left Column - Games Dashboard */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: "#2e2d2d",
                padding: 4,
                borderRadius: 2,
                height: "fit-content",
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                color="white"
              >
                My Games
              </Typography>
              <Typography variant="body1" gutterBottom color="white" mb={3}>
                Your active and past games
              </Typography>

              {/* Games List */}
              {loadingGames ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress sx={{ color: "white" }} />
                </Box>
              ) : gamesError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {gamesError}
                </Alert>
              ) : userGames.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="#ccc">
                    You haven't joined any games yet.
                  </Typography>
                  <Typography variant="body2" color="#888" mt={1}>
                    Create your first game to get started!
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {userGames.map((game) => (
                    <Card
                      key={game.id}
                      sx={{
                        mb: 2,
                        bgcolor: "#444",
                        color: "white",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "#555",
                        },
                      }}
                      onClick={() => handleGameClick(game.id)}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {game.name}
                            </Typography>
                            <Typography variant="body2" color="#ccc" mt={1}>
                              {game.players?.length || 1} player(s)
                            </Typography>
                            <Typography variant="body2" color="#ccc">
                              Created: {formatDate(game.created_at)}
                            </Typography>
                          </Box>
                          <Chip
                            label={getGameStatusText(game)}
                            size="small"
                            sx={{
                              backgroundColor: getGameStatusColor(game.status),
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              {/* Refresh Button */}
              <Box mt={3}>
                <Button
                  variant="outlined"
                  onClick={fetchUserGames}
                  disabled={loadingGames}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                    padding: "6px 12px",
                    borderWidth: 1,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                    "&:disabled": {
                      borderColor: "#666",
                      color: "#666",
                    },
                  }}
                >
                  {loadingGames ? "Refreshing..." : "Refresh Games"}
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Column - Create New Game */}
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: "#2e2d2d", padding: 4, borderRadius: 2 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                color="white"
              >
                Create New Game
              </Typography>
              <Typography variant="body1" gutterBottom color="white">
                Start a new Sound Room game and invite your friends!
              </Typography>

              {/* Game Name Input */}
              <Box mt={3}>
                <TextField
                  fullWidth
                  label="Game Name"
                  variant="outlined"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  error={!!error}
                  helperText={error}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "#555" },
                      "&:hover fieldset": { borderColor: "#888" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    "& .MuiInputLabel-root": { color: "#ccc" },
                    "& .MuiFormHelperText-root": { color: "#ff6b6b" },
                  }}
                />
              </Box>

              {/* Friend Invitation Section */}
              <Box mt={3}>
                <Typography variant="h6" color="white" mb={2}>
                  Invite Friends
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <TextField
                    fullWidth
                    label="Friend's Email"
                    variant="outlined"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    error={!!friendError}
                    helperText={friendError}
                    onKeyPress={(e) => e.key === "Enter" && handleAddFriend()}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": { borderColor: "#555" },
                        "&:hover fieldset": { borderColor: "#888" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                      "& .MuiInputLabel-root": { color: "#ccc" },
                      "& .MuiFormHelperText-root": { color: "#ff6b6b" },
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddFriend}
                    sx={{
                      borderColor: "white",
                      color: "white",
                      minWidth: "auto",
                      px: 2,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <AddIcon />
                  </Button>
                </Box>

                {/* Invited Friends List */}
                {invitedFriends.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="#ccc" mb={1}>
                      Invited Friends ({invitedFriends.length}):
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {invitedFriends.map((email, index) => (
                        <Chip
                          key={index}
                          label={email}
                          onDelete={() => handleRemoveFriend(email)}
                          deleteIcon={<DeleteIcon />}
                          sx={{
                            backgroundColor: "#444",
                            color: "white",
                            "& .MuiChip-deleteIcon": {
                              color: "#ccc",
                              "&:hover": { color: "#ff6b6b" },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Create Game Button */}
              <Box mt={4}>
                {/* Success/Error Messages */}
                {successMessage && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                  </Alert>
                )}
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    padding: "8px 16px",
                    borderWidth: 2,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                    "&:disabled": {
                      borderColor: "#666",
                      color: "#666",
                    },
                  }}
                  onClick={handleCreateGame}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    "Create Game"
                  )}
                </Button>
                {invitedFriends.length > 0 && (
                  <Typography variant="body2" color="#ccc" mt={1}>
                    Total players: {invitedFriends.length + 1} (including you)
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
