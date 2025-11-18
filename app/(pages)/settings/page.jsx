"use client";

import { LogoutButton } from "@/app/components/login/logout-button";
import {
  Box,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Button,
} from "@mui/material";
import SignedInAs from "@/app/components/login/signed-in-as";
import LoginPopup from "@/app/components/login/login-popup";
import Navigation from "@/app/components/navigation/nav-bar";
import { useUserAuth } from "@/context/auth-context";
import { useUserProfile } from "@/context/user-profile-context";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PersonIcon from "@mui/icons-material/Person";
import PaletteIcon from "@mui/icons-material/Palette";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import UsernameEditor from "@/app/components/settings/username-editor";
import Logout from "@/app/components/settings/logout";
import DarkLightMode from "@/app/components/settings/dark-lightmode";
import ColorblindSelector from "@/app/components/settings/colorblind-selector";
import HighContrast from "@/app/components/settings/high-contrast-toggle";
import ReducedMotionToggle from "@/app/components/settings/reduced-motion-toggle";
import ColorblindFilters from "@/app/components/settings/colorblind-filters";
import SettingsSection from "@/app/components/settings/settings-section";
import ProfilePictureSelector from "@/app/components/profile/profile-picture-selector";
import SpotifyConnectButton from "@/app/components/spotify/spotify-connect-button";
import "@/styles/accessibility.css";

