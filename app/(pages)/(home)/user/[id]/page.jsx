"use client";

import { LogoutButton } from "@/app/components/login/logout-button";
import { Box, Typography, Container, Paper, TextField, Button, Alert, CircularProgress } from "@mui/material";
import SignedInAs from "@/app/components/login/signed-in-as";
import LoginPopup from "@/app/components/login/login-popup";
import { useUserAuth } from "@/context/auth-context";
import { useUserProfile } from "@/context/user-profile-context";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function UserProfilePage() {
  const { user } = useUserAuth();
  const { userProfile, loadingProfile, updateDisplayName, getUserProfileById } = useUserProfile();
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
    if (user && userId) {
      const ownProfile = userId === user.uid;
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
  }, [user, userId, userProfile, getUserProfileById]);

  const handleSaveDisplayName = async () => {
    if (!editDisplayName.trim()) {
      setUpdateError("Display name cannot be empty");
      return;
    }

    setIsUpdating(true);
    setUpdateError("");
    setUpdateSuccess("");

    const result = await updateDisplayName(editDisplayName);
    
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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
                        "& fieldset": { borderColor: "#555" },
                        "&:hover fieldset": { borderColor: "#888" },
                        "&.Mui-focused fieldset": { borderColor: "#E03FD8" },
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
                        "&:hover": { bgcolor: "#c935c4" },
                      }}
                    >
                      {isUpdating ? <CircularProgress size={20} /> : "Save"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      sx={{
                        color: "white",
                        borderColor: "#888",
                        "&:hover": { borderColor: "#aaa" },
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box display="flex" justifyContent="space-between" alignItems="center">
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
                        borderColor: "#888",
                        "&:hover": { borderColor: "#E03FD8", color: "#E03FD8" },
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
              <Typography variant="body1" fontSize="1.1rem" sx={{ textTransform: "capitalize" }}>
                {viewingProfile.provider}
              </Typography>
            </Box>

            {/* Member Since */}
            <Box mb={3}>
              <Typography variant="h6" mb={1}>
                Member Since
              </Typography>
              <Typography variant="body1" fontSize="1.1rem">
                {new Date(viewingProfile.created_at).toLocaleDateString()}
              </Typography>
            </Box>

            {/* Update Messages */}
            {updateError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {updateError}
              </Alert>
            )}
            {updateSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {updateSuccess}
              </Alert>
            )}
          </Box>
        ) : (
          <Typography variant="body1">
            {isOwnProfile ? "Profile not found. Please try signing in again." : "User profile not found."}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
