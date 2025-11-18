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
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { LogoutButton } from "@/app/components/login/logout-button";
import SignedInAs from "@/app/components/login/signed-in-as";
import LoginPopup from "@/app/components/login/login-popup";
import { useUserAuth } from "@/context/auth-context";
import Link from "next/link";
import { formatDate } from "@/utils/date-utils";

export default function SoundRoomPage() {
  const { authUser } = useUserAuth();
  const [gameName, setGameName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [joinError, setJoinError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [createdGameCode, setCreatedGameCode] = useState("");

  // Dashboard state
  const [userGames, setUserGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [gamesError, setGamesError] = useState("");

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleOpenDeleteDialog = (game, event) => {
    event.stopPropagation(); // Prevent card click navigation
    setGameToDelete(game);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setGameToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!gameToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/games/${gameToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        // Remove game from list
        setUserGames(userGames.filter((g) => g.id !== gameToDelete.id));
        setDeleteDialogOpen(false);
        setGameToDelete(null);
      } else {
        setGamesError(data.error || "Failed to delete game");
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting game:", error);
      setGamesError("Failed to delete game");
      setDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleJoinGame = async () => {
    if (!joinCode.trim()) {
      setJoinError("Join code is required.");
      return;
    }

    if (joinCode.trim().length !== 4) {
      setJoinError("Join code must be 4 digits.");
      return;
    }

    if (!authUser) {
      setJoinError("You must be logged in to join a game.");
      return;
    }

    setIsJoining(true);
    setJoinError("");

    try {
      const response = await fetch("/api/games/join", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          joinCode: joinCode.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Navigate to the game page
        window.location.href = `/sound-room/game/${data.gameId}`;
      } else {
        setJoinError(data.error || "Failed to join game");
      }
    } catch (error) {
      console.error("Error joining game:", error);
      setJoinError(
        "An error occurred while joining the game. Please try again."
      );
    } finally {
      setIsJoining(false);
    }
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
    setCreatedGameCode("");

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameName: gameName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`Game '${gameName}' created successfully!`);
        setCreatedGameCode(data.joinCode);
        setGameName("");
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
    <>
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
                        <Box flex={1}>
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
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={getGameStatusText(game)}
                            size="small"
                            sx={{
                              backgroundColor: getGameStatusColor(game.status),
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                          {/* Delete button - only show for game creator */}
                          {authUser && game.creator === authUser.uid && (
                            <IconButton
                              onClick={(e) => handleOpenDeleteDialog(game, e)}
                              sx={{
                                color: "#ff5722",
                                "&:hover": {
                                  bgcolor: "rgba(255, 87, 34, 0.1)",
                                },
                              }}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
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

        {/* Right Column - Create and Join Game */}
        <Grid item xs={12} md={6}>
          {/* Create New Game */}
          <Box sx={{ bgcolor: "#2e2d2d", padding: 4, borderRadius: 2, mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              color="white"
            >
              Create New Game
            </Typography>
            <Typography variant="body1" gutterBottom color="white">
              Start a new Sound Room game!
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

              {/* Show Join Code if game was just created */}
              {createdGameCode && (
                <Box
                  sx={{
                    bgcolor: "#444",
                    padding: 3,
                    borderRadius: 2,
                    mb: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body1" color="#ccc" mb={1}>
                    Share this code with your friends:
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color="white"
                    sx={{
                      letterSpacing: "0.2em",
                      fontFamily: "monospace",
                    }}
                  >
                    {createdGameCode}
                  </Typography>
                </Box>
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
            </Box>
          </Box>

          {/* Join Game */}
          <Box sx={{ bgcolor: "#2e2d2d", padding: 4, borderRadius: 2 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              color="white"
            >
              Join Game
            </Typography>
            <Typography variant="body1" gutterBottom color="white">
              Enter a 4-digit code to join a game
            </Typography>

            {/* Join Code Input */}
            <Box mt={3}>
              <TextField
                fullWidth
                label="Game Code"
                variant="outlined"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                error={!!joinError}
                helperText={joinError}
                inputProps={{ maxLength: 4 }}
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

            {/* Join Game Button */}
            <Box mt={4}>
              {joinError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {joinError}
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
                onClick={handleJoinGame}
                disabled={isJoining}
              >
                {isJoining ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  "Join Game"
                )}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            bgcolor: "#2e2d2d",
            color: "white",
          },
        }}
      >
        <DialogTitle>Delete Game?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#ccc">
            Are you sure you want to delete "{gameToDelete?.name}"?
          </Typography>
          <Typography variant="body2" color="#ff5722" mt={2}>
            This will permanently delete the game and all its rounds. This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={isDeleting}
            sx={{ color: "#ccc" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            sx={{
              bgcolor: "#ff5722",
              color: "white",
              "&:hover": { bgcolor: "#e64a19" },
            }}
          >
            {isDeleting ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