export default function SettingsPage() {
  const { authUser, firebaseSignOut } = useUserAuth();
  const { userProfile, loadingProfile, updateUserProfile } = useUserProfile();
  const router = useRouter();

  // Success message state
  const [usernameSuccess, setUsernameSuccess] = useState("");
  const [avatarSuccess, setAvatarSuccess] = useState("");

  // Theme state
  const [darkMode, setDarkMode] = useState(true);

  // Accessibility state
  const [colorblindMode, setColorblindMode] = useState("none");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Profile picture state
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

  // Spotify state
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [checkingSpotify, setCheckingSpotify] = useState(true);

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDarkMode = localStorage.getItem("darkMode");
      const savedColorblind = localStorage.getItem("colorblindMode");
      const savedHighContrast = localStorage.getItem("highContrast");
      const savedReducedMotion = localStorage.getItem("reducedMotion");
      if (savedDarkMode !== null) {
        const isDark = savedDarkMode === "true";
        setDarkMode(isDark);
        applyDarkMode(isDark);
      }
      if (savedColorblind) {
        setColorblindMode(savedColorblind);
        applyColorblindMode(savedColorblind);
      }
      if (savedHighContrast !== null) {
        const isEnabled = savedHighContrast === "true";
        setHighContrast(isEnabled);
        applyHighContrast(isEnabled);
      }
      if (savedReducedMotion !== null) {
        const isEnabled = savedReducedMotion === "true";
        setReducedMotion(isEnabled);
        applyReducedMotion(isEnabled);
      }
    }
  }, []);

  // Check Spotify connection status
  useEffect(() => {
    const checkSpotifyConnection = async () => {
      if (!authUser) return;

      try {
        setCheckingSpotify(true);
        const response = await fetch("/api/spotify/status", {
          credentials: "include",
        });
        const data = await response.json();
        setSpotifyConnected(data.connected);
      } catch (error) {
        console.error("Error checking Spotify connection:", error);
      } finally {
        setCheckingSpotify(false);
      }
    };

    if (authUser) {
      checkSpotifyConnection();
    }
  }, [authUser]);

  // Apply dark mode to DOM
  const applyDarkMode = (isDark) => {
    if (typeof window !== "undefined") {
      if (isDark) {
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-mode");
        document.documentElement.style.setProperty(
          "--background-color",
          "#1a1a1a"
        );
        document.documentElement.style.setProperty("--text-color", "#ffffff");
      } else {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
        document.documentElement.style.setProperty(
          "--background-color",
          "#ffffff"
        );
        document.documentElement.style.setProperty("--text-color", "#000000");
      }
    }
  };

  // Apply colorblind mode to DOM
  const applyColorblindMode = (mode) => {
    if (typeof window !== "undefined") {
      document.body.setAttribute("data-colorblind-mode", mode);
    }
  };

  // Apply high contrast to DOM
  const applyHighContrast = (enabled) => {
    if (typeof window !== "undefined") {
      if (enabled) {
        document.body.classList.add("high-contrast");
      } else {
        document.body.classList.remove("high-contrast");
      }
    }
  };

  // Apply reduced motion to DOM
  const applyReducedMotion = (enabled) => {
    if (typeof window !== "undefined") {
      if (enabled) {
        document.body.classList.add("reduced-motion");
      } else {
        document.body.classList.remove("reduced-motion");
      }
    }
  };

  // Handle username update
  const handleUsernameUpdate = async (newUsername) => {
    const result = await updateUserProfile({ displayName: newUsername });

    if (result.success) {
      setUsernameSuccess("Username updated successfully!");
      setTimeout(() => setUsernameSuccess(""), 3000);
    }

    return result;
  };

  // Handle profile picture selection
  const handleAvatarSelect = async (avatar) => {
    try {
      const result = await updateUserProfile({ avatar: avatar });

      if (result.success) {
        setAvatarSuccess("Profile picture updated successfully!");
        setTimeout(() => setAvatarSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  // Handle logout with actual functionality
  const handleLogout = async () => {
    try {
      await firebaseSignOut();
      // Clear all settings from localStorage
      localStorage.removeItem("darkMode");
      localStorage.removeItem("colorblindMode");
      localStorage.removeItem("highContrast");
      localStorage.removeItem("reducedMotion");
      // Redirect to login or home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle dark mode toggle with actual functionality
  const handleDarkModeToggle = (isDark) => {
    setDarkMode(isDark);
    localStorage.setItem("darkMode", isDark.toString());
    applyDarkMode(isDark);
  };

  // Handle colorblind mode change with actual functionality
  const handleColorblindModeChange = (mode) => {
    setColorblindMode(mode);
    localStorage.setItem("colorblindMode", mode);
    applyColorblindMode(mode);
  };

  // Handle high contrast toggle with actual functionality
  const handleHighContrastToggle = (enabled) => {
    setHighContrast(enabled);
    localStorage.setItem("highContrast", enabled.toString());
    applyHighContrast(enabled);
  };

  // Handle reduced motion toggle with actual functionality
  const handleReducedMotionToggle = (enabled) => {
    setReducedMotion(enabled);
    localStorage.setItem("reducedMotion", enabled.toString());
    applyReducedMotion(enabled);
  };

  // Get avatar display
  const getAvatarDisplay = () => {
    if (!userProfile?.avatar) {
      return {
        sx: { width: 80, height: 80, bgcolor: "#E03FD8", fontSize: "2rem" },
        children: userProfile?.displayName?.[0]?.toUpperCase() || "?",
      };
    }

    if (userProfile.avatar.type === "default") {
      return {
        sx: {
          width: 80,
          height: 80,
          bgcolor: userProfile.avatar.data.color,
          fontSize: "2.5rem",
        },
        children: userProfile.avatar.data.emoji,
      };
    }

    // Custom uploaded image
    return {
      src: userProfile.avatar.data,
      sx: { width: 80, height: 80 },
    };
  };

  if (loadingProfile) {
    return (
      <Container maxWidth="lg">
        <LoginPopup />
        <ColorblindFilters />
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
      <ColorblindFilters />

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
        <SettingsSection
          icon={<PersonIcon sx={{ color: "#E03FD8" }} />}
          title="Account Settings"
        >
          {/* Profile Picture */}
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
              Profile Picture
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar {...getAvatarDisplay()} />
              <Button
                variant="outlined"
                onClick={() => setAvatarDialogOpen(true)}
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
                Change Picture
              </Button>
            </Box>
          </Box>

          <UsernameEditor
            currentUsername={userProfile?.displayName || ""}
            onUpdate={handleUsernameUpdate}
          />
          <Logout onLogout={handleLogout} />
        </SettingsSection>

        <Divider sx={{ borderColor: "#444", my: 4 }} />

        {/* Music Services Section */}
        <SettingsSection
          icon={<MusicNoteIcon sx={{ color: "#E03FD8" }} />}
          title="Music Services"
        >
          <Box
            sx={{
              bgcolor: "#3a3a3a",
              p: 3,
              borderRadius: 2,
              border: "1px solid #444",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Spotify Integration
            </Typography>
            {checkingSpotify ? (
              <CircularProgress size={24} sx={{ color: "#E03FD8" }} />
            ) : (
              <SpotifyConnectButton isConnected={spotifyConnected} />
            )}
          </Box>
        </SettingsSection>

        <Divider sx={{ borderColor: "#444", my: 4 }} />

        {/* Appearance Section */}
        <SettingsSection
          icon={<PaletteIcon sx={{ color: "#E03FD8" }} />}
          title="Appearance"
        >
          <DarkLightMode darkMode={darkMode} onToggle={handleDarkModeToggle} />
        </SettingsSection>

        <Divider sx={{ borderColor: "#444", my: 4 }} />

        {/* Accessibility Section */}
        <SettingsSection
          icon={<AccessibilityNewIcon sx={{ color: "#E03FD8" }} />}
          title="Accessibility"
        >
          <ColorblindSelector
            mode={colorblindMode}
            onChange={handleColorblindModeChange}
          />
          <HighContrast
            enabled={highContrast}
            onToggle={handleHighContrastToggle}
          />
          <ReducedMotionToggle
            enabled={reducedMotion}
            onToggle={handleReducedMotionToggle}
          />
        </SettingsSection>

        {/* Success Messages */}
        {usernameSuccess && (
          <Alert
            severity="success"
            sx={{ mt: 3, bgcolor: "#1a3d1a", color: "#69ff6b" }}
          >
            {usernameSuccess}
          </Alert>
        )}
        {avatarSuccess && (
          <Alert
            severity="success"
            sx={{ mt: 3, bgcolor: "#1a3d1a", color: "#69ff6b" }}
          >
            {avatarSuccess}
          </Alert>
        )}
      </Box>

      {/* Profile Picture Selector Dialog */}
      <ProfilePictureSelector
        open={avatarDialogOpen}
        onClose={() => setAvatarDialogOpen(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={userProfile?.avatar}
      />
    </Container>
  );
}
