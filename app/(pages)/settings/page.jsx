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
  Switch,
  FormControlLabel,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SignedInAs from "@/app/components/login/signed-in-as";
import LoginPopup from "@/app/components/login/login-popup";
import Navigation from "@/app/components/navigation/nav-bar";
import { useUserAuth } from "@/context/auth-context";
import { useUserProfile } from "@/context/user-profile-context";
import { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import PaletteIcon from "@mui/icons-material/Palette";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import Logout from "@/app/components/settings/logout";
import DarkLightMode from "@/app/components/settings/dark-lightmode";
import ColourblindSelector from "@/app/components/settings/colourblind-selector";
import HighContrastToggle from "@/app/components/settings/high-contrast-toggle";
import ReducedMotionToggle from "@/app/components/settings/reduced-motion-toggle";

export default function SettingsPage() {
  const { user } = useUserAuth();
  const { userProfile, loadingProfile, updateDisplayName } = useUserProfile();

  // Username state
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState("");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  // Theme state
  const [darkMode, setDarkMode] = useState(true);

  // Accessibility state
  const [colorblindMode, setColorblindMode] = useState("none");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setNewUsername(userProfile.displayName || "");
    }
  }, [userProfile]);

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      setUsernameError("Username cannot be empty");
      return;
    }

    setIsUpdatingUsername(true);
    setUsernameError("");
    setUsernameSuccess("");

    const result = await updateDisplayName(newUsername);

    if (result.success) {
      setUsernameSuccess("Username updated successfully!");
      setIsEditingUsername(false);
      setTimeout(() => setUsernameSuccess(""), 3000);
    } else {
      setUsernameError(result.error || "Failed to update username");
    }

    setIsUpdatingUsername(false);
  };

  const handleCancelUsername = () => {
    setIsEditingUsername(false);
    setNewUsername(userProfile?.displayName || "");
    setUsernameError("");
  };

  if (loadingProfile) {
    return (
      <Container maxWidth="lg">
        <LoginPopup />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress sx={{ color: "#E03FD8" }} />
        </Box>
      </Container>
    );
  }

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
        <Typography variant="h4" fontWeight="bold">
          TUTTi.
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <SignedInAs />
          <LogoutButton />
        </Box>
      </Box>

      {/* Navigation */}
      <Navigation />

      {/* Settings Content */}
      <Box
        component={Paper}
        elevation={4}
        sx={{
          bgcolor: "#2e2d2d",
          color: "white",
          width: "100%",
          maxWidth: "800px",
          mx: "auto",
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          border: "1px solid #444",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Settings
        </Typography>

        {/* Account Settings Section */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <PersonIcon sx={{ color: "#E03FD8" }} />
            <Typography variant="h6" fontWeight="bold">
              Account Settings
            </Typography>
          </Box>

          {/* Username */}
          <Box
            sx={{
              bgcolor: "#3a3a3a",
              p: 3,
              borderRadius: 2,
              border: "1px solid #444",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Username
            </Typography>
            {isEditingUsername ? (
              <Box>
                <TextField
                  fullWidth
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  variant="outlined"
                  placeholder="Enter new username"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      bgcolor: "#2e2d2d",
                      "& fieldset": { borderColor: "#444" },
                      "&:hover fieldset": { borderColor: "#888" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#E03FD8",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    onClick={handleSaveUsername}
                    disabled={isUpdatingUsername}
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
                    {isUpdatingUsername ? (
                      <CircularProgress size={20} />
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancelUsername}
                    disabled={isUpdatingUsername}
                    sx={{
                      color: "#888",
                      borderColor: "#444",
                      "&:hover": {
                        borderColor: "#888",
                        bgcolor: "#2e2d2d",
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
                  {userProfile?.displayName}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsEditingUsername(true)}
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
              </Box>
            )}
          </Box>

          {/* Logout */}
          <Box
            sx={{
              bgcolor: "#3a3a3a",
              p: 3,
              borderRadius: 2,
              border: "1px solid #444",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                  Log Out
                </Typography>
                <Typography variant="body2" color="#888">
                  Sign out of your account
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<LogoutIcon />}
                sx={{
                  bgcolor: "#d32f2f",
                  "&:hover": {
                    bgcolor: "#b71c1c",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(211, 47, 47, 0.4)",
                  },
                  transition: "all 0.2s",
                  fontWeight: "bold",
                }}
              >
                Log Out
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#444", my: 4 }} />

        {/* Appearance Section */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <PaletteIcon sx={{ color: "#E03FD8" }} />
            <Typography variant="h6" fontWeight="bold">
              Appearance
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "#3a3a3a",
              p: 3,
              borderRadius: 2,
              border: "1px solid #444",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                  Dark Mode
                </Typography>
                <Typography variant="body2" color="#888">
                  Toggle between light and dark theme
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#E03FD8",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          bgcolor: "#E03FD8",
                        },
                    }}
                  />
                }
                label=""
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#444", my: 4 }} />

        {/* Accessibility Section */}
        <Box mb={2}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <AccessibilityNewIcon sx={{ color: "#E03FD8" }} />
            <Typography variant="h6" fontWeight="bold">
              Accessibility
            </Typography>
          </Box>

          {/* Colorblind Mode */}
          <Box
            sx={{
              bgcolor: "#3a3a3a",
              p: 3,
              borderRadius: 2,
              border: "1px solid #444",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Colorblind Mode
            </Typography>
            <Typography variant="body2" color="#888" mb={2}>
              Adjust colors for better visibility
            </Typography>
            <FormControl fullWidth>
              <Select
                value={colorblindMode}
                onChange={(e) => setColorblindMode(e.target.value)}
                sx={{
                  color: "white",
                  bgcolor: "#2e2d2d",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#888",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#E03FD8",
                  },
                  "& .MuiSvgIcon-root": { color: "#888" },
                }}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="protanopia">Protanopia (Red-Blind)</MenuItem>
                <MenuItem value="deuteranopia">
                  Deuteranopia (Green-Blind)
                </MenuItem>
                <MenuItem value="tritanopia">Tritanopia (Blue-Blind)</MenuItem>
                <MenuItem value="monochromacy">Monochromacy</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* High Contrast */}
          <Box
            sx={{
              bgcolor: "#3a3a3a",
              p: 3,
              borderRadius: 2,
              border: "1px solid #444",
              mb: 2,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                  High Contrast
                </Typography>
                <Typography variant="body2" color="#888">
                  Increase contrast for better readability
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#E03FD8",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          bgcolor: "#E03FD8",
                        },
                    }}
                  />
                }
                label=""
              />
            </Box>
          </Box>

          {/* Reduced Motion */}
          <Box
            sx={{
              bgcolor: "#3a3a3a",
              p: 3,
              borderRadius: 2,
              border: "1px solid #444",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                  Reduce Motion
                </Typography>
                <Typography variant="body2" color="#888">
                  Minimize animations and transitions
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#E03FD8",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          bgcolor: "#E03FD8",
                        },
                    }}
                  />
                }
                label=""
              />
            </Box>
          </Box>
        </Box>

        {/* Status Messages */}
        {usernameError && (
          <Alert
            severity="error"
            sx={{ mt: 3, bgcolor: "#3d1a1a", color: "#ff6b6b" }}
          >
            {usernameError}
          </Alert>
        )}
        {usernameSuccess && (
          <Alert
            severity="success"
            sx={{ mt: 3, bgcolor: "#1a3d1a", color: "#69ff6b" }}
          >
            {usernameSuccess}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
