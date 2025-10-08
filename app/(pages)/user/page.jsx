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
  Avatar,
  Divider,
  Chip,
  Grid
} from "@mui/material";
import SignedInAs from "@/app/components/login/signed-in-as";
import LoginPopup from "@/app/components/login/login-popup";
import { useUserAuth } from "@/context/auth-context";
import { useUserProfile } from "@/context/user-profile-context";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Edit2, 
  Mail, 
  Calendar, 
  Key, 
  User as UserIcon,
  Music,
  Clock,
  TrendingUp
} from "lucide-react";

export default function UserProfilePage() {
  const { user } = useUserAuth();
  const { userProfile, loadingProfile, updateDisplayName, getUserProfileById } = useUserProfile();
  const params = useParams();
  const router = useRouter();
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
      // Update local state
      setViewingProfile(prev => ({
        ...prev,
        displayName: editDisplayName.trim()
      }));
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

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format date nicely
  const formatMemberSince = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get provider icon/color
  const getProviderInfo = (provider) => {
    const providers = {
      google: { color: "#4285F4", label: "Google" },
      github: { color: "#24292e", label: "GitHub" },
      facebook: { color: "#1877F2", label: "Facebook" },
    };
    return providers[provider?.toLowerCase()] || { color: "#888", label: provider || "Unknown" };
  };

  if (loadingProfile || loadingViewProfile) {
    return (
      <Container maxWidth="lg">
        <LoginPopup />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress sx={{ color: "#E03FD8" }} size={60} />
        </Box>
      </Container>
    );
  }

  const providerInfo = getProviderInfo(viewingProfile?.provider);

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
        <Typography 
          variant="h4" 
          fontWeight="bold"
          sx={{
            background: "linear-gradient(135deg, #E03FD8 0%, #8B5CF6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            cursor: "pointer"
          }}
          onClick={() => router.push("/")}
        >
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
        elevation={6}
        sx={{
          bgcolor: "#2e2d2d",
          color: "white",
          width: "100%",
          maxWidth: "800px",
          mx: "auto",
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #E03FD8 0%, #8B5CF6 100%)",
          }
        }}
      >
        {viewingProfile ? (
          <Box>
            {/* Profile Header with Avatar */}
            <Box display="flex" alignItems="center" gap={3} mb={4}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "#E03FD8",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  border: "3px solid #8B5CF6"
                }}
              >
                {getInitials(viewingProfile.displayName)}
              </Avatar>
              <Box flex={1}>
                <Typography variant="h4" fontWeight="bold" mb={1}>
                  {isOwnProfile ? "Your Profile" : `${viewingProfile.displayName}'s Profile`}
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip 
                    label={providerInfo.label}
                    size="small"
                    sx={{ 
                      bgcolor: providerInfo.color,
                      color: "white",
                      fontWeight: "bold"
                    }}
                  />
                  <Chip 
                    icon={<Calendar size={14} />}
                    label={`Member since ${new Date(viewingProfile.created_at).getFullYear()}`}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      borderColor: "#888",
                      color: "#ccc"
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ bgcolor: "#444", mb: 4 }} />

            {/* Display Name Section */}
            <Box mb={4}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <UserIcon size={20} color="#E03FD8" />
                <Typography variant="h6" fontWeight="600">
                  Display Name
                </Typography>
              </Box>
              
              {isOwnProfile && isEditing ? (
                <Box>
                  <TextField
                    fullWidth
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    variant="outlined"
                    placeholder="Enter your display name"
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        bgcolor: "#1e1e1e",
                        "& fieldset": { borderColor: "#555" },
                        "&:hover fieldset": { borderColor: "#888" },
                        "&.Mui-focused fieldset": { 
                          borderColor: "#E03FD8",
                          borderWidth: "2px"
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
                      startIcon={isUpdating ? <CircularProgress size={16} sx={{ color: "white" }} /> : null}
                      sx={{
                        bgcolor: "#E03FD8",
                        "&:hover": { bgcolor: "#c935c4" },
                        "&:disabled": { bgcolor: "#666" },
                        px: 3
                      }}
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      sx={{
                        color: "white",
                        borderColor: "#888",
                        "&:hover": { 
                          borderColor: "#aaa",
                          bgcolor: "rgba(255,255,255,0.05)"
                        },
                        px: 3
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
                  sx={{
                    bgcolor: "#1e1e1e",
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #444"
                  }}
                >
                  <Typography variant="h6" fontWeight="500">
                    {viewingProfile.displayName}
                  </Typography>
                  {isOwnProfile && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit2 size={16} />}
                      onClick={() => setIsEditing(true)}
                      sx={{
                        color: "white",
                        borderColor: "#888",
                        "&:hover": { 
                          borderColor: "#E03FD8", 
                          color: "#E03FD8",
                          bgcolor: "rgba(224, 63, 216, 0.1)"
                        },
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
              )}
            </Box>

            {/* Email Section */}
            <Box mb={4}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Mail size={20} color="#E03FD8" />
                <Typography variant="h6" fontWeight="600">
                  Email Address
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "#1e1e1e",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #444"
                }}
              >
                <Typography variant="body1" fontSize="1.1rem">
                  {viewingProfile.email}
                </Typography>
              </Box>
            </Box>

            {/* Provider Section */}
            <Box mb={4}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Key size={20} color="#E03FD8" />
                <Typography variant="h6" fontWeight="600">
                  Authentication Provider
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "#1e1e1e",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #444",
                  display: "flex",
                  alignItems: "center",
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: providerInfo.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold"
                  }}
                >
                  {providerInfo.label[0]}
                </Box>
                <Typography variant="body1" fontSize="1.1rem" sx={{ textTransform: "capitalize" }}>
                  {providerInfo.label}
                </Typography>
              </Box>
            </Box>

            {/* Member Since Section */}
            <Box mb={4}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Calendar size={20} color="#E03FD8" />
                <Typography variant="h6" fontWeight="600">
                  Member Since
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "#1e1e1e",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #444"
                }}
              >
                <Typography variant="body1" fontSize="1.1rem">
                  {formatMemberSince(viewingProfile.created_at)}
                </Typography>
              </Box>
            </Box>

            {/* Stats Section (Placeholder for future features) */}
            {isOwnProfile && (
              <Box>
                <Divider sx={{ bgcolor: "#444", mb: 3 }} />
                <Typography variant="h6" fontWeight="600" mb={3}>
                  Your Stats
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      sx={{
                        bgcolor: "#1e1e1e",
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #444",
                        textAlign: "center"
                      }}
                    >
                      <Music size={24} color="#E03FD8" style={{ marginBottom: 8 }} />
                      <Typography variant="h4" fontWeight="bold" color="#E03FD8">
                        0
                      </Typography>
                      <Typography variant="body2" color="#888">
                        Tracks Played
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      sx={{
                        bgcolor: "#1e1e1e",
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #444",
                        textAlign: "center"
                      }}
                    >
                      <Clock size={24} color="#8B5CF6" style={{ marginBottom: 8 }} />
                      <Typography variant="h4" fontWeight="bold" color="#8B5CF6">
                        0h
                      </Typography>
                      <Typography variant="body2" color="#888">
                        Listening Time
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      sx={{
                        bgcolor: "#1e1e1e",
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #444",
                        textAlign: "center"
                      }}
                    >
                      <TrendingUp size={24} color="#10b981" style={{ marginBottom: 8 }} />
                      <Typography variant="h4" fontWeight="bold" color="#10b981">
                        0
                      </Typography>
                      <Typography variant="body2" color="#888">
                        Searches
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                <Typography variant="caption" color="#666" display="block" mt={2} textAlign="center">
                  Stats coming soon! Start using TUTTi to see your activity.
                </Typography>
              </Box>
            )}

            {/* Update Messages */}
            {updateError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 3,
                  bgcolor: "#3d1a1a",
                  color: "#ff6b6b",
                  "& .MuiAlert-icon": { color: "#ff6b6b" }
                }}
              >
                {updateError}
              </Alert>
            )}
            {updateSuccess && (
              <Alert 
                severity="success" 
                sx={{ 
                  mt: 3,
                  bgcolor: "#1a3d1a",
                  color: "#51cf66",
                  "& .MuiAlert-icon": { color: "#51cf66" }
                }}
              >
                {updateSuccess}
              </Alert>
            )}
          </Box>
        ) : (
          <Box textAlign="center" py={6}>
            <UserIcon size={64} color="#666" style={{ marginBottom: 16 }} />
            <Typography variant="h6" mb={2}>
              {isOwnProfile ? "Profile not found" : "User profile not found"}
            </Typography>
            <Typography variant="body2" color="#888">
              {isOwnProfile 
                ? "Please try signing in again." 
                : "This user may not exist or their profile is unavailable."}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}