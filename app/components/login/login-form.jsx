// The login form component with buttons for GitHub, Google, and Facebook sign-in
// enclosed in login-popup.jsx
// uses auth-context.jsx for authentication functions

"use client";

import { Button, Box, Stack } from "@mui/material";
import { useUserAuth } from "/context/auth-context";

export function LoginForm() {
  const { gitHubSignIn, googleSignIn, facebookSignIn } = useUserAuth(); // get sign-in functions from context

  // Handlers for button clicks
  // Each handler calls the corresponding sign-in function (in auth-context) and catches errors
  const handleGitHubSignIn = async () => {
    try {
      await gitHubSignIn();
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };
  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn();
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
    }
  };

  return (
    <Stack spacing={2} width="100%" maxWidth={300}>
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#24292e",
          "&:hover": { backgroundColor: "#1b1f23" },
        }}
        onClick={handleGitHubSignIn}
      >
        Sign in with GitHub
      </Button>
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#4285F4",
          "&:hover": { backgroundColor: "#1e498f" },
        }}
        onClick={handleGoogleSignIn}
      >
        Sign in with Google
      </Button>
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#4285F4",
          "&:hover": { backgroundColor: "#1e498f" },
        }}
        onClick={handleFacebookSignIn}
      >
        Sign in with Facebook
      </Button>
    </Stack>
  );
}
