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

  // Player names state - stores display names for all players across all games
  const [playerNames, setPlayerNames] = useState({});

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
        // Fetch player names for all players in all games
        fetchPlayerNames(data.games);
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

  const fetchPlayerNames = async (games) => {
    // Collect all unique player IDs from all games
    const allPlayerIds = new Set();
    games.forEach((game) => {
      if (game.players) {
        game.players.forEach((playerId) => allPlayerIds.add(playerId));
      }
    });

    // Fetch display names for all players
    const names = {};
    await Promise.all(
      Array.from(allPlayerIds).map(async (playerId) => {
        try {
          const response = await fetch(`/api/users/${playerId}`);
          const data = await response.json();
          if (data.success) {
            names[playerId] = data.displayName;
          }
        } catch (error) {
          console.error(`Error fetching name for ${playerId}:`, error);
        }
      })
    );
    setPlayerNames(names);
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
        return "#fffb87"; // light yellow
      case "active":
        return "#90ee90"; // light green
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
    <Box sx={{ bgcolor: "#1e1e1e", minHeight: "100vh", py: 4 }}>
      <Container maxWidth={false} sx={{ px: 4 }}>
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

        {/* Sound Room Content - Three Column Layout */}
        <Grid container spacing={4} justifyContent="center">
          {/* Left Column - Games Dashboard */}
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                bgcolor: "#2e2d2d",
                padding: 4,
                borderRadius: 2,
                height: "fit-content",
                border: "1px solid #444",
                transition: "border-color 0.3s",
                "&:hover": {
                  borderColor: "#888",
                },
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
                        bgcolor: "#3a3a3a",
                        color: "white",
                        cursor: "pointer",
                        border: "1px solid #444",
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: "#444",
                          borderColor: "#E03FD8",
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(224, 63, 216, 0.3)",
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

                            {/* Current Scores Section */}
                            {game.overall_scores &&
                              Object.keys(game.overall_scores).length > 0 && (
                                <Box mt={2}>
                                  <Typography
                                    variant="body2"
                                    color="#ccc"
                                    mb={1}
                                    fontWeight="normal"
                                  >
                                    Current Scores:
                                  </Typography>
                                  <Box display="flex" flexWrap="wrap" gap={1}>
                                    {game.players
                                      ?.sort((a, b) => {
                                        // Sort by score (highest first)
                                        const scoreA =
                                          game.overall_scores?.[a] || 0;
                                        const scoreB =
                                          game.overall_scores?.[b] || 0;
                                        if (scoreB !== scoreA)
                                          return scoreB - scoreA;
                                        return (
                                          playerNames[a] || ""
                                        ).localeCompare(playerNames[b] || "");
                                      })
                                      .map((playerId, index) => {
                                        const score =
                                          game.overall_scores?.[playerId] || 0;
                                        const isLeader =
                                          index === 0 && score > 0;

                                        return (
                                          <Chip
                                            key={playerId}
                                            label={`${playerNames[playerId] || "Loading..."} • ${score}`}
                                            size="small"
                                            sx={{
                                              bgcolor: isLeader
                                                ? "#ffd700"
                                                : "#90ee90",
                                              color: "#000",
                                              fontWeight: isLeader
                                                ? "normal"
                                                : "normal",
                                              border: "1px solid #333",
                                              borderRadius: 1,
                                            }}
                                          />
                                        );
                                      })}
                                  </Box>
                                </Box>
                              )}
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={getGameStatusText(game)}
                              size="small"
                              sx={{
                                backgroundColor: getGameStatusColor(
                                  game.status
                                ),
                                color:
                                  game.status === "active" ? "#000" : "black",
                                fontWeight: "bold",
                                border: "1px solid #333",
                                borderRadius: 1,
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
                    borderColor: "#E03FD8",
                    color: "#E03FD8",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                    padding: "6px 12px",
                    borderWidth: 2,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "rgba(224, 63, 216, 0.1)",
                      borderColor: "#c133b9",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(224, 63, 216, 0.4)",
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

          {/* Middle Column - Create and Join Game */}
          <Grid item xs={12} sm={4}>
            {/* Create New Game */}
            <Box
              sx={{
                bgcolor: "#2e2d2d",
                padding: 4,
                borderRadius: 2,
                mb: 4,
                border: "1px solid #444",
                transition: "border-color 0.3s",
                "&:hover": {
                  borderColor: "#888",
                },
              }}
            >
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
                  variant="contained"
                  sx={{
                    bgcolor: "#E03FD8",
                    color: "white",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    padding: "10px 24px",
                    borderWidth: 0,
                    transition: "all 0.2s",
                    boxShadow: "0 4px 12px rgba(224, 63, 216, 0.3)",
                    "&:hover": {
                      bgcolor: "#c133b9",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(224, 63, 216, 0.5)",
                    },
                    "&:disabled": {
                      bgcolor: "#666",
                      color: "#999",
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
            <Box
              sx={{
                bgcolor: "#2e2d2d",
                padding: 4,
                borderRadius: 2,
                border: "1px solid #444",
                transition: "border-color 0.3s",
                "&:hover": {
                  borderColor: "#888",
                },
              }}
            >
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
                  variant="contained"
                  sx={{
                    bgcolor: "#E03FD8",
                    color: "white",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    padding: "10px 24px",
                    borderWidth: 0,
                    transition: "all 0.2s",
                    boxShadow: "0 4px 12px rgba(224, 63, 216, 0.3)",
                    "&:hover": {
                      bgcolor: "#c133b9",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(224, 63, 216, 0.5)",
                    },
                    "&:disabled": {
                      bgcolor: "#666",
                      color: "#999",
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

          {/* Right Column - User Guide */}
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                bgcolor: "#2e2d2d",
                padding: 4,
                borderRadius: 2,
                border: "1px solid #444",
                transition: "border-color 0.3s",
                "&:hover": {
                  borderColor: "#888",
                },
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                color="white"
              >
                Sound Room - User Guide
              </Typography>

              {/* How It Works Section */}
              <Box mt={3} mb={4}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#E03FD8"
                  mb={2}
                >
                  Ready to play? Here's how it works:
                </Typography>
                <Box component="ul" sx={{ color: "#ccc", pl: 2 }}>
                  <Typography component="li" variant="body2" mb={1.5}>
                    Each game is made up of multiple rounds.
                  </Typography>
                  <Typography component="li" variant="body2" mb={1.5}>
                    When a round opens, all players are notified to submit a
                    song that fits the theme.
                  </Typography>
                  <Typography component="li" variant="body2" mb={1.5}>
                    After submitting, players can immediately start voting. You
                    have 5 votes to allocate across other players' submissions.
                  </Typography>
                  <Typography component="li" variant="body2" mb={1.5}>
                    When the game admin closes voting, everyone can see the
                    results, including who submitted what, and how everyone voted.
                  </Typography>
                  <Typography component="li" variant="body2" mb={1.5}>
                    Points accumulate from round to round until a winner is
                    crowned!
                  </Typography>
                </Box>
              </Box>

              {/* How to Start Section */}
              <Box mb={4}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#E03FD8"
                  mb={2}
                >
                  Ready to start a game? Here's what to do:
                </Typography>
                <Box component="ol" sx={{ color: "#ccc", pl: 2.5 }}>
                  <Typography component="li" variant="body2" mb={1.5}>
                    G ive your game a name and click "Create Game"
                  </Typography>
                  <Typography component="li" variant="body2" mb={1.5}>
                    Share the 4-digit join code with your friends (games are best with 4+ players!)
                  </Typography>
                  <Typography component="li" variant="body2" mb={1.5}>
                    Once everyone has joined, click "Start Game"
                  </Typography>
                  <Typography component="li" variant="body2" mb={1.5}>
                    Choose a random theme or create your own custom theme for
                    the round
                  </Typography>
                  <Typography component="li" variant="body2" mb={1.5}>
                    Players submit songs and vote simultaneously
                  </Typography>
                  <Typography component="li" variant="body2" mb={1.5}>
                    When everyone has submitted and voted, close voting to see the results and start
                    the next round!
                  </Typography>
                </Box>
              </Box>

              {/* Tips Section */}
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#E03FD8"
                  mb={2}
                >
                  Tips for a great game:
                </Typography>
                <Box component="ul" sx={{ color: "#ccc", pl: 2 }}>
                  <Typography component="li" variant="body2" mb={1.5}>
                    Choose themes that are broad enough for people to pick songs
                    from memory
                  </Typography>
                  <Typography component="li" variant="body2" mb={1.5}>
                    Aim for rounds to last up to a week at most
                  </Typography>
                  <Typography component="li" variant="body2" mb={1.5}>
                    Mix up your themes: try specific genres, decades, moods, or
                    creative prompts like "Songs with colors in the title"
                  </Typography>
                </Box>
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
      </Container>
    </Box>
  );
}
