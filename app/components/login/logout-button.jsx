// The logout button component that signs the user out of Firebase
// uses auth-context.jsx for the sign-out function

"use client";

import { Button } from "@mui/material";
import { useUserAuth } from "/context/auth-context";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  // Use the useUserAuth hook to get the user object and the login and logout functions
  const { firebaseSignOut } = useUserAuth();
  const router = useRouter();

  // Sign out of Firebase
  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      router.push("/"); // Redirect to home page after logout
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
