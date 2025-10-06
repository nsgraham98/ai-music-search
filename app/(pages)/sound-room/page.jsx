// The Sound Room Page
// This page allows users to create a new game

"use client";

import { useState } from "react";
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
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { LogoutButton } from "@/app/components/login/logout-button";
import SignedInAs from "@/app/components/login/signed-in-as";
import LoginPopup from "@/app/components/login/login-popup";
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
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameName: gameName,
          invitedEmails: invitedFriends,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`Game '${gameName}' created successfully! Game ID: ${data.gameId}`);
        setGameName("");
        setInvitedFriends([]);
        setError("");
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
                sx={{ cursor: "pointer", textDecoration: "none", color: "white" }}
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

        {/* Sound Room Content */}
        <Container maxWidth="sm">
          <Box sx={{ bgcolor: "#2e2d2d", padding: 4, borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="white">
              The Sound Room
            </Typography>
            <Typography variant="body1" gutterBottom color="white">
              Create a new game and invite your friends to join!
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
                {isCreating ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Create Game"}
              </Button>
              {invitedFriends.length > 0 && (
                <Typography variant="body2" color="#ccc" mt={1}>
                  Total players: {invitedFriends.length + 1} (including you)
                </Typography>
              )}
            </Box>
          </Box>
        </Container>
      </Container>
    </Box>
  );
}