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
      color="secondary"
      sx={{
        color: "white",
        borderColor: "#888",
        "&:hover": {
          borderColor: "#E03FD8",
          color: "#E03FD8",
        },
      }}
    >
      Logout
    </Button>
  );
}
