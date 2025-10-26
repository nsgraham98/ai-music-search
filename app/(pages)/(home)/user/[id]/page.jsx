// user profile page
"use client";

import { LogoutButton } from "@/app/components/login/logout-button";
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import SignedInAs from "@/app/components/login/signed-in-as";
import LoginPopup from "@/app/components/login/login-popup";
import Navigation from "@/app/components/navigation/nav-bar";
import { useUserAuth } from "@/context/auth-context";
import { useUserProfile } from "@/context/user-profile-context";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { formatDate } from "@/utils/date-utils";

export default function UserProfilePage() {
  const { authUser } = useUserAuth();
  const {
    userProfile,
    loadingProfile,
    updateUserProfile,
    getUserProfileById,
    fetchUserProfile,
  } = useUserProfile();
  const params = useParams();
  const userId = params.id;

  // State for viewing other users vs own profile
  const [viewingProfile, setViewingProfile] = useState(null);
  const [loadingViewProfile, setLoadingViewProfile] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Determine if viewing own profile or someone else's
  useEffect(() => {
    if (authUser && userId) {
      const ownProfile = userId === authUser.uid;
      setIsOwnProfile(ownProfile);

      if (ownProfile) {
        setViewingProfile(userProfile);
        if (userProfile) {
          setEditDisplayName(userProfile.displayName || "");
        }
      } else {
        // Fetch other user's profile
        const fetchOtherProfile = async () => {
          setLoadingViewProfile(true);
          const result = await getUserProfileById(userId);
          if (result.success) {
            setViewingProfile(result.data);
          }
          setLoadingViewProfile(false);
        };
        fetchOtherProfile();
      }
    }
  }, [authUser, userId, userProfile, getUserProfileById]);

  const handleSaveDisplayName = async () => {
    if (!editDisplayName.trim()) {
      setUpdateError("Display name cannot be empty");
      return;
    }

    setIsUpdating(true);
    setUpdateError("");
    setUpdateSuccess("");

    const result = await updateUserProfile({ displayName: editDisplayName });

    if (result.success) {
      setUpdateSuccess("Display name updated successfully!");
      setIsEditing(false);
      setTimeout(() => setUpdateSuccess(""), 3000);
    } else {
      setUpdateError(result.error || "Failed to update display name");
    }

    setIsUpdating(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditDisplayName(viewingProfile?.displayName || "");
    setUpdateError("");
  };

  if (loadingProfile || loadingViewProfile) {
    return (
      <Container maxWidth="lg">
        <LoginPopup />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress color="primary" />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <LoginPopup />

      {/* Header and Logout */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight="bold">
          TUTTi.
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <SignedInAs />
          <LogoutButton />
        </Box>
      </Box>

      {/* Navigation Bar */}
      <Navigation />

      {/* Profile Content */}
      <Box
        component={Paper}
        elevation={4}
        sx={{
          bgcolor: "#2e2d2d",
          color: "white",
          width: "100%",
          maxWidth: "600px",
          mx: "auto",
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          border: "1px solid #444",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          {isOwnProfile ? "Your Profile" : "User Profile"}
        </Typography>

        {viewingProfile ? (
          <Box>
            {/* Display Name Section */}
            <Box mb={3}>
              <Typography variant="h6" mb={1}>
                Display Name
              </Typography>
              {isOwnProfile && isEditing ? (
                <Box>
                  <TextField
                    fullWidth
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    variant="outlined"
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        bgcolor: "#3a3a3a",
                        "& fieldset": { borderColor: "#444" },
                        "&:hover fieldset": { borderColor: "#888" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#E03FD8",
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputLabel-root": { color: "#ccc" },
                    }}
                  />
                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      onClick={handleSaveDisplayName}
                      disabled={isUpdating}
                      sx={{
                        bgcolor: "#E03FD8",
                        "&:hover": {
                          bgcolor: "#c133b9",
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(224, 63, 216, 0.4)",
                        },
                        transition: "all 0.2s",
                        fontWeight: "bold",
                      }}
                    >
                      {isUpdating ? <CircularProgress size={20} /> : "Save"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      sx={{
                        color: "#888",
                        borderColor: "#444",
                        "&:hover": {
                          borderColor: "#888",
                          bgcolor: "#3a3a3a",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1" fontSize="1.1rem">
                    {viewingProfile.displayName}
                  </Typography>
                  {isOwnProfile && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setIsEditing(true)}
                      sx={{
                        color: "white",
                        borderColor: "#444",
                        "&:hover": {
                          borderColor: "#E03FD8",
                          color: "#E03FD8",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.2s",
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
              )}
            </Box>

            {/* Email Section */}
            <Box mb={3}>
              <Typography variant="h6" mb={1}>
                Email
              </Typography>
              <Typography variant="body1" fontSize="1.1rem">
                {viewingProfile.email}
              </Typography>
            </Box>

            {/* Provider Section */}
            <Box mb={3}>
              <Typography variant="h6" mb={1}>
                Sign-in Provider
              </Typography>
              <Typography
                variant="body1"
                fontSize="1.1rem"
                sx={{ textTransform: "capitalize" }}
              >
                {viewingProfile.provider}
              </Typography>
            </Box>

            {/* Member Since */}
            <Box mb={3}>
              <Typography variant="h6" mb={1}>
                Member Since
              </Typography>
              <Typography variant="body1" fontSize="1.1rem">
                {formatDate(viewingProfile.created_at)}
              </Typography>
            </Box>

            {/* Update Messages */}
            {updateError && (
              <Alert
                severity="error"
                sx={{ bgcolor: "#3d1a1a", color: "#ff6b6b" }}
              >
                {updateError}
              </Alert>
            )}
            {updateSuccess && (
              <Alert
                severity="success"
                sx={{ bgcolor: "#1a3d1a", color: "#69ff6b" }}
              >
                {updateSuccess}
              </Alert>
            )}
          </Box>
        ) : (
          <Typography variant="body1">
            {isOwnProfile
              ? "Profile not found. Please try signing in again."
              : "User profile not found."}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
