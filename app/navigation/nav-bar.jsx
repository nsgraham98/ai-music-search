"use client";
import { useRouter, usePathname } from "next/navigation";
import { Box, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import { useUserAuth } from "@/context/auth-context";
import { LogoutButton } from "@/app/components/login/logout-button";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserAuth();

  const navItems = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    {
      label: "Profile",
      path: user ? `/user/${user.uid}` : "/user",
      icon: <PersonIcon />,
    },
    { label: "Playlists", path: "/playlists", icon: <PlaylistPlayIcon /> },
    { label: "Game Room", path: "/sound-room", icon: <SportsEsportsIcon /> },
    { label: "Settings", path: "/settings", icon: <SettingsIcon /> },
  ];

  // Check if current path is any user profile path
  const isProfileActive = pathname?.startsWith("/user/");

  const handleNavigation = (path) => {
    console.log("Navigating to:", path);
    console.log("Current user:", user);
    router.push(path);
  };

  return (
    <Box
      sx={{
        bgcolor: "#2e2d2d",
        borderRadius: 2,
        p: 1.5,
        mb: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        border: "1px solid #444",
        transition: "border-color 0.3s",
        "&:hover": {
          borderColor: "#888",
        },
      }}
    >
      {/* Navigation Buttons */}
      {navItems.map((item) => {
        const isActive =
          item.label === "Profile" ? isProfileActive : pathname === item.path;

        return (
          <Button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            startIcon={item.icon}
            variant={isActive ? "contained" : "outlined"}
            sx={{
              color: isActive ? "white" : "#888",
              borderColor: isActive ? "#E03FD8" : "#444",
              bgcolor: isActive ? "#E03FD8" : "transparent",
              "&:hover": {
                bgcolor: isActive ? "#c133b9" : "#3a3a3a",
                borderColor: isActive ? "#c133b9" : "#888",
                transform: "translateY(-2px)",
                boxShadow: isActive
                  ? "0 4px 12px rgba(224, 63, 216, 0.4)"
                  : "0 2px 8px rgba(0, 0, 0, 0.3)",
              },
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: isActive ? "bold" : "normal",
              px: 2.5,
              py: 1,
              transition: "all 0.2s",
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: 0,
            }}
          >
            {item.label}
          </Button>
        );
      })}

      {/* Logout Button */}
      <Box sx={{ flexShrink: 0 }}>
        <LogoutButton
          sx={{
            "&:hover": {
              bgcolor: "#d32f2f",
              borderColor: "#d32f2f",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(211, 47, 47, 0.4)",
            },
          }}
        />
      </Box>
    </Box>
  );
}
