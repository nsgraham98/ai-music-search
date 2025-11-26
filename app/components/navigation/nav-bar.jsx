// nav-bar.jsx
"use client";
import { Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import { useUserAuth } from "@/context/auth-context";
import { NavButton } from "./nav-button";

export default function Navigation() {
  const { authUser } = useUserAuth();

  const profilePath = authUser ? `/user/${authUser.uid}` : "/user";
  const playlistsPath = authUser ? `/user/${authUser.uid}/playlists` : "/";
  const soundRoomPath = authUser ? `/sound-room` : "/";
  const settingsPath = authUser ? `/settings` : "/";

  // Profile: /user/[id] but NOT /user/[id]/playlists etc.
  const isProfileActive = (pathname) =>
    pathname?.startsWith("/user/") && pathname.split("/").length === 3;

  // Playlists: any nested playlists route
  const isPlaylistsActive = (pathname) =>
    authUser ? pathname?.startsWith(`/user/${authUser.uid}/playlists`) : false;

  // Sound room: any nested sound-room route
  const isSoundRoomActive = (pathname) => pathname?.startsWith("/sound-room");

  // Settings: any nested settings route
  const isSettingsActive = (pathname) => pathname?.startsWith("/settings");

  const navItems = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    {
      label: "Profile",
      path: profilePath,
      icon: <PersonIcon />,
      isActiveOverride: isProfileActive,
    },
    {
      label: "Playlists",
      path: playlistsPath,
      icon: <PlaylistPlayIcon />,
      isActiveOverride: isPlaylistsActive,
    },
    {
      label: "The Sound Room",
      path: soundRoomPath,
      icon: <SportsEsportsIcon />,
      isActiveOverride: isSoundRoomActive,
    },
    {
      label: "Settings",
      path: settingsPath,
      icon: <SettingsIcon />,
      isActiveOverride: isSettingsActive,
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "#2e2d2d",
        borderRadius: 2,
        p: 1.5,
        mb: 3,
        display: "flex",
        justifyContent: "center",
        gap: 2,
        flexWrap: "wrap",
        border: "1px solid #444",
        transition: "border-color 0.3s",
        "&:hover": {
          borderColor: "#888",
        },
      }}
    >
      {navItems.map((item) => (
        <NavButton
          key={item.label}
          href={item.path}
          label={item.label}
          icon={item.icon}
          isActiveOverride={item.isActiveOverride}
        />
      ))}
    </Box>
  );
}
