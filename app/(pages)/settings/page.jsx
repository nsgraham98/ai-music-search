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
import UsernameEditor from "@/app/components/settings/username-editor";
import Logout from "@/app/components/settings/logout";
import DarkLightMode from "@/app/components/settings/dark-lightmode";
import ColorblindSelector from "@/app/components/settings/colorblind-selector";
import HighContrast from "@/app/components/settings/high-contrast-toggle";
import ReducedMotionToggle from "@/app/components/settings/reduced-motion-toggle";
import ColorblindFilters from "@/app/components/settings/colorblind-filters";
import SettingsSection from "@/app/components/settings/settings-section";

// Import CSS
import "@/styles/accessibility.css";

export default function SettingsPage() {
  const { user, logout } = useUserAuth();
  const { userProfile, loadingProfile, updateDisplayName } = useUserProfile();
  const router = useRouter();

  // Success message state
  const [usernameSuccess, setUsernameSuccess] = useState("");

  // Theme state
  const [darkMode, setDarkMode] = useState(true);

  // Accessibility state
  const [colorblindMode, setColorblindMode] = useState("none");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

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
    const result = await updateDisplayName(newUsername);

    if (result.success) {
      setUsernameSuccess("Username updated successfully!");
      setTimeout(() => setUsernameSuccess(""), 3000);
    }

    return result;
  };

  // Handle logout with actual functionality
  const handleLogout = async () => {
    try {
      await logout();
      // Clear all settings from localStorage
      localStorage.removeItem("darkMode");
      localStorage.removeItem("colorblindMode");
      localStorage.removeItem("highContrast");
      localStorage.removeItem("reducedMotion");
      // Redirect to login or home page
      router.push("/login");
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
          <UsernameEditor
            currentUsername={userProfile?.displayName || ""}
            onUpdate={handleUsernameUpdate}
          />
          <Logout onLogout={handleLogout} />
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

        {/* Success Message */}
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
