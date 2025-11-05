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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { LogoutButton } from "@/app/components/login/logout-button";
=======
import { Delete as DeleteIcon } from "@mui/icons-material";
>>>>>>> Stashed changes
=======
import { Delete as DeleteIcon } from "@mui/icons-material";
>>>>>>> Stashed changes
=======
import { Delete as DeleteIcon } from "@mui/icons-material";
>>>>>>> Stashed changes
import SignedInAs from "@/app/components/login/signed-in-as";
import LoginPopup from "@/app/components/login/login-popup";
import Navigation from "@/app/components/navigation/nav-bar";
import { useUserAuth } from "@/context/auth-context";
import Link from "next/link";

export default function SoundRoomPage() {
  const { user } = useUserAuth();
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
    if (user) {
      fetchUserGames();
    }
  }, [user]);

  const fetchUserGames = async () => {
    setLoadingGames(true);
    setGamesError("");

    try {
      const token = await user.getIdToken();

      const response = await fetch("/api/games", {
        method: "GET",
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        headers: {
          Authorization: `Bearer ${token}`,
        },
=======
        credentials: "include",
>>>>>>> Stashed changes
=======
        credentials: "include",
>>>>>>> Stashed changes
=======
        credentials: "include",
>>>>>>> Stashed changes
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
        return "#ff9800";
      case "active":
        return "#4caf50";
      case "completed":
        return "#757575";
      default:
        return "#2196f3";
    }
  };

<<<<<<< Updated upstream
  const handleAddFriend = () => {
    if (!friendEmail.trim()) {
      setFriendError("Email is required.");
=======
  const handleOpenDeleteDialog = (game, event) => {
    event.stopPropagation();
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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  const handleRemoveFriend = (emailToRemove) => {
    setInvitedFriends(
      invitedFriends.filter((email) => email !== emailToRemove)
    );
=======
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
>>>>>>> Stashed changes
  };

  const handleCreateGame = async () => {
    if (!gameName.trim()) {
      setError("Game name is required.");
      return;
    }

    if (!user) {
      setError("You must be logged in to create a game.");
      return;
    }

    setIsCreating(true);
    setError("");
    setSuccessMessage("");

    try {
      // Get the user's ID token for authentication
      const token = await user.getIdToken();

      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    <Container maxWidth="lg">
      <LoginPopup />

      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Link href="/" passHref style={{ textDecoration: "none" }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ cursor: "pointer", color: "inherit" }}
          >
            TUTTi.
          </Typography>
        </Link>
        <Box display="flex" alignItems="center" gap={2}>
          <SignedInAs />
        </Box>
      </Box>

      {/* Navigation Bar */}
      <Navigation />

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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
                              Created:{" "}
                              {new Date(
                                game.created_at?.seconds * 1000 ||
                                  game.created_at
                              ).toLocaleDateString()}
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
=======
        </Grid>
=======
        </Grid>
>>>>>>> Stashed changes
=======
        </Grid>
>>>>>>> Stashed changes

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
    </Container>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  );
}
