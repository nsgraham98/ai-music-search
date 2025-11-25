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

  const profilePath = authUser ? `/user/${authUser.uid}` : "/user"; // Redirect to generic user page if not logged in
  const playlistsPath = authUser ? `/user/${authUser.uid}/playlists` : "/"; // Redirect to home if not logged in

  const isProfileActive = (pathname) =>
    pathname?.startsWith("/user/") && pathname.split("/").length === 3;

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
    },
    {
      label: "The Sound Room",
      path: "/sound-room",
      icon: <SportsEsportsIcon />,
    },
    { label: "Settings", path: "/settings", icon: <SettingsIcon /> },
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
