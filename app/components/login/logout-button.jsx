"use client";

import { Button } from "@mui/material";
import { useUserAuth } from "/context/auth-context";

export function LogoutButton() {
  // Use the useUserAuth hook to get the user object and the login and logout functions
  const { firebaseSignOut } = useUserAuth();

  // Sign out of Firebase
  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="outlined"
      size="medium"
      sx={{
        color: "white",
        borderColor: "#888",
        transition: "all 0.1s ease-in-out",
        "&:hover": {
          color: "#E03FD8",
          borderColor: "#E03FD8",
        },
        "& .MuiButton-label": {
          transition: "inherit",
        },
      }}
    >
      Logout
    </Button>
  );
}
